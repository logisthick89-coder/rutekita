'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatRp(n) { return 'Rp' + n.toLocaleString('id-ID'); }

export default function Trayek() {
  const [filter, setFilter] = useState('semua');
  const [asal, setAsal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState({ halte: [], jadwal: [], tarif: [] });
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('halte');

  useEffect(() => {
    async function fetchTrayek() {
      const { data: trayek } = await supabase.from('trayek').select('*').order('kode_trayek');
      setData(trayek || []);
      setLoading(false);
    }
    fetchTrayek();
  }, []);

  async function openDetail(trayek) {
    setSelected(trayek);
    setActiveTab('halte');
    setDetailLoading(true);
    const [halteRes, jadwalRes, tarifRes] = await Promise.all([
      supabase.from('halte').select('*').eq('trayek_id', trayek.id).order('urutan'),
      supabase.from('jadwal').select('*').eq('trayek_id', trayek.id).order('jam_berangkat'),
      supabase.from('tarif').select('*').eq('trayek_id', trayek.id),
    ]);
    setDetail({ halte: halteRes.data || [], jadwal: jadwalRes.data || [], tarif: tarifRes.data || [] });
    setDetailLoading(false);
  }

  function closeDetail() { setSelected(null); }
  function swap() { setAsal(tujuan); setTujuan(asal); }

  const filtered = data.filter(d => {
    const cocokFilter = filter === 'semua' || d.jenis === filter;
    const cocokAsal = !asal || d.asal.toLowerCase().includes(asal.toLowerCase());
    const cocokTujuan = !tujuan || d.tujuan.toLowerCase().includes(tujuan.toLowerCase());
    return cocokFilter && cocokAsal && cocokTujuan;
  });

  const JENIS_COLOR = { kota: 'from-violet-600 to-indigo-600', antar: 'from-blue-600 to-cyan-600', pedesaan: 'from-emerald-600 to-teal-600' };

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-0">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur border-b border-white/10 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>R</div>
          <span className="text-white">Rute<span className="text-violet-400">Kita</span></span>
        </Link>
        <div className="hidden md:flex gap-1">
          {[['/', 'Beranda'], ['/trayek', 'Trayek'], ['/jadwal', 'Jadwal'], ['/tarif', 'Tarif'], ['/peta', 'Peta']].map(([href, label]) => (
            <Link key={label} href={href}
              className={`px-3 py-1.5 rounded-full text-sm transition-all
              ${label === 'Trayek' ? 'bg-violet-500/20 text-violet-300 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* HEADER */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Daftar Trayek</h1>
        <p className="text-gray-400 text-sm mb-6">Angkutan umum Kabupaten Garut</p>

        {/* Search */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
          <div className="flex gap-2 mb-3">
            <input value={asal} onChange={e=>setAsal(e.target.value)} placeholder="Dari mana?"
              className="flex-1 h-10 bg-white/10 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500"/>
            <button onClick={swap} className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-white/20">⇄</button>
            <input value={tujuan} onChange={e=>setTujuan(e.target.value)} placeholder="Ke mana?"
              className="flex-1 h-10 bg-white/10 border border-white/10 rounded-xl px-3 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500"/>
          </div>
          <button className="w-full h-10 rounded-xl text-sm font-semibold text-white"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            🔍 Cari Trayek
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {[['semua','Semua'],['kota','Dalam Kota'],['antar','Antar Kecamatan'],['pedesaan','Pedesaan']].map(([val,label]) => (
            <button key={val} onClick={()=>setFilter(val)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
              ${filter===val ? 'text-white border-transparent' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
              style={filter===val ? {background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'} : {}}>
              {label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 text-gray-500 text-sm">Memuat data trayek...</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {!loading && filtered.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-500 text-sm">Trayek tidak ditemukan.</div>
          )}
          {filtered.map(d => (
            <div key={d.id} onClick={() => openDetail(d)}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-violet-500/50 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${JENIS_COLOR[d.jenis] || 'from-gray-600 to-gray-700'}`}>
                  Trayek {d.kode_trayek}
                </span>
                <span className={`text-xs flex items-center gap-1 ${d.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${d.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                  {d.aktif ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="font-bold text-sm text-white mb-1">{d.nama_rute}</div>
              <div className="text-xs text-gray-500 mb-3">Via {d.via}</div>
              <div className="flex pt-3 border-t border-white/10">
                <div className="flex-1 flex items-center gap-1 text-xs text-gray-400">⏰ {d.jam_operasi}</div>
                <div className="flex-1 flex items-center gap-1 text-xs text-gray-400 border-l border-white/10 pl-3">💰 {formatRp(d.tarif_min)}+</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM NAV mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f0f1a]/95 border-t border-white/10 flex h-14 z-40">
        {[['/', '🏠', 'Beranda'], ['/trayek', '🚌', 'Trayek'], ['/peta', '🗺️', 'Peta'], ['/jadwal', '📅', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-all
            ${label === 'Trayek' ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </div>

      {/* OVERLAY */}
      {selected && <div className="fixed inset-0 bg-black/60 z-50" onClick={closeDetail}/>}

      {/* SLIDE UP PANEL */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/10 transition-transform duration-300 ease-in-out
        ${selected ? 'translate-y-0' : 'translate-y-full'}`}
        style={{background: '#16162a', maxHeight: '85vh', display: 'flex', flexDirection: 'column'}}>

        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full"></div>
        </div>

        {selected && (
          <>
            <div className="px-5 pt-3 pb-4 border-b border-white/10 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${JENIS_COLOR[selected.jenis] || 'from-gray-600 to-gray-700'}`}>
                      Trayek {selected.kode_trayek}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${selected.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selected.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {selected.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="font-bold text-base text-white">{selected.nama_rute}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Via {selected.via}</div>
                </div>
                <button onClick={closeDetail} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20 text-lg">×</button>
              </div>
              <div className="flex gap-3 mt-3">
                {[['⏰', 'Jam Operasi', selected.jam_operasi], ['💰', 'Tarif Mulai', formatRp(selected.tarif_min)+'+'], ['📅', 'Hari', selected.hari_operasi]].map(([icon, label, val]) => (
                  <div key={label} className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-center">
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <div className="text-xs font-semibold text-white">{icon} {val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex border-b border-white/10 flex-shrink-0">
              {[['halte','🚏 Halte'],['jadwal','⏰ Jadwal'],['tarif','💰 Tarif']].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-semibold transition-all
                  ${activeTab === tab ? 'text-violet-400 border-b-2 border-violet-400' : 'text-gray-500 hover:text-gray-300'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 pb-8">
              {detailLoading ? (
                <div className="text-center py-8 text-gray-500 text-sm">Memuat detail...</div>
              ) : (
                <>
                  {activeTab === 'halte' && (
                    <div>
                      {detail.halte.length === 0 ? <div className="text-center py-6 text-gray-500 text-sm">Belum ada data halte.</div> : (
                        detail.halte.map((h, i) => (
                          <div key={h.id} className="flex gap-3 mb-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full border-2 mt-0.5 flex-shrink-0
                                ${i === 0 ? 'bg-violet-500 border-violet-500' : i === detail.halte.length-1 ? 'bg-red-400 border-red-400' : 'bg-transparent border-violet-500/50'}`}/>
                              {i < detail.halte.length-1 && <div className="w-0.5 bg-violet-500/20 flex-1 min-h-[20px]"/>}
                            </div>
                            <div className={`pb-3 text-sm ${i === 0 || i === detail.halte.length-1 ? 'font-semibold text-white' : 'text-gray-400'}`}>
                              {h.nama_halte}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {activeTab === 'jadwal' && (
                    <div>
                      {detail.jadwal.length === 0 ? <div className="text-center py-6 text-gray-500 text-sm">Belum ada data jadwal.</div> : (
                        <>
                          {detail.jadwal[0]?.hari_operasi && (
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2 mb-4 text-xs text-violet-300 font-medium">
                              📅 Beroperasi: {detail.jadwal[0].hari_operasi}
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            {detail.jadwal.map(j => (
                              <div key={j.id} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center">
                                <div className="text-sm font-bold text-white">⏰ {j.jam_berangkat}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-gray-500 text-center">{detail.jadwal.length} jadwal keberangkatan/hari</div>
                        </>
                      )}
                    </div>
                  )}
                  {activeTab === 'tarif' && (
                    <div>
                      {detail.tarif.length === 0 ? <div className="text-center py-6 text-gray-500 text-sm">Belum ada data tarif.</div> : (
                        <div className="flex flex-col gap-2">
                          {detail.tarif.map(t => (
                            <div key={t.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                              <div className="text-sm text-gray-300">
                                <span className="font-medium">{t.segmen_asal}</span>
                                <span className="text-gray-600 mx-2">→</span>
                                <span className="font-medium">{t.segmen_tujuan}</span>
                              </div>
                              <div className="text-sm font-bold text-emerald-400">{formatRp(t.harga)}</div>
                            </div>
                          ))}
                          <div className="mt-2 text-xs text-gray-600 text-center">* Tarif dapat berubah sewaktu-waktu</div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
