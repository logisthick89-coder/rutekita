import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah asisten virtual RuteKita, aplikasi informasi angkutan umum Kabupaten Garut.

Data trayek yang tersedia:
- Trayek 01: Garut Kota  Tarogong | Via Jl. Ciledug  Jl. Pembangunan | Jam: 05.3018.00 | Hari: SeninMinggu | Tarif: Rp3.0004.000 | Armada: 12 unit | Jarak: 8.5 km
- Trayek 02: Garut Kota  Cibatu | Via Jl. Otista  Jl. Raya Cibatu | Jam: 05.0017.30 | Hari: SeninSabtu | Tarif: Rp4.0008.000 | Armada: 8 unit | Jarak: 35.2 km
- Trayek 03: Garut Kota  Leles | Via Jl. Raya Leles | Jam: 06.0017.00 | Hari: SeninMinggu | Tarif: Rp4.0006.000 | Armada: 6 unit | Jarak: 28.4 km
- Trayek 04: Garut Kota  Wanaraja | Via Jl. Raya Wanaraja | Jam: 06.0017.00 | Hari: SeninMinggu | Tarif: Rp3.0004.000 | Armada: 7 unit | Jarak: 12.3 km
- Trayek 05: Garut Kota  Kadungora | Via Jl. Raya Kadungora | Jam: 05.3016.00 | Hari: SeninSabtu | Tarif: Rp5.0008.000 | Armada: 5 unit | Jarak: 40.1 km
- Trayek 06: Garut Kota  Malangbong | Via Jl. Raya Malangbong | Jam: 06.0015.00 | Hari: SeninSabtu | Tarif: Rp4.00010.000 | Armada: 3 unit | Jarak: 52.6 km | Status: NONAKTIF

Terminal utama: Terminal Guntur Garut
Halte: Alun-alun Garut, Bayongbong, Bundaran Suci, Cisurupan, Jl. Ciledug, Jl. Suherman (Tarogong), Karangpawitan, Leles, Pasar Induk, Pasar Leles, Pasar Wanaraja, Simpang Lima, Simpang Tarogong, Sukaregang, Sukawening, Tarogong Kidul, Terminal Cibatu, Terminal Guntur Garut, Terminal Kadungora, Terminal Malangbong, Wanaraja

Info bisnis: Modal Rp90-175 juta, pendapatan bersih Rp100-250 ribu/hari, break even 2-4 tahun.

Panduan: Jawab Bahasa Indonesia ramah, fokus transportasi Garut, singkat 3-4 kalimat, gunakan emoji.`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function callGemini(apiKey, geminiMessages, attempt = 1) {
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

  // Kalau server Gemini overload (503) atau rate limit (429), retry
  if ((response.status === 503 || response.status === 429) && attempt < 3) {
    const delay = attempt * 2000; // percobaan 1: tunggu 2 detik, percobaan 2: tunggu 4 detik
    console.log(`Gemini ${response.status}, retry ke-${attempt} setelah ${delay}ms...`);
    await sleep(delay);
    return callGemini(apiKey, geminiMessages, attempt + 1);
  }

  return { response, data };
}

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

    const { response, data } = await callGemini(apiKey, geminiMessages);

    if (!response.ok) {
      console.error('Gemini error:', response.status, JSON.stringify(data));
      // Pesan error yang lebih ramah untuk pengguna
      const isOverload = response.status === 503 || response.status === 429;
      const friendlyMsg = isOverload
        ? 'Asisten sedang sibuk, coba lagi dalam beberapa detik ya! '
        : `Maaf, terjadi kendala teknis. Silakan coba lagi. `;
      return NextResponse.json({ reply: friendlyMsg }, { status: 500 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, tidak ada respons.';
    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error('Chat API error:', error.message);
    return NextResponse.json(
      { reply: 'Maaf, terjadi kendala koneksi. Silakan coba lagi. ' },
      { status: 500 }
    );
  }
}
