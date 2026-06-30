interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  compact?: boolean
}

export function EmptyState({ title, description, action, compact }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-10' : 'py-16'}`}>
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--c-s2)', border: '1px solid var(--c-border)' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <rect x="4" y="9" width="22" height="15" rx="3.5"
              stroke="var(--c-text3)" strokeWidth="1.5"/>
            <path d="M4 13h22" stroke="var(--c-text3)" strokeWidth="1.5"/>
            <circle cx="10" cy="18.5" r="1.5" fill="var(--c-text3)"/>
            <path d="M14 18.5h7" stroke="var(--c-text3)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 7v2M15 6v3M20 7v2"
              stroke="var(--c-primary)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} />
      </div>

      <p className={`font-semibold ${compact ? 'text-sm' : 'text-base'}`}
        style={{ color: 'var(--c-text)' }}>
        {title}
      </p>
      <p className="mt-2 text-sm max-w-[260px] leading-relaxed" style={{ color: 'var(--c-text2)' }}>
        {description}
      </p>

      {action && (
        <button onClick={action.onClick}
          className="mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
          {action.label}
        </button>
      )}
    </div>
  )
}
