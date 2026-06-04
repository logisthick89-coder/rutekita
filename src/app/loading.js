export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0f0f1a] font-sans flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🚌</div>
        <div className="flex gap-1.5 justify-center mb-3">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{animationDelay:'0ms'}}></span>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{animationDelay:'150ms'}}></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{animationDelay:'300ms'}}></span>
        </div>
        <p className="text-gray-500 text-sm">Memuat...</p>
      </div>
    </main>
  );
}
