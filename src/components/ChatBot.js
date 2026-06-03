'use client';
import { useState, useRef, useEffect } from 'react';

const TRAYEK_DATA = {
  '01': { nama: 'Garut Kota — Tarogong', jam: '05.30–18.00', tarif: 'Rp3.000–4.000', halte: 'Terminal Guntur → Alun-alun Garut → Jl. Ciledug → Simpang Tarogong → Tarogong Kidul', hari: 'Senin–Minggu', jenis: 'kota', potensi: 'sangat tinggi' },
  '02': { nama: 'Garut Kota — Cibatu', jam: '05.00–17.30', tarif: 'Rp4.000–8.000', halte: 'Terminal Guntur → Pasar Induk → Bayongbong → Cisurupan → Terminal Cibatu', hari: 'Senin–Sabtu', jenis: 'antar kecamatan', potensi: 'tinggi' },
  '03': { nama: 'Garut Kota — Leles', jam: '06.00–17.00', tarif: 'Rp4.000–6.000', halte: 'Terminal Guntur → Alun-alun → Simpang Lima → Tarogong → Pasar Leles', hari: 'Senin–Minggu', jenis: 'antar kecamatan', potensi: 'tinggi' },
  '04': { nama: 'Garut Kota — Wanaraja', jam: '06.00–17.00', tarif: 'Rp3.000–4.000', halte: 'Terminal Guntur → Sukaregang → Bundaran Suci → Karangpawitan → Pasar Wanaraja', hari: 'Senin–Minggu', jenis: 'kota', potensi: 'sedang' },
  '05': { nama: 'Garut Kota — Kadungora', jam: '05.30–16.00', tarif: 'Rp5.000–8.000', halte: 'Terminal Guntur → Simpang Lima → Tarogong → Leles → Terminal Kadungora', hari: 'Senin–Sabtu', jenis: 'antar kecamatan', potensi: 'tinggi' },
  '06': { nama: 'Garut Kota — Malangbong', jam: '06.00–15.00', tarif: 'Rp4.000–10.000', halte: 'Terminal Guntur → Karangpawitan → Wanaraja → Sukawening → Terminal Malangbong', hari: 'Senin–Sabtu', jenis: 'pedesaan', potensi: 'rendah (nonaktif)' },
};

