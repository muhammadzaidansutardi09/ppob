"use client";
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    fetch('/api/digiflazz', { method: 'POST' })
      .then(res => res.json())
      .then(data => setSaldo(data.data?.deposit || 0));
  }, []);

  const menus = [
    { name: 'Pulsa', icon: '📱', color: 'bg-blue-100 text-blue-600' },
    { name: 'Data', icon: '🌐', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'PLN', icon: '⚡', color: 'bg-orange-100 text-orange-600' },
    { name: 'Games', icon: '🎮', color: 'bg-purple-100 text-purple-600' },
    { name: 'E-Wallet', icon: '💳', color: 'bg-green-100 text-green-600' },
    { name: 'Pasca', icon: '📄', color: 'bg-red-100 text-red-600' },
    { name: 'BPJS', icon: '🏥', color: 'bg-teal-100 text-teal-600' },
    { name: 'Lainnya', icon: '🔍', color: 'bg-gray-100 text-gray-600' },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20 shadow-xl">
      {/* Header / Saldo Section */}
      <div className="bg-blue-600 p-6 rounded-b-[3rem] shadow-lg">
        <div className="flex justify-between items-center text-white mb-6">
          <h1 className="font-bold text-xl">PPOB Kita</h1>
          <div className="bg-blue-500 p-2 rounded-full">🔔</div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs uppercase font-semibold">Saldo Anda</p>
            <h2 className="text-2xl font-bold text-blue-600">
              Rp {saldo.toLocaleString('id-ID')}
            </h2>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold active:scale-95 transition">
            Top Up
          </button>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-3xl shadow-sm">
          {menus.map((menu, i) => (
            <div key={i} className="flex flex-col items-center cursor-pointer group">
              <div className={`${menu.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-1 group-active:scale-90 transition`}>
                {menu.icon}
              </div>
              <span className="text-[10px] font-medium text-gray-600">{menu.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Promo / Banner Section */}
      <div className="px-6">
        <h3 className="font-bold text-gray-800 mb-3">Promo Spesial</h3>
        <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-bold">Diskon Pulsa</p>
            <p className="text-xs opacity-80">Hingga 10% setiap hari Jumat!</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Bottom Nav (Floating ala Mobile App) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white h-16 rounded-2xl shadow-2xl flex justify-around items-center border border-gray-100">
        <div className="text-blue-600 flex flex-col items-center">
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Home</span>
        </div>
        <div className="text-gray-400 flex flex-col items-center">
          <span className="text-xl">📊</span>
          <span className="text-[10px]">Riwayat</span>
        </div>
        <div className="text-gray-400 flex flex-col items-center">
          <span className="text-xl">👤</span>
          <span className="text-[10px]">Profil</span>
        </div>
      </div>
    </div>
  );
}
