'use client';
import { useState, useRef, useEffect } from 'react';

const TRAYEK_DATA = {
  '01': { nama: 'Garut Kota — Tarogong', jam: '05.30–18.00', tarif: 'Rp3.000–4.000', halte: 'Terminal Guntur → Alun-alun Garut → Jl. Ciledug → Simpang Tarogong → Tarogong Kidul', hari: 'Senin–Minggu', jenis: 'kota' },
  '02': { nama: 'Garut Kota — Cibatu', jam: '05.00–17.30', tarif: 'Rp4.000–8.000', halte: 'Terminal Guntur → Pasar Induk → Bayongbong → Cisurupan → Terminal Cibatu', hari: 'Senin–Sabtu', jenis: 'antar kecamatan' },
  '03': { nama: 'Garut Kota — Leles', jam: '06.00–17.00', tarif: 'Rp4.000–6.000', halte: 'Terminal Guntur → Alun-alun → Simpang Lima → Tarogong → Pasar Leles', hari: 'Senin–Minggu', jenis: 'antar kecamatan' },
  '04': { nama: 'Garut Kota — Wanaraja', jam: '06.00–17.00', tarif: 'Rp3.000–4.000', halte: 'Terminal Guntur → Sukaregang → Bundaran Suci → Karangpawitan → Pasar Wanaraja', hari: 'Senin–Minggu', jenis: 'kota' },
  '05': { nama: 'Garut Kota — Kadungora', jam: '05.30–16.00', tarif: 'Rp5.000–8.000', halte: 'Terminal Guntur → Simpang Lima → Tarogong → Leles → Terminal Kadungora', hari: 'Senin–Sabtu', jenis: 'antar kecamatan' },
  '06': { nama: 'Garut Kota — Malangbong', jam: '06.00–15.00', tarif: 'Rp4.000–10.000', halte: 'Terminal Guntur → Karangpawitan → Wanaraja → Sukawening → Terminal Malangbong', hari: 'Senin–Sabtu', jenis: 'pedesaan' },
};