function getResponse(input) {
  const q = input.toLowerCase();

  // Sapaan
  if (q.match(/^(halo|hai|hi|hello|selamat|assalam|hei)/)) {
    return `Halo! Saya asisten RuteKita 👋\n\nSaya bisa bantu kamu soal:\n🚌 Info trayek angkutan umum Garut\n💼 Bisnis dan izin perusahaan angkot\n📊 Rekomendasi trayek untuk investasi\n\nMau tanya apa?`;
  }

  // Info trayek spesifik
  for (const [kode, t] of Object.entries(TRAYEK_DATA)) {
    if (q.includes(`trayek ${kode}`) || q.includes(`trayek-${kode}`)) {
      return `🚌 **Trayek ${kode} — ${t.nama}**\n\n📍 Halte: ${t.halte}\n⏰ Jam: ${t.jam}\n📅 Hari: ${t.hari}\n💰 Tarif: ${t.tarif}\n🏷️ Jenis: ${t.jenis}`;
    }
  }

  // Trayek ke tujuan tertentu
  if (q.includes('tarogong')) return `🚌 Trayek 01 melayani rute Garut Kota — Tarogong.\n⏰ Jam: 05.30–18.00 | 💰 Tarif: Rp3.000–4.000\n📅 Beroperasi setiap hari Senin–Minggu.`;
  if (q.includes('cibatu')) return `🚌 Trayek 02 melayani rute Garut Kota — Cibatu.\n⏰ Jam: 05.00–17.30 | 💰 Tarif: Rp4.000–8.000\n📅 Beroperasi Senin–Sabtu.`;
  if (q.includes('leles')) return `🚌 Trayek 03 melayani rute Garut Kota — Leles.\n⏰ Jam: 06.00–17.00 | 💰 Tarif: Rp4.000–6.000\n📅 Beroperasi setiap hari.`;
  if (q.includes('wanaraja')) return `🚌 Trayek 04 melayani rute Garut Kota — Wanaraja.\n⏰ Jam: 06.00–17.00 | 💰 Tarif: Rp3.000–4.000\n📅 Beroperasi setiap hari.`;
  if (q.includes('kadungora')) return `🚌 Trayek 05 melayani rute Garut Kota — Kadungora.\n⏰ Jam: 05.30–16.00 | 💰 Tarif: Rp5.000–8.000\n📅 Beroperasi Senin–Sabtu.`;
  if (q.includes('malangbong')) return `🚌 Trayek 06 melayani rute Garut Kota — Malangbong.\n⚠️ Saat ini trayek ini berstatus NONAKTIF.\n💰 Tarif: Rp4.000–10.000`;

  // Semua trayek
  if (q.match(/semua trayek|daftar trayek|ada trayek apa|trayek apa saja/)) {
    return `🚌 **6 Trayek Angkutan Umum Garut:**\n\n01 — Garut Kota → Tarogong ✅\n02 — Garut Kota → Cibatu ✅\n03 — Garut Kota → Leles ✅\n04 — Garut Kota → Wanaraja ✅\n05 — Garut Kota → Kadungora ✅\n06 — Garut Kota → Malangbong ⚠️ Nonaktif\n\nTanya detail trayek tertentu, contoh: "info trayek 01"`;
  }

  // Jadwal
  if (q.match(/jadwal|jam|berangkat|keberangkatan/)) {
    if (q.includes('pagi')) return `🌅 Jadwal pagi tersedia mulai jam 05.00 (Trayek 02) dan 05.30 (Trayek 01 & 05). Cocok untuk commuter pagi hari.`;
    return `⏰ **Jadwal Operasi:**\n\n• Trayek 01: 05.30–18.00\n• Trayek 02: 05.00–17.30\n• Trayek 03: 06.00–17.00\n• Trayek 04: 06.00–17.00\n• Trayek 05: 05.30–16.00\n• Trayek 06: 06.00–15.00 (nonaktif)\n\nSemua trayek beroperasi dari Terminal Guntur Garut.`;
  }

  // Tarif
  if (q.match(/tarif|harga|ongkos|bayar|biaya/)) {
    return `💰 **Tarif Angkutan Garut:**\n\n• Trayek 01 (Tarogong): Rp3.000–4.000\n• Trayek 02 (Cibatu): Rp4.000–8.000\n• Trayek 03 (Leles): Rp4.000–6.000\n• Trayek 04 (Wanaraja): Rp3.000–4.000\n• Trayek 05 (Kadungora): Rp5.000–8.000\n• Trayek 06 (Malangbong): Rp4.000–10.000\n\n*Tarif dapat berubah sewaktu-waktu`;
  }

  // Halte
  if (q.match(/halte|pemberhentian|berhenti|lewat mana/)) {
    return `🚏 Setiap trayek memiliki 5 halte. Contoh Trayek 01:\nTerminal Guntur → Alun-alun Garut → Jl. Ciledug → Simpang Tarogong → Tarogong Kidul\n\nTanya halte trayek tertentu, contoh: "halte trayek 02"`;
  }

  // ===== BISNIS ANGKOT =====
  if (q.match(/bisnis|usaha|investasi|modal|untung|profit|penghasilan|pendapatan/)) {
    if (q.match(/modal|biaya|investasi|harga/)) {
      return `💼 **Estimasi Modal Bisnis Angkot Garut:**\n\n🚌 Pembelian angkot bekas: Rp80–150 juta\n🔧 Renovasi & cat: Rp5–15 juta\n📄 Izin & administrasi: Rp2–5 juta\n⛽ Modal operasional awal: Rp3–5 juta\n\n**Total estimasi: Rp90–175 juta per unit**\n\n💡 Balik modal estimasi 2–4 tahun tergantung trayek dan pengelolaan.`;
    }
    if (q.match(/untung|profit|penghasilan|pendapatan/)) {
      return `📊 **Estimasi Pendapatan Angkot Garut:**\n\n🚌 Per rit (PP): 20–40 penumpang\n💰 Rata-rata tarif: Rp4.000–6.000\n📅 Per hari: Rp200.000–500.000 (kotor)\n⛽ Setelah BBM & setoran: Rp100.000–250.000 (bersih)\n\n💡 Trayek ramai (01, 02, 03) bisa lebih tinggi di jam sibuk.`;
    }
    return `💼 **Memulai Bisnis Angkot di Garut:**\n\n1️⃣ Pilih trayek yang potensial\n2️⃣ Beli kendaraan (min. standar Dishub)\n3️⃣ Daftar ke Organda Garut\n4️⃣ Urus izin trayek ke Dishub Garut\n5️⃣ Ikuti uji KIR kendaraan\n6️⃣ Bayar retribusi terminal\n\nMau info lebih detail? Tanya soal modal, izin, atau rekomendasi trayek!`;
  }

  // Izin & legalitas
  if (q.match(/izin|legal|perizinan|kir|organda|dishub|surat|dokumen/)) {
    return `📄 **Izin Usaha Angkot Garut:**\n\n1. **STNK & KIR** — uji kelayakan kendaraan setiap 6 bulan di Dishub Garut\n2. **Izin Trayek** — dari Dinas Perhubungan Kab. Garut\n3. **Keanggotaan Organda** — wajib bergabung dengan Organda Garut\n4. **NIB** — Nomor Induk Berusaha via OSS (oss.go.id)\n5. **NPWP Usaha** — jika berbadan hukum\n\n📍 Alamat Dishub Garut: Jl. Pembangunan No. 181, Garut\n📞 Hubungi Organda Garut untuk info keanggotaan.`;
  }

  // Rekomendasi trayek
  if (q.match(/rekomen|saran|terbaik|bagus|potensial|pilih trayek|trayek mana/)) {
    return `📊 **Rekomendasi Trayek untuk Bisnis:**\n\n🥇 **Trayek 01 (Tarogong)** — TERBAIK\n• Beroperasi 7 hari/minggu\n• Rute dalam kota, penumpang stabil\n• Tarif kompetitif Rp3.000–4.000\n\n🥈 **Trayek 02 (Cibatu)** — SANGAT BAIK\n• Rute antar kecamatan, tarif lebih tinggi\n• Melewati kawasan wisata & industri\n\n🥉 **Trayek 03 (Leles)** — BAIK\n• Jalur wisata Situ Bagendit & Candi Cangkuang\n• Ramai di akhir pekan\n\n⚠️ **Hindari Trayek 06** — saat ini nonaktif\n\n💡 Untuk pemula, mulai dari Trayek 01 atau 04 karena rute lebih pendek dan mudah dikelola.`;
  }

  // Cara daftar / mulai
  if (q.match(/cara|langkah|mulai|daftar|mendaftar|bagaimana/)) {
    return `📝 **Cara Memulai Usaha Angkot Garut:**\n\n1. Survei trayek yang diminati\n2. Beli kendaraan sesuai standar (min. mikrobus)\n3. Daftarkan ke Organda Garut\n4. Ajukan izin trayek ke Dishub Garut\n5. Lakukan uji KIR kendaraan\n6. Siapkan pengemudi (bisa sistem setoran)\n7. Mulai beroperasi!\n\n💡 Tips: Bergabung dengan koperasi angkutan yang sudah ada untuk lebih mudah mendapat izin trayek.`;
  }

  // Peta / lokasi
  if (q.match(/peta|lokasi|dimana|terminal|garut/)) {
    return `🗺️ Terminal utama angkutan Garut adalah **Terminal Guntur** yang menjadi titik awal semua 6 trayek.\n\nLihat peta rute interaktif di halaman **Peta** pada menu navigasi!`;
  }

  // Tidak dikenali
  return `Maaf, saya kurang paham pertanyaannya 🙏\n\nSaya bisa bantu tentang:\n• Info trayek (contoh: "jadwal trayek 01")\n• Tarif angkutan (contoh: "tarif ke Leles")\n• Bisnis angkot (contoh: "modal usaha angkot")\n• Izin usaha (contoh: "cara izin trayek")\n• Rekomendasi (contoh: "trayek mana yang bagus")\n\nCoba tanya dengan kata kunci di atas ya!`;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten RuteKita 👋\n\nSaya bisa bantu soal:\n🚌 Info trayek angkutan umum Garut\n💼 Bisnis dan izin perusahaan angkot\n📊 Rekomendasi trayek untuk investasi\n\nMau tanya apa?' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const reply = { role: 'assistant', content: getResponse(input.trim()) };
    setMessages(prev => [...prev, userMsg, reply]);
    setInput('');
  }

  const SUGGESTIONS = ['Semua trayek', 'Jadwal trayek 01', 'Modal usaha angkot', 'Trayek terbaik?'];

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-16 md:bottom-6 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg z-50 text-xl transition-all hover:scale-110"
        style={{background: 'linear-gradient(135deg, #f59e0b, #ef4444)'}}>
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-32 md:bottom-24 right-4 md:right-6 w-[calc(100vw-32px)] md:w-96 rounded-2xl border border-white/10 z-50 flex flex-col overflow-hidden"
          style={{background: '#16162a', maxHeight: '70vh', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>

          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="text-sm font-bold text-white">Asisten RuteKita</div>
              <div className="text-xs text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white text-lg">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{minHeight: '200px', maxHeight: '40vh'}}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">🤖</div>
                )}
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                  ${m.role === 'user' ? 'text-white rounded-tr-sm' : 'text-gray-200 bg-white/10 rounded-tl-sm'}`}
                  style={m.role === 'user' ? {background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'} : {}}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 transition-all flex-shrink-0">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Tanya sesuatu..."
              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-violet-500"
            />
            <button onClick={sendMessage} disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all"
              style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
