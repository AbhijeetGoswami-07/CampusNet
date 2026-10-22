import { useState, useMemo } from 'react'
import { TrendingDown, Info, RotateCcw } from 'lucide-react'

type ExpenseItem = {
  label: string;
  key: keyof Expenses;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  tip: string;
}

type Expenses = {
  rent: number;
  food: number;
  travel: number;
  electricity: number;
  internet: number;
  laundry: number;
  misc: number;
}

const PRESETS: Record<'budget' | 'midrange' | 'premium', Expenses> = {
  budget: { rent: 7000, food: 1800, travel: 600, electricity: 400, internet: 300, laundry: 300, misc: 600 },
  midrange: { rent: 10500, food: 2500, travel: 1000, electricity: 600, internet: 400, laundry: 500, misc: 1200 },
  premium: { rent: 15000, food: 3500, travel: 1500, electricity: 900, internet: 500, laundry: 800, misc: 2200 }
}

export function ExpenseEstimatorPage() {
  const [activePreset, setActivePreset] = useState<'budget' | 'midrange' | 'premium' | 'custom'>('midrange')
  const [expenses, setExpenses] = useState<Expenses>(PRESETS.midrange)

  const items: ExpenseItem[] = [
    {
      label: 'Room Rent / PG',
      key: 'rent',
      value: expenses.rent,
      min: 3000,
      max: 25000,
      step: 500,
      color: '#e67555',
      tip: 'Sharing a 2BHK in Kothrud or Baner with 2 flatmates typically reduces rent to ₹7,000–9,000/person.'
    },
    {
      label: 'Food & Mess Subscription',
      key: 'food',
      value: expenses.food,
      min: 0,
      max: 7000,
      step: 100,
      color: '#4a9e7d',
      tip: 'Monthly student mess or tiffin services near FC Road and Kothrud average ₹1,800–2,500/month.'
    },
    {
      label: 'Commute & Travel',
      key: 'travel',
      value: expenses.travel,
      min: 0,
      max: 4000,
      step: 100,
      color: '#5b8fcf',
      tip: 'A student PMPML bus pass or Pune Metro pass costs ~₹500/month. Staying <2km from campus saves taxi fare.'
    },
    {
      label: 'Electricity & Utilities',
      key: 'electricity',
      value: expenses.electricity,
      min: 0,
      max: 2500,
      step: 50,
      color: '#f59e0b',
      tip: 'Most PGs include electricity. If renting a flat, AC usage in summer will increase this by ₹500–800.'
    },
    {
      label: 'High-speed Internet / Wi-Fi',
      key: 'internet',
      value: expenses.internet,
      min: 0,
      max: 1500,
      step: 50,
      color: '#8b5cf6',
      tip: 'Split a ₹799/month fiber broadband plan among 3 flatmates to pay only ~₹270 each.'
    },
    {
      label: 'Laundry & Dry Cleaning',
      key: 'laundry',
      value: expenses.laundry,
      min: 0,
      max: 1500,
      step: 50,
      color: '#06b6d4',
      tip: 'Self-service washing in your hostel saves ~₹300/mo over per-kg professional laundry services.'
    },
    {
      label: 'Personal & Miscellaneous',
      key: 'misc',
      value: expenses.misc,
      min: 0,
      max: 6000,
      step: 100,
      color: '#ec4899',
      tip: 'Keep a ₹1,000 emergency buffer for stationery, outings on FC Road, and daily essentials.'
    }
  ]

  const total = useMemo(() => Object.values(expenses).reduce((a, b) => a + b, 0), [expenses])

  const setVal = (key: keyof Expenses, value: number) => {
    setActivePreset('custom')
    setExpenses(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset: 'budget' | 'midrange' | 'premium') => {
    setActivePreset(preset)
    setExpenses(PRESETS[preset])
  }

  // SVG Pie chart calculation
  const renderPieChart = () => {
    let cumulative = 0
    const radius = 80
    const cx = 100
    const cy = 100
    const slices = items.map(item => {
      const pct = total > 0 ? item.value / total : 0
      const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
      cumulative += pct
      const endAngle = cumulative * 2 * Math.PI - Math.PI / 2
      const x1 = cx + radius * Math.cos(startAngle)
      const y1 = cy + radius * Math.sin(startAngle)
      const x2 = cx + radius * Math.cos(endAngle)
      const y2 = cy + radius * Math.sin(endAngle)
      const largeArc = pct > 0.5 ? 1 : 0
      return {
        ...item,
        pct,
        path: pct > 0.001 ? `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z` : ''
      }
    })

    return (
      <svg viewBox="0 0 200 200" className="expense-pie" aria-label="Monthly expense distribution chart">
        {slices.map(s => s.path ? (
          <path key={s.key} d={s.path} fill={s.color} stroke="#fff" strokeWidth={2}>
            <title>{s.label}: ₹{s.value} ({Math.round(s.pct * 100)}%)</title>
          </path>
        ) : null)}
        <circle cx={cx} cy={cy} r={46} fill="#ffffff" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={10} fill="#70817d" fontWeight="600">ESTIMATED</text>
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize={14} fill="#183d3b" fontWeight="700">
          ₹{total.toLocaleString('en-IN')}
        </text>
      </svg>
    )
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODULE 4 · MONTHLY EXPENSE ESTIMATION</p>
          <h1>Plan your real cost of living in Pune</h1>
          <p>Fine-tune each recurring cost slider to calculate your accurate monthly living budget.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="outline-button"
            onClick={() => applyPreset('midrange')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="expense-presets">
        <span>Quick Pune Student Presets:</span>
        <button
          className={`outline-button ${activePreset === 'budget' ? 'preset-active' : ''}`}
          onClick={() => applyPreset('budget')}
        >
          🎒 Budget (Shared PG) · ~₹11,000/mo
        </button>
        <button
          className={`outline-button ${activePreset === 'midrange' ? 'preset-active' : ''}`}
          onClick={() => applyPreset('midrange')}
        >
          🏠 Balanced (Private Room) · ~₹16,700/mo
        </button>
        <button
          className={`outline-button ${activePreset === 'premium' ? 'preset-active' : ''}`}
          onClick={() => applyPreset('premium')}
        >
          ✨ Comfort (Furnished Flat) · ~₹24,400/mo
        </button>
      </div>

      <div className="expense-layout">
        <div className="expense-sliders">
          {items.map(item => (
            <div key={item.key} className="expense-row">
              <div className="expense-label-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="expense-dot" style={{ background: item.color }} />
                  {item.label}
                </span>
                <strong style={{ fontSize: 16 }}>₹{item.value.toLocaleString('en-IN')}</strong>
              </div>
              <input
                type="range"
                min={item.min}
                max={item.max}
                step={item.step}
                value={item.value}
                onChange={e => setVal(item.key, Number(e.target.value))}
                className="expense-slider"
                style={{ accentColor: item.color }}
              />
              <p className="expense-tip">
                <TrendingDown size={13} style={{ flexShrink: 0, marginTop: 2, color: 'var(--coral)' }} />
                <span>{item.tip}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="expense-summary">
          <h3 style={{ fontSize: 18, margin: '0 0 16px', letterSpacing: '-0.3px' }}>Expense Breakdown</h3>
          {renderPieChart()}
          <div className="expense-legend">
            {items.map(item => (
              <div key={item.key} className="legend-row">
                <span className="expense-dot" style={{ background: item.color }} />
                <span>{item.label}</span>
                <span>{total > 0 ? Math.round(item.value / total * 100) : 0}%</span>
                <strong>₹{item.value.toLocaleString('en-IN')}</strong>
              </div>
            ))}
            <div className="legend-total">
              <span>Total Monthly Commitment</span>
              <strong style={{ color: 'var(--coral)', fontSize: 18 }}>₹{total.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="expense-info">
            <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              <strong>Pune Campus Benchmark:</strong> Engineering and management students in areas like Shivajinagar, Kothrud and Viman Nagar typically spend between ₹12,000 and ₹18,000 monthly.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
