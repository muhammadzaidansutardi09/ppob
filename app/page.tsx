"use client";

import { useEffect, useState } from 'react';
import { 
  Smartphone, Zap, Wifi, Gamepad2, CreditCard, 
  Wallet, ShieldPlus, MoreHorizontal, Bell, 
  Plus, History, User, Home as HomeIcon, ChevronRight 
} from 'lucide-react';

export default function HomePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi ambil saldo real-time dari API yang kita buat
  const fetchSaldo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/balance', { method: 'POST' });
      const data = await res.json();
      // Digiflazz kadang mengembalikan angka, kadang string, jadi kita parse
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
    { name: 'Pulsa', icon: Smartphone, color: 'bg-blue-100 text-blue-600', link: '/pulsa' },
    { name: 'Paket Data', icon: Wifi, color: 'bg-green-100 text-green-600', link: '/data' },
    { name: 'PLN Token', icon: Zap, color: 'bg-yellow-100 text-yellow-600', link: '/pln' },
    { name: 'Topup Game', icon: Gamepad2, color: 'bg-purple-100 text-purple-600', link: '/games' },
    { name: 'E-Wallet', icon: Wallet, color: 'bg-orange-100 text-orange-600', link: '/wallet' },
    { name: 'Tagihan', icon: CreditCard, color: 'bg-pink-100 text-pink-600', link: '/bills' },
    { name: 'BPJS', icon: ShieldPlus, color: 'bg-teal-100 text-teal-600', link: '/bpjs' },
    { name: 'Lainnya', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-600', link: '/more' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[480px] bg-white shadow-2xl min-h-screen relative pb-24">
        
        {/* === HEADER SECTION === */}
        <div className="relative h-64 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-b-[40px] px-6 pt-12 pb-6 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

          {/* Top Bar */}
          <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
              <p className="text-blue-100 text-sm font-medium">Selamat Datang,</p>
              <h1 className="text-white text-xl font-bold">User PPOB</h1>
            </div>
            <button className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/30 transition">
              <Bell size={20} />
            </button>
          </div>

          {/* Saldo Card (Floating Glass Effect) */}
          <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-3xl shadow-xl mt-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Total Saldo</p>
                {loading ? (
                  <div className="h-8 w-32 bg-white/20 animate-pulse rounded-lg"></div>
                ) : (
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    Rp {saldo?.toLocaleString('id-ID')}
                  </h2>
                )}
              </div>
              <button 
                onClick={() => alert("Fitur Topup akan segera hadir!")}
                className="bg-white text-blue-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg active:scale-95 transition-transform"
              >
                <Plus size={14} strokeWidth={4} /> TOP UP
              </button>
            </div>
            <div className="mt-4 flex gap-3 text-white/80 text-[10px] font-medium">
              <span className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-lg">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> 
                Akun Aktif
              </span>
              <span className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded-lg">
                Digiflazz Connected
              </span>
            </div>
          </div>
        </div>

        {/* === MENU GRID === */}
        <div className="px-6 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {menus.map((menu, i) => (
                <button 
                  key={i} 
                  onClick={() => alert(`Anda memilih menu ${menu.name}`)}
                  className="flex flex-col items-center group w-full"
                >
                  <div className={`${menu.color} w-14 h-14 rounded-[20px] flex items-center justify-center mb-2 shadow-sm group-active:scale-90 transition-all duration-200 ease-spring`}>
                    <menu.icon size={24} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
                    {menu.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* === PROMO BANNER (Swiper Style) === */}
        <div className="mt-6 px-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-lg">Promo Spesial</h3>
            <button className="text-blue-600 text-xs font-semibold flex items-center">
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            {/* Banner 1 */}
            <div className="min-w-[85%] h-36 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg snap-center shrink-0">
              <div className="relative z-10 flex flex-col justify-center h-full">
                <span className="bg-white/20 w-fit px-2 py-1 rounded-lg text-[10px] font-bold mb-2">HOT PROMO</span>
                <p className="text-lg font-bold leading-tight">Diskon Pulsa <br/> All Operator</p>
                <p className="text-xs opacity-90 mt-1">Potongan hingga 10% hari ini!</p>
              </div>
              <Zap className="absolute -right-4 -bottom-4 text-white opacity-20 w-32 h-32 rotate-12" />
            </div>
            
            {/* Banner 2 */}
            <div className="min-w-[85%] h-36 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg snap-center shrink-0">
              <div className="relative z-10 flex flex-col justify-center h-full">
                <span className="bg-white/20 w-fit px-2 py-1 rounded-lg text-[10px] font-bold mb-2">GAME ON</span>
                <p className="text-lg font-bold leading-tight">Topup Diamond <br/> Mobile Legends</p>
                <p className="text-xs opacity-90 mt-1">Bonus item langka.</p>
              </div>
              <Gamepad2 className="absolute -right-4 -bottom-4 text-white opacity-20 w-32 h-32 rotate-12" />
            </div>
          </div>
        </div>

        {/* === BOTTOM NAVIGATION === */}
        <div className="fixed bottom-0 w-full max-w-[480px] bg-white/90 backdrop-blur-md border-t border-gray-200 pb-safe pt-2 px-6 z-50">
          <div className="flex justify-around items-center h-16">
            <NavButton icon={HomeIcon} label="Beranda" active />
            <NavButton icon={History} label="Riwayat" />
            <div className="w-12"></div> {/* Spacer for potential center FAB */}
            <NavButton icon={Wallet} label="Dompet" />
            <NavButton icon={User} label="Akun" />
            
            {/* QRIS Button (Floating Center) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-transform active:scale-90">
                <Zap size={24} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Komponen Kecil untuk Nav Button
function NavButton({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 w-12 ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
