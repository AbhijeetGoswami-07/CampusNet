import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  School,
  ShieldCheck,
  User,
  AlertCircle
} from 'lucide-react'

interface SettingsPageProps {
  role: 'student' | 'provider' | 'admin'
  go: (page: string) => void
}

interface StoredUser {
  id?: string
  name: string
  email: string
  role?: string
  college?: string
  phone?: string
  locality?: string
  budget?: string
  bio?: string
  password?: string
}

const PUNE_AREAS = [
  'Alandi / Dudulgaon (DVCOE / MIT AOE)',
  'Kothrud / Karve Road (MIT WPU / Cummins)',
  'Shivajinagar / FC Road (COEP / Fergusson)',
  'Viman Nagar (Symbiosis Campus)',
  'Bibwewadi / Kondhwa (VIT Pune / VIIT)',
  'Pashan / Baner / Aundh',
  'Hinjawadi Infotech Park & Vicinity',
  'Wakad / Pimple Saudagar / Ravet (PCCOE)'
]

const POPULAR_COLLEGES = [
  'COEP Technological University, Shivajinagar',
  'Dnyanvilas College of Engineering (DVCOE), Dudulgaon',
  'MIT Academy of Engineering (MIT AOE), Alandi',
  'MIT World Peace University (MIT-WPU), Kothrud',
  'Vishwakarma Institute of Technology (VIT), Bibwewadi',
  'Symbiosis International University, Viman Nagar',
  'Pimpri Chinchwad College of Engineering (PCCOE), Akurdi',
  'Cummins College of Engineering for Women, Karve Nagar',
  'Pune Institute of Computer Technology (PICT), Dhankawadi',
  'Bharati Vidyapeeth Deemed University, Katraj'
]

