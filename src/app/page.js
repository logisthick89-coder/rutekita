'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { SkeletonStatCard } from '@/components/Skeleton';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const IconBus = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 6v6M15 6v6M2 12h19.6M18 18h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M7 18h10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 6h18a1 1 0 0 1 1 1v5H2V7a1 1 0 0 1 1-1z"/></svg>);
const IconClock = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconUsers = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconMap = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>);
const IconMoney = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>);
const IconSearch = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconHome = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconCalendar = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconChat = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const IconBriefcase = ({ size = 20, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="12" y1="12" x2="12.01" y2="12"/></svg>);
const IconRobot = ({ size = 36, className = '' }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><path d="M8 15h.01M16 15h.01"/></svg>);

function openChatBot() {
  window.dispatchEvent(new CustomEvent('rutekita:openchat'));
}

function MarqueeTitle() {
  const texts = [
    ' Naik angkot di Garut jadi lebih mudah',
    ' Temukan rute angkutan umum Kabupaten Garut',
    ' Cek jadwal & tarif angkot real-time',
    ' Lihat peta rute interaktif seluruh trayek',
    ' Informasi bisnis & investasi angkutan umum',
  ];
  const repeated = [...texts, ...texts, ...texts, ...texts];

  return (
    <div className="overflow-hidden w-full" style={{maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: 'marquee-smooth 30s linear infinite',
        willChange: 'transform',
      }}>
        {repeated.map((text, i) => (
          <span key={i}
            className="text-base md:text-xl font-bold mx-8 bg-clip-text text-transparent flex-shrink-0"
            style={{backgroundImage: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)'}}>
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-smooth {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
  );
}

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (target === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, started]);

  useEffect(() => {
    if (!started || target === 0) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

function StatCard({ num, label, color, icon }) {
  const { count, ref } = useCountUp(num);
  return (
    <div ref={ref} className={`bg-gradient-to-br ${color} rounded-2xl p-3 md:p-6 text-center`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-xl md:text-4xl font-bold text-white">{count}</div>
      <div className="text-xs text-white/70 mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

export default function Home() {
  const [stats, setStats] = useState({ trayek: 0, jadwal: 0, armada: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [t, j, armadaRes] = await Promise.all([
        supabase.from('trayek').select('id', { count: 'exact' }).eq('aktif', true),
        supabase.from('jadwal').select('id', { count: 'exact' }),
        supabase.from('trayek').select('jumlah_armada'),
      ]);
      setLoading(false);
      setStats({
        trayek: t.count || 0,
        jadwal: j.count || 0,
        armada: (armadaRes.data || []).reduce((sum, t) => sum + (t.jumlah_armada || 0), 0),
      });
    }
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans">

      {/* MARQUEE TITLE */}
      <div className="py-4 md:py-6 border-b border-white/5 overflow-hidden">
        <MarqueeTitle />
      </div>

      {/* HERO */}
      <section className="px-6 pt-8 pb-6 md:pt-14 md:pb-16 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16">
          <div className="flex-1 mb-6 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-violet-300 font-medium">Data resmi Dishub Garut</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
              Naik angkot di Garut<br/>
              <span className="bg-clip-text text-transparent"
                style={{backgroundImage: 'linear-gradient(90deg, #a78bfa, #60a5fa, #34d399)'}}>
                jadi lebih mudah
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-md">
              Temukan trayek, jadwal keberangkatan, tarif, dan rute angkutan umum Kabupaten Garut — semua dalam satu tempat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/cari"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 w-full sm:w-auto"
                style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                <IconSearch size={16}/> Cari Trayek
              </Link>
              <Link href="/peta"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/10 transition-all w-full sm:w-auto">
                <IconMap size={16}/> Lihat Peta
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[200px] md:max-w-sm">
              <img src="/selamat-datang.jpeg" alt="Kota Garut"
                className="w-full rounded-3xl object-cover shadow-2xl"
                style={{maxHeight: '300px'}} />
            </div>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="px-6 pb-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
          {loading ? (
            [0,1,2].map(i => <SkeletonStatCard key={i} />)
          ) : (
            [
              { num: stats.trayek, label: 'Trayek Aktif', color: 'from-violet-600 to-indigo-600', icon: <IconBus size={24} className="text-white/90"/> },
              { num: stats.jadwal, label: 'Jadwal/hari', color: 'from-blue-600 to-cyan-600', icon: <IconClock size={24} className="text-white/90"/> },
              { num: stats.armada, label: 'Total Armada', color: 'from-emerald-600 to-teal-600', icon: <IconUsers size={24} className="text-white/90"/> },
            ].map(({ num, label, color, icon }) => (
              <StatCard key={label} num={num} label={label} color={color} icon={icon} />
            ))
          )}
        </div>

        <h2 className="text-white font-bold text-xl md:text-2xl mb-4 text-center">Semua yang kamu butuhkan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {[
            { icon: <IconBus size={22}/>, title: 'Trayek', desc: '6 rute tersedia', href: '/trayek', accent: 'hover:border-violet-500', iconBg: 'bg-violet-500/10 text-violet-400' },
            { icon: <IconClock size={22}/>, title: 'Jadwal', desc: 'Jam keberangkatan', href: '/jadwal', accent: 'hover:border-blue-500', iconBg: 'bg-blue-500/10 text-blue-400' },
            { icon: <IconMoney size={22}/>, title: 'Tarif', desc: 'Harga per segmen', href: '/tarif', accent: 'hover:border-emerald-500', iconBg: 'bg-emerald-500/10 text-emerald-400' },
            { icon: <IconMap size={22}/>, title: 'Peta', desc: 'Rute interaktif', href: '/peta', accent: 'hover:border-orange-500', iconBg: 'bg-orange-500/10 text-orange-400' },
            { icon: <IconSearch size={22}/>, title: 'Cari Trayek', desc: 'Cari dari ke', href: '/cari', accent: 'hover:border-violet-500', iconBg: 'bg-violet-500/10 text-violet-400' },
            { icon: <IconBriefcase size={22}/>, title: 'Bisnis', desc: 'Info usaha angkot', href: '/bisnis', accent: 'hover:border-amber-500', iconBg: 'bg-amber-500/10 text-amber-400' },
          ].map(({ icon, title, desc, href, accent, iconBg }) => (
            <Link key={title} href={href}
              className={`bg-white/5 border border-white/10 ${accent} rounded-2xl p-4 flex flex-col items-center text-center transition-all hover:bg-white/10`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${iconBg}`}>
                {icon}
              </div>
              <div className="text-white font-semibold text-sm">{title}</div>
              <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
            </Link>
          ))}
        </div>

        {/* Chatbot CTA */}
        <div className="rounded-2xl p-6 md:p-8 border border-white/10"
          style={{background: 'linear-gradient(135deg, #1a1a2e, #1e1b4b)'}}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                <IconRobot size={24} className="text-white"/>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Punya pertanyaan?</h3>
                <p className="text-gray-400 text-sm">Tanya asisten AI RuteKita — siap bantu 24 jam</p>
              </div>
            </div>
            <button onClick={openChatBot}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all hover:opacity-90"
              style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              <IconChat size={16}/> Mulai Chat
            </button>
          </div>
        </div>
      </section>

      {/* BOTTOM NAV mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f0f1a]/95 backdrop-blur border-t border-white/10 flex h-16 z-40">
        {[
          { href: '/', icon: <IconHome size={20}/>, label: 'Beranda', active: true },
          { href: '/trayek', icon: <IconBus size={20}/>, label: 'Trayek', active: false },
          { href: '/peta', icon: <IconMap size={20}/>, label: 'Peta', active: false },
          { href: '/jadwal', icon: <IconCalendar size={20}/>, label: 'Jadwal', active: false },
        ].map(({ href, icon, label, active }) => (
          <Link key={label} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-all
            ${active ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
            {icon}
            <span>{label}</span>
          </Link>
        ))}
      </div>

    </main>
  );
}

