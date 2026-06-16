'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WARNA_TRAYEK = {
  '01': '#a855f7',
  '02': '#06b6d4',
  '03': '#ef4444',
  '04': '#eab308',
  '05': '#22c55e',
  '06': '#6b7280',
};

function formatRp(n) { return n ? 'Rp' + Number(n).toLocaleString('id-ID') : '-'; }

export default function Peta() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylinesRef = useRef({});
  const [trayek, setTrayek] = useState([]);
  const [selectedTrayek, setSelectedTrayek] = useState('semua');
  const [activeInfo, setActiveInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('trayek')
        .select('*, halte(*)')
        .order('kode_trayek');
      setTrayek(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current) return;
    async function initMap() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

      const map = L.map(mapRef.current).setView([-7.2120, 107.9067], 12);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);

      const tilePane = map.getPane('tilePane');
      if (tilePane) tilePane.style.filter = 'brightness(0.6) saturate(0.8)';

      polylinesRef.current = {};

      for (const t of trayek) {
        const halteWithCoord = (t.halte || []).filter(h => h.lat && h.lng).sort((a, b) => a.urutan - b.urutan);
        if (halteWithCoord.length === 0) continue;
        const warna = WARNA_TRAYEK[t.kode_trayek] || '#8b5cf6';

        let coords = halteWithCoord.map(h => [h.lat, h.lng]);
        try {
          const waypoints = halteWithCoord.map(h => `${h.lng},${h.lat}`).join(';');
          const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`);
          const osrmData = await osrmRes.json();
          if (osrmData.code === 'Ok' && osrmData.routes[0]) {
            coords = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          }
        } catch(e) {
          console.warn('OSRM gagal, pakai garis lurus:', e);
        }

        const shadow = L.polyline(coords, { color: warna, weight: 10, opacity: 0.15 }).addTo(map);
        const line = L.polyline(coords, { color: warna, weight: 4, opacity: 0.9 }).addTo(map);

        polylinesRef.current[t.kode_trayek] = { line, shadow };

        line.on('click', () => {
          setSelectedTrayek(t.kode_trayek);
          setActiveInfo(t);
        });

        halteWithCoord.forEach((h, i) => {
          const isTerminal = i === 0 || i === halteWithCoord.length - 1;
          const icon = L.divIcon({
            html: `<div style="width:${isTerminal ? 14 : 10}px;height:${isTerminal ? 14 : 10}px;background:${isTerminal ? warna : '#0f0f1a'};border:2.5px solid ${warna};border-radius:50%;box-shadow:0 0 6px ${warna}88;"></div>`,
            className: '',
            iconSize: [isTerminal ? 14 : 10, isTerminal ? 14 : 10],
            iconAnchor: [isTerminal ? 7 : 5, isTerminal ? 7 : 5],
          });
          L.marker([h.lat, h.lng], { icon }).addTo(map).bindPopup(`
            <div style="font-family:sans-serif;min-width:160px;background:#16162a;border-radius:10px;padding:10px;">
              <div style="font-size:11px;color:${warna};font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">Trayek ${t.kode_trayek}</div>
              <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">${h.nama_halte}</div>
              <div style="font-size:11px;color:#9ca3af;margin-bottom:8px">${t.nama_rute}</div>
              <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;display:flex;gap:12px;">
                ${t.jumlah_armada != null ? `<div><div style="font-size:10px;color:#6b7280">Armada</div><div style="font-size:12px;font-weight:600;color:#a78bfa">${t.jumlah_armada} unit</div></div>` : ''}
                ${t.jarak_km != null ? `<div><div style="font-size:10px;color:#6b7280">Jarak</div><div style="font-size:12px;font-weight:600;color:#34d399">${t.jarak_km} km</div></div>` : ''}
                ${t.tarif_min != null ? `<div><div style="font-size:10px;color:#6b7280">Tarif min</div><div style="font-size:12px;font-weight:600;color:#fbbf24">${formatRp(t.tarif_min)}</div></div>` : ''}
              </div>
            </div>
          `);
        });
      }
    }
    initMap();
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [loading, trayek]);

  useEffect(() => {
    const polylines = polylinesRef.current;
    if (!polylines || Object.keys(polylines).length === 0) return;
    Object.entries(polylines).forEach(([kode, { line, shadow }]) => {
      if (selectedTrayek === 'semua') {
        line.setStyle({ opacity: 0.9, weight: 4 });
        shadow.setStyle({ opacity: 0.15, weight: 10 });
      } else if (kode === selectedTrayek) {
        line.setStyle({ opacity: 1, weight: 6 });
        shadow.setStyle({ opacity: 0.3, weight: 16 });
        line.bringToFront();
      } else {
        line.setStyle({ opacity: 0.2, weight: 2 });
        shadow.setStyle({ opacity: 0.05, weight: 6 });
      }
    });

    if (selectedTrayek === 'semua') {
      setActiveInfo(null);
    } else {
      const found = trayek.find(t => t.kode_trayek === selectedTrayek);
      setActiveInfo(found || null);
    }
  }, [selectedTrayek, trayek]);

  const warna = activeInfo ? (WARNA_TRAYEK[activeInfo.kode_trayek] || '#8b5cf6') : '#8b5cf6';

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans">
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
              ${label === 'Peta' ? 'bg-violet-500/20 text-violet-300 font-semibold' : label === 'Bisnis' ? 'text-amber-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="bg-[#0f0f1a]/95 border-b border-white/10 px-4 py-3 z-40 relative">
        <div className="flex gap-2 overflow-x-auto max-w-4xl mx-auto">
          <button onClick={() => setSelectedTrayek('semua')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${selectedTrayek === 'semua' ? 'text-white border-transparent' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            style={selectedTrayek === 'semua' ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}>
            Semua
          </button>
          {trayek.map(t => (
            <button key={t.kode_trayek} onClick={() => setSelectedTrayek(t.kode_trayek)}
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={selectedTrayek === t.kode_trayek
                ? { background: WARNA_TRAYEK[t.kode_trayek], color: 'white', borderColor: WARNA_TRAYEK[t.kode_trayek] }
                : { borderColor: 'rgba(255,255,255,0.1)', color: '#9ca3af' }}>
              Trayek {t.kode_trayek}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96 text-gray-500 text-sm">Memuat peta...</div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div ref={mapRef} style={{ height: 'calc(100vh - 112px)', width: '100%', zIndex: 0 }} />

          {activeInfo && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
              style={{ background: '#16162a', border: `1px solid ${warna}44`, borderRadius: '16px', padding: '14px 16px' }}>
              <div className="flex items-start justify-between mb-2">
                <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                  <div className="text-xs font-bold mb-0.5" style={{ color: warna }}>
                    Trayek {activeInfo.kode_trayek}
                  </div>
                  <div className="text-sm font-bold text-white">{activeInfo.nama_rute}</div>
                  {activeInfo.via && <div className="text-xs text-gray-500 mt-0.5">via {activeInfo.via}</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeInfo.aktif ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    <span className={`text-xs ${activeInfo.aktif ? 'text-emerald-400' : 'text-red-400'}`}>
                      {activeInfo.aktif ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </span>
                  <button onClick={() => setSelectedTrayek('semua')}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#9ca3af', fontSize: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}>✕</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {activeInfo.jumlah_armada != null && (
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <div className="text-lg mb-0.5">🚌</div>
                    <div className="text-sm font-bold text-violet-300">{activeInfo.jumlah_armada}</div>
                    <div className="text-xs text-gray-500">Armada</div>
                  </div>
                )}
                {activeInfo.jarak_km != null && (
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div className="text-lg mb-0.5">📍</div>
                    <div className="text-sm font-bold text-emerald-300">{activeInfo.jarak_km} km</div>
                    <div className="text-xs text-gray-500">Jarak</div>
                  </div>
                )}
                {activeInfo.tarif_min != null && (
                  <div className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <div className="text-lg mb-0.5">💰</div>
                    <div className="text-sm font-bold text-amber-300">{formatRp(activeInfo.tarif_min)}</div>
                    <div className="text-xs text-gray-500">Tarif min</div>
                  </div>
                )}
              </div>
              {activeInfo.jam_operasi && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  🕐 Operasi: <span className="text-gray-300">{activeInfo.jam_operasi}</span>
                  {activeInfo.hari_operasi && <span className="ml-2">📅 {activeInfo.hari_operasi}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && (
        <div className="fixed bottom-16 md:bottom-6 right-4 rounded-2xl border border-white/10 p-3 z-40"
          style={{ background: '#16162a' }}>
          <div className="text-xs font-semibold text-gray-400 mb-2">Legenda</div>
          {trayek.map(t => (
            <button key={t.kode_trayek}
              onClick={() => setSelectedTrayek(t.kode_trayek === selectedTrayek ? 'semua' : t.kode_trayek)}
              className="flex items-center gap-2 mb-1.5 w-full text-left hover:opacity-80 transition-opacity">
              <div className="w-6 h-1.5 rounded-full transition-all"
                style={{
                  background: WARNA_TRAYEK[t.kode_trayek],
                  opacity: selectedTrayek === 'semua' || selectedTrayek === t.kode_trayek ? 1 : 0.3,
                  height: selectedTrayek === t.kode_trayek ? '3px' : '1.5px',
                }}></div>
              <span className="text-xs transition-colors"
                style={{ color: selectedTrayek === t.kode_trayek ? '#fff' : '#9ca3af' }}>
                Trayek {t.kode_trayek}
              </span>
            </button>
          ))}
        </div>
      )}

      <BottomNav />
    </main>
  );
}

