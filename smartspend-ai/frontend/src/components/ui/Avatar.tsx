import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

interface AvatarProps {
  name?: string
  src?: string
  size?: AvatarSize
  className?: string
  ring?: boolean
}

const sizeMap: Record<AvatarSize, { dim: number; text: string }> = {
  xs:  { dim: 24,  text: 'text-[10px]' },
  sm:  { dim: 32,  text: 'text-[12px]' },
  md:  { dim: 40,  text: 'text-[14px]' },
  lg:  { dim: 48,  text: 'text-[16px]' },
  xl:  { dim: 64,  text: 'text-[20px]' },
  '2xl': { dim: 80, text: 'text-[24px]' },
}

export function Avatar({ name = '', src, size = 'md', className, ring }: AvatarProps) {
  const { dim, text } = sizeMap[size]
  const initials = getInitials(name) || '?'

  return (
    <div
      className={cn(
        'relative rounded-full flex items-center justify-center overflow-hidden shrink-0 font-bold',
        text,
        ring && 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg)]',
        className,
      )}
      style={{
        width: dim,
        height: dim,
        background: src ? undefined : 'var(--grad)',
        color: 'white',
      }}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}

/* Avatar group */
interface AvatarGroupProps {
  names: string[]
  max?: number
  size?: AvatarSize
}

export function AvatarGroup({ names, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = names.slice(0, max)
  const extra   = names.length - max

  return (
    <div className="flex items-center">
      {visible.map((name, i) => (
        <div key={name} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: visible.length - i }}>
          <Avatar name={name} size={size}
            className="ring-2 ring-[var(--surface)]" />
        </div>
      ))}
      {extra > 0 && (
        <div className="flex items-center justify-center rounded-full t-small font-bold"
          style={{
            width: sizeMap[size].dim, height: sizeMap[size].dim,
            marginLeft: -8, zIndex: 0,
            background: 'var(--card2)', color: 'var(--text2)',
            border: '2px solid var(--surface)',
          }}>
          +{extra}
        </div>
      )}
    </div>
  )
}
