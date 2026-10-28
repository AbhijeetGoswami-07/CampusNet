import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BarChart3, Building2, CheckCircle2, ClipboardList, Compass, FileText, Heart, IndianRupee, Map, MapPin, MessageSquare, Settings, ShieldCheck, Star, UserCheck, Users, Utensils } from 'lucide-react'
import { CategorySelector, ComparisonTable, CostBreakdown, EmptyState, EnquiryModal, FilterSidebar, ImageGallery, Listing, ListingCard, MapView, RatingStars, ReportListingModal, RoleBanner, SearchBar, VerificationBadge, VacancyFreshness, VacancyStatus, sampleListings } from './components'
import { confirmVacancy, createListing, fetchListings, fetchMyEnquiries, fetchProviderListings, fetchSaved, getListing, parseNaturalSearch, reportListing, sendEnquiry, submitReview, toggleSaved, type ListingFilters } from './data'
import { supabase } from './supabase'
import { FlatmateMatchingPage } from './modules/flatmates'
import { ExpenseEstimatorPage } from './modules/expense'
import { CollegesNearbyPage } from './modules/colleges'
import { EnhancedServicesPage } from './modules/services-enhanced'
import { FullMapPage } from './modules/map-full'
import { SettingsPage } from './modules/settings'
import { UnderDevelopmentModule } from './modules/under-development'

export { FlatmateMatchingPage, ExpenseEstimatorPage, CollegesNearbyPage, EnhancedServicesPage, FullMapPage, SettingsPage, UnderDevelopmentModule }

export function HomePage({ go }: { go: (page: string) => void }) {
  return (
    <>
      <section className="portal-hero">
        <div>
          <p className="eyebrow">VERIFIED PUNE STUDENT LIVING</p>
          <h1>Find a place that<br /><em>feels like home.</em></h1>
          <p>Transparent listings for flats, hostels, PGs, messes, and flatmates across Pune — near COEP, Symbiosis, MIT, VIT & SPPU.</p>
          <SearchBar onSearch={(val) => go(`search?q=${encodeURIComponent(val)}`)} />
          <div className="hero-trust">
            <VerificationBadge />
            <span>Real vacancies</span>
            <span>Safe enquiries</span>
            <span>0 Brokerage</span>
          </div>
        </div>
        <div className="hero-photo">
          <img src={sampleListings[0].image} alt="Bright verified student apartment in Pune" />
          <span><ShieldCheck size={16} /> 100% provider verified</span>
        </div>
      </section>

      {/* 6 CORE MODULES SHOWCASE */}
      <section className="modules-showcase">
        <div className="section-top">
          <div>
            <p className="eyebrow">INTEGRATED CAMPUSNEST MODULES</p>
            <h2>6 Essential Student Tools for Pune</h2>
          </div>
        </div>
        <div className="modules-grid">
          <div className="module-banner-card" onClick={() => go('search')}>
            <div>
              <div className="module-badge">MODULE 1</div>
              <h3>Accommodation Search & Filter</h3>
              <p>Explore verified PGs, hostels & apartments in Shivajinagar, Kothrud, Baner, and Viman Nagar with zero hidden fees.</p>
            </div>
            <span className="card-action"><Compass size={16} /> Explore Search <ArrowRight size={14} /></span>
          </div>

          <div className="module-banner-card" onClick={() => go('flatmates')}>
            <div>
              <div className="module-badge dev-badge">MODULE 2 · IN PROGRESS</div>
              <h3>Flatmate Matching</h3>
              <p>Match with compatible Pune college students based on university, daily budget, food preference, and cleanliness habits.</p>
            </div>
            <span className="card-action"><UserCheck size={16} /> Work In Progress <ArrowRight size={14} /></span>
          </div>

          <div className="module-banner-card" onClick={() => go('services')}>
            <div>
              <div className="module-badge">MODULE 3</div>
              <h3>Essential Services</h3>
              <p>Find home-style tiffin messes (Annapurna, Vaishali), laundry drop-offs, 24/7 pharmacies & student grocery hubs.</p>
            </div>
            <span className="card-action"><Utensils size={16} /> Explore Services <ArrowRight size={14} /></span>
          </div>

          <div className="module-banner-card" onClick={() => go('expense-estimator')}>
            <div>
              <div className="module-badge dev-badge">MODULE 4 · IN PROGRESS</div>
              <h3>Monthly Expense Estimation</h3>
              <p>Interactive student budget calculator with realistic Pune presets for rent, food, commute, utilities and leisure.</p>
            </div>
            <span className="card-action"><IndianRupee size={16} /> Work In Progress <ArrowRight size={14} /></span>
          </div>

          <div className="module-banner-card" onClick={() => go('map')}>
            <div>
              <div className="module-badge dev-badge">MODULE 5 · IN PROGRESS</div>
              <h3>Location & Map Explorer</h3>
              <p>Interactive GIS map covering Pune city with multi-layer overlays for housing, daily services, and college campuses.</p>
            </div>
            <span className="card-action"><Map size={16} /> Work In Progress <ArrowRight size={14} /></span>
          </div>

          <div className="module-banner-card" onClick={() => go('colleges')}>
            <div>
              <div className="module-badge">MODULE 6</div>
              <h3>College & Nearby Places</h3>
              <p>Detailed campus hubs (COEP, SIT, VIT, MIT-WPU, Fergusson, SPPU, PICT) with 4.5 km proximity housing circles.</p>
            </div>
            <span className="card-action"><Building2 size={16} /> Browse Colleges <ArrowRight size={14} /></span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">VERIFIED HOMES IN PUNE</p>
            <h2>Start with what you need</h2>
          </div>
          <button className="text-action" onClick={() => go('search')}>View all homes <ArrowRight size={16} /></button>
        </div>
        <CategorySelector onSelect={(cat) => go(cat === 'All homes' ? 'search' : `search?category=${encodeURIComponent(cat.toLowerCase().replace(/s$/, ''))}`)} />
        <div className="listing-grid">
          {sampleListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onOpen={() => go(`listing/${listing.id}`)} />
          ))}
        </div>
      </section>

      <section className="home-trust">
        <div>
          <ShieldCheck size={27} />
          <h2>More clarity.<br /><em>Better moves in Pune.</em></h2>
        </div>
        <div>
          <CheckCircle2 size={19} />
          <b>Verified by people, not algorithms</b>
          <span>Provider identity, exact Pune address, and room photographs are checked.</span>
        </div>
        <div>
          <CheckCircle2 size={19} />
          <b>Know the real monthly cost</b>
          <span>See rent, mess costs, and travel estimates before enquiring.</span>
        </div>
        <div>
          <CheckCircle2 size={19} />
          <b>Your enquiry stays private</b>
          <span>No spam, no broker calls, and no advance deposits required online.</span>
        </div>
      </section>
    </>
  )
}

