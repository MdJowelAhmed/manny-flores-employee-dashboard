/**
 * Browser-safe JWT payload decoder.
 *
 * Decodes the payload (middle segment) of a JWT without validating the
 * signature. Use only to read non-sensitive claims (e.g. id, role, exp)
 * after a trusted server has issued the token — never to make security
 * decisions on the client.
 */

export interface DecodedJwtPayload {
  id?: string
  role?: string
  iss?: string
  aud?: string
  iat?: number
  exp?: number
  jti?: string
  tokenVersion?: number
  [key: string]: unknown
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '==='.slice((normalized.length + 3) % 4)
  const binary = atob(padded)
  try {
    return decodeURIComponent(
      Array.from(binary)
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
  } catch {
    return binary
  }
}

export function decodeJwt<T extends DecodedJwtPayload = DecodedJwtPayload>(
  token: string
): T | null {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const json = base64UrlDecode(parts[1])
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
