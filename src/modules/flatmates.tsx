import { useState } from 'react'
import { MapPin, Heart, MessageCircle, Filter, X, GraduationCap, Moon, Sun, Clock, Utensils, Sparkles, CheckCircle2 } from 'lucide-react'
import { flatmateProfiles, type FlatmateProfile } from '../data-pune'

function FlatmateCard({
  profile,
  onConnect,
  isSaved,
  onToggleSave
}: {
  profile: FlatmateProfile;
  onConnect: (p: FlatmateProfile) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}) {
  return (
    <article className="flatmate-card">
      <div className="flatmate-card-header">
        <img src={profile.avatar} alt={profile.name} className="flatmate-avatar" />
        <div className="flatmate-identity">
          <h3>{profile.name}</h3>
          <p className="flatmate-college"><GraduationCap size={13} /> {profile.college}</p>
          <p className="flatmate-course">{profile.course} · Year {profile.year}</p>
        </div>
        <span className="flatmate-budget">
          ₹{profile.budget.toLocaleString('en-IN')}
          <small>/mo</small>
        </span>
      </div>

      <div className="flatmate-tags">
        <span className={`tag tag-gender tag-${profile.gender.toLowerCase()}`}>{profile.gender}</span>
        <span className="tag tag-diet"><Utensils size={11} /> {profile.diet}</span>
        <span className="tag tag-sleep">
          {profile.sleepTime.includes('Early') ? <Sun size={11} /> : profile.sleepTime.includes('Night') ? <Moon size={11} /> : <Clock size={11} />}
          {' '}{profile.sleepTime.split(' (')[0]}
        </span>
        <span className="tag tag-clean"><Sparkles size={11} /> {profile.cleanliness}</span>
      </div>

      <div className="flatmate-locality">
        <MapPin size={13} /> {profile.locality}, Pune · Move-in: <strong>{profile.moveInDate}</strong>
      </div>

      <p className="flatmate-bio">{profile.lookingFor}</p>

      <div className="flatmate-hobbies">
        {profile.hobbies.map(h => (
          <span key={h} className="hobby-tag">#{h}</span>
        ))}
      </div>

      <div className="flatmate-actions">
        <button
          className={`outline-button flatmate-save ${isSaved ? 'flatmate-saved' : ''}`}
          onClick={() => onToggleSave(profile.id)}
          aria-label={isSaved ? 'Unsave profile' : 'Save profile'}
        >
          <Heart size={15} fill={isSaved ? '#e67555' : 'none'} color={isSaved ? '#e67555' : 'currentColor'} />
        </button>
        <button className="solid-button flatmate-connect" onClick={() => onConnect(profile)}>
          <MessageCircle size={15} /> Connect
        </button>
      </div>
    </article>
  )
}

function ConnectModal({ profile, onClose }: { profile: FlatmateProfile; onClose: () => void }) {
  const [msg, setMsg] = useState(
    `Hi ${profile.name}! I noticed you're studying at ${profile.college} and looking for a place in ${profile.locality}. I have a similar budget (~₹${profile.budget}) and routine. Would love to explore options together!`
  )
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="component-overlay">
        <div className="component-modal" role="dialog" aria-modal="true">
          <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <CheckCircle2 size={46} color="#4a9e7d" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: 22, margin: '0 0 8px' }}>Connection Sent!</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px', lineHeight: 1.5 }}>
              Your message has been delivered to <strong>{profile.name}</strong>. You'll receive their reply directly via email/SMS.
            </p>
            <button className="solid-button" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="component-overlay">
      <div className="component-modal" role="dialog" aria-modal="true">
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <p className="eyebrow">FLATMATE CONNECT</p>
        <h2 style={{ fontSize: 20, margin: '4px 0 6px' }}>Send invitation to {profile.name}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 16px' }}>
          {profile.college} · {profile.locality}, Pune · Budget: ₹{profile.budget.toLocaleString('en-IN')}/mo
        </p>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
          Your Phone / WhatsApp
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--line)', marginTop: 4, fontSize: 13, borderRadius: 3 }}
          />
        </label>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginTop: 12, marginBottom: 4 }}>
          Message
          <textarea
            aria-label="Message"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            style={{ width: '100%', minHeight: 90, padding: 10, border: '1px solid var(--line)', marginTop: 4, borderRadius: 3, resize: 'vertical', fontSize: 13, fontFamily: 'inherit' }}
          />
        </label>
        <button
          className="solid-button wide-button"
          style={{ marginTop: 16 }}
          onClick={() => setSent(true)}
        >
          Send Connect Request
        </button>
      </div>
    </div>
  )
}

export function FlatmateMatchingPage() {
  const [genderFilter, setGenderFilter] = useState<string>('Any')
  const [dietFilter, setDietFilter] = useState<string>('Any')
  const [maxBudget, setMaxBudget] = useState(20000)
  const [localityFilter, setLocalityFilter] = useState('')
  const [connecting, setConnecting] = useState<FlatmateProfile | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const filtered = flatmateProfiles.filter(p => {
    if (genderFilter !== 'Any' && p.gender !== genderFilter) return false
    if (dietFilter !== 'Any' && p.diet !== dietFilter) return false
    if (p.budget > maxBudget) return false
    if (localityFilter.trim() && !p.locality.toLowerCase().includes(localityFilter.toLowerCase().trim())) return false
    return true
  })

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODULE 2 · FLATMATE MATCHING</p>
          <h1>Find verified flatmates across Pune</h1>
          <p>{filtered.length} active student profiles in Kothrud, Shivajinagar, Baner, Viman Nagar & beyond.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="outline-button" onClick={() => setShowFilters(f => !f)}>
            <Filter size={15} /> {showFilters ? 'Hide filters' : 'Refine filters'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flatmate-filters">
          <label>
            Gender Preference
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option>Any</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </label>
          <label>
            Dietary Habit
            <select value={dietFilter} onChange={e => setDietFilter(e.target.value)}>
              <option>Any</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
            </select>
          </label>
          <label>
            Max Rent Budget: ₹{maxBudget.toLocaleString('en-IN')}/mo
            <input
              type="range"
              min={6000}
              max={20000}
              step={500}
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
            />
          </label>
          <label>
            Pune Locality
            <input
              type="text"
              placeholder="e.g. Kothrud, Viman Nagar"
              value={localityFilter}
              onChange={e => setLocalityFilter(e.target.value)}
            />
          </label>
          {(genderFilter !== 'Any' || dietFilter !== 'Any' || maxBudget < 20000 || localityFilter) && (
            <button
              className="text-action"
              style={{ alignSelf: 'flex-end', marginBottom: 6 }}
              onClick={() => {
                setGenderFilter('Any')
                setDietFilter('Any')
                setMaxBudget(20000)
                setLocalityFilter('')
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      )}

      <div className="flatmate-grid">
        {filtered.length ? (
          filtered.map(p => (
            <FlatmateCard
              key={p.id}
              profile={p}
              onConnect={setConnecting}
              isSaved={savedIds.includes(p.id)}
              onToggleSave={toggleSave}
            />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <Heart size={32} />
            <h3>No profiles match your filter criteria</h3>
            <p>Try broadening your budget or resetting locality filters to discover flatmates.</p>
          </div>
        )}
      </div>

      {connecting && <ConnectModal profile={connecting} onClose={() => setConnecting(null)} />}
    </section>
  )
}
