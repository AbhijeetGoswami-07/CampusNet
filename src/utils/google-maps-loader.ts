export const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || 'AIzaSyA41aicn4Bt-FX8mZ_nNYqSVCd7kmSiOUI'

let loadPromise: Promise<typeof google> | null = null

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not available'))
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google)
  }

  if (loadPromise) {
    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      if (window.google && window.google.maps) {
        resolve(window.google)
      } else {
        existingScript.addEventListener('load', () => resolve(window.google))
        existingScript.addEventListener('error', (e) => reject(e))
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google)
      } else {
        reject(new Error('Google Maps SDK loaded but window.google is missing'))
      }
    }
    script.onerror = (err) => {
      loadPromise = null
      reject(err)
    }
    document.head.appendChild(script)
  })

  return loadPromise
}
