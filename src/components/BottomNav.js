'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconBus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6v6M15 6v6M2 12h19.6M18 18h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M7 18h10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 6h18a1 1 0 0 1 1 1v5H2V7a1 1 0 0 1 1-1z"/>
  </svg>
);
const IconMap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);

const NAV_ITEMS = [
  { href: '/', icon: <IconHome />, label: 'Beranda' },
  { href: '/trayek', icon: <IconBus />, label: 'Trayek' },
  { href: '/peta', icon: <IconMap />, label: 'Peta' },
  { href: '/jadwal', icon: <IconCalendar />, label: 'Jadwal' },
  { href: '/bisnis', icon: <IconBriefcase />, label: 'Bisnis' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f0f1a]/95 backdrop-blur border-t border-white/10 flex h-16 z-40">
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-all
            ${active ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
            {icon}
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
