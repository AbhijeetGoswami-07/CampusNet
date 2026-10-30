import { useEffect, useState } from 'react'
import { CompareFloatingDock, Footer, Navbar } from './components'
import {
  AboutPage,
  AuthPage,
  CollegesNearbyPage,
  ComparePage,
  CompareSearchPage,
  EnhancedServicesPage,
  ExpenseEstimatorPage,
  FlatmateMatchingPage,
  FullMapPage,
  HomePage,
  LiveAuthPage,
  LiveListingPage,
  ListingPage,
  ModulePage,
  ProviderListingForm,
  ProviderProfilePage,
  ProviderWorkspace,
  SafetyPage,
  SavedListingsPage,
  SettingsPage,
  UnderDevelopmentModule,
  Workspace
} from './pages'
import { supabase } from './supabase'
import './portal.css'
import './styles.css'
import './freshness.css'
import './map.css'
import './ai-search.css'
import './modules-styles.css'

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '') || 'home'
  const [pathPart, queryPart] = hash.split('?')
  const [section, id] = pathPart.split('/')
  const params = new URLSearchParams(queryPart || '')
  return { section: section || 'home', id: id || '', params, full: hash }
}

export default function App() {
  const [routeInfo, setRouteInfo] = useState(parseRoute)
  const [session, setSession] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('campusnet_session'))
  })
  const [role, setRole] = useState<'student' | 'provider' | 'admin' | null>(() => {
    const saved = localStorage.getItem('campusnet_session')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.role || 'student'
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    const update = () => setRouteInfo(parseRoute())
    window.addEventListener('hashchange', update)

    const syncLocalSession = () => {
      const saved = localStorage.getItem('campusnet_session')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSession(true)
          setRole(parsed.role || 'student')
        } catch {
          setSession(false)
          setRole(null)
        }
      } else {
        setSession(false)
        setRole(null)
      }
    }

    syncLocalSession()
    window.addEventListener('campusnet_auth_change', syncLocalSession)

    const client = supabase
    if (client) {
      client.auth.getSession().then(async ({ data }) => {
        if (data.session) {
          setSession(true)
          const profile = await client.from('profiles').select('role').eq('id', data.session.user.id).single()
          setRole(profile.data?.role ?? 'student')
        }
      })
      const auth = client.auth.onAuthStateChange((_event, next) => {
        if (next) {
          setSession(true)
        }
      })
      return () => {
        window.removeEventListener('hashchange', update)
        window.removeEventListener('campusnet_auth_change', syncLocalSession)
        auth.data.subscription.unsubscribe()
      }
    }

    return () => {
      window.removeEventListener('hashchange', update)
      window.removeEventListener('campusnet_auth_change', syncLocalSession)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [routeInfo.section, routeInfo.id])

  const go = (page: string) => {
    window.location.hash = page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  const { section, id, params } = routeInfo

  let page: React.ReactNode
  const protectedRoute = [
    'student-dashboard', 'provider-dashboard', 'admin-dashboard', 'saved-listings',
    'my-enquiries', 'my-reviews', 'profile-settings', 'my-listings', 'add-listing',
    'edit-listing', 'listing-enquiries', 'provider-profile-settings', 'pending-listings',
    'approved-listings', 'report-management', 'user-management', 'verification-management', 'analytics',
    'settings'
  ].includes(section)

  const requiredRole = ['student-dashboard', 'saved-listings', 'my-enquiries', 'my-reviews', 'profile-settings'].includes(section)
    ? 'student'
    : ['provider-dashboard', 'my-listings', 'add-listing', 'edit-listing', 'listing-enquiries', 'provider-profile-settings'].includes(section)
    ? 'provider'
    : ['admin-dashboard', 'pending-listings', 'approved-listings', 'report-management', 'user-management', 'verification-management', 'analytics'].includes(section)
    ? 'admin'
    : null

  if (protectedRoute && !session) {
    page = <AuthPage go={go} />
  } else if (protectedRoute && supabase && role && requiredRole && role !== requiredRole) {
    page = <Workspace role={role} go={go} />
  } else if (section === 'search') {
    page = (
      <CompareSearchPage
        go={go}
        initialQuery={params.get('q') || ''}
        initialCategory={params.get('category') || ''}
      />
    )
  } else if (section === 'compare') {
    page = <ComparePage go={go} />
  } else if (section === 'listing') {
    page = supabase ? <LiveListingPage id={id ?? ''} go={go} /> : <ListingPage id={id ?? ''} go={go} />
  } else if (section === 'flatmates') {
    // Preserved for future: <FlatmateMatchingPage />
    page = (
      <UnderDevelopmentModule
        moduleId="flatmates"
        moduleNumber="MODULE 2"
        title="Flatmate Matching"
        subtitle="Pune Student Roommate Compatibility Network"
        go={go}
      />
    )
  } else if (section === 'services') {
    page = <EnhancedServicesPage />
  } else if (section === 'expense-estimator' || section === 'expenses') {
    // Preserved for future: <ExpenseEstimatorPage />
    page = (
      <UnderDevelopmentModule
        moduleId="expense-estimator"
        moduleNumber="MODULE 4"
        title="Monthly Expense Estimation"
        subtitle="Student Cost of Living & Mess Budget Calibrator"
        go={go}
      />
    )
  } else if (section === 'map') {
    // Preserved for future: <FullMapPage go={go} />
    page = (
      <UnderDevelopmentModule
        moduleId="map"
        moduleNumber="MODULE 5"
        title="Location & Map Explorer"
        subtitle="High-Precision GIS Campus & Transit Radar"
        go={go}
      />
    )
  } else if (section === 'colleges') {
    page = <CollegesNearbyPage go={go} />
  } else if (section === 'add-listing' && (!supabase || (session && role === 'provider'))) {
    page = <ProviderListingForm go={go} />
  } else if (section === 'provider') {
    page = <ProviderProfilePage go={go} />
  } else if (section === 'student-dashboard') {
    page = <Workspace role="student" go={go} />
  } else if (section === 'provider-dashboard') {
    page = <ProviderWorkspace go={go} />
  } else if (section === 'admin-dashboard') {
    page = <Workspace role="admin" go={go} />
  } else if (section === 'login') {
    page = <AuthPage go={go} />
  } else if (section === 'register') {
    page = <AuthPage register go={go} />
  } else if (section === 'about') {
    page = <AboutPage />
  } else if (section === 'safety') {
    page = <SafetyPage />
  } else if (section === 'saved-listings' && (!supabase || (session && role === 'student'))) {
    page = <SavedListingsPage go={go} />
  } else if (['settings', 'profile-settings', 'provider-profile-settings'].includes(section)) {
    page = <SettingsPage role={role ?? 'student'} go={go} />
  } else if (['my-enquiries', 'my-reviews'].includes(section)) {
    page = <ModulePage title={section.split('-').join(' ')} eyebrow="STUDENT AREA" role="student" go={go} />
  } else if (['my-listings', 'add-listing', 'edit-listing', 'listing-enquiries'].includes(section)) {
    page = <ModulePage title={section.split('-').join(' ')} eyebrow="PROVIDER AREA" role="provider" go={go} />
  } else if (['pending-listings', 'approved-listings', 'report-management', 'user-management', 'verification-management', 'analytics'].includes(section)) {
    page = <ModulePage title={section.split('-').join(' ')} eyebrow="ADMINISTRATION" role="admin" go={go} />
  } else {
    page = <HomePage go={go} />
  }

  return (
    <>
      <Navbar onNavigate={go} active={section} signedIn={session} role={role} onLogout={() => { void supabase?.auth.signOut(); localStorage.removeItem('campusnet_session'); window.dispatchEvent(new Event('campusnet_auth_change')); setSession(false); setRole(null); go('home') }} />
      <main>{page}</main>
      <CompareFloatingDock go={go} />
      <Footer onNavigate={go} />
    </>
  )
}
