import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Midtrans from 'midtrans-client';

// KONFIGURASI MIDTRANS
// Pastikan Client Key & Server Key sesuai dashboard Midtrans Anda
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-UXjtA4DxG241QAOX5xQJsZIY',
  clientKey: 'SB-Mid-client-0EocBOEFNi15it07'
});

export async function POST(req: Request) {
  try {
    const { sku_code, product_name, customer_no, amount } = await req.json();

    // 1. Buat Order ID Unik
    // Format: TRX-TIMESTAMP-RANDOM
    const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // === BAGIAN DATABASE (ANTI CRASH) ===
    // Kita bungkus ini biar kalau tabel belum ada, App TIDAK ERROR 500
    try {
      await prisma.transaction.create({
        data: {
          order_id: orderId,
          customer_no: customer_no,
          sku_code: sku_code,
          product_name: product_name,
          price_cost: amount - 2500, // Estimasi modal
          price_sell: amount,
          payment_status: 'PENDING',
          delivery_status: 'WAITING'
        }
      });
      console.log("✅ Database: Transaksi tersimpan.");
    } catch (dbError) {
      // Kalau error (misal tabel belum ada), kita LOG saja, jangan stop prosesnya
      console.error("⚠️ Database Error (Diabaikan agar user bisa tetap bayar):", dbError);
    }

    // === BAGIAN MIDTRANS (WAJIB JALAN) ===
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
        name: product_name ? product_name.substring(0, 50) : "Produk"
      }]
    };

    const midtransToken = await snap.createTransaction(parameter);

    // Kembalikan token ke frontend
    return NextResponse.json({ 
      token: midtransToken.token,
      order_id: orderId 
    });

  } catch (error) {
    console.error("❌ Critical Error:", error);
    return NextResponse.json({ error: "Gagal memproses transaksi" }, { status: 500 });
  }
}
