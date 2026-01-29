"use client";

import { useEffect, useState, useRef } from 'react';
import { 
  Smartphone, Zap, Wifi, Gamepad2, CreditCard, 
  Wallet, ShieldPlus, MoreHorizontal, Bell, 
  Plus, History, User, Home as HomeIcon, ScanLine, ArrowUpRight,
  Eye, EyeOff, LogOut, X, CheckCircle2, Clock, AlertCircle, ShoppingBag, Server
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  // === STATE USER & APP ===
  const [user, setUser] = useState<any>({ name: 'Loading...', saldo: 0 });
  const [serverBalance, setServerBalance] = useState<number | null>(null); // State Saldo Digiflazz
  const [loading, setLoading] = useState(true);
  
  // === STATE NOTIFIKASI ===
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // === STATE TOGGLE SALDO ===
  const [showSaldo, setShowSaldo] = useState(true);

  // === 1. LOAD DATA ===
  useEffect(() => {
    // A. Cek Session User
    const session = localStorage.getItem('ppob_session');
    if (!session) {
      router.push('/login'); 
    } else {
      setUser(JSON.parse(session));
      setLoading(false);
    }

    // B. Load Notifikasi
    const riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    setNotifications(riwayat);
    const unread = riwayat.filter((item: any) => !item.is_read).length;
    setUnreadCount(unread);

    // C. LOAD SALDO DIGIFLAZZ (SERVER)
    fetch('/api/digiflazz/balance', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
         if(data.status === 'ok') setServerBalance(data.balance);
      })
      .catch(err => console.error("Gagal load saldo server"));

    // Event Listener Dropdown
    function handleClickOutside(event: any) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotif = () => {
    if (!showNotifDropdown) {
      const updatedNotif = notifications.map(n => ({ ...n, is_read: true }));
      setNotifications(updatedNotif);
      setUnreadCount(0);
      localStorage.setItem('riwayat_transaksi', JSON.stringify(updatedNotif));
    }
    setShowNotifDropdown(!showNotifDropdown);
  };

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar akun?")) {
      localStorage.removeItem('ppob_session');
      router.push('/login');
    }
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

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
      
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl overflow-hidden pb-32">
        
        {/* === HEADER SECTION === */}
        <div className="px-6 pt-12 pb-6 bg-white flex justify-between items-start sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 overflow-hidden">
               <User size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Selamat Datang,</p>
              <h1 className="text-gray-800 font-bold text-lg leading-tight capitalize">
                {user.name}
              </h1>
              
              {/* === INDIKATOR SALDO DIGIFLAZZ (ADMIN INFO) === */}
              {serverBalance !== null && (
                 <div className="flex items-center gap-1 mt-1 bg-gray-100 px-2 py-0.5 rounded-md w-fit">
                    <Server size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-500 font-mono">
                       Server: Rp {serverBalance.toLocaleString('id-ID')}
                    </span>
                 </div>
              )}
            </div>
          </div>

          {/* === NOTIFIKASI === */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={toggleNotif}
              className={`relative p-2 rounded-full transition ${showNotifDropdown ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>

            {/* Dropdown Notif */}
            {showNotifDropdown && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 text-sm">Notifikasi</h3>
                  <button onClick={() => setShowNotifDropdown(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <ShoppingBag size={32} className="mb-2 opacity-50" />
                      <p className="text-xs">Belum ada notifikasi</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((item, i) => (
                      <div key={i} className="p-3 rounded-xl hover:bg-gray-50 transition border border-gray-50 flex gap-3 items-start">
                        <div className={`mt-0.5 p-1.5 rounded-full shrink-0
                          ${item.status === 'Sukses' ? 'bg-green-100 text-green-600' : 
                            item.status === 'Gagal' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                           {item.status === 'Sukses' ? <CheckCircle2 size={12} /> : 
                            item.status === 'Gagal' ? <AlertCircle size={12} /> : <Clock size={12} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">
                            Transaksi {item.status}
                          </p>
                          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                            {item.product_name} • Rp {item.price.toLocaleString('id-ID')}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-1 text-right">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {notifications.length > 0 && (
                    <Link href="/riwayat" className="block text-center text-[10px] font-bold text-blue-600 py-2 hover:underline">
                      Lihat Semua Riwayat
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === CARD SALDO (Biru) === */}
        <div className="px-6 relative z-10">
          <div className="w-full h-48 rounded-[32px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] p-6 relative overflow-hidden shadow-xl shadow-blue-500/20 text-white group transition-all hover:scale-[1.02]">
            
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 opacity-20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <p className="text-blue-100 text-[10px] font-bold tracking-widest uppercase">Total Saldo</p>
                      <button onClick={() => setShowSaldo(!showSaldo)} className="text-blue-200 hover:text-white transition">
                        {showSaldo ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                   </div>
                   
                   <h2 className="text-3xl font-extrabold tracking-tight">
                     {showSaldo ? `Rp ${user.saldo?.toLocaleString('id-ID')}` : "Rp •••••••"}
                   </h2>
                </div>
                <CreditCard className="text-white/40" size={28} />
              </div>

              <div className="flex gap-3 mt-auto">
                <Link href="/topup" className="flex-1">
                    <button className="w-full bg-white/20 backdrop-blur-sm border border-white/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition hover:bg-white/30">
                    <Plus size={16} strokeWidth={3} /> Top Up
                    </button>
                </Link>
                <Link href="/riwayat" className="flex-1">
                    <button className="w-full bg-white/20 backdrop-blur-sm border border-white/20 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition hover:bg-white/30">
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
                href={menu.name === 'Pulsa' ? '/pulsa' : '#'}
                className="flex flex-col items-center group w-full active:scale-95 transition-transform"
                onClick={() => {
                  if(menu.name !== 'Pulsa') alert(`Fitur ${menu.name} akan segera hadir!`);
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
            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
            <div className="min-w-[280px] h-36 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg snap-center">
              <div className="relative z-10 w-3/4">
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold mb-2 inline-block">FLASH SALE</span>
                <p className="text-lg font-bold leading-tight">Internet 50GB</p>
                <p className="text-xs opacity-90 mt-1">Hanya Rp 10.000!</p>
              </div>
              <Wifi className="absolute -right-4 -bottom-4 text-white opacity-20 w-32 h-32 rotate-12" />
            </div>
             <div className="min-w-[280px] h-36 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[28px] p-5 text-white relative overflow-hidden shadow-lg snap-center">
              <div className="relative z-10 w-3/4">
                <span className="bg-white/20 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold mb-2 inline-block">TOKEN PLN</span>
                <p className="text-lg font-bold leading-tight">Diskon Admin</p>
                <p className="text-xs opacity-90 mt-1">Potongan 2rb rupiah</p>
              </div>
              <Zap className="absolute -right-4 -bottom-4 text-white opacity-20 w-32 h-32 rotate-12" />
            </div>
          </div>
        </div>

        {/* === BOTTOM NAVIGATION === */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
          <div className="bg-white h-[80px] w-full rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 flex justify-between items-center px-6 relative">
            
            <Link href="/" className="w-12 flex justify-center">
               <NavButton icon={HomeIcon} label="Beranda" active={true} />
            </Link>

            <Link href="/riwayat" className="w-12 flex justify-center">
               <NavButton icon={History} label="Riwayat" />
            </Link>
            
            <div className="relative -top-8">
               <button onClick={() => alert("Scan QRIS Coming Soon!")} className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 transition-transform active:scale-90 border-[6px] border-white">
                  <ScanLine size={28} />
               </button>
            </div>

            <Link href="#" onClick={() => alert("Fitur Dompet belum tersedia")} className="w-12 flex justify-center">
               <NavButton icon={Wallet} label="Dompet" />
            </Link>

            <button onClick={handleLogout} className="w-12 flex flex-col items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors mt-2">
               <LogOut size={24} strokeWidth={2} />
               <span className="text-[10px] font-medium">Keluar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function NavButton({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'} transition-colors mt-2`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
  );
}