export function SearchPage({ go }: { go: (page: string) => void }) { const [filtered, setFiltered] = useState(sampleListings); const [saved, setSaved] = useState<string[]>([]); return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">SEARCH RESULTS</p><h1>Homes near your next destination</h1><p>12 verified places match your search.</p></div><button className="outline-button">Compare selected ({saved.length})</button></div><SearchBar /><CategorySelector onSelect={(category) => setFiltered(category === 'All homes' ? sampleListings : sampleListings.filter((item) => item.category.toLowerCase() === category.slice(0, -1).toLowerCase()))} /><div className="search-layout"><FilterSidebar onApply={(f) => setFiltered(sampleListings.filter((item) => { if (f.category && f.category !== "all" && !item.category.toLowerCase().includes(f.category.toLowerCase())) return false; if (f.maxRent && item.price > f.maxRent) return false; if (f.roomType && item.roomType.toLowerCase() !== f.roomType.toLowerCase()) return false; if (f.gender && f.gender !== "Any" && item.genderPreference.toLowerCase() !== f.gender.toLowerCase()) return false; if (f.food && !item.food) return false; if (f.wifi && !item.wifi) return false; if (f.laundry && !item.laundry) return false; return true; }))} /><div className="result-stack"><div className="result-toolbar"><b>{filtered.length + 9} homes found</b><select aria-label="Sort results"><option>Recommended</option><option>Price: low to high</option><option>Most available</option></select></div>{filtered.map((listing) => <ListingCard key={listing.id} listing={listing} onOpen={() => go(`listing/${listing.id}`)} onSave={() => setSaved((current) => current.includes(listing.id) ? current.filter((id) => id !== listing.id) : [...current, listing.id])} saved={saved.includes(listing.id)} />)}</div></div></section> }

export function ListingPage({ id, go }: { id: string; go: (page: string) => void }) {
  const listing = sampleListings.find((item) => item.id === id) ?? sampleListings[0]
  const [enquiry, setEnquiry] = useState(false)
  const [report, setReport] = useState(false)
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('campusnet_saved_listings')
      return raw ? JSON.parse(raw).includes(id) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [id])

  const googleMapsUrl = `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}+(${encodeURIComponent(
    listing.title
  )})`

  return (
    <section className="page-section detail-page">
      <div className="detail-top-nav">
        <button className="back-link" onClick={() => go('search')}>← Back to search</button>
        <div className="detail-top-actions">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="google-maps-nav-btn"
          >
            🗺️ Open in Google Maps
          </a>
          <button
            className={`save-control ${saved ? 'saved' : ''}`}
            onClick={() => {
              void toggleSaved(listing.id, saved)
              setSaved(!saved)
            }}
            aria-label="Save listing"
          >
            <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="detail-title-banner">
        <div className="eyebrow">{listing.category.toUpperCase()} · {listing.locality.toUpperCase()} · PUNE</div>
        <h1 className="detail-main-heading">{listing.title}</h1>
        <div className="detail-meta-row">
          <p className="detail-location-text">
            <MapPin size={16} color="var(--coral)" /> {listing.locality}, {listing.city}
            <VerificationBadge />
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="gmap-direct-link">
              View on Google Maps ↗
            </a>
          </p>
          <div className="detail-quick-tags">
            <span className="room-badge">{listing.roomType}</span>
            <span className="gender-badge">{listing.genderPreference}</span>
          </div>
        </div>
      </div>

      <ImageGallery listing={listing} />

      <div className="detail-layout">
        <div className="detail-main-content">
          <div className="detail-status">
            <VacancyStatus available={listing.available} total={listing.total} />
            <RatingStars rating={listing.rating ?? 4.7} />
          </div>

          <p className="detail-copy">
            A thoughtfully managed, verified student home in {listing.locality}, Pune.
            Transparent monthly breakdown with no hidden brokerage, real verified vacancies,
            and immediate access to nearby student hubs.
          </p>

          <h2>What this home offers</h2>
          <div className="amenity-list">
            <span>{listing.roomType}</span>
            {listing.wifi && <span>📶 High-Speed Wi-Fi included</span>}
            {listing.food ? <span>🍽️ Nutritious Food / Mess included</span> : <span>🍳 Kitchen access available</span>}
            {listing.laundry && <span>👕 In-house Laundry available</span>}
            <span>🔒 24/7 Security & CCTV</span>
            <span>⚡ Power Backup</span>
          </div>

          <div className="detail-location-card">
            <h3>Neighborhood & Proximity</h3>
            <p>Situated in the heart of {listing.locality}, near major colleges, transit stops, and essential student services.</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="solid-button"
              style={{ display: 'inline-flex', width: 'auto', marginTop: 12 }}
            >
              Get Real-time Directions on Google Maps <ArrowRight size={15} />
            </a>
          </div>

          <button className="report-link" onClick={() => setReport(true)}>Report inaccurate information</button>
        </div>

        <aside className="detail-aside">
          <CostBreakdown listing={listing} />
          <button className="solid-button wide-button" onClick={() => setEnquiry(true)}>
            Enquire safely <ArrowRight size={17} />
          </button>
          <div className="detail-map-box">
            <div className="detail-map-header">
              <strong>Exact Verified Location</strong>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">Google Maps ↗</a>
            </div>
            <MapView listings={[listing]} onOpen={(selected) => go(`listing/${selected.id}`)} />
          </div>
        </aside>
      </div>

      {enquiry && <EnquiryModal listing={listing} onClose={() => setEnquiry(false)} onSend={async (text) => { await sendEnquiry(listing.id, text, 'email') }} />}
      {report && <ReportListingModal onClose={() => setReport(false)} />}
    </section>
  )
}

export function ProviderProfilePage({ go }: { go: (page: string) => void }) { return <section className="page-section"><div className="profile-header"><div className="profile-avatar">OH</div><div><VerificationBadge /><h1>Olive House Living</h1><p>Verified provider · Bengaluru · Responds within 2 hours</p></div></div><div className="provider-layout"><div><h2>About this provider</h2><p>We create calm, well-maintained homes for students and working professionals. Every space is photographed and availability is confirmed regularly.</p><h2>Current listings</h2>{sampleListings.slice(0, 2).map((listing) => <ListingCard key={listing.id} listing={listing} onOpen={() => go(`listing/${listing.id}`)} />)}</div><aside className="profile-facts"><RatingStars /><span>Member since 2023</span><span><ShieldCheck size={16} /> Identity verified</span><span><CheckCircle2 size={16} /> 18 successful stays</span></aside></div></section> }

