interface SkeletonProps { w?: string; h?: string; circle?: boolean; className?: string }

export function Skeleton({ w = '100%', h = '14px', circle, className = '' }: SkeletonProps) {
  return (
    <div
      className={`shimmer ${className}`}
      style={{ width: w, height: h, borderRadius: circle ? '999px' : '8px', flexShrink: 0 }}
      aria-hidden="true"
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
      <div className="flex justify-between items-start mb-5">
        <Skeleton w="48px" h="48px" circle />
        <Skeleton w="40px" h="18px" />
      </div>
      <Skeleton w="110px" h="13px" className="mb-2" />
      <Skeleton w="160px" h="34px" className="mb-2" />
      <Skeleton w="80px" h="12px" />
    </div>
  )
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6" style={{ minHeight: 64 }}>
      <Skeleton w="40px" h="40px" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton w="150px" h="14px" />
        <Skeleton w="100px" h="12px" />
      </div>
      <Skeleton w="72px" h="15px" />
    </div>
  )
}

export function GoalCardSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1 space-y-2">
          <Skeleton w="130px" h="15px" />
          <Skeleton w="80px" h="13px" />
        </div>
        <Skeleton w="88px" h="88px" circle />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton w="100px" h="24px" />
          <Skeleton w="80px" h="13px" />
        </div>
        <Skeleton h="8px" />
        <Skeleton w="140px" h="13px" />
      </div>
    </div>
  )
}
