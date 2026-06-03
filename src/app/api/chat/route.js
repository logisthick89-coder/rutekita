import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const systemPrompt = `Kamu adalah asisten virtual RuteKita, aplikasi informasi angkutan umum Kabupaten Garut. 
Kamu membantu pengguna mencari informasi tentang:
- Trayek angkutan umum (ada 6 trayek: 01 Garut Kota-Tarogong, 02 Garut Kota-Cibatu, 03 Garut Kota-Leles, 04 Garut Kota-Wanaraja, 05 Garut Kota-Kadungora, 06 Garut Kota-Malangbong)
- Jadwal keberangkatan
- Tarif per segmen
- Halte yang dilewati
- Peta rute
Jawab dengan ramah, singkat, dan dalam Bahasa Indonesia.`;

    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, saya tidak bisa menjawab saat ini.';
    return NextResponse.json({ message: text });
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan. Coba lagi ya!' }, { status: 500 });
  }
}
