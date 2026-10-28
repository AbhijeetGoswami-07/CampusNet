import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Hammer,
  Mail,
  Sparkles,
  Zap
} from 'lucide-react'

interface UnderDevelopmentProps {
  moduleId: 'flatmates' | 'expense-estimator' | 'map'
  moduleNumber: string
  title: string
  subtitle: string
  go: (page: string) => void
}

const MODULE_DATA: Record<
  'flatmates' | 'expense-estimator' | 'map',
  {
    tag: string
    description: string
    progress: number
    eta: string
    tasks: { text: string; status: 'done' | 'doing' | 'queue' }[]
  }
> = {
  flatmates: {
    tag: 'STUDENT COMPATIBILITY ALGORITHM',
    description:
      'Our team is actively engineering the Pune student flatmate matching network. This system analyzes college proximity, dietary habits (veg/non-veg), sleep schedules, and budget compatibility.',
    progress: 81,
    eta: 'Next Semester Release (v2.2)',
    tasks: [
      { text: 'College and campus radius filter architecture', status: 'done' },
      { text: 'Dietary, cleanliness, and lifestyle score indexing', status: 'done' },
      { text: 'Verified student ID privacy encryption layer', status: 'doing' },
      { text: 'Direct secure roommate chat and request invitations', status: 'queue' }
    ]
  },
  'expense-estimator': {
    tag: 'CAMPUS LIVING COST ENGINE',
    description:
      'We are calibrating hyper-local Pune student expenditure datasets covering realistic monthly rent, tiffin subscriptions, Metro/PMPML bus travel, and electricity inflation across Shivajinagar, Kothrud, and Alandi.',
    progress: 86,
    eta: 'Next Semester Release (v2.2)',
    tasks: [
      { text: 'Room rent, PG and flat deposit slider engine', status: 'done' },
      { text: 'Pune campus mess and daily tiffin expenditure baselines', status: 'done' },
      { text: 'PMPML student pass and Metro fare integration', status: 'doing' },
      { text: 'Multi-flatmate monthly expense split generator', status: 'queue' }
    ]
  },
  map: {
    tag: 'HIGH-PRECISION GIS CAMPUS RADAR',
    description:
      'Engineering high-density multi-layer GIS maps for Pune with interactive walking routes, DMart/JioMart grocery distance matrix, and 4.5 km college perimeter radar.',
    progress: 89,
    eta: 'Next Semester Release (v2.2)',
    tasks: [
      { text: 'OpenStreetMap vector tile rendering engine', status: 'done' },
      { text: 'College campus coordinates & verified 4.5 km radius circles', status: 'done' },
      { text: 'Live transit and essential service route visualizer', status: 'doing' },
      { text: 'Real-time walking commute time calculator to college gates', status: 'queue' }
    ]
  }
}

export function UnderDevelopmentModule({
  moduleId,
  moduleNumber,
  title,
  subtitle,
  go
}: UnderDevelopmentProps) {
  const data = MODULE_DATA[moduleId]
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(() => {
    try {
      const saved = localStorage.getItem(`campusnet_notify_${moduleId}`)
      return Boolean(saved)
    } catch {
      return false
    }
  })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    try {
      localStorage.setItem(`campusnet_notify_${moduleId}`, email)
      setSubscribed(true)
    } catch {}
  }

  return (
    <section className="page-section under-dev-container">
      {/* Top Banner */}
      <div className="under-dev-hero">
        <div className="under-dev-badge-row">
          <span className="under-dev-pill">
            <Hammer size={13} className="spin-slow" /> {moduleNumber} · UNDER ACTIVE DEVELOPMENT
          </span>
          <span className="under-dev-pulse-tag">
            <span className="pulse-dot" /> LIVE SPRINT IN PROGRESS
          </span>
        </div>

        <h1>{title}</h1>
        <p className="under-dev-lead">{subtitle}</p>
        <p className="under-dev-desc">{data.description}</p>

        {/* Progress Bar */}
        <div className="under-dev-progress-box">
          <div className="progress-header">
            <span>
              <strong>Development Progress:</strong> {data.progress}% Completed
            </span>
            <span className="eta-badge">
              <Clock size={13} /> Target Release: {data.eta}
            </span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="under-dev-layout">
        {/* Task Roadmap Card */}
        <div className="under-dev-card">
          <div className="card-header-row">
            <Zap size={18} color="var(--coral)" />
            <h3>Feature Engineering Roadmap</h3>
          </div>
          <ul className="dev-task-list">
            {data.tasks.map((task, i) => (
              <li key={i} className={`dev-task-item task-${task.status}`}>
                {task.status === 'done' && (
                  <CheckCircle2 size={16} className="task-icon done" />
                )}
                {task.status === 'doing' && (
                  <div className="task-spinner" title="Currently being coded" />
                )}
                {task.status === 'queue' && (
                  <Clock size={16} className="task-icon queue" />
                )}
                <span className="task-title">{task.text}</span>
                <span className="task-state-tag">
                  {task.status === 'done'
                    ? 'Completed'
                    : task.status === 'doing'
                    ? 'In Progress'
                    : 'Scheduled'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Early Access Card */}
        <div className="under-dev-card early-access-card">
          <div className="card-header-row">
            <Sparkles size={18} color="var(--coral)" />
            <h3>Get Early Access</h3>
          </div>
          <p>
            Be the first Pune college student to test <strong>{title}</strong> before public release.
          </p>

          {subscribed ? (
            <div className="subscribed-banner">
              <CheckCircle2 size={18} />
              <div>
                <strong>You're on the VIP waitlist!</strong>
                <p>We'll notify your email the moment this module goes live.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student email..."
                  required
                />
              </div>
              <button type="submit" className="solid-button" style={{ width: '100%', marginTop: 10 }}>
                Request Early Access <ArrowRight size={15} />
              </button>
            </form>
          )}

          <div className="under-dev-cta-box">
            <p>Looking for verified housing right now?</p>
            <button className="outline-button" onClick={() => go('search')}>
              <Compass size={15} /> Browse Verified PGs & Flats
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
