"use client";

import { useEffect, useState } from 'react';
import { 
  Smartphone, Zap, Wifi, Gamepad2, CreditCard, 
  Wallet, ShieldPlus, MoreHorizontal, Bell, 
  Plus, History, User, Home as HomeIcon, ScanLine, ArrowUpRight,
  Eye, EyeOff, LogIn
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  // State untuk status login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State untuk toggle liat saldo (opsional)
  const [showSaldo, setShowSaldo] = useState(false);

  // === DATA FETCHING ===
  const fetchSaldo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/balance', { method: 'POST' });
      const result = await res.json();
      
      if (result.data && typeof result.data.deposit !== 'undefined') {
        setSaldo(parseInt(result.data.deposit));
      } else {
        setSaldo(0);
      }
    } catch (err) {
      console.error("Gagal fetch saldo:", err);
      setSaldo(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cek localStorage saat komponen dimuat
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
      fetchSaldo();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  // Fungsi simulasi Login (Untuk testing)
  const handleLoginSimulasi = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    fetchSaldo();
  };

  // Fungsi simulasi Logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setSaldo(null);
  };

  const menus = [
    { name: 'Pulsa', icon: Smartphone, color: 'bg-blue-50 text-blue-600' },
    { name: 'Data', icon: Wifi, color: 'bg-green-50 text-green-600' },
    { name: 'PLN', icon: Zap, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Games', icon: Gamepad2, color: 'bg-purple-50 text-purple-600' },
    { name: 'E-Wallet', icon: Wallet, color: 'bg-orange-50 text-orange-600' },
    { name: 'Tagihan', icon: CreditCard, color: 'bg-pink-50 text-pink-600' },
    { name: 'BPJS', icon: ShieldPlus, color: 'bg-teal-50 text-teal-600' },
    { name: 'Lainnya', icon: MoreHorizontal, color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
      
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl overflow-hidden pb-32">
        
        {/* === HEADER SECTION === */}
        <div className="px-6 pt-12 pb-6 bg-white flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
               {isLoggedIn ? <User size={20} className="text-gray-600" /> : <LogIn size={20} className="text-blue-600" />}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                {isLoggedIn ? "Selamat Datang," : "Halo, Tamu"}
              </p>
              <h1 className="text-gray-800 font-bold text-lg leading-tight">
                {isLoggedIn ? "User PPOB" : (
                  <button onClick={handleLoginSimulasi} className="text-blue-600 hover:underline">Klik untuk Login</button>
                )}
              </h1>
            </div>
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-50 transition">
            <Bell size={24} className="text-gray-700" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* === CARD SALDO (Biru) === */}
        <div className="px-6 relative z-10">
          <div className="w-full h-48 rounded-[32px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] p-6 relative overflow-hidden shadow-xl shadow-blue-500/20 text-white group transition-all">
            
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 opacity-20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <p className="text-blue-100 text-[10px] font-bold tracking-widest uppercase">Total Saldo</p>
                      {isLoggedIn && (
                        <button onClick={() => setShowSaldo(!showSaldo)}>
                          {showSaldo ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                   </div>
                   
                   {loading ? (
                     <div className="h-9 w-32 bg-white/20 animate-pulse rounded-md"></div>
                   ) : (
                     <h2 className="text-4xl font-extrabold tracking-tight">
                       {isLoggedIn ? (
                         showSaldo ? `Rp ${saldo?.toLocaleString('id-ID')}` : "Rp ••••••"
                       ) : "Rp ••••••"}
                     </h2>
                   )}
                </div>
                <CreditCard className="text-white/40" size={28} />
              </div>

              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => !isLoggedIn && alert("Silahkan login dulu!")}
                  className="flex-1 bg-white/20 backdrop-blur-sm border border-white/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition hover:bg-white/30"
                >
                  <Plus size={16} strokeWidth={3} /> Top Up
                </button>
                <Link href={isLoggedIn ? "/riwayat" : "#"} className="flex-1">
                    <button 
                      onClick={() => !isLoggedIn && alert("Silahkan login dulu!")}
                      className="w-full bg-white/20 backdrop-blur-sm border border-white/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition hover:bg-white/30"
                    >
                      <History size={16} strokeWidth={3} /> Riwayat
                    </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* === GRID MENU === */}
        <div className="mt-8 px-6">
          <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            {menus.map((menu, i) => (
              <Link 
                key={i} 
                href={isLoggedIn && menu.name === 'Pulsa' ? '/pulsa' : '#'}
                className="flex flex-col items-center group w-full active:scale-95 transition-transform"
                onClick={() => {
                  if(!isLoggedIn) return alert('Silahkan login untuk bertransaksi!');
                  if(menu.name !== 'Pulsa') alert('Fitur segera hadir!');
                }}
              >
                <div className={`${menu.color} w-[58px] h-[58px] rounded-[22px] flex items-center justify-center mb-2 shadow-sm border border-gray-50 group-hover:shadow-md transition-all`}>
                  <menu.icon size={26} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                  {menu.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* === PROMO SPESIAL === */}
        <div className="mt-10 px-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Promo Spesial</h3>
              <p className="text-xs text-gray-400">Penawaran terbaik hari ini</p>
            </div>
            <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
              Lihat Semua <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            <div className="min-w-[280px] h-36 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg snap-center">
              <div className="relative z-10 w-3/4">
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold mb-2 inline-block">FLASH SALE</span>
                <p className="text-lg font-bold leading-tight">Internet 50GB</p>
                <p className="text-xs opacity-90 mt-1">{isLoggedIn ? "Hanya Rp 10.000!" : "Login untuk lihat harga"}</p>
              </div>
              <Wifi className="absolute -right-4 -bottom-4 text-white opacity-20 w-32 h-32 rotate-12" />
            </div>
          </div>
        </div>

        {/* === BOTTOM NAVIGATION === */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
          <div className="bg-white h-[80px] w-full rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 flex justify-between items-center px-6 relative">
            <Link href="/" className="w-12 flex justify-center">
               <NavButton icon={HomeIcon} label="Beranda" active={true} />
            </Link>

            <Link href={isLoggedIn ? "/riwayat" : "#"} onClick={() => !isLoggedIn && alert("Login dulu!")} className="w-12 flex justify-center">
               <NavButton icon={History} label="Riwayat" />
            </Link>
            
            <div className="relative -top-8">
               <button 
                 onClick={() => alert("Fitur Scan QRIS akan segera hadir!")} 
                 className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 border-[6px] border-white"
               >
                  <ScanLine size={28} />
               </button>
            </div>

            <Link href="#" className="w-12 flex justify-center">
               <NavButton icon={Wallet} label="Dompet" />
            </Link>

            {/* Tombol Akun Berganti fungsi Logout jika sudah login */}
            <button onClick={isLoggedIn ? handleLogout : handleLoginSimulasi} className="w-12 flex flex-col items-center gap-1.5 text-gray-400 mt-2">
               <User size={24} />
               <span className="text-[10px] font-medium">{isLoggedIn ? "Logout" : "Akun"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${active ? 'text-blue-600' : 'text-gray-400'} mt-2`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
  );
}
