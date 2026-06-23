'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const IconHome = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconBus = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6v6M15 6v6M2 12h19.6M18 18h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M7 18h10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 6h18a1 1 0 0 1 1 1v5H2V7a1 1 0 0 1 1-1z"/></svg>);
const IconClock = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconMoney = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>);
const IconMap = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>);
const IconSearch = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);
const IconBriefcase = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>);
const IconInfo = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const IconMenu = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const IconClose = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

const NAV_ITEMS = [
  { href: '/', label: 'Beranda', icon: <IconHome /> },
  { href: '/trayek', label: 'Trayek', icon: <IconBus /> },
  { href: '/jadwal', label: 'Jadwal', icon: <IconClock /> },
  { href: '/tarif', label: 'Tarif', icon: <IconMoney /> },
  { href: '/peta', label: 'Peta', icon: <IconMap /> },
  { href: '/cari', label: 'Cari Trayek', icon: <IconSearch /> },
  { href: '/bisnis', label: 'Bisnis', icon: <IconBriefcase />, highlight: true },
  { href: '/tentang', label: 'Tentang', icon: <IconInfo /> },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-50 border-r border-white/10 transition-all duration-300"
        style={{ width: open ? '220px' : '64px', background: '#0d0d1a' }}>

        {/* HEADER */}
        <div className="flex items-center h-14 border-b border-white/10 flex-shrink-0 px-3">
          {open ? (
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>R</div>
                <span className="text-white text-sm">Rute<span className="text-violet-400">Kita</span></span>
              </Link>
              <button onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
                <IconClose />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <button onClick={() => setOpen(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <IconMenu />
              </button>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon, highlight }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                title={!open ? label : undefined}
                className={`flex items-center gap-3 mx-2 mb-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-violet-500/20 text-violet-300'
                    : highlight
                    ? 'text-amber-400 hover:bg-white/10 hover:text-amber-300'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}>
                <span className="flex-shrink-0">{icon}</span>
                {open && <span className="truncate">{label}</span>}
                {open && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        {open && (
          <div className="px-4 pb-4 border-t border-white/10 pt-3">
            <div className="text-xs text-gray-600 text-center">RuteKita v1.0</div>
            <div className="text-xs text-gray-700 text-center">Dishub Garut</div>
          </div>
        )}
      </aside>

      {/* Spacer konten */}
      <div className="hidden md:block flex-shrink-0 transition-all duration-300"
        style={{width: open ? '220px' : '64px'}} />
    </>
  );
}