function getResponse(input) {
  const q = input.toLowerCase();
  if (q.match(/^(halo|hai|hi|hello|selamat|assalam|hei)/)) {
    return `Halo! Saya asisten RuteKita 👋\n\nSaya bisa bantu kamu soal:\n🚌 Info trayek angkutan umum Garut\n💼 Bisnis dan izin perusahaan angkot\n📊 Rekomendasi trayek untuk investasi\n\nMau tanya apa?`;
  }
  for (const [kode, t] of Object.entries(TRAYEK_DATA)) {
    if (q.includes(`trayek ${kode}`) || q.includes(`trayek-${kode}`)) {
      return `🚌 Trayek ${kode} — ${t.nama}\n\n📍 Halte: ${t.halte}\n⏰ Jam: ${t.jam}\n📅 Hari: ${t.hari}\n💰 Tarif: ${t.tarif}\n🏷️ Jenis: ${t.jenis}`;
    }
  }
  if (q.includes('tarogong')) return `🚌 Trayek 01 melayani rute Garut Kota — Tarogong.\n⏰ Jam: 05.30–18.00 | 💰 Tarif: Rp3.000–4.000\n📅 Beroperasi setiap hari Senin–Minggu.`;
  if (q.includes('cibatu')) return `🚌 Trayek 02 melayani rute Garut Kota — Cibatu.\n⏰ Jam: 05.00–17.30 | 💰 Tarif: Rp4.000–8.000\n📅 Beroperasi Senin–Sabtu.`;
  if (q.includes('leles')) return `🚌 Trayek 03 melayani rute Garut Kota — Leles.\n⏰ Jam: 06.00–17.00 | 💰 Tarif: Rp4.000–6.000\n📅 Beroperasi setiap hari.`;
  if (q.includes('wanaraja')) return `🚌 Trayek 04 melayani rute Garut Kota — Wanaraja.\n⏰ Jam: 06.00–17.00 | 💰 Tarif: Rp3.000–4.000\n📅 Beroperasi setiap hari.`;
  if (q.includes('kadungora')) return `🚌 Trayek 05 melayani rute Garut Kota — Kadungora.\n⏰ Jam: 05.30–16.00 | 💰 Tarif: Rp5.000–8.000\n📅 Beroperasi Senin–Sabtu.`;
  if (q.includes('malangbong')) return `🚌 Trayek 06 melayani rute Garut Kota — Malangbong.\n⚠️ Saat ini trayek ini berstatus NONAKTIF.\n💰 Tarif: Rp4.000–10.000`;
  if (q.match(/semua trayek|daftar trayek|ada trayek apa|trayek apa saja/)) {
    return `🚌 6 Trayek Angkutan Umum Garut:\n\n01 — Garut Kota → Tarogong ✅\n02 — Garut Kota → Cibatu ✅\n03 — Garut Kota → Leles ✅\n04 — Garut Kota → Wanaraja ✅\n05 — Garut Kota → Kadungora ✅\n06 — Garut Kota → Malangbong ⚠️ Nonaktif\n\nTanya detail trayek tertentu, contoh: "info trayek 01"`;
  }
  if (q.match(/jadwal|jam|berangkat|keberangkatan/)) {
    return `⏰ Jadwal Operasi:\n\n• Trayek 01: 05.30–18.00\n• Trayek 02: 05.00–17.30\n• Trayek 03: 06.00–17.00\n• Trayek 04: 06.00–17.00\n• Trayek 05: 05.30–16.00\n• Trayek 06: 06.00–15.00 (nonaktif)`;
  }
  if (q.match(/tarif|harga|ongkos|bayar|biaya/)) {
    return `💰 Tarif Angkutan Garut:\n\n• Trayek 01 (Tarogong): Rp3.000–4.000\n• Trayek 02 (Cibatu): Rp4.000–8.000\n• Trayek 03 (Leles): Rp4.000–6.000\n• Trayek 04 (Wanaraja): Rp3.000–4.000\n• Trayek 05 (Kadungora): Rp5.000–8.000\n• Trayek 06 (Malangbong): Rp4.000–10.000\n\n*Tarif dapat berubah sewaktu-waktu`;
  }
  if (q.match(/halte|pemberhentian|berhenti|lewat mana/)) {
    return `🚏 Setiap trayek memiliki 5 halte. Contoh Trayek 01:\nTerminal Guntur → Alun-alun Garut → Jl. Ciledug → Simpang Tarogong → Tarogong Kidul\n\nTanya halte trayek tertentu, contoh: "halte trayek 02"`;
  }
  if (q.match(/bisnis|usaha|investasi|modal|untung|profit|penghasilan|pendapatan/)) {
    if (q.match(/modal|biaya|investasi|harga/)) {
      return `💼 Estimasi Modal Bisnis Angkot Garut:\n\n🚌 Pembelian angkot bekas: Rp80–150 juta\n🔧 Renovasi & cat: Rp5–15 juta\n📄 Izin & administrasi: Rp2–5 juta\n⛽ Modal operasional awal: Rp3–5 juta\n\nTotal estimasi: Rp90–175 juta per unit\n\n💡 Balik modal estimasi 2–4 tahun.`;
    }
    if (q.match(/untung|profit|penghasilan|pendapatan/)) {
      return `📊 Estimasi Pendapatan Angkot Garut:\n\n🚌 Per rit (PP): 20–40 penumpang\n💰 Rata-rata tarif: Rp4.000–6.000\n📅 Per hari: Rp200.000–500.000 (kotor)\n⛽ Setelah BBM & setoran: Rp100.000–250.000 (bersih)`;
    }
    return `💼 Memulai Bisnis Angkot di Garut:\n\n1️⃣ Pilih trayek yang potensial\n2️⃣ Beli kendaraan (min. standar Dishub)\n3️⃣ Daftar ke Organda Garut\n4️⃣ Urus izin trayek ke Dishub Garut\n5️⃣ Ikuti uji KIR kendaraan\n\nMau info lebih detail? Tanya soal modal, izin, atau rekomendasi trayek!`;
  }
  if (q.match(/izin|legal|perizinan|kir|organda|dishub|surat|dokumen/)) {
    return `📄 Izin Usaha Angkot Garut:\n\n1. STNK & KIR — uji kelayakan setiap 6 bulan\n2. Izin Trayek — dari Dishub Kab. Garut\n3. Keanggotaan Organda — wajib bergabung\n4. NIB — via OSS (oss.go.id)\n\n📍 Dishub Garut: Jl. Pembangunan No. 181, Garut`;
  }
  if (q.match(/rekomen|saran|terbaik|bagus|potensial|pilih trayek|trayek mana/)) {
    return `📊 Rekomendasi Trayek untuk Bisnis:\n\n🥇 Trayek 01 (Tarogong) — TERBAIK\n• 7 hari/minggu, rute dalam kota\n\n🥈 Trayek 02 (Cibatu) — SANGAT BAIK\n• Tarif lebih tinggi, melewati wisata\n\n🥉 Trayek 03 (Leles) — BAIK\n• Ramai di akhir pekan\n\n⚠️ Hindari Trayek 06 — nonaktif`;
  }
  if (q.match(/cara|langkah|mulai|daftar|mendaftar|bagaimana/)) {
    return `📝 Cara Memulai Usaha Angkot:\n\n1. Survei trayek yang diminati\n2. Beli kendaraan sesuai standar\n3. Daftar ke Organda Garut\n4. Ajukan izin trayek ke Dishub\n5. Uji KIR kendaraan\n6. Siapkan pengemudi\n7. Mulai beroperasi!`;
  }
  if (q.match(/peta|lokasi|dimana|terminal|garut/)) {
    return `🗺️ Terminal utama adalah Terminal Guntur — titik awal semua 6 trayek.\n\nLihat peta rute interaktif di halaman Peta pada menu navigasi!`;
  }
  return `Maaf, saya kurang paham 🙏\n\nSaya bisa bantu tentang:\n• Info trayek (contoh: "jadwal trayek 01")\n• Tarif (contoh: "tarif ke Leles")\n• Bisnis angkot (contoh: "modal usaha angkot")\n• Rekomendasi (contoh: "trayek mana yang bagus")`;
}

