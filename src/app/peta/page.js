'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WARNA_TRAYEK = {
  '01': '#16a34a',
  '02': '#2563eb',
  '03': '#dc2626',
  '04': '#d97706',
  '05': '#7c3aed',
  '06': '#64748b',
};

export default function Peta() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [trayek, setTrayek] = useState([]);
  const [selectedTrayek, setSelectedTrayek] = useState('semua');
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

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapRef.current).setView([-7.2120, 107.9067], 12);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const trayekToShow = selectedTrayek === 'semua'
        ? trayek
        : trayek.filter(t => t.kode_trayek === selectedTrayek);

      trayekToShow.forEach(t => {
        const halteWithCoord = (t.halte || [])
          .filter(h => h.lat && h.lng)
          .sort((a, b) => a.urutan - b.urutan);

        if (halteWithCoord.length === 0) return;

        const warna = WARNA_TRAYEK[t.kode_trayek] || '#16a34a';

        // Gambar garis rute
        const coords = halteWithCoord.map(h => [h.lat, h.lng]);
        L.polyline(coords, { color: warna, weight: 4, opacity: 0.8 }).addTo(map);

        // Gambar marker halte
        halteWithCoord.forEach((h, i) => {
          const isTerminal = i === 0 || i === halteWithCoord.length - 1;
          const icon = L.divIcon({
            html: `<div style="
              width: ${isTerminal ? 14 : 10}px;
              height: ${isTerminal ? 14 : 10}px;
              background: ${isTerminal ? warna : 'white'};
              border: 2.5px solid ${warna};
              border-radius: 50%;
              box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            "></div>`,
            className: '',
            iconSize: [isTerminal ? 14 : 10, isTerminal ? 14 : 10],
            iconAnchor: [isTerminal ? 7 : 5, isTerminal ? 7 : 5],
          });

          L.marker([h.lat, h.lng], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif; min-width:140px">
                <div style="font-size:11px; color:#16a34a; font-weight:600; margin-bottom:4px">
                  Trayek ${t.kode_trayek}
                </div>
                <div style="font-size:13px; font-weight:700; color:#111">${h.nama_halte}</div>
                <div style="font-size:11px; color:#888; margin-top:2px">${t.nama_rute}</div>
              </div>
            `);
        });
      });
    }

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, trayek, selectedTrayek]);

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-16">

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

      {/* FILTER */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto max-w-4xl mx-auto">
          <button onClick={() => setSelectedTrayek('semua')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${selectedTrayek === 'semua' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'}`}>
            Semua
          </button>
          {trayek.map(t => (
            <button key={t.kode_trayek} onClick={() => setSelectedTrayek(t.kode_trayek)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all`}
              style={selectedTrayek === t.kode_trayek
                ? { background: WARNA_TRAYEK[t.kode_trayek], color: 'white', borderColor: WARNA_TRAYEK[t.kode_trayek] }
                : {}}>
              Trayek {t.kode_trayek}
            </button>
          ))}
        </div>
      </div>

      {/* PETA */}
      {loading ? (
        <div className="flex items-center justify-center h-96 text-gray-400 text-sm">Memuat peta...</div>
      ) : (
        <div ref={mapRef} style={{ height: 'calc(100vh - 160px)', width: '100%', zIndex: 0 }} />
      )}

      {/* LEGENDA */}
      {!loading && (
        <div className="fixed bottom-16 right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-40">
          <div className="text-xs font-semibold text-gray-500 mb-2">Legenda</div>
          {trayek.map(t => (
            <div key={t.kode_trayek} className="flex items-center gap-2 mb-1">
              <div className="w-6 h-1.5 rounded-full" style={{ background: WARNA_TRAYEK[t.kode_trayek] }}></div>
              <span className="text-xs text-gray-600">Trayek {t.kode_trayek}</span>
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 flex h-14 z-40">
        {[['/', '🏠', 'Beranda'], ['/', '🚌', 'Trayek'], ['/peta', '🗺️', 'Peta'], ['/jadwal', '📅', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-all
            ${label === 'Peta' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}>
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </div>

    </main>
  );
}
