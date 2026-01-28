import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  const username = "joxawigOEOBD";
  const apiKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  const signature = crypto.createHash('md5').update(username + apiKey + "pricelist").digest('hex');

  const MARGIN = 2500; // Markup keuntungan

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/price-list', {
      cmd: 'prepaid',
      username: username,
      sign: signature
    }, { timeout: 5000 }); // Tambah timeout biar gak kelamaan nunggu kalau error

    const allProducts = response.data.data;
    
    // FILTER LEBIH LONGGAR (Pakai includes biar kena 'Pulsa Reguler' atau 'Pulsa Transfer')
    const pulsaProducts = allProducts
      .filter((item: any) => 
        (item.category.includes("Pulsa") || item.brand.includes("PLN")) && // Ambil Pulsa & Token PLN
        item.buyer_product_status === true && 
        item.seller_product_status === true
      )
      .map((item: any) => ({
        ...item,
        price_sell: item.price + MARGIN,
        price_cost: item.price
      }))
      .sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json({ data: pulsaProducts });

  } catch (error) {
    console.error("Mode Offline/Fallback Aktif:", error);
    
    // === DATA DUMMY LENGKAP (Agar tampilan penuh saat API Error) ===
    const dummyData = [
      // TELKOMSEL
      { product_name: "Telkomsel 5.000", buyer_sku_code: "tsel5", price: 5400, price_sell: 5400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Telkomsel 10.000", buyer_sku_code: "tsel10", price: 10400, price_sell: 10400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Telkomsel 20.000", buyer_sku_code: "tsel20", price: 20400, price_sell: 20400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Telkomsel 50.000", buyer_sku_code: "tsel50", price: 50400, price_sell: 50400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      
      // INDOSAT
      { product_name: "Indosat 5.000", buyer_sku_code: "isat5", price: 5800, price_sell: 5800 + MARGIN, brand: "INDOSAT", desc: "Pulsa Reguler" },
      { product_name: "Indosat 10.000", buyer_sku_code: "isat10", price: 10800, price_sell: 10800 + MARGIN, brand: "INDOSAT", desc: "Pulsa Reguler" },
      { product_name: "Indosat 25.000", buyer_sku_code: "isat25", price: 25500, price_sell: 25500 + MARGIN, brand: "INDOSAT", desc: "Pulsa Reguler" },

      // XL
      { product_name: "XL 10.000", buyer_sku_code: "xl10", price: 10900, price_sell: 10900 + MARGIN, brand: "XL", desc: "Pulsa Reguler" },
      { product_name: "XL 50.000", buyer_sku_code: "xl50", price: 49500, price_sell: 49500 + MARGIN, brand: "XL", desc: "Pulsa Reguler" },

      // TRI
      { product_name: "Tri 5.000", buyer_sku_code: "tri5", price: 5200, price_sell: 5200 + MARGIN, brand: "TRI", desc: "Pulsa Reguler" },
      { product_name: "Tri 10.000", buyer_sku_code: "tri10", price: 10200, price_sell: 10200 + MARGIN, brand: "TRI", desc: "Pulsa Reguler" },

      // SMARTFREN
      { product_name: "Smartfren 10.000", buyer_sku_code: "sm10", price: 10100, price_sell: 10100 + MARGIN, brand: "SMARTFREN", desc: "Pulsa Reguler" }
    ];

    return NextResponse.json({ data: dummyData });
  }
}
