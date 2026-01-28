"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowRight, Smartphone, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleRegister = () => {
    // 1. Validasi Input Kosong
    if (!name || !phone || !pin) {
      alert("Mohon lengkapi Nama, Nomor HP, dan PIN!");
      return;
    }

    // 2. Validasi Panjang PIN (Biar agak real)
    if (pin.length < 4) {
      alert("PIN minimal 4 digit angka!");
      return;
    }

    // 3. Ambil Database User yang sudah ada (jika ada)
    // Kita pakai key 'db_users' sebagai tempat simpan semua akun
    const existingUsers = JSON.parse(localStorage.getItem('db_users') || '[]');

    // 4. Cek apakah nomor HP sudah terdaftar (Anti Duplikat)
    const isExist = existingUsers.find((u: any) => u.phone === phone);
    if (isExist) {
      alert("Nomor HP ini sudah terdaftar! Silakan Login saja.");
      router.push('/login');
      return;
    }

    // 5. Buat Object User Baru
    const newUser = {
      name: name,
      phone: phone,
      pin: pin,
      saldo: 0, // Saldo awal otomatis 0
    };

    // 6. Simpan ke "Database" LocalStorage
    existingUsers.push(newUser);
    localStorage.setItem('db_users', JSON.stringify(existingUsers));

    // 7. Sukses
    alert("Registrasi Berhasil! Akun Anda telah dibuat.");
    router.push('/login'); // Arahkan ke halaman login
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
           <div className="bg-blue-100 p-4 rounded-full text-blue-600">
             <UserPlus size={40} />
           </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">Daftar Akun</h1>
        <p className="text-center text-gray-400 text-sm mb-8">Buat akun PPOB (Demo) baru</p>

        {/* Form Input */}
        <div className="space-y-4">
          
          {/* Input Nama */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                <User size={12} /> Nama Lengkap
            </label>
            <input 
              type="text" 
              placeholder="Contoh: Zaidan"
              className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-blue-500 font-bold text-lg text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Input No HP */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Smartphone size={12} /> Nomor HP
            </label>
            <input 
              type="tel" 
              placeholder="Contoh: 0812..."
              className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-blue-500 font-bold text-lg text-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Input PIN */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                <Lock size={12} /> Buat PIN Baru
            </label>
            <input 
              type="password" 
              placeholder="******"
              className="w-full border-b-2 border-gray-200 py-2 focus:outline-none focus:border-blue-500 font-bold text-lg text-gray-800"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>

        </div>

        {/* Tombol Daftar */}
        <button 
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Daftar Sekarang <ArrowRight size={20} />
        </button>

        {/* Link ke Login */}
        <p className="text-center text-gray-500 text-sm mt-6">
            Sudah punya akun? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login Disini</Link>
        </p>

      </div>
    </div>
  );
}
