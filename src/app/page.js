'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

function formatRp(n) { return 'Rp' + n.toLocaleString('id-ID'); }

export default function Home() {
  const [filter, setFilter] = useState('semua');
  const [asal, setAsal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrayek() {
      const { data: trayek } = await supabase.from('trayek').select('*');
      setData(trayek || []);
      setLoading(false);
    }
    fetchTrayek();
  }, []);

  const filtered = data.filter(d => {
    const cocokFilter = filter === 'semua' || d.jenis === filter;
    const cocokAsal = !asal || d.asal.toLowerCase().includes(asal.toLowerCase());
    const cocokTujuan = !tujuan || d.tujuan.toLowerCase().includes(tujuan.toLowerCase());
    return cocokFilter && cocokAsal && cocokTujuan;
  });

  function swap() { setAsal(tujuan); setTujuan(asal); }

  return (
    <main className="min-h-screen bg-gray-50 font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm">R</div>
          Rute<span className="text-green-600">Kita</span>
        </div>
        <div className="flex gap-1">
          {['Beranda','Trayek','Jadwal','Tarif'].map(m => (
            <button key={m} className="px-3 py-1.5 rounded-full text-sm text-gray-500 hover:bg-green-50 hover:text-green-700">{m}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-br from-green-800 via-green-600 to-green-400 px-6 py-12 text-center">
        <div className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-4">Data dari Dishub Garut</div>
        <h1 className="text-white font-bold text-2xl md:text-3xl mb-2">Cari rute angkutan umum<br/>di Kabupaten Garut</h1>
        <p className="text-white/80 text-sm mb-6">Trayek, jadwal, armada, dan tarif terlengkap</p>
        <div className="bg-white rounded-2xl p-4 max-w-lg mx-auto shadow-lg flex flex-col gap-3">
          <div className="flex gap-2">
            <input value={asal} onChange={e=>setAsal(e.target.value)} placeholder="Dari mana?" className="flex-1 h-10 border border-green-200 rounded-lg px-3 text-sm outline-none focus:border-green-500"/>
            <button onClick={swap} className="w-10 h-10 border border-green-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-50">⇄</button>
            <input value={tujuan} onChange={e=>setTujuan(e.target.value)} placeholder="Ke mana?" className="flex-1 h-10 border border-green-200 rounded-lg px-3 text-sm outline-none focus:border-green-500"/>
          </div>
          <button className="w-full h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold">Cari Trayek</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {[['semua','Semua'],['kota','Dalam Kota'],['antar','Antar Kecamatan'],['pedesaan','Pedesaan']].map(([val,label]) => (
            <button key={val} onClick={()=>setFilter(val)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filter===val ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Memuat data trayek...</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {!loading && filtered.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-400 text-sm">Trayek tidak ditemukan.</div>
          )}
          {filtered.map(d => (
            <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">Trayek {d.kode_trayek}</span>
                <span className={`text-xs flex items-center gap-1 ${d.aktif ? 'text-green-600' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${d.aktif ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  {d.aktif ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="font-bold text-sm text-gray-800 mb-1">{d.nama_rute}</div>
              <div className="text-xs text-gray-400 mb-3">Via {d.via}</div>
              <div className="flex pt-3 border-t border-gray-100">
                <div className="flex-1 flex items-center gap-1 text-xs text-gray-500">⏰ {d.jam_operasi}</div>
                <div className="flex-1 flex items-center gap-1 text-xs text-gray-500 border-l border-gray-100 pl-3">💰 {formatRp(d.tarif_min)}+</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 flex h-14">
        {[['🏠','Beranda'],['🚌','Trayek'],['🗺️','Peta'],['📅','Jadwal']].map(([icon,label]) => (
          <button key={label} className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs text-gray-400 hover:text-green-600">
            <span className="text-lg">{icon}</span>{label}
          </button>
        ))}
      </div>

    </main>
  );
}