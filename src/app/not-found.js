'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Ilustrasi */}
        <div className="text-8xl mb-6">🚌</div>
        <div className="text-6xl font-bold mb-2"
          style={{background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          404
        </div>
        <h1 className="text-xl font-bold text-white mb-3">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Sepertinya angkot yang kamu cari salah trayek 😄<br/>
          Halaman ini tidak tersedia atau sudah dipindah.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            🏠 Kembali ke Beranda
          </Link>
          <Link href="/trayek"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/10 transition-all">
            🚌 Lihat Trayek
          </Link>
        </div>
      </div>
    </main>
  );
}
