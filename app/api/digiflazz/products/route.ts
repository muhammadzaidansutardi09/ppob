import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  const username = "joxawigOEOBD";
  const apiKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  const signature = crypto.createHash('md5').update(username + apiKey + "pricelist").digest('hex');

  const MARGIN = 2500; 

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/price-list', {
      cmd: 'prepaid',
      username: username,
      sign: signature
    }, { timeout: 5000 });

    const allProducts = response.data.data;
    
    const pulsaProducts = allProducts
      .filter((item: any) => 
        (item.category.includes("Pulsa") || item.brand.includes("PLN")) && 
        item.buyer_product_status === true && 
        item.seller_product_status === true
      )
      .map((item: any) => ({
        ...item,
        price_sell: item.price + MARGIN,
        price_cost: item.price
      }))
      .sort((a: any, b: any) => a.price - b.price);

    // === PERUBAHAN 1: Tambahkan penanda source: 'live' ===
    return NextResponse.json({ 
        data: pulsaProducts,
        source: 'live' 
    });

  } catch (error) {
    console.error("Mode Offline/Fallback Aktif:", error);
    
    const dummyData = [
      { product_name: "Telkomsel 5.000", buyer_sku_code: "tsel5", price: 5400, price_sell: 5400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Telkomsel 10.000", buyer_sku_code: "tsel10", price: 10400, price_sell: 10400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Telkomsel 20.000", buyer_sku_code: "tsel20", price: 20400, price_sell: 20400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Telkomsel 50.000", buyer_sku_code: "tsel50", price: 50400, price_sell: 50400 + MARGIN, brand: "TELKOMSEL", desc: "Pulsa Reguler" },
      { product_name: "Indosat 5.000", buyer_sku_code: "isat5", price: 5800, price_sell: 5800 + MARGIN, brand: "INDOSAT", desc: "Pulsa Reguler" },
      { product_name: "Indosat 10.000", buyer_sku_code: "isat10", price: 10800, price_sell: 10800 + MARGIN, brand: "INDOSAT", desc: "Pulsa Reguler" },
      { product_name: "XL 10.000", buyer_sku_code: "xl10", price: 10900, price_sell: 10900 + MARGIN, brand: "XL", desc: "Pulsa Reguler" },
      { product_name: "Tri 5.000", buyer_sku_code: "tri5", price: 5200, price_sell: 5200 + MARGIN, brand: "TRI", desc: "Pulsa Reguler" },
      { product_name: "Smartfren 10.000", buyer_sku_code: "sm10", price: 10100, price_sell: 10100 + MARGIN, brand: "SMARTFREN", desc: "Pulsa Reguler" }
    ];

    // === PERUBAHAN 2: Tambahkan penanda source: 'dummy' ===
    return NextResponse.json({ 
        data: dummyData, 
        source: 'dummy' 
    });
  }
}
