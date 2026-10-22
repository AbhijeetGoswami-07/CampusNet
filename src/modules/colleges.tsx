import { useState, useEffect } from 'react'
import {
  MapPin, Users, ExternalLink, Building2, BookOpen, ArrowRight, Star, Utensils,
  Phone, Clock, GraduationCap, Home, Shirt, HeartPulse, Store, ArrowDown,
  ArrowUpRight, Sparkles, Compass, Scissors, ShoppingBag, Calculator, UserCheck
} from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer, Circle, Tooltip, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import { puneColleges, puneListings, puneServices, type College } from '../data-pune'

export const getCustomMapIcon = (type: string) => {
  const t = (type || '').toLowerCase()
  let markerClass = 'marker-service'
  let svgContent = ''

  if (t === 'college' || t === 'campus') {
    markerClass = 'marker-college'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
  } else if (t === 'hostel') {
    markerClass = 'marker-hostel'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>`
  } else if (t === 'pg' || t === 'flat') {
    markerClass = 'marker-hostel'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  } else if (t === 'mess' || t === 'food' || t === 'tiffin') {
    markerClass = 'marker-mess'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v18"/><path d="M7 2v20"/><path d="M4 2v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2"/></svg>`
  } else if (t === 'laundry') {
    markerClass = 'marker-laundry'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`
  } else if (t === 'medical' || t === 'clinic' || t === 'hospital') {
    markerClass = 'marker-medical'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14h-4v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1z"/></svg>`
  } else if (t === 'grocery' || t === 'store' || t === 'mart') {
    markerClass = 'marker-grocery'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
  } else if (t === 'salon') {
    markerClass = 'marker-salon'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`
  } else {
    markerClass = 'marker-service'
    svgContent = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
  }

  return L.divIcon({
    className: 'custom-map-marker-container',
    html: `
      <div class="custom-marker-wrapper ${markerClass}">
        <div class="custom-marker-bubble">
          ${svgContent}
        </div>
        <div class="custom-marker-tip"></div>
      </div>
    `,
    iconSize: [34, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -40],
    tooltipAnchor: [0, -42]
  })
}

function MapFlyController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.1 })
  }, [center, zoom, map])
  return null
}

function CollegeCard({
  college,
  onSelect,
  selected
}: {
  college: College;
  onSelect: (c: College) => void;
  selected: boolean;
}) {
  const gmapUrl = `https://www.google.com/maps?q=${college.latitude},${college.longitude}+(${encodeURIComponent(college.name)})`

  return (
    <article
      className={`college-card ${selected ? 'college-card-selected' : ''}`}
      onClick={() => onSelect(college)}
    >
      <div className="college-card-img">
        <img
          src={college.image}
          alt={college.name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'
          }}
        />
        <span className="college-type-badge">{college.type.split('&')[0].trim()}</span>
      </div>
      <div className="college-card-body">
        <div className="college-shortname">{college.shortName}</div>
        <h3>{college.name}</h3>
        <p className="college-meta">
          <MapPin size={12} /> {college.area}, Pune · Est. {college.established}
        </p>
        <p className="college-meta">
          <Users size={12} /> {college.students.toLocaleString('en-IN')} students · {college.affiliated}
        </p>
        <div className="college-card-footer">
          <button
            className="solid-button"
            style={{ padding: '8px 14px', fontSize: 12 }}
            onClick={e => {
              e.stopPropagation()
              onSelect(college)
            }}
          >
            <Building2 size={13} /> View 2 km Radius & Places <ArrowRight size={13} />
          </button>
          <a
            href={gmapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-action"
            style={{ fontSize: 12 }}
            onClick={e => e.stopPropagation()}
            title="Open campus in Google Maps"
          >
            Google Maps <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </article>
  )
}

export function CollegesNearbyPage({ go }: { go: (page: string) => void }) {
  const [selected, setSelected] = useState<College | null>(puneColleges[0])
  // Allow choosing one option category at a time instead of dumping all at once
  const [activeTab, setActiveTab] = useState<'hostels' | 'messes' | 'laundry' | 'medical' | 'other_options'>('hostels')

  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const dLat = (lat2 - lat1) * 111.32
    const dLon = (lon2 - lon1) * 111.32 * Math.cos(lat1 * (Math.PI / 180))
    return Math.sqrt(dLat * dLat + dLon * dLon)
  }

  const handleSelectCollege = (c: College) => {
    setSelected(c)
    setTimeout(() => {
      const el = document.getElementById('college-map-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  // Filter within 2.0 km radius zone around selected campus
  const nearbyListings = selected
    ? puneListings
        .map(l => ({ ...l, calcDist: calcDistance(selected.latitude, selected.longitude, l.latitude, l.longitude) }))
        .filter(l => l.calcDist <= 2.2)
        .sort((a, b) => a.calcDist - b.calcDist)
    : []

  const nearbyServices = selected
    ? puneServices
        .map(s => ({ ...s, calcDist: calcDistance(selected.latitude, selected.longitude, s.latitude, s.longitude) }))
        .filter(s => s.calcDist <= 2.2)
        .sort((a, b) => a.calcDist - b.calcDist)
    : []

  const nearbyMesses = nearbyServices.filter(s => s.category === 'mess')
  const nearbyLaundry = nearbyServices.filter(s => s.category === 'laundry')
  const nearbyMedical = nearbyServices.filter(s => s.category === 'medical')
  const nearbyStores = nearbyServices.filter(s => s.category === 'grocery' || s.category === 'salon')

  const mapCenter: LatLngExpression = selected
    ? [selected.latitude, selected.longitude]
    : [18.5204, 73.8567]

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODULE 6 · COLLEGE & 2 KM PROXIMITY ZONE</p>
          <h1>Pune University & College Hubs</h1>
          <p>
            Explore verified student accommodations, messes, and daily services located within a <strong>2.0 km radius</strong> of premier Pune colleges.
          </p>
        </div>
        {selected && (
          <button
            className="outline-button"
            onClick={() => {
              const el = document.getElementById('all-colleges-list')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Browse all {puneColleges.length} colleges <ArrowDown size={14} />
          </button>
        )}
      </div>

      {/* Quick Campus Switch Bar */}
      <div className="campus-quick-bar">
        <span className="campus-quick-label">
          <GraduationCap size={15} color="var(--coral)" /> Quick Campus Select:
        </span>
        <div className="campus-quick-chips">
          {puneColleges.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`campus-chip ${selected?.id === c.id ? 'campus-chip-active' : ''}`}
              onClick={() => handleSelectCollege(c)}
            >
              <GraduationCap size={13} style={{ display: 'inline', marginRight: 4 }} />
              {c.shortName}
            </button>
          ))}
        </div>
      </div>

      <div className="colleges-layout">
        {selected && (
          <div id="college-map-section" className="colleges-nearby-panel" style={{ scrollMarginTop: 85 }}>
            <div className="nearby-header">
              <div>
                <p className="eyebrow">ACTIVE CAMPUS FOCUS · 2.0 KM RADIUS</p>
                <h2 style={{ fontSize: 24, margin: '2px 0 6px' }}>{selected.name} ({selected.shortName})</h2>
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="var(--coral)" /> {selected.area}, Pune · {selected.type} · Est. {selected.established}
                </p>
              </div>
              <button
                className="outline-button"
                style={{ fontSize: 12, padding: '6px 12px' }}
                onClick={() => {
                  const el = document.getElementById('all-colleges-list')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Change Campus <ArrowDown size={13} />
              </button>
            </div>

            {/* Filter Tabs by Option - One Category at a time, not all at once */}
            <div className="view-toggle" role="group" style={{ marginBottom: 14 }}>
              <button
                className={activeTab === 'hostels' ? 'selected' : ''}
                onClick={() => setActiveTab('hostels')}
              >
                <Home size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                Hostels & PGs ({nearbyListings.length})
              </button>
              <button
                className={activeTab === 'messes' ? 'selected' : ''}
                onClick={() => setActiveTab('messes')}
              >
                <Utensils size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                Student Messes ({nearbyMesses.length})
              </button>
              <button
                className={activeTab === 'laundry' ? 'selected' : ''}
                onClick={() => setActiveTab('laundry')}
              >
                <Shirt size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                Laundry & Cleaners ({nearbyLaundry.length})
              </button>
              <button
                className={activeTab === 'medical' ? 'selected' : ''}
                onClick={() => setActiveTab('medical')}
              >
                <HeartPulse size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                Medical & Clinics ({nearbyMedical.length})
              </button>
              <button
                className={activeTab === 'other_options' ? 'selected' : ''}
                onClick={() => setActiveTab('other_options')}
              >
                <Compass size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />
                See Other Options (Hostels, Messes & More)
              </button>
            </div>

            {/* Visual Icon Legend */}
            <div className="college-map-legend">
              <span className="legend-chip legend-college">
                <span className="legend-icon-badge badge-college">
                  <GraduationCap size={13} color="#ffffff" />
                </span>
                <strong>College Campus</strong>
              </span>
              <span className="legend-chip legend-hostel">
                <span className="legend-icon-badge badge-hostel">
                  <Home size={13} color="#ffffff" />
                </span>
                <strong>Hostel / PG ({nearbyListings.length})</strong>
              </span>
              <span className="legend-chip legend-mess">
                <span className="legend-icon-badge badge-mess">
                  <Utensils size={13} color="#ffffff" />
                </span>
                <strong>Mess & Tiffin ({nearbyMesses.length})</strong>
              </span>
              <span className="legend-chip legend-laundry">
                <span className="legend-icon-badge badge-laundry">
                  <Shirt size={13} color="#ffffff" />
                </span>
                <strong>Laundry</strong>
              </span>
              <span className="legend-chip legend-medical">
                <span className="legend-icon-badge badge-medical">
                  <HeartPulse size={13} color="#ffffff" />
                </span>
                <strong>Medical / 24h</strong>
              </span>
            </div>

            <div className="nearby-map-wrap">
              <MapContainer center={mapCenter} zoom={14} scrollWheelZoom className="leaflet-map">
                <MapFlyController center={[selected.latitude, selected.longitude]} zoom={14} />
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* College Marker */}
                <Marker position={[selected.latitude, selected.longitude]} icon={getCustomMapIcon('college')}>
                  <Tooltip direction="top" offset={[0, -22]}>
                    🎓 {selected.shortName} Campus
                  </Tooltip>
                  <Popup>
                    <div className="map-popup">
                      <span style={{ fontSize: 10, color: '#4f46e5', fontWeight: 800 }}>UNIVERSITY CAMPUS</span>
                      <strong>{selected.name}</strong>
                      <span>{selected.area}, Pune</span>
                      <span>{selected.students.toLocaleString('en-IN')} students</span>
                      <a
                        href={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}+(${encodeURIComponent(selected.name)})`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="google-maps-btn"
                        style={{ marginTop: 8 }}
                      >
                        Open Campus on Google Maps ↗
                      </a>
                    </div>
                  </Popup>
                </Marker>

                {/* 2.0 km Proximity Zone Circle Indicator */}
                <Circle
                  center={[selected.latitude, selected.longitude]}
                  radius={2000}
                  pathOptions={{
                    color: '#4f46e5',
                    fillColor: '#6366f1',
                    fillOpacity: 0.08,
                    weight: 2,
                    dashArray: '6, 6'
                  }}
                />

                {/* Hostels & PGs (Visible when hostels or other_options is active) */}
                {(activeTab === 'hostels' || activeTab === 'other_options') && nearbyListings.map(l => (
                  <Marker
                    key={l.id}
                    position={[l.latitude, l.longitude]}
                    icon={getCustomMapIcon(l.category)}
                  >
                    <Tooltip direction="top" offset={[0, -22]}>
                      {l.title} ({l.calcDist.toFixed(1)} km)
                    </Tooltip>
                    <Popup>
                      <div className="map-popup">
                        <span style={{ fontSize: 10, color: 'var(--coral)', fontWeight: 800 }}>
                          {l.category.toUpperCase()} · HOSTEL / PG
                        </span>
                        <strong>{l.title}</strong>
                        <span>{l.roomType} · ₹{l.price.toLocaleString('en-IN')}/mo</span>
                        <span>{l.available} of {l.total} spots available</span>
                        <span><strong>{l.calcDist.toFixed(1)} km</strong> from {selected.shortName}</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button className="text-action" onClick={() => go(`listing/${l.id}`)}>
                            View details <ArrowRight size={13} />
                          </button>
                          <a
                            href={`https://www.google.com/maps?q=${l.latitude},${l.longitude}+(${encodeURIComponent(l.title)})`}
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

                {/* Messes (Visible when messes or other_options is active) */}
                {(activeTab === 'messes' || activeTab === 'other_options') && nearbyMesses.map(m => (
                  <Marker
                    key={m.id}
                    position={[m.latitude, m.longitude]}
                    icon={getCustomMapIcon('mess')}
                  >
                    <Tooltip direction="top" offset={[0, -22]}>
                      {m.name} ({m.calcDist.toFixed(1)} km)
                    </Tooltip>
                    <Popup>
                      <div className="map-popup">
                        <span style={{ fontSize: 10, color: '#d97706', fontWeight: 800 }}>
                          STUDENT MESS & TIFFIN
                        </span>
                        <strong>{m.name}</strong>
                        <span>{m.priceRange}</span>
                        <span>{m.timing}</span>
                        <span><strong>{m.calcDist.toFixed(1)} km</strong> from {selected.shortName}</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <a href={`tel:${m.phone}`} style={{ color: 'var(--coral)', fontWeight: 600, fontSize: 12 }}>
                            📞 {m.phone}
                          </a>
                          <a
                            href={`https://www.google.com/maps?q=${m.latitude},${m.longitude}+(${encodeURIComponent(m.name)})`}
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

                {/* Laundry Services */}
                {(activeTab === 'laundry' || activeTab === 'other_options') && nearbyLaundry.map(s => (
                  <Marker
                    key={s.id}
                    position={[s.latitude, s.longitude]}
                    icon={getCustomMapIcon('laundry')}
                  >
                    <Tooltip direction="top" offset={[0, -22]}>
                      {s.name} ({s.calcDist.toFixed(1)} km)
                    </Tooltip>
                    <Popup>
                      <div className="map-popup">
                        <span style={{ fontSize: 10, color: '#06b6d4', fontWeight: 800 }}>LAUNDROMAT & DRY CLEAN</span>
                        <strong>{s.name}</strong>
                        <span>{s.priceRange} · {s.timing}</span>
                        <span><strong>{s.calcDist.toFixed(1)} km</strong> from {selected.shortName}</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <a href={`tel:${s.phone}`} style={{ color: 'var(--coral)', fontWeight: 600, fontSize: 12 }}>📞 Call</a>
                          <a href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}+(${encodeURIComponent(s.name)})`} target="_blank" rel="noopener noreferrer" className="google-maps-btn">Google Maps ↗</a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Medical Services */}
                {(activeTab === 'medical' || activeTab === 'other_options') && nearbyMedical.map(s => (
                  <Marker
                    key={s.id}
                    position={[s.latitude, s.longitude]}
                    icon={getCustomMapIcon('medical')}
                  >
                    <Tooltip direction="top" offset={[0, -22]}>
                      {s.name} ({s.calcDist.toFixed(1)} km)
                    </Tooltip>
                    <Popup>
                      <div className="map-popup">
                        <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 800 }}>MEDICAL & EMERGENCY</span>
                        <strong>{s.name}</strong>
                        <span>{s.priceRange} · {s.timing}</span>
                        <span><strong>{s.calcDist.toFixed(1)} km</strong> from {selected.shortName}</span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <a href={`tel:${s.phone}`} style={{ color: 'var(--coral)', fontWeight: 600, fontSize: 12 }}>📞 Emergency Call</a>
                          <a href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}+(${encodeURIComponent(s.name)})`} target="_blank" rel="noopener noreferrer" className="google-maps-btn">Google Maps ↗</a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Content Area - Displays One Category Cleanly Instead of Everything at the Same Time */}
            <div style={{ marginTop: 24 }}>

              {/* TAB 1: Hostels & PGs Only */}
              {activeTab === 'hostels' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Home size={19} color="var(--coral)" />
                      Verified Hostels & PGs within 2 km of {selected.shortName} ({nearbyListings.length})
                    </h3>
                    <button className="text-action" onClick={() => setActiveTab('other_options')} style={{ fontSize: 13 }}>
                      See other options <ArrowRight size={14} />
                    </button>
                  </div>
                  {nearbyListings.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                      {nearbyListings.map(l => (
                        <div key={l.id} className="nearby-listing-row" onClick={() => go(`listing/${l.id}`)}>
                          <img src={l.image} alt={l.title} className="nearby-listing-img" />
                          <div className="listing-info">
                            <strong>{l.title}</strong>
                            <div className="listing-meta-tags">
                              <span className="nearby-badge nearby-badge-dist">
                                <MapPin size={11} /> {l.calcDist.toFixed(1)} km from campus
                              </span>
                              <span>{l.locality}</span>
                              <span>·</span>
                              <span>{l.roomType}</span>
                            </div>
                            <div className="listing-price-row">
                              <span style={{ color: 'var(--coral)', fontWeight: 800 }}>
                                ₹{l.price.toLocaleString('en-IN')}<small style={{ fontWeight: 500, color: 'var(--muted)' }}>/mo</small>
                              </span>
                              <span className="nearby-badge nearby-badge-spots">
                                <Users size={11} /> {l.available} spots open
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={17} style={{ marginLeft: 'auto', color: 'var(--coral)', flexShrink: 0 }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 0', textAlign: 'center' }}>
                      No verified hostels recorded within 2 km of {selected.shortName}.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 2: Student Messes Only */}
              {activeTab === 'messes' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Utensils size={19} color="#d97706" />
                      Student Messes & Daily Tiffins within 2 km of {selected.shortName} ({nearbyMesses.length})
                    </h3>
                    <button className="text-action" onClick={() => setActiveTab('other_options')} style={{ fontSize: 13 }}>
                      See other options <ArrowRight size={14} />
                    </button>
                  </div>
                  {nearbyMesses.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                      {nearbyMesses.map(m => (
                        <div key={m.id} className="nearby-service-row">
                          <div className="service-category-dot" data-cat="mess" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong>{m.name}</strong>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0' }}>
                              <span className="nearby-badge nearby-badge-dist">
                                <MapPin size={11} /> {m.calcDist.toFixed(1)} km from campus
                              </span>
                              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{m.priceRange}</span>
                              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                                <Star size={11} fill="#e67555" color="#e67555" style={{ display: 'inline' }} /> {m.rating}
                              </span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                              <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                              {m.timing} · {m.address}
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                            <a
                              href={`tel:${m.phone}`}
                              className="outline-button"
                              style={{ fontSize: 11, padding: '6px 10px', whiteSpace: 'nowrap' }}
                              title="Call mess"
                            >
                              <Phone size={11} /> Call
                            </a>
                            <a
                              href={`https://www.google.com/maps?q=${m.latitude},${m.longitude}+(${encodeURIComponent(m.name)})`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-action"
                              style={{ fontSize: 11, textAlign: 'center' }}
                            >
                              Maps ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 0', textAlign: 'center' }}>
                      No recorded student messes within 2 km of {selected.shortName}.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 3: Laundry Services Only */}
              {activeTab === 'laundry' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Shirt size={19} color="#06b6d4" />
                      Laundromats & Dry Cleaning within 2 km of {selected.shortName} ({nearbyLaundry.length})
                    </h3>
                    <button className="text-action" onClick={() => setActiveTab('other_options')} style={{ fontSize: 13 }}>
                      See other options <ArrowRight size={14} />
                    </button>
                  </div>
                  {nearbyLaundry.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                      {nearbyLaundry.map(s => (
                        <div key={s.id} className="nearby-service-row">
                          <div className="service-category-dot" data-cat="laundry" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong>{s.name}</strong>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0' }}>
                              <span className="nearby-badge nearby-badge-dist">
                                <MapPin size={11} /> {s.calcDist.toFixed(1)} km from campus
                              </span>
                              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{s.priceRange}</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                              <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                              {s.timing} · {s.address}
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                            <a
                              href={`tel:${s.phone}`}
                              className="outline-button"
                              style={{ fontSize: 11, padding: '6px 10px', whiteSpace: 'nowrap' }}
                            >
                              <Phone size={11} /> Call
                            </a>
                            <a
                              href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}+(${encodeURIComponent(s.name)})`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-action"
                              style={{ fontSize: 11, textAlign: 'center' }}
                            >
                              Maps ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 0', textAlign: 'center' }}>
                      No laundromats recorded within 2 km of {selected.shortName}.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 4: Medical Clinics Only */}
              {activeTab === 'medical' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 18, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HeartPulse size={19} color="#ef4444" />
                      Medical Clinics & Emergency Care within 2 km of {selected.shortName} ({nearbyMedical.length})
                    </h3>
                    <button className="text-action" onClick={() => setActiveTab('other_options')} style={{ fontSize: 13 }}>
                      See other options <ArrowRight size={14} />
                    </button>
                  </div>
                  {nearbyMedical.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                      {nearbyMedical.map(s => (
                        <div key={s.id} className="nearby-service-row">
                          <div className="service-category-dot" data-cat="medical" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong>{s.name}</strong>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '4px 0' }}>
                              <span className="nearby-badge nearby-badge-dist">
                                <MapPin size={11} /> {s.calcDist.toFixed(1)} km from campus
                              </span>
                              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>24/7 Available</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                              <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                              {s.timing} · {s.address}
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                            <a
                              href={`tel:${s.phone}`}
                              className="solid-button"
                              style={{ fontSize: 11, padding: '6px 10px', background: '#ef4444', borderColor: '#ef4444', whiteSpace: 'nowrap' }}
                            >
                              <Phone size={11} /> Emergency
                            </a>
                            <a
                              href={`https://www.google.com/maps?q=${s.latitude},${s.longitude}+(${encodeURIComponent(s.name)})`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-action"
                              style={{ fontSize: 11, textAlign: 'center' }}
                            >
                              Maps ↗
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--muted)', fontSize: 14, padding: '24px 0', textAlign: 'center' }}>
                      No medical clinics recorded within 2 km of {selected.shortName}.
                    </p>
                  )}
                </div>
              )}

              {/* TAB 5: "See Other Options" - Comprehensively Explains ALL Student Options */}
              {activeTab === 'other_options' && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <p className="eyebrow">COMPREHENSIVE STUDENT ECOSYSTEM</p>
                    <h3 style={{ fontSize: 20, margin: '4px 0 6px' }}>
                      All Student Living Options for {selected.name}
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
                      Choose any option below to view verified places, pricing, distance and direct contact details within 2 km.
                    </p>
                  </div>

                  <div className="see-other-options-grid">
                    {/* Option 1: Hostels & PGs */}
                    <div className="see-other-card" onClick={() => setActiveTab('hostels')}>
                      <div className="see-other-card-header">
                        <div className="see-other-icon-wrap" style={{ background: 'linear-gradient(135deg, #f97316, #e67555)' }}>
                          <Home size={22} />
                        </div>
                        <div>
                          <h4>Hostels & PGs</h4>
                          <span style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 600 }}>{nearbyListings.length} verified stays nearby</span>
                        </div>
                      </div>
                      <p>
                        Verified student accommodation, private & twin-sharing rooms with Wi-Fi, food, zero brokerage, and security deposits.
                      </p>
                      <div className="see-other-card-footer">
                        <span>Average ₹7,200 – ₹9,000/mo</span>
                        <span>Open Option <ArrowRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></span>
                      </div>
                    </div>

                    {/* Option 2: Student Messes & Tiffins */}
                    <div className="see-other-card" onClick={() => setActiveTab('messes')}>
                      <div className="see-other-card-header">
                        <div className="see-other-icon-wrap" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                          <Utensils size={22} />
                        </div>
                        <div>
                          <h4>Messes & Daily Tiffins</h4>
                          <span style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>{nearbyMesses.length} dining options</span>
                        </div>
                      </div>
                      <p>
                        Authentic Maharashtrian & North Indian unlimited thalis, monthly meal cards, Sunday feasts, and hostel doorstep tiffin delivery.
                      </p>
                      <div className="see-other-card-footer">
                        <span>₹1,500 – ₹2,800/month</span>
                        <span>Open Option <ArrowRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></span>
                      </div>
                    </div>

                    {/* Option 3: Laundry & Laundromats */}
                    <div className="see-other-card" onClick={() => setActiveTab('laundry')}>
                      <div className="see-other-card-header">
                        <div className="see-other-icon-wrap" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                          <Shirt size={22} />
                        </div>
                        <div>
                          <h4>Laundry & Dry Clean</h4>
                          <span style={{ fontSize: 12, color: '#06b6d4', fontWeight: 600 }}>{nearbyLaundry.length} services nearby</span>
                        </div>
                      </div>
                      <p>
                        Per-kilogram automatic wash and steam fold, quick 4-hour express student turnaround, and monthly laundry subscriptions.
                      </p>
                      <div className="see-other-card-footer">
                        <span>₹40 – ₹60/kg express</span>
                        <span>Open Option <ArrowRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></span>
                      </div>
                    </div>

                    {/* Option 4: Medical & Emergency */}
                    <div className="see-other-card" onClick={() => setActiveTab('medical')}>
                      <div className="see-other-card-header">
                        <div className="see-other-icon-wrap" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                          <HeartPulse size={22} />
                        </div>
                        <div>
                          <h4>Medical & Emergency Care</h4>
                          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{nearbyMedical.length} clinics & pharmacies</span>
                        </div>
                      </div>
                      <p>
                        24/7 round-the-clock pharmacies, student health clinics, emergency ambulance contacts, and subsidized college medical centres.
                      </p>
                      <div className="see-other-card-footer">
                        <span>24/7 Emergency Support</span>
                        <span>Open Option <ArrowRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></span>
                      </div>
                    </div>

                    {/* Option 5: Flatmate Matching */}
                    <div className="see-other-card" onClick={() => go('flatmates')}>
                      <div className="see-other-card-header">
                        <div className="see-other-icon-wrap" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                          <Users size={22} />
                        </div>
                        <div>
                          <h4>Flatmate Matching</h4>
                          <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 600 }}>Verified Student Profiles</span>
                        </div>
                      </div>
                      <p>
                        Find roommates from {selected.shortName} who match your budget, sleep schedule, study habits, and dietary preferences.
                      </p>
                      <div className="see-other-card-footer">
                        <span>Module 2 · Matching Tool</span>
                        <span>Find Flatmate <ArrowRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></span>
                      </div>
                    </div>

                    {/* Option 6: Student Expense Estimator */}
                    <div className="see-other-card" onClick={() => go('expense-estimator')}>
                      <div className="see-other-card-header">
                        <div className="see-other-icon-wrap" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                          <Calculator size={22} />
                        </div>
                        <div>
                          <h4>Campus Expense Estimator</h4>
                          <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Real Pune Costs</span>
                        </div>
                      </div>
                      <p>
                        Simulate total recurring monthly budget for {selected.shortName} including rent, mess, laundry, Wi-Fi, and daily travel expenses.
                      </p>
                      <div className="see-other-card-footer">
                        <span>Module 4 · Budget Tool</span>
                        <span>Estimate Costs <ArrowRight size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div id="all-colleges-list" className="colleges-list" style={{ scrollMarginTop: 85 }}>
          <h2 style={{ fontSize: 20, margin: '0 0 16px' }}>All Pune Campuses & Institutions</h2>
          <div className="college-grid">
            {puneColleges.map(c => (
              <CollegeCard
                key={c.id}
                college={c}
                onSelect={handleSelectCollege}
                selected={selected?.id === c.id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
