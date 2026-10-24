import React, { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '../utils/google-maps-loader'

export interface GoogleMapMarker {
  id: string
  position: { lat: number; lng: number }
  title: string
  category?: 'college' | 'hostel' | 'pg' | 'flat' | 'grocery' | 'mart' | 'mess' | 'laundry' | 'medical' | string
  infoHtml?: string
  onClick?: () => void
}

export interface GoogleMapViewProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: GoogleMapMarker[]
  circle?: {
    center: { lat: number; lng: number }
    radius: number // in meters
    strokeColor?: string
    fillColor?: string
  }
  className?: string
  style?: React.CSSProperties
  mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
}

function getGoogleMarkerIcon(category: string = 'default') {
  const cat = category.toLowerCase()
  let bg = '#64748b'
  let symbolPath = '<circle cx="12" cy="12" r="5" fill="#ffffff"/>'

  if (cat.includes('college') || cat.includes('campus')) {
    bg = '#8b5cf6'
    symbolPath = '<path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="#ffffff" stroke-width="2" fill="none"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="#ffffff" stroke-width="2" fill="none"/>'
  } else if (cat.includes('hostel') || cat.includes('pg') || cat.includes('flat')) {
    bg = '#e67555'
    symbolPath = '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#ffffff" stroke-width="2" fill="none"/><polyline points="9 22 9 12 15 12 15 22" stroke="#ffffff" stroke-width="2" fill="none"/>'
  } else if (cat.includes('mart') || cat.includes('grocery') || cat.includes('store')) {
    bg = '#10b981'
    symbolPath = '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="#ffffff" stroke-width="2" fill="none"/><line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" stroke-width="2"/><path d="M16 10a4 4 0 0 1-8 0" stroke="#ffffff" stroke-width="2" fill="none"/>'
  } else if (cat.includes('mess') || cat.includes('food')) {
    bg = '#f59e0b'
    symbolPath = '<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" stroke="#ffffff" stroke-width="2" fill="none"/><path d="M15 2v18" stroke="#ffffff" stroke-width="2"/><path d="M7 2v20" stroke="#ffffff" stroke-width="2"/><path d="M4 2v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2" stroke="#ffffff" stroke-width="2" fill="none"/>'
  } else if (cat.includes('laundry')) {
    bg = '#06b6d4'
    symbolPath = '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" stroke="#ffffff" stroke-width="1.8" fill="none"/>'
  } else if (cat.includes('medical') || cat.includes('clinic')) {
    bg = '#ef4444'
    symbolPath = '<path d="M19 14h-4v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z" fill="#ffffff"/>'
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <defs>
      <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M18 0 C8.06 0 0 8.06 0 18 C0 29.5 18 44 18 44 C18 44 36 29.5 36 18 C36 8.06 27.94 0 18 0 Z" fill="${bg}" filter="url(#shadow)"/>
    <circle cx="18" cy="18" r="14" fill="${bg}"/>
    <g transform="translate(6, 6)">
      ${symbolPath}
    </g>
  </svg>`

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
}

export function GoogleMapView({
  center,
  zoom = 14,
  markers = [],
  circle,
  className = '',
  style,
  mapTypeId = 'roadmap'
}: GoogleMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const circleRef = useRef<google.maps.Circle | null>(null)
  const activeInfoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Initialize Map
  useEffect(() => {
    let isMounted = true

    loadGoogleMaps()
      .then((g) => {
        if (!isMounted || !containerRef.current) return

        if (!mapInstanceRef.current) {
          const map = new g.maps.Map(containerRef.current, {
            center,
            zoom,
            mapTypeId,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: g.maps.MapTypeControlStyle.DROPDOWN_MENU,
              position: g.maps.ControlPosition.TOP_RIGHT
            },
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true
          })
          mapInstanceRef.current = map
        } else {
          mapInstanceRef.current.setCenter(center)
          mapInstanceRef.current.setZoom(zoom)
          mapInstanceRef.current.setMapTypeId(mapTypeId)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Google Maps Load Error:', err)
        setError('Google Maps could not be loaded. Please verify API key permissions.')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // 2. Center / Zoom Update
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(center)
    }
  }, [center.lat, center.lng])

  useEffect(() => {
    if (mapInstanceRef.current && zoom) {
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [zoom])

  // 3. Circle Update (e.g. 2km proximity zone)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    if (circleRef.current) {
      circleRef.current.setMap(null)
      circleRef.current = null
    }

    if (circle) {
      const gCircle = new google.maps.Circle({
        center: circle.center,
        radius: circle.radius,
        strokeColor: circle.strokeColor || '#4f46e5',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: circle.fillColor || '#6366f1',
        fillOpacity: 0.08,
        map: mapInstanceRef.current
      })
      circleRef.current = gCircle
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null)
      }
    }
  }, [circle?.center?.lat, circle?.center?.lng, circle?.radius])

  // 4. Markers & InfoWindow Update
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google?.maps) return

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    if (activeInfoWindowRef.current) {
      activeInfoWindowRef.current.close()
    }

    const infoWindow = new google.maps.InfoWindow({
      maxWidth: 320
    })
    activeInfoWindowRef.current = infoWindow

    const newMarkers = markers.map((m) => {
      const iconUrl = getGoogleMarkerIcon(m.category)
      const marker = new google.maps.Marker({
        position: m.position,
        map: mapInstanceRef.current!,
        title: m.title,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(32, 38),
          anchor: new google.maps.Point(16, 38)
        },
        animation: google.maps.Animation.DROP
      })

      marker.addListener('click', () => {
        if (m.onClick) {
          m.onClick()
        }
        if (m.infoHtml) {
          infoWindow.setContent(`
            <div style="font-family: inherit; font-size: 13px; color: #1e293b; padding: 4px; line-height: 1.4;">
              ${m.infoHtml}
            </div>
          `)
          infoWindow.open(mapInstanceRef.current!, marker)
        }
      })

      return marker
    })

    markersRef.current = newMarkers

    return () => {
      newMarkers.forEach((m) => m.setMap(null))
    }
  }, [markers])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 400, ...style }} className={className}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: 'inherit' }} />

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            zIndex: 10,
            borderRadius: 'inherit'
          }}
        >
          <div className="spinner" style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Loading Google Maps...</span>
        </div>
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#fef2f2',
            color: '#991b1b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            zIndex: 10,
            borderRadius: 'inherit'
          }}
        >
          <p style={{ fontWeight: 700, margin: '0 0 6px' }}>⚠️ Google Maps Notice</p>
          <p style={{ fontSize: 13, margin: 0, maxWidth: 400 }}>{error}</p>
        </div>
      )}
    </div>
  )
}
