import { GoogleMapView, type GoogleMapMarker } from '../components/google-map-view'
import { useState } from 'react'
import { MapPin, Phone, Clock, Star, Search, ExternalLink } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { puneServices, type Service } from '../data-pune'
import { getCustomMapIcon } from './colleges'

const CATEGORY_LABELS: Record<string, string> = {
  mess: '🍽️ Mess & Tiffin',
  laundry: '👕 Laundry & Dry Cleaning',
  medical: '🏥 Medical & Hospitals',
  grocery: '🛒 Grocery & Supermarket',
  salon: '✂️ Salons & Grooming'
}

const CATEGORY_COLORS: Record<string, string> = {
  mess: '#e67555',
  laundry: '#06b6d4',
  medical: '#ef4444',
  grocery: '#4a9e7d',
  salon: '#8b5cf6'
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-detail-card">
      <div className="service-card-header">
        <span
          className="service-cat-badge"
          style={{
            background: CATEGORY_COLORS[service.category] + '20',
            color: CATEGORY_COLORS[service.category]
          }}
        >
          {CATEGORY_LABELS[service.category]}
        </span>
        <span className="service-rating">
          <Star size={13} fill="#d97706" color="#d97706" /> {service.rating}
        </span>
      </div>
      <h3>{service.name}</h3>
      <p className="service-address"><MapPin size={13} /> {service.address}</p>
      <p className="service-timing"><Clock size={13} /> {service.timing}</p>
      <p className="service-desc">{service.description}</p>
      <div className="service-footer">
        <span className="service-price">{service.priceRange}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${service.name}, ${service.address}, Pune`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-button"
            style={{ fontSize: 11, padding: '7px 11px' }}
            title="Open on Google Maps"
          >
            🗺️ Maps <ExternalLink size={11} />
          </a>
          <a href={`tel:${service.phone}`} className="outline-button service-call">
            <Phone size={13} /> {service.phone}
          </a>
        </div>
      </div>
    </article>
  )
}

export function EnhancedServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google')

  const categories = ['all', 'mess', 'laundry', 'medical', 'grocery', 'salon']

  const filtered = puneServices.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.locality.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    }
    return true
  })

  const mapCenter: LatLngExpression = [18.5204, 73.8567]

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODULE 3 · ESSENTIAL SERVICES</p>
          <h1>Everyday Student Services across Pune</h1>
          <p>Verified tiffin services, laundry pickup, 24/7 pharmacies, groceries, and student salons.</p>
        </div>
        <div className="view-toggle" role="group">
          <button className={!showMap ? 'selected' : ''} onClick={() => setShowMap(false)}>
            List View ({filtered.length})
          </button>
          <button className={showMap ? 'selected' : ''} onClick={() => setShowMap(true)}>
            Map View
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div className="services-category-tabs" style={{ marginBottom: 0, flex: 1 }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`service-tab ${activeCategory === cat ? 'service-tab-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? '✨ All Services' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search service, area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 12px 8px 32px',
              border: '1px solid var(--line)',
              borderRadius: 20,
              fontSize: 13,
              width: '100%',
              background: '#fff'
            }}
          />
        </div>
      </div>

      {showMap && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <div className="map-engine-switcher">
            <button
              type="button"
              className={`map-engine-btn ${mapEngine === 'google' ? 'active' : ''}`}
              onClick={() => setMapEngine('google')}
              title="Google Maps JavaScript API with Satellite & Street View"
            >
              🗺️ Google Maps (Precise)
            </button>
            <button
              type="button"
              className={`map-engine-btn ${mapEngine === 'leaflet' ? 'active' : ''}`}
              onClick={() => setMapEngine('leaflet')}
              title="OpenStreetMap Standard Tiles"
            >
              🌍 OpenStreetMap
            </button>
          </div>
        </div>
      )}

      {showMap ? (
        <div className="services-map-wrap">
          {mapEngine === 'google' ? (
            <GoogleMapView
              center={{ lat: mapCenter[0], lng: mapCenter[1] }}
              zoom={13}
              markers={filtered.map(s => {
                const isDMart = s.name.toLowerCase().includes('dmart');
                const isJioMart = s.name.toLowerCase().includes('jiomart') || s.name.toLowerCase().includes('smart');
                const badgeColor = isDMart ? '#059669' : isJioMart ? '#2563eb' : '#0891b2';
                const badgeText = isDMart ? '🛒 OFFICIAL DMART' : isJioMart ? '🛍️ JIOMART / SMART' : CATEGORY_LABELS[s.category];
                return {
                  id: s.id,
                  position: { lat: s.latitude, lng: s.longitude },
                  title: s.name,
                  category: isDMart || isJioMart ? 'mart' : s.category,
                  infoHtml: `
                    <div style="font-weight: 800; color: ${badgeColor}; font-size: 11px; text-transform: uppercase;">${badgeText}</div>
                    <div style="font-weight: 700; font-size: 14px; margin: 3px 0 2px;">${s.name}</div>
                    <div style="color: #64748b; font-size: 12px;">${s.address}</div>
                    <div style="color: #475569; font-size: 12px; margin: 2px 0 8px;"><strong>${s.priceRange}</strong> · ⭐ ${s.rating} · ${s.timing}</div>
                    <div style="display: flex; gap: 6px;">
                      <a href="tel:${s.phone}" style="background: #f1f5f9; color: #1e293b; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">📞 Call</a>
                      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.address}, Pune`)}" target="_blank" rel="noopener noreferrer" style="background: ${badgeColor}; color: #ffffff; padding: 6px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">Google Maps ↗</a>
                    </div>
                  `
                };
              })}
              className="leaflet-map services-full-map"
            />
          ) : (
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="leaflet-map services-full-map">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map(s => (
              <Marker key={s.id} position={[s.latitude, s.longitude]} icon={getCustomMapIcon(s.category)}>
                <Tooltip direction="top" offset={[0, -22]}>
                  {s.name}
                </Tooltip>
                <Popup>
                  <div className="map-popup">
                    <strong>{s.name}</strong>
                    <span>{CATEGORY_LABELS[s.category]}</span>
                    <span>{s.address}</span>
                    <span>{s.timing}</span>
                    <span><strong>{s.priceRange}</strong> · ⭐ {s.rating}</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <a href={`tel:${s.phone}`} style={{ color: 'var(--coral)', fontWeight: 600, fontSize: 12 }}>
                        📞 Call {s.phone}
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.address}, Pune`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-maps-btn"
                      >
                        🗺️ Maps
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          )}
        </div>
      ) : (
        <div className="services-grid">
          {filtered.length ? (
            filtered.map(s => <ServiceCard key={s.id} service={s} />)
          ) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <p>No services found matching your criteria. Try switching category tabs or clearing your search.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
