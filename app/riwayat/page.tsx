"use client";

import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, XCircle, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import Router

export default function RiwayatPage() {
  const router = useRouter(); // Init Router
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(localStorage.getItem('riwayat_transaksi') || '[]');
      setHistory(data);
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Hapus semua riwayat transaksi?")) {
      localStorage.removeItem('riwayat_transaksi');
      setHistory([]);
    }
  };

  // FUNGSI LANJUTKAN PEMBAYARAN
  const handleRetry = (item: any) => {
    // Redirect ke Checkout dengan data lama
    const params = new URLSearchParams({
        name: item.product_name,
        price: item.price,
        phone: item.phone,
        sku: item.sku || 'RETRY' // Fallback jika sku tidak tersimpan
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const getStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('sukses') || s.includes('success')) return 'bg-green-100 text-green-700 border-green-200';
    if (s.includes('gagal') || s.includes('fail')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-orange-100 text-orange-700 border-orange-200'; 
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl flex flex-col">
        
        <div className="bg-white p-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition">
                <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <h1 className="font-bold text-lg text-gray-800">Riwayat Transaksi</h1>
          </div>
          {history.length > 0 && (
            <button onClick={clearHistory} className="p-2 hover:bg-red-50 text-red-500 rounded-full">
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="p-4 space-y-4 flex-1 bg-gray-50 pb-20">
          
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-32 text-gray-400 opacity-60">
               <ShoppingBag size={60} className="mb-4" />
               <p>Belum ada riwayat transaksi.</p>
               <Link href="/pulsa" className="mt-4 text-blue-600 font-bold text-sm">
                 Mulai Transaksi
               </Link>
            </div>
          ) : (
            history.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 transition hover:shadow-md relative overflow-hidden">
                
                {/* Baris 1: ID & Status */}
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                      <p className="text-xs font-mono text-gray-600 mt-0.5">{item.order_id}</p>
                   </div>
                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${getStatusColor(item.status)}`}>
                      {getStatusColor(item.status).includes('green') ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {item.status}
                   </span>
                </div>

                {/* Baris 2: Produk & Harga */}
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-100">
                   <div>
                      <h3 className="font-bold text-gray-800 text-sm">{item.product_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.phone}</p>
                   </div>
                   <p className="font-bold text-blue-600 text-base">
                      Rp {item.price ? item.price.toLocaleString('id-ID') : '0'}
                   </p>
                </div>

                {/* Baris 3: Tanggal & Action Button */}
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-400">
                        {item.date}
                    </span>
                    
                    {/* TOMBOL BAYAR (Hanya Muncul Jika Status Menunggu) */}
                    {(item.status === 'Menunggu' || item.status === 'Pending') && (
                        <button 
                            onClick={() => handleRetry(item)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition shadow-blue-200 shadow-md"
                        >
                            Bayar Sekarang <ArrowRight size={12} />
                        </button>
                    )}
                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}
