import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  const username = "joxawigOEOBD";
  const apiKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  const signature = crypto.createHash('md5').update(username + apiKey + "pricelist").digest('hex');

  // MARGIN KEUNTUNGAN (Bisa diatur sesuka hati)
  const MARGIN = 2000; // Untung Rp 2.000 per transaksi

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/price-list', {
      cmd: 'prepaid',
      username: username,
      sign: signature
    });

    const allProducts = response.data.data;
    
    // Filter Pulsa & Tambah Margin
    const pulsaProducts = allProducts
      .filter((item: any) => 
        item.category === "Pulsa" && 
        item.buyer_product_status === true && 
        item.seller_product_status === true
      )
      .map((item: any) => ({
        ...item,
        price_sell: item.price + MARGIN, // Harga Jual = Harga Modal + 2000
        price_cost: item.price           // Simpan harga asli (opsional, jangan dikirim ke frontend kalau mau rahasia)
      }))
      .sort((a: any, b: any) => a.price - b.price); // Urutkan termurah

    return NextResponse.json({ data: pulsaProducts });

  } catch (error) {
    console.error("Error API Digiflazz:", error);
    // DATA DUMMY DENGAN MARKUP
    return NextResponse.json({
      data: [
        { product_name: "Telkomsel 5.000", buyer_sku_code: "tsel5", price: 5400 + MARGIN, price_sell: 5400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
        { product_name: "Telkomsel 10.000", buyer_sku_code: "tsel10", price: 10500 + MARGIN, price_sell: 10500 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
        { product_name: "XL 10.000", buyer_sku_code: "xl10", price: 10800 + MARGIN, price_sell: 10800 + MARGIN, brand: "XL", desc: "Pulsa Reguler" },
      ]
    });
  }
}
