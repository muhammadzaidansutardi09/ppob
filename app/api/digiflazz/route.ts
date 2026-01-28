import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  const username = "joxawigOEOBD";
  const devKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";
  
  // Signature Digiflazz: md5(username + devKey + "depo")
  const signature = crypto.createHash('md5').update(username + devKey + "depo").digest('hex');

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/ceksaldo', {
      username: username,
      sign: signature
    });
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
