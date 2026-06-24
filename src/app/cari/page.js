'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatRp(n) { return n ? 'Rp' + Number(n).toLocaleString('id-ID') : '-'; }
const JENIS_COLOR = { kota: '#6366f1', antar: '#3b82f6', pedesaan: '#10b981' };

const HALTE_LIST = [
  'Alun-alun Garut','Bayongbong','Bundaran Suci','Cisurupan',
  'Jl. Ciledug','Jl. Suherman (Tarogong)','Karangpawitan','Leles',
  'Pasar Induk','Pasar Leles','Pasar Wanaraja','Simpang Lima',
  'Simpang Tarogong','Sukaregang','Sukawening','Tarogong Kidul',
  'Terminal Cibatu','Terminal Guntur Garut','Terminal Kadungora',
  'Terminal Malangbong','Wanaraja',
];

function DetailTrayek({ trayek, halteList, warna, onClose }) {
  const [jadwal, setJadwal] = useState([]);
  const [tarif, setTarif] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      const [jadwalRes, tarifRes] = await Promise.all([
        supabase.from('jadwal').select('*').eq('trayek_id', trayek.id).order('jam_berangkat'),
        supabase.from('tarif').select('*').eq('trayek_id', trayek.id),
      ]);
      setJadwal(jadwalRes.data || []);
      setTarif(tarifRes.data || []);
      setLoadingDetail(false);
    }
    fetchDetail();
  }, [trayek.id]);

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      {loadingDetail ? (
        <div className="text-xs text-gray-500 py-2">Memuat detail...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {halteList && halteList.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">Titik Pemberhentian</div>
              <div className="flex flex-wrap gap-1.5">
                {halteList.map((h, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: warna + '22', color: warna, border: `1px solid ${warna}44` }}>
                    {h.nama_halte}
                  </span>
                ))}
              </div>
            </div>
          )}
          {jadwal.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">Jadwal Keberangkatan</div>
              <div className="grid grid-cols-4 gap-1.5">
                {jadwal.map(j => (
                  <div key={j.id} className="bg-white/5 border border-white/10 rounded-lg py-1.5 text-center">
                    <div className="text-xs font-bold text-white">{j.jam_berangkat}</div>
                  </div>
                ))}
              </div>
              {jadwal[0]?.hari_operasi && (
                <div className="text-xs text-gray-500 mt-1.5">{jadwal[0].hari_operasi}</div>
              )}
            </div>
          )}
          {tarif.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">Tarif per Segmen</div>
              <div className="flex flex-col gap-1">
                {tarif.map(t => (
                  <div key={t.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-gray-300">{t.segmen_asal} → {t.segmen_tujuan}</span>
                    <span className="text-xs font-bold text-emerald-400">{formatRp(t.harga)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <button onClick={onClose} className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
        Tutup detail
      </button>
    </div>
  );
}

function HasilCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const [semuaHalte, setSemuaHalte] = useState([]);
  const t = item.trayek;
  const warna = JENIS_COLOR[t?.jenis] || '#6366f1';

  async function handleExpand() {
    if (!expanded && semuaHalte.length === 0) {
      const { data } = await supabase.from('halte').select('*').eq('trayek_id', t.id).order('urutan');
      setSemuaHalte(data || []);
    }
    setExpanded(!expanded);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 transition-all"
      style={{ borderColor: expanded ? warna + '44' : '' }}>
      <button onClick={handleExpand} className="w-full text-left">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: warna }}>
              {t?.kode_trayek}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t?.nama_rute}</div>
              {t?.via && <div className="text-xs text-gray-500">via {t.via}</div>}
            </div>
          </div>
          <span className={`text-xs flex items-center gap-1 flex-shrink-0 ml-2 ${t?.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${t?.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            {t?.aktif ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        {/* Badge asal tujuan */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Naik: {item.asalNama}
          </span>
          <span className="text-gray-500 text-xs">→</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Turun: {item.tujuanNama}
          </span>
        </div>

        <div className="flex gap-3 flex-wrap mt-2">
          {t?.jumlah_armada != null && <span className="text-xs text-gray-400">{t.jumlah_armada} armada</span>}
          {t?.jarak_km != null && <span className="text-xs text-gray-400">{t.jarak_km} km</span>}
          {t?.tarif_min != null && <span className="text-xs text-amber-400">ab {formatRp(t.tarif_min)}</span>}
        </div>
      </button>

      {expanded && (
        <DetailTrayek trayek={t} halteList={semuaHalte} warna={warna} onClose={() => setExpanded(false)} />
      )}
    </div>
  );
}

function CariContent() {
  const [dari, setDari] = useState('');
  const [ke, setKe] = useState('');
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semuaHalte, setSemuaHalte] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sudahCari, setSudahCari] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('halte')
        .select('*, trayek(id, kode_trayek, nama_rute, jenis, aktif, tarif_min, via, jumlah_armada, jarak_km)')
        .order('urutan');
      setSemuaHalte(data || []);
      setDataLoaded(true);
    }
    fetchData();
  }, []);

  function cariRute() {
    if (!dari || !ke || dari === ke) return;
    setLoading(true);
    setSudahCari(true);

    const trayekIdMap = {};
    semuaHalte.forEach(h => {
      const kode = h.trayek?.kode_trayek;
      if (!kode) return;
      if (!trayekIdMap[kode]) trayekIdMap[kode] = { trayek: h.trayek, halte: [] };
      trayekIdMap[kode].halte.push(h);
    });

    const cocok = [];
    Object.values(trayekIdMap).forEach(({ trayek: t, halte }) => {
      const hAsal = halte.find(h => h.nama_halte === dari);
      const hTujuan = halte.find(h => h.nama_halte === ke);
      if (hAsal && hTujuan && hAsal.urutan < hTujuan.urutan) {
        cocok.push({ trayek: t, asalNama: dari, tujuanNama: ke });
      }
    });

    setHasil(cocok);
    setLoading(false);
  }

  const halteTujuan = HALTE_LIST.filter(h => h !== dari);

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-8">
      <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Cari Trayek</h1>
          <p className="text-gray-400 text-sm">Pilih titik naik dan tujuan untuk menemukan trayek yang tepat</p>
        </div>

        {/* Form Dari-Ke */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Titik Naik (Dari)</label>
              <select value={dari} onChange={e => { setDari(e.target.value); setSudahCari(false); setHasil([]); }}
                className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-all">
                <option value="">Pilih halte asal...</option>
                {HALTE_LIST.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Swap button */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <button
                onClick={() => { setDari(ke); setKe(dari); setSudahCari(false); setHasil([]); }}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                title="Tukar asal dan tujuan">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
              </button>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Titik Turun (Ke)</label>
              <select value={ke} onChange={e => { setKe(e.target.value); setSudahCari(false); setHasil([]); }}
                className="w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-all">
                <option value="">Pilih halte tujuan...</option>
                {halteTujuan.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <button onClick={cariRute} disabled={!dari || !ke || dari === ke}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
              style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              Cari Trayek
            </button>
          </div>
        </div>

        {/* State awal */}
        {!sudahCari && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Pilih titik naik dan turun</p>
            <p className="text-gray-600 text-xs mt-1">lalu klik Cari Trayek</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8 text-gray-500 text-sm">Mencari trayek...</div>
        )}

        {/* Tidak ditemukan */}
        {!loading && sudahCari && hasil.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Tidak ada trayek langsung</p>
            <p className="text-gray-600 text-xs mt-1">dari {dari} ke {ke}</p>
            <p className="text-gray-600 text-xs mt-1">Coba tukar asal dan tujuan</p>
          </div>
        )}

        {/* Hasil */}
        {!loading && hasil.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mb-4">
              {hasil.length} trayek ditemukan —
              <span className="text-violet-300 ml-1">{dari}</span>
              <span className="text-gray-600 mx-1">→</span>
              <span className="text-emerald-300">{ke}</span>
            </p>
            <div className="flex flex-col gap-3">
              {hasil.map((item, i) => (
                <HasilCard key={i} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function Cari() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center text-gray-500 text-sm">Memuat...</div>}>
      <CariContent />
    </Suspense>
  );
}