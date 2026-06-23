'use client';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';

const IconCode = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const IconUsers = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconTarget = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const IconGlobe = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const IconMap = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>);
const IconBus = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6v6M15 6v6M2 12h19.6M18 18h2a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2"/><path d="M7 18h10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 6h18a1 1 0 0 1 1 1v5H2V7a1 1 0 0 1 1-1z"/></svg>);
const IconCalendar = ({ size = 20 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);

const TEAM = [
  { name: 'Arya Surya Ibrahim Aliputra', role: 'Project Lead & Developer', desc: 'Bertanggung jawab atas pengembangan keseluruhan sistem, arsitektur aplikasi, dan implementasi fitur.', initial: 'A', color: 'from-violet-500 to-indigo-500' },
  { name: 'Fidelia Angelina', role: 'Pengujian & Quality Assurance', desc: 'Memastikan seluruh fitur berjalan dengan baik melalui pengujian fungsional dan pelaporan hasil uji.', initial: 'F', color: 'from-pink-500 to-rose-500' },
  { name: 'Mochammad Syahriel Nugraha', role: 'Perancang Database', desc: 'Merancang struktur database, relasi antar tabel, dan pengelolaan data trayek di Supabase.', initial: 'M', color: 'from-blue-500 to-cyan-500' },
  { name: 'Caesy Rishonya', role: 'Dokumentasi & Pengujian', desc: 'Menyusun dokumentasi sistem dan mendukung proses pengujian aplikasi secara menyeluruh.', initial: 'C', color: 'from-emerald-500 to-teal-500' },
];

const TECH = [
  { name: 'Next.js 15', desc: 'Framework React untuk frontend & backend', color: 'bg-white/10 text-white' },
  { name: 'Tailwind CSS', desc: 'Styling utility-first', color: 'bg-cyan-500/10 text-cyan-300' },
  { name: 'Supabase', desc: 'Database PostgreSQL cloud', color: 'bg-emerald-500/10 text-emerald-300' },
  { name: 'Leaflet.js', desc: 'Peta interaktif', color: 'bg-blue-500/10 text-blue-300' },
  { name: 'OSRM', desc: 'Routing rute mengikuti jalan', color: 'bg-orange-500/10 text-orange-300' },
  { name: 'Gemini AI', desc: 'Chatbot asisten virtual', color: 'bg-violet-500/10 text-violet-300' },
  { name: 'Vercel', desc: 'Platform deployment', color: 'bg-white/10 text-white' },
  { name: 'GitHub', desc: 'Version control', color: 'bg-gray-500/10 text-gray-300' },
];

export default function Tentang() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-violet-300 font-medium">Proyek Integrasi</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Tentang <span className="bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(90deg, #a78bfa, #60a5fa)'}}>RuteKita</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Platform informasi angkutan umum Kabupaten Garut yang menyajikan data trayek, jadwal, tarif, dan peta rute secara digital dan interaktif.
          </p>
        </div>

        {/* VISI MISI */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                <IconTarget size={18} />
              </div>
              <h2 className="text-white font-bold text-base">Visi</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Menjadi platform informasi transportasi publik terpercaya di Kabupaten Garut yang memudahkan masyarakat dalam mengakses layanan angkutan umum secara digital.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                <IconGlobe size={18} />
              </div>
              <h2 className="text-white font-bold text-base">Misi</h2>
            </div>
            <ul className="text-gray-400 text-sm leading-relaxed space-y-1">
              <li>Menyajikan informasi trayek dan jadwal yang akurat</li>
              <li>Memvisualisasikan rute angkot secara interaktif di peta</li>
              <li>Menghadirkan asisten AI untuk tanya jawab transportasi</li>
              <li>Mendukung digitalisasi layanan publik Dishub Garut</li>
            </ul>
          </div>
        </div>

        {/* FITUR UNGGULAN */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-4">Fitur Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <IconBus size={20}/>, title: 'Info Trayek', desc: '6 trayek dengan detail rute & halte', color: 'text-violet-400 bg-violet-500/10' },
              { icon: <IconCalendar size={20}/>, title: 'Jadwal Real-time', desc: 'Data langsung dari database Dishub', color: 'text-blue-400 bg-blue-500/10' },
              { icon: <IconMap size={20}/>, title: 'Peta Interaktif', desc: 'Rute mengikuti jalan nyata via OSRM', color: 'text-emerald-400 bg-emerald-500/10' },
              { icon: <IconCode size={20}/>, title: 'Chatbot AI', desc: 'Asisten virtual berbasis Gemini AI', color: 'text-amber-400 bg-amber-500/10' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${color}`}>
                  {icon}
                </div>
                <div className="text-white font-semibold text-sm mb-1">{title}</div>
                <div className="text-gray-500 text-xs leading-snug">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TIM */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <IconUsers size={20} className="text-violet-400"/> Tim Pengembang
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEAM.map(({ name, role, desc, initial, color }) => (
              <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4 items-start hover:bg-white/10 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {initial}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{name}</div>
                  <div className="text-violet-400 text-xs font-medium mb-1">{role}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TEKNOLOGI */}
        <div className="mb-10">
          <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <IconCode size={20} className="text-violet-400"/> Teknologi
          </h2>
          <div className="flex flex-wrap gap-2">
            {TECH.map(({ name, desc, color }) => (
              <div key={name} className={`px-3 py-2 rounded-xl border border-white/10 ${color} text-xs font-medium`}>
                <span className="font-bold">{name}</span>
                <span className="text-gray-500 ml-1">— {desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INFO PROJECT */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-1">Dikembangkan sebagai</p>
          <p className="text-white font-bold text-base">Proyek Integrasi — Sistem Informasi</p>
        </div>

      </div>
      <BottomNav />
    </main>
  );
}
