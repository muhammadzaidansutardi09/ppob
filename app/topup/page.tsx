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

  // Ambil saldo saat ini pas loading
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    setCurrentSaldo(session.saldo || 0);
  }, []);

  // === FUNGSI SIMPAN RIWAYAT ===
  // Fungsi ini dipanggil saat status Pending atau Gagal, dan saat Sukses untuk update
  const saveHistory = (status: string, orderId: string) => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    
    const newHistory = {
        order_id: orderId,
        product_name: 'Isi Saldo',
        price: amount,
        phone: session.phone || '-',
        sku: 'TOPUP', // <--- PENTING! Penanda bahwa ini adalah Top Up
        status: status,
        date: new Date().toLocaleString('id-ID'),
        method: 'Midtrans'
    };

    const history = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    
    // Cek apakah order ini sudah ada? (Misal status 'Menunggu')
    const index = history.findIndex((item: any) => item.order_id === orderId);
    
    if (index !== -1) {
        history[index] = newHistory; // Update statusnya
    } else {
        history.unshift(newHistory); // Tambah baru
    }

    localStorage.setItem('riwayat_transaksi', JSON.stringify(history));
  };

  // === FUNGSI PROSES TOPUP (SUKSES) ===
  // Dilengkapi logika Anti-Double (Idempotency Check)
  const processSuccessTopUp = (orderId: string) => {
    // 1. CEK KEAMANAN: Apakah transaksi ini SUDAH PERNAH sukses sebelumnya?
    const history = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    const existingTrx = history.find((item: any) => item.order_id === orderId);

    // Kalau di riwayat sudah ada dan statusnya 'Sukses', BERHENTI! 
    // Jangan tambah saldo lagi.
    if (existingTrx && existingTrx.status === 'Sukses') {
        console.log("Transaksi sudah diproses sebelumnya. Skip.");
        router.push('/');
        return; 
    }

    // 2. Kalau belum sukses, baru kita proses tambah saldo
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    if (!session.phone) return;

    // Tambah Saldo
    const newBalance = (session.saldo || 0) + amount;

    // Update Session (Tampilan HP)
    session.saldo = newBalance;
    localStorage.setItem('ppob_session', JSON.stringify(session));

    // Update Database Users (Permanen)
    const users = JSON.parse(localStorage.getItem('db_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.phone === session.phone);
    if (userIndex !== -1) {
      users[userIndex].saldo = newBalance;
      localStorage.setItem('db_users', JSON.stringify(users));
    }

    // Simpan/Update Riwayat jadi Sukses
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
        // 1. Minta Token ke Backend
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
        
        // 2. Munculkan Midtrans
        // @ts-ignore
        window.snap.pay(data.token, {
            onSuccess: function(result: any){
                // Panggil fungsi sukses yang aman
                processSuccessTopUp(data.order_id);
            },
            onPending: function(result: any){
                // Simpan status Menunggu
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
          {/* Info Saldo */}
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
                Pembayaran diproses otomatis oleh Midtrans. Saldo akan bertambah instan setelah pembayaran berhasil.
             </p>
          </div>

        </div>

        {/* Bottom Bar */}
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
