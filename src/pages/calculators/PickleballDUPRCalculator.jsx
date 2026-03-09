import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const PickleballDUPRCalculator = () => {
  const [activeTab, setActiveTab] = useState('match')
  const [myRating, setMyRating] = useState('4.0')
  const [format, setFormat] = useState('doubles')
  const [numMatches, setNumMatches] = useState(1)
  const [matches, setMatches] = useState([
    { type: 'doubles', myScore: '', oppScore: '', opponentRating: '', location: 'recreational' }
  ])
  const [results, setResults] = useState(null)

  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null
  })
  const [assessmentResult, setAssessmentResult] = useState(null)

  const handleNumMatchesChange = (e) => {
    const val = parseInt(e.target.value)
    setNumMatches(val)
    const newMatches = [...matches]
    if (val > matches.length) {
      for (let i = matches.length; i < val; i++) {
        newMatches.push({ type: format, myScore: '', oppScore: '', opponentRating: '', location: 'recreational' })
      }
    } else {
      newMatches.splice(val)
    }
    setMatches(newMatches)
  }

  const handleMatchChange = (index, field, value) => {
    const newMatches = [...matches]
    newMatches[index][field] = value
    setMatches(newMatches)
  }

  const getDUPRCategory = (rating) => {
    const r = parseFloat(rating)
    if (r < 3.0) return { label: 'Beginner', color: '#ef4444' }
    if (r < 3.5) return { label: 'Beginner+', color: '#f97316' }
    if (r < 4.0) return { label: 'Intermediate', color: '#eab308' }
    if (r < 4.5) return { label: 'Intermediate+', color: '#14b8a6' }
    if (r < 5.0) return { label: 'Advanced', color: '#22c55e' }
    if (r < 5.5) return { label: 'Advanced+', color: '#3b82f6' }
    if (r < 6.0) return { label: 'Elite', color: '#a855f7' }
    return { label: 'Professional', color: '#fbbf24' }
  }

  const estimateDUPRChange = (myRating, opponentRating, myScore, oppScore, matchLocation) => {
    const kFactor = matchLocation === 'tournament' ? 32 :
                    matchLocation === 'club' ? 24 : 16

    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400))
    const totalGames = myScore + oppScore
    const actualScore = totalGames > 0 ? myScore / totalGames : 0.5
    const ratingChange = kFactor * (actualScore - expectedScore)

    return {
      change: ratingChange,
      newRating: myRating + ratingChange,
      expectedWinPct: (expectedScore * 100).toFixed(1)
    }
  }

  const handleCalculateMatch = (e) => {
    e.preventDefault()
    let currentRating = parseFloat(myRating)
    const startRating = currentRating
    
    const matchResults = matches.map(match => {
      const res = estimateDUPRChange(
        currentRating,
        parseFloat(match.opponentRating),
        parseFloat(match.myScore),
        parseFloat(match.oppScore),
        match.location
      )
      currentRating = res.newRating
      return {
        ...res,
        opponentRating: match.opponentRating,
        score: `${match.myScore}-${match.oppScore}`,
        result: parseFloat(match.myScore) > parseFloat(match.oppScore) ? 'W' : 'L'
      }
    })

    setResults({
      startRating,
      endRating: currentRating.toFixed(2),
      totalChange: (currentRating - startRating).toFixed(2),
      matchResults,
      category: getDUPRCategory(currentRating)
    })
  }

  const handleAssessmentSubmit = (e) => {
    e.preventDefault()
    const answers = Object.values(assessmentAnswers)
    if (answers.includes(null)) return

    const totalScore = answers.reduce((sum, score) => sum + score, 0)
    const maxScore = answers.length * 5
    const percentage = totalScore / maxScore
    const estimatedDUPR = 2.0 + (percentage * 4.5)

    setAssessmentResult({
      estimatedDUPR: estimatedDUPR.toFixed(2),
      category: getDUPRCategory(estimatedDUPR),
      totalScore,
      maxScore,
      answers: assessmentAnswers
    })
  }

  const applyPreset = (preset) => {
    setMyRating(preset.myRating.toString())
    setNumMatches(1)
    setMatches([{
      type: preset.format,
      myScore: preset.myScore.toString(),
      oppScore: preset.oppScore.toString(),
      opponentRating: preset.oppRating.toString(),
      location: preset.location
    }])
  }

  const presets = [
    { name: 'Tournament Win vs Better Player', myRating: 4.0, oppRating: 4.5, myScore: 2, oppScore: 1, location: 'tournament', format: 'doubles' },
    { name: 'Club Win vs Equal', myRating: 3.5, oppRating: 3.5, myScore: 2, oppScore: 0, location: 'club', format: 'doubles' },
    { name: 'Recreational Loss', myRating: 4.0, oppRating: 3.5, myScore: 0, oppScore: 2, location: 'recreational', format: 'doubles' },
    { name: 'Upset Win', myRating: 3.8, oppRating: 4.8, myScore: 2, oppScore: 1, location: 'tournament', format: 'doubles' }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Pickleball Rating Calculator — Estimate Your DUPR Rating | CalcLogic</title>
        <meta name="description" content="Free pickleball rating calculator. Estimate your DUPR rating from your match results, win/loss record, and opponent ratings. Includes skill level guide, rating scale, and how to improve your pickleball rating." />
        <meta name="keywords" content="pickleball rating calculator, DUPR rating calculator, pickleball skill level calculator, pickleball rating estimator, DUPR score calculator, pickleball rating system, pickleball skill assessment, DUPR pickleball 2025" />
        <link rel="canonical" href="https://calclogic.com/sports/pickleball-rating-calculator" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Pickleball DUPR Rating Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Estimate your pickleball DUPR rating from match results and skill assessment. Includes complete rating scale and skill level guide."
          }`}
        </script>
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a good DUPR rating for a recreational pickleball player?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The average recreational pickleball player has a DUPR rating between 3.5 and 4.0. A rating of 4.0 to 4.5 represents a strong club-level player. Anything above 5.0 is considered elite and typically involves regular tournament competition."
                }
              },
              {
                "@type": "Question",
                "name": "How is DUPR different from self-rating in pickleball?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Self-rating is a subjective assessment of your own skill level, often used for recreational league placement. DUPR is an objective, data-driven rating calculated from your actual match results against rated opponents. DUPR is significantly more accurate than self-rating because it accounts for opponent quality, score margins, and match type."
                }
              },
              {
                "@type": "Question",
                "name": "How do I get an official DUPR rating?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To get an official DUPR rating, register for a free account at mydupr.com. Once registered, submit your match results including your opponent's DUPR profile. After a minimum number of results are submitted, DUPR will calculate your official rating. You can also earn a DUPR rating by playing in DUPR-sanctioned tournaments."
                }
              },
              {
                "@type": "Question",
                "name": "Does DUPR rating apply to both singles and doubles?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — DUPR maintains separate ratings for singles and doubles pickleball, as performance in each format requires different skills. Many players have different singles and doubles DUPR ratings. When entering tournaments, you typically need to use your relevant singles or doubles DUPR rating for the correct draw."
                }
              },
              {
                "@type": "Question",
                "name": "How often does DUPR update?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DUPR ratings update dynamically — typically within 24–72 hours after match results are submitted and verified. Unlike end-of-season rating systems, DUPR reflects your current form rather than a static annual calculation. This means a strong run of results can quickly improve your rating."
                }
              },
              {
                "@type": "Question",
                "name": "What is Ben Johns' DUPR rating?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Ben Johns, widely considered the best pickleball player in the world, has a DUPR rating near 8.0 — the highest level on the scale. He has held the number one ranking on both the PPA Tour and in the DUPR system for extended periods, dominating both singles and doubles competition."
                }
              },
              {
                "@type": "Question",
                "name": "Is this an official DUPR calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No — this is an unofficial estimator based on publicly known principles of how DUPR works (Elo-style opponent weighting and score margin inclusion). The official DUPR algorithm is proprietary and owned by DUPR LLC. For your official DUPR rating, visit mydupr.com. Our calculator provides a useful estimate for understanding how results might affect your rating."
                }
              }
            ]
          }`}
        </script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Pickleball DUPR Rating Calculator</h1>
          <p className="calculator-description">
            Estimate your pickleball rating based on match results or skill assessment. Compare your level with the official DUPR scale.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'match' ? 'active' : ''}`}
            onClick={() => setActiveTab('match')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'match' ? '#2563eb' : 'transparent',
              color: activeTab === 'match' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Match-Based Estimator
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessment')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'assessment' ? '#2563eb' : 'transparent',
              color: activeTab === 'assessment' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Skill Self-Assessment
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'reference' ? '#2563eb' : 'transparent',
              color: activeTab === 'reference' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Rating Scale Reference
          </button>
        </div>

        {activeTab === 'match' && (
          <>
            <div style={{ 
              background: '#fef3c7', 
              border: '1px solid #fcd34d', 
              borderRadius: '8px', 
              padding: '1rem', 
              marginBottom: '2rem',
              color: '#92400e',
              fontSize: '0.9rem'
            }}>
              <strong>Important Note on DUPR:</strong> DUPR (Dynamic Universal Pickleball Rating) is a proprietary algorithm owned by DUPR LLC. Our calculator provides an ESTIMATE based on publicly known principles — it is NOT an official DUPR calculation. For your official DUPR rating, visit mydupr.com.
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Quick-Fill Presets</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {presets.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyPreset(p)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f97316',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCalculateMatch} className="calculator-form">
              <div className="input-section">
                <h2>My Info</h2>
                <div className="input-group">
                  <label htmlFor="myRating">My Current Rating</label>
                  <input
                    type="number"
                    id="myRating"
                    value={myRating}
                    onChange={(e) => setMyRating(e.target.value)}
                    step="0.01"
                    min="2.0"
                    max="8.0"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="format">Default Format</label>
                  <select id="format" value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option value="singles">Singles</option>
                    <option value="doubles">Doubles</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="numMatches">Number of Matches</label>
                  <select id="numMatches" value={numMatches} onChange={handleNumMatchesChange}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="input-section">
                <h2>Match Results</h2>
                {matches.map((m, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    background: '#f8fafc', 
                    borderRadius: '8px', 
                    marginBottom: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Type</label>
                      <select value={m.type} onChange={(e) => handleMatchChange(i, 'type', e.target.value)}>
                        <option value="singles">Singles</option>
                        <option value="doubles">Doubles</option>
                      </select>
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Your Score</label>
                      <input type="number" value={m.myScore} onChange={(e) => handleMatchChange(i, 'myScore', e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Opp Score</label>
                      <input type="number" value={m.oppScore} onChange={(e) => handleMatchChange(i, 'oppScore', e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Opp Rating</label>
                      <input type="number" step="0.01" value={m.opponentRating} onChange={(e) => handleMatchChange(i, 'opponentRating', e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label>Location</label>
                      <select value={m.location} onChange={(e) => handleMatchChange(i, 'location', e.target.value)}>
                        <option value="tournament">Sanctioned Tournament</option>
                        <option value="club">Club Play</option>
                        <option value="recreational">Recreational</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="calculate-btn">Estimate Rating Change</button>
            </form>
          </>
        )}

        {activeTab === 'assessment' && (
          <form onSubmit={handleAssessmentSubmit} className="calculator-form">
            <div className="input-section">
              <h2>Skill Self-Assessment</h2>
              
              <div className="assessment-question" style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Q1: How long have you been playing pickleball?</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {['Less than 6 months', '6 months – 1 year', '1–2 years', '2–4 years', '4+ years'].map((text, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="q1" required onChange={() => setAssessmentAnswers({...assessmentAnswers, q1: i+1})} checked={assessmentAnswers.q1 === i+1} />
                      {text}
                    </label>
                  ))}
                </div>
              </div>

              <div className="assessment-question" style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Q2: How would you describe your serve?</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {['I\'m still learning to serve consistently', 'I can serve in consistently but without much placement', 'I can place my serve to the backhand or wide', 'I serve with spin, depth, and consistent placement', 'I use my serve as a weapon with power and variety'].map((text, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="q2" required onChange={() => setAssessmentAnswers({...assessmentAnswers, q2: i+1})} checked={assessmentAnswers.q2 === i+1} />
                      {text}
                    </label>
                  ))}
                </div>
              </div>

              <div className="assessment-question" style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Q3: How is your dinking game?</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {['I\'m not sure what a dink is', 'I can dink but make frequent errors', 'I can sustain a dink rally with moderate consistency', 'I dink cross-court and down the line with good control', 'I use dinking strategically to set up attacks'].map((text, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="q3" required onChange={() => setAssessmentAnswers({...assessmentAnswers, q3: i+1})} checked={assessmentAnswers.q3 === i+1} />
                      {text}
                    </label>
                  ))}
                </div>
              </div>

              <div className="assessment-question" style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Q4: How do you handle the kitchen (non-volley zone)?</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {['I avoid the kitchen line', 'I get to the kitchen but feel uncomfortable there', 'I\'m comfortable at the kitchen line in doubles', 'I control the kitchen and recognize when to reset vs attack', 'The kitchen is where I dominate — I control pace and patterns'].map((text, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="q4" required onChange={() => setAssessmentAnswers({...assessmentAnswers, q4: i+1})} checked={assessmentAnswers.q4 === i+1} />
                      {text}
                    </label>
                  ))}
                </div>
              </div>

              <div className="assessment-question" style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Q5: How is your third shot drop?</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {['I don\'t know what a third shot drop is', 'I know what it is but can\'t execute it consistently', 'I can hit a third shot drop maybe 50% of the time', 'My third shot drop is a reliable part of my game', 'I choose between third shot drop and drive strategically'].map((text, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="q5" required onChange={() => setAssessmentAnswers({...assessmentAnswers, q5: i+1})} checked={assessmentAnswers.q5 === i+1} />
                      {text}
                    </label>
                  ))}
                </div>
              </div>

              <div className="assessment-question" style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '1rem' }}>Q6: How do you perform under match pressure?</p>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {['I rarely play competitive matches', 'My game falls apart in close matches', 'I compete but sometimes lose focus at key moments', 'I stay composed and play my game under pressure', 'I elevate my game in big moments consistently'].map((text, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', cursor: 'pointer' }}>
                      <input type="radio" name="q6" required onChange={() => setAssessmentAnswers({...assessmentAnswers, q6: i+1})} checked={assessmentAnswers.q6 === i+1} />
                      {text}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Get Assessment Result</button>
          </form>
        )}

        {activeTab === 'reference' && (
          <div className="input-section">
            <h2>DUPR Rating Scale Reference</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: '#1e3a8a', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>DUPR Range</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Skill Level</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['2.0 – 2.5', 'Beginner', 'New to pickleball, learning basic rules and scoring'],
                    ['2.5 – 3.0', 'Beginner+', 'Can sustain short rallies, learning kitchen play'],
                    ['3.0 – 3.5', 'Intermediate', 'Consistent groundstrokes, developing dink game'],
                    ['3.5 – 4.0', 'Intermediate+', 'Reliable third shot, comfortable at kitchen line'],
                    ['4.0 – 4.5', 'Advanced', 'Strategic play, consistent in competitive club matches'],
                    ['4.5 – 5.0', 'Advanced+', 'Tournament competitor, strong in all areas'],
                    ['5.0 – 5.5', 'Elite', 'Regional tournament winner, top club player'],
                    ['5.5 – 6.0', 'Elite+', 'National level competitor'],
                    ['6.0 – 7.0', 'Professional', 'Semi-professional / APP/PPA Tour level'],
                    ['7.0 – 8.0', 'Top Professional', 'PPA Tour top players, Ben Johns level']
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{row[0]}</td>
                      <td style={{ padding: '0.75rem' }}>{row[1]}</td>
                      <td style={{ padding: '0.75rem' }}>{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              <div style={{ background: '#1e2235', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#fbbf24' }}>Famous Players</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>Ben Johns (~8.0)</li>
                  <li style={{ marginBottom: '0.5rem' }}>Anna Leigh Waters (~8.0)</li>
                  <li>Tyson McGuffin (~7.5)</li>
                </ul>
              </div>
              <div style={{ background: '#1e2235', color: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#fbbf24' }}>Benchmarks</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>Avg Recreational: 3.5–4.0</li>
                  <li>Avg Tournament: 4.5–5.0</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Match Results Display */}
        {activeTab === 'match' && results && (
          <div className="results-section">
            <h2>Estimated DUPR Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Estimated New Rating</span>
                <span className="result-value" style={{ 
                  fontSize: '3rem', 
                  fontWeight: '700',
                  color: parseFloat(results.totalChange) >= 0 ? '#22c55e' : '#ef4444'
                }}>
                  {results.endRating} {parseFloat(results.totalChange) >= 0 ? '↑' : '↓'}
                </span>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Estimated DUPR After These Matches</p>
              </div>
              <div className="result-item">
                <span className="result-label">Total Rating Change</span>
                <span className="result-value" style={{ 
                  color: parseFloat(results.totalChange) >= 0 ? '#22c55e' : '#ef4444'
                }}>
                  {parseFloat(results.totalChange) >= 0 ? '+' : ''}{results.totalChange}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Skill Level</span>
                <div style={{ 
                  background: results.category.color, 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '1rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '0.5rem'
                }}>
                  {results.category.label}
                </div>
              </div>
            </div>

            <h3>Match Log</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: '#1e3a8a', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Match</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Opponent Rating</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Result</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Expected Win%</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rating Change</th>
                  </tr>
                </thead>
                <tbody>
                  {results.matchResults.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '0.75rem' }}>{i + 1}</td>
                      <td style={{ padding: '0.75rem' }}>{m.opponentRating}</td>
                      <td style={{ padding: '0.75rem' }}>{m.result} {m.score}</td>
                      <td style={{ padding: '0.75rem' }}>{m.expectedWinPct}%</td>
                      <td style={{ padding: '0.75rem', color: m.change >= 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                        {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
              "This is an estimate based on publicly known Elo-style principles. Your actual DUPR rating is calculated by the official DUPR algorithm at mydupr.com and may differ."
            </p>
          </div>
        )}

        {/* Assessment Results Display */}
        {activeTab === 'assessment' && assessmentResult && (
          <div className="results-section">
            <h2>Assessment Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Estimated DUPR</span>
                <span className="result-value" style={{ fontSize: '3rem', fontWeight: '700' }}>{assessmentResult.estimatedDUPR}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Skill Level</span>
                <div style={{ 
                  background: assessmentResult.category.color, 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '1rem',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '0.5rem'
                }}>
                  {assessmentResult.category.label}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h3>Skill Analysis</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Experience', score: assessmentResult.answers.q1 },
                  { label: 'Serve', score: assessmentResult.answers.q2 },
                  { label: 'Dinking', score: assessmentResult.answers.q3 },
                  { label: 'Kitchen Control', score: assessmentResult.answers.q4 },
                  { label: '3rd Shot Drop', score: assessmentResult.answers.q5 },
                  { label: 'Pressure Performance', score: assessmentResult.answers.q6 }
                ].map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{skill.label}</span>
                      <span style={{ fontSize: '0.9rem' }}>{skill.score}/5</span>
                    </div>
                    <div style={{ height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(skill.score / 5) * 100}%`, background: '#2563eb', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: '#eff6ff', 
              borderRadius: '12px',
              border: '1px solid #bfdbfe'
            }}>
              <h3 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>Next Steps</h3>
              <p style={{ margin: 0, color: '#1e40af' }}>
                To reach the next level ({getDUPRCategory(parseFloat(assessmentResult.estimatedDUPR) + 0.5).label}), focus on:
                {parseFloat(assessmentResult.estimatedDUPR) < 3.5 ? 
                  ' mastering kitchen line positioning and consistent serves.' : 
                  ' improving your 3rd shot drop reliability and strategic pattern recognition.'}
              </p>
            </div>
          </div>
        )}

        <ShareButtons 
          title="Pickleball DUPR Rating Calculator" 
          url="https://calclogic.com/sports/pickleball-rating-calculator" 
        />

        {/* SEO Content Sections */}
        <div className="content-section">
          <h2>What is a DUPR Rating in Pickleball?</h2>
          <p>DUPR (Dynamic Universal Pickleball Rating) is the most widely used rating system in pickleball, designed to give every player — from complete beginners to professional competitors — a single, accurate, and portable skill rating on a scale from 2.0 to 8.0. Created by Major League Pickleball co-founder Steve Kuhn and launched in 2021, DUPR has become the gold standard for pickleball skill assessment worldwide with millions of registered players.</p>
          <p>Unlike older pickleball rating systems such as UTPR (USA Pickleball Tournament Player Rating) which only counted tournament results, DUPR incorporates results from all match types — sanctioned tournaments, club leagues, recreational play, and even social matches — giving a more complete and dynamic picture of a player's true skill level.</p>
          <p>A DUPR rating of 2.0 represents a complete beginner. The scale tops out at 8.0, which is reserved for the best professional players in the world such as Ben Johns and Anna Leigh Waters. The average recreational pickleball player typically falls between 3.5 and 4.0.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How Does the DUPR Rating System Work?</h2>
          <p>DUPR uses a proprietary algorithm that updates your rating after every registered match. While the exact formula is not publicly disclosed, DUPR is built on principles similar to the Elo rating system used in chess and other competitive sports:</p>
          
          <p><strong>Opponent Rating Matters</strong><br />
          Beating a higher-rated opponent earns you more rating points than beating a lower-rated player. Losing to a lower-rated player costs more than losing to someone rated above you. This ensures your rating accurately reflects the quality of competition you face, not just your win-loss record.</p>

          <p><strong>Score Margin Is Included</strong><br />
          Unlike pure Elo systems, DUPR incorporates the score of the match — not just the result. Winning 11-2 earns more rating points than winning 11-9, and losing 11-9 costs fewer points than losing 11-2. This rewards dominant performances and reduces the penalty for close losses.</p>

          <p><strong>Match Type Weighting</strong><br />
          Sanctioned tournament matches carry more weight in the DUPR algorithm than recreational matches. This ensures that competitive results have a stronger influence on your rating than casual games, while still allowing recreational play to contribute.</p>

          <p><strong>Dynamic Updates</strong><br />
          DUPR ratings update continuously as new results are submitted. Your rating reflects your most recent form rather than a static end-of-season calculation.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>DUPR Rating Scale — Complete Skill Level Guide</h2>
          <p>Use this table to find your level and understand what each rating range represents:</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>DUPR Rating</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Level</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Skills at This Level</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: '7.0 – 8.0', level: 'Top Professional', skills: 'Elite professional tour player. Competes at the highest level of PPA/APP Tour. Exceptional in all areas — power, touch, strategy, and consistency.', color: '#fbbf24' },
                  { range: '6.0 – 6.9', level: 'Professional', skills: 'Semi-professional or top amateur. Wins regional and national open tournaments. Near-perfect execution in all shot categories.', color: '#3b82f6' },
                  { range: '5.5 – 5.9', level: 'Elite+', skills: 'National-level competitor. Wins age-group nationals or open regional events. Consistent in all areas under pressure.', color: '#a855f7' },
                  { range: '5.0 – 5.4', level: 'Elite', skills: 'Top club player and regular tournament competitor. Strong in all areas — serves, thirds, dinking, attacking, and resetting.', color: '#22c55e' },
                  { range: '4.5 – 4.9', level: 'Advanced+', skills: 'Competitive tournament player. Reliable third shot drop and drive. Controls the kitchen well. Identifies patterns and exploits weaknesses.', color: '#14b8a6' },
                  { range: '4.0 – 4.4', level: 'Advanced', skills: 'Strong club player. Consistent serve, reliable dink rallies, developing tournament game. Most strokes are dependable under moderate pressure.', color: '#3b82f6' },
                  { range: '3.5 – 3.9', level: 'Intermediate+', skills: 'Comfortable in rallies. Third shot drop improving. Kitchen play developing. Beginning to play strategically rather than reactively.', color: '#eab308' },
                  { range: '3.0 – 3.4', level: 'Intermediate', skills: 'Can sustain rallies. Learning kitchen line play. Serves consistently. Still makes frequent unforced errors under pressure.', color: '#f97316' },
                  { range: '2.5 – 2.9', level: 'Beginner+', skills: 'Understands basic rules and scoring. Short consistent rallies possible. Beginning to learn dinking and kitchen concepts.', color: '#ef4444' },
                  { range: '2.0 – 2.4', level: 'Beginner', skills: 'New to the sport. Still learning rules, basic strokes, and court positioning.', color: '#ef4444' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '1rem', borderLeft: `6px solid ${row.color}`, fontWeight: '600' }}>{row.range}</td>
                    <td style={{ padding: '1rem' }}>{row.level}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{row.skills}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>DUPR vs UTPR vs Self-Rating — Which System Should You Use?</h2>
          <p>Three rating systems exist in pickleball, each with different purposes:</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>System</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Full Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Who Uses It</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>What Counts</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>DUPR</td>
                  <td style={{ padding: '1rem' }}>Dynamic Universal Pickleball Rating</td>
                  <td style={{ padding: '1rem' }}>Most widely used globally</td>
                  <td style={{ padding: '1rem' }}>All match types</td>
                  <td style={{ padding: '1rem' }}>All players — most accurate</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>UTPR</td>
                  <td style={{ padding: '1rem' }}>USA Pickleball Tournament Rating</td>
                  <td style={{ padding: '1rem' }}>USA Pickleball members</td>
                  <td style={{ padding: '1rem' }}>Sanctioned tournaments only</td>
                  <td style={{ padding: '1rem' }}>Competitive USA players</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>Self-Rating</td>
                  <td style={{ padding: '1rem' }}>Player self-assessment</td>
                  <td style={{ padding: '1rem' }}>Recreational leagues</td>
                  <td style={{ padding: '1rem' }}>Self-reported</td>
                  <td style={{ padding: '1rem' }}>Social / recreational play</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Why DUPR is the best system:</strong><br />
          DUPR is the most accurate and widely accepted rating because it includes all match types, updates dynamically, and is used by Major League Pickleball (MLP) — the sport's premier professional league — to draft players. If you play any organized pickleball in 2025 or 2026, DUPR is the rating system that matters most.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Famous Pickleball Players and Their DUPR Ratings</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Player</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>DUPR Rating</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Notable Achievement</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>Ben Johns</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>~8.0</td>
                  <td style={{ padding: '1rem' }}>Most dominant player in pickleball history, multiple PPA titles</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
                  <td style={{ padding: '1rem' }}>Anna Leigh Waters</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>~8.0</td>
                  <td style={{ padding: '1rem' }}>Multiple PPA Champion, youngest top-ranked female player</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>Tyson McGuffin</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>~7.5</td>
                  <td style={{ padding: '1rem' }}>Multiple national champion, known for aggressive style</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
                  <td style={{ padding: '1rem' }}>Simone Jardim</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>~7.3</td>
                  <td style={{ padding: '1rem' }}>Former #1 women's player, multiple US Open titles</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Improve Your Pickleball DUPR Rating</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3>1. Play sanctioned matches.</h3>
              <p>Sanctioned tournament matches carry the most weight in DUPR. Even if you lose, playing tournaments helps establish an accurate rating and gives your wins maximum value.</p>
            </div>
            <div>
              <h3>2. Eliminate unforced errors.</h3>
              <p>The fastest way to win more points at recreational and club level is making fewer mistakes. Consistent, high-percentage shots beat flashy winners at every level below 5.0.</p>
            </div>
            <div>
              <h3>3. Master the third shot drop.</h3>
              <p>The soft shot from the baseline that lands in the kitchen is the most important shot in doubles. It allows you to get to the kitchen, where most points are won.</p>
            </div>
            <div>
              <h3>4. Dominate the kitchen line.</h3>
              <p>Pickleball points are largely determined by who controls the kitchen. Practice moving quickly to the line after your third shot and maintaining position there.</p>
            </div>
            <div>
              <h3>5. Beat higher-rated players.</h3>
              <p>Beating players 0.3–0.5 above your current rating is the fastest way to grow your rating, as DUPR weights opponent quality heavily.</p>
            </div>
            <div>
              <h3>6. Register all your matches.</h3>
              <p>Every win counts — even recreational ones. Make sure you and your opponents are registered on mydupr.com and submit results after every match.</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { q: 'What is a good DUPR rating for a recreational pickleball player?', a: 'The average recreational player has a DUPR rating between 3.5 and 4.0. A rating of 4.0 to 4.5 represents a strong club-level player. Anything above 5.0 is considered elite.' },
              { q: 'How is DUPR different from self-rating?', a: 'Self-rating is subjective, while DUPR is objective and data-driven, calculated from actual results against rated opponents. DUPR accounts for opponent quality and score margins.' },
              { q: 'How do I get an official DUPR rating?', a: 'Register for free at mydupr.com, then submit match results or play in DUPR-sanctioned tournaments.' },
              { q: 'Does DUPR apply to both singles and doubles?', a: 'Yes — DUPR maintains separate ratings for singles and doubles as they require different skill sets.' }
            ].map((faq, i) => (
              <details key={i} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                <summary style={{ fontWeight: '600', cursor: 'pointer' }}>{faq.q}</summary>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related Calculators */}
        <div className="content-section">
          <h2>Related Calculators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="/sports/vo2-max-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>VO2 Max Calculator</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Calculate your cardiovascular fitness level</p>
            </a>
            <a href="/sports/pace-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Pace Calculator</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Calculate running pace and split times</p>
            </a>
            <a href="/sports/one-rep-max-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>1-Rep Max Calculator</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Estimate your maximum lifting strength</p>
            </a>
            <a href="/sports/golf-handicap-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Golf Handicap Calculator</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Calculate your official golf handicap index</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PickleballDUPRCalculator
