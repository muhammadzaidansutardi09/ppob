import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

// Konfigurasi Midtrans
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-UXjtA4DxG241QAOX5xQJsZIY', // Pastikan Server Key benar
  clientKey: 'SB-Mid-client-0EocBOEFNi15it07'
});

export async function POST(req: Request) {
  try {
    const { sku_code, product_name, customer_no, amount } = await req.json();

    // 1. Buat Order ID Unik
    // Kita pakai timestamp biar unik
    const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    console.log("Meminta Token Midtrans untuk Order:", orderId);

    // 2. Siapkan Parameter Midtrans
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

    // 3. Minta Token (Tanpa simpan ke Database)
    const transaction = await snap.createTransaction(parameter);

    // 4. Kirim Token & Order ID ke Frontend
    // Nanti Frontend yang bertugas menyimpan data ke LocalStorage
    return NextResponse.json({ 
      token: transaction.token,
      order_id: orderId 
    });

  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: "Gagal koneksi ke Midtrans" }, { status: 500 });
  }
}
