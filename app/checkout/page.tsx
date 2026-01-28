"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react'; // Wajib import Suspense
import Script from 'next/script';
import { ShieldCheck, Smartphone, ArrowLeft } from 'lucide-react';

// === 1. KOMPONEN ISI (LOGIKA UTAMA) ===
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ambil data dari URL dengan aman
  const product_name = searchParams.get('name') || "Produk PPOB";
  const price = parseInt(searchParams.get('price') || '0');
  const sku = searchParams.get('sku');
  const phone = searchParams.get('phone');

  const [loading, setLoading] = useState(false);

  // Fungsi Bayar Sekarang
  const handlePayment = async () => {
    if (!sku || !phone) {
      alert("Data transaksi tidak valid. Silakan ulangi pembelian.");
      router.push('/pulsa');
      return;
    }

    setLoading(true);
    try {
      // 1. Panggil API Backend
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

      if (!data.token) throw new Error("Gagal mendapatkan token pembayaran");

      // 2. Munculkan Pop-up Midtrans
      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: function(result: any){
          alert("Pembayaran Berhasil! Pulsa akan segera masuk.");
          router.push('/'); // Redirect ke Home
        },
        onPending: function(result: any){
          alert("Menunggu Pembayaran...");
          router.push('/');
        },
        onError: function(result: any){
          alert("Pembayaran Gagal!");
        },
        onClose: function(){
          setLoading(false); // Matikan loading jika popup ditutup
        }
      });

    } catch (error) {
      alert("Terjadi kesalahan sistem saat memproses transaksi.");
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
        {/* Detail Produk Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 p-5 mb-6">
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

        {/* Rincian Bayar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">Harga Produk</span>
                <span className="font-bold text-gray-800">Rp {price.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Biaya Layanan</span>
                <span className="font-bold text-green-600">Gratis</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Tagihan</span>
                <span className="text-2xl font-extrabold text-blue-600">Rp {price.toLocaleString('id-ID')}</span>
            </div>
        </div>

        {/* Info Keamanan */}
        <div className="mt-6 bg-green-50 p-4 rounded-xl flex items-start gap-3 text-green-700 text-xs border border-green-100">
            <ShieldCheck size={18} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">Pembayaran Anda diproses secara aman oleh Midtrans. Stok produk akan diproses otomatis setelah pembayaran terverifikasi.</p>
        </div>
      </div>

      {/* Bottom Bar (Sticky) */}
      <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-40">
        <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
            {loading ? (
                <>Processing...</>
            ) : (
                `Bayar Rp ${price.toLocaleString('id-ID')}`
            )}
        </button>
        <div className="flex justify-center items-center gap-1 mt-3 opacity-60">
            <span className="text-[10px] text-gray-500">Secure Payment by</span>
            <span className="font-bold text-[10px] text-blue-800">Midtrans</span>
        </div>
      </div>
    </div>
  );
}

// === 2. KOMPONEN PEMBUNGKUS (FIX ERROR BUILD VERCEL) ===
export default function CheckoutPage() {
  return (
    <>
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-0EocBOEFNi15it07" 
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
        {/* Suspense membungkus konten yang membaca URL */}
        <Suspense fallback={
            <div className="w-full max-w-[480px] bg-white min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
           <CheckoutContent />
        </Suspense>
      </div>
    </>
  );
}
