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
        <Skeleton w="110px" h="12px" />
        <Skeleton w="40px" h="40px" circle />
      </div>
      <Skeleton w="150px" h="30px" className="mb-2.5" />
      <Skeleton w="70px" h="11px" />
    </div>
  )
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <Skeleton w="36px" h="36px" circle />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton w="140px" h="12px" />
        <Skeleton w="90px" h="11px" />
      </div>
      <Skeleton w="65px" h="12px" />
    </div>
  )
}

export function GoalCardSkeleton() {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
      <div className="flex justify-center mb-4">
        <Skeleton w="100px" h="100px" circle />
      </div>
      <Skeleton w="120px" h="14px" className="mx-auto mb-2" />
      <Skeleton w="90px" h="12px" className="mx-auto" />
    </div>
  )
}
