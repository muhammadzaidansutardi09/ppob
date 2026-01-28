import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Midtrans from 'midtrans-client';

// Konfigurasi Midtrans dari Prompt Anda
const snap = new Midtrans.Snap({
  isProduction: false, // Masih Sandbox
  serverKey: 'SB-Mid-server-UXjtA4DxG241QAOX5xQJsZIY', // Server Key Anda
  clientKey: 'SB-Mid-client-0EocBOEFNi15it07'
});

export async function POST(req: Request) {
  try {
    const { sku_code, product_name, customer_no, amount } = await req.json();

    // 1. Buat Order ID Unik (Contoh: TRX-172782-ABCD)
    const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 2. Simpan Transaksi ke Database (Status: PENDING)
    const transaction = await prisma.transaction.create({
      data: {
        order_id: orderId,
        customer_no: customer_no,
        sku_code: sku_code,
        product_name: product_name,
        price_cost: amount - 2000, // Asumsi margin 2000 (untuk laporan laba)
        price_sell: amount,
        payment_status: 'PENDING',
        delivery_status: 'WAITING'
      }
    });

    // 3. Minta Token ke Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: "User",
        last_name: "PPOB",
        phone: customer_no
      },
      item_details: [{
        id: sku_code,
        price: amount,
        quantity: 1,
        name: product_name.substring(0, 50) // Midtrans batasi nama barang maks 50 char
      }]
    };

    const midtransToken = await snap.createTransaction(parameter);

    return NextResponse.json({ 
      token: midtransToken.token,
      order_id: orderId 
    });

  } catch (error) {
    console.error("Error Transaction:", error);
    return NextResponse.json({ error: "Gagal memproses transaksi" }, { status: 500 });
  }
}
