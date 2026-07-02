import type { AppDispatch } from '@/redux/store'
import { logout } from '@/redux/slices/authSlice'
import { toast } from '@/utils/toast'
import { isTokenExpired } from '@/utils/jwt'

type NavigateFn = (
  path: string,
  options?: { replace?: boolean; state?: unknown }
) => void

let isHandlingSessionExpiry = false
let navigateFn: NavigateFn | null = null

export function registerAuthNavigator(navigate: NavigateFn | null): void {
  navigateFn = navigate
}

export function handleSessionExpired(
  dispatch: AppDispatch,
  options?: {
    onCleanup?: () => void
    message?: string
    silent?: boolean
  }
): void {
  if (isHandlingSessionExpiry) return
  isHandlingSessionExpiry = true

  const message =
    options?.message ?? 'Your session has expired. Please log in again.'

  dispatch(logout())
  options?.onCleanup?.()

  if (!options?.silent) {
    toast({
      title: 'Session expired',
      description: message,
      variant: 'destructive',
    })
  }

  const onAuthPage = window.location.pathname.startsWith('/auth')
  if (!onAuthPage) {
    if (navigateFn) {
      navigateFn('/auth/login', {
        replace: true,
        state: { sessionExpired: true },
      })
    } else {
      window.location.href = '/auth/login'
    }
  }

  setTimeout(() => {
    isHandlingSessionExpiry = false
  }, 1000)
}

export function ensureValidToken(
  dispatch: AppDispatch,
  token: string | null | undefined,
  onCleanup?: () => void
): boolean {
  if (!token || !isTokenExpired(token)) return true

  handleSessionExpired(dispatch, { onCleanup })
  return false
}
