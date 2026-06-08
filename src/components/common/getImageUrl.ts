const DEFAULT_API_ORIGIN = 'http://10.10.7.28:5000'

function getBackendOrigin() {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_ORIGIN).replace(/\/$/, '')
}

function toRelativePath(imageurl: string) {
  if (imageurl.startsWith('http://') || imageurl.startsWith('https://')) {
    try {
      return new URL(imageurl).pathname
    } catch {
      return imageurl
    }
  }

  return imageurl.startsWith('/') ? imageurl : `/${imageurl}`
}

export function getImageUrl(imageurl?: string | null) {
  if (!imageurl) return ''

  if (imageurl.startsWith('blob:')) return imageurl

  const path = toRelativePath(imageurl)

  if (import.meta.env.DEV) {
    return path
  }

  return `${getBackendOrigin()}${path}`
}

export function getBackendBaseUrl() {
  return getBackendOrigin()
}
