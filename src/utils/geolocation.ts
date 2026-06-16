export interface GeoCoordinates {
  latitude: number
  longitude: number
  accuracy: number
}

export function getGeolocationErrorMessage(error: unknown) {
  if (error instanceof GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Please allow location access to check in/out.'
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.'
      case error.TIMEOUT:
        return 'Location request timed out. Please try again.'
      default:
        return 'Failed to get your location.'
    }
  }

  if (error instanceof Error) return error.message
  return 'Failed to get your location.'
}

export function getCurrentLocation(timeoutMs = 15000): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      }
    )
  })
}
