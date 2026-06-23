'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
 
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
 
function formatRp(n) { return 'Rp' + n.toLocaleString('id-ID'); }
 
export default function Tarif() {
  const [trayek, setTrayek] = useState([]);
  const [tarif, setTarif] = useState([]);
  const [selectedTrayek, setSelectedTrayek] = useState('semua');
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchData() {
      const [trayekRes, tarifRes] = await Promise.all([
        supabase.from('trayek').select('*').order('kode_trayek'),
        supabase.from('tarif').select('*, trayek(kode_trayek, nama_rute, aktif)'),
      ]);
      setTrayek(trayekRes.data || []);
      setTarif(tarifRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);
 
  const filtered = selectedTrayek === 'semua'
    ? tarif
    : tarif.filter(t => t.trayek?.kode_trayek === selectedTrayek);
 
  const grouped = filtered.reduce((acc, t) => {
    const key = t.trayek?.kode_trayek;
    if (!acc[key]) acc[key] = { info: t.trayek, tarif: [] };
    acc[key].tarif.push(t);
    return acc;
  }, {});
 
  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-20">
 
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm">R</div>
          Rute<span className="text-green-600">Kita</span>
        </Link>
        <div className="flex gap-1">
          {[['/', 'Beranda'], ['/', 'Trayek'], ['/jadwal', 'Jadwal'], ['/tarif', 'Tarif']].map(([href, label]) => (
            <Link key={label} href={href}
              className={`px-3 py-1.5 rounded-full text-sm transition-all
              ${label === 'Tarif' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
 
      {/* HEADER */}
      <div className="bg-gradient-to-br from-green-800 via-green-600 to-green-400 px-6 py-10 text-center">
        <h1 className="text-white font-bold text-2xl mb-2">Tarif Angkutan</h1>
        <p className="text-white/80 text-sm">Informasi tarif per segmen rute di Kabupaten Garut</p>
      </div>
 
      {/* FILTER */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => setSelectedTrayek('semua')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${selectedTrayek === 'semua' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'}`}>
            Semua Trayek
          </button>
          {trayek.map(t => (
            <button key={t.kode_trayek} onClick={() => setSelectedTrayek(t.kode_trayek)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${selectedTrayek === t.kode_trayek ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'}`}>
              Trayek {t.kode_trayek}
            </button>
          ))}
        </div>
 
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Memuat data tarif...</div>
        )}
 
        {/* TARIF PER TRAYEK */}
        {!loading && Object.values(grouped).map(({ info, tarif: tarifList }) => (
          <div key={info?.kode_trayek} className="bg-white rounded-xl border border-gray-100 mb-4 overflow-hidden shadow-sm">
            {/* Header kartu */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-green-50">
              <div>
                <span className="text-xs font-semibold bg-green-600 text-white px-2.5 py-1 rounded-full mr-2">
                  Trayek {info?.kode_trayek}
                </span>
                <span className="text-sm font-semibold text-gray-800">{info?.nama_rute}</span>
              </div>
              <span className={`text-xs flex items-center gap-1 ${info?.aktif ? 'text-green-600' : 'text-red-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${info?.aktif ? 'bg-green-500' : 'bg-red-400'}`}></span>
                {info?.aktif ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
 
            {/* Tabel tarif */}
            <div className="divide-y divide-gray-50">
              {/* Header tabel */}
              <div className="flex px-4 py-2 bg-gray-50">
                <div className="flex-1 text-xs font-semibold text-gray-400">Dari</div>
                <div className="flex-1 text-xs font-semibold text-gray-400">Ke</div>
                <div className="text-xs font-semibold text-gray-400">Tarif</div>
              </div>
              {tarifList.map(t => (
                <div key={t.id} className="flex items-center px-4 py-3">
                  <div className="flex-1 text-sm text-gray-700">{t.segmen_asal}</div>
                  <div className="flex-1 flex items-center gap-1 text-sm text-gray-700">
                    <span className="text-gray-300 mr-1"></span>
                    {t.segmen_tujuan}
                  </div>
                  <div className="text-sm font-bold text-green-700">{formatRp(t.harga)}</div>
                </div>
              ))}
            </div>
 
            <div className="px-4 pb-3 pt-1 text-xs text-gray-400">
              * Tarif dapat berubah sewaktu-waktu
            </div>
          </div>
        ))}
 
        {!loading && Object.keys(grouped).length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">Data tarif tidak ditemukan.</div>
        )}
      </div>
 
      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 flex h-14 z-40">
        {[['/', '', 'Beranda'], ['/', '', 'Trayek'], ['/peta', '', 'Peta'], ['/jadwal', '', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs text-gray-400 hover:text-green-600">
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </div>
 
    </main>
  );
}