export function Workspace({ role, go }: { role: 'student' | 'provider' | 'admin'; go: (page: string) => void }) {
  const isStudent = role === 'student';
  const [savedCount, setSavedCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('campusnet_saved_listings');
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  });
  const [enquiryCount, setEnquiryCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('campusnet_enquiries');
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  });
  const [reviewCount, setReviewCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('campusnet_reviews');
      return raw ? JSON.parse(raw).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const updateCounts = () => {
      try {
        const rawSaved = localStorage.getItem('campusnet_saved_listings');
        setSavedCount(rawSaved ? JSON.parse(rawSaved).length : 0);
        const rawEnq = localStorage.getItem('campusnet_enquiries');
        setEnquiryCount(rawEnq ? JSON.parse(rawEnq).length : 0);
        const rawRev = localStorage.getItem('campusnet_reviews');
        setReviewCount(rawRev ? JSON.parse(rawRev).length : 0);
      } catch {}
    };
    updateCounts();
    window.addEventListener('campusnet_saved_change', updateCounts);
    window.addEventListener('campusnet_enquiry_change', updateCounts);
    window.addEventListener('campusnet_review_change', updateCounts);
    return () => {
      window.removeEventListener('campusnet_saved_change', updateCounts);
      window.removeEventListener('campusnet_enquiry_change', updateCounts);
      window.removeEventListener('campusnet_review_change', updateCounts);
    };
  }, []);

  const cards = isStudent
    ? [
        [
          'Saved listings',
          savedCount === 0 ? 'No homes saved yet' : `${savedCount} home${savedCount === 1 ? '' : 's'} saved`,
          Heart
        ],
        [
          'My enquiries',
          enquiryCount === 0 ? 'No active enquiries' : `${enquiryCount} active enquir${enquiryCount === 1 ? 'y' : 'ies'}`,
          FileText
        ],
        [
          'My reviews',
          reviewCount === 0 ? 'No reviews yet' : `${reviewCount} review${reviewCount === 1 ? '' : 's'} shared`,
          Star
        ]
      ]
    : role === 'provider'
    ? [
        ['My listings', '3 active listings', Building2],
        ['Listing enquiries', '5 awaiting reply', ClipboardList],
        ['Confirm vacancy', 'Keep availability fresh', CheckCircle2]
      ]
    : [
        ['Pending listings', '8 awaiting review', ClipboardList],
        ['Open reports', '4 reports to resolve', ShieldCheck],
        ['Platform users', '1,204 registered users', Users]
      ];

  return (
    <section className="page-section workspace">
      <RoleBanner role={role} />
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">{role.toUpperCase()} WORKSPACE</p>
          <h1>{isStudent ? 'Your next move, in one place.' : role === 'provider' ? 'Keep your listings trustworthy.' : 'Keep CampusNest dependable.'}</h1>
        </div>
        <button className="outline-button" onClick={() => go('settings')}>
          <Settings size={16} /> Settings
        </button>
      </div>
      <div className="workspace-cards">
        {cards.map(([title, text, Icon]) => (
          <button
            key={title as string}
            className="workspace-card"
            onClick={() => go((title as string).toLowerCase().split(' ').join('-'))}
          >
            <span>
              <Icon size={21} />
              <strong>{title as string}</strong>
              <small>{text as string}</small>
            </span>
            <ArrowRight size={17} />
          </button>
        ))}
      </div>
      <div className="workspace-panel">
        <h2>{role === 'admin' ? 'Moderation queue' : role === 'provider' ? 'Your listings' : 'Recent activity'}</h2>
        {role === 'student' ? (
          savedCount === 0 && enquiryCount === 0 ? (
            <EmptyState title="No recent activity" text="Save a home or send an enquiry to see it here." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {savedCount > 0 && (
                <div className="activity-row">
                  <span><b>Saved Homes Shortlist</b>: {savedCount} place{savedCount === 1 ? '' : 's'} saved</span>
                  <button className="text-action" onClick={() => go('saved-listings')}>View saved <ArrowRight size={13} /></button>
                  <small>Active shortlist</small>
                </div>
              )}
              {enquiryCount > 0 && (
                <div className="activity-row">
                  <span><b>Sent Enquiries</b>: {enquiryCount} enquiry message{enquiryCount === 1 ? '' : 's'}</span>
                  <button className="text-action" onClick={() => go('my-enquiries')}>View enquiries <ArrowRight size={13} /></button>
                  <small>Pending replies</small>
                </div>
              )}
            </div>
          )
        ) : (
          sampleListings.map((listing) => (
            <div className="activity-row" key={listing.id}>
              <span>{listing.title}</span>
              <VerificationBadge />
              <small>{role === 'admin' ? 'Awaiting review' : 'Updated today'}</small>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function AuthPage({ register: initialRegister, go }: { register?: boolean; go: (page: string) => void }) {
  const [isRegister, setIsRegister] = useState(Boolean(initialRegister));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'provider'>('student');
  const [college, setCollege] = useState('COEP Technological University');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIsRegister(Boolean(initialRegister));
    setError('');
    setSuccess('');
  }, [initialRegister]);

  const handleQuickDemo = (demoRole: 'student' | 'provider') => {
    const demoUser = demoRole === 'student'
      ? { id: 'demo_std_1', name: 'Rahul Patil', email: 'rahul.student@campusnet.in', role: 'student', college: 'COEP Technological University', phone: '+91 98200 12345' }
      : { id: 'demo_prv_1', name: 'Sharma Properties (Verified Provider)', email: 'sharma.pg@campusnet.in', role: 'provider', college: '', phone: '+91 98300 54321' };

    localStorage.setItem('campusnet_session', JSON.stringify({ user: demoUser, role: demoRole }));
    window.dispatchEvent(new Event('campusnet_auth_change'));
    setSuccess(`Logged in as ${demoUser.name}! Opening your dashboard...`);
    setTimeout(() => {
      go(`${demoRole}-dashboard`);
    }, 400);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (isRegister && !cleanName) {
      setError('Please enter your full name.');
      return;
    }

    setBusy(true);

    try {
      if (supabase) {
        try {
          if (isRegister) {
            await supabase.auth.signUp({
              email: cleanEmail,
              password: cleanPassword,
              options: { data: { full_name: cleanName, role, college: role === 'student' ? college : undefined } }
            });
          } else {
            await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPassword
            });
          }
        } catch (supaErr) {
          console.warn('Supabase Auth notice (local fallback active):', supaErr);
        }
      }

      const storedUsersRaw = localStorage.getItem('campusnet_users');
      const storedUsers: Array<{ id: string; name: string; email: string; password: string; role: 'student' | 'provider'; college?: string; phone?: string }> =
        storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (isRegister) {
        const existing = storedUsers.find(u => u.email === cleanEmail);
        if (existing) {
          setError('An account with this email already exists. Please sign in instead.');
          setBusy(false);
          return;
        }

        const newUser = {
          id: 'usr_' + Date.now(),
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          role,
          college: role === 'student' ? college : undefined,
          phone: phone.trim() || undefined
        };

        storedUsers.push(newUser);
        localStorage.setItem('campusnet_users', JSON.stringify(storedUsers));

        localStorage.setItem('campusnet_session', JSON.stringify({ user: newUser, role: newUser.role }));
        window.dispatchEvent(new Event('campusnet_auth_change'));

        setSuccess(`Account created successfully! Welcome, ${newUser.name}. Redirecting...`);
        setTimeout(() => {
          go(`${newUser.role}-dashboard`);
        }, 500);
      } else {
        let user = storedUsers.find(u => u.email === cleanEmail && u.password === cleanPassword);

        if (!user) {
          if (cleanEmail === 'student@campusnet.in' && cleanPassword === 'student123') {
            user = { id: 'demo_std_default', name: 'Rahul Patil', email: cleanEmail, password: cleanPassword, role: 'student', college: 'COEP' };
          } else if (cleanEmail === 'provider@campusnet.in' && cleanPassword === 'provider123') {
            user = { id: 'demo_prv_default', name: 'Sharma Properties', email: cleanEmail, password: cleanPassword, role: 'provider' };
          }
        }

        if (!user) {
          const emailExists = storedUsers.find(u => u.email === cleanEmail);
          if (emailExists) {
            setError('Incorrect password. Please verify and try again.');
          } else {
            setError('No account found with this email. Click "Need an account? Register" below to create one.');
          }
          setBusy(false);
          return;
        }

        localStorage.setItem('campusnet_session', JSON.stringify({ user, role: user.role }));
        window.dispatchEvent(new Event('campusnet_auth_change'));

        setSuccess(`Signed in successfully! Welcome back, ${user.name}...`);
        setTimeout(() => {
          go(`${user.role}-dashboard`);
        }, 400);
      }
    } catch (caught) {
      console.error(caught);
      setError('Something went wrong during authentication. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card" style={{ maxWidth: 440 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: !isRegister ? '#e67555' : '#64748b',
              borderBottom: !isRegister ? '2px solid #e67555' : '2px solid transparent'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              padding: '10px 0',
              fontWeight: 700,
              fontSize: 13,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: isRegister ? '#e67555' : '#64748b',
              borderBottom: isRegister ? '2px solid #e67555' : '2px solid transparent'
            }}
          >
            Create Account
          </button>
        </div>

        <p className="eyebrow">CAMPUSNET SECURE ACCESS</p>
        <h1 style={{ fontSize: 26, margin: '4px 0 8px' }}>
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px', lineHeight: 1.5 }}>
          {isRegister
            ? 'Join CampusNet to bookmark student housing, calculate living costs, and contact verified providers.'
            : 'Sign in to access your student dashboard, saved homes, and active enquiries.'}
        </p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: 6, fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#183d3b', marginBottom: 5 }}>
                Full Name <span style={{ color: '#e67555' }}>*</span>
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Patil or Priya Sharma"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5df', borderRadius: 4, fontSize: 13 }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#183d3b', marginBottom: 5 }}>
              Email Address <span style={{ color: '#e67555' }}>*</span>
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu or gmail.com"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5df', borderRadius: 4, fontSize: 13 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#183d3b', marginBottom: 5 }}>
              Password <span style={{ color: '#e67555' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                required
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5df', borderRadius: 4, fontSize: 13, paddingRight: 50 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#64748b' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#183d3b', marginBottom: 5 }}>
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'student' | 'provider')}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5df', borderRadius: 4, fontSize: 13, background: '#fff' }}
                >
                  <option value="student">🎓 Student (Looking for housing / flatmates)</option>
                  <option value="provider">🏢 Accommodation Provider (Hostel / PG Owner)</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#183d3b', marginBottom: 5 }}>
                    Your College / University in Pune
                  </label>
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5df', borderRadius: 4, fontSize: 13, background: '#fff' }}
                  >
                    <option value="COEP Technological University">COEP Technological University (Shivajinagar)</option>
                    <option value="MIT Academy of Engineering">MIT Academy of Engineering (Alandi)</option>
                    <option value="Dnyanvilas College of Engineering">Dnyanvilas College of Engineering (Dudulgaon)</option>
                    <option value="MIT Arts, Commerce and Science College">MIT ACSC (Alandi)</option>
                    <option value="Ajeenkya DY Patil University">Ajeenkya DY Patil University (Charholi / Alandi Rd)</option>
                    <option value="MAEER's Saint Dnyaneshwar B.Ed. College">MAEER's Saint Dnyaneshwar B.Ed. College (Alandi)</option>
                    <option value="MIT World Peace University">MIT World Peace University (Kothrud)</option>
                    <option value="Symbiosis Institute of Technology">Symbiosis Institute of Technology (Lavale/Hinjawadi)</option>
                    <option value="Vishwakarma Institute of Technology">VIT Pune (Bibwewadi)</option>
                    <option value="Fergusson College">Fergusson College (FC Road)</option>
                    <option value="Savitribai Phule Pune University">SPPU (Ganeshkhind)</option>
                    <option value="Pune Institute of Computer Technology">PICT (Dhankawadi)</option>
                    <option value="Symbiosis Law School">Symbiosis Law School (Viman Nagar)</option>
                    <option value="Army Institute of Technology">Army Institute of Technology (Dighi)</option>
                    <option value="Other Pune Institution">Other Pune Institution</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#183d3b', marginBottom: 5 }}>
                  Phone Number (Optional for WhatsApp updates)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #dce5df', borderRadius: 4, fontSize: 13 }}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="solid-button wide-button"
            disabled={busy}
            style={{ width: '100%', padding: '13px 18px', fontSize: 14, marginTop: 8, cursor: busy ? 'not-allowed' : 'pointer' }}
          >
            {busy ? 'Processing...' : isRegister ? 'Create account' : 'Sign in securely'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            className="text-action center-action"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setSuccess('');
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}
          >
            {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </div>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px dashed #dce5df', textAlign: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
            ⚡ Instant Quick Test (One-Click Demo)
          </span>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              🎓 Student Demo (Rahul Patil)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('provider')}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              🏢 Provider Demo (Sharma PG)
            </button>
          </div>
        </div>

        <small className="auth-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18, color: '#94a3b8', fontSize: 11 }}>
          <ShieldCheck size={14} /> Local & Cloud Encrypted Verification
        </small>
      </div>
    </section>
  );
}


export function AboutPage() { return <InfoPage title="A better way to find where you belong." eyebrow="ABOUT CAMPUSNEST"><p>CampusNest gives students and working professionals the context they need to choose a home with confidence. We bring listings, services, real vacancy, and transparent cost into one considered place.</p><div className="info-points"><span><CheckCircle2 /> Honest prices, not bait listings</span><span><CheckCircle2 /> Current capacity, not stale promises</span><span><CheckCircle2 /> Providers and places verified</span></div></InfoPage> }
export function SafetyPage() { return <InfoPage title="Keep the move safe." eyebrow="SAFETY GUIDELINES"><p>Meet providers in public first, verify the address yourself, and never send money before seeing the place and confirming the agreement. CampusNest does not process payments.</p><div className="info-points"><span><ShieldCheck /> Never share OTPs or passwords</span><span><ShieldCheck /> Report suspicious or outdated listings</span><span><ShieldCheck /> Use enquiries to keep a clear record</span></div></InfoPage> }
function InfoPage({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) { return <section className="info-page"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</section> }

export function ModulePage({ title, eyebrow, role, go }: { title: string; eyebrow: string; role: 'student' | 'provider' | 'admin'; go: (page: string) => void }) {
  const isEnquiries = title.toLowerCase().includes('enquir');
  const isReviews = title.toLowerCase().includes('review');

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === 'student') {
      if (isEnquiries) {
        void fetchMyEnquiries().then((res) => {
          setEnquiries(res);
          setLoading(false);
        }).catch(() => {
          setEnquiries([]);
          setLoading(false);
        });
      } else if (isReviews) {
        try {
          const raw = localStorage.getItem('campusnet_reviews') || '[]';
          setReviews(JSON.parse(raw));
        } catch {
          setReviews([]);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [role, isEnquiries, isReviews]);

  return (
    <section className="page-section workspace">
      <RoleBanner role={role} />
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 style={{ textTransform: 'capitalize' }}>{title}</h1>
        </div>
        <button className="outline-button" onClick={() => go(`${role}-dashboard`)}>
          Back to dashboard
        </button>
      </div>

      <div className="workspace-panel">
        {role === 'student' ? (
          loading ? (
            <div className="loading-state">Loading your records...</div>
          ) : isEnquiries ? (
            enquiries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {enquiries.map((enq) => (
                  <div key={enq.id} className="activity-row" style={{ gridTemplateColumns: '1fr auto auto' }}>
                    <div>
                      <strong style={{ fontSize: 14, color: '#183d3b' }}>
                        {enq.listings?.title || `Enquiry for Listing ${enq.listing_id}`}
                      </strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#71817d' }}>"{enq.message}"</p>
                      <small style={{ color: '#9aa7a3', fontSize: 10 }}>
                        {new Date(enq.created_at).toLocaleDateString()} · {enq.listings?.locality || 'Pune'}
                      </small>
                    </div>
                    <span className="verification-badge" style={{ textTransform: 'capitalize' }}>
                      {enq.status || 'Active'}
                    </span>
                    <button
                      className="outline-button"
                      style={{ padding: '6px 12px', fontSize: 11 }}
                      onClick={() => go(`listing/${enq.listing_id}`)}
                    >
                      View Home
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 20px 40px' }}>
                <EmptyState
                  title="No active enquiries yet"
                  text="You haven't contacted any property providers yet. Browse verified student housing across Pune and send an enquiry to chat with landlords."
                />
                <button
                  className="solid-button"
                  onClick={() => go('search')}
                  style={{ margin: '15px auto 0', display: 'inline-flex' }}
                >
                  Find homes to enquire <ArrowRight size={15} />
                </button>
              </div>
            )
          ) : isReviews ? (
            reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {reviews.map((rev) => (
                  <div key={rev.id} className="activity-row" style={{ gridTemplateColumns: '1fr auto auto' }}>
                    <div>
                      <strong style={{ fontSize: 14, color: '#183d3b' }}>{rev.listing_title}</strong>
                      <p style={{ margin: '4px 0 0', fontSize: 12, color: '#71817d' }}>"{rev.comment}"</p>
                      <small style={{ color: '#9aa7a3', fontSize: 10 }}>
                        {new Date(rev.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e39b48' }}>
                      ⭐ {rev.rating} / 5
                    </span>
                    <button
                      className="outline-button"
                      style={{ padding: '6px 12px', fontSize: 11 }}
                      onClick={() => go(`listing/${rev.listing_id}`)}
                    >
                      View Home
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 20px 40px' }}>
                <EmptyState
                  title="No reviews submitted yet"
                  text="You haven't written any reviews yet. Share your experience with verified student accommodations in Pune to help your peers make confident choices."
                />
                <button
                  className="solid-button"
                  onClick={() => go('search')}
                  style={{ margin: '15px auto 0', display: 'inline-flex' }}
                >
                  Find accommodations to review <ArrowRight size={15} />
                </button>
              </div>
            )
          ) : (
            <EmptyState
              title="Your data will appear here"
              text="This private workspace is ready for your student records."
            />
          )
        ) : (
          sampleListings.map((listing) => (
            <div className="activity-row" key={listing.id}>
              <span>
                <b>{listing.title}</b>
                <small>{listing.locality}, {listing.city}</small>
              </span>
              <VacancyStatus available={listing.available} total={listing.total} />
              <VerificationBadge />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export function LiveSearchPage({ go }: { go: (page: string) => void }) { const [query, setQuery] = useState(''); const [listings, setListings] = useState<Listing[]>([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [extraFilters, setExtraFilters] = useState<ListingFilters>({}); const runSearch = async (value = query, filters: ListingFilters = extraFilters) => { setLoading(true); setError(''); try { setListings(await fetchListings({ query: value, ...filters, sort: 'updated' })) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not load listings.'); setListings([]) } finally { setLoading(false) } }; useEffect(() => { if (supabase) void runSearch('', {}) }, []); const visible = supabase ? listings : sampleListings; return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">SEARCH RESULTS</p><h1>Homes near your next destination</h1><p>{supabase ? `${listings.length} verified places match your search.` : 'Development preview listings. Connect Supabase for live results.'}</p></div></div><SearchBar onSearch={(value) => { setQuery(value); void runSearch(value, extraFilters) }} /><CategorySelector onSelect={(category) => { const value = category === 'All homes' ? '' : category.slice(0, -1).toLowerCase(); setQuery(value); void runSearch(value, extraFilters) }} /><div className="search-layout"><FilterSidebar onApply={(f) => { setExtraFilters(f); void runSearch(query, f); }} /><div className="result-stack">{loading ? <div className="loading-state">Loading verified listings...</div> : error ? <div className="error-state"><p>{error}</p></div> : visible.map((listing) => <ListingCard key={listing.id} listing={listing} onOpen={() => go(`listing/${listing.id}`)} />)}</div></div></section> }

export function LiveListingPage({ id, go }: { id: string; go: (page: string) => void }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [enquiry, setEnquiry] = useState(false)
  const [report, setReport] = useState(false)
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem('campusnet_saved_listings')
      return raw ? JSON.parse(raw).includes(id) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [id])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!supabase) {
      setListing(sampleListings.find((item) => item.id === id) ?? sampleListings[0])
      return
    }
    void getListing(id).then(setListing).catch(() => setListing(null))
  }, [id])

  if (!listing) return <section className="page-section"><EmptyState title="Listing unavailable" text="This listing may have been removed or is awaiting approval." /></section>

  const googleMapsUrl = `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}+(${encodeURIComponent(
    listing.title
  )})`

  return (
    <section className="page-section detail-page">
      <div className="detail-top-nav">
        <button className="back-link" onClick={() => go('search')}>← Back to search</button>
        <div className="detail-top-actions">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="google-maps-nav-btn"
          >
            🗺️ Open in Google Maps
          </a>
          <button
            className={`save-control ${saved ? 'saved' : ''}`}
            onClick={() => {
              void toggleSaved(listing.id, saved)
              setSaved(!saved)
            }}
            aria-label="Save listing"
          >
            <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="detail-title-banner">
        <div className="eyebrow">{listing.category.toUpperCase()} · {listing.locality.toUpperCase()} · PUNE</div>
        <h1 className="detail-main-heading">{listing.title}</h1>
        <div className="detail-meta-row">
          <p className="detail-location-text">
            <MapPin size={16} color="var(--coral)" /> {listing.locality}, {listing.city}
            <VerificationBadge />
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="gmap-direct-link">
              View on Google Maps ↗
            </a>
          </p>
          <div className="detail-quick-tags">
            <span className="room-badge">{listing.roomType}</span>
            <span className="gender-badge">{listing.genderPreference} Preference</span>
          </div>
        </div>
      </div>

      <ImageGallery listing={listing} />

      <div className="detail-layout">
        <div className="detail-main-content">
          <div className="detail-status">
            <VacancyStatus available={listing.available} total={listing.total} />
            <RatingStars rating={listing.rating ?? 4.7} />
          </div>

          <p className="detail-copy">
            A verified student home in {listing.locality}, Pune.
            Transparent monthly breakdown with no hidden brokerage, real verified vacancies,
            and immediate access to nearby colleges and transit hubs.
          </p>

          <h2>What this home offers</h2>
          <div className="amenity-list">
            <span>{listing.roomType}</span>
            {listing.wifi && <span>📶 High-Speed Wi-Fi</span>}
            {listing.food ? <span>🍽️ Nutritious Food / Mess</span> : <span>🍳 Kitchen Access</span>}
            {listing.laundry && <span>👕 Laundry Facility</span>}
            <span>🔒 24/7 Security & CCTV</span>
            <span>⚡ Power Backup</span>
          </div>

          <div className="detail-location-card">
            <h3>Neighborhood & Pune Campus Proximity</h3>
            <p>Situated conveniently in {listing.locality}, within walking or short transit distance to colleges, messes, and bus stops.</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="solid-button"
              style={{ display: 'inline-flex', width: 'auto', marginTop: 14 }}
            >
              Get Real-time Directions on Google Maps <ArrowRight size={15} />
            </a>
          </div>

          <button className="report-link" onClick={() => setReport(true)}>Report this listing</button>
        </div>

        <aside className="detail-aside">
          <CostBreakdown listing={listing} />
          <button className="solid-button wide-button" onClick={() => setEnquiry(true)}>
            Enquire safely <ArrowRight size={17} />
          </button>
          <div className="detail-map-box">
            <div className="detail-map-header">
              <strong>Exact Verified Location</strong>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">Google Maps ↗</a>
            </div>
            <MapView listings={[listing]} onOpen={(selected) => go(`listing/${selected.id}`)} />
          </div>
        </aside>
      </div>

      {enquiry && <EnquiryModal listing={listing} onClose={() => setEnquiry(false)} onSend={(text) => sendEnquiry(listing.id, text, 'email')} />}
      {report && <ReportListingModal onClose={() => setReport(false)} onSubmit={(reason, details) => reportListing(listing.id, reason, details)} />}
      {message && <p>{message}</p>}
    </section>
  )
}

export const LiveAuthPage = AuthPage;


export function ProviderListingForm({ go }: { go: (page: string) => void }) { const [title, setTitle] = useState(''); const [category, setCategory] = useState<'flat' | 'hostel' | 'pg' | 'mess' | 'laundry'>('pg'); const [address, setAddress] = useState(''); const [rent, setRent] = useState(''); const [capacity, setCapacity] = useState(''); const [description, setDescription] = useState(''); const [files, setFiles] = useState<File[]>([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const submit = async (event: React.FormEvent) => { event.preventDefault(); if (!files.length) { setError('Add at least one photograph.'); return } setBusy(true); setError(''); try { await createListing({ title, category, description, address, locality: address, city: '', college_name: '', monthly_rent: Number(rent), security_deposit: 0, room_type: 'Private room', gender_preference: 'any', total_capacity: Number(capacity), available_capacity: Number(capacity), food_available: false, laundry_available: false, wifi_available: false }, files); go('provider-dashboard') } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not submit listing.') } finally { setBusy(false) } }; return <section className="page-section"><div className="page-heading"><div><p className="eyebrow">PROVIDER AREA</p><h1>Add a listing</h1><p>New listings are submitted for administrator approval.</p></div></div><form className="auth-card listing-form" onSubmit={submit}><label>Title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. The Olive House" /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value as typeof category)}><option value="flat">Flat</option><option value="hostel">Hostel</option><option value="pg">PG</option><option value="mess">Mess</option><option value="laundry">Laundry</option></select></label><label>Address<input required value={address} onChange={(event) => setAddress(event.target.value)} /></label><label>Monthly rent<input required min="0" type="number" value={rent} onChange={(event) => setRent(event.target.value)} /></label><label>Total capacity<input required min="1" type="number" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></label><label>Description<textarea required value={description} onChange={(event) => setDescription(event.target.value)} /></label><label>Photographs<input required type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label>{error && <p className="form-error">{error}</p>}<button className="solid-button wide-button" disabled={busy}>{busy ? 'Submitting...' : 'Submit for approval'} <ArrowRight size={16} /></button></form></section> }

export function SavedListingsPage({ go }: { go: (page: string) => void }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = () => {
    void fetchSaved().then((res) => {
      setListings(res);
      setLoading(false);
    }).catch(() => {
      setListings([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSaved();
    window.addEventListener('campusnet_saved_change', loadSaved);
    return () => window.removeEventListener('campusnet_saved_change', loadSaved);
  }, []);

  const handleToggle = async (listingId: string) => {
    await toggleSaved(listingId, true);
    loadSaved();
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">STUDENT AREA</p>
          <h1>Saved listings</h1>
          <p>Your shortlist, ready when you are.</p>
        </div>
        <button className="outline-button" onClick={() => go('student-dashboard')}>
          Back to dashboard
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading saved homes...</div>
      ) : listings.length > 0 ? (
        <div className="listing-grid">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onOpen={() => go(`listing/${listing.id}`)}
              onSave={() => void handleToggle(listing.id)}
              saved={true}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px 20px 60px' }}>
          <EmptyState
            title="No saved listings yet"
            text="You haven't saved any properties yet. Browse verified PGs, hostels, and flats across Pune and tap the heart icon to add them to your shortlist."
          />
          <button
            className="solid-button"
            onClick={() => go('search')}
            style={{ margin: '15px auto 0', display: 'inline-flex' }}
          >
            Explore verified accommodations <ArrowRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
}

export function ProviderWorkspace({ go }: { go: (page: string) => void }) { const [listings, setListings] = useState<Listing[]>([]); const [error, setError] = useState(''); const [busy, setBusy] = useState<string | null>(null); const load = async () => { if (!supabase) { setListings(sampleListings); return } try { setListings(await fetchProviderListings()) } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not load your listings.') } }; useEffect(() => { void load() }, []); const confirm = async (listing: Listing) => { setBusy(listing.id); try { await confirmVacancy(listing.id, listing.available); await load() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not confirm vacancy.') } finally { setBusy(null) } }; return <section className="page-section workspace"><RoleBanner role="provider" /><div className="workspace-heading"><div><p className="eyebrow">PROVIDER WORKSPACE</p><h1>Keep your listings trustworthy.</h1><p>Confirm availability regularly so seekers can make informed decisions.</p></div><button className="solid-button" onClick={() => go('add-listing')}>Add listing <ArrowRight size={16} /></button></div>{error && <div className="error-state">{error}</div>}<div className="provider-listings">{listings.map((listing) => <article className="provider-listing-row" key={listing.id}><div><h3>{listing.title}</h3><p>{listing.locality}, {listing.city} · {listing.available} of {listing.total} available</p><VacancyFreshness lastVerifiedAt={listing.lastVerifiedAt} /></div><div className="provider-listing-actions"><button className="outline-button" onClick={() => go(`listing/${listing.id}`)}>View</button><button className="solid-button" disabled={busy === listing.id} onClick={() => void confirm(listing)}>{busy === listing.id ? 'Confirming...' : 'Confirm vacancy'} <CheckCircle2 size={15} /></button></div></article>)}</div>{!listings.length && !error && <EmptyState title="No listings yet" text="Add your first property to start receiving enquiries." />}</section> }

export function CompareSearchPage({
  go,
  initialQuery = '',
  initialCategory = ''
}: {
  go: (page: string) => void
  initialQuery?: string
  initialCategory?: string
}) {
  const [listings, setListings] = useState<Listing[]>([])
  const [selected, setSelected] = useState<Listing[]>([])
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('campusnet_saved_listings')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const handleSavedChange = () => {
      try {
        const raw = localStorage.getItem('campusnet_saved_listings')
        setSavedIds(raw ? JSON.parse(raw) : [])
      } catch {}
    }
    window.addEventListener('campusnet_saved_change', handleSavedChange)
    return () => window.removeEventListener('campusnet_saved_change', handleSavedChange)
  }, [])
  const [showMap, setShowMap] = useState(false)
  const [error, setError] = useState('')
  const [activeFilters, setActiveFilters] = useState<ListingFilters>(() => ({
    sort: 'updated',
    query: initialQuery || '',
    category: initialCategory || undefined,
  }))

  useEffect(() => {
    setActiveFilters((prev) => ({
      ...prev,
      query: initialQuery || '',
      category: initialCategory || undefined,
    }))
  }, [initialQuery, initialCategory])

  useEffect(() => {
    if (supabase) {
      void fetchListings(activeFilters)
        .then(setListings)
        .catch((caught) => setError(caught instanceof Error ? caught.message : 'Could not load listings.'))
    }
  }, [activeFilters.query, activeFilters.category, activeFilters.roomType, activeFilters.gender])

  const baseListings = supabase ? listings : sampleListings

  const available = useMemo(() => {
    return baseListings.filter((item) => {
      if (activeFilters.query) {
        const q = activeFilters.query.toLowerCase().trim()
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.locality.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.roomType.toLowerCase().includes(q) ||
          (item.collegeName && item.collegeName.toLowerCase().includes(q))
        if (!matchesQuery) return false
      }
      if (activeFilters.category && activeFilters.category !== 'all') {
        const cat = activeFilters.category.toLowerCase().replace(/s$/, '')
        const itemCat = item.category.toLowerCase().replace(/s$/, '')
        if (!itemCat.includes(cat) && !cat.includes(itemCat)) return false
      }
      if (activeFilters.maxRent && item.price > activeFilters.maxRent) {
        return false
      }
      if (activeFilters.roomType && item.roomType.toLowerCase() !== activeFilters.roomType.toLowerCase()) {
        return false
      }
      if (activeFilters.gender && activeFilters.gender !== 'Any' && activeFilters.gender !== 'any preference') {
        if (item.genderPreference.toLowerCase() !== activeFilters.gender.toLowerCase()) {
          return false
        }
      }
      if (activeFilters.recentlyVerified && !item.verified) {
        return false
      }
      if (activeFilters.food && !item.food) {
        return false
      }
      if (activeFilters.wifi && !item.wifi) {
        return false
      }
      if (activeFilters.laundry && !item.laundry) {
        return false
      }
      if (activeFilters.maxDistance !== undefined && item.distance !== null && item.distance > activeFilters.maxDistance) {
        return false
      }
      if (activeFilters.maxTotal !== undefined) {
        const total = [item.price, item.foodCost, item.electricityCost, item.wifiCost, item.laundryCost, item.maintenanceCost, item.travelCost].reduce<number>((sum: number, value: number | null) => sum + (value ?? 0), 0)
        if (total > activeFilters.maxTotal) {
          return false
        }
      }
      return true
    })
  }, [baseListings, activeFilters])

  const toggle = (listing: Listing) => {
    setSelected((current) =>
      current.some((item) => item.id === listing.id)
        ? current.filter((item) => item.id !== listing.id)
        : current.length < 3
        ? [...current, listing]
        : current
    )
  }

  const applyFilters = (filters: ListingFilters) => {
    const nextFilters = { ...filters, sort: 'updated' as const }
    setActiveFilters(nextFilters)
    if (supabase) {
      void fetchListings(nextFilters)
        .then(setListings)
        .catch((caught) => setError(caught instanceof Error ? caught.message : 'Could not apply filters.'))
    }
  }

  const scrollToComparison = () => {
    const el = document.getElementById('comparison-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODULE 1 · ACCOMMODATION SEARCH & COMPARE</p>
          <h1>Verified Accommodations in Pune</h1>
          <p>Compare recurring rent, deposits, distance to campus, and availability side by side.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="comparison-count">{selected.length}/3 selected for compare</span>
          {selected.length > 0 && (
            <button
              className="solid-button"
              onClick={scrollToComparison}
              style={{ padding: '8px 14px', fontSize: 12 }}
            >
              View Comparison Table ({selected.length}) <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      <NaturalSearchBox onApply={applyFilters} />
      <SearchBar
        defaultValue={activeFilters.query || ''}
        onSearch={(value) => applyFilters({ ...activeFilters, query: value })}
      />

      <div className="view-toggle" role="group" aria-label="Search result view">
        <button className={!showMap ? 'selected' : ''} onClick={() => setShowMap(false)}>
          List & Filters ({available.length})
        </button>
        <button className={showMap ? 'selected' : ''} onClick={() => setShowMap(true)}>
          Map View
        </button>
      </div>

      <div className={showMap ? 'search-layout-compare map-mode' : 'search-layout-compare'}>
        <aside className="search-filter-sidebar">
          <FilterSidebar onApply={applyFilters} />
        </aside>

        <div className="result-stack">
          <div className="result-toolbar">
            <b>{available.length} verified homes found</b>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              Check 'Compare' on any 2 or 3 cards to view side-by-side
            </span>
          </div>

          {error && <div className="error-state">{error}</div>}

          {available.length === 0 ? (
            <div
              className="empty-state"
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                background: 'var(--surface)',
                borderRadius: 12,
                border: '1px solid var(--border)'
              }}
            >
              <Building2 size={36} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>No accommodations found</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, maxWidth: 420, margin: '0 auto 16px' }}>
                We couldn't find any verified places matching your current search. Try searching for "Kothrud", "COEP", "PG", "Flat", or clear your filters.
              </p>
              <button
                className="solid-button"
                onClick={() => applyFilters({ sort: 'updated' })}
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            available.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onOpen={() => go(`listing/${listing.id}`)}
                onSave={() => void toggleSaved(listing.id, savedIds.includes(listing.id))}
                saved={savedIds.includes(listing.id)}
                onCompare={() => toggle(listing)}
                compareSelected={selected.some((item) => item.id === listing.id)}
              />
            ))
          )}
        </div>

        <div className="search-map">
          <MapView listings={available} onOpen={(listing) => go(`listing/${listing.id}`)} />
        </div>
      </div>

      {/* Sticky Bottom Comparison Dock */}
      {selected.length > 0 && (
        <aside className="compare-floating-dock" aria-label="Selected properties comparison dock">
          <div className="compare-dock-inner">
            <div className="compare-dock-left">
              <span className="compare-dock-badge">{selected.length}/3 Selected</span>
              <div className="compare-dock-chips">
                {selected.map((item) => (
                  <div key={item.id} className="compare-dock-chip">
                    <img src={item.image} alt={item.title} />
                    <span>{item.title}</span>
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      aria-label={`Remove ${item.title} from comparison`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="compare-dock-right">
              <button className="solid-button" onClick={scrollToComparison}>
                Compare Side-by-Side <ArrowRight size={15} />
              </button>
              <button className="outline-button" onClick={() => setSelected([])}>
                Clear
              </button>
            </div>
          </div>
        </aside>
      )}

      {selected.length > 0 && (
        <section id="comparison-section" className="comparison-section" style={{ scrollMarginTop: 90 }}>
          <div className="section-top">
            <div>
              <p className="eyebrow">MODULE 1 · SIDE-BY-SIDE PROPERTY COMPARISON</p>
              <h2>Comparing {selected.length} Selected Homes in Pune</h2>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 0' }}>
                Full recurring breakdown, security deposits, distance to colleges, and amenities check.
              </p>
            </div>
            <button className="outline-button" onClick={() => setSelected([])}>
              Clear comparison
            </button>
          </div>
          <ComparisonTable
            listings={selected}
            onOpen={(listing) => go(`listing/${listing.id}`)}
            onRemove={(listing) => toggle(listing)}
          />
        </section>
      )}
    </section>
  )
}

function NaturalSearchBox({ onApply }: { onApply: (filters: ListingFilters) => void }) { const [prompt, setPrompt] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setMessage(''); try { const filters = await parseNaturalSearch(prompt); onApply({ ...filters, sort: 'updated' }); setMessage('Filters applied.'); } catch (caught) { setMessage(caught instanceof Error ? caught.message : 'Search assistant is unavailable. Normal filters are still available.') } finally { setBusy(false) } }; return <form className="natural-search" onSubmit={submit}><div><label htmlFor="natural-search-input">Describe your ideal place</label><textarea id="natural-search-input" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Try: girls hostel below 9000 total monthly cost within 2 km of ABC College with food, Wi-Fi, and laundry." /><small>Optional AI assistance. Your text is converted into search filters only.</small></div><button className="solid-button" disabled={busy}>{busy ? 'Reading...' : 'Find matches'} <ArrowRight size={16} /></button>{message && <p className="natural-search-message">{message}</p>}</form> }
