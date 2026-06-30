interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  compact?: boolean
}

export function EmptyState({ title, description, action, compact }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'py-10 px-6' : 'py-20 px-8'}`}>
      <div className="relative mb-6">
        <div className={`rounded-2xl flex items-center justify-center ${compact ? 'w-14 h-14' : 'w-20 h-20'}`}
          style={{ background: 'var(--c-s2)', border: '1px solid var(--c-border)' }}>
          <svg
            width={compact ? 26 : 36}
            height={compact ? 26 : 36}
            viewBox="0 0 36 36"
            fill="none"
            aria-hidden="true">
            <rect x="4" y="11" width="28" height="19" rx="4"
              stroke="var(--c-text3)" strokeWidth="1.75"/>
            <path d="M4 16h28" stroke="var(--c-text3)" strokeWidth="1.75"/>
            <circle cx="11.5" cy="23" r="2" fill="var(--c-text3)"/>
            <path d="M16 23h9" stroke="var(--c-text3)" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="M11 8v3M18 7v4M25 8v3"
              stroke="var(--c-primary)" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }} />
      </div>

      <p className={`font-semibold ${compact ? 'text-[14px]' : 'text-[16px]'}`}
        style={{ color: 'var(--c-text)' }}>
        {title}
      </p>
      <p className={`mt-2 max-w-[280px] leading-relaxed ${compact ? 'text-[13px]' : 'text-[14px]'}`}
        style={{ color: 'var(--c-text2)' }}>
        {description}
      </p>

      {action && (
        <button onClick={action.onClick}
          className="btn-primary mt-6">
          {action.label}
        </button>
      )}
    </div>
  )
}
