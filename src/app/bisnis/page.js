'use client';
import { useState } from 'react';
import Link from 'next/link';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '' },
  { id: 'statistik', label: 'Statistik', icon: '' },
  { id: 'potensi', label: 'Potensi', icon: '' },
  { id: 'panduan', label: 'Panduan', icon: '' },
  { id: 'rekomendasi', label: 'Rekomendasi', icon: '' },
];

export default function Bisnis() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans pb-24 md:pb-8">

      {/* Hero */}
      <section className="px-6 pt-8 pb-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-3">
          <span className="text-amber-400 text-xs"></span>
          <span className="text-xs text-amber-300 font-medium">Informasi Bisnis Angkutan Umum</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2">
          Bisnis Angkot{' '}
          <span className="bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444)'}}>
            Kabupaten Garut
          </span>
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Pelajari kondisi, statistik, potensi investasi, dan panduan memulai bisnis angkot di Garut.
        </p>
      </section>

      {/* Tab navigation */}
      <div className="sticky top-14 z-40 bg-[#0f0f1a]/95 backdrop-blur border-b border-white/10 px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map(({ id, label, icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0
                ${activeTab === id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                style={activeTab === id ? {background: 'linear-gradient(135deg, #f59e0b, #ef4444)'} : {}}>
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">

        {/* ===== TAB: OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Sejarah Angkot Garut</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Angkutan kota di Kabupaten Garut telah beroperasi sejak era 1970-an, berkembang seiring pertumbuhan
                kota Garut sebagai pusat perdagangan dan pertanian di Jawa Barat. Angkot menjadi moda transportasi
                utama yang menghubungkan pusat kota dengan kecamatan-kecamatan di sekitarnya, melayani ribuan
                penumpang setiap harinya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3"> Kondisi Saat Ini</h3>
                <ul className="space-y-2.5">
                  {[
                    'Armada aktif tersebar di 5 trayek utama',
                    'Total 41 unit armada beroperasi harian',
                    'Jam operasi rata-rata 05.00  18.00 WIB',
                    'Tarif terjangkau mulai Rp3.000  Rp15.000',
                    'Dikelola dan diawasi oleh Dishub Kab. Garut',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0"></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3"> Tantangan</h3>
                <ul className="space-y-2.5">
                  {[
                    'Persaingan dengan ojek online & kendaraan pribadi',
                    'Penurunan jumlah penumpang pasca pandemi',
                    'Armada yang mulai menua perlu peremajaan',
                    'Ketidakpastian jadwal membuat penumpang beralih',
                    'Biaya operasional BBM yang terus meningkat',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0"></span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-blue-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Arah Pengembangan</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pemerintah Kabupaten Garut bersama Dishub tengah mendorong modernisasi angkutan umum melalui
                program peremajaan armada, digitalisasi informasi layanan (seperti RuteKita), dan integrasi
                dengan moda transportasi lain untuk meningkatkan daya saing dan kenyamanan penumpang.
              </p>
            </div>
          </div>
        )}

        {/* ===== TAB: STATISTIK ===== */}
        {activeTab === 'statistik' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { num: '5', label: 'Trayek Aktif', color: 'from-violet-600 to-indigo-600', icon: '' },
                { num: '41', label: 'Total Armada', color: 'from-blue-600 to-cyan-600', icon: '' },
                { num: '±165', label: 'km Total Rute', color: 'from-emerald-600 to-teal-600', icon: '' },
                { num: '34', label: 'Jadwal/hari', color: 'from-amber-600 to-orange-600', icon: '' },
              ].map(({ num, label, color, icon }) => (
                <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-center`}>
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-xl font-bold text-white">{num}</div>
                  <div className="text-xs text-white/70 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Data Per Trayek</h3>
                <span className="text-xs text-gray-500">5 trayek aktif</span>
              </div>
              <div className="divide-y divide-white/5">
                <div className="grid grid-cols-4 px-5 py-2 text-xs text-gray-500 font-semibold">
                  <div>Trayek</div>
                  <div className="text-center">Armada</div>
                  <div className="text-center">Jarak</div>
                  <div className="text-right">Tarif Min</div>
                </div>
                {[
                  { kode: '01', rute: 'Garut Kota  Tarogong', armada: 12, jarak: '8.5 km', tarif: 'Rp3.000' },
                  { kode: '02', rute: 'Garut Kota  Cibatu', armada: 8, jarak: '35.2 km', tarif: 'Rp5.000' },
                  { kode: '03', rute: 'Garut Kota  Leles', armada: 6, jarak: '28.4 km', tarif: 'Rp4.000' },
                  { kode: '04', rute: 'Garut Kota  Wanaraja', armada: 7, jarak: '12.3 km', tarif: 'Rp4.000' },
                  { kode: '05', rute: 'Garut Kota  Kadungora', armada: 5, jarak: '40.1 km', tarif: 'Rp5.000' },
                ].map(({ kode, rute, armada, jarak, tarif }) => (
                  <div key={kode} className="grid grid-cols-4 items-center px-5 py-3 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                        {kode}
                      </span>
                      <span className="text-xs text-gray-400 hidden md:block truncate">{rute}</span>
                    </div>
                    <div className="text-xs text-violet-300 text-center font-semibold">{armada} unit</div>
                    <div className="text-xs text-emerald-300 text-center">{jarak}</div>
                    <div className="text-xs text-amber-300 text-right font-semibold">{tarif}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Distribusi Armada</h3>
              <div className="space-y-3">
                {[
                  { kode: '01', label: 'Tarogong', armada: 12, total: 41, color: '#8b5cf6' },
                  { kode: '02', label: 'Cibatu', armada: 8, total: 41, color: '#3b82f6' },
                  { kode: '04', label: 'Wanaraja', armada: 7, total: 41, color: '#f59e0b' },
                  { kode: '03', label: 'Leles', armada: 6, total: 41, color: '#ef4444' },
                  { kode: '05', label: 'Kadungora', armada: 5, total: 41, color: '#10b981' },
                ].map(({ kode, label, armada, total, color }) => (
                  <div key={kode} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16 flex-shrink-0">Trayek {kode}</span>
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${(armada/total)*100}%`, background: color }} />
                    </div>
                    <span className="text-xs font-semibold w-12 text-right" style={{color}}>{armada} unit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: POTENSI ===== */}
        {activeTab === 'potensi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '', title: 'Pasar Besar', desc: 'Kabupaten Garut berpenduduk ±2,7 juta jiwa dengan mobilitas tinggi antar kecamatan setiap harinya.', color: 'border-violet-500/30' },
                { icon: '', title: 'Dukungan Pemerintah', desc: 'Dishub Garut aktif mendukung peremajaan armada dan pengembangan rute baru untuk meningkatkan layanan.', color: 'border-blue-500/30' },
                { icon: '', title: 'Pariwisata Garut', desc: 'Garut sebagai destinasi wisata populer membuka peluang rute khusus wisata dengan tarif premium.', color: 'border-emerald-500/30' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className={`bg-white/5 border ${color} rounded-2xl p-5`}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-5"
              style={{background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(239,68,68,0.05))'}}>
              <h3 className="text-sm font-bold text-white mb-4"> Estimasi Investasi & Return</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Harga unit angkot baru', value: '~Rp 150200 jt', color: 'text-amber-300' },
                  { label: 'Pendapatan/hari (est.)', value: 'Rp 200400 rb', color: 'text-emerald-300' },
                  { label: 'Biaya operasional/hari', value: '~Rp 100150 rb', color: 'text-red-300' },
                  { label: 'Break even point (est.)', value: '35 tahun', color: 'text-violet-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1.5">{label}</div>
                    <div className={`text-sm font-bold ${color}`}>{value}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600">* Estimasi kasar. Angka aktual bergantung pada rute, kondisi armada, dan tingkat keterisian penumpang.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Segmen Pasar Potensial</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '', label: 'Pelajar & Mahasiswa', desc: 'Pengguna terbesar, rutin setiap hari' },
                  { icon: '', label: 'Pekerja Kantoran', desc: 'Mobilitas tinggi pagi & sore hari' },
                  { icon: '', label: 'Pedagang Pasar', desc: 'Rute pasar tradisional sangat ramai' },
                  { icon: '', label: 'Wisatawan Lokal', desc: 'Potensi rute wisata Garut Selatan' },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-white">{label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: PANDUAN ===== */}
        {activeTab === 'panduan' && (
          <div className="space-y-3">
            {[
              { step: '01', title: 'Pelajari Regulasi & Perizinan', desc: 'Hubungi Dinas Perhubungan Kabupaten Garut untuk informasi izin trayek, STNK angkutan umum, dan KIR kendaraan. Izin trayek diterbitkan oleh Dishub setelah memenuhi persyaratan teknis.', icon: '', color: 'border-violet-500/30' },
              { step: '02', title: 'Pilih & Beli Armada', desc: 'Pilih kendaraan yang sesuai standar angkutan umum (Mitsubishi Colt, Suzuki Carry, atau Daihatsu Espass). Pastikan kondisi mesin prima dan memenuhi standar laik jalan KIR.', icon: '', color: 'border-blue-500/30' },
              { step: '03', title: 'Daftar ke Koperasi / Organda', desc: 'Bergabung dengan koperasi angkutan atau Organda Garut untuk mendapatkan akses trayek resmi, perlindungan asuransi, dan dukungan komunitas sesama pengusaha angkot.', icon: '', color: 'border-emerald-500/30' },
              { step: '04', title: 'Rekrut & Kelola Pengemudi', desc: 'Rekrut pengemudi berpengalaman dengan SIM B1 Umum. Tetapkan sistem setoran harian yang adil (umumnya Rp 80.000120.000/hari) agar pengemudi termotivasi menjaga kualitas layanan.', icon: '', color: 'border-amber-500/30' },
              { step: '05', title: 'Operasional & Perawatan Rutin', desc: 'Jadwalkan servis rutin setiap 3 bulan atau 10.000 km. Pantau kondisi ban, rem, dan AC secara berkala. Armada terawat meningkatkan kepercayaan penumpang dan mengurangi biaya darurat.', icon: '', color: 'border-orange-500/30' },
              { step: '06', title: 'Pantau & Kembangkan Bisnis', desc: 'Catat pendapatan dan pengeluaran harian. Evaluasi kinerja setiap bulan. Pertimbangkan menambah armada di rute yang ramai atau mengajukan rute baru ke Dishub seiring berkembangnya bisnis.', icon: '', color: 'border-teal-500/30' },
            ].map(({ step, title, desc, icon, color }) => (
              <div key={step} className={`flex gap-4 bg-white/5 border ${color} rounded-2xl p-4`}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                    {icon}
                  </div>
                  <div className="text-xs text-gray-600 font-bold mt-1">{step}</div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl p-5 border border-blue-500/20 mt-2"
              style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(59,130,246,0.1))'}}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Butuh informasi lebih lanjut?</h3>
                  <p className="text-gray-400 text-xs">Hubungi Dinas Perhubungan Kabupaten Garut untuk konsultasi izin dan trayek.</p>
                </div>
                <a href="https://dishub.garutkab.go.id" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all hover:opacity-90"
                  style={{background: 'linear-gradient(135deg, #3b82f6, #6366f1)'}}>
                   Dishub Garut
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: REKOMENDASI ===== */}
        {activeTab === 'rekomendasi' && (
          <div className="space-y-4">

            {/* Rute Potensial */}
            <div className="bg-white/5 border border-violet-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Rute Paling Potensial</h3>
              <div className="flex flex-col gap-2">
                {[
                  { rute: 'Garut Kota  Tarogong', alasan: 'Rute terpadat, dekat pusat perbelanjaan & perkantoran. Cocok untuk pemula.', level: 'Sangat Disarankan', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { rute: 'Garut Kota  Wanaraja', alasan: 'Jarak sedang, melewati kawasan industri dan pasar tradisional yang ramai.', level: 'Disarankan', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { rute: 'Garut Kota  Leles', alasan: 'Potensi wisata Situ Bagendit. Penumpang konsisten terutama akhir pekan.', level: 'Disarankan', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                  { rute: 'Garut Kota  Cibatu', alasan: 'Rute panjang dengan pendapatan lebih tinggi per trip, butuh modal lebih besar.', level: 'Untuk Berpengalaman', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                ].map(({ rute, alasan, level, color, bg }) => (
                  <div key={rute} className={`flex items-start gap-3 border rounded-xl p-3 ${bg}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{rute}</span>
                        <span className={`text-xs font-semibold ${color}`}>· {level}</span>
                      </div>
                      <p className="text-xs text-gray-400">{alasan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Checklist Sebelum Mulai Usaha</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Modal awal tersedia (min. Rp 150 juta)',
                  'Sudah survei rute & potensi penumpang',
                  'Memiliki SIM B1 Umum atau sudah punya pengemudi',
                  'Sudah konsultasi ke Dishub Garut',
                  'Terdaftar di Organda atau koperasi angkutan',
                  'Kendaraan sudah lulus KIR',
                  'Asuransi kendaraan aktif',
                  'Rekening bisnis terpisah dari pribadi',
                  'Rencana perawatan rutin sudah disiapkan',
                  'Dana cadangan operasional 3 bulan tersedia',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <div className="w-4 h-4 rounded border border-white/20 flex-shrink-0"></div>
                    <span className="text-xs text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Mitra & Investor */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Tips Mencari Mitra & Investor</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon: '', title: 'Sistem Patungan (Kongsi)', desc: 'Bergabung dengan 23 orang untuk membeli 1 unit bersama. Keuntungan dan risiko dibagi rata, cocok untuk pemula dengan modal terbatas.' },
                  { icon: '', title: 'KUR (Kredit Usaha Rakyat)', desc: 'Manfaatkan program KUR dari bank pemerintah (BRI, BNI, Mandiri) dengan bunga rendah untuk pembiayaan pembelian armada angkot.' },
                  { icon: '', title: 'Koperasi Angkutan', desc: 'Koperasi angkutan di Garut sering menawarkan skema cicilan armada yang lebih fleksibel dibanding bank konvensional.' },
                  { icon: '', title: 'Jaringan Komunitas', desc: 'Ikuti grup WhatsApp atau forum pengusaha angkot Garut untuk mendapat info peluang kemitraan, armada second berkualitas, dan tips bisnis.' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-base flex-shrink-0">{icon}</div>
                    <div>
                      <div className="text-xs font-semibold text-white mb-0.5">{title}</div>
                      <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asosiasi & Komunitas */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-3"> Asosiasi & Instansi Penting</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { nama: 'Dishub Kabupaten Garut', fungsi: 'Izin trayek, regulasi, dan pengawasan operasional', icon: '' },
                  { nama: 'Organda Garut', fungsi: 'Organisasi pengusaha angkutan darat, advokasi kebijakan', icon: '' },
                  { nama: 'Koperasi Angkutan Garut', fungsi: 'Pembiayaan armada, asuransi, dan dukungan anggota', icon: '' },
                  { nama: 'BPJS Ketenagakerjaan', fungsi: 'Perlindungan pengemudi dari risiko kecelakaan kerja', icon: '' },
                ].map(({ nama, fungsi, icon }) => (
                  <div key={nama} className="flex gap-3 bg-white/5 rounded-xl p-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-white">{nama}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{fungsi}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}




