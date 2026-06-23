'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SkeletonCariCard } from '@/components/Skeleton';

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
              <div className="text-xs font-semibold text-gray-400 mb-2"> Titik Pemberhentian</div>
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
              <div className="text-xs font-semibold text-gray-400 mb-2"> Jadwal Keberangkatan</div>
              <div className="grid grid-cols-4 gap-1.5">
                {jadwal.map(j => (
                  <div key={j.id} className="bg-white/5 border border-white/10 rounded-lg py-1.5 text-center">
                    <div className="text-xs font-bold text-white">{j.jam_berangkat}</div>
                  </div>
                ))}
              </div>
              {jadwal[0]?.hari_operasi && (
                <div className="text-xs text-gray-500 mt-1.5"> {jadwal[0].hari_operasi}</div>
              )}
            </div>
          )}
          {tarif.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2"> Tarif per Segmen</div>
              <div className="flex flex-col gap-1">
                {tarif.map(t => (
                  <div key={t.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-gray-300">{t.segmen_asal}  {t.segmen_tujuan}</span>
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

function HasilCard({ item, highlightAsal, highlightTujuan }) {
  const [expanded, setExpanded] = useState(false);
  const [semuaHalte, setSemuaHalte] = useState(item.halte || []);
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
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className={`text-xs flex items-center gap-1 ${t?.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${t?.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              {t?.aktif ? 'Aktif' : 'Nonaktif'}
            </span>
            <span className="text-gray-500 text-xs">{expanded ? '' : ''}</span>
          </div>
        </div>

        {/* Badge halte cocok untuk mode DariKe */}
        {(highlightAsal || highlightTujuan) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {highlightAsal && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                 Naik: {highlightAsal}
              </span>
            )}
            {highlightTujuan && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                 Turun: {highlightTujuan}
              </span>
            )}
          </div>
        )}

        {/* Halte cocok untuk mode keyword */}
        {!highlightAsal && !highlightTujuan && !expanded && item.type === 'halte' && item.halte && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.halte.map((h, j) => (
              <span key={j} className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: warna + '22', color: warna, border: `1px solid ${warna}44` }}>
                 {h.nama_halte}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-3 flex-wrap mt-2">
          {t?.jumlah_armada != null && <span className="text-xs text-gray-400"> {t.jumlah_armada} armada</span>}
          {t?.jarak_km != null && <span className="text-xs text-gray-400"> {t.jarak_km} km</span>}
          {t?.tarif_min != null && <span className="text-xs text-amber-400"> ab {formatRp(t.tarif_min)}</span>}
        </div>
      </button>

      {expanded && (
        <DetailTrayek trayek={t} halteList={semuaHalte} warna={warna} onClose={() => setExpanded(false)} />
      )}
    </div>
  );
}

function CariContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState('keyword'); // 'keyword' | 'rute'
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [dari, setDari] = useState('');
  const [ke, setKe] = useState('');
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);
  const [semuaTrayek, setSemuaTrayek] = useState([]);
  const [semuaHalte, setSemuaHalte] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [trayekRes, halteRes] = await Promise.all([
        supabase.from('trayek').select('*').order('kode_trayek'),
        supabase.from('halte').select('*, trayek(kode_trayek, nama_rute, jenis, aktif, tarif_min, via, jumlah_armada, jarak_km)').order('urutan'),
      ]);
      setSemuaTrayek(trayekRes.data || []);
      setSemuaHalte(halteRes.data || []);
      setDataLoaded(true);
    }
    fetchData();
  }, []);

  // Mode keyword
  useEffect(() => {
    if (!dataLoaded || mode !== 'keyword') return;
    const q = query.trim().toLowerCase();
    if (!q) { setHasil([]); return; }
    setLoading(true);

    const trayekCocok = semuaTrayek.filter(t =>
      t.asal?.toLowerCase().includes(q) ||
      t.tujuan?.toLowerCase().includes(q) ||
      t.nama_rute?.toLowerCase().includes(q) ||
      t.via?.toLowerCase().includes(q) ||
      t.kode_trayek?.toLowerCase().includes(q)
    ).map(t => ({ type: 'trayek', trayek: t, halte: [] }));

    const seenKode = new Set(trayekCocok.map(r => r.trayek.kode_trayek));
    const halteGroup = {};
    semuaHalte.filter(h => h.nama_halte?.toLowerCase().includes(q)).forEach(h => {
      const kode = h.trayek?.kode_trayek;
      if (!kode) return;
      if (!halteGroup[kode]) halteGroup[kode] = [];
      halteGroup[kode].push(h);
    });

    const halteCocok = Object.entries(halteGroup)
      .filter(([kode]) => !seenKode.has(kode))
      .map(([, haltes]) => ({ type: 'halte', trayek: haltes[0].trayek, halte: haltes }));

    setHasil([...trayekCocok, ...halteCocok]);
    setLoading(false);
  }, [query, dataLoaded, semuaTrayek, semuaHalte, mode]);

  // Mode Dari  Ke
  function cariRute() {
    if (!dari || !ke || dari === ke) return;
    setLoading(true);

    // Cari trayek yang memiliki halte asal DAN halte tujuan, dengan urutan benar
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
        cocok.push({ type: 'rute', trayek: t, halte: [], asalNama: dari, tujuanNama: ke });
      }
    });

    setHasil(cocok);
    setLoading(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    router.replace('/cari?q=' + encodeURIComponent(query));
  }

  const halteTujuan = HALTE_LIST.filter(h => h !== dari);

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-8">

      {/* Toggle mode */}
      <div className="px-6 pt-5 max-w-2xl mx-auto">
        <div className="flex bg-white/5 rounded-xl p-1 gap-1 mb-5">
          <button onClick={() => { setMode('keyword'); setHasil([]); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5
            ${mode === 'keyword' ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
             Cari Keyword
          </button>
          <button onClick={() => { setMode('rute'); setHasil([]); setQuery(''); }}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5
            ${mode === 'rute' ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
             Dari  Ke
          </button>
        </div>

        {/* Mode Dari  Ke */}
        {mode === 'rute' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block"> Titik Naik (Dari)</label>
                <select value={dari} onChange={e => setDari(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-all appearance-none">
                  <option value="" style={{background:'#1a1a2e'}}>Pilih halte asal...</option>
                  {HALTE_LIST.map(h => <option key={h} value={h} style={{background:'#1a1a2e'}}>{h}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-gray-600 text-xs"></span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block"> Titik Turun (Ke)</label>
                <select value={ke} onChange={e => setKe(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-all appearance-none">
                  <option value="" style={{background:'#1a1a2e'}}>Pilih halte tujuan...</option>
                  {halteTujuan.map(h => <option key={h} value={h} style={{background:'#1a1a2e'}}>{h}</option>)}
                </select>
              </div>
              <button onClick={cariRute} disabled={!dari || !ke || dari === ke}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                Cari Trayek
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 max-w-2xl mx-auto">
        {/* State kosong keyword */}
        {mode === 'keyword' && !query.trim() && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4"></div>
            <p className="text-gray-400 text-sm">Ketik nama trayek, halte, atau tujuan di atas</p>
            <p className="text-gray-600 text-xs mt-2">Contoh: Tarogong, Cibatu, Garut Kota</p>
          </div>
        )}

        {/* State kosong rute */}
        {mode === 'rute' && hasil.length === 0 && !loading && (!dari || !ke) && (
          <div className="text-center py-10">
            <div className="text-5xl mb-4"></div>
            <p className="text-gray-400 text-sm">Pilih titik naik dan turun untuk mencari trayek</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-3">{[0,1,2].map(i => <SkeletonCariCard key={i} />)}</div>
        )}

        {/* Tidak ditemukan */}
        {!loading && hasil.length === 0 && (
          (mode === 'keyword' && query.trim()) || (mode === 'rute' && dari && ke)
        ) && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4"></div>
            <p className="text-gray-400 text-sm">
              {mode === 'rute'
                ? `Tidak ada trayek langsung dari ${dari} ke ${ke}`
                : `Tidak ditemukan hasil untuk "${query}"`}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              {mode === 'rute' ? 'Coba tukar asal dan tujuan, atau pilih halte lain' : 'Coba kata kunci lain'}
            </p>
          </div>
        )}

        {/* Hasil */}
        {!loading && hasil.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mb-4">
              {hasil.length} trayek ditemukan
              {mode === 'rute' && dari && ke && (
                <span className="text-gray-400"> · <span className="text-violet-300">{dari}</span>  <span className="text-emerald-300">{ke}</span></span>
              )}
            </p>
            <div className="flex flex-col gap-3">
              {hasil.map((item, i) => (
                <HasilCard key={i} item={item}
                  highlightAsal={item.type === 'rute' ? item.asalNama : null}
                  highlightTujuan={item.type === 'rute' ? item.tujuanNama : null}
                />
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




