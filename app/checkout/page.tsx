"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Script from 'next/script';
import { ShieldCheck, Smartphone, ArrowLeft } from 'lucide-react';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const product_name = searchParams.get('name') || "Produk PPOB";
  const price = parseInt(searchParams.get('price') || '0');
  const sku = searchParams.get('sku');
  const phone = searchParams.get('phone');

  const [loading, setLoading] = useState(false);

  // === FUNGSI SIMPAN KE MEMORI HP (LOCALSTORAGE) ===
  const saveToHistory = (status: string, orderId: string) => {
    const newHistory = {
      order_id: orderId,
      product_name: product_name,
      price: price,
      phone: phone,
      status: status, // 'success', 'pending', 'failed'
      date: new Date().toLocaleString('id-ID'),
    };

    // Ambil data lama
    const existingData = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
    // Tambah data baru di paling atas
    localStorage.setItem('riwayat_transaksi', JSON.stringify([newHistory, ...existingData]));
  };

  const handlePayment = async () => {
    if (!sku || !phone) {
      alert("Data tidak valid.");
      router.push('/pulsa');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku_code: sku,
          product_name: product_name,
          customer_no: phone,
          amount: price
        })
      });
      
      const data = await res.json();
      if (!data.token) throw new Error("Gagal generate token");

      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: function(result: any){
          saveToHistory('Sukses', data.order_id); // SIMPAN STATUS SUKSES
          alert("Pembayaran Berhasil!");
          router.push('/riwayat'); // LANGSUNG KE HALAMAN RIWAYAT
        },
        onPending: function(result: any){
          saveToHistory('Menunggu', data.order_id); // SIMPAN STATUS PENDING
          alert("Menunggu Pembayaran...");
          router.push('/riwayat');
        },
        onError: function(result: any){
          saveToHistory('Gagal', data.order_id);
          alert("Pembayaran Gagal!");
        },
        onClose: function(){
          setLoading(false);
        }
      });

    } catch (error) {
      alert("Terjadi kesalahan sistem.");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 sticky top-0 z-50 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-800">Checkout</h1>
      </div>

      <div className="p-6 flex-1">
        {/* Detail Produk */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-3 tracking-wider">Item Dibeli</p>
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
                <span className="text-sm text-gray-500 font-medium">Nomor Tujuan</span>
                <span className="font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg tracking-wider">{phone}</span>
            </div>
        </div>

        {/* Total Bayar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Total Tagihan</span>
                <span className="text-2xl font-extrabold text-blue-600">Rp {price.toLocaleString('id-ID')}</span>
            </div>
        </div>
      </div>

      {/* Tombol Bayar */}
      <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-40">
        <button 
            onClick={handlePayment}
            disabled={loading}
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
        data-client-key="SB-Mid-client-0EocBOEFNi15it07" 
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