export function SettingsPage({ role: initialRole, go }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')
  const [role, setRole] = useState(initialRole)

  // Profile state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState(POPULAR_COLLEGES[0])
  const [locality, setLocality] = useState(PUNE_AREAS[0])
  const [budget, setBudget] = useState('8500')
  const [bio, setBio] = useState('')

  // Notification preferences
  const [notifyNewListings, setNotifyNewListings] = useState(true)
  const [notifyVacancy, setNotifyVacancy] = useState(true)
  const [notifyEnquiries, setNotifyEnquiries] = useState(true)
  const [notifyFlatmates, setNotifyFlatmates] = useState(true)

  // Security state
  const [currPassword, setCurrPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Feedback alerts
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)

  // Load current user data on mount
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem('campusnet_session')
      if (rawSession) {
        const parsed = JSON.parse(rawSession)
        const user = parsed.user || {}
        if (parsed.role) setRole(parsed.role)
        if (user.name) setName(user.name)
        if (user.email) setEmail(user.email)
        if (user.phone) setPhone(user.phone)
        if (user.college) setCollege(user.college)
        if (user.locality) setLocality(user.locality)
        if (user.budget) setBudget(String(user.budget))
        if (user.bio) setBio(user.bio)
      } else {
        // Fallback default demo data
        setName(initialRole === 'provider' ? 'Sharma Properties' : 'Rahul Patil')
        setEmail(initialRole === 'provider' ? 'sharma.pg@campusnet.in' : 'rahul.student@campusnet.in')
        setPhone('+91 98200 12345')
      }

      const rawPrefs = localStorage.getItem('campusnet_notif_prefs')
      if (rawPrefs) {
        const prefs = JSON.parse(rawPrefs)
        if (prefs.newListings !== undefined) setNotifyNewListings(prefs.newListings)
        if (prefs.vacancy !== undefined) setNotifyVacancy(prefs.vacancy)
        if (prefs.enquiries !== undefined) setNotifyEnquiries(prefs.enquiries)
        if (prefs.flatmates !== undefined) setNotifyFlatmates(prefs.flatmates)
      }
    } catch {
      // Ignored
    }
  }, [initialRole])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setSaving(true)

    if (!name.trim()) {
      setErrorMsg('Full Name cannot be empty.')
      setSaving(false)
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      setSaving(false)
      return
    }

    try {
      // 1. Update session in localStorage
      const rawSession = localStorage.getItem('campusnet_session')
      const currentSession = rawSession ? JSON.parse(rawSession) : {}
      const updatedUser: StoredUser = {
        ...(currentSession.user || {}),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: role === 'student' ? college : undefined,
        locality,
        budget,
        bio: bio.trim(),
        role
      }

      localStorage.setItem(
        'campusnet_session',
        JSON.stringify({
          ...currentSession,
          user: updatedUser,
          role
        })
      )

      // 2. Update user in stored users registry if present
      const rawUsers = localStorage.getItem('campusnet_users')
      if (rawUsers) {
        try {
          const users: StoredUser[] = JSON.parse(rawUsers)
          const updatedList = users.map((u) =>
            u.email.toLowerCase() === updatedUser.email ? { ...u, ...updatedUser } : u
          )
          localStorage.setItem('campusnet_users', JSON.stringify(updatedList))
        } catch {
          // Ignored
        }
      }

      // 3. Save notification preferences
      localStorage.setItem(
        'campusnet_notif_prefs',
        JSON.stringify({
          newListings: notifyNewListings,
          vacancy: notifyVacancy,
          enquiries: notifyEnquiries,
          flatmates: notifyFlatmates
        })
      )

      // 4. Notify app of auth changes
      window.dispatchEvent(new Event('campusnet_auth_change'))

      setSuccessMsg('Profile and preferences saved successfully!')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.')
      return
    }

    try {
      const rawUsers = localStorage.getItem('campusnet_users')
      if (rawUsers) {
        const users: StoredUser[] = JSON.parse(rawUsers)
        const updatedList = users.map((u) =>
          u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
        )
        localStorage.setItem('campusnet_users', JSON.stringify(updatedList))
      }

      setCurrPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccessMsg('Security credentials updated successfully!')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch {
      setErrorMsg('Could not update password.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('campusnet_session')
    window.dispatchEvent(new Event('campusnet_auth_change'))
    go('home')
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CN'

  return (
    <section className="page-section settings-page-container">
      {/* Top Header & Breadcrumb */}
      <div className="settings-header-nav">
        <button
          type="button"
          className="settings-back-btn"
          onClick={() => go(`${role}-dashboard`)}
        >
          <ArrowLeft size={16} /> Back to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
        </button>
      </div>

      <div className="settings-hero">
        <div className="settings-avatar-badge">{initials}</div>
        <div className="settings-hero-details">
          <div className="settings-role-tag">
            <ShieldCheck size={13} />
            <span>{role.toUpperCase()} ACCOUNT</span>
          </div>
          <h1>{name || 'Account Settings'}</h1>
          <p>{email || 'Configure your personal information, housing preferences, and security.'}</p>
        </div>
      </div>

      {/* Status Alerts */}
      {successMsg && (
        <div className="settings-alert settings-alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="settings-alert settings-alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="settings-tabs" role="tablist">
        <button
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
          type="button"
        >
          <User size={15} /> Personal Profile
        </button>
        <button
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
          type="button"
        >
          <Bell size={15} /> Notifications
        </button>
        <button
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
          type="button"
        >
          <Lock size={15} /> Security & Session
        </button>
      </div>

      <div className="settings-card">
        {/* Tab 1: Profile Form */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="settings-form">
            <h2 className="settings-section-title">Personal Information</h2>
            <p className="settings-section-sub">
              This information is shared with verified landlords and flatmate candidates on CampusNest.
            </p>

            <div className="settings-grid-2">
              <div className="settings-field">
                <label htmlFor="settings-name">Full Name</label>
                <div className="settings-input-wrapper">
                  <User size={16} className="settings-input-icon" />
                  <input
                    id="settings-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Patil"
                    required
                  />
                </div>
              </div>

              <div className="settings-field">
                <label htmlFor="settings-email">Email Address</label>
                <div className="settings-input-wrapper">
                  <Mail size={16} className="settings-input-icon" />
                  <input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="settings-grid-2">
              <div className="settings-field">
                <label htmlFor="settings-phone">Phone / WhatsApp Number</label>
                <div className="settings-input-wrapper">
                  <Phone size={16} className="settings-input-icon" />
                  <input
                    id="settings-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                  />
                </div>
              </div>

              {role === 'student' ? (
                <div className="settings-field">
                  <label htmlFor="settings-college">College / Institute</label>
                  <div className="settings-input-wrapper">
                    <School size={16} className="settings-input-icon" />
                    <select
                      id="settings-college"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                    >
                      {POPULAR_COLLEGES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="settings-field">
                  <label htmlFor="settings-business">Organization / Provider Name</label>
                  <div className="settings-input-wrapper">
                    <School size={16} className="settings-input-icon" />
                    <input
                      id="settings-business"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sharma PG Services"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="settings-grid-2">
              <div className="settings-field">
                <label htmlFor="settings-locality">Target / Preferred Pune Locality</label>
                <div className="settings-input-wrapper">
                  <MapPin size={16} className="settings-input-icon" />
                  <select
                    id="settings-locality"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                  >
                    {PUNE_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="settings-field">
                <label htmlFor="settings-budget">Monthly Rent Budget Target (₹)</label>
                <div className="settings-input-wrapper">
                  <span className="settings-currency-symbol">₹</span>
                  <input
                    id="settings-budget"
                    type="number"
                    min="3000"
                    max="60000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="8500"
                  />
                </div>
              </div>
            </div>

            <div className="settings-field">
              <label htmlFor="settings-bio">About Me / Living Preferences</label>
              <textarea
                id="settings-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your branch, preferred room sharing (single/double), dietary habits (veg/non-veg), or house rules..."
              />
            </div>

            <div className="settings-actions">
              <button type="submit" className="solid-button" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'notifications' && (
          <div className="settings-notifications-tab">
            <h2 className="settings-section-title">Notification Preferences</h2>
            <p className="settings-section-sub">
              Control when CampusNest sends you updates regarding properties, vacancies, and enquiries.
            </p>

            <div className="settings-toggle-list">
              <label className="settings-toggle-row">
                <input
                  type="checkbox"
                  checked={notifyNewListings}
                  onChange={(e) => setNotifyNewListings(e.target.checked)}
                />
                <div className="settings-toggle-text">
                  <strong>New Verified Listing Alerts</strong>
                  <p>Receive alerts when newly verified PGs, hostels, or flats appear near your campus.</p>
                </div>
              </label>

              <label className="settings-toggle-row">
                <input
                  type="checkbox"
                  checked={notifyVacancy}
                  onChange={(e) => setNotifyVacancy(e.target.checked)}
                />
                <div className="settings-toggle-text">
                  <strong>Vacancy & Freshness Updates</strong>
                  <p>Get notified if available beds decrease or landlord confirms immediate vacancies.</p>
                </div>
              </label>

              <label className="settings-toggle-row">
                <input
                  type="checkbox"
                  checked={notifyEnquiries}
                  onChange={(e) => setNotifyEnquiries(e.target.checked)}
                />
                <div className="settings-toggle-text">
                  <strong>Enquiry Responses & Chat Messages</strong>
                  <p>Receive notifications when property managers or students reply to your messages.</p>
                </div>
              </label>

              <label className="settings-toggle-row">
                <input
                  type="checkbox"
                  checked={notifyFlatmates}
                  onChange={(e) => setNotifyFlatmates(e.target.checked)}
                />
                <div className="settings-toggle-text">
                  <strong>Flatmate Matching Recommendations</strong>
                  <p>Get weekly suggestions of students with matching college, budget, and lifestyle habits.</p>
                </div>
              </label>
            </div>

            <div className="settings-actions" style={{ marginTop: 24 }}>
              <button
                type="button"
                className="solid-button"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                <Save size={16} /> Save Notification Preferences
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Session */}
        {activeTab === 'security' && (
          <div className="settings-security-tab">
            <h2 className="settings-section-title">Change Password</h2>
            <p className="settings-section-sub">
              Update your password to keep your CampusNest account secure.
            </p>

            <form onSubmit={handlePasswordUpdate} className="settings-form">
              <div className="settings-field">
                <label htmlFor="settings-curr-pass">Current Password</label>
                <div className="settings-input-wrapper">
                  <Lock size={16} className="settings-input-icon" />
                  <input
                    id="settings-curr-pass"
                    type="password"
                    value={currPassword}
                    onChange={(e) => setCurrPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="settings-grid-2">
                <div className="settings-field">
                  <label htmlFor="settings-new-pass">New Password</label>
                  <div className="settings-input-wrapper">
                    <Lock size={16} className="settings-input-icon" />
                    <input
                      id="settings-new-pass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                    />
                  </div>
                </div>

                <div className="settings-field">
                  <label htmlFor="settings-conf-pass">Confirm New Password</label>
                  <div className="settings-input-wrapper">
                    <Lock size={16} className="settings-input-icon" />
                    <input
                      id="settings-conf-pass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button type="submit" className="solid-button">
                  <Lock size={16} /> Update Password
                </button>
              </div>
            </form>

            <hr style={{ margin: '36px 0', borderColor: '#e2ece7', borderStyle: 'solid' }} />

            <div className="settings-danger-zone">
              <div>
                <h3 style={{ fontSize: 16, margin: '0 0 6px', color: '#8c2626' }}>Session & Sign Out</h3>
                <p style={{ margin: 0, fontSize: 12, color: '#71817d' }}>
                  Log out of this session on this computer. You can sign back in anytime.
                </p>
              </div>
              <button
                type="button"
                className="outline-button"
                onClick={handleLogout}
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
