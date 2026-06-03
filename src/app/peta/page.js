'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WARNA_TRAYEK = {
  '01': '#8b5cf6',
  '02': '#3b82f6',
  '03': '#ef4444',
  '04': '#f59e0b',
  '05': '#10b981',
  '06': '#6b7280',
};

export default function Peta() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [trayek, setTrayek] = useState([]);
  const [selectedTrayek, setSelectedTrayek] = useState('semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('trayek').select('*, halte(*)').order('kode_trayek');
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

      // Dark filter overlay
      const tilePane = map.getPane('tilePane');
      if (tilePane) tilePane.style.filter = 'brightness(0.6) saturate(0.8)';

      const trayekToShow = selectedTrayek === 'semua' ? trayek : trayek.filter(t => t.kode_trayek === selectedTrayek);

      trayekToShow.forEach(t => {
        const halteWithCoord = (t.halte || []).filter(h => h.lat && h.lng).sort((a, b) => a.urutan - b.urutan);
        if (halteWithCoord.length === 0) return;
        const warna = WARNA_TRAYEK[t.kode_trayek] || '#8b5cf6';
        const coords = halteWithCoord.map(h => [h.lat, h.lng]);
        L.polyline(coords, { color: warna, weight: 4, opacity: 0.9 }).addTo(map);
        halteWithCoord.forEach((h, i) => {
          const isTerminal = i === 0 || i === halteWithCoord.length - 1;
          const icon = L.divIcon({
            html: `<div style="width:${isTerminal?14:10}px;height:${isTerminal?14:10}px;background:${isTerminal?warna:'#0f0f1a'};border:2.5px solid ${warna};border-radius:50%;box-shadow:0 0 6px ${warna}88;"></div>`,
            className: '',
            iconSize: [isTerminal?14:10, isTerminal?14:10],
            iconAnchor: [isTerminal?7:5, isTerminal?7:5],
          });
          L.marker([h.lat, h.lng], { icon }).addTo(map).bindPopup(`
            <div style="font-family:sans-serif;min-width:140px;background:#16162a;border-radius:8px;padding:8px;">
              <div style="font-size:11px;color:${warna};font-weight:600;margin-bottom:4px">Trayek ${t.kode_trayek}</div>
              <div style="font-size:13px;font-weight:700;color:#fff">${h.nama_halte}</div>
              <div style="font-size:11px;color:#6b7280;margin-top:2px">${t.nama_rute}</div>
            </div>
          `);
        });
      });
    }
    initMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [loading, trayek, selectedTrayek]);

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans">
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
              ${label === 'Peta' ? 'bg-violet-500/20 text-violet-300 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Filter */}
      <div className="bg-[#0f0f1a]/95 border-b border-white/10 px-4 py-3 z-40 relative">
        <div className="flex gap-2 overflow-x-auto max-w-4xl mx-auto">
          <button onClick={() => setSelectedTrayek('semua')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${selectedTrayek === 'semua' ? 'text-white border-transparent' : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'}`}
            style={selectedTrayek === 'semua' ? {background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'} : {}}>
            Semua
          </button>
          {trayek.map(t => (
            <button key={t.kode_trayek} onClick={() => setSelectedTrayek(t.kode_trayek)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all`}
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
        <div ref={mapRef} style={{ height: 'calc(100vh - 112px)', width: '100%', zIndex: 0 }} />
      )}

      {/* Legenda */}
      {!loading && (
        <div className="fixed bottom-16 md:bottom-6 right-4 rounded-2xl border border-white/10 p-3 z-40"
          style={{background: '#16162a'}}>
          <div className="text-xs font-semibold text-gray-400 mb-2">Legenda</div>
          {trayek.map(t => (
            <div key={t.kode_trayek} className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-1.5 rounded-full" style={{ background: WARNA_TRAYEK[t.kode_trayek] }}></div>
              <span className="text-xs text-gray-300">Trayek {t.kode_trayek}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom nav mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f0f1a]/95 border-t border-white/10 flex h-14 z-40">
        {[['/', '🏠', 'Beranda'], ['/trayek', '🚌', 'Trayek'], ['/peta', '🗺️', 'Peta'], ['/jadwal', '📅', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-all
            ${label === 'Peta' ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </div>
    </main>
  );
}
