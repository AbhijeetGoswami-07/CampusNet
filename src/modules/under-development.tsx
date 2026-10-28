import { useState } from 'react'
import {
  Calculator,
  Compass,
  Filter,
  Layers,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Users
} from 'lucide-react'

interface UnderDevelopmentProps {
  moduleId: 'flatmates' | 'expense-estimator' | 'map'
  moduleNumber: string
  title: string
  subtitle: string
  go: (page: string) => void
}

export function UnderDevelopmentModule({
  moduleId,
  moduleNumber,
  title,
  subtitle,
  go
}: UnderDevelopmentProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')

  return (
    <section className="page-section blank-template-section">
      {/* Module 2: Flatmates Template */}
      {moduleId === 'flatmates' && (
        <div className="blank-template-page">
          <div className="blank-template-header">
            <div>
              <p className="eyebrow">{moduleNumber} · ROOMMATE COMPATIBILITY</p>
              <h1>{title}</h1>
              <p className="blank-template-sub">{subtitle}</p>
            </div>
            <div className="blank-template-actions">
              <button
                type="button"
                className="outline-button disabled-template-btn"
                title="Template option ready"
              >
                <Plus size={14} /> Post Roommate Requirement
                <span className="template-pill">Template</span>
              </button>
            </div>
          </div>

          {/* Options Bar - Ready options shown */}
          <div className="blank-options-bar">
            <div className="blank-option-group">
              <label>College Campus</label>
              <select disabled className="template-select" value="all">
                <option value="all">All Pune Colleges (COEP, MIT, Bharati...)</option>
              </select>
            </div>
            <div className="blank-option-group">
              <label>Gender Preference</label>
              <select disabled className="template-select" value="any">
                <option value="any">Any Gender</option>
                <option value="female">Women Only</option>
                <option value="male">Men Only</option>
              </select>
            </div>
            <div className="blank-option-group">
              <label>Dietary Habit</label>
              <select disabled className="template-select" value="any">
                <option value="any">Any Diet (Veg / Non-veg)</option>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
            <div className="blank-option-group">
              <label>Max Budget</label>
              <input
                type="text"
                disabled
                value="₹12,000 / mo"
                className="template-input"
              />
            </div>
            <button type="button" className="solid-button disabled-template-btn" style={{ height: 38 }}>
              <Search size={14} /> Search
            </button>
          </div>

          {/* Blank Screen / Template Wireframe */}
          <div className="blank-canvas">
            <div className="blank-canvas-banner">
              <div className="blank-status-badge">
                <span className="blank-dot" /> Template Ready · Functionality In Progress
              </div>
              <p>Options and page structure are staged. Active roommate profiles will display here once published.</p>
            </div>

            <div className="blank-cards-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="blank-card-skeleton">
                  <div className="skeleton-avatar" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line title" />
                    <div className="skeleton-line sub" />
                    <div className="skeleton-tags">
                      <span className="skeleton-tag" />
                      <span className="skeleton-tag" />
                      <span className="skeleton-tag" />
                    </div>
                  </div>
                  <div className="skeleton-btn" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Module 4: Expense Estimator Template */}
      {moduleId === 'expense-estimator' && (
        <div className="blank-template-page">
          <div className="blank-template-header">
            <div>
              <p className="eyebrow">{moduleNumber} · LIVING EXPENSES</p>
              <h1>{title}</h1>
              <p className="blank-template-sub">{subtitle}</p>
            </div>
            <div className="blank-template-actions">
              <button
                type="button"
                className="outline-button disabled-template-btn"
                title="Template option ready"
              >
                <Calculator size={14} /> Export Cost Report
                <span className="template-pill">Template</span>
              </button>
            </div>
          </div>

          {/* Options Bar - Ready options shown */}
          <div className="blank-options-bar">
            <div className="blank-presets">
              <span className="preset-label">Budget Presets:</span>
              <button type="button" className="preset-btn active" disabled>Budget</button>
              <button type="button" className="preset-btn" disabled>Mid-Range</button>
              <button type="button" className="preset-btn" disabled>Comfort</button>
              <button type="button" className="preset-btn" disabled>Custom</button>
            </div>
            <div className="blank-option-group" style={{ marginLeft: 'auto' }}>
              <label>Target Locality</label>
              <select disabled className="template-select" value="kothrud">
                <option value="kothrud">Kothrud, Pune</option>
              </select>
            </div>
          </div>

          {/* Blank Screen / Expense Template Wireframe */}
          <div className="blank-canvas blank-expense-layout">
            <div className="blank-expense-left">
              <div className="blank-status-badge" style={{ marginBottom: 16 }}>
                <span className="blank-dot" /> Template Ready · Calculation Model In Progress
              </div>
              {[
                'Monthly Room Rent / PG Spot',
                'Food Mess & Daily Tiffin Service',
                'PMPML Bus & Pune Metro Commute',
                'Electricity, Water & LPG Charges',
                'Wi-Fi & High Speed Internet',
                'Laundry & Personal Contingency'
              ].map((label) => (
                <div key={label} className="blank-slider-row">
                  <div className="blank-slider-info">
                    <span className="blank-slider-label">{label}</span>
                    <span className="blank-slider-val">₹ --,---</span>
                  </div>
                  <div className="blank-slider-track" />
                </div>
              ))}
            </div>

            <div className="blank-expense-right">
              <div className="blank-summary-card">
                <span className="summary-title">ESTIMATED RECURRING MONTHLY TOTAL</span>
                <div className="blank-total-display">
                  ₹ --,--- <small>/ month</small>
                </div>
                <div className="blank-donut-placeholder">
                  <div className="donut-circle" />
                  <div className="donut-text">Template Staged</div>
                </div>
                <p className="summary-note">
                  All sliders, formulas, and Pune campus expenditure baselines are staged. Computation is currently non-functional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module 5: Map Radar Template */}
      {moduleId === 'map' && (
        <div className="blank-template-page">
          <div className="blank-template-header">
            <div>
              <p className="eyebrow">{moduleNumber} · GIS CAMPUS RADAR</p>
              <h1>{title}</h1>
              <p className="blank-template-sub">{subtitle}</p>
            </div>
            <div className="blank-template-actions">
              <button
                type="button"
                className="outline-button disabled-template-btn"
                title="Template option ready"
              >
                <Compass size={14} /> Recenter College
                <span className="template-pill">Template</span>
              </button>
            </div>
          </div>

          {/* Options Bar - Ready options shown */}
          <div className="blank-options-bar">
            <div className="blank-option-group" style={{ flex: 1 }}>
              <label>Search Locality or College</label>
              <div className="template-search-box">
                <Search size={14} />
                <input
                  type="text"
                  disabled
                  placeholder="e.g. COEP Shivajinagar, Kothrud, Viman Nagar..."
                  className="template-input"
                />
              </div>
            </div>
            <div className="blank-option-group">
              <label>Radar Layers</label>
              <div className="template-layers">
                <label><input type="checkbox" defaultChecked disabled /> Hostels</label>
                <label><input type="checkbox" defaultChecked disabled /> Colleges</label>
                <label><input type="checkbox" defaultChecked disabled /> Messes</label>
              </div>
            </div>
          </div>

          {/* Blank Screen / Map Radar Canvas */}
          <div className="blank-canvas blank-map-canvas">
            <div className="blank-map-grid">
              <div className="blank-radar-reticle">
                <div className="radar-circle radar-outer" />
                <div className="radar-circle radar-mid" />
                <div className="radar-circle radar-inner" />
                <div className="radar-crosshair-h" />
                <div className="radar-crosshair-v" />
                <Compass size={32} className="radar-center-icon" />
              </div>
              <div className="blank-map-overlay">
                <div className="blank-status-badge">
                  <span className="blank-dot" /> Map Template Ready · Vector GIS Tiles In Progress
                </div>
                <p className="blank-coords">Coordinates: 18.5204° N, 73.8567° E · Pune Metro Region</p>
                <small>Map viewport, layer toggles, and radius radar are staged. Live tile rendering is currently non-functional.</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
