import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const NetRunRateCalculator = () => {
  const [activeTab, setActiveTab] = useState('single')
  const [results, setResults] = useState(null)

  // Single Match State
  const [runsScored, setRunsScored] = useState('')
  const [oversFaced, setOversFaced] = useState('')
  const [isAllOut, setIsAllOut] = useState(false)
  const [runsConceded, setRunsConceded] = useState('')
  const [oversBowled, setOversBowled] = useState('')
  const [oppAllOut, setOppAllOut] = useState(false)
  const [format, setFormat] = useState('T20')

  // Tournament State
  const [matches, setMatches] = useState([
    { id: 1, runsScored: '', oversFaced: '', isAllOut: false, runsConceded: '', oversBowled: '', oppAllOut: false, format: 'T20' }
  ])
  const [tournamentFormat, setTournamentFormat] = useState('T20')
  const [tournamentResults, setTournamentResults] = useState(null)

  // Required NRR State
  const [currentNRR, setCurrentNRR] = useState('')
  const [matchesPlayed, setMatchesPlayed] = useState('')
  const [totalRunsFor, setTotalRunsFor] = useState('')
  const [totalOversFaced, setTotalOversFaced] = useState('')
  const [totalRunsAgainst, setTotalRunsAgainst] = useState('')
  const [totalOversBowled, setTotalOversBowled] = useState('')
  const [targetNRR, setTargetNRR] = useState('')
  const [nextMatchFormat, setNextMatchFormat] = useState('T20')
  const [expectedScore, setExpectedScore] = useState('')
  const [requiredResults, setRequiredResults] = useState(null)

  const formatOvers = {
    'T20': 20,
    'ODI': 50,
    'T10': 10,
    'Custom': 20
  }

  const parseOvers = (overs) => {
    const parts = overs.toString().split('.')
    const fullOvers = parseInt(parts[0]) || 0
    const balls = parts[1] ? parseInt(parts[1]) : 0
    return fullOvers + (balls / 6)
  }

  const getEffectiveOvers = (actualOvers, isAllOut, formatOvers) => {
    if (isAllOut) {
      return formatOvers
    }
    return actualOvers
  }

  const matchNRR = (runsScored, oversFaced, isAllOut, runsConced, oversBowled, oppAllOut, formatOvers) => {
    const effectiveOversFaced = getEffectiveOvers(parseOvers(oversFaced), isAllOut, formatOvers)
    const effectiveOversBowled = getEffectiveOvers(parseOvers(oversBowled), oppAllOut, formatOvers)

    const runRateFor = runsScored / effectiveOversFaced
    const runRateAgainst = runsConced / effectiveOversBowled

    return (runRateFor - runRateAgainst).toFixed(3)
  }

  const tournamentNRR = (matches, formatOvers) => {
    let totalRunsScored = 0
    let totalOversFacedSum = 0
    let totalRunsConceded = 0
    let totalOversBowledSum = 0

    matches.forEach(match => {
      if (match.runsScored && match.runsConceded && match.oversFaced && match.oversBowled) {
        totalRunsScored += parseInt(match.runsScored)
        totalRunsConceded += parseInt(match.runsConceded)

        totalOversFacedSum += getEffectiveOvers(
          parseOvers(match.oversFaced),
          match.isAllOut,
          formatOvers
        )
        totalOversBowledSum += getEffectiveOvers(
          parseOvers(match.oversBowled),
          match.oppAllOut,
          formatOvers
        )
      }
    })

    if (totalOversFacedSum === 0 || totalOversBowledSum === 0) return 0

    const overallRunRateFor = totalRunsScored / totalOversFacedSum
    const overallRunRateAgainst = totalRunsConceded / totalOversBowledSum

    return (overallRunRateFor - overallRunRateAgainst).toFixed(3)
  }

  const requiredNRR = (totalRunsFor, totalOversFaced, totalRunsAgainst, totalOversBowled, targetNRR, nextMatchOvers, expectedScore) => {
    const newOversFaced = totalOversFaced + nextMatchOvers
    const newRunsFor = totalRunsFor + expectedScore
    const newOversBowled = totalOversBowled + nextMatchOvers

    const requiredRunRate = (newRunsFor / newOversFaced) - targetNRR
    const maxRunsAllowed = requiredRunRate * newOversBowled
    const runsToAllow = maxRunsAllowed - totalRunsAgainst

    return {
      maxRunsAllowed: Math.floor(runsToAllow),
      requiredRunRate: requiredRunRate.toFixed(2)
    }
  }

  const handleSingleMatchCalculate = (e) => {
    e.preventDefault()
    
    const runsScoredNum = parseFloat(runsScored)
    const oversFacedNum = parseFloat(oversFaced)
    const runsConcedNum = parseFloat(runsConceded)
    const oversBowledNum = parseFloat(oversBowled)
    const formatOversNum = formatOvers[format]

    if (runsScoredNum >= 0 && oversFacedNum > 0 && runsConcedNum >= 0 && oversBowledNum > 0) {
      const nrr = matchNRR(runsScoredNum, oversFacedNum, isAllOut, runsConcedNum, oversBowledNum, oppAllOut, formatOversNum)
      const effectiveOversFaced = getEffectiveOvers(parseOvers(oversFacedNum), isAllOut, formatOversNum)
      const effectiveOversBowled = getEffectiveOvers(parseOvers(oversBowledNum), oppAllOut, formatOversNum)
      
      const yourRunRate = (runsScoredNum / effectiveOversFaced).toFixed(2)
      const oppRunRate = (runsConcedNum / effectiveOversBowled).toFixed(2)
      
      let result = 'Tied'
      if (runsScoredNum > runsConcedNum) result = 'Won'
      else if (runsScoredNum < runsConcedNum) result = 'Lost'

      setResults({
        type: 'single',
        nrr: parseFloat(nrr),
        yourRunRate,
        oppRunRate,
        result
      })
    }
  }

  const handleTournamentCalculate = (e) => {
    e.preventDefault()
    
    const validMatches = matches.filter(match => 
      match.runsScored && match.runsConceded && match.oversFaced && match.oversBowled
    )
    
    if (validMatches.length > 0) {
      const overallNRR = tournamentNRR(validMatches, formatOvers[tournamentFormat])
      
      const matchResults = validMatches.map(match => {
        const matchNRR = matchNRR(
          parseInt(match.runsScored), match.oversFaced, match.isAllOut,
          parseInt(match.runsConceded), match.oversBowled, match.oppAllOut,
          formatOvers[tournamentFormat]
        )
        return {
          ...match,
          matchNRR,
          effectiveOversFaced: getEffectiveOvers(parseOvers(match.oversFaced), match.isAllOut, formatOvers[tournamentFormat]),
          effectiveOversBowled: getEffectiveOvers(parseOvers(match.oversBowled), match.oppAllOut, formatOvers[tournamentFormat])
        }
      })

      setTournamentResults({
        overallNRR: parseFloat(overallNRR),
        matches: matchResults
      })
    }
  }

  const handleRequiredCalculate = (e) => {
    e.preventDefault()
    
    const currentNRRNum = parseFloat(currentNRR)
    const matchesPlayedNum = parseInt(matchesPlayed)
    const totalRunsForNum = parseFloat(totalRunsFor)
    const totalOversFacedNum = parseFloat(totalOversFaced)
    const totalRunsAgainstNum = parseFloat(totalRunsAgainst)
    const totalOversBowledNum = parseFloat(totalOversBowled)
    const targetNRRNum = parseFloat(targetNRR)
    const expectedScoreNum = parseFloat(expectedScore)
    const nextMatchOversNum = formatOvers[nextMatchFormat]

    if (currentNRRNum !== null && matchesPlayedNum > 0 && totalRunsForNum >= 0 && totalOversFacedNum > 0 && 
        totalRunsAgainstNum >= 0 && totalOversBowledNum > 0 && targetNRRNum !== null && expectedScoreNum > 0) {
      
      const result = requiredNRR(
        totalRunsForNum, totalOversFacedNum,
        totalRunsAgainstNum, totalOversBowledNum,
        targetNRRNum, nextMatchOversNum, expectedScoreNum
      )
      
      setRequiredResults(result)
    }
  }

  const addMatch = () => {
    const newId = Math.max(...matches.map(m => m.id)) + 1
    setMatches([...matches, {
      id: newId,
      runsScored: '',
      oversFaced: '',
      isAllOut: false,
      runsConceded: '',
      oversBowled: '',
      oppAllOut: false,
      format: tournamentFormat
    }])
  }

  const removeMatch = (id) => {
    setMatches(matches.filter(match => match.id !== id))
  }

  const updateMatch = (id, field, value) => {
    setMatches(matches.map(match => 
      match.id === id ? { ...match, [field]: value } : match
    ))
  }

  const applyPreset = (preset) => {
    setRunsScored(preset.runsScored.toString())
    setOversFaced(preset.oversFaced.toString())
    setIsAllOut(preset.isAllOut)
    setRunsConceded(preset.runsConceded.toString())
    setOversBowled(preset.oversBowled.toString())
    setOppAllOut(preset.oppAllOut)
    setFormat(preset.format)
  }

  const presets = [
    { name: 'Big Win', runsScored: 210, oversFaced: '20', isAllOut: false, runsConceded: 155, oversBowled: '16.3', oppAllOut: true, format: 'T20' },
    { name: 'Close Win', runsScored: 165, oversFaced: '20', isAllOut: false, runsConceded: 162, oversBowled: '20', oppAllOut: false, format: 'T20' },
    { name: 'Heavy Loss', runsScored: 120, oversFaced: '15.2', isAllOut: true, runsConceded: 185, oversBowled: '20', oppAllOut: false, format: 'T20' },
    { name: 'IPL Typical', runsScored: 178, oversFaced: '20', isAllOut: false, runsConceded: 165, oversBowled: '20', oppAllOut: false, format: 'T20' }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Net Run Rate Calculator (NRR) — IPL, T20 & ODI Cricket | CalcLogic</title>
        <meta name="description" content="Free Net Run Rate calculator for cricket. Calculate NRR for IPL, T20, ODI and Test matches. Includes tournament NRR, required NRR calculator, and what-if match scenarios." />
        <meta name="keywords" content="net run rate calculator, NRR calculator, IPL NRR calculator, cricket run rate calculator, T20 net run rate, how to calculate net run rate, required NRR calculator" />
        <link rel="canonical" href="https://calclogic.com/sports/net-run-rate-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Net Run Rate Calculator (NRR) — IPL, T20 & ODI Cricket | CalcLogic" />
        <meta property="og:description" content="Free Net Run Rate calculator for cricket. Calculate NRR for IPL, T20, ODI matches. Includes tournament NRR and required NRR for qualification." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/net-run-rate-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Net Run Rate Calculator (NRR) — Free Cricket Calculator | CalcLogic" />
        <meta name="twitter:description" content="Calculate cricket Net Run Rate for IPL, T20, ODI tournaments. Free, no signup required." />
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Net Run Rate Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate cricket Net Run Rate (NRR) for IPL, T20, ODI tournaments. Includes tournament NRR and required NRR for qualification."
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
                "name": "How is Net Run Rate calculated in IPL?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IPL Net Run Rate is calculated by subtracting a team's overall run rate conceded from their overall run rate scored across all league matches. The formula is: NRR = (Total Runs Scored ÷ Total Overs Faced) − (Total Runs Conceded ÷ Total Overs Bowled). If a team is bowled out, full 20 overs are used in calculation regardless of when they were dismissed."
                }
              },
              {
                "@type": "Question",
                "name": "What happens to NRR in a rain affected match?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In rain-affected matches where the Duckworth-Lewis-Stern (DLS) method is applied, NRR calculation uses the revised DLS target and actual overs bowled in the second innings. Matches that are completely abandoned with no result do not count toward NRR calculations at all."
                }
              },
              {
                "@type": "Question",
                "name": "Why does being bowled out hurt NRR so much?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "When a team is bowled out, the full quota of overs is used in the NRR calculation — not the overs actually bowled. So a team dismissed for 98 in 14 overs of a T20 has their run rate calculated as 98 over 20 overs (4.90), not 14 overs (6.79). This correctly reflects that the team failed to use all their available batting resources."
                }
              },
              {
                "@type": "Question",
                "name": "Can NRR be positive if a team has more losses than wins?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, in theory — but it is very rare. If a team wins by extremely large margins and loses very narrowly, their cumulative run rate scored could still exceed their run rate conceded. In practice, teams with more losses than wins almost always have negative NRR."
                }
              },
              {
                "@type": "Question",
                "name": "How much NRR do I need to qualify for IPL playoffs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "There is no fixed NRR threshold for IPL qualification — it depends on how many teams finish with equal points. Typically, teams with positive NRR (above 0.000) are in a safe position if they have equal points with rivals. NRR above +0.500 is generally considered strong in the IPL context."
                }
              },
              {
                "@type": "Question",
                "name": "Does NRR apply in Test cricket?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The World Test Championship (WTC) does not use NRR as a tiebreaker. Instead, it uses Percentage of Points Available (PCT) to account for series of different lengths. NRR is primarily used in limited-overs formats — T20 and ODI tournaments."
                }
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Net Run Rate Calculator (NRR)</h1>
          <p className="calculator-description">
            Calculate cricket Net Run Rate (NRR) for IPL, T20, ODI and Test matches. Includes tournament NRR, required NRR for qualification, and what-if match scenarios.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'single' ? '#2563eb' : 'transparent',
              color: activeTab === 'single' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Single Match NRR
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'tournament' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournament')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'tournament' ? '#2563eb' : 'transparent',
              color: activeTab === 'tournament' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Tournament NRR
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'required' ? 'active' : ''}`}
            onClick={() => setActiveTab('required')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'required' ? '#2563eb' : 'transparent',
              color: activeTab === 'required' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Required NRR
          </button>
        </div>

        {/* Important All Out Rule Notice */}
        <div style={{ 
          background: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginBottom: '2rem',
          color: '#92400e'
        }}>
          <strong>⚠️ Important All Out Rule:</strong> If a team is bowled out before completing their full quota of overs, the calculation uses the <strong>full quota of overs</strong> — not the overs actually bowled. This is the most commonly misunderstood NRR rule. Our calculator applies this automatically.
        </div>

        {/* Quick Fill Presets for Single Match */}
        {activeTab === 'single' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
              Quick-Fill Presets
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {presets.map((preset, index) => (
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
        )}

        {/* Tab 1: Single Match NRR */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleMatchCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Your Team Performance</h2>
              <div className="input-group">
                <label htmlFor="runsScored">Runs Scored</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="runsScored"
                    value={runsScored}
                    onChange={(e) => setRunsScored(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 186"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="oversFaced">Overs Faced</label>
                <div className="input-field">
                  <input
                    type="text"
                    id="oversFaced"
                    value={oversFaced}
                    onChange={(e) => setOversFaced(e.target.value)}
                    required
                    placeholder="e.g., 20 or 18.4 for 18 overs 4 balls"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Enter as overs.balls (e.g., 18.4 = 18 overs 4 balls)
                  </small>
                </div>
              </div>
              <div className="input-group">
                <label>Were you All Out?</label>
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${!isAllOut ? 'active' : ''}`}
                    onClick={() => setIsAllOut(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${isAllOut ? 'active' : ''}`}
                    onClick={() => setIsAllOut(true)}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Opposition Performance</h2>
              <div className="input-group">
                <label htmlFor="runsConceded">Runs Conceded</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="runsConceded"
                    value={runsConceded}
                    onChange={(e) => setRunsConceded(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 154"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="oversBowled">Overs Bowled</label>
                <div className="input-field">
                  <input
                    type="text"
                    id="oversBowled"
                    value={oversBowled}
                    onChange={(e) => setOversBowled(e.target.value)}
                    required
                    placeholder="e.g., 20 or 16.2"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Enter as overs.balls (e.g., 16.2 = 16 overs 2 balls)
                  </small>
                </div>
              </div>
              <div className="input-group">
                <label>Was Opposition All Out?</label>
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${!oppAllOut ? 'active' : ''}`}
                    onClick={() => setOppAllOut(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${oppAllOut ? 'active' : ''}`}
                    onClick={() => setOppAllOut(true)}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Match Format</h2>
              <div className="input-group">
                <label htmlFor="format">Format</label>
                <div className="input-field">
                  <select
                    id="format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    required
                  >
                    <option value="T20">T20 (20 overs)</option>
                    <option value="ODI">ODI (50 overs)</option>
                    <option value="T10">T10 (10 overs)</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Calculate Match NRR</button>
          </form>
        )}

        {/* Tab 2: Tournament NRR */}
        {activeTab === 'tournament' && (
          <form onSubmit={handleTournamentCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Tournament Format</h2>
              <div className="input-group">
                <label htmlFor="tournamentFormat">Format</label>
                <div className="input-field">
                  <select
                    id="tournamentFormat"
                    value={tournamentFormat}
                    onChange={(e) => setTournamentFormat(e.target.value)}
                    required
                  >
                    <option value="T20">T20 (20 overs)</option>
                    <option value="ODI">ODI (50 overs)</option>
                    <option value="T10">T10 (10 overs)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Match Details</h2>
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={addMatch}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#2563eb',
                    color: 'white',
                    border: '1px solid #2563eb',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
                  onMouseOut={(e) => e.target.style.background = '#2563eb'}
                >
                  + Add Match
                </button>
              </div>

              {matches.map((match, index) => (
                <div key={match.id} style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>Match {index + 1}</h3>
                    {matches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMatch(match.id)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="input-group">
                      <label>Runs Scored</label>
                      <input
                        type="number"
                        value={match.runsScored}
                        onChange={(e) => updateMatch(match.id, 'runsScored', e.target.value)}
                        min="0"
                        step="1"
                        placeholder="Runs"
                      />
                    </div>
                    <div className="input-group">
                      <label>Overs Faced</label>
                      <input
                        type="text"
                        value={match.oversFaced}
                        onChange={(e) => updateMatch(match.id, 'oversFaced', e.target.value)}
                        placeholder="e.g., 20"
                      />
                    </div>
                    <div className="input-group">
                      <label>All Out?</label>
                      <div className="unit-toggle">
                        <button
                          type="button"
                          className={`unit-btn ${!match.isAllOut ? 'active' : ''}`}
                          onClick={() => updateMatch(match.id, 'isAllOut', false)}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className={`unit-btn ${match.isAllOut ? 'active' : ''}`}
                          onClick={() => updateMatch(match.id, 'isAllOut', true)}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Runs Conceded</label>
                      <input
                        type="number"
                        value={match.runsConceded}
                        onChange={(e) => updateMatch(match.id, 'runsConceded', e.target.value)}
                        min="0"
                        step="1"
                        placeholder="Runs"
                      />
                    </div>
                    <div className="input-group">
                      <label>Overs Bowled</label>
                      <input
                        type="text"
                        value={match.oversBowled}
                        onChange={(e) => updateMatch(match.id, 'oversBowled', e.target.value)}
                        placeholder="e.g., 20"
                      />
                    </div>
                    <div className="input-group">
                      <label>Opp All Out?</label>
                      <div className="unit-toggle">
                        <button
                          type="button"
                          className={`unit-btn ${!match.oppAllOut ? 'active' : ''}`}
                          onClick={() => updateMatch(match.id, 'oppAllOut', false)}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className={`unit-btn ${match.oppAllOut ? 'active' : ''}`}
                          onClick={() => updateMatch(match.id, 'oppAllOut', true)}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="calculate-btn">Calculate Tournament NRR</button>
          </form>
        )}

        {/* Tab 3: Required NRR */}
        {activeTab === 'required' && (
          <form onSubmit={handleRequiredCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Current Tournament Stats</h2>
              <div className="input-group">
                <label htmlFor="currentNRR">My Current NRR</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="currentNRR"
                    value={currentNRR}
                    onChange={(e) => setCurrentNRR(e.target.value)}
                    required
                    step="0.001"
                    placeholder="e.g., -0.250"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="matchesPlayed">Matches Played</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="matchesPlayed"
                    value={matchesPlayed}
                    onChange={(e) => setMatchesPlayed(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="totalRunsFor">Total Runs Scored (tournament)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="totalRunsFor"
                    value={totalRunsFor}
                    onChange={(e) => setTotalRunsFor(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="Running total"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="totalOversFaced">Total Overs Faced (tournament)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="totalOversFaced"
                    value={totalOversFaced}
                    onChange={(e) => setTotalOversFaced(e.target.value)}
                    required
                    min="0"
                    step="0.1"
                    placeholder="Running total"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="totalRunsAgainst">Total Runs Conceded (tournament)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="totalRunsAgainst"
                    value={totalRunsAgainst}
                    onChange={(e) => setTotalRunsAgainst(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="Running total"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="totalOversBowled">Total Overs Bowled (tournament)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="totalOversBowled"
                    value={totalOversBowled}
                    onChange={(e) => setTotalOversBowled(e.target.value)}
                    required
                    min="0"
                    step="0.1"
                    placeholder="Running total"
                  />
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Target & Next Match</h2>
              <div className="input-group">
                <label htmlFor="targetNRR">Target NRR to Achieve</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="targetNRR"
                    value={targetNRR}
                    onChange={(e) => setTargetNRR(e.target.value)}
                    required
                    step="0.001"
                    placeholder="e.g., +0.500"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="nextMatchFormat">Next Match Format</label>
                <div className="input-field">
                  <select
                    id="nextMatchFormat"
                    value={nextMatchFormat}
                    onChange={(e) => setNextMatchFormat(e.target.value)}
                    required
                  >
                    <option value="T20">T20 (20 overs)</option>
                    <option value="ODI">ODI (50 overs)</option>
                    <option value="T10">T10 (10 overs)</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="expectedScore">Assumed Runs to Score</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="expectedScore"
                    value={expectedScore}
                    onChange={(e) => setExpectedScore(e.target.value)}
                    required
                    min="0"
                    step="1"
                    placeholder="e.g., 180"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Calculate Required NRR</button>
          </form>
        )}

        {/* Results Section */}
        {results && results.type === 'single' && (
          <div className="results-section">
            <h2>Match NRR Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="result-item">
                <span className="result-label">Your Match NRR</span>
                <span className="result-value" style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: results.nrr >= 0 ? '#22c55e' : '#ef4444' 
                }}>
                  {results.nrr >= 0 ? '+' : ''}{results.nrr}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Match Result</span>
                <span className="result-value" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: results.result === 'Won' ? '#22c55e' : results.result === 'Lost' ? '#ef4444' : '#eab308' 
                }}>
                  {results.result}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Your Run Rate</span>
                <span className="result-value">{results.yourRunRate}</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {results.yourRunRate} runs per over
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Opposition Run Rate</span>
                <span className="result-value">{results.oppRunRate}</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {results.oppRunRate} runs per over
                </p>
              </div>
            </div>
          </div>
        )}

        {tournamentResults && (
          <div className="results-section">
            <h2>Tournament NRR Results</h2>
            
            <div className="result-item" style={{ marginBottom: '2rem' }}>
              <span className="result-label">Current Tournament NRR</span>
              <span className="result-value" style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: tournamentResults.overallNRR >= 0 ? '#22c55e' : '#ef4444' 
              }}>
                {tournamentResults.overallNRR >= 0 ? '+' : ''}{tournamentResults.overallNRR}
              </span>
            </div>

            <h3>Match Summary</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Match</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Runs Scored</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Overs</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Runs Conceded</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Overs</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Match NRR</th>
                </tr>
              </thead>
              <tbody>
                {tournamentResults.matches.map((match, index) => (
                  <tr key={match.id} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Match {index + 1}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{match.runsScored}/{match.isAllOut ? 'All Out' : match.oversFaced}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{match.effectiveOversFaced.toFixed(1)}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{match.runsConceded}/{match.oppAllOut ? 'All Out' : match.oversBowled}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{match.effectiveOversBowled.toFixed(1)}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', color: match.matchNRR >= 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                      {match.matchNRR >= 0 ? '+' : ''}{match.matchNRR}
                    </td>
                  </tr>
                ))}
                <tr style={{ background: '#1e2235', color: 'white', fontWeight: '700' }}>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Total</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    {tournamentResults.matches.reduce((sum, m) => sum + parseInt(m.runsScored), 0)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    {tournamentResults.matches.reduce((sum, m) => sum + m.effectiveOversFaced, 0).toFixed(1)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    {tournamentResults.matches.reduce((sum, m) => sum + parseInt(m.runsConceded), 0)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    {tournamentResults.matches.reduce((sum, m) => sum + m.effectiveOversBowled, 0).toFixed(1)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', color: tournamentResults.overallNRR >= 0 ? '#22c55e' : '#ef4444' }}>
                    {tournamentResults.overallNRR >= 0 ? '+' : ''}{tournamentResults.overallNRR}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {requiredResults && (
          <div className="results-section">
            <h2>Required NRR Results</h2>
            
            <div className="result-item" style={{ marginBottom: '2rem' }}>
              <span className="result-label">To achieve NRR of {targetNRR}, you need to:</span>
              <div style={{ 
                background: '#1e2235', 
                borderRadius: '12px', 
                padding: '1.5rem', 
                marginTop: '1rem' 
              }}>
                <p style={{ color: 'white', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  Restrict opposition to <strong style={{ color: '#22c55e', fontSize: '1.3rem' }}>{requiredResults.maxRunsAllowed} runs or fewer</strong> in {formatOvers[nextMatchFormat]} overs
                </p>
                <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
                  That means bowling at an economy rate of <strong>{requiredResults.requiredRunRate} runs per over</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <ShareButtons 
          title="Net Run Rate Calculator (NRR)"
          url="https://calclogic.com/sports/net-run-rate-calculator"
        />

        {/* Content Sections */}
        <div className="content-section">
          <h2>What is Net Run Rate (NRR) in Cricket?</h2>
          <p>Net Run Rate (NRR) is the primary tiebreaker used to separate teams with equal points in cricket league standings. Used across all major tournaments including IPL, ICC Cricket World Cup, ICC T20 World Cup, and domestic T20 leagues worldwide, NRR determines which team advances to the knockout stage when two or more teams finish with identical points.</p>
          <p>NRR measures the difference between a team's average run rate (runs scored per over) and the average run rate scored against them across all their matches in a tournament. A positive NRR means a team has, on average, scored faster than their opponents have scored against them — a sign of dominant performances. A negative NRR indicates a team has been outscored on average across their matches.</p>
          <p>Unlike a simple win-loss record, NRR rewards teams for winning by large margins and penalizes teams for losing heavily. This is why teams sometimes continue scoring aggressively even in a clearly won match — every extra run improves their NRR and could prove crucial for tournament qualification.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Calculate Net Run Rate — Step by Step</h2>
          <p>The Net Run Rate formula is:</p>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            <strong>NRR = (Total Runs Scored ÷ Total Overs Faced) − (Total Runs Conceded ÷ Total Overs Bowled)</strong>
          </div>
          <p>This is calculated across all matches in a tournament, not match by match.</p>
          
          <h3>Step-by-step example — Two match tournament:</h3>
          <p><strong>Match 1:</strong> Your team scores 186/4 in 20 overs. Opposition scores 154/8 in 20 overs. You win.</p>
          <p><strong>Match 2:</strong> Your team scores 142/6 in 20 overs. Opposition scores 168/4 in 20 overs. You lose.</p>
          
          <h3>Calculation:</h3>
          <ul style={{ lineHeight: '1.8', color: '#374151' }}>
            <li>Total Runs Scored: 186 + 142 = <strong>328</strong></li>
            <li>Total Overs Faced: 20 + 20 = <strong>40 overs</strong></li>
            <li>Total Runs Conceded: 154 + 168 = <strong>322</strong></li>
            <li>Total Overs Bowled: 20 + 20 = <strong>40 overs</strong></li>
          </ul>
          
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            <strong>NRR = (328 ÷ 40) − (322 ÷ 40) = 8.20 − 8.05 = +0.150</strong>
          </div>
          <p>This team has a positive NRR of +0.150 after two matches.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>The All Out Rule — The Most Important NRR Detail</h2>
          <p>The most commonly misunderstood aspect of NRR calculation is how teams being bowled out are treated. This is also where most online NRR calculators get it wrong.</p>
          
          <p><strong>The Rule:</strong> If a batting team is bowled out before completing their full quota of overs, the calculation uses the <strong>full quota of overs</strong> — not the overs actually bowled.</p>

          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #f59e0b', 
            borderRadius: '8px', 
            padding: '1.5rem', 
            margin: '1.5rem 0',
            color: '#92400e'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>Example:</h4>
            <p>In a T20 match, your team is bowled out for 98 runs in 14.3 overs.</p>
            <ul style={{ lineHeight: '1.8', color: '#92400e' }}>
              <li><strong>Incorrect calculation:</strong> 98 ÷ 14.5 overs = 6.76 runs per over</li>
              <li><strong>Correct calculation:</strong> 98 ÷ 20 overs = 4.90 runs per over (full T20 quota used)</li>
            </ul>
            <p>The correct method severely penalizes being bowled out — as it should, because the batting team failed to use all their available resources. Our calculator automatically applies this rule correctly for both teams.</p>
          </div>

          <p><strong>Why this rule exists:</strong> It prevents a team from gaming the system by scoring quickly in a few overs. The full-overs rule ensures NRR reflects actual batting performance across the complete innings allocation.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>NRR Reference — What is a Good Net Run Rate?</h2>
          <p>Use this table to understand what different NRR values mean in the context of a T20 tournament:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>NRR Range</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Rating</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>What It Means</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f0fdf4' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#166534', fontWeight: '600' }}>+1.500 and above</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Dominant</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Winning by very large margins consistently</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Green</td>
              </tr>
              <tr style={{ background: '#f0fdfa' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#134e4a', fontWeight: '600' }}>+0.500 to +1.499</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Strong</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Comfortable wins, strong tournament form</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Teal</td>
              </tr>
              <tr style={{ background: '#eff6ff' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#1e40af', fontWeight: '600' }}>0.000 to +0.499</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Positive</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Slightly outperforming opponents on average</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td>
              </tr>
              <tr style={{ background: '#fefce8' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#713f12', fontWeight: '600' }}>-0.499 to -0.001</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Negative</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Slightly underperforming — close losses or narrow wins</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td>
              </tr>
              <tr style={{ background: '#fff7ed' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#c2410c', fontWeight: '600' }}>-0.500 to -1.499</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Weak</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Losing by significant margins</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Orange</td>
              </tr>
              <tr style={{ background: '#fef2f2' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#991b1b', fontWeight: '600' }}>Below -1.500</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Poor</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Heavy defeats — qualification in danger</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td>
              </tr>
            </tbody>
          </table>
          <p><em>Context note: In IPL and major T20 World Cups, qualifying teams typically need an NRR above 0.000. Teams with NRR above +0.500 are usually safe for qualification with equal points.</em></p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>NRR in Major Cricket Tournaments</h2>
          
          <h3>IPL (Indian Premier League)</h3>
          <p>The IPL group stage uses NRR as the first tiebreaker when teams finish level on points. With 14 league matches per team and playoff spots extremely competitive, NRR has decided qualification in multiple IPL seasons. Teams finishing with the same points as rivals are separated purely by their cumulative NRR across all 14 matches.</p>
          
          <h3>ICC T20 World Cup</h3>
          <p>The T20 World Cup uses NRR to separate teams in group stage standings. Rain-affected matches that result in no result (NR) do not contribute to NRR calculations — only completed matches count.</p>
          
          <h3>ICC Cricket World Cup (ODI)</h3>
          <p>In 50-over World Cups, NRR plays the same tiebreaking role but across 50-over matches. The same All Out rule applies — teams dismissed before completing 50 overs have the full 50 overs used in the calculation.</p>
          
          <h3>Rain Affected Matches and D/L Method</h3>
          <p>When the Duckworth-Lewis-Stern (DLS) method is applied to a rain-affected match, the NRR calculation uses the DLS-revised target and overs as the basis, not the original match parameters.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Common NRR Mistakes and How to Avoid Them</h2>
          
          <div style={{ display: 'grid', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '1rem' 
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>❌ Mistake 1: Using actual overs when a team is bowled out</h4>
              <p style={{ margin: 0, color: '#7f1d1d' }}>Always use the full quota (20 for T20, 50 for ODI) when a team is dismissed. Our calculator handles this automatically.</p>
            </div>
            
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '1rem' 
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>❌ Mistake 2: Calculating NRR per match instead of cumulatively</h4>
              <p style={{ margin: 0, color: '#7f1d1d' }}>NRR is a tournament-wide calculation. You cannot average your match NRRs — you must sum all runs and overs across all matches.</p>
            </div>
            
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '1rem' 
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>❌ Mistake 3: Forgetting to convert overs and balls correctly</h4>
              <p style={{ margin: 0, color: '#7f1d1d' }}>18 overs and 4 balls is NOT 18.4 overs in decimal — it is 18.667 overs (4 balls = 4/6 of an over). Our calculator converts this automatically when you enter overs.balls format.</p>
            </div>
            
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '1rem' 
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>❌ Mistake 4: Including no-result matches</h4>
              <p style={{ margin: 0, color: '#7f1d1d' }}>Matches abandoned without a result do not count toward NRR. Only completed matches (including DLS results) are included.</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>How is Net Run Rate calculated in IPL?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>IPL Net Run Rate is calculated by subtracting a team's overall run rate conceded from their overall run rate scored across all league matches. The formula is: NRR = (Total Runs Scored ÷ Total Overs Faced) − (Total Runs Conceded ÷ Total Overs Bowled). If a team is bowled out, full 20 overs are used in the calculation regardless of when they were dismissed.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What happens to NRR in a rain affected match?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>In rain-affected matches where the Duckworth-Lewis-Stern (DLS) method is applied, the NRR calculation uses the revised DLS target and actual overs bowled in the second innings. Matches that are completely abandoned with no result do not count toward NRR calculations at all.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Why does being bowled out hurt NRR so much?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>When a team is bowled out, the full quota of overs is used in the NRR calculation — not the overs actually bowled. So a team dismissed for 98 in 14 overs of a T20 has their run rate calculated as 98 over 20 overs (4.90), not 14 overs (6.79). This correctly reflects that the team failed to use all their available batting resources.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Can NRR be positive if a team has more losses than wins?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>Yes, in theory — but it is very rare. If a team wins by extremely large margins and loses very narrowly, their cumulative run rate scored could still exceed their run rate conceded. In practice, teams with more losses than wins almost always have negative NRR.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>How much NRR do I need to qualify for IPL playoffs?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>There is no fixed NRR threshold for IPL qualification — it depends on how many teams finish with equal points. Typically, teams with positive NRR (above 0.000) are in a safe position if they have equal points with rivals. NRR above +0.500 is generally considered strong in the IPL context.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Does NRR apply in Test cricket?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>The World Test Championship (WTC) does not use NRR as a tiebreaker. Instead, it uses Percentage of Points Available (PCT) to account for series of different lengths. NRR is primarily used in limited-overs formats — T20 and ODI tournaments.</p>
              </div>
            </details>
          </div>
        </div>

        {/* Related Calculators */}
        <div className="content-section">
          <h2>Related Calculators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
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
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate running pace, speed, and finish time for any distance</p>
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
            <a href="/sports/true-shooting-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>True Shooting % Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate basketball TS% and eFG% for any player</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetRunRateCalculator
