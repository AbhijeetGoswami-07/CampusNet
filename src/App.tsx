import { useEffect, useState } from 'react'
import { Footer, Navbar } from './components'
import { AboutPage, AuthPage, CompareSearchPage, HomePage, LiveAuthPage, LiveListingPage, LiveSearchPage, ListingPage, ModulePage, ProviderListingForm, ProviderProfilePage, ProviderWorkspace, SafetyPage, SavedListingsPage, SearchPage, Workspace } from './pages'
import { supabase } from './supabase'
import './portal.css'
import './styles.css'
import './freshness.css'
import './map.css'
import './ai-search.css'

function getRoute() { return window.location.hash.replace(/^#\/?/, '') || 'home' }

export default function App() {
  const [route, setRoute] = useState(getRoute)
  const [session, setSession] = useState(false)
  const [role, setRole] = useState<'student' | 'provider' | 'admin' | null>(null)
  useEffect(() => { const update = () => setRoute(getRoute()); window.addEventListener('hashchange', update); const client = supabase; if (!client) return () => window.removeEventListener('hashchange', update); client.auth.getSession().then(async ({ data }) => { setSession(Boolean(data.session)); if (data.session) { const profile = await client.from('profiles').select('role').eq('id', data.session.user.id).single(); setRole(profile.data?.role ?? null) } }); const auth = client.auth.onAuthStateChange((_event, next) => setSession(Boolean(next))); return () => { window.removeEventListener('hashchange', update); auth.data.subscription.unsubscribe() } }, [])
  const go = (page: string) => { window.location.hash = page }
  const [section, id] = route.split('/')
  let page: React.ReactNode
  const protectedRoute = ['student-dashboard', 'provider-dashboard', 'admin-dashboard', 'saved-listings', 'my-enquiries', 'my-reviews', 'profile-settings', 'my-listings', 'add-listing', 'edit-listing', 'listing-enquiries', 'provider-profile-settings', 'pending-listings', 'approved-listings', 'report-management', 'user-management', 'verification-management', 'analytics'].includes(section)
  const requiredRole = ['student-dashboard', 'saved-listings', 'my-enquiries', 'my-reviews', 'profile-settings'].includes(section) ? 'student' : ['provider-dashboard', 'my-listings', 'add-listing', 'edit-listing', 'listing-enquiries', 'provider-profile-settings'].includes(section) ? 'provider' : ['admin-dashboard', 'pending-listings', 'approved-listings', 'report-management', 'user-management', 'verification-management', 'analytics'].includes(section) ? 'admin' : null
  if (protectedRoute && supabase && !session) page = <LiveAuthPage go={go} />
  else if (protectedRoute && supabase && role && requiredRole && role !== requiredRole) page = <Workspace role={role} go={go} />
  else if (section === 'search') page = supabase ? <CompareSearchPage go={go} /> : <CompareSearchPage go={go} />
  else if (section === 'listing') page = supabase ? <LiveListingPage id={id ?? ''} go={go} /> : <ListingPage id={id ?? ''} go={go} />
  else if (section === 'add-listing' && (!supabase || (session && role === 'provider'))) page = <ProviderListingForm go={go} />
  else if (section === 'provider') page = <ProviderProfilePage go={go} />
  else if (section === 'student-dashboard') page = <Workspace role="student" go={go} />
  else if (section === 'provider-dashboard') page = <ProviderWorkspace go={go} />
  else if (section === 'admin-dashboard') page = <Workspace role="admin" go={go} />
  else if (section === 'login') page = supabase ? <LiveAuthPage go={go} /> : <AuthPage go={go} />
  else if (section === 'register') page = supabase ? <LiveAuthPage register go={go} /> : <AuthPage register go={go} />
  else if (section === 'about') page = <AboutPage />
  else if (section === 'safety') page = <SafetyPage />
  else if (section === 'services') page = <SearchPage go={go} />
  else if (section === 'saved-listings' && (!supabase || (session && role === 'student'))) page = <SavedListingsPage go={go} />
  else if (['my-enquiries', 'my-reviews', 'profile-settings'].includes(section)) page = <ModulePage title={section.split('-').join(' ')} eyebrow="STUDENT AREA" role="student" go={go} />
  else if (['my-listings', 'add-listing', 'edit-listing', 'listing-enquiries', 'provider-profile-settings'].includes(section)) page = <ModulePage title={section.split('-').join(' ')} eyebrow="PROVIDER AREA" role="provider" go={go} />
  else if (['pending-listings', 'approved-listings', 'report-management', 'user-management', 'verification-management', 'analytics'].includes(section)) page = <ModulePage title={section.split('-').join(' ')} eyebrow="ADMINISTRATION" role="admin" go={go} />
  else page = <HomePage go={go} />
  return <><Navbar onNavigate={go} active={section} signedIn={session} role={role} onLogout={() => { void supabase?.auth.signOut(); go('home') }} /><main>{page}</main><Footer onNavigate={go} /></>
}
