import { ReactNode, useEffect, useState } from 'react'
import { ArrowRight, BadgeCheck, CheckCircle2, ChevronRight, ExternalLink, Heart, MapPin, Menu, Search, ShieldCheck, Star, Wifi, X } from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { puneListings, type PuneListing } from './data-pune'
import { getCustomMapIcon } from './modules/colleges'

export type Listing = {
  id: string;
  title: string;
  category: string;
  locality: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  foodCost: number | null;
  electricityCost: number | null;
  wifiCost: number | null;
  laundryCost: number | null;
  maintenanceCost: number | null;
  travelCost: number | null;
  securityDeposit: number | null;
  distance: number | null;
  rating: number | null;
  lastVerifiedAt: string | null;
  available: number;
  total: number;
  roomType: string;
  genderPreference: string;
  image: string;
  images?: string[];
  verified: boolean;
  food: boolean;
  laundry: boolean;
  wifi: boolean;
  collegeName?: string;
}

export const sampleListings: Listing[] = puneListings.map(p => ({
  ...p,
  collegeName: p.collegeName,
  images: [
    p.image,
    p.category === 'Flat'
      ? '/hostels/flat-2.jpg'
      : '/hostels/hostel-room-2.jpg',
    p.category === 'Flat'
      ? '/hostels/flat-3.jpg'
      : '/hostels/hostel-room-3.jpg'
  ]
}))

