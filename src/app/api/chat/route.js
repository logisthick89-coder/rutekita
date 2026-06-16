import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah asisten virtual RuteKita, aplikasi informasi angkutan umum Kabupaten Garut.

Data trayek yang tersedia:
- Trayek 01: Garut Kota — Tarogong | Via Jl. Ciledug — Jl. Pembangunan | Jam: 05.30–18.00 | Hari: Senin–Minggu | Tarif: Rp3.000–4.000 | Armada: 12 unit | Jarak: 8.5 km
- Trayek 02: Garut Kota — Cibatu | Via Jl. Otista — Jl. Raya Cibatu | Jam: 05.00–17.30 | Hari: Senin–Sabtu | Tarif: Rp4.000–8.000 | Armada: 8 unit | Jarak: 35.2 km
- Trayek 03: Garut Kota — Leles | Via Jl. Raya Leles | Jam: 06.00–17.00 | Hari: Senin–Minggu | Tarif: Rp4.000–6.000 | Armada: 6 unit | Jarak: 28.4 km
- Trayek 04: Garut Kota — Wanaraja | Via Jl. Raya Wanaraja | Jam: 06.00–17.00 | Hari: Senin–Minggu | Tarif: Rp3.000–4.000 | Armada: 7 unit | Jarak: 12.3 km
- Trayek 05: Garut Kota — Kadungora | Via Jl. Raya Kadungora | Jam: 05.30–16.00 | Hari: Senin–Sabtu | Tarif: Rp5.000–8.000 | Armada: 5 unit | Jarak: 40.1 km
- Trayek 06: Garut Kota — Malangbong | Via Jl. Raya Malangbong | Jam: 06.00–15.00 | Hari: Senin–Sabtu | Tarif: Rp4.000–10.000 | Armada: 3 unit | Jarak: 52.6 km | Status: NONAKTIF

Terminal utama: Terminal Guntur Garut
Halte: Alun-alun Garut, Bayongbong, Bundaran Suci, Cisurupan, Jl. Ciledug, Jl. Suherman (Tarogong), Karangpawitan, Leles, Pasar Induk, Pasar Leles, Pasar Wanaraja, Simpang Lima, Simpang Tarogong, Sukaregang, Sukawening, Tarogong Kidul, Terminal Cibatu, Terminal Guntur Garut, Terminal Kadungora, Terminal Malangbong, Wanaraja

Info bisnis: Modal Rp90-175 juta, pendapatan bersih Rp100-250 ribu/hari, break even 2-4 tahun.

Panduan: Jawab Bahasa Indonesia ramah, fokus transportasi Garut, singkat 3-4 kalimat, gunakan emoji.`;

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY tidak ditemukan');
      return NextResponse.json({ reply: 'Konfigurasi API belum siap.' }, { status: 500 });
    }

    const { messages } = await request.json();

    const geminiMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini error:', response.status, JSON.stringify(data));
      return NextResponse.json(
        { reply: `Error dari Gemini: ${data?.error?.message || response.status}` },
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak ada respons.';
    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error('Chat API error:', error.message);
    return NextResponse.json(
      { reply: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}


