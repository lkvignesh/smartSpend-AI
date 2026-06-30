import { cn } from '@/lib/utils'

/* ── Base skeleton ── */
interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
  circle?: boolean
  rounded?: boolean
}

export function Skeleton({ className, style, circle, rounded }: SkeletonProps) {
  return (
    <div
      className={cn(
        'fp-shimmer',
        circle && 'rounded-full',
        rounded && '!rounded-full',
        className,
      )}
      style={style}
      aria-hidden="true"
    />
  )
}

/* ── Stat card skeleton ── */
export function StatCardSkeleton() {
  return (
    <div className="fp-card p-6">
      <div className="flex items-start justify-between mb-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="w-9 h-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-28 mb-3" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

/* ── Transaction row skeleton ── */
export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

/* ── Goal card skeleton ── */
export function GoalCardSkeleton() {
  return (
    <div className="fp-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-3 w-16 self-end" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

/* ── Table row skeleton ── */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  const widths = ['w-8 h-8 rounded-lg', 'h-3.5 w-32 flex-1', 'h-3.5 w-20', 'h-4 w-16']
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      {widths.slice(0, cols).map((w, i) => (
        <Skeleton key={i} className={w} />
      ))}
    </div>
  )
}

/* ── Chart skeleton ── */
export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="fp-card p-6">
      <div className="flex justify-between mb-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <Skeleton className="w-full rounded-lg" style={{ height }} />
    </div>
  )
}

/* ── Page header skeleton ── */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-2 mb-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  )
}
