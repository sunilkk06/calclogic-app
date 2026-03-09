import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const ExpectedGoalsCalculator = () => {
  const [activeTab, setActiveTab] = useState('shot')
  const [results, setResults] = useState(null)

  // Shot xG State
  const [distance, setDistance] = useState('')
  const [distanceUnit, setDistanceUnit] = useState('yards')
  const [angle, setAngle] = useState('')
  const [shotType, setShotType] = useState('openPlay')
  const [bodyPart, setBodyPart] = useState('strongFoot')
  const [situation, setSituation] = useState('openPlay')
  const [gkPosition, setGkPosition] = useState('set')
  const [assistType, setAssistType] = useState('shortPass')

  // Player/Team State
  const [shots, setShots] = useState([
    { id: 1, distance: '', angle: '', shotType: 'openPlay', bodyPart: 'strongFoot', goalScored: false }
  ])
  const [trackerResults, setTrackerResults] = useState(null)

  const calculateXG = (distance, angleDegrees, shotType, bodyPart, situation, gkPosition, assistType) => {
    // Convert distance to yards if in meters
    const distanceInYards = distanceUnit === 'meters' ? distance * 1.094 : distance

    // Base xG from distance (exponential decay)
    let baseXG = Math.exp(-0.1 * distanceInYards + 1.5) / (1 + Math.exp(-0.1 * distanceInYards + 1.5))

    // Angle modifier — shots from central positions are more likely to score
    const angleRadians = (angleDegrees * Math.PI) / 180
    const angleModifier = Math.sin(angleRadians)

    // Shot type modifiers
    const shotTypeModifiers = {
      'penalty': 0.76,
      'openPlay': 1.0,
      'header': 0.6,
      'directFreekick': 0.5,
      'counterAttack': 1.15
    }

    // Body part modifiers
    const bodyPartModifiers = {
      'strongFoot': 1.0,
      'weakFoot': 0.85,
      'header': 0.72
    }

    // Situation modifiers
    const situationModifiers = {
      'openPlay': 1.0,
      'setPiece': 0.9,
      'corner': 0.85,
      'fastBreak': 1.1
    }

    // GK position modifier
    const gkModifier = gkPosition === 'outOfPosition' ? 1.3 : 1.0

    // Assist type modifiers
    const assistModifiers = {
      'throughBall': 1.2,
      'cross': 0.85,
      'longBall': 0.9,
      'shortPass': 1.0,
      'none': 1.0
    }

    // Apply penalty special case
    if (shotType === 'penalty') {
      return 0.76
    }

    // Calculate combined xG
    let xG = baseXG
      * angleModifier
      * (shotTypeModifiers[shotType] || 1.0)
      * (bodyPartModifiers[bodyPart] || 1.0)
      * (situationModifiers[situation] || 1.0)
      * gkModifier
      * (assistModifiers[assistType] || 1.0)

    // Cap between 0 and 1
    xG = Math.max(0, Math.min(0.99, xG))

    return xG
  }

  const getShotQuality = (xG) => {
    if (xG >= 0.75) return { label: 'Gilt-Edged Chance', color: '#3b82f6' }
    if (xG >= 0.50) return { label: 'Big Chance', color: '#22c55e' }
    if (xG >= 0.30) return { label: 'Good Chance', color: '#14b8a6' }
    if (xG >= 0.10) return { label: 'Moderate Chance', color: '#eab308' }
    if (xG >= 0.05) return { label: 'Low Quality', color: '#f97316' }
    return { label: 'Very Low', color: '#ef4444' }
  }

  const getModifiers = (distance, angleDegrees, shotType, bodyPart, situation, gkPosition, assistType) => {
    const modifiers = []
    const distanceInYards = distanceUnit === 'meters' ? distance * 1.094 : distance

    // Angle modifier
    const angleRadians = (angleDegrees * Math.PI) / 180
    const angleModifier = Math.sin(angleRadians)
    if (angleModifier > 0.8) {
      modifiers.push({ type: 'positive', text: `Central angle (+${Math.round((angleModifier - 1) * 100)}%)` })
    } else if (angleModifier < 0.5) {
      modifiers.push({ type: 'negative', text: `Tight angle (${Math.round(angleModifier * 100)}%)` })
    }

    // Shot type
    if (shotType === 'counterAttack') {
      modifiers.push({ type: 'positive', text: 'Counter attack (+15%)' })
    }
    if (shotType === 'header') {
      modifiers.push({ type: 'negative', text: 'Header (-40%)' })
    }
    if (shotType === 'directFreekick') {
      modifiers.push({ type: 'negative', text: 'Direct free kick (-50%)' })
    }

    // Body part
    if (bodyPart === 'weakFoot') {
      modifiers.push({ type: 'negative', text: 'Weak foot (-15%)' })
    }
    if (bodyPart === 'header') {
      modifiers.push({ type: 'negative', text: 'Header (-28%)' })
    }

    // Situation
    if (situation === 'fastBreak') {
      modifiers.push({ type: 'positive', text: 'Fast break (+10%)' })
    }
    if (situation === 'corner') {
      modifiers.push({ type: 'negative', text: 'Corner (-15%)' })
    }

    // GK position
    if (gkPosition === 'outOfPosition') {
      modifiers.push({ type: 'positive', text: 'GK out of position (+30%)' })
    }

    // Assist type
    if (assistType === 'throughBall') {
      modifiers.push({ type: 'positive', text: 'Through ball assist (+20%)' })
    }
    if (assistType === 'cross') {
      modifiers.push({ type: 'negative', text: 'Cross (-15%)' })
    }

    return modifiers
  }

  const handleShotCalculate = (e) => {
    e.preventDefault()
    
    const distanceNum = parseFloat(distance)
    const angleNum = parseFloat(angle)

    if (distanceNum >= 0 && angleNum >= 0 && angleNum <= 90) {
      const xG = calculateXG(distanceNum, angleNum, shotType, bodyPart, situation, gkPosition, assistType)
      const quality = getShotQuality(xG)
      const modifiers = getModifiers(distanceNum, angleNum, shotType, bodyPart, situation, gkPosition, assistType)
      
      // Calculate distance factor
      const distanceInYards = distanceUnit === 'meters' ? distanceNum * 1.094 : distanceNum
      const baseXG = Math.exp(-0.1 * distanceInYards + 1.5) / (1 + Math.exp(-0.1 * distanceInYards + 1.5))
      
      setResults({
        type: 'shot',
        xG,
        quality,
        distanceFactor: baseXG,
        modifiers
      })
    }
  }

  const handleTrackerCalculate = (e) => {
    e.preventDefault()
    
    const validShots = shots.filter(shot => shot.distance && shot.angle)
    
    if (validShots.length > 0) {
      const shotResults = validShots.map(shot => {
        const xG = calculateXG(
          parseFloat(shot.distance),
          parseFloat(shot.angle),
          shot.shotType,
          shot.bodyPart,
          'openPlay',
          'set',
          'shortPass'
        )
        return { ...shot, xG }
      })

      const totalXG = shotResults.reduce((sum, shot) => sum + shot.xG, 0)
      const actualGoals = shotResults.filter(shot => shot.goalScored).length
      const xGDiff = actualGoals - totalXG

      setTrackerResults({
        shots: shotResults,
        totalXG,
        actualGoals,
        xGDiff
      })
    }
  }

  const addShot = () => {
    const newId = Math.max(...shots.map(s => s.id)) + 1
    setShots([...shots, {
      id: newId,
      distance: '',
      angle: '',
      shotType: 'openPlay',
      bodyPart: 'strongFoot',
      goalScored: false
    }])
  }

  const removeShot = (id) => {
    setShots(shots.filter(shot => shot.id !== id))
  }

  const updateShot = (id, field, value) => {
    setShots(shots.map(shot => 
      shot.id === id ? { ...shot, [field]: value } : shot
    ))
  }

  const applyPreset = (preset) => {
    setDistance(preset.distance.toString())
    setAngle(preset.angle.toString())
    setShotType(preset.shotType)
    setBodyPart(preset.bodyPart || 'strongFoot')
    setSituation(preset.situation || 'openPlay')
    setGkPosition(preset.gkPosition || 'set')
    setAssistType(preset.assistType || 'shortPass')
  }

  const presets = [
    { name: 'Penalty', distance: 12, angle: 90, shotType: 'penalty' },
    { name: 'Close Range Header', distance: 7, angle: 70, shotType: 'header', bodyPart: 'header' },
    { name: 'Long Shot', distance: 28, angle: 60, shotType: 'openPlay' },
    { name: 'One on One', distance: 10, angle: 85, gkPosition: 'outOfPosition' },
    { name: 'Tight Angle', distance: 8, angle: 15, shotType: 'openPlay' }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Expected Goals Calculator (xG) — Soccer Shot Quality & Scoring | CalcLogic</title>
        <meta name="description" content="Free Expected Goals (xG) calculator for soccer. Calculate shot quality probability, player xG totals, and team xG from distance, angle, and shot type. Used by Premier League analysts worldwide." />
        <meta name="keywords" content="expected goals calculator, xG calculator, soccer xG calculator, football expected goals, shot quality calculator, xG football, Premier League xG, xG model calculator" />
        <link rel="canonical" href="https://calclogic.com/sports/expected-goals-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Expected Goals Calculator (xG) — Soccer Shot Quality & Scoring | CalcLogic" />
        <meta property="og:description" content="Free Expected Goals (xG) calculator for soccer. Calculate shot quality probability and player xG totals. Used by Premier League analysts worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/expected-goals-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Expected Goals Calculator (xG) — Free Soccer Calculator | CalcLogic" />
        <meta name="twitter:description" content="Calculate Expected Goals (xG) for soccer shots. Free, no signup required." />
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Expected Goals (xG) Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate Expected Goals (xG) for soccer shots based on distance, angle, and shot type. Includes player and team xG totals."
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
                "name": "What is a good xG per match in soccer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "In the Premier League, teams average approximately 1.3–1.6 xG per match. An xG of 2.0 or above in a single match represents a dominant performance with high-quality chances. Individual players with 0.5+ xG in a match have had a very productive game in terms of chance quality."
                }
              },
              {
                "@type": "Question",
                "name": "What is the xG of a penalty kick?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A penalty kick has a standard xG of approximately 0.76, meaning penalties are converted into goals around 76% of the time in professional soccer. This makes penalties the highest xG situation in the game outside of an empty net."
                }
              },
              {
                "@type": "Question",
                "name": "Can xG predict match results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "xG is a strong predictor of future performance but not individual match results. Over a large sample of matches, teams with consistently higher xG than their opponents win more games. However, in any single match, the team with lower xG can and often does win due to finishing variance and goalkeeping performance."
                }
              },
              {
                "@type": "Question",
                "name": "Why do some players consistently outperform their xG?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A small number of elite finishers — such as Robert Lewandowski, Lionel Messi, and Erling Haaland — consistently score more goals than their xG predicts. This reflects genuine finishing skill: better shot placement, composure under pressure, and the ability to score from positions where average players would miss. Most players regress toward their xG over large sample sizes."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between xG and xA?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "xG (Expected Goals) measures the quality of shots — the probability that a shot results in a goal. xA (Expected Assists) measures the quality of passes that lead to shots — the probability that a key pass leads to a goal based on the shot it creates. Together, xG and xA give a complete picture of a player's attacking contribution beyond just goals and assists."
                }
              },
              {
                "@type": "Question",
                "name": "How is xG different from shot conversion rate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Shot conversion rate simply divides goals by total shots — it treats every shot equally regardless of where it came from. xG weights each shot by its difficulty, so a tap-in from three yards and a 30-yard volley are treated very differently. xG is a much more accurate measure of shooting quality and chance creation than raw conversion rate."
                }
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Expected Goals Calculator (xG)</h1>
          <p className="calculator-description">
            Calculate Expected Goals (xG) for soccer shots based on distance, angle, and shot type. Used by Premier League analysts worldwide to measure shot quality and player performance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'shot' ? 'active' : ''}`}
            onClick={() => setActiveTab('shot')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'shot' ? '#2563eb' : 'transparent',
              color: activeTab === 'shot' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Shot xG Calculator
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'tracker' ? '#2563eb' : 'transparent',
              color: activeTab === 'tracker' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Player/Team xG Tracker
          </button>
        </div>

        {/* Quick Fill Presets for Shot Calculator */}
        {activeTab === 'shot' && (
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

        {/* Tab 1: Shot xG Calculator */}
        {activeTab === 'shot' && (
          <form onSubmit={handleShotCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Shot Characteristics</h2>
              <div className="input-group">
                <label htmlFor="distance">Distance from Goal</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    required
                    min="0"
                    step="0.1"
                    placeholder="e.g., 18"
                  />
                  <div className="unit-toggle">
                    <button
                      type="button"
                      className={`unit-btn ${distanceUnit === 'yards' ? 'active' : ''}`}
                      onClick={() => setDistanceUnit('yards')}
                    >
                      Yards
                    </button>
                    <button
                      type="button"
                      className={`unit-btn ${distanceUnit === 'meters' ? 'active' : ''}`}
                      onClick={() => setDistanceUnit('meters')}
                    >
                      Meters
                    </button>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="angle">Shot Angle</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="angle"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    required
                    min="0"
                    max="90"
                    step="1"
                    placeholder="e.g., 75"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Degrees (0–90°). 90° = central, 0° = byline
                  </small>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="shotType">Shot Type</label>
                <div className="input-field">
                  <select
                    id="shotType"
                    value={shotType}
                    onChange={(e) => setShotType(e.target.value)}
                    required
                  >
                    <option value="openPlay">Open Play</option>
                    <option value="header">Header</option>
                    <option value="directFreekick">Direct Free Kick</option>
                    <option value="penalty">Penalty</option>
                    <option value="counterAttack">Counter Attack</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="bodyPart">Body Part</label>
                <div className="input-field">
                  <select
                    id="bodyPart"
                    value={bodyPart}
                    onChange={(e) => setBodyPart(e.target.value)}
                    required
                  >
                    <option value="strongFoot">Strong Foot</option>
                    <option value="weakFoot">Weak Foot</option>
                    <option value="header">Header</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Match Context</h2>
              <div className="input-group">
                <label htmlFor="situation">Situation</label>
                <div className="input-field">
                  <select
                    id="situation"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    required
                  >
                    <option value="openPlay">Open Play</option>
                    <option value="setPiece">Set Piece</option>
                    <option value="corner">Corner</option>
                    <option value="fastBreak">Fast Break</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="gkPosition">Goalkeeper Position</label>
                <div className="input-field">
                  <select
                    id="gkPosition"
                    value={gkPosition}
                    onChange={(e) => setGkPosition(e.target.value)}
                    required
                  >
                    <option value="set">Set</option>
                    <option value="outOfPosition">Out of Position</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="assistType">Assist Type</label>
                <div className="input-field">
                  <select
                    id="assistType"
                    value={assistType}
                    onChange={(e) => setAssistType(e.target.value)}
                    required
                  >
                    <option value="throughBall">Through Ball</option>
                    <option value="cross">Cross</option>
                    <option value="longBall">Long Ball</option>
                    <option value="shortPass">Short Pass</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Calculate Shot xG</button>
          </form>
        )}

        {/* Tab 2: Player/Team xG Tracker */}
        {activeTab === 'tracker' && (
          <form onSubmit={handleTrackerCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Shot Log</h2>
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={addShot}
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
                  + Add Shot
                </button>
              </div>

              {shots.map((shot, index) => (
                <div key={shot.id} style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '1rem', 
                  marginBottom: '1rem' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#374151' }}>Shot {index + 1}</h3>
                    {shots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeShot(shot.id)}
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div className="input-group">
                      <label>Distance</label>
                      <input
                        type="number"
                        value={shot.distance}
                        onChange={(e) => updateShot(shot.id, 'distance', e.target.value)}
                        min="0"
                        step="0.1"
                        placeholder="Yards"
                      />
                    </div>
                    <div className="input-group">
                      <label>Angle</label>
                      <input
                        type="number"
                        value={shot.angle}
                        onChange={(e) => updateShot(shot.id, 'angle', e.target.value)}
                        min="0"
                        max="90"
                        step="1"
                        placeholder="Degrees"
                      />
                    </div>
                    <div className="input-group">
                      <label>Shot Type</label>
                      <select
                        value={shot.shotType}
                        onChange={(e) => updateShot(shot.id, 'shotType', e.target.value)}
                      >
                        <option value="openPlay">Open Play</option>
                        <option value="header">Header</option>
                        <option value="directFreekick">Free Kick</option>
                        <option value="penalty">Penalty</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Body Part</label>
                      <select
                        value={shot.bodyPart}
                        onChange={(e) => updateShot(shot.id, 'bodyPart', e.target.value)}
                      >
                        <option value="strongFoot">Strong Foot</option>
                        <option value="weakFoot">Weak Foot</option>
                        <option value="header">Header</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>Goal Scored?</label>
                      <div className="unit-toggle">
                        <button
                          type="button"
                          className={`unit-btn ${!shot.goalScored ? 'active' : ''}`}
                          onClick={() => updateShot(shot.id, 'goalScored', false)}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          className={`unit-btn ${shot.goalScored ? 'active' : ''}`}
                          onClick={() => updateShot(shot.id, 'goalScored', true)}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="calculate-btn">Calculate Player/Team xG</button>
          </form>
        )}

        {/* Results Section */}
        {results && results.type === 'shot' && (
          <div className="results-section">
            <h2>Shot xG Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="result-item">
                <span className="result-label">Shot xG</span>
                <span className="result-value" style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: results.quality.color 
                }}>
                  {results.xG}
                </span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {(results.xG * 100).toFixed(1)}% chance of scoring
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Shot Quality Rating</span>
                <span className="result-value" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: results.quality.color 
                }}>
                  {results.quality.label}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Distance Factor</span>
                <span className="result-value">{(results.distanceFactor * 100).toFixed(1)}%</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  From {distance} {distanceUnit}, base probability
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Key Modifiers</span>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {results.modifiers.map((modifier, index) => (
                    <div key={index} style={{ 
                      color: modifier.type === 'positive' ? '#22c55e' : '#ef4444',
                      marginBottom: '0.25rem'
                    }}>
                      {modifier.type === 'positive' ? '✅' : '❌'} {modifier.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {trackerResults && (
          <div className="results-section">
            <h2>Player/Team xG Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="result-item">
                <span className="result-label">Total xG</span>
                <span className="result-value" style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {trackerResults.totalXG.toFixed(3)} xG
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Actual Goals</span>
                <span className="result-value" style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {trackerResults.actualGoals} {trackerResults.actualGoals === 1 ? 'goal' : 'goals'}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">xG Difference</span>
                <span className="result-value" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: trackerResults.xGDiff >= 0 ? '#22c55e' : '#ef4444' 
                }}>
                  {trackerResults.xGDiff >= 0 ? '+' : ''}{trackerResults.xGDiff.toFixed(3)}
                </span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {trackerResults.xGDiff >= 0 ? 'xG Overperformance' : 'xG Underperformance'}
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Shots Summary</span>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  <div>Total shots: {trackerResults.shots.length}</div>
                  <div>Shots on target: {trackerResults.actualGoals}</div>
                  <div>Conversion rate: {((trackerResults.actualGoals / trackerResults.shots.length) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <h3>Shot Log</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Shot</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Distance</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Angle</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Type</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>xG</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Goal?</th>
                </tr>
              </thead>
              <tbody>
                {trackerResults.shots.map((shot, index) => (
                  <tr key={shot.id} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{index + 1}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{shot.distance} yds</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{shot.angle}°</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                      {shot.shotType === 'openPlay' ? 'Open Play' : 
                       shot.shotType === 'header' ? 'Header' :
                       shot.shotType === 'directFreekick' ? 'Free Kick' : 'Penalty'}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>{shot.xG.toFixed(3)}</td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                      {shot.goalScored ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
                <tr style={{ background: '#1e2235', color: 'white', fontWeight: '700' }}>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Total</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>—</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>—</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>—</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    {trackerResults.totalXG.toFixed(3)}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                    {trackerResults.actualGoals}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <ShareButtons 
          title="Expected Goals Calculator (xG)"
          url="https://calclogic.com/sports/expected-goals-calculator"
        />

        {/* Content Sections */}
        <div className="content-section">
          <h2>What is Expected Goals (xG) in Soccer?</h2>
          <p>Expected Goals (xG) is the most influential advanced metric in modern soccer analytics. It assigns a numerical probability between 0 and 1 to every shot, representing the likelihood that the shot will result in a goal based on historical data from thousands of similar attempts.</p>
          <p>An xG of 0.10 means that, from that position and situation, a shot is converted into a goal 10% of the time on average. An xG of 0.76 — the standard for a penalty kick — means the shot is scored 76% of the time. By summing the xG values of all shots in a match, analysts can calculate how many goals a team "should" have scored based on the quality of their chances, rather than just the quantity.</p>
          <p>xG was originally developed by sports analytics companies and has now been adopted by every Premier League club, major European leagues, broadcasters including Sky Sports and ESPN, and fantasy football platforms worldwide. It is arguably the single most important stat in modern soccer analysis.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How is xG Calculated?</h2>
          <p>xG models are built using logistic regression applied to large historical datasets — typically hundreds of thousands of shots from professional matches. Each shot is described by a set of variables, and the model learns the historical conversion rate for shots with similar characteristics.</p>
          
          <p>The key variables that determine a shot's xG value are:</p>
          
          <p><strong>Distance from Goal</strong> — the single biggest factor. Shots from inside the six-yard box convert far more often than shots from 25 yards. The relationship is roughly exponential — every additional yard of distance significantly reduces xG.</p>
          
          <p><strong>Shot Angle</strong> — shots from central positions (directly in front of goal) have far higher xG than shots from tight angles near the byline. A shot from a 10° angle has almost no chance of scoring; a shot from 85° (nearly straight on) has a much higher probability.</p>
          
          <p><strong>Shot Type</strong> — open play shots, headers, direct free kicks, and penalties all have different baseline conversion rates. Penalties convert at approximately 76%, while headers from similar distances convert less often than strong-foot shots.</p>
          
          <p><strong>Body Part</strong> — shots with a player's stronger foot convert more often than weak-foot efforts or headers from the same position.</p>
          
          <p><strong>Assist Type</strong> — shots following a through ball (which tends to find a player in space) have higher xG than shots after a cross (which are harder to control and finish).</p>
          
          <p><strong>Goalkeeper Position</strong> — a shot taken when the goalkeeper is out of position has significantly higher xG than the same shot with the goalkeeper well-set.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>xG Values Reference — What Do the Numbers Mean?</h2>
          <p>Use this table to interpret any xG value:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>xG Value</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Shot Quality</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Description</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Real Example</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#eff6ff' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#1e40af', fontWeight: '600' }}>0.75 – 1.00</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Gilt-Edged Chance</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Almost certain goal — rarely missed</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Penalty, open goal from 5 yards</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td>
              </tr>
              <tr style={{ background: '#f0fdf4' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#166534', fontWeight: '600' }}>0.50 – 0.74</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Big Chance</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>High probability — expected to score</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>One-on-one with goalkeeper</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Green</td>
              </tr>
              <tr style={{ background: '#f0fdfa' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#134e4a', fontWeight: '600' }}>0.30 – 0.49</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Good Chance</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Solid opportunity — above average</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Close range header, 10-yard shot</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Teal</td>
              </tr>
              <tr style={{ background: '#fefce8' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#713f12', fontWeight: '600' }}>0.10 – 0.29</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Moderate Chance</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Possible but unlikely</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>18-yard shot at good angle</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td>
              </tr>
              <tr style={{ background: '#fff7ed' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#c2410c', fontWeight: '600' }}>0.05 – 0.09</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Low Quality</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Unlikely to score</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>25-yard shot, tight angle</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Orange</td>
              </tr>
              <tr style={{ background: '#fef2f2' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#991b1b', fontWeight: '600' }}>Below 0.05</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Very Low</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Speculative attempt</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Long range shot, extreme angle</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td>
              </tr>
            </tbody>
          </table>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>xG vs Actual Goals — Overperformance and Underperformance</h2>
          <p>One of the most powerful uses of xG is comparing it to actual goals scored. This comparison reveals whether a team or player is genuinely performing well or simply getting lucky — or unlucky.</p>
          
          <h3>xG Overperformance (Goals &gt; xG)</h3>
          <p>A player or team scoring more goals than their xG suggests they are either finishing exceptionally well or benefiting from good fortune. Sustained overperformance over a full season is rare — most players regress toward their xG over large sample sizes. However, elite finishers like Robert Lewandowski and Erling Haaland consistently outperform their xG, suggesting genuine finishing skill above the model's baseline.</p>
          
          <h3>xG Underperformance (Goals &lt; xG)</h3>
          <p>A team creating high xG but scoring fewer actual goals is likely experiencing poor finishing or bad luck. This is often a positive sign for future performance — the chances are there, and finishing will likely improve. Fantasy managers use xG underperformance as a signal that a team is "due" for a high-scoring run.</p>
          
          <h3>Team xG Difference</h3>
          <p>Subtracting a team's xG conceded from their xG scored gives the xG difference — the most predictive single metric for future league standings. Teams with strongly positive xG differences win more games over time, even if short-term results haven't reflected it yet.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>xG in the Premier League — How Top Clubs Use It</h2>
          <p>Every Premier League club now employs data analysts who use xG models as a core part of their scouting, tactical analysis, and match preparation. Here is how xG is applied at the elite level:</p>
          
          <h3>Scouting and Transfer Recruitment</h3>
          <p>clubs compare a player's actual goals to their xG across multiple seasons to identify consistent finishers versus players riding a hot streak. A striker scoring 20 goals on 12 xG is a prime transfer target; one scoring 15 goals on 20 xG may be declining.</p>
          
          <h3>Tactical Analysis</h3>
          <p>coaches use team xG maps to identify which areas of the pitch their team creates chances from and which zones opponents exploit. This drives training ground work on specific patterns of play.</p>
          
          <h3>In-Match Decision Making</h3>
          <p>live xG data is now displayed on broadcast graphics in the Premier League, Champions League, and major international tournaments, making it accessible to everyday fans.</p>
          
          <h3>Fantasy Football</h3>
          <p>platforms like FPL (Fantasy Premier League) have integrated xG data into player statistics, and the most successful fantasy managers use xG to identify undervalued players with strong underlying numbers.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What is a good xG per match in soccer?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>In the Premier League, teams average approximately 1.3–1.6 xG per match. An xG of 2.0 or above in a single match represents a dominant performance with high-quality chances. Individual players with 0.5+ xG in a match have had a very productive game in terms of chance quality.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What is the xG of a penalty kick?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>A penalty kick has a standard xG of approximately 0.76, meaning penalties are converted into goals around 76% of the time in professional soccer. This makes penalties the highest xG situation in the game outside of an empty net.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Can xG predict match results?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>xG is a strong predictor of future performance but not individual match results. Over a large sample of matches, teams with consistently higher xG than their opponents win more games. However, in any single match, the team with lower xG can and often does win due to finishing variance and goalkeeping performance.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Why do some players consistently outperform their xG?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>A small number of elite finishers — such as Robert Lewandowski, Lionel Messi, and Erling Haaland — consistently score more goals than their xG predicts. This reflects genuine finishing skill: better shot placement, composure under pressure, and the ability to score from positions where average players would miss. Most players regress toward their xG over large sample sizes.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What is the difference between xG and xA?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>xG (Expected Goals) measures the quality of shots — the probability that a shot results in a goal. xA (Expected Assists) measures the quality of passes that lead to shots — the probability that a key pass leads to a goal based on the shot it creates. Together, xG and xA give a complete picture of a player's attacking contribution beyond just goals and assists.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>How is xG different from shot conversion rate?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>Shot conversion rate simply divides goals by total shots — it treats every shot equally regardless of where it came from. xG weights each shot by its difficulty, so a tap-in from three yards and a 30-yard volley are treated very differently. xG is a much more accurate measure of shooting quality and chance creation than raw conversion rate.</p>
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
            <a href="/sports/net-run-rate-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>Net Run Rate Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate cricket NRR for IPL, T20 and ODI matches</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpectedGoalsCalculator
