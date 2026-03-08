import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const TrueShootingCalculator = () => {
  const [activeTab, setActiveTab] = useState('ts')
  const [points, setPoints] = useState('')
  const [fga, setFga] = useState('')
  const [fta, setFta] = useState('')
  const [fgm, setFgm] = useState('')
  const [threePM, setThreePM] = useState('')
  const [efgFga, setEfgFga] = useState('')
  const [results, setResults] = useState(null)

  const trueShootingPct = (points, fga, fta) => {
    const tsa = fga + (0.44 * fta)
    if (tsa === 0) return 0
    return ((points / (2 * tsa)) * 100).toFixed(1)
  }

  const effectiveFieldGoalPct = (fgm, threePM, fga) => {
    if (fga === 0) return 0
    return (((fgm + (0.5 * threePM)) / fga) * 100).toFixed(1)
  }

  const getTSRating = (tsPercent) => {
    if (tsPercent >= 62) return { level: 'Elite', color: '#fbbf24' }
    if (tsPercent >= 58) return { level: 'Excellent', color: '#22c55e' }
    if (tsPercent >= 54) return { level: 'Above Average', color: '#14b8a6' }
    if (tsPercent >= 50) return { level: 'Average', color: '#3b82f6' }
    if (tsPercent >= 45) return { level: 'Below Average', color: '#eab308' }
    return { level: 'Poor', color: '#ef4444' }
  }

  const getEFGRating = (efgPercent) => {
    if (efgPercent >= 57) return { level: 'Elite', color: '#fbbf24' }
    if (efgPercent >= 53) return { level: 'Excellent', color: '#22c55e' }
    if (efgPercent >= 50) return { level: 'Above Average', color: '#14b8a6' }
    if (efgPercent >= 46) return { level: 'Average', color: '#3b82f6' }
    if (efgPercent >= 41) return { level: 'Below Average', color: '#eab308' }
    return { level: 'Poor', color: '#ef4444' }
  }

  const handleTSCalculate = (e) => {
    e.preventDefault()
    const pointsNum = parseFloat(points)
    const fgaNum = parseFloat(fga)
    const ftaNum = parseFloat(fta)

    if (pointsNum > 0 && fgaNum > 0 && ftaNum >= 0) {
      const tsPercent = trueShootingPct(pointsNum, fgaNum, ftaNum)
      const tsa = fgaNum + (0.44 * ftaNum)
      const pointsPerAttempt = pointsNum / tsa
      const rating = getTSRating(parseFloat(tsPercent))

      setResults({
        type: 'ts',
        tsPercent,
        tsa: tsa.toFixed(2),
        pointsPerAttempt: pointsPerAttempt.toFixed(2),
        rating
      })
    }
  }

  const handleEFGCalculate = (e) => {
    e.preventDefault()
    const fgmNum = parseFloat(fgm)
    const threePMNum = parseFloat(threePM)
    const fgaNum = parseFloat(efgFga)

    if (fgmNum > 0 && fgaNum > 0 && threePMNum >= 0) {
      const efgPercent = effectiveFieldGoalPct(fgmNum, threePMNum, fgaNum)
      const regularFG = ((fgmNum / fgaNum) * 100).toFixed(1)
      const difference = (efgPercent - regularFG).toFixed(1)
      const rating = getEFGRating(parseFloat(efgPercent))

      setResults({
        type: 'efg',
        efgPercent,
        regularFG,
        difference,
        rating
      })
    }
  }

  const applyPreset = (preset) => {
    if (activeTab === 'ts') {
      setPoints(preset.points.toString())
      setFga(preset.fga.toString())
      setFta(preset.fta.toString())
    } else {
      setFgm(preset.fgm.toString())
      setThreePM(preset.threePM.toString())
      setEfgFga(preset.fga.toString())
    }
  }

  const tsPresets = [
    { name: 'Elite Scorer', points: 30, fga: 20, fta: 8 },
    { name: 'Efficient Big', points: 18, fga: 10, fta: 6 },
    { name: 'Volume Scorer', points: 25, fga: 24, fta: 4 },
    { name: 'Free Throw Merchant', points: 20, fga: 10, fta: 12 }
  ]

  const efgPresets = [
    { name: '3PT Specialist', fgm: 6, threePM: 4, fga: 10 },
    { name: 'Interior Scorer', fgm: 8, threePM: 0, fga: 12 },
    { name: 'Balanced Guard', fgm: 9, threePM: 3, fga: 18 }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>True Shooting Percentage Calculator (TS%) — Basketball Stats | CalcLogic</title>
        <meta name="description" content="Free true shooting percentage calculator for basketball. Instantly calculate TS%, effective field goal percentage (eFG%), and scoring efficiency for any NBA, college, or recreational player." />
        <meta name="keywords" content="true shooting percentage calculator, TS% calculator, basketball efficiency calculator, eFG% calculator, effective field goal percentage, NBA stats calculator, basketball scoring efficiency" />
        <link rel="canonical" href="https://calclogic.com/sports/true-shooting-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="True Shooting Percentage Calculator (TS%) — Basketball Stats | CalcLogic" />
        <meta property="og:description" content="Free true shooting percentage calculator for basketball. Instantly calculate TS%, effective field goal percentage (eFG%), and scoring efficiency." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/true-shooting-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="True Shooting Percentage Calculator (TS%) — Free Basketball Stats | CalcLogic" />
        <meta name="twitter:description" content="Calculate TS% and eFG% for any basketball player instantly. Free, no signup required." />
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "True Shooting Percentage Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate True Shooting Percentage (TS%) and Effective Field Goal Percentage (eFG%) for any basketball player instantly."
          }`}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a good True Shooting Percentage in the NBA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The NBA league average True Shooting Percentage is typically between 55–57%. A TS% above 58% is considered above average, above 62% is elite, and above 65% at high scoring volume is historically exceptional. Players like Stephen Curry and Nikola Jokić regularly post TS% above 63%."
                }
              },
              {
                "@type": "Question",
                "name": "What does the 0.44 mean in the True Shooting formula?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The 0.44 factor converts free throw attempts into possession equivalents. Because most shooting fouls result in 2 free throws but only consume one offensive possession, and-one plays count differently, the factor 0.44 (rather than 0.5) gives a more accurate measure of how many possessions were used via free throws."
                }
              },
              {
                "@type": "Question",
                "name": "Is TS% or eFG% a better stat?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "True Shooting % (TS%) is the more complete stat because it includes free throw efficiency in addition to field goals. eFG% is useful for evaluating shooting skill from the field specifically, ignoring free throws. For overall scoring efficiency evaluation, TS% is the preferred metric among NBA analysts."
                }
              },
              {
                "@type": "Question",
                "name": "Can a player have a high TS% but be a bad player?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — TS% only measures scoring efficiency, not overall player value. A player who only takes easy shots near the basket might have a high TS% but contribute little else. TS% should be evaluated alongside scoring volume, usage rate, rebounding, defense, and playmaking to get a complete picture of a player's value."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate True Shooting Percentage by hand?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Use this formula: TS% = Points ÷ (2 × (FGA + 0.44 × FTA)). First calculate True Shooting Attempts: add your field goal attempts to 0.44 times your free throw attempts. Then divide your total points by 2 times that number. Multiply by 100 to express as a percentage."
                }
              },
              {
                "@type": "Question",
                "name": "Does True Shooting % work for college and recreational basketball?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — the TS% formula works for any level of basketball. However, the rating benchmarks differ. College players typically have lower TS% than NBA players due to lower shooting skill. For recreational basketball, a TS% above 50% is a solid benchmark for an efficient scorer."
                }
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>True Shooting Percentage Calculator (TS%)</h1>
          <p className="calculator-description">
            Calculate True Shooting Percentage (TS%) and Effective Field Goal Percentage (eFG%) for any basketball player. Includes NBA efficiency ratings and historical comparisons.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'ts' ? 'active' : ''}`}
            onClick={() => setActiveTab('ts')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'ts' ? '#2563eb' : 'transparent',
              color: activeTab === 'ts' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            True Shooting % (TS%)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'efg' ? 'active' : ''}`}
            onClick={() => setActiveTab('efg')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'efg' ? '#2563eb' : 'transparent',
              color: activeTab === 'efg' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Effective Field Goal % (eFG%)
          </button>
        </div>

        {/* Quick Fill Presets */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            Quick-Fill Presets
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {(activeTab === 'ts' ? tsPresets : efgPresets).map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyPreset(preset)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#ea580c'}
                onMouseOut={(e) => e.target.style.background = '#f97316'}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* TS% Tab */}
        {activeTab === 'ts' && (
          <form onSubmit={handleTSCalculate} className="calculator-form">
            <div className="input-section">
              <h2>True Shooting % Inputs</h2>
              <div className="input-group">
                <label htmlFor="points">Total Points Scored</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 28"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="fga">Field Goal Attempts (FGA)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="fga"
                    value={fga}
                    onChange={(e) => setFga(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 18"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="fta">Free Throw Attempts (FTA)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="fta"
                    value={fta}
                    onChange={(e) => setFta(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 6"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Calculate TS%</button>
          </form>
        )}

        {/* eFG% Tab */}
        {activeTab === 'efg' && (
          <form onSubmit={handleEFGCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Effective Field Goal % Inputs</h2>
              <div className="input-group">
                <label htmlFor="fgm">Field Goals Made (FGM)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="fgm"
                    value={fgm}
                    onChange={(e) => setFgm(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="Total 2PT + 3PT made"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="threePM">Three Pointers Made (3PM)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="threePM"
                    value={threePM}
                    onChange={(e) => setThreePM(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="efgFga">Field Goal Attempts (FGA)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="efgFga"
                    value={efgFga}
                    onChange={(e) => setEfgFga(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="Total attempts"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Calculate eFG%</button>
          </form>
        )}

        {/* Results Section */}
        {results && results.type === 'ts' && (
          <div className="results-section">
            <h2>True Shooting % Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="result-item">
                <span className="result-label">True Shooting Percentage</span>
                <span className="result-value" style={{ fontSize: '2rem', fontWeight: '700', color: results.rating.color }}>
                  {results.tsPercent}%
                </span>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: results.rating.color,
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem'
                }}>
                  {results.rating.level}
                </div>
              </div>
              <div className="result-item">
                <span className="result-label">True Shooting Attempts (TSA)</span>
                <span className="result-value">{results.tsa}</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  FGA + (0.44 × FTA) — your total shooting possessions used
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Points Per Shooting Attempt</span>
                <span className="result-value">{results.pointsPerAttempt}</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {results.pointsPerAttempt} points per shooting attempt
                </p>
              </div>
            </div>
          </div>
        )}

        {results && results.type === 'efg' && (
          <div className="results-section">
            <h2>Effective Field Goal % Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="result-item">
                <span className="result-label">Effective Field Goal Percentage</span>
                <span className="result-value" style={{ fontSize: '2rem', fontWeight: '700', color: results.rating.color }}>
                  {results.efgPercent}%
                </span>
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: results.rating.color,
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem'
                }}>
                  {results.rating.level}
                </div>
              </div>
              <div className="result-item">
                <span className="result-label">vs Regular Field Goal %</span>
                <span className="result-value">{results.regularFG}%</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  eFG% is {results.difference}% {parseFloat(results.difference) > 0 ? 'higher' : 'lower'} than regular FG% — the {parseFloat(results.difference) > 0 ? 'bonus' : 'penalty'} from 3-point shooting
                </p>
              </div>
            </div>
          </div>
        )}

        <ShareButtons 
          title="True Shooting Percentage Calculator (TS%)"
          url="https://calclogic.com/sports/true-shooting-calculator"
        />

        {/* Content Sections */}
        <div className="content-section">
          <h2>What is True Shooting Percentage (TS%)?</h2>
          <p>True Shooting Percentage (TS%) is the most comprehensive measure of a basketball player's scoring efficiency. Unlike basic field goal percentage, TS% accounts for all three ways a player can score — two-point field goals, three-point field goals, and free throws — giving a complete picture of how efficiently a player converts their shooting opportunities into points.</p>
          <p>Introduced by statistician John Hollinger, TS% has become a standard metric in NBA analytics, fantasy basketball, and player evaluation. A player with a high TS% scores more points per shooting attempt than a player with a low TS%, regardless of their scoring volume.</p>
          <p>The key insight of TS% is that not all scoring attempts are equal. A three-pointer worth 3 points is more valuable than a two-pointer on the same number of attempts. A player who draws fouls and converts free throws is more efficient than a player who takes the same number of field goal attempts without getting to the line. TS% captures all of this in a single number.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Calculate True Shooting Percentage</h2>
          <p>The True Shooting Percentage formula is:</p>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            <strong>TS% = Points ÷ (2 × True Shooting Attempts)</strong><br /><br />
            Where <strong>True Shooting Attempts (TSA) = FGA + (0.44 × FTA)</strong>
          </div>
          <p>The 0.44 multiplier accounts for the fact that free throws come in pairs — a shooting foul typically results in 2 free throw attempts but only counts as one scoring possession. The 0.44 factor (sometimes updated to 0.475 in modern usage) converts free throw attempts into possession equivalents.</p>
          
          <h3>Step-by-step example:</h3>
          <p>A player scores 28 points on 18 field goal attempts and 6 free throw attempts.</p>
          <ol style={{ lineHeight: '1.8', color: '#374151' }}>
            <li>TSA = 18 + (0.44 × 6) = 18 + 2.64 = <strong>20.64</strong></li>
            <li>TS% = 28 ÷ (2 × 20.64) = 28 ÷ 41.28 = <strong>0.678 = 67.8%</strong></li>
          </ol>
          <p>This player is performing at an elite efficiency level.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>What is Effective Field Goal Percentage (eFG%)?</h2>
          <p>Effective Field Goal Percentage (eFG%) adjusts regular field goal percentage to account for the added value of three-point shots. Since a made three-pointer is worth 50% more than a made two-pointer, eFG% gives extra credit for three-point makes.</p>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            <strong>eFG% = (FGM + 0.5 × 3PM) ÷ FGA</strong>
          </div>
          
          <h3>Example:</h3>
          <p>A player goes 9-for-18 from the field, including 3 three-pointers made.</p>
          <ul style={{ lineHeight: '1.8', color: '#374151' }}>
            <li>Regular FG% = 9 ÷ 18 = <strong>50.0%</strong></li>
            <li>eFG% = (9 + 0.5 × 3) ÷ 18 = 10.5 ÷ 18 = <strong>58.3%</strong></li>
          </ul>
          <p>The eFG% is higher because the three-pointers produced more value per attempt than two-pointers would have.</p>
          
          <p><strong>TS% vs eFG% — Key Difference:</strong> eFG% only accounts for field goals and ignores free throws entirely. TS% is the more complete metric because it includes free throw efficiency. Use eFG% to evaluate shooting skill from the field; use TS% to evaluate overall scoring efficiency including all possessions.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>True Shooting % Rating Scale — What is a Good TS%?</h2>
          <p>Use this table to evaluate any player's TS% or eFG%:</p>
          
          <h3>True Shooting % Rating Scale</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Rating</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>TS% Range</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>What It Means</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fef3c7' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#a16207', fontWeight: '600' }}>Elite</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>62% and above</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Top-tier scorer — among the best in the league</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Gold</td>
              </tr>
              <tr style={{ background: '#f0fdf4' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#166534', fontWeight: '600' }}>Excellent</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>58% – 61.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Highly efficient — above average NBA starter level</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Green</td>
              </tr>
              <tr style={{ background: '#f0fdfa' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#134e4a', fontWeight: '600' }}>Above Average</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>54% – 57.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Solid efficiency — reliable contributor</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Teal</td>
              </tr>
              <tr style={{ background: '#eff6ff' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#1e40af', fontWeight: '600' }}>Average</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>50% – 53.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>League average range for most NBA players</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td>
              </tr>
              <tr style={{ background: '#fefce8' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#713f12', fontWeight: '600' }}>Below Average</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>45% – 49.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Inefficient scoring — taking too many bad shots</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td>
              </tr>
              <tr style={{ background: '#fef2f2' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#991b1b', fontWeight: '600' }}>Poor</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 45%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Very inefficient — hurting the team's offense</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td>
              </tr>
            </tbody>
          </table>
          <p><em>Note: NBA league average TS% typically falls between 55–57% in modern seasons. College and recreational players generally have lower TS% due to lower shooting skill and fewer free throw opportunities.</em></p>

          <h3>Effective Field Goal % Rating Scale</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Rating</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>eFG% Range</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>What It Means</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fef3c7' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#a16207', fontWeight: '600' }}>Elite</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>57% and above</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Elite shot selection and/or three-point shooting</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Gold</td>
              </tr>
              <tr style={{ background: '#f0fdf4' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#166534', fontWeight: '600' }}>Excellent</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>53% – 56.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Above average shooting efficiency from the field</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Green</td>
              </tr>
              <tr style={{ background: '#f0fdfa' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#134e4a', fontWeight: '600' }}>Above Average</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>50% – 52.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Solid field goal efficiency</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Teal</td>
              </tr>
              <tr style={{ background: '#eff6ff' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#1e40af', fontWeight: '600' }}>Average</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>46% – 49.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>League average range</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td>
              </tr>
              <tr style={{ background: '#fefce8' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#713f12', fontWeight: '600' }}>Below Average</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>41% – 45.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below average shot efficiency</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td>
              </tr>
              <tr style={{ background: '#fef2f2' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#991b1b', fontWeight: '600' }}>Poor</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 41%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Poor shooting selection or execution</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td>
              </tr>
            </tbody>
          </table>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>TS% vs FG% vs eFG% — Which Stat Matters Most?</h2>
          <p>Traditional field goal percentage (FG%) is still the most commonly cited shooting stat, but it has two major blind spots: it treats two-pointers and three-pointers as equal, and it ignores free throws entirely. This makes it a poor measure of true scoring value.</p>
          <p>Here is how the three stats compare:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Stat</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Includes 2PT</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Includes 3PT (weighted)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Includes Free Throws</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Best Used For</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>FG%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>❌ (equal weight)</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>❌</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Basic shooting volume</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>eFG%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>❌</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Field goal efficiency only</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>TS%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Overall scoring efficiency</td>
              </tr>
            </tbody>
          </table>

          <p><strong>Real-world example — why FG% misleads:</strong></p>
          <ul style={{ lineHeight: '1.8', color: '#374151' }}>
            <li>Player A: 50% FG%, all two-pointers → scores 1.0 points per field goal attempt</li>
            <li>Player B: 40% FG%, all three-pointers → scores 1.2 points per field goal attempt</li>
          </ul>
          <p>Player A has the higher FG% but Player B is actually more efficient. eFG% (Player A: 50%, Player B: 60%) and TS% correctly identify Player B as the better scorer per possession.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Historical TS% — All-Time Great Seasons</h2>
          <p>Some of the most efficient scoring seasons in NBA history put the TS% scale in perspective. These performances represent the upper ceiling of what elite efficiency looks like:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Player</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Season</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Points Per Game</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>TS%</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>DeAndre Jordan</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2014–15</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>11.5</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>71.4%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Highest TS% in modern NBA era</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Rudy Gobert</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2018–19</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>15.9</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>69.5%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Elite rim finisher</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Kevin Durant</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2012–13</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>28.1</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>63.5%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Elite TS% at high volume</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Stephen Curry</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2015–16</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>30.1</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>66.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>MVP season, historic efficiency</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Nikola Jokić</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2021–22</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>27.1</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>65.6%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>MVP level all-around efficiency</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Shaquille O'Neal</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1999–00</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>29.7</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>63.9%</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Dominant interior efficiency</td>
              </tr>
            </tbody>
          </table>
          <p><em>Note: High-volume scorers (25+ PPG) who maintain TS% above 60% are considered historically exceptional.</em></p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Improve Your True Shooting Percentage</h2>
          <p>Whether you play recreational basketball or compete at a high level, these principles will raise your TS%:</p>
          
          <p><strong>1. Take higher-quality shots.</strong> The single biggest driver of TS% is shot selection. Contested mid-range jump shots are among the least efficient shots in basketball. Prioritize shots at the rim, open three-pointers, and free throw opportunities.</p>
          
          <p><strong>2. Get to the free throw line.</strong> Free throws are the most efficient scoring opportunity in basketball — you score without a defender contesting the shot. Players who attack the basket and draw fouls have a built-in TS% advantage.</p>
          
          <p><strong>3. Improve your three-point percentage.</strong> Even a modest three-point percentage (35%+) produces better eFG% than a 50% two-point shooter. If you can shoot threes consistently, taking more of them raises your efficiency.</p>
          
          <p><strong>4. Eliminate low-percentage attempts.</strong> Long two-pointers (16–22 feet) are statistically the worst shot in basketball. They're too far for high percentage finishing but not far enough to be worth three points. Reducing these shots alone can meaningfully improve TS%.</p>
          
          <p><strong>5. Improve free throw shooting.</strong> Players who draw fouls but shoot poorly from the line negate their advantage. Free throw improvement has a direct positive effect on TS%.</p>
        </div>

        {/* Related Calculators */}
        <div className="content-section">
          <h2>Related Calculators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="/sports/one-rep-max-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>1-Rep Max Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate your one-rep max for any lift using proven formulas</p>
            </a>
            <a href="/sports/batting-average-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>Batting Average Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate baseball batting average and other hitting stats</p>
            </a>
            <a href="/sports/fantasy-football-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>Fantasy Football Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate fantasy football points and draft values</p>
            </a>
            <a href="/sports/pace-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>Pace Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate running pace, speed, and time for distance goals</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrueShootingCalculator
