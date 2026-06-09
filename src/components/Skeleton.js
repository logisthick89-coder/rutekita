// Komponen Skeleton untuk loading state

export function SkeletonBox({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white/8 rounded-xl ${className}`} />
  );
}

// Skeleton stat card (beranda)
export function SkeletonStatCard() {
  return (
    <div className="bg-white/5 rounded-2xl p-3 md:p-6 text-center">
      <div className="flex justify-center mb-2">
        <SkeletonBox className="w-6 h-6 rounded-full" />
      </div>
      <SkeletonBox className="h-7 w-10 mx-auto mb-1" />
      <SkeletonBox className="h-3 w-16 mx-auto" />
    </div>
  );
}

// Skeleton kartu trayek
export function SkeletonTrayekCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-4 w-12" />
      </div>
      <SkeletonBox className="h-4 w-40 mb-2" />
      <SkeletonBox className="h-3 w-32 mb-4" />
      <div className="grid grid-cols-3 pt-3 border-t border-white/10 gap-2">
        <SkeletonBox className="h-8" />
        <SkeletonBox className="h-8" />
        <SkeletonBox className="h-8" />
      </div>
    </div>
  );
}

// Skeleton kartu jadwal
export function SkeletonJadwalCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-4 w-32" />
        </div>
        <SkeletonBox className="h-4 w-12" />
      </div>
      <div className="px-4 py-3 border-b border-white/10 flex gap-5">
        <SkeletonBox className="h-4 w-28" />
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-4 w-16" />
      </div>
      <div className="p-4 grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => <SkeletonBox key={i} className="h-10" />)}
      </div>
    </div>
  );
}

// Skeleton kartu tarif
export function SkeletonTarifCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-4 w-32" />
        </div>
        <SkeletonBox className="h-4 w-12" />
      </div>
      <div className="px-4 py-2 border-b border-white/10 grid grid-cols-3 gap-2">
        <SkeletonBox className="h-3 w-8" />
        <SkeletonBox className="h-3 w-8" />
        <SkeletonBox className="h-3 w-10 ml-auto" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="grid grid-cols-3 px-4 py-3 border-b border-white/5">
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-4 w-14 ml-auto" />
        </div>
      ))}
    </div>
  );
}

// Skeleton hasil cari
export function SkeletonCariCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <SkeletonBox className="w-9 h-9 rounded-xl flex-shrink-0" />
          <div>
            <SkeletonBox className="h-4 w-36 mb-1" />
            <SkeletonBox className="h-3 w-24" />
          </div>
        </div>
        <SkeletonBox className="h-4 w-12" />
      </div>
      <div className="flex gap-3 mt-2">
        <SkeletonBox className="h-3 w-16" />
        <SkeletonBox className="h-3 w-14" />
        <SkeletonBox className="h-3 w-16" />
      </div>
    </div>
  );
}
