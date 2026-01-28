"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { ShieldCheck, Smartphone, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  
  // Ambil data dari URL
  const product_name = searchParams.get('name');
  const price = parseInt(searchParams.get('price') || '0');
  const sku = searchParams.get('sku');
  const phone = searchParams.get('phone');

  const [loading, setLoading] = useState(false);

  // Fungsi Bayar Sekarang
  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Panggil API Backend kita untuk dapat Token
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

      if (!data.token) throw new Error("Gagal mendapatkan token pembayaran");

      // 2. Munculkan Pop-up Midtrans
      // @ts-ignore
      window.snap.pay(data.token, {
        onSuccess: function(result: any){
          alert("Pembayaran Berhasil!");
          window.location.href = "/"; // Redirect ke Home
        },
        onPending: function(result: any){
          alert("Menunggu Pembayaran...");
          window.location.href = "/";
        },
        onError: function(result: any){
          alert("Pembayaran Gagal!");
        },
        onClose: function(){
          alert('Anda menutup popup pembayaran tanpa menyelesaikannya');
        }
      });

    } catch (error) {
      alert("Terjadi kesalahan sistem");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Script Wajib Midtrans (Sandbox) */}
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-0EocBOEFNi15it07" 
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans p-4">
        <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white text-center">
            <h1 className="text-xl font-bold">Konfirmasi Order</h1>
            <p className="text-blue-100 text-sm mt-1">Selesaikan pembayaran Anda</p>
          </div>

          <div className="p-6 flex-1 relative">
            
            {/* Detail Produk */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
              <p className="text-xs text-gray-400 font-bold uppercase mb-2">Detail Produk</p>
              <div className="flex items-center gap-3 mb-4">
                 <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <Smartphone size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800">{product_name}</h3>
                    <p className="text-sm text-gray-500">{sku}</p>
                 </div>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3">
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Nomor Tujuan</p>
                 <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">{phone}</p>
              </div>
            </div>

            {/* Total Bayar */}
            <div className="flex justify-between items-center mb-8">
               <span className="text-gray-500 font-medium">Total Pembayaran</span>
               <span className="text-2xl font-bold text-blue-600">
                 Rp {price.toLocaleString('id-ID')}
               </span>
            </div>

            {/* Info Keamanan */}
            <div className="bg-green-50 p-3 rounded-xl flex items-start gap-2 text-green-700 text-xs mb-8">
               <ShieldCheck size={16} className="mt-0.5" />
               <p>Transaksi ini aman dan terenkripsi. Stok diproses otomatis setelah pembayaran.</p>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="p-6 bg-white border-t border-gray-100">
            <button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : `Bayar Rp ${price.toLocaleString('id-ID')}`}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              Didukung oleh Midtrans Payment Gateway
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
