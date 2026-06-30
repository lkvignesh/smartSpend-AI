import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with clsx — the canonical way to compose styles */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as Indian currency */
export function formatINR(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (compact && Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${Math.abs(amount).toLocaleString('en-IN')}`
}

/** Format a date to relative or absolute */
export function formatDate(date: string | Date, relative = false): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (relative) {
    const now = Date.now()
    const diff = now - d.getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7)  return `${days} days ago`
  }
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Format a date to short string */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

/** Get greeting based on time */
export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 5)  return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

/** Get full formatted date */
export function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })
}

/** Clamp a number */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Get percentage */
export function pct(current: number, total: number): number {
  if (!total) return 0
  return clamp((current / total) * 100, 0, 100)
}

/** Delay a promise */
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}

/** Generate initials from name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join('')
}

/** Get category color */
export const CATEGORY_COLORS: Record<string, string> = {
  Food:          '#EF4444',
  Travel:        '#F59E0B',
  Shopping:      '#8B5CF6',
  Entertainment: '#06B6D4',
  Healthcare:    '#10B981',
  Utilities:     '#64748B',
  Education:     '#3B82F6',
  Other:         '#9CA3AF',
}

/** Get category emoji */
export const CATEGORY_EMOJIS: Record<string, string> = {
  Food:          '🍽️',
  Travel:        '✈️',
  Shopping:      '🛍️',
  Entertainment: '🎬',
  Healthcare:    '💊',
  Utilities:     '⚡',
  Education:     '📚',
  Other:         '📦',
}

/** Get health score label and color */
export function getHealthMeta(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: '#10B981' }
  if (score >= 65) return { label: 'Good',      color: '#3B82F6' }
  if (score >= 45) return { label: 'Fair',       color: '#F59E0B' }
  return              { label: 'Needs work',  color: '#EF4444' }
}
