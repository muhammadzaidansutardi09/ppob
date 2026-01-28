"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function TopupPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [currentSaldo, setCurrentSaldo] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    setCurrentSaldo(session.saldo || 0);
  }, []);

  // === FUNGSI SIMPAN RIWAYAT (DITAMBAHKAN SKU: TOPUP) ===
  const saveHistory = (status: string, orderId: string) => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    
    const newHistory = {
        order_id: orderId,
        product_name: 'Isi Saldo',
        price: amount,
        phone: session.phone || '-',
        sku: 'TOPUP', // <--- PENTING! TANDA BAHWA INI ADALAH TOPUP
        status: status,
        date: new Date().toLocaleString('id-ID'),
        method: 'Midtrans'
    };

    const history = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    const index = history.findIndex((item: any) => item.order_id === orderId);
    
    if (index !== -1) {
        history[index] = newHistory;
    } else {
        history.unshift(newHistory);
    }

    localStorage.setItem('riwayat_transaksi', JSON.stringify(history));
  };

  const processSuccessTopUp = (orderId: string) => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    if (!session.phone) return;

    // Tambah Saldo
    const newBalance = (session.saldo || 0) + amount;
    session.saldo = newBalance;
    localStorage.setItem('ppob_session', JSON.stringify(session));

    // Update DB User
    const users = JSON.parse(localStorage.getItem('db_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.phone === session.phone);
    if (userIndex !== -1) {
      users[userIndex].saldo = newBalance;
      localStorage.setItem('db_users', JSON.stringify(users));
    }

    // Update Riwayat jadi Sukses
    saveHistory('Sukses', orderId);

    alert(`Top Up Berhasil! Saldo bertambah Rp ${amount.toLocaleString('id-ID')}`);
    router.push('/');
  };

  const handleTopUp = async () => {
    if (amount < 10000) return alert("Minimal Top Up Rp 10.000");
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    if (!session.phone) return router.push('/login');

    setLoading(true);

    try {
        const res = await fetch('/api/transaction/create', {
            method: 'POST',
            body: JSON.stringify({
                sku_code: 'TOPUP',
                product_name: 'Isi Saldo Wallet',
                customer_no: session.phone,
                amount: amount
            })
        });
        const data = await res.json();
        
        // @ts-ignore
        window.snap.pay(data.token, {
            onSuccess: function(result: any){
                processSuccessTopUp(data.order_id);
            },
            onPending: function(result: any){
                saveHistory('Menunggu', data.order_id);
                alert("Menunggu Pembayaran Top Up...");
                router.push('/riwayat');
            },
            onError: function(result: any){
                saveHistory('Gagal', data.order_id);
                alert("Top Up Gagal!");
            },
            onClose: function(){
                setLoading(false);
            }
        });

    } catch (error) {
        console.error(error);
        alert("Gagal koneksi ke pembayaran");
        setLoading(false);
    }
  };

  const nominals = [10000, 20000, 50000, 100000, 250000, 500000, 1000000];

  return (
    <>
    <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
        strategy="lazyOnload"
    />
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
                    {nom.toLocaleString('id-ID')}
                </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-40">
           <button 
              onClick={handleTopUp}
              disabled={amount === 0 || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
           >
              {loading ? "Memuat..." : (amount > 0 ? `Bayar Rp ${amount.toLocaleString('id-ID')}` : 'Pilih Nominal')}
           </button>
        </div>
      </div>
    </div>
    </>
  );
}
