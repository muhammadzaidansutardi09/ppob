"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, Contact, Search, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Helper: Deteksi Provider dari Prefix Nomor HP
const detectProvider = (prefix: string) => {
  if (/^08(11|12|13|21|22|52|53|23)/.test(prefix)) return "TELKOMSEL";
  if (/^08(14|15|16|55|56|57|58)/.test(prefix)) return "INDOSAT";
  if (/^08(17|18|19|59|77|78|31|32|33|38)/.test(prefix)) return "XL";
  if (/^08(95|96|97|98|99)/.test(prefix)) return "TRI";
  if (/^08(81|82|83|84|85|86|87|88|89)/.test(prefix)) return "SMARTFREN";
  return null;
};

export default function PulsaPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data produk saat halaman dibuka
  useEffect(() => {
    fetch('/api/digiflazz/products', { method: 'POST' })
      .then(res => res.json())
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      });
  }, []);

  // Handle Input Nomor HP
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Hanya angka
    setPhoneNumber(value);

    // Deteksi provider jika panjang nomor >= 4
    if (value.length >= 4) {
      const detected = detectProvider(value);
      setProvider(detected);
    } else {
      setProvider(null);
    }
  };

  // Filter produk berdasarkan provider yang terdeteksi
  const filteredProducts = products.filter(p => 
    provider ? p.brand.toUpperCase() === provider : true
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center font-sans">
      <div className="w-full max-w-[480px] bg-white min-h-screen relative shadow-2xl">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-4 text-white flex items-center gap-4 sticky top-0 z-50 shadow-md">
          <Link href="/">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-bold text-lg">Isi Pulsa</h1>
        </div>

        {/* INPUT NOMOR HP */}
        <div className="p-6 bg-white border-b border-gray-100 sticky top-[60px] z-40">
          <p className="text-xs text-gray-400 font-bold mb-2 uppercase">Nomor Tujuan</p>
          <div className="relative group">
            <input 
              type="tel" 
              placeholder="Contoh: 0812..." 
              value={phoneNumber}
              onChange={handleInput}
              className="w-full text-xl font-bold border-b-2 border-gray-200 py-2 pr-10 focus:outline-none focus:border-blue-600 transition-colors bg-transparent placeholder:font-normal placeholder:text-gray-300"
            />
            {/* Icon Contact / Logo Provider */}
            <div className="absolute right-0 bottom-2">
              {provider ? (
                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                  {provider}
                </span>
              ) : (
                <Contact className="text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* LIST PRODUK */}
        <div className="p-4 bg-gray-50 min-h-[500px]">
          {loading ? (
             // SKELETON LOADING (Biar keren pas nunggu)
             <div className="space-y-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
               ))}
             </div>
          ) : (
            <div className="space-y-3">
              {/* Tampilkan pesan jika nomor belum diisi */}
              {!provider && phoneNumber.length < 4 && (
                 <div className="text-center py-10 text-gray-400">
                    <Search className="mx-auto mb-2 opacity-50" size={40} />
                    <p className="text-sm">Masukkan nomor HP untuk melihat produk</p>
                 </div>
              )}

              {/* Tampilkan Produk */}
              {provider && filteredProducts.map((product, i) => (
                <div 
                  key={i} 
                  onClick={() => alert(`Beli ${product.product_name} seharga Rp ${product.price}`)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.98] transition cursor-pointer hover:border-blue-300"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{product.product_name}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.desc || "Pulsa Reguler"}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-blue-600 font-bold text-lg">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.buyer_product_status && (
                       <span className="text-[10px] text-green-500 flex items-center justify-end gap-1">
                         <CheckCircle2 size={10} /> Tersedia
                       </span>
                    )}
                  </div>
                </div>
              ))}
              
              {provider && filteredProducts.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p>Produk tidak ditemukan untuk provider ini.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
