'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { SkeletonTrayekCard } from '@/components/Skeleton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatRp(n) { return 'Rp' + n.toLocaleString('id-ID'); }

const JENIS_COLOR = {
  kota: 'from-violet-600 to-indigo-600',
  antar: 'from-blue-600 to-cyan-600',
  pedesaan: 'from-emerald-600 to-teal-600'
};

export default function Trayek() {
  const [filter, setFilter] = useState('semua');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('list');
  const [selected, setSelected] = useState(null);
  const [asalHalte, setAsalHalte] = useState(null);
  const [tujuanHalte, setTujuanHalte] = useState(null);
  const [detail, setDetail] = useState({ halte: [], jadwal: [], tarif: [] });
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rute');

  useEffect(() => {
    async function fetchTrayek() {
      const { data: trayek } = await supabase.from('trayek').select('*').order('kode_trayek');
      setData(trayek || []);
      setLoading(false);
    }
    fetchTrayek();
  }, []);

  async function pilihTrayek(trayek) {
    setSelected(trayek);
    setAsalHalte(null);
    setTujuanHalte(null);
    setDetailLoading(true);
    setStep('rute');
    const [halteRes, jadwalRes, tarifRes] = await Promise.all([
      supabase.from('halte').select('*').eq('trayek_id', trayek.id).order('urutan'),
      supabase.from('jadwal').select('*').eq('trayek_id', trayek.id).order('jam_berangkat'),
      supabase.from('tarif').select('*').eq('trayek_id', trayek.id),
    ]);
    setDetail({ halte: halteRes.data || [], jadwal: jadwalRes.data || [], tarif: tarifRes.data || [] });
    setDetailLoading(false);
  }

  function pilihAsal(halte) { setAsalHalte(halte); setTujuanHalte(null); }
  function pilihTujuan(halte) {
    if (asalHalte && halte.urutan <= asalHalte.urutan) return;
    setTujuanHalte(halte); setStep('detail'); setActiveTab('rute');
  }
  function kembaliKeList() { setStep('list'); setSelected(null); setAsalHalte(null); setTujuanHalte(null); }
  function kembaliKeRute() { setStep('rute'); setTujuanHalte(null); setActiveTab('rute'); }

  const ruteSegmen = () => {
    if (!asalHalte || !tujuanHalte) return [];
    return detail.halte.filter(h => h.urutan >= asalHalte.urutan && h.urutan <= tujuanHalte.urutan);
  };
  const totalJarak = () => ruteSegmen().slice(0, -1).reduce((sum, h) => sum + (h.jarak_ke_berikutnya || 0), 0).toFixed(1);
  const filtered = data.filter(d => filter === 'semua' || d.jenis === filter);

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-0">
      <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur border-b border-white/10 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>R</div>
          <span className="text-white">Rute<span className="text-violet-400">Kita</span></span>
        </Link>
        <div className="hidden md:flex gap-1">
          {[['/', 'Beranda'], ['/trayek', 'Trayek'], ['/jadwal', 'Jadwal'], ['/tarif', 'Tarif'], ['/peta', 'Peta'], ['/bisnis', 'Bisnis']].map(([href, label]) => (
            <Link key={label} href={href}
              className={`px-3 py-1.5 rounded-full text-sm transition-all
              ${label === 'Trayek' ? 'bg-violet-500/20 text-violet-300 font-semibold' : label === 'Bisnis' ? 'text-amber-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="px-4 py-6 max-w-4xl mx-auto">

        {step === 'list' && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Pilih Trayek</h1>
              <p className="text-gray-400 text-sm">Pilih trayek yang ingin kamu gunakan</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {[['semua','Semua'],['kota','Dalam Kota'],['antar','Antar Kecamatan'],['pedesaan','Pedesaan']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                  ${filter === val ? 'text-white border-transparent' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
                  style={filter === val ? {background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'} : {}}>
                  {label}
                </button>
              ))}
            </div>
            {loading && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{[0,1,2,3].map(i => <SkeletonTrayekCard key={i} />)}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(d => (
                <div key={d.id} onClick={() => pilihTrayek(d)}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-violet-500/50 hover:bg-white/10 transition-all cursor-pointer group">
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
                  <div className="grid grid-cols-3 pt-3 border-t border-white/10 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-0.5">Jam</div>
                      <div className="text-xs text-white font-medium">{d.jam_operasi}</div>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <div className="text-xs text-gray-500 mb-0.5">Armada</div>
                      <div className="text-xs text-white font-medium">{d.jumlah_armada || '-'} unit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-0.5">Jarak</div>
                      <div className="text-xs text-white font-medium">{d.jarak_km || '-'} km</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'rute' && selected && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={kembaliKeList}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20">←</button>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${JENIS_COLOR[selected.jenis] || 'from-gray-600 to-gray-700'}`}>
                    Trayek {selected.kode_trayek}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${selected.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selected.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    {selected.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{selected.nama_rute}</h2>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[['🚌', 'Armada', `${selected.jumlah_armada || '-'} unit`],['📏', 'Total Jarak', `${selected.jarak_km || '-'} km`],['⏰', 'Jam Operasi', selected.jam_operasi]].map(([icon, label, val]) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-xs font-semibold text-white">{val}</div>
                </div>
              ))}
            </div>
            {detailLoading ? (
              <div className="text-center py-12 text-gray-500 text-sm">Memuat rute...</div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-white font-semibold mb-1">
                    {!asalHalte ? '📍 Pilih titik naik (asal)' : '🏁 Pilih titik turun (tujuan)'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {!asalHalte ? 'Kamu bisa naik dari titik mana saja sepanjang rute'
                      : `Naik dari: ${asalHalte.nama_halte} — pilih titik turun`}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  {detail.halte.map((h, i) => {
                    const isAsal = asalHalte?.id === h.id;
                    const isTujuan = tujuanHalte?.id === h.id;
                    const dalamSegmen = asalHalte && h.urutan >= asalHalte.urutan && (!tujuanHalte || h.urutan <= tujuanHalte.urutan);
                    const bisaDipilih = !asalHalte || (asalHalte && h.urutan > asalHalte.urutan);
                    return (
                      <div key={h.id}>
                        <div className={`flex gap-3 items-start rounded-xl p-2 transition-all
                          ${bisaDipilih ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'}
                          ${isAsal ? 'bg-violet-500/20' : ''} ${isTujuan ? 'bg-emerald-500/20' : ''}`}
                          onClick={() => { if (!asalHalte) pilihAsal(h); else if (h.urutan > asalHalte.urutan) pilihTujuan(h); }}>
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 mt-0.5
                              ${isAsal ? 'bg-violet-500 border-violet-500' : isTujuan ? 'bg-emerald-500 border-emerald-500' :
                                dalamSegmen ? 'bg-violet-500/40 border-violet-500/60' :
                                i === 0 ? 'bg-blue-500 border-blue-500' :
                                i === detail.halte.length - 1 ? 'bg-red-400 border-red-400' : 'bg-transparent border-gray-600'}`}/>
                            {i < detail.halte.length - 1 && (
                              <div className={`w-0.5 my-0.5 ${dalamSegmen ? 'bg-violet-500/50' : 'bg-white/10'}`} style={{height: '24px'}}/>
                            )}
                          </div>
                          <div className="flex-1 pb-1">
                            <div className={`text-sm font-medium ${isAsal ? 'text-violet-300' : isTujuan ? 'text-emerald-300' :
                              i === 0 || i === detail.halte.length - 1 ? 'text-white' : 'text-gray-400'}`}>
                              {h.nama_halte}
                              {isAsal && <span className="ml-2 text-xs bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded-full">Naik</span>}
                              {isTujuan && <span className="ml-2 text-xs bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full">Turun</span>}
                            </div>
                            {h.jarak_ke_berikutnya > 0 && i < detail.halte.length - 1 && (
                              <div className="text-xs text-gray-600 mt-0.5">↕ {h.jarak_ke_berikutnya} km ke titik berikutnya</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {asalHalte && (
                  <button onClick={() => { setAsalHalte(null); setTujuanHalte(null); }}
                    className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-all">↩ Reset pilihan</button>
                )}
              </>
            )}
          </>
        )}

        {step === 'detail' && selected && asalHalte && tujuanHalte && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={kembaliKeRute}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20">←</button>
              <div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${JENIS_COLOR[selected.jenis] || 'from-gray-600 to-gray-700'}`}>
                  Trayek {selected.kode_trayek}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selected.nama_rute}</h2>
              </div>
            </div>
            <div className="bg-white/5 border border-violet-500/30 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Dari</div>
                  <div className="text-sm font-bold text-violet-300">📍 {asalHalte.nama_halte}</div>
                </div>
                <div className="text-gray-600">→</div>
                <div className="flex-1 text-right">
                  <div className="text-xs text-gray-500 mb-1">Ke</div>
                  <div className="text-sm font-bold text-emerald-300">🏁 {tujuanHalte.nama_halte}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                <div className="text-center"><div className="text-xs text-gray-500">Jarak</div><div className="text-sm font-bold text-white">{totalJarak()} km</div></div>
                <div className="text-center border-x border-white/10"><div className="text-xs text-gray-500">Titik</div><div className="text-sm font-bold text-white">{ruteSegmen().length} titik</div></div>
                <div className="text-center"><div className="text-xs text-gray-500">Armada</div><div className="text-sm font-bold text-white">{selected.jumlah_armada} unit</div></div>
              </div>
            </div>
            <div className="flex bg-white/5 rounded-xl p-1 mb-5 gap-1">
              {[['rute', '🗺️ Rute'],['jadwal', '⏰ Jadwal'],['tarif', '💰 Tarif']].map(([tab, label]) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all
                  ${activeTab === tab ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                  {label}
                </button>
              ))}
            </div>
            {activeTab === 'rute' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                {ruteSegmen().map((h, i) => {
                  const segmen = ruteSegmen();
                  return (
                    <div key={h.id} className="flex gap-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 mt-0.5
                          ${i === 0 ? 'bg-violet-500 border-violet-500' : i === segmen.length - 1 ? 'bg-emerald-500 border-emerald-500' : 'bg-violet-500/30 border-violet-500/50'}`}/>
                        {i < segmen.length - 1 && <div className="w-0.5 bg-violet-500/30 my-0.5" style={{height: '28px'}}/>}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className={`text-sm font-medium ${i === 0 ? 'text-violet-300' : i === segmen.length - 1 ? 'text-emerald-300' : 'text-gray-300'}`}>
                          {h.nama_halte}
                        </div>
                        {h.jarak_ke_berikutnya > 0 && i < segmen.length - 1 && (
                          <div className="text-xs text-gray-600 mt-0.5">↕ {h.jarak_ke_berikutnya} km</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab === 'jadwal' && (
              <div>
                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2 mb-4 text-xs text-violet-300">
                  📅 Beroperasi: {detail.jadwal[0]?.hari_operasi || selected.hari_operasi}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {detail.jadwal.map(j => (
                    <div key={j.id} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-center hover:border-violet-500/50 transition-all">
                      <div className="text-sm font-bold text-white">⏰ {j.jam_berangkat}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">{detail.jadwal.length} jadwal/hari • {selected.jumlah_armada} unit armada</div>
              </div>
            )}
            {activeTab === 'tarif' && (
              <div className="flex flex-col gap-2">
                {detail.tarif.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">Belum ada data tarif.</div>
                ) : (
                  <>
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
                    <div className="mt-1 text-xs text-gray-600 text-center">* Tarif dapat berubah sewaktu-waktu</div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
