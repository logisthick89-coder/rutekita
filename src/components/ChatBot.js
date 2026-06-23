'use client';
import { useState, useRef, useEffect } from 'react';

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

const SUGGESTIONS = ['Semua trayek', 'Jadwal trayek 01', 'Modal usaha angkot', 'Trayek terbaik?'];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten RuteKita \n\nSaya bisa bantu kamu soal:\n Info trayek angkutan umum Garut\n Bisnis dan izin perusahaan angkot\n Rekomendasi trayek untuk investasi\n\nMau tanya apa?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    function handleOpen() { setOpen(true); }
    window.addEventListener('rutekita:openchat', handleOpen);
    return () => window.removeEventListener('rutekita:openchat', handleOpen);
  }, []);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-10) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi ' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB  hanya desktop */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Buka asisten RuteKita"
        className="hidden md:flex fixed z-50 transition-all duration-200 hover:scale-105 active:scale-95 items-center justify-center"
        style={{
          bottom: '24px', right: '24px',
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
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
            width: 'min(360px, calc(100vw - 32px))',
            maxHeight: '520px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            bottom: '80px', right: '24px',
          }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-white/10"
            style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base flex-shrink-0"></div>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">Asisten RuteKita</div>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Powered by Gemini AI
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
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs flex-shrink-0 mb-0.5"></div>
                )}
                <div className={`max-w-[80%] px-3 py-2.5 text-xs leading-relaxed whitespace-pre-line rounded-2xl
                  ${m.role === 'user' ? 'text-white rounded-br-sm' : 'text-gray-200 rounded-bl-sm border border-white/5'}`}
                  style={m.role === 'user'
                    ? {background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'}
                    : {background: 'rgba(255,255,255,0.06)'}}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs flex-shrink-0"></div>
                <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm border border-white/5 flex gap-1 items-center"
                  style={{background: 'rgba(255,255,255,0.06)'}}>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
              </div>
            )}
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
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Tanya sesuatu..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-violet-500/60 transition-colors disabled:opacity-50"
            />
            <button onClick={sendMessage} disabled={!input.trim() || loading}
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


