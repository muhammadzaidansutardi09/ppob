"use client";

import { useEffect, useState } from 'react';
import { 
  Smartphone, Zap, Wifi, Gamepad2, CreditCard, 
  Wallet, ShieldPlus, MoreHorizontal, Bell, 
  Plus, History, User, Home as HomeIcon, ChevronRight, ScanLine, ArrowUpRight 
} from 'lucide-react';

export default function HomePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // === DATA FETCHING ===
  const fetchSaldo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/balance', { method: 'POST' });
      const data = await res.json();
      setSaldo(parseInt(data.data?.deposit || 0));
    } catch (err) {
      console.error(err);
      setSaldo(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaldo();
  }, []);

  const menus = [
    { name: 'Pulsa', icon: Smartphone, color: 'bg-blue-50 text-blue-600', link: '/pulsa' },
    { name: 'Data', icon: Wifi, color: 'bg-green-50 text-green-600', link: '/data' },
    { name: 'PLN', icon: Zap, color: 'bg-yellow-50 text-yellow-600', link: '/pln' },
    { name: 'Games', icon: Gamepad2, color: 'bg-purple-50 text-purple-600', link: '/games' },
    { name: 'E-Wallet', icon: Wallet, color: 'bg-orange-50 text-orange-600', link: '/wallet' },
    { name: 'Tagihan', icon: CreditCard, color: 'bg-pink-50 text-pink-600', link: '/bills' },
    { name: 'BPJS', icon: ShieldPlus, color: 'bg-teal-50 text-teal-600', link: '/bpjs' },
    { name: 'Lainnya', icon: MoreHorizontal, color: 'bg-gray-50 text-gray-600', link: '/more' },
  ];

  return (
    // WRAPPER UTAMA (Untuk tampilan Desktop yang elegan)
    <div className="min-h-screen bg-[#eef2f5] flex justify-center sm:items-center sm:py-10 font-sans">
      
      {/* MOBILE CONTAINER */}
      <div className="w-full max-w-[430px] bg-white sm:rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden min-h-screen sm:min-h-[880px] relative border-[8px] border-white ring-1 ring-gray-100">
        
        {/* === HEADER SECTION === */}
        <div className="px-6 pt-12 pb-4 bg-white flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
               <User size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Selamat Datang,</p>
              <h1 className="text-gray-800 font-bold text-lg leading-tight">User PPOB</h1>
            </div>
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-50 transition">
            <Bell size={22} className="text-gray-700" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>

        {/* === CARD SALDO (PREMIUM GLASS) === */}
        <div className="px-6 mt-2 relative z-20">
          <div className="w-full h-48 rounded-[32px] bg-gradient-to-br from-[#2962ff] to-[#0039cb] p-6 relative overflow-hidden shadow-[0_10px_30px_rgba(37,99,235,0.4)] text-white group">
            
            {/* Background Pattern */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 opacity-20 rounded-full blur-2xl"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                   <p className="text-blue-100 text-xs font-medium tracking-wider mb-1">TOTAL SALDO</p>
                   {loading ? (
                     <div className="h-8 w-32 bg-white/20 animate-pulse rounded-md"></div>
                   ) : (
                     <h2 className="text-3xl font-extrabold tracking-tight">
                       Rp {saldo?.toLocaleString('id-ID')}
                     </h2>
                   )}
                </div>
                <CreditCard className="text-white/50" size={24} />
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => alert('Top Up')}
                  className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:scale-95 transition hover:bg-white/30"
                >
                  <Plus size={16} strokeWidth={3} /> Top Up
                </button>
                <button 
                  onClick={() => alert('History')}
                  className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:scale-95 transition hover:bg-white/30"
                >
                  <History size={16} strokeWidth={3} /> Riwayat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* === MAIN MENU === */}
        <div className="mt-8 px-6">
          <div className="grid grid-cols-4 gap-x-2 gap-y-8">
            {menus.map((menu, i) => (
              <button 
                key={i} 
                className="flex flex-col items-center group relative"
              >
                <div className={`${menu.color} w-[60px] h-[60px] rounded-[24px] flex items-center justify-center mb-2 transition-all duration-300 group-hover:shadow-lg group-active:scale-90`}>
                  <menu.icon size={26} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                  {menu.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* === PROMO SECTION === */}
        <div className="mt-10 pb-28">
          <div className="px-6 flex justify-between items-end mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Promo Spesial</h3>
              <p className="text-xs text-gray-400">Penawaran terbaik hari ini</p>
            </div>
            <button className="text-blue-600 text-xs font-bold flex items-center gap-0.5 hover:gap-2 transition-all">
              Lihat Semua <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 px-6 pb-6 snap-x hide-scrollbar">
            {/* Banner 1 */}
            <div className="min-w-[280px] h-36 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg snap-center cursor-pointer active:scale-95 transition">
              <div className="relative z-10 w-2/3">
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold mb-2 inline-block">FLASH SALE</span>
                <p className="text-lg font-bold leading-tight">Internet 50GB</p>
                <p className="text-xs opacity-90 mt-1">Hanya Rp 10.000!</p>
              </div>
              <Wifi className="absolute -right-4 -bottom-4 text-white opacity-20 w-28 h-28 rotate-12" />
            </div>
            
            {/* Banner 2 */}
            <div className="min-w-[280px] h-36 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg snap-center cursor-pointer active:scale-95 transition">
              <div className="relative z-10 w-2/3">
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold mb-2 inline-block">CASHBACK</span>
                <p className="text-lg font-bold leading-tight">Bayar Listrik</p>
                <p className="text-xs opacity-90 mt-1">Dapat koin 5.000</p>
              </div>
              <Zap className="absolute -right-4 -bottom-4 text-white opacity-20 w-28 h-28 rotate-12" />
            </div>
          </div>
        </div>

        {/* === BOTTOM NAVIGATION (CURVED STYLE) === */}
        <div className="fixed sm:absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 pb-safe pt-2 z-50 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center h-16 relative">
            
            <NavButton icon={HomeIcon} label="Beranda" active />
            <NavButton icon={History} label="Riwayat" />
            
            {/* Floating Action Button (SCAN QRIS) */}
            <div className="relative -top-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-transform active:scale-90 border-4 border-white">
                <ScanLine size={28} />
              </button>
            </div>

            <NavButton icon={Wallet} label="Dompet" />
            <NavButton icon={User} label="Akun" />
            
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Navigasi Kecil
function NavButton({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 w-12 ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 transition'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} className={active ? "drop-shadow-sm" : ""} />
      <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
}
