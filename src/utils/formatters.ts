import { format, formatDistanceToNow, parse, parseISO } from 'date-fns'

export function formatDate(date: string | Date, formatStr = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

export function formatTime(date: string | Date): string {
  return formatDate(date, 'h:mm a')
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function getInitials(firstName?: string, lastName?: string): string {
  // Handle undefined, null, or empty strings
  const first = firstName && firstName.trim() ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName && lastName.trim() ? lastName.charAt(0).toUpperCase() : ''
  
  // If we have at least one initial, return it
  if (first || last) {
    return first + last
  }
  
  // Fallback to 'U' for User if nothing is available
  return 'U'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function generateSKU(categoryPrefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${categoryPrefix}-${timestamp}-${random}`
}

/** Parse date from various display formats (dd/MM/yyyy, MMM dd yyyy, yyyy-MM-dd, etc.) */
export function parseFlexibleDate(dateStr: string): Date | undefined {
  if (!dateStr?.trim()) return undefined
  const formats = [
    'd/M/yyyy',
    'dd/MM/yyyy',
    'M/d/yyyy',
    'MM/dd/yyyy',
    'yyyy-MM-dd',
    'MMM dd, yyyy',
    'MMM d, yyyy',
    'MMMM d, yyyy',
    'dd MMM, yyyy',
    'd MMM, yyyy',
    'd MMM yyyy',
    'd MMMM, yyyy',
    'd MMM yyyy',
  ]
  for (const fmt of formats) {
    try {
      const d = parse(dateStr.trim().replace(/\s*,/g, ','), fmt, new Date())
      return isNaN(d.getTime()) ? undefined : d
    } catch {
      continue
    }
  }
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? undefined : d
}

/** Format Date for display (d/M/yyyy) - use for form storage where format varies by feature */
export function formatDateForInput(date: Date): string {
  return format(date, 'd/M/yyyy')
}

/** Format for display like "Jan 12, 2023" */
export function formatDateDisplay(date: Date): string {
  return format(date, 'MMM dd, yyyy')
}

/** Format like "10 Feb, 2025" (day first) */
export function formatDateDayMonth(date: Date): string {
  return format(date, 'd MMM, yyyy')
}

/** Format like "January 15, 2026" (long month) */
export function formatDateLong(date: Date): string {
  return format(date, 'MMMM d, yyyy')
}

/** Format like "1 January, 2025" (day first, long month) */
export function formatDateJoining(date: Date): string {
  return format(date, 'd MMMM, yyyy')
}

/** Format like "18 Feb 2026" (en-GB style) */
export function formatDateShort(date: Date): string {
  return format(date, 'd MMM yyyy')
}

/** Format for ISO/API (yyyy-MM-dd) */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}













