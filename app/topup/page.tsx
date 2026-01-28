"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TopupPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [currentSaldo, setCurrentSaldo] = useState(0);

  // Ambil saldo saat ini pas loading
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    setCurrentSaldo(session.saldo || 0);
  }, []);

  const handleTopUp = () => {
    if (amount < 10000) return alert("Minimal Top Up Rp 10.000 ya!");

    // 1. Ambil Data Session (User yang sedang login)
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    if (!session.phone) {
      alert("Sesi habis, silakan login ulang.");
      router.push('/login');
      return;
    }

    // 2. Hitung Saldo Baru
    const newBalance = (session.saldo || 0) + amount;

    // 3. UPDATE SESSION (Agar tampilan di Home langsung berubah)
    session.saldo = newBalance;
    localStorage.setItem('ppob_session', JSON.stringify(session));

    // 4. UPDATE DATABASE PERMANEN (Agar kalau logout, saldo gak ilang)
    const users = JSON.parse(localStorage.getItem('db_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.phone === session.phone);
    
    if (userIndex !== -1) {
      users[userIndex].saldo = newBalance; // Update saldo di database pusat
      localStorage.setItem('db_users', JSON.stringify(users));
    }

    // 5. SIMPAN RIWAYAT (History)
    const history = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    const newHistory = {
        order_id: `TOPUP-${Date.now()}`,
        product_name: 'Isi Saldo (Demo)',
        price: amount,
        phone: session.phone,
        status: 'Sukses', // Langsung sukses karena ini simulasi
        date: new Date().toLocaleString('id-ID'),
    };
    // Simpan history baru di paling atas
    localStorage.setItem('riwayat_transaksi', JSON.stringify([newHistory, ...history]));

    // 6. Selesai
    alert(`Berhasil Top Up Rp ${amount.toLocaleString('id-ID')}!\nSaldo Anda sekarang Rp ${newBalance.toLocaleString('id-ID')}`);
    router.push('/');
  };

  const nominals = [10000, 20000, 50000, 100000, 250000, 500000, 1000000, 2000000];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-50 border-b border-gray-100">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition">
             <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="font-bold text-lg text-gray-800">Isi Saldo</h1>
        </div>

        <div className="p-6 flex-1">
          
          {/* Info Saldo Saat Ini */}
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6 flex items-center gap-4">
             <div className="bg-blue-600 text-white p-3 rounded-full">
                <Wallet size={24} />
             </div>
             <div>
                <p className="text-xs text-blue-600 font-bold uppercase">Saldo Saat Ini</p>
                <p className="text-xl font-extrabold text-gray-800">Rp {currentSaldo.toLocaleString('id-ID')}</p>
             </div>
          </div>

          <p className="text-sm font-bold text-gray-700 mb-3">Pilih Nominal Top Up</p>
          
          {/* Grid Nominal */}
          <div className="grid grid-cols-2 gap-3">
            {nominals.map((nom, i) => (
                <button 
                    key={i} 
                    onClick={() => setAmount(nom)}
                    className={`p-4 rounded-xl border-2 font-bold text-lg transition-all relative overflow-hidden
                    ${amount === nom 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg scale-[1.02]' 
                        : 'border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50'}`}
                >
                    {amount === nom && (
                        <div className="absolute top-0 right-0 p-1 bg-white/20 rounded-bl-lg">
                           <CreditCard size={12} />
                        </div>
                    )}
                    {nom.toLocaleString('id-ID')}
                </button>
            ))}
          </div>

          {/* Info Keamanan */}
          <div className="mt-8 bg-gray-50 p-4 rounded-xl flex items-start gap-3">
             <ShieldCheck className="text-gray-400 shrink-0" size={20} />
             <p className="text-xs text-gray-500 leading-relaxed">
                Ini adalah simulasi Top Up. Saldo akan bertambah secara instan tanpa pemotongan biaya admin bank.
             </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-40">
           <button 
              onClick={handleTopUp}
              disabled={amount === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
           >
              {amount > 0 ? `Bayar Rp ${amount.toLocaleString('id-ID')}` : 'Pilih Nominal'}
           </button>
        </div>

      </div>
    </div>
  );
}
