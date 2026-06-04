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
  const [stats, setStats] = useState({ trayek: 0, jadwal: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [t, j] = await Promise.all([
        supabase.from('trayek').select('id', { count: 'exact' }),
        supabase.from('jadwal').select('id', { count: 'exact' }),
      ]);
      setStats({
        trayek: t.count || 0,
        jadwal: j.count || 0,
      });
    }
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0f0f1a]/90 backdrop-blur border-b border-white/10 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>R</div>
          <span className="text-white">Rute<span className="text-violet-400">Kita</span></span>
        </div>
        <div className="hidden md:flex gap-1">
          {[['/', 'Beranda'], ['/trayek', 'Trayek'], ['/jadwal', 'Jadwal'], ['/tarif', 'Tarif'], ['/peta', 'Peta']].map(([href, label]) => (
            <Link key={label} href={href}
              className={`px-3 py-1.5 rounded-full text-sm transition-all
              ${label === 'Beranda' ? 'bg-violet-500/20 text-violet-300 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {label}
            </Link>
          ))}
        </div>
        <Link href="/trayek" className="hidden md:block px-4 py-1.5 rounded-full text-sm font-semibold text-white"
          style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
          Cari Trayek
        </Link>
        <Link href="/trayek" className="md:hidden px-3 py-1.5 rounded-full text-xs font-semibold text-white"
          style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
          Cari
        </Link>
      </nav>

      {/* HERO */}
      <section className="px-6 pt-12 pb-8 md:pt-20 md:pb-16 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16">

          {/* Teks */}
          <div className="flex-1 mb-10 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-violet-300 font-medium">Data resmi Dishub Garut</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Naik angkot di Garut<br/>
              <span className="bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)'}}>
                jadi lebih mudah
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Temukan trayek, jadwal keberangkatan, tarif, dan rute angkutan umum Kabupaten Garut — semua dalam satu tempat.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/trayek"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:opacity-90"
                style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                🔍 Cari Trayek
              </Link>
              <Link href="/peta"
                className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2">
                🗺️ Lihat Peta
              </Link>
            </div>
          </div>

          {/* Ilustrasi */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-xs md:max-w-sm">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-3xl opacity-20"
                style={{background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)'}}></div>

              {/* Ilustrasi SVG angkot */}
              <svg viewBox="0 0 320 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
                {/* Langit */}
                <rect width="320" height="220" rx="24" fill="#1a1a2e"/>
                {/* Bintang */}
                <circle cx="40" cy="30" r="1.5" fill="#fff" opacity="0.6"/>
                <circle cx="80" cy="20" r="1" fill="#fff" opacity="0.4"/>
                <circle cx="130" cy="35" r="1.5" fill="#fff" opacity="0.5"/>
                <circle cx="200" cy="25" r="1" fill="#fff" opacity="0.6"/>
                <circle cx="260" cy="40" r="1.5" fill="#fff" opacity="0.4"/>
                <circle cx="290" cy="20" r="1" fill="#fff" opacity="0.5"/>
                {/* Gunung */}
                <polygon points="30,140 90,60 150,140" fill="#1e3a5f" opacity="0.8"/>
                <polygon points="80,140 150,70 220,140" fill="#1a3a4f" opacity="0.9"/>
                <polygon points="160,140 230,75 300,140" fill="#1e3a5f" opacity="0.7"/>
                {/* Jalan */}
                <rect y="155" width="320" height="40" rx="0" fill="#1f2937"/>
                <rect y="172" width="320" height="3" fill="#374151"/>
                {/* Marka jalan */}
                <rect x="10" y="173" width="30" height="2" rx="1" fill="#facc15" opacity="0.8"/>
                <rect x="60" y="173" width="30" height="2" rx="1" fill="#facc15" opacity="0.8"/>
                <rect x="110" y="173" width="30" height="2" rx="1" fill="#facc15" opacity="0.8"/>
                <rect x="160" y="173" width="30" height="2" rx="1" fill="#facc15" opacity="0.8"/>
                <rect x="210" y="173" width="30" height="2" rx="1" fill="#facc15" opacity="0.8"/>
                <rect x="260" y="173" width="30" height="2" rx="1" fill="#facc15" opacity="0.8"/>
                {/* Angkot 1 - ungu */}
                <rect x="30" y="118" width="100" height="45" rx="8" fill="#4f46e5"/>
                <rect x="30" y="118" width="100" height="16" rx="8" fill="#6366f1"/>
                <rect x="38" y="124" width="70" height="8" rx="3" fill="#93c5fd" opacity="0.8"/>
                <circle cx="50" cy="165" r="9" fill="#1f2937"/>
                <circle cx="50" cy="165" r="5" fill="#374151"/>
                <circle cx="110" cy="165" r="9" fill="#1f2937"/>
                <circle cx="110" cy="165" r="5" fill="#374151"/>
                <rect x="125" y="130" width="8" height="20" rx="2" fill="#facc15" opacity="0.9"/>
                <text x="80" y="147" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" opacity="0.9">GARUT KOTA</text>
                {/* Angkot 2 - hijau */}
                <rect x="185" y="122" width="90" height="40" rx="8" fill="#059669"/>
                <rect x="185" y="122" width="90" height="14" rx="8" fill="#10b981"/>
                <rect x="192" y="127" width="60" height="7" rx="2" fill="#6ee7b7" opacity="0.8"/>
                <circle cx="200" cy="164" r="8" fill="#1f2937"/>
                <circle cx="200" cy="164" r="4" fill="#374151"/>
                <circle cx="255" cy="164" r="8" fill="#1f2937"/>
                <circle cx="255" cy="164" r="4" fill="#374151"/>
                <rect x="270" y="132" width="7" height="18" rx="2" fill="#facc15" opacity="0.9"/>
                <text x="230" y="145" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" opacity="0.9">TAROGONG</text>
                {/* Pohon */}
                <rect x="155" y="130" width="5" height="25" fill="#713f12"/>
                <circle cx="157" cy="122" r="15" fill="#166534" opacity="0.9"/>
                <circle cx="148" cy="128" r="10" fill="#15803d" opacity="0.8"/>
                <circle cx="166" cy="128" r="10" fill="#15803d" opacity="0.8"/>
                {/* Label kota */}
                <rect x="100" y="10" width="120" height="24" rx="12" fill="#4f46e5" opacity="0.3"/>
                <text x="160" y="26" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="600">Kabupaten Garut</text>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* STATISTIK */}
      <section className="px-6 pb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-12">
          {[
            { num: stats.trayek, label: 'Trayek Aktif', color: 'from-violet-600 to-indigo-600', icon: '🚌' },
            { num: stats.jadwal, label: 'Jadwal/hari', color: 'from-blue-600 to-cyan-600', icon: '⏰' },
          ].map(({ num, label, color, icon }) => (
            <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-4 md:p-6 text-center`}>
              <div className="text-2xl md:text-3xl mb-1">{icon}</div>
              <div className="text-2xl md:text-4xl font-bold text-white">{num}</div>
              <div className="text-xs md:text-sm text-white/70 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Fitur */}
        <h2 className="text-white font-bold text-xl md:text-2xl mb-5 text-center">Semua yang kamu butuhkan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: '🚌', title: 'Trayek', desc: '6 rute tersedia', href: '/trayek', color: 'border-violet-500/30 hover:border-violet-500' },
            { icon: '⏰', title: 'Jadwal', desc: 'Jam keberangkatan', href: '/jadwal', color: 'border-blue-500/30 hover:border-blue-500' },
            { icon: '💰', title: 'Tarif', desc: 'Harga per segmen', href: '/tarif', color: 'border-emerald-500/30 hover:border-emerald-500' },
            { icon: '🗺️', title: 'Peta', desc: 'Rute interaktif', href: '/peta', color: 'border-orange-500/30 hover:border-orange-500' },
          ].map(({ icon, title, desc, href, color }) => (
            <Link key={title} href={href}
              className={`bg-white/5 border ${color} rounded-2xl p-4 text-center transition-all hover:bg-white/10 group`}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-white font-semibold text-sm">{title}</div>
              <div className="text-gray-400 text-xs mt-1">{desc}</div>
            </Link>
          ))}
        </div>

        {/* Chatbot CTA */}
        <div className="rounded-2xl p-6 md:p-8 text-center border border-orange-500/20"
          style={{background: 'linear-gradient(135deg, #1a1a2e, #1e1b4b)'}}>
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-white font-bold text-lg mb-2">Punya pertanyaan?</h3>
          <p className="text-gray-400 text-sm mb-4">Tanya langsung ke asisten AI RuteKita — siap bantu 24 jam</p>
          <button className="px-6 py-3 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2"
            style={{background: 'linear-gradient(135deg, #f59e0b, #ef4444)'}}>
            💬 Mulai Chat
          </button>
        </div>
      </section>

      {/* BOTTOM NAV - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f0f1a]/95 border-t border-white/10 flex h-14 z-40">
        {[['/', '🏠', 'Beranda'], ['/trayek', '🚌', 'Trayek'], ['/peta', '🗺️', 'Peta'], ['/jadwal', '📅', 'Jadwal']].map(([href, icon, label]) => (
          <Link key={label} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-all
            ${label === 'Beranda' ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </div>

      {/* Chatbot FAB - mobile */}
      <button className="fixed bottom-16 right-4 md:bottom-6 md:right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 text-xl"
        style={{background: 'linear-gradient(135deg, #f59e0b, #ef4444)'}}>
        💬
      </button>

    </main>
  );
}
