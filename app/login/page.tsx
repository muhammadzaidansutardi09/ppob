"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, ArrowRight, Smartphone, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  // 1. Cek Session: Kalau sudah login, langsung tendang ke Home
  useEffect(() => {
    const session = localStorage.getItem('ppob_session');
    if (session) {
      router.push('/');
    }
  }, []);

  const handleLogin = () => {
    if (!phone || !pin) return alert("Mohon isi Nomor HP dan PIN!");

    // 2. Ambil "Database User" dari LocalStorage
    // (Data ini dibuat saat user melakukan Register)
    const users = JSON.parse(localStorage.getItem('db_users') || '[]');

    // 3. Cari User yang cocok (Validasi Login)
    const validUser = users.find((u: any) => u.phone === phone && u.pin === pin);

    if (validUser) {
        // A. Login Sukses -> Simpan Session di HP
        // Kita simpan data user yang sedang aktif ke 'ppob_session'
        localStorage.setItem('ppob_session', JSON.stringify(validUser));
        
        alert(`Selamat datang kembali, ${validUser.name}!`);
        router.push('/'); // Pindah ke Home
    } else {
        // B. Login Gagal
        alert("Login Gagal! Nomor HP atau PIN salah, atau Anda belum mendaftar.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
        
        {/* Logo / Icon Header */}
        <div className="flex justify-center mb-6">
           <div className="bg-blue-100 p-4 rounded-full text-blue-600">
             <Wallet size={40} />
           </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Selamat Datang</h1>
        <p className="text-center text-gray-400 text-sm mb-8">Silakan masuk ke akun PPOB Anda</p>

        {/* Form Input */}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Smartphone size={12} /> Nomor HP
            </label>
            <input 
              type="tel" 
              placeholder="Contoh: 0812..."
              className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-blue-500 font-bold text-lg text-gray-800 transition-colors"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Lock size={12} /> PIN
            </label>
            <input 
              type="password" 
              placeholder="******"
              className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-blue-500 font-bold text-lg text-gray-800 transition-colors"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
        </div>

        {/* Tombol Login */}
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Masuk Sekarang <ArrowRight size={20} />
        </button>

        {/* Link ke Register */}
        <p className="text-center text-gray-500 text-sm mt-6">
            Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar Disini</Link>
        </p>

      </div>
    </div>
  );
}
