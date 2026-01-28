import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

// Gunakan Env Variable agar aman (Sesuai file .env.local yang baru dibuat)
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "", 
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
});

export async function POST(req: Request) {
  try {
    const { sku_code, product_name, customer_no, amount } = await req.json();

    // 1. Buat Order ID Unik
    const orderId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    console.log("Memproses Order:", orderId);

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

    // 3. Minta Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);

    // 4. Balikin Token ke Frontend
    return NextResponse.json({ 
      token: transaction.token,
      order_id: orderId 
    });

  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: "Gagal koneksi ke Midtrans" }, { status: 500 });
  }
}
