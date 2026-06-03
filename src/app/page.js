'use client';
import { useState } from 'react';

const DATA = [
  { id:1, kode:'01', nama:'Garut Kota — Tarogong', asal:'Terminal Guntur Garut', tujuan:'Tarogong Kidul', via:'Jl. Ciledug — Jl. Pembangunan', jenis:'kota', tarif_min:3000, jam:'05.30 – 18.00', hari:'Senin – Minggu', aktif:true },
  { id:2, kode:'02', nama:'Garut Kota — Cibatu', asal:'Terminal Guntur Garut', tujuan:'Terminal Cibatu', via:'Jl. Otista — Jl. Raya Cibatu', jenis:'antar', tarif_min:5000, jam:'05.00 – 17.30', hari:'Senin – Sabtu', aktif:true },
  { id:3, kode:'03', nama:'Garut Kota — Leles', asal:'Terminal Guntur Garut', tujuan:'Leles', via:'Jl. Raya Leles', jenis:'antar', tarif_min:4000, jam:'06.00 – 17.00', hari:'Senin – Minggu', aktif:true },
  { id:4, kode:'04', nama:'Garut Kota — Wanaraja', asal:'Terminal Guntur Garut', tujuan:'Wanaraja', via:'Jl. Raya Wanaraja', jenis:'kota', tarif_min:3000, jam:'06.00 – 17.00', hari:'Senin – Sabtu', aktif:true },
  { id:5, kode:'05', nama:'Garut Kota — Kadungora', asal:'Terminal Guntur Garut', tujuan:'Kadungora', via:'Jl. Raya Kadungora', jenis:'antar', tarif_min:5000, jam:'05.30 – 16.00', hari:'Senin – Jumat', aktif:true },
  { id:6, kode:'06', nama:'Garut Kota — Malangbong', asal:'Terminal Guntur Garut', tujuan:'Malangbong', via:'Jl. Raya Malangbong', jenis:'pedesaan', tarif_min:7000, jam:'06.00 – 15.00', hari:'Senin – Sabtu', aktif:false },
];

function formatRp(n) { return 'Rp' + n.toLocaleString('id-ID'); }

export default function Home() {
  const [filter, setFilter] = useState('semua');
  const [asal, setAsal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [hasil, setHasil] = useState(null);

  const filtered = hasil !== null ? hasil :
    filter === 'semua' ? DATA : DATA.filter(d => d.jenis === filter);

  function cariTrayek() {
    const a = asal.toLowerCase();
    const t = tujuan.toLowerCase();
    if (!a && !t) { setHasil(null); return; }
    setHasil(DATA.filter(d =>
      (!a || d.asal.toLowerCase().includes(a) || d.tujuan.toLowerCase().includes(a)) &&
      (!t || d.tujuan.toLowerCase().includes(t) || d.asal.toLowerCase().includes(t))
    ));
  }

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
          <button onClick={cariTrayek} className="w-full h-11 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold">Cari Trayek</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* FILTER */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {[['semua','Semua'],['kota','Dalam Kota'],['antar','Antar Kecamatan'],['pedesaan','Pedesaan']].map(([val,label]) => (
            <button key={val} onClick={()=>{setFilter(val);setHasil(null);}}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filter===val && hasil===null ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* GRID KARTU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-400 text-sm">Trayek tidak ditemukan.</div>
          )}
          {filtered.map(d => (
            <div key={d.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">Trayek {d.kode}</span>
                <span className={`text-xs flex items-center gap-1 ${d.aktif ? 'text-green-600' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${d.aktif ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  {d.aktif ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="font-bold text-sm text-gray-800 mb-1">{d.nama}</div>
              <div className="text-xs text-gray-400 mb-3">Via {d.via}</div>
              <div className="flex gap-0 pt-3 border-t border-gray-100">
                <div className="flex-1 flex items-center gap-1 text-xs text-gray-500">⏰ {d.jam}</div>
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