export function Navbar({ onNavigate, active = 'home', signedIn = false, role, onLogout }: { onNavigate: (page: string) => void; active?: string; signedIn?: boolean; role?: 'student' | 'provider' | 'admin' | null; onLogout?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navTo = (page: string) => {
    setMobileMenuOpen(false)
    onNavigate(page)
  }

  return (
    <header className="site-nav">
      <button className="wordmark" onClick={() => navTo('home')}>
        <span className="wordmark-mark">CN</span>Campus<span>Nest</span>
      </button>

      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileMenuOpen(v => !v)}
        aria-label="Toggle navigation menu"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav aria-label="Main navigation" className={mobileMenuOpen ? 'nav-open' : ''}>
        <button className={active === 'search' ? 'nav-active' : ''} onClick={() => navTo('search')}>Find a home</button>
        <button className={active === 'flatmates' ? 'nav-active' : ''} onClick={() => navTo('flatmates')}>Flatmates</button>
        <button className={active === 'services' ? 'nav-active' : ''} onClick={() => navTo('services')}>Services</button>
        <button className={active === 'expense-estimator' ? 'nav-active' : ''} onClick={() => navTo('expense-estimator')}>Expenses</button>
        <button className={active === 'map' ? 'nav-active' : ''} onClick={() => navTo('map')}>Map</button>
        <button className={active === 'colleges' ? 'nav-active' : ''} onClick={() => navTo('colleges')}>Colleges</button>
        <button className={active === 'safety' ? 'nav-active' : ''} onClick={() => navTo('safety')}>Safety</button>
        <button className={active === 'about' ? 'nav-active' : ''} onClick={() => navTo('about')}>About</button>
      </nav>

      {signedIn ? (
        <div className="nav-account">
          <button className="nav-login" onClick={() => navTo(`${role ?? 'student'}-dashboard`)}>{role ?? 'Account'}</button>
          <button className="nav-logout" onClick={onLogout}>Log out</button>
        </div>
      ) : (
        <button className="nav-login" onClick={() => navTo('login')}>Sign in <ArrowRight size={15} /></button>
      )}
    </header>
  )
}
export function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <footer className="site-footer">
      <button className="wordmark" onClick={() => onNavigate('home')}>
        <span className="wordmark-mark">CN</span>Campus<span>Nest</span>
      </button>
      <div>
        <button onClick={() => onNavigate('search')}>Accommodations</button>
        <button onClick={() => onNavigate('flatmates')}>Flatmates</button>
        <button onClick={() => onNavigate('services')}>Services</button>
        <button onClick={() => onNavigate('expense-estimator')}>Expenses</button>
        <button onClick={() => onNavigate('map')}>Map</button>
        <button onClick={() => onNavigate('colleges')}>Colleges</button>
        <button onClick={() => onNavigate('about')}>About</button>
        <button onClick={() => onNavigate('safety')}>Safety guidelines</button>
        <button onClick={() => onNavigate('register')}>List a property</button>
      </div>
      <small>© 2025 CampusNest Pune. Verified living, transparent decisions.</small>
    </footer>
  )
}
export function SearchBar({
  onSearch,
  defaultValue = ''
}: {
  onSearch?: (value: string) => void;
  defaultValue?: string;
}) {
  const [val, setVal] = useState(defaultValue)

  useEffect(() => {
    setVal(defaultValue)
  }, [defaultValue])

  return (
    <form
      className="component-search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch?.(val)
      }}
    >
      <MapPin size={18} />
      <input
        name="location"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        aria-label="Search by location, college, or office"
        placeholder="Search by college (COEP, MIT, Symbiosis), locality (Kothrud, Viman Nagar), or room type..."
      />
      <button aria-label="Search" type="submit">
        <Search size={18} /> Search
      </button>
    </form>
  )
}
export function VerificationBadge() { return <span className="verification-badge"><BadgeCheck size={15} /> Verified</span> }
export function VacancyStatus({ available, total }: { available: number; total: number }) { return <span className={available ? 'vacancy-status' : 'vacancy-status sold'}><span /> {available ? `${available} spot${available > 1 ? 's' : ''} available` : 'Currently full'} <small>of {total}</small></span> }
export function VacancyFreshness({ lastVerifiedAt }: { lastVerifiedAt: string | null }) { if (!lastVerifiedAt) return <span className="freshness-status outdated"><span /> Outdated <small>No confirmation yet</small></span>; const days = Math.floor((Date.now() - new Date(lastVerifiedAt).getTime()) / 86400000); const status = days <= 3 ? 'recent' : days <= 14 ? 'needs' : 'outdated'; const label = status === 'recent' ? 'Verified recently' : status === 'needs' ? 'Needs confirmation' : 'Outdated'; return <span className={`freshness-status ${status}`}><span /> {label} <small>Last confirmed {new Date(lastVerifiedAt).toLocaleDateString()}</small></span> }
export function RatingStars({ rating = 4.8 }: { rating?: number }) { return <span className="rating-stars" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill={star <= Math.round(rating) ? 'currentColor' : 'none'} />)} <b>{rating}</b></span> }
export function ListingCard({
  listing,
  onOpen,
  onSave,
  onCompare,
  compareSelected = false,
  saved = false
}: {
  listing: Listing;
  onOpen?: () => void;
  onSave?: () => void;
  onCompare?: () => void;
  compareSelected?: boolean;
  saved?: boolean;
}) {
  const gmapUrl = `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}+(${encodeURIComponent(listing.title)})`

  return (
    <article className="component-listing-card">
      <button className="card-image" onClick={onOpen}>
        <img src={listing.image} alt={`${listing.title} interior`} />
        <span>{listing.category}</span>
      </button>
      <div className="card-content">
        <div className="card-title-row">
          <div>
            <h3>{listing.title}</h3>
            <p>
              <MapPin size={13} /> {listing.locality}, {listing.city}
              <a
                href={gmapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card-gmap-pill"
                onClick={(e) => e.stopPropagation()}
                title="View on Google Maps"
              >
                🗺️ Maps
              </a>
            </p>
          </div>
          <button
            className={saved ? 'save-control saved' : 'save-control'}
            onClick={onSave}
            aria-label={saved ? 'Remove from saved listings' : 'Save listing'}
          >
            <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="card-meta">
          <VerificationBadge />
          <VacancyStatus available={listing.available} total={listing.total} />
        </div>
        <div className="card-services">
          <span>{listing.roomType}</span>
          {listing.wifi && <span><Wifi size={13} /> Wi-Fi</span>}
          {listing.food && <span>Food</span>}
        </div>
        <div className="card-price">
          <span><b>₹{listing.price.toLocaleString('en-IN')}</b> / month</span>
          <div className="card-actions">
            <label
              className={`compare-control ${compareSelected ? 'compare-control-checked' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={compareSelected}
                onChange={onCompare}
              />
              Compare
            </label>
            <button className="text-action" onClick={onOpen}>
              View details <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
export function FilterSidebar({ onApply }: { onApply?: (filters: { category?: string; maxRent?: number; maxTotal?: number; maxDistance?: number; roomType?: string; gender?: string; food?: boolean; laundry?: boolean; wifi?: boolean }) => void }) { const [category, setCategory] = useState(''); const [maxRent, setMaxRent] = useState(50000); const [maxTotal, setMaxTotal] = useState(''); const [maxDistance, setMaxDistance] = useState(''); const [roomType, setRoomType] = useState(''); const [gender, setGender] = useState(''); const [food, setFood] = useState(false); const [wifi, setWifi] = useState(false); const [laundry, setLaundry] = useState(false); return <aside className="filter-sidebar"><div className="filter-heading"><h3>Refine search</h3><button type="button" onClick={() => { setCategory(''); setMaxRent(50000); setMaxTotal(''); setMaxDistance(''); setRoomType(''); setGender(''); setFood(false); setWifi(false); setLaundry(false); onApply?.({}) }}>Clear all</button></div><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option><option value="flat">Flat</option><option value="hostel">Hostel</option><option value="pg">PG</option><option value="mess">Mess</option><option value="laundry">Laundry</option></select></label><label>Maximum rent<input type="range" min="0" max="50000" value={maxRent} onChange={(event) => setMaxRent(Number(event.target.value))} /><span className="range-labels"><small>₹0</small><small>₹{maxRent.toLocaleString('en-IN')}</small></span></label><label>Maximum total monthly cost<input type="number" min="0" value={maxTotal} onChange={(event) => setMaxTotal(event.target.value)} placeholder="Any total" /></label><label>Maximum distance (km)<input type="number" min="0" value={maxDistance} onChange={(event) => setMaxDistance(event.target.value)} placeholder="Any distance" /></label><label>Room type<select value={roomType} onChange={(event) => setRoomType(event.target.value)}><option value="">Any room type</option><option>Private room</option><option>Shared room</option><option>Entire place</option></select></label><label>Gender preference<select value={gender} onChange={(event) => setGender(event.target.value)}><option value="">Any preference</option><option>Any</option><option>Women</option><option>Men</option></select></label><fieldset><legend>Amenities</legend><label className="check-row"><input type="checkbox" checked={food} onChange={(event) => setFood(event.target.checked)} /> Food included</label><label className="check-row"><input type="checkbox" checked={wifi} onChange={(event) => setWifi(event.target.checked)} /> Wi-Fi</label><label className="check-row"><input type="checkbox" checked={laundry} onChange={(event) => setLaundry(event.target.checked)} /> Laundry</label></fieldset><button type="button" className="solid-button filter-apply" onClick={() => onApply?.({ category: category || undefined, maxRent: maxRent < 50000 ? maxRent : undefined, maxTotal: maxTotal ? Number(maxTotal) : undefined, maxDistance: maxDistance ? Number(maxDistance) : undefined, roomType: roomType || undefined, gender: gender || undefined, food, laundry, wifi })}>Apply filters</button></aside> }
export function CategorySelector({ onSelect }: { onSelect?: (category: string) => void }) { return <div className="category-selector">{['All homes', 'Flats', 'Hostels', 'PGs', 'Messes', 'Laundry'].map((item) => <button key={item} onClick={() => onSelect?.(item)}>{item}</button>)}</div> }
const money = (value: number | null | undefined) => value === null || value === undefined ? 'Not provided' : `₹${value.toLocaleString('en-IN')}`
const totalMonthlyCost = (listing: Listing) => [listing.price, listing.foodCost, listing.electricityCost, listing.wifiCost, listing.laundryCost, listing.maintenanceCost, listing.travelCost].reduce((sum: number, value: number | null) => sum + (value ?? 0), 0)
const hasMissingCosts = (listing: Listing) => [listing.foodCost, listing.electricityCost, listing.wifiCost, listing.laundryCost, listing.maintenanceCost, listing.travelCost].some((value) => value === null)
export function CostBreakdown({ listing }: { listing: Listing }) { return <div className="cost-breakdown"><div><span>Monthly rent</span><b>{money(listing.price)}</b></div><div><span>Food cost</span><b>{money(listing.foodCost)}</b></div><div><span>Electricity cost <small>(estimated)</small></span><b>{money(listing.electricityCost)}</b></div><div><span>Wi-Fi cost</span><b>{money(listing.wifiCost)}</b></div><div><span>Laundry cost</span><b>{money(listing.laundryCost)}</b></div><div><span>Maintenance cost</span><b>{money(listing.maintenanceCost)}</b></div><div><span>Travel cost <small>(estimated)</small></span><b>{money(listing.travelCost)}</b></div><div><span>Security deposit <small>(one-time)</small></span><b>{money(listing.securityDeposit)}</b></div><div className="cost-total"><span>Recurring monthly total{hasMissingCosts(listing) && <small> (some costs not provided)</small>}</span><b>₹{totalMonthlyCost(listing).toLocaleString('en-IN')}</b></div></div> }
export function ComparisonTable({
  listings,
  onOpen,
  onRemove
}: {
  listings: Listing[];
  onOpen?: (listing: Listing) => void;
  onRemove?: (listing: Listing) => void;
}) {
  const value = (text: string | number | null | undefined) =>
    text === null || text === undefined
      ? 'Not provided'
      : typeof text === 'number'
      ? text.toLocaleString('en-IN')
      : text

  return (
    <div className="comparison-table-wrapper">
      <div className="comparison-table">
        {/* Header Row with Property Thumbnails, Titles, and Quick Actions */}
        <div className="comparison-row comparison-cards-row">
          <div className="comparison-cell-label">
            <strong>Properties</strong>
            <small>{listings.length} of 3 selected</small>
          </div>
          {listings.map((item) => {
            const gmapUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}+(${encodeURIComponent(item.title)})`
            return (
              <div key={item.id} className="comparison-prop-header">
                {onRemove && (
                  <button
                    className="comparison-remove-btn"
                    onClick={() => onRemove(item)}
                    title="Remove from comparison"
                  >
                    <X size={14} /> Remove
                  </button>
                )}
                <img src={item.image} alt={item.title} className="comparison-prop-img" />
                <strong className="comparison-prop-title">{item.title}</strong>
                <span className="comparison-prop-loc">
                  <MapPin size={12} /> {item.locality}, {item.city}
                </span>
                <div className="comparison-prop-btns">
                  {onOpen && (
                    <button className="solid-button" onClick={() => onOpen(item)}>
                      View Details <ChevronRight size={14} />
                    </button>
                  )}
                  <a
                    href={gmapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="outline-button"
                    style={{ fontSize: 11, padding: '6px 10px' }}
                  >
                    🗺️ Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Highlighted Monthly Recurring Total */}
        <div className="comparison-row comparison-highlight-row">
          <div className="comparison-cell-label">
            <b>Total Monthly Cost</b>
            <small>All recurring expenses</small>
          </div>
          {listings.map((item) => (
            <div key={item.id} className="comparison-total-cell">
              <strong>₹{totalMonthlyCost(item).toLocaleString('en-IN')}</strong>
              <small>/ month</small>
              {hasMissingCosts(item) && <span className="partial-cost-badge">*estimated</span>}
            </div>
          ))}
        </div>

        {/* Breakdown Items */}
        {[
          ['Monthly Rent', (item: Listing) => money(item.price)],
          ['Food / Mess Cost', (item: Listing) => money(item.foodCost)],
          ['Electricity (Est.)', (item: Listing) => money(item.electricityCost)],
          ['Wi-Fi Cost', (item: Listing) => money(item.wifiCost)],
          ['Laundry Cost', (item: Listing) => money(item.laundryCost)],
          ['Maintenance Fee', (item: Listing) => money(item.maintenanceCost)],
          ['Security Deposit (1-time)', (item: Listing) => money(item.securityDeposit)],
          ['Room Sharing Type', (item: Listing) => item.roomType],
          ['Gender Preference', (item: Listing) => item.genderPreference],
          ['Available Capacity', (item: Listing) => `${item.available} of ${item.total} spots open`],
          ['Distance to College', (item: Listing) => item.distance !== null ? `${item.distance} km` : 'Near campus'],
          ['Wi-Fi Included', (item: Listing) => item.wifi ? '✅ Yes (High Speed)' : '❌ No'],
          ['Food Included', (item: Listing) => item.food ? '✅ Yes (Mess/Meals)' : '🍳 Kitchen Access'],
          ['Laundry Service', (item: Listing) => item.laundry ? '✅ Yes' : '❌ Self-service'],
          ['Rating', (item: Listing) => item.rating ? `⭐ ${item.rating} / 5` : '⭐ 4.6 / 5'],
          ['Verification', (item: Listing) => item.verified ? '🛡️ CampusNest Verified' : 'Pending review']
        ].map(([label, getValue]) => (
          <div className="comparison-row" key={label as string}>
            <div className="comparison-cell-label">{label as string}</div>
            {listings.map((item) => (
              <div key={item.id} className="comparison-cell-val">
                {value((getValue as (item: Listing) => string | number | null)(item))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <small className="comparison-note">
        * Total recurring sum incorporates rent, food, electricity, Wi-Fi, and maintenance. Verified 0 brokerage Pune housing.
      </small>
    </div>
  )
}

export function ImageGallery({ listing }: { listing: Listing }) {
  const images = (listing.images && listing.images.length >= 3)
    ? listing.images
    : [
        listing.image,
        listing.category === 'Flat'
          ? 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
      ]

  return (
    <div className="image-gallery">
      <img src={images[0]} alt={`${listing.title} main bedroom`} />
      <div>
        <img src={images[1]} alt={`${listing.title} living / study area`} />
        <img src={images[2]} alt={`${listing.title} washroom or balcony`} />
      </div>
    </div>
  )
}

export function MapView({ listings, onOpen }: { listings: Listing[]; onOpen?: (listing: Listing) => void }) {
  const mapped = listings.filter((listing) => listing.latitude !== null && listing.longitude !== null)
  const center: LatLngExpression = mapped.length ? [mapped[0].latitude as number, mapped[0].longitude as number] : [18.5204, 73.8567]
  return (
    <div className="map-view">
      <MapContainer center={center} zoom={13} scrollWheelZoom className="leaflet-map">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mapped.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude as number, listing.longitude as number]}
            icon={getCustomMapIcon(listing.category)}
          >
            <Tooltip direction="top" offset={[0, -22]}>
              {listing.title}
            </Tooltip>
            <Popup>
              <div className="map-popup">
                <strong>{listing.title}</strong>
                <span>{listing.category} · ₹{listing.price.toLocaleString('en-IN')} / month</span>
                <span>{listing.available} of {listing.total} available</span>
                <button className="text-action" onClick={() => onOpen?.(listing)}>
                  Open listing <ArrowRight size={14} />
                </button>
                <a
                  href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}+(${encodeURIComponent(listing.title)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="google-maps-btn"
                >
                  Google Maps ↗
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {!mapped.length && <div className="map-empty"><MapPin size={21} /><span>No approved listings have coordinates yet.</span></div>}
      <small className="map-attribution">{mapped.length} of {listings.length} approved listings mapped</small>
    </div>
  )
}
export function EnquiryModal({ listing, onClose, onSend }: { listing: Listing; onClose: () => void; onSend?: (message: string) => Promise<void> }) { const [message, setMessage] = useState(`Hi, I’m interested in ${listing.title}. Is it still available?`); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); return <div className="component-overlay"><div className="component-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title"><button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button><p className="eyebrow">SAFE ENQUIRY</p><h2 id="enquiry-title">Ask about {listing.title}</h2><p>Your message will be shared only with this verified provider.</p><textarea aria-label="Enquiry message" value={message} onChange={(event) => setMessage(event.target.value)} />{error && <p className="form-error">{error}</p>}<button className="solid-button" disabled={busy} onClick={async () => { setBusy(true); try { await onSend?.(message); onClose() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not send enquiry.') } finally { setBusy(false) } }}>{busy ? 'Sending...' : 'Send enquiry'} <ArrowRight size={16} /></button></div></div> }
export function ReportListingModal({ onClose, onSubmit }: { onClose: () => void; onSubmit?: (reason: string, description: string) => Promise<void> }) { const [reason, setReason] = useState('outdated vacancy'); const [description, setDescription] = useState(''); const [error, setError] = useState(''); return <div className="component-overlay"><div className="component-modal" role="dialog" aria-modal="true"><button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button><p className="eyebrow">HELP KEEP CAMPUSNEST ACCURATE</p><h2>Report this listing</h2><select aria-label="Report reason" value={reason} onChange={(event) => setReason(event.target.value)}><option value="fake listing">Fake listing</option><option value="outdated vacancy">Outdated vacancy</option><option value="incorrect price">Incorrect price</option><option value="unsafe property">Unsafe property</option><option value="inappropriate content">Inappropriate content</option></select><textarea aria-label="Report details" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tell us what needs attention" />{error && <p className="form-error">{error}</p>}<button className="solid-button" onClick={async () => { try { await onSubmit?.(reason, description); onClose() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not submit report.') } }}>Submit report</button></div></div> }
export function EmptyState({ title, text }: { title: string; text: string }) { return <div className="empty-state"><ShieldCheck size={30} /><h3>{title}</h3><p>{text}</p></div> }
export function LoadingState() { return <div className="loading-state"><span /><span /><span /> Loading your CampusNest data...</div> }
export function ErrorState({ text = 'Something went wrong loading this page.' }: { text?: string }) { return <div className="error-state"><X size={22} /><p>{text}</p><button className="text-action">Try again</button></div> }
export function ConfirmDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) { return <div className="component-overlay"><div className="component-modal"><h2>{title}</h2><p>{children}</p><div className="dialog-actions"><button className="outline-button" onClick={onClose}>Cancel</button><button className="solid-button" onClick={onClose}>Confirm</button></div></div></div> }
export function RoleBanner({ role }: { role: 'student' | 'provider' | 'admin' }) { return <div className="role-banner"><CheckCircle2 size={18} /><span>Signed-in {role} workspace</span><small>Permissions are enforced by Supabase Row Level Security.</small></div> }
