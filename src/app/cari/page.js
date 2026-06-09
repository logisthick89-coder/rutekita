'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function formatRp(n) { return n ? 'Rp' + Number(n).toLocaleString('id-ID') : '-'; }

const JENIS_COLOR = { kota: '#6366f1', antar: '#3b82f6', pedesaan: '#10b981' };

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

          {/* Halte / Rute */}
          {halteList && halteList.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">📍 Titik Pemberhentian</div>
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

          {/* Jadwal */}
          {jadwal.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">⏰ Jadwal Keberangkatan</div>
              <div className="grid grid-cols-4 gap-1.5">
                {jadwal.map(j => (
                  <div key={j.id} className="bg-white/5 border border-white/10 rounded-lg py-1.5 text-center">
                    <div className="text-xs font-bold text-white">{j.jam_berangkat}</div>
                  </div>
                ))}
              </div>
              {jadwal[0]?.hari_operasi && (
                <div className="text-xs text-gray-500 mt-1.5">📅 {jadwal[0].hari_operasi}</div>
              )}
            </div>
          )}

          {/* Tarif */}
          {tarif.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 mb-2">💰 Tarif per Segmen</div>
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
      <button onClick={onClose}
        className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors">
        ▲ Tutup detail
      </button>
    </div>
  );
}

function HasilCard({ item }) {
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

      {/* Header — klik untuk expand */}
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
            <span className="text-gray-500 text-xs">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Halte cocok (hanya saat belum expand) */}
        {!expanded && item.type === 'halte' && item.halte && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.halte.map((h, j) => (
              <span key={j} className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: warna + '22', color: warna, border: `1px solid ${warna}44` }}>
                📍 {h.nama_halte}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-3 flex-wrap mt-2">
          {t?.jumlah_armada != null && <span className="text-xs text-gray-400">🚌 {t.jumlah_armada} armada</span>}
          {t?.jarak_km != null && <span className="text-xs text-gray-400">📍 {t.jarak_km} km</span>}
          {t?.tarif_min != null && <span className="text-xs text-amber-400">💰 ab {formatRp(t.tarif_min)}</span>}
        </div>
      </button>

      {/* Detail expand */}
      {expanded && (
        <DetailTrayek
          trayek={t}
          halteList={semuaHalte}
          warna={warna}
          onClose={() => setExpanded(false)}
        />
      )}
    </div>
  );
}

function CariContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');
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

  useEffect(() => {
    if (!dataLoaded) return;
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
  }, [query, dataLoaded, semuaTrayek, semuaHalte]);

  function handleSearch(e) {
    e.preventDefault();
    router.replace('/cari?q=' + encodeURIComponent(query));
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-8">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur border-b border-white/10 px-6 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>R</div>
          <span className="text-white hidden md:block">Rute<span className="text-violet-400">Kita</span></span>
        </Link>
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-white/5 border border-violet-500/40 rounded-full px-4 py-2 focus-within:border-violet-500 transition-all">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari trayek, halte, atau tujuan..."
            className="bg-transparent text-white text-sm outline-none placeholder-gray-500 flex-1"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery('')}
              className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">✕</button>
          )}
        </form>
        <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors flex-shrink-0">← Kembali</Link>
      </nav>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        {!query.trim() && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-sm">Ketik nama trayek, halte, atau tujuan di atas</p>
            <p className="text-gray-600 text-xs mt-2">Contoh: Tarogong, Cibatu, Garut Kota</p>
          </div>
        )}
        {query.trim() && loading && (
          <div className="text-center py-12 text-gray-500 text-sm">Mencari...</div>
        )}
        {query.trim() && !loading && hasil.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-400 text-sm">Tidak ditemukan hasil untuk <span className="text-white font-semibold">"{query}"</span></p>
            <p className="text-gray-600 text-xs mt-2">Coba kata kunci lain seperti nama kota atau halte</p>
          </div>
        )}
        {!loading && hasil.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mb-4">{hasil.length} hasil untuk <span className="text-gray-300">"{query}"</span></p>
            <div className="flex flex-col gap-3">
              {hasil.map((item, i) => <HasilCard key={i} item={item} />)}
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f0f1a]/95 border-t border-white/10 flex h-14 z-40">
        {[['/', '🏠', 'Beranda'], ['/trayek', '🚌', 'Trayek'], ['/peta', '🗺️', 'Peta'], ['/jadwal', '📅', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs text-gray-500 hover:text-white transition-all">
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
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