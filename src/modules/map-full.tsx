import { useState, useEffect } from 'react'
import { Layers, ArrowRight, Search, MapPin, ExternalLink, Navigation } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { puneListings, puneServices, puneColleges } from '../data-pune'
import { getCustomMapIcon } from './colleges'

const LOCALITY_COORDS: Record<string, [number, number]> = {
  all: [18.5204, 73.8567],
  Alandi: [18.6747, 73.8920],
  Shivajinagar: [18.5290, 73.8430],
  Kothrud: [18.5040, 73.8080],
  Baner: [18.5596, 73.7896],
  'Viman Nagar': [18.5660, 73.9100],
  Hinjawadi: [18.5900, 73.7380],
  Deccan: [18.5180, 73.8390],
  Aundh: [18.5620, 73.8080],
  Dhankawadi: [18.4630, 73.8580],
  Hadapsar: [18.5018, 73.9259],
  Moshi: [18.6806, 73.8368]
}

function MapFlyController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 })
  }, [center, zoom, map])
  return null
}

export function FullMapPage({ go }: { go: (page: string) => void }) {
  const [layers, setLayers] = useState({
    listings: true,
    services: true,
    colleges: true
  })

  const [selectedLocality, setSelectedLocality] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([18.5204, 73.8567])
  const [mapZoom, setMapZoom] = useState(12)

  const toggle = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const localities = ['all', 'Alandi', 'Shivajinagar', 'Kothrud', 'Baner', 'Viman Nagar', 'Hinjawadi', 'Deccan', 'Aundh', 'Dhankawadi', 'Hadapsar', 'Moshi']

  const handleLocalityClick = (loc: string) => {
    setSelectedLocality(loc)
    const target = LOCALITY_COORDS[loc] ?? [18.5204, 73.8567]
    setMapCenter(target)
    setMapZoom(loc === 'all' ? 12 : 14)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const q = searchQuery.toLowerCase()
    // Check if query matches a known locality
    const matchedLoc = localities.find(l => l.toLowerCase() === q || q.includes(l.toLowerCase()))
    if (matchedLoc && LOCALITY_COORDS[matchedLoc]) {
      handleLocalityClick(matchedLoc)
      return
    }

    // Check if query matches a listing, service, or college
    const matchedListing = puneListings.find(l => l.title.toLowerCase().includes(q) || l.locality.toLowerCase().includes(q))
    if (matchedListing) {
      setMapCenter([matchedListing.latitude, matchedListing.longitude])
      setMapZoom(15)
      return
    }

    const matchedCollege = puneColleges.find(c => c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q))
    if (matchedCollege) {
      setMapCenter([matchedCollege.latitude, matchedCollege.longitude])
      setMapZoom(15)
      return
    }

    const matchedService = puneServices.find(s => s.name.toLowerCase().includes(q) || s.locality.toLowerCase().includes(q))
    if (matchedService) {
      setMapCenter([matchedService.latitude, matchedService.longitude])
      setMapZoom(15)
    }
  }

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    (searchQuery.trim() || selectedLocality === 'all' ? 'Student Accommodations and Colleges' : selectedLocality) + ' Pune'
  )}`

  const filteredListings = puneListings.filter(l => {
    const locMatch = selectedLocality === 'all' ? true : l.locality.toLowerCase().includes(selectedLocality.toLowerCase())
    if (!locMatch) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return l.title.toLowerCase().includes(q) || l.locality.toLowerCase().includes(q) || l.collegeName.toLowerCase().includes(q)
  })

  const filteredServices = puneServices.filter(s => {
    const locMatch = selectedLocality === 'all' ? true : s.locality.toLowerCase().includes(selectedLocality.toLowerCase())
    if (!locMatch) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.locality.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
  })

  const filteredColleges = puneColleges.filter(c => {
    const locMatch = selectedLocality === 'all' ? true : c.area.toLowerCase().includes(selectedLocality.toLowerCase())
    if (!locMatch) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q) || c.area.toLowerCase().includes(q)
  })

  return (
    <section className="page-section" style={{ padding: '24px 32px' }}>
      <div className="page-heading" style={{ marginBottom: 18 }}>
        <div>
          <p className="eyebrow">MODULE 5 · LOCATION & MAP EXPLORER</p>
          <h1>Interactive Pune Student Living Map</h1>
          <p>
            Real-time visual map of Pune with visible hostel, PG, mess, and college names, plus direct Google Maps integration.
          </p>
        </div>
        <div className="map-layer-toggles">
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontWeight: 700, fontSize: 13 }}>
            <Layers size={16} /> Filter Layers:
          </span>
          <label className="layer-toggle">
            <input
              type="checkbox"
              checked={layers.listings}
              onChange={() => toggle('listings')}
            />
            🏠 Accommodations ({filteredListings.length})
          </label>
          <label className="layer-toggle">
            <input
              type="checkbox"
              checked={layers.services}
              onChange={() => toggle('services')}
            />
            🍽️ Essential Services ({filteredServices.length})
          </label>
          <label className="layer-toggle">
            <input
              type="checkbox"
              checked={layers.colleges}
              onChange={() => toggle('colleges')}
            />
            🎓 Colleges ({filteredColleges.length})
          </label>
        </div>
      </div>

      {/* Real-time Search Bar & Google Maps Integration */}
      <div className="map-search-bar-wrap">
        <form className="map-search-form" onSubmit={handleSearchSubmit}>
          <Search size={18} color="var(--coral)" />
          <input
            type="text"
            placeholder="Search Pune area, hostel, PG, mess, or college (e.g., Kothrud, FC Road, COEP, Viman Nagar)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="solid-button" style={{ padding: '10px 18px', fontSize: 12 }}>
            <Navigation size={14} /> Fly to Location
          </button>
        </form>
        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="outline-button google-maps-live-btn"
          title="Search this query directly on Google Maps"
        >
          🗺️ Live Google Maps Search <ExternalLink size={13} />
        </a>
      </div>

      {/* Locality Quick Jump Chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', alignSelf: 'center', marginRight: 4, whiteSpace: 'nowrap' }}>
          <MapPin size={13} style={{ display: 'inline' }} /> Jump to Area:
        </span>
        {localities.map(loc => (
          <button
            key={loc}
            className={`service-tab ${selectedLocality === loc ? 'service-tab-active' : ''}`}
            onClick={() => handleLocalityClick(loc)}
            style={{ padding: '6px 14px', fontSize: 12, whiteSpace: 'nowrap' }}
          >
            {loc === 'all' ? '🌐 All Pune' : loc}
          </button>
        ))}
      </div>

      <div className="full-map-wrap">
        <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom className="leaflet-map full-page-map">
          <MapFlyController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Accommodations - Hover Tooltip & Click Popup */}
          {layers.listings && filteredListings.map(l => (
            <Marker key={l.id} position={[l.latitude, l.longitude]} icon={getCustomMapIcon(l.category)}>
              <Tooltip direction="top" offset={[0, -22]}>
                {l.title}
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  <span style={{ fontSize: 10, color: 'var(--coral)', fontWeight: 700 }}>ACCOMMODATION</span>
                  <strong>{l.title}</strong>
                  <span>{l.category} · {l.roomType}</span>
                  <span><strong>₹{l.price.toLocaleString('en-IN')}</strong> / month</span>
                  <span>{l.available} of {l.total} beds available</span>
                  <span>Near {l.collegeName}</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="text-action" onClick={() => go(`listing/${l.id}`)}>
                      View details <ArrowRight size={13} />
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.title}, ${l.locality}, Pune`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="google-maps-btn"
                    >
                      Google Maps ↗
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Services - Hover Tooltip & Click Popup */}
          {layers.services && filteredServices.map(s => (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={getCustomMapIcon(s.category)}>
              <Tooltip direction="top" offset={[0, -22]}>
                {s.name}
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  {(() => {
                    const isDMart = s.name.toLowerCase().includes('dmart');
                    const isJioMart = s.name.toLowerCase().includes('jiomart') || s.name.toLowerCase().includes('smart');
                    return (
                      <span style={{ fontSize: 10, color: isDMart ? '#059669' : isJioMart ? '#2563eb' : '#06b6d4', fontWeight: 800 }}>
                        {isDMart ? '🛒 OFFICIAL DMART' : isJioMart ? '🛍️ JIOMART / SMART' : s.category.toUpperCase()}
                      </span>
                    );
                  })()}
                  <strong>{s.name}</strong>
                  <span>{s.address}</span>
                  <span>{s.timing}</span>
                  <span><strong>{s.priceRange}</strong> · ⭐ {s.rating}</span>
                  <a href={`tel:${s.phone}`} style={{ color: 'var(--coral)', fontSize: 12, fontWeight: 600 }}>
                    📞 {s.phone}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.address}, Pune`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-maps-btn"
                    style={{ marginTop: 6 }}
                  >
                    Google Maps ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Colleges - Hover Tooltip & Click Popup */}
          {layers.colleges && filteredColleges.map(c => (
            <Marker key={c.id} position={[c.latitude, c.longitude]} icon={getCustomMapIcon('college')}>
              <Tooltip direction="top" offset={[0, -22]}>
                {c.shortName || c.name}
              </Tooltip>
              <Popup>
                <div className="map-popup">
                  <span style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 700 }}>CAMPUS</span>
                  <strong>{c.name}</strong>
                  <span>{c.type}</span>
                  <span>{c.area}, Pune</span>
                  <span>{c.students.toLocaleString('en-IN')} enrolled students</span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="text-action" onClick={() => go('colleges')}>
                      Nearby housing <ArrowRight size={13} />
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.area}, Pune`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="google-maps-btn"
                    >
                      🗺️ Campus on Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="map-legend">
        <span className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#e67555' }} />
          Accommodations ({filteredListings.length})
        </span>
        <span className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#06b6d4' }} />
          Mess, Laundry, Clinics, Shops ({filteredServices.length})
        </span>
        <span className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#8b5cf6' }} />
          Universities & Colleges ({filteredColleges.length})
        </span>
      </div>
    </section>
  )
}
