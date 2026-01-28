import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  const username = "joxawigOEOBD";
  const apiKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  const signature = crypto.createHash('md5').update(username + apiKey + "pricelist").digest('hex');

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/price-list', {
      cmd: 'prepaid',
      username: username,
      sign: signature
    });

    // Filter: Kita hanya mau ambil yang kategorinya "Pulsa"
    const allProducts = response.data.data;
    const pulsaProducts = allProducts.filter((item: any) => 
      item.category === "Pulsa" && item.buyer_product_status === true && item.seller_product_status === true
    );

    return NextResponse.json({ data: pulsaProducts });

  } catch (error) {
    console.error("Gagal ambil produk Digiflazz (Mungkin IP Blocked):", error);
    
    // === DATA DUMMY (FALLBACK) ===
    // Agar tampilan tetap muncul meski API Error
    return NextResponse.json({
      data: [
        { product_name: "Telkomsel 5.000", buyer_sku_code: "tsel5", price: 5400, brand: "TELKOMSEL", desc: "Pulsa Reguler 5rb" },
        { product_name: "Telkomsel 10.000", buyer_sku_code: "tsel10", price: 10500, brand: "TELKOMSEL", desc: "Pulsa Reguler 10rb" },
        { product_name: "Indosat 5.000", buyer_sku_code: "isat5", price: 5800, brand: "INDOSAT", desc: "Pulsa Reguler 5rb" },
        { product_name: "XL 10.000", buyer_sku_code: "xl10", price: 10800, brand: "XL", desc: "Pulsa Reguler 10rb" },
      ]
    });
  }
}
