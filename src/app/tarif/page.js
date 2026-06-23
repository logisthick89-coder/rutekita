'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { SkeletonTarifCard } from '@/components/Skeleton';

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
        supabase.from('tarif').select('*, trayek(kode_trayek, nama_rute, aktif, jenis, jumlah_armada, jarak_km)'),
      ]);
      setTrayek(trayekRes.data || []);
      setTarif(tarifRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = selectedTrayek === 'semua' ? tarif : tarif.filter(t => t.trayek?.kode_trayek === selectedTrayek);
  const grouped = filtered.reduce((acc, t) => {
    const key = t.trayek?.kode_trayek;
    if (!acc[key]) acc[key] = { info: t.trayek, tarif: [] };
    acc[key].tarif.push(t);
    return acc;
  }, {});

  const JENIS_COLOR = {
    kota: 'from-violet-600 to-indigo-600',
    antar: 'from-blue-600 to-cyan-600',
    pedesaan: 'from-emerald-600 to-teal-600',
  };

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-8">

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Tarif Angkutan</h1>
        <p className="text-gray-400 text-sm mb-6">Informasi tarif per segmen rute di Kabupaten Garut</p>

        {/* Filter Trayek */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <button onClick={() => setSelectedTrayek('semua')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${selectedTrayek === 'semua' ? 'text-white border-transparent' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            style={selectedTrayek === 'semua' ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
            Semua Trayek
          </button>
          {trayek.map(t => (
            <button key={t.kode_trayek} onClick={() => setSelectedTrayek(t.kode_trayek)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${selectedTrayek === t.kode_trayek ? 'text-white border-transparent' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
              style={selectedTrayek === t.kode_trayek ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
              Trayek {t.kode_trayek}
            </button>
          ))}
        </div>

        {loading && <div className="flex flex-col gap-4">{[0,1,2].map(i => <SkeletonTarifCard key={i} />)}</div>}

        {!loading && Object.values(grouped).map(({ info, tarif: tarifList }) => (
          <div key={info?.kode_trayek} className="bg-white/5 border border-white/10 rounded-2xl mb-4 overflow-hidden">

            {/* Header kartu */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${JENIS_COLOR[info?.jenis] || 'from-gray-600 to-gray-700'}`}>
                  Trayek {info?.kode_trayek}
                </span>
                <span className="text-sm font-semibold text-white">{info?.nama_rute}</span>
              </div>
              <span className={`text-xs flex items-center gap-1 ${info?.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${info?.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                {info?.aktif ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            {/* Info bar: armada & jarak */}
            {(info?.jumlah_armada != null || info?.jarak_km != null) && (
              <div className="px-4 py-3 border-b border-white/10 flex flex-wrap gap-x-5 gap-y-1.5">
                {info?.jumlah_armada != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-base"></span>
                    <span className="text-xs text-gray-500">Armada:</span>
                    <span className="text-xs font-semibold text-violet-300">{info.jumlah_armada} unit</span>
                  </div>
                )}
                {info?.jarak_km != null && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-base"></span>
                    <span className="text-xs text-gray-500">Jarak:</span>
                    <span className="text-xs font-semibold text-emerald-300">{info.jarak_km} km</span>
                  </div>
                )}
              </div>
            )}

            {/* Tabel tarif */}
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 grid grid-cols-3">
              <div className="text-xs font-semibold text-gray-500">Dari</div>
              <div className="text-xs font-semibold text-gray-500">Ke</div>
              <div className="text-xs font-semibold text-gray-500 text-right">Tarif</div>
            </div>
            <div className="divide-y divide-white/5">
              {tarifList.map(t => (
                <div key={t.id} className="grid grid-cols-3 items-center px-4 py-3 hover:bg-white/5 transition-all">
                  <div className="text-sm text-gray-300">{t.segmen_asal}</div>
                  <div className="text-sm text-gray-300">{t.segmen_tujuan}</div>
                  <div className="text-sm font-bold text-emerald-400 text-right">{formatRp(t.harga)}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-3 pt-2 text-xs text-gray-600">* Tarif dapat berubah sewaktu-waktu</div>
          </div>
        ))}

        {!loading && Object.keys(grouped).length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">Data tarif tidak ditemukan.</div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}



