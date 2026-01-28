import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Wajib import ini
import Midtrans from 'midtrans-client';

// Setup Midtrans
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-UXjtA4DxG241QAOX5xQJsZIY', // Ganti dengan Env jika sudah siap
  clientKey: 'SB-Mid-client-0EocBOEFNi15it07'
});

export async function POST(req: Request) {
  try {
    const { sku_code, product_name, customer_no, amount } = await req.json();

    // 1. Buat Order ID Unik
    const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    console.log("Mulai Transaksi:", orderId);

    // 2. SIMPAN KE DATABASE (BAGIAN INI YANG KEMARIN MATI, SEKARANG HIDUP)
    try {
      await prisma.transaction.create({
        data: {
          id: crypto.randomUUID(), // Generate ID manual biar aman
          order_id: orderId,
          customer_no: customer_no,
          sku_code: sku_code,
          product_name: product_name,
          price_sell: amount,
          price_cost: amount - 2500, // Estimasi untung
          payment_status: 'PENDING',
          delivery_status: 'WAITING',
          updated_at: new Date() // Isi manual biar tidak error
        }
      });
      console.log("✅ Berhasil simpan ke Supabase");
    } catch (dbError) {
      console.error("❌ Gagal simpan ke Database:", dbError);
      // Kita throw error agar ketahuan kalau database bermasalah
      // return NextResponse.json({ error: "Database Error" }, { status: 500 });
      
      // ATAU: Tetap lanjut ke Midtrans meski DB gagal (Opsional, tapi berisiko data hilang)
    }

    // 3. Request ke Midtrans
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
        name: product_name ? product_name.substring(0, 50) : "Produk Digital"
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ 
      token: transaction.token,
      order_id: orderId 
    });

  } catch (error) {
    console.error("Critical Error:", error);
    return NextResponse.json({ error: "Gagal memproses transaksi" }, { status: 500 });
  }
}
