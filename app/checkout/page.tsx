"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import Script from 'next/script';
import { ShieldCheck, Smartphone, ArrowLeft, Wallet, QrCode } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const product_name = searchParams.get('name') || "Produk PPOB";
  const price = parseInt(searchParams.get('price') || '0');
  const sku = searchParams.get('sku');
  const phone = searchParams.get('phone');

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'saldo' | 'midtrans'>('saldo');
  const [userSaldo, setUserSaldo] = useState(0);

  // Ambil saldo user saat ini
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
    setUserSaldo(session.saldo || 0);
  }, []);

  // Helper Simpan Riwayat
  const saveToHistory = (status: string, orderId: string, method: string) => {
    const newHistory = {
      order_id: orderId,
      product_name: product_name,
      price: price,
      phone: phone,
      status: status,
      date: new Date().toLocaleString('id-ID'),
      method: method
    };
    const existingData = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    localStorage.setItem('riwayat_transaksi', JSON.stringify([newHistory, ...existingData]));
  };

  const handleProcess = async () => {
    if (!sku || !phone) return alert("Data tidak valid.");
    setLoading(true);

    // === OPSI 1: BAYAR PAKAI SALDO ===
    if (paymentMethod === 'saldo') {
        if (userSaldo < price) {
            alert("Saldo tidak cukup! Silakan Top Up atau pilih metode lain.");
            setLoading(false);
            return;
        }

        // Potong Saldo
        const session = JSON.parse(localStorage.getItem('ppob_session') || '{}');
        const newBalance = (session.saldo || 0) - price;
        session.saldo = newBalance;
        localStorage.setItem('ppob_session', JSON.stringify(session));

        // Update DB User juga
        const users = JSON.parse(localStorage.getItem('db_users') || '[]');
        const uIdx = users.findIndex((u: any) => u.phone === session.phone);
        if(uIdx !== -1) {
            users[uIdx].saldo = newBalance;
            localStorage.setItem('db_users', JSON.stringify(users));
        }

        // Simpan Riwayat
        saveToHistory('Sukses', `TRX-SALDO-${Date.now()}`, 'Saldo');
        
        setTimeout(() => {
            alert("Pembayaran Berhasil via Saldo!");
            router.push('/riwayat');
        }, 1000);
    } 
    
    // === OPSI 2: BAYAR PAKAI MIDTRANS (QRIS/VA) ===
    else {
        try {
            const res = await fetch('/api/transaction/create', {
                method: 'POST',
                body: JSON.stringify({
                    sku_code: sku,
                    product_name: product_name,
                    customer_no: phone,
                    amount: price
                })
            });
            const data = await res.json();

            // @ts-ignore
            window.snap.pay(data.token, {
                onSuccess: function(result: any){
                    saveToHistory('Sukses', data.order_id, 'Midtrans');
                    alert("Pembayaran Berhasil!");
                    router.push('/riwayat');
                },
                onPending: function(result: any){
                    saveToHistory('Menunggu', data.order_id, 'Midtrans');
                    alert("Menunggu Pembayaran...");
                    router.push('/riwayat');
                },
                onError: function(result: any){
                    saveToHistory('Gagal', data.order_id, 'Midtrans');
                    alert("Gagal!");
                },
                onClose: function(){
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-50 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-800">Konfirmasi Pembayaran</h1>
      </div>

      <div className="p-6 flex-1">
        {/* Detail Produk */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Smartphone size={24} />
                </div>
                <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{product_name}</h3>
                <p className="text-xs text-gray-400 mt-1 font-mono">{sku}</p>
                </div>
            </div>
            <div className="border-t border-dashed border-gray-200 my-4"></div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Total Tagihan</span>
                <span className="font-extrabold text-xl text-blue-600">Rp {price.toLocaleString('id-ID')}</span>
            </div>
        </div>

        {/* PILIH METODE PEMBAYARAN */}
        <p className="text-sm font-bold text-gray-700 mb-3">Metode Pembayaran</p>
        <div className="space-y-3">
            
            {/* Opsi 1: Saldo */}
            <div 
                onClick={() => setPaymentMethod('saldo')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all
                ${paymentMethod === 'saldo' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Wallet size={20} /></div>
                    <div>
                        <p className="font-bold text-sm text-gray-800">Saldo Akun</p>
                        <p className="text-xs text-gray-500">Sisa: Rp {userSaldo.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'saldo' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'saldo' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
            </div>

            {/* Opsi 2: Midtrans */}
            <div 
                onClick={() => setPaymentMethod('midtrans')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all
                ${paymentMethod === 'midtrans' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600"><QrCode size={20} /></div>
                    <div>
                        <p className="font-bold text-sm text-gray-800">QRIS / Transfer Bank</p>
                        <p className="text-xs text-gray-500">Proses via Midtrans</p>
                    </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'midtrans' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'midtrans' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
            </div>

        </div>

        {/* Warning kalau saldo kurang */}
        {paymentMethod === 'saldo' && userSaldo < price && (
             <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg flex gap-2 items-center font-medium">
                <ShieldCheck size={16} /> Saldo tidak cukup. Silakan pilih QRIS atau Top Up dulu.
             </div>
        )}

      </div>

      {/* Tombol Bayar */}
      <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-40">
        <button 
            onClick={handleProcess}
            disabled={loading || (paymentMethod === 'saldo' && userSaldo < price)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            {loading ? "Memproses..." : `Bayar Rp ${price.toLocaleString('id-ID')}`}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
        <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
           <CheckoutContent />
        </Suspense>
      </div>
    </>
  );
}
