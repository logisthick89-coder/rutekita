'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatRp(n) { return 'Rp' + n.toLocaleString('id-ID'); }

export default function Home() {
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
      const { data: trayek } = await supabase.from('trayek').select('*');
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
    setDetail({
      halte: halteRes.data || [],
      jadwal: jadwalRes.data || [],
      tarif: tarifRes.data || [],
    });
    setDetailLoading(false);
  }

  function closeDetail() {
    setSelected(null);
    setDetail({ halte: [], jadwal: [], tarif: [] });
  }

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
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm">R</div>
          Rute<span className="text-green-600">Kita</span>
        </Link>
        <div className="flex gap-1">
          {[['/', 'Beranda'], ['/', 'Trayek'], ['/jadwal', 'Jadwal'], ['/tarif', 'Tarif']].map(([href, label]) => (
            <Link key={label} href={href}
              className="px-3 py-1.5 rounded-full text-sm text-gray-500 hover:bg-green-50 hover:text-green-700">
              {label}
            </Link>
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
            <div key={d.id} onClick={() => openDetail(d)}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 flex h-14 z-40">
        {[['/', '🏠', 'Beranda'], ['/', '🚌', 'Trayek'], ['/peta', '🗺️', 'Peta'], ['/jadwal', '📅', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-all
            ${label === 'Jadwal' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}>
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </div>

      {/* OVERLAY */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={closeDetail} />
      )}

      {/* SLIDE UP PANEL */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-in-out
        ${selected ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>

        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
        </div>

        {selected && (
          <>
            <div className="px-5 pt-3 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                      Trayek {selected.kode_trayek}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${selected.aktif ? 'text-green-600' : 'text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selected.aktif ? 'bg-green-500' : 'bg-red-400'}`}></span>
                      {selected.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="font-bold text-base text-gray-800">{selected.nama_rute}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Via {selected.via}</div>
                </div>
                <button onClick={closeDetail}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 text-lg leading-none">
                  ×
                </button>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-gray-400 mb-0.5">Jam Operasi</div>
                  <div className="text-xs font-semibold text-green-700">⏰ {selected.jam_operasi}</div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-gray-400 mb-0.5">Tarif Mulai</div>
                  <div className="text-xs font-semibold text-green-700">💰 {formatRp(selected.tarif_min)}+</div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg px-3 py-2 text-center">
                  <div className="text-xs text-gray-400 mb-0.5">Hari Operasi</div>
                  <div className="text-xs font-semibold text-green-700">📅 {selected.hari_operasi}</div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-gray-100 flex-shrink-0">
              {[['halte','🚏 Halte'],['jadwal','⏰ Jadwal'],['tarif','💰 Tarif']].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-semibold transition-all
                  ${activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400 hover:text-gray-600'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-4 pb-8">
              {detailLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Memuat detail...</div>
              ) : (
                <>
                  {activeTab === 'halte' && (
                    <div>
                      {detail.halte.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">Belum ada data halte.</div>
                      ) : (
                        <div className="relative">
                          {detail.halte.map((h, i) => (
                            <div key={h.id} className="flex gap-3 mb-1">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full border-2 mt-0.5 flex-shrink-0
                                  ${i === 0 ? 'bg-green-600 border-green-600'
                                  : i === detail.halte.length - 1 ? 'bg-red-400 border-red-400'
                                  : 'bg-white border-green-400'}`}>
                                </div>
                                {i < detail.halte.length - 1 && (
                                  <div className="w-0.5 bg-green-200 flex-1 min-h-[20px]"></div>
                                )}
                              </div>
                              <div className={`pb-3 text-sm ${i === 0 || i === detail.halte.length - 1 ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                {h.nama_halte}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'jadwal' && (
                    <div>
                      {detail.jadwal.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">Belum ada data jadwal.</div>
                      ) : (
                        <div>
                          {detail.jadwal[0]?.hari_operasi && (
                            <div className="bg-green-50 rounded-lg px-3 py-2 mb-4 text-xs text-green-700 font-medium">
                              📅 Beroperasi: {detail.jadwal[0].hari_operasi}
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            {detail.jadwal.map((j) => (
                              <div key={j.id} className="bg-gray-50 rounded-lg px-3 py-2.5 text-center border border-gray-100">
                                <div className="text-sm font-bold text-gray-800">⏰ {j.jam_berangkat}</div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-gray-400 text-center">
                            {detail.jadwal.length} jadwal keberangkatan/hari
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tarif' && (
                    <div>
                      {detail.tarif.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-sm">Belum ada data tarif.</div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {detail.tarif.map((t) => (
                            <div key={t.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">{t.segmen_asal}</span>
                                <span className="text-gray-400 mx-2">→</span>
                                <span className="font-medium">{t.segmen_tujuan}</span>
                              </div>
                              <div className="text-sm font-bold text-green-700">{formatRp(t.harga)}</div>
                            </div>
                          ))}
                          <div className="mt-2 text-xs text-gray-400 text-center">
                            * Tarif dapat berubah sewaktu-waktu
                          </div>
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
