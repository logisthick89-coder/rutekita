'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { SkeletonJadwalCard } from '@/components/Skeleton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Jadwal() {
  const [trayek, setTrayek] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [selectedTrayek, setSelectedTrayek] = useState('semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [trayekRes, jadwalRes] = await Promise.all([
        supabase.from('trayek').select('*').order('kode_trayek'),
        supabase.from('jadwal').select('*, trayek(kode_trayek, nama_rute, aktif, jenis, jumlah_armada, jarak_km, hari_operasi)').order('jam_berangkat'),
      ]);
      setTrayek(trayekRes.data || []);
      setJadwal(jadwalRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = selectedTrayek === 'semua' ? jadwal : jadwal.filter(j => j.trayek?.kode_trayek === selectedTrayek);
  const grouped = filtered.reduce((acc, j) => {
    const key = j.trayek?.kode_trayek;
    if (!acc[key]) acc[key] = { info: j.trayek, jadwal: [] };
    acc[key].jadwal.push(j);
    return acc;
  }, {});

  const JENIS_COLOR = {
    kota: 'from-violet-600 to-indigo-600',
    antar: 'from-blue-600 to-cyan-600',
    pedesaan: 'from-emerald-600 to-teal-600',
  };

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-8">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur border-b border-white/10 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>R</div>
          <span className="text-white">Rute<span className="text-violet-400">Kita</span></span>
        </Link>
        <div className="hidden md:flex gap-1">
          {[['/', 'Beranda'], ['/trayek', 'Trayek'], ['/jadwal', 'Jadwal'], ['/tarif', 'Tarif'], ['/peta', 'Peta'], ['/bisnis', 'Bisnis']].map(([href, label]) => (
            <Link key={label} href={href}
              className={`px-3 py-1.5 rounded-full text-sm transition-all
              ${label === 'Jadwal' ? 'bg-violet-500/20 text-violet-300 font-semibold' : label === 'Bisnis' ? 'text-amber-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Jadwal Keberangkatan</h1>
        <p className="text-gray-400 text-sm mb-6">Jadwal angkutan umum Kabupaten Garut</p>

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

        {loading && <div className="flex flex-col gap-4">{[0,1,2].map(i => <SkeletonJadwalCard key={i} />)}</div>}

        {!loading && Object.values(grouped).map(({ info, jadwal: jadwalList }) => (
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

            {/* Info stats: hari operasi + armada + jarak */}
            <div className="px-4 py-3 border-b border-white/10 flex flex-wrap gap-x-5 gap-y-1.5">
              {jadwalList[0]?.hari_operasi && (
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📅</span>
                  <span className="text-xs text-gray-500">Operasi:</span>
                  <span className="text-xs font-medium text-gray-300">{jadwalList[0].hari_operasi}</span>
                </div>
              )}
              {info?.jumlah_armada != null && (
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🚌</span>
                  <span className="text-xs text-gray-500">Armada:</span>
                  <span className="text-xs font-semibold text-violet-300">{info.jumlah_armada} unit</span>
                </div>
              )}
              {info?.jarak_km != null && (
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📍</span>
                  <span className="text-xs text-gray-500">Jarak:</span>
                  <span className="text-xs font-semibold text-emerald-300">{info.jarak_km} km</span>
                </div>
              )}
            </div>

            {/* Grid jam keberangkatan */}
            <div className="p-4 grid grid-cols-4 gap-2">
              {jadwalList.map(j => (
                <div key={j.id} className="bg-white/5 border border-white/10 rounded-xl py-2.5 text-center hover:border-violet-500/50 transition-all">
                  <div className="text-sm font-bold text-white">⏰ {j.jam_berangkat}</div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-3 text-xs text-gray-600">{jadwalList.length} jadwal keberangkatan per hari</div>
          </div>
        ))}

        {!loading && Object.keys(grouped).length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">Jadwal tidak ditemukan.</div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
