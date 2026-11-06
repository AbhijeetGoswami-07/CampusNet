import { GoogleMapView } from '../components/google-map-view'
import { useState } from 'react'
import { MapPin, Phone, Clock, Star, Search, ExternalLink, GraduationCap } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { puneServices, puneColleges, type Service } from '../data-pune'
import { getCustomMapIcon } from './colleges'

const CATEGORY_LABELS: Record<string, string> = {
  mess: '🍽️ Mess & Tiffin',
  laundry: '👕 Laundry & Dry Cleaning',
  library: '📚 Libraries & Abhyasikas',
  medical: '🏥 Medical & Hospitals',
  grocery: '🛒 Grocery & Supermarket',
  salon: '✂️ Salons & Grooming'
}

const CATEGORY_COLORS: Record<string, string> = {
  mess: '#e67555',
  laundry: '#06b6d4',
  library: '#6366f1',
  medical: '#ef4444',
  grocery: '#4a9e7d',
  salon: '#8b5cf6'
}

const SERVICE_FALLBACK_POOLS: Record<string, string[]> = {
  mess: [
    '/services/annapurna-maharashtrian-thali.jpg',
    '/services/vaishali-masala-dosa.jpg',
    '/services/roopali-idli-sambar.jpg',
    '/services/durga-tiffin-dabba.jpg',
    '/services/spice-garden-paneer.jpg',
    '/services/shreyas-pune-thali.jpg',
    '/services/sukanta-rajasthani-thali.jpg',
    '/services/badshahi-indian-thali.jpg',
    '/services/wadeshwar-pav-bhaji.jpg',
    '/services/punjabi-chole-bhature.jpg',
    '/services/sagar-dal-makhani.jpg',
    '/services/south-indian-bhojanam.jpg',
    '/services/gujarati-thali-pune.jpg',
    '/services/dabbawala-tiffin-service.jpg'
  ],
  laundry: [
    '/services/laundromat.jpg',
    '/services/laundry-care.jpg'
  ],
  library: [
    '/services/abhyasika-study-hall.jpg',
    '/services/digital-library.jpg',
    '/services/library-1.jpg'
  ],
  medical: [
    '/services/medical-chemist-store.jpg',
    '/services/pharmacy.jpg',
    '/services/emergency-clinic.jpg'
  ],
  grocery: [
    '/services/supermarket.jpg'
  ],
  salon: [
    '/services/salon.jpg'
  ]
}

export function getDefaultServiceImage(cat: string, seed: string = ''): string {
  const pool = SERVICE_FALLBACK_POOLS[cat] || SERVICE_FALLBACK_POOLS.mess
  if (!seed) return pool[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return pool[hash % pool.length]
}

function ServiceCard({ service }: { service: Service }) {
  const imgSrc = service.image || getDefaultServiceImage(service.category, service.id)
  return (
    <article className="service-detail-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: 160, background: '#f8fafc' }}>
        <img
          src={imgSrc}
          alt={service.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultServiceImage(service.category, service.id)
          }}
        />
        <span
          className="service-cat-badge"
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            color: CATEGORY_COLORS[service.category] || '#4f46e5',
            fontWeight: 700,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
          }}
        >
          {CATEGORY_LABELS[service.category] || service.category}
        </span>
        <span
          className="service-rating"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
            borderRadius: 14,
            fontWeight: 700,
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
          }}
        >
          <Star size={12} fill="#d97706" color="#d97706" /> {service.rating}
        </span>
      </div>

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        <h3 style={{ margin: 0 }}>{service.name}</h3>

        {service.collegeName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '2px 0 4px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#4338ca',
              background: '#eef2ff',
              padding: '2px 8px',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}>
              <GraduationCap size={12} /> Near {service.collegeName}
            </span>
            {service.source && (
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                color: '#15803d',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '1px 6px',
                borderRadius: 4
              }}>
                ✓ {service.source}
              </span>
            )}
          </div>
        )}

        <p className="service-address" style={{ margin: 0 }}><MapPin size={13} /> {service.address}</p>
        <p className="service-timing" style={{ margin: 0 }}><Clock size={13} /> {service.timing}</p>
        <p className="service-desc" style={{ margin: '4px 0 0', flex: 1 }}>{service.description}</p>
        <div className="service-footer" style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
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
      </div>
    </article>
  )
}

export function EnhancedServicesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedCollege, setSelectedCollege] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google')

  const categories = ['all', 'mess', 'laundry', 'library', 'medical', 'grocery', 'salon']

  const filtered = puneServices.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false
    if (selectedCollege !== 'all' && s.collegeName !== selectedCollege) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        s.name.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.collegeName && s.collegeName.toLowerCase().includes(q))
      )
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
          <p>Verified tiffin services, laundromats, 24/7 study libraries (abhyasikas), pharmacies, and groceries near colleges.</p>
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

      {/* College Proximity Filter Bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        padding: '10px 16px',
        borderRadius: 14,
        marginBottom: 16,
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#334155' }}>
          <GraduationCap size={17} color="#4f46e5" /> Filter by Campus Proximity:
        </div>
        <select
          value={selectedCollege}
          onChange={e => setSelectedCollege(e.target.value)}
          style={{
            padding: '7px 14px',
            borderRadius: 20,
            border: '1px solid #cbd5e1',
            fontSize: 13,
            fontWeight: 500,
            background: '#ffffff',
            color: '#1e293b',
            cursor: 'pointer',
            minWidth: 260
          }}
        >
          <option value="all">📍 All Colleges & Pune City (Show All)</option>
          {puneColleges.map(c => (
            <option key={c.id} value={c.name}>{c.shortName} — {c.name}</option>
          ))}
        </select>
        {selectedCollege !== 'all' && (
          <button
            type="button"
            className="outline-button"
            style={{ fontSize: 12, padding: '5px 12px', borderRadius: 16 }}
            onClick={() => setSelectedCollege('all')}
          >
            Clear Campus Filter ✕
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div className="services-category-tabs" style={{ marginBottom: 0, flex: 1 }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`service-tab ${activeCategory === cat ? 'service-tab-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? '✨ All Services' : CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search service, area, college..."
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
                const badgeColor = isDMart ? '#059669' : isJioMart ? '#2563eb' : (CATEGORY_COLORS[s.category] || '#0891b2');
                const badgeText = isDMart ? '🛒 OFFICIAL DMART' : isJioMart ? '🛍️ JIOMART / SMART' : (CATEGORY_LABELS[s.category] || s.category);
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
                    <span>{CATEGORY_LABELS[s.category] || s.category}</span>
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
              <p>No services found matching your criteria. Try switching category tabs or clearing your search / college filter.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