const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

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

  // Listener untuk dibuka dari tombol luar (card CTA)
  useEffect(() => {
    function handleOpen() { setOpen(true); }
    window.addEventListener('rutekita:openchat', handleOpen);
    return () => window.removeEventListener('rutekita:openchat', handleOpen);
  }, []);

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
      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Buka asisten RuteKita"
        className="fixed z-50 transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          bottom: '24px',
          right: '24px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}>
        {open ? <IconClose /> : <IconChat />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed z-50 rounded-2xl border border-white/10 flex flex-col overflow-hidden"
          style={{
            background: '#13131f',
            width: 'min(360px, calc(100vw - 16px))',
            maxHeight: '520px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            bottom: '80px',
            right: '24px',
          }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10"
            style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base flex-shrink-0">🤖</div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">Asisten RuteKita</div>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Online • Siap membantu
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <IconClose />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
            style={{minHeight: '200px', maxHeight: '340px'}}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs flex-shrink-0 mb-0.5">🤖</div>
                )}
                <div className={`max-w-[80%] px-3 py-2.5 text-xs leading-relaxed whitespace-pre-line
                  ${m.role === 'user'
                    ? 'text-white rounded-2xl rounded-br-sm'
                    : 'text-gray-200 rounded-2xl rounded-bl-sm border border-white/5'}`}
                  style={m.role === 'user'
                    ? {background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}
                    : {background: 'rgba(255,255,255,0.06)'}}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => setInput(s)}
                  className="whitespace-nowrap text-xs px-2.5 py-1 rounded-full border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 transition-all flex-shrink-0">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Tanya sesuatu..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500/60 transition-colors"
            />
            <button onClick={sendMessage} disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-all hover:opacity-90 flex-shrink-0"
              style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}}>
              <IconSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
