import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST() {
  // KREDENSIAL DIGIFLAZZ (Sesuai request Anda)
  // Catatan: Idealnya simpan ini di .env untuk production
  const username = "joxawigOEOBD";
  const apiKey = "dev-4d590e80-29d1-11ee-89a7-fd3d9b1edf9b";

  // Signature wajib Digiflazz: md5(username + apiKey + "depo")
  const signature = crypto
    .createHash('md5')
    .update(username + apiKey + "depo")
    .digest('hex');

  try {
    const response = await axios.post('https://api.digiflazz.com/v1/ceksaldo', {
      cmd: 'deposit',
      username: username,
      sign: signature
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Digiflazz Error:", error);
    return NextResponse.json({ data: { deposit: 0 }, message: "Error" }, { status: 500 });
  }
}
