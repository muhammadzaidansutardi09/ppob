import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  const username = process.env.DIGIFLAZZ_USERNAME || "joxawigOEOBD";
  const apiKey = process.env.DIGIFLAZZ_KEY || "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  
  // Signature Khusus Cek Saldo: md5(username + apiKey + "depo")
  const signature = crypto.createHash('md5').update(username + apiKey + "depo").digest('hex');

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/cek-saldo', {
      cmd: 'deposit',
      username: username,
      sign: signature
    }, { timeout: 5000 });

    const saldo = response.data.data.deposit;

    return NextResponse.json({ 
        balance: saldo,
        status: 'ok' 
    });

  } catch (error) {
    console.error("Gagal cek saldo Digiflazz:", error);
    return NextResponse.json({ balance: 0, status: 'error' });
  }
}
