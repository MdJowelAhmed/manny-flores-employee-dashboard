export interface ApiErrorShape {
  status?: number | string
  data?: {
    message?: string
    error?: string
    errorMessages?: Array<{ path?: string; message?: string }>
  }
  error?: string
}

const AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forget-password',
  '/auth/verify-email',
  '/auth/reset-password',
  '/auth/resend-otp',
]

export function isAuthEndpoint(url: string): boolean {
  return AUTH_ENDPOINTS.some((path) => url.includes(path))
}

export function getApiErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined
  const status = (err as ApiErrorShape).status
  return typeof status === 'number' ? status : undefined
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!err || typeof err !== 'object') return fallback

  const apiError = err as ApiErrorShape
  if (apiError.data?.message) return apiError.data.message
  if (apiError.data?.errorMessages?.length) {
    return apiError.data.errorMessages[0]?.message ?? fallback
  }
  if (apiError.data?.error) return apiError.data.error
  if (typeof apiError.error === 'string') return apiError.error

  if (apiError.status === 'FETCH_ERROR') {
    return 'Network error. Please check your connection and try again.'
  }

  if (apiError.status === 'PARSING_ERROR') {
    return 'Unable to process the server response. Please try again.'
  }

  if (apiError.status === 'TIMEOUT_ERROR') {
    return 'Request timed out. Please try again.'
  }

  return fallback
}

export function isUnauthorizedError(err: unknown): boolean {
  return getApiErrorStatus(err) === 401
}

export function isForbiddenError(err: unknown): boolean {
  return getApiErrorStatus(err) === 403
}

export function isServerError(err: unknown): boolean {
  const status = getApiErrorStatus(err)
  return status !== undefined && status >= 500
}
