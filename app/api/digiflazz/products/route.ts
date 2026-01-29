import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

// Opsional: Jika deploy di Vercel, bisa pakai HttpsProxyAgent jika punya proxy
// import { HttpsProxyAgent } from 'https-proxy-agent'; 

export async function POST() {
  const username = "joxawigOEOBD";
  const apiKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  const signature = crypto.createHash('md5').update(username + apiKey + "pricelist").digest('hex');

  // Markup keuntungan (Rp)
  const MARGIN = 2500; 

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/price-list', {
      cmd: 'prepaid',
      username: username,
      sign: signature
    }, { timeout: 10000 }); // Timeout diperpanjang jadi 10 detik

    const allProducts = response.data.data;
    
    // Filter hanya ambil Pulsa & Token PLN yang aktif
    const pulsaProducts = allProducts
      .filter((item: any) => 
        (item.category.includes("Pulsa") || item.brand.includes("PLN")) && 
        item.buyer_product_status === true && 
        item.seller_product_status === true
      )
      .map((item: any) => ({
        ...item,
        price_sell: item.price + MARGIN, // Tambah Margin
        price_cost: item.price
      }))
      .sort((a: any, b: any) => a.price - b.price);

    // Return Data Real
    return NextResponse.json({ 
        data: pulsaProducts,
        status: 'success'
    });

  } catch (error: any) {
    console.error("Gagal ambil data Digiflazz:", error.message);
    
    // Jika gagal, kembalikan array kosong (bukan dummy)
    // Frontend akan menampilkan "Produk tidak ditemukan"
    return NextResponse.json({ 
        data: [], 
        status: 'error',
        error: error.message
    }, { status: 500 });
  }
}
