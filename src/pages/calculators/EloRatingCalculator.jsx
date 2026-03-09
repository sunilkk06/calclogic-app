import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const EloRatingCalculator = () => {
  const [activeTab, setActiveTab] = useState('single')
  
  // Tab 1: Single Match State
  const [myRating, setMyRating] = useState('1500')
  const [oppRating, setOppRating] = useState('1500')
  const [matchResult, setMatchResult] = useState('win') // win, draw, loss
  const [kFactorType, setKFactorType] = useState('standard')
  const [customKFactor, setCustomKFactor] = useState('32')
  const [gameType, setGameType] = useState('chess')
  const [singleResults, setSingleResults] = useState(null)

  // Tab 2: Multi-Match State
  const [startRating, setStartRating] = useState('1500')
  const [multiMatches, setMultiMatches] = useState([
    { opponentRating: '1500', result: 'win', kFactor: '32' }
  ])
  const [multiResults, setMultiResults] = useState(null)

  const defaultKFactors = {
    chess: { beginner: 40, standard: 20, master: 10 },
    leagueOfLegends: 32,
    valorant: 30,
    dota2: 25,
    cs2: 50,
    fifa: 20,
    generic: 32
  }

  const getKFactorValue = (type, game) => {
    if (type === 'custom') return parseFloat(customKFactor)
    const gameK = defaultKFactors[game]
    if (typeof gameK === 'object') {
      return gameK[type] || gameK.standard
    }
    return gameK
  }

  const expectedScore = (ratingA, ratingB) => {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
  }

  const actualScore = (result) => {
    if (result === 'win') return 1
    if (result === 'draw') return 0.5
    return 0
  }

  const calculateElo = (ratingA, ratingB, result, k) => {
    const expected = expectedScore(ratingA, ratingB)
    const actual = actualScore(result)
    const change = Math.round(k * (actual - expected))
    return {
      change,
      newRating: ratingA + change,
      expectedWinPct: (expected * 100).toFixed(1),
      winProbability: expected
    }
  }

  const handleSingleCalculate = (e) => {
    e.preventDefault()
    const k = getKFactorValue(kFactorType, gameType)
    const r1 = parseFloat(myRating)
    const r2 = parseFloat(oppRating)
    const res = calculateElo(r1, r2, matchResult, k)
    
    const diff = Math.abs(r1 - r2)
    let context = 'Very close match'
    let contextColor = '#64748b'
    if (diff > 350) { context = 'Overwhelming favorite'; contextColor = '#ef4444' }
    else if (diff > 200) { context = 'Strong favorite'; contextColor = '#f97316' }
    else if (diff > 100) { context = 'Clear favorite'; contextColor = '#eab308' }
    else if (diff > 50) { context = 'Slight favorite'; contextColor = '#22c55e' }

    setSingleResults({
      ...res,
      oppChange: -res.change,
      context,
      contextColor,
      result: matchResult
    })
  }

  const handleAddMatch = () => {
    if (multiMatches.length < 20) {
      setMultiMatches([...multiMatches, { opponentRating: '1500', result: 'win', kFactor: '32' }])
    }
  }

  const handleRemoveMatch = () => {
    if (multiMatches.length > 1) {
      setMultiMatches(multiMatches.slice(0, -1))
    }
  }

  const handleMultiMatchChange = (index, field, value) => {
    const newMatches = [...multiMatches]
    newMatches[index][field] = value
    setMultiMatches(newMatches)
  }

  const handleMultiCalculate = (e) => {
    e.preventDefault()
    let currentRating = parseFloat(startRating)
    const history = [{ match: 0, rating: currentRating, result: 'start' }]
    let totalWins = 0
    let bestWinOpp = 0
    let biggestUpset = 1.1

    const matchDetails = multiMatches.map((m, i) => {
      const oppR = parseFloat(m.opponentRating)
      const k = parseFloat(m.kFactor)
      const exp = expectedScore(currentRating, oppR)
      const res = calculateElo(currentRating, oppR, m.result, k)
      
      if (m.result === 'win') {
        totalWins++
        if (oppR > bestWinOpp) bestWinOpp = oppR
        if (exp < biggestUpset) biggestUpset = exp
      }

      currentRating = res.newRating
      history.push({ 
        match: i + 1, 
        rating: currentRating, 
        result: m.result,
        color: m.result === 'win' ? '#22c55e' : m.result === 'loss' ? '#ef4444' : '#eab308'
      })
      
      return {
        matchNum: i + 1,
        oppRating: oppR,
        result: m.result,
        expectedPct: (exp * 100).toFixed(1),
        change: res.change,
        ratingAfter: currentRating
      }
    })

    setMultiResults({
      finalRating: currentRating,
      totalChange: currentRating - parseFloat(startRating),
      history,
      matchDetails,
      winRate: ((totalWins / multiMatches.length) * 100).toFixed(1),
      avgChange: ((currentRating - parseFloat(startRating)) / multiMatches.length).toFixed(1),
      bestWin: bestWinOpp || 'N/A',
      biggestUpset: biggestUpset > 1 ? 'N/A' : (biggestUpset * 100).toFixed(1) + '%'
    })
  }

  const applyPreset = (p) => {
    setMyRating(p.myRating.toString())
    setOppRating(p.oppRating.toString())
    setMatchResult(p.result)
    setKFactorType('custom')
    setCustomKFactor(p.k.toString())
    setGameType(p.game || 'generic')
  }

  const presets = [
    { name: 'Underdog Win', myRating: 1200, oppRating: 1600, result: 'win', k: 32 },
    { name: 'Favourite Wins', myRating: 1800, oppRating: 1400, result: 'win', k: 20 },
    { name: 'Upset Loss', myRating: 1600, oppRating: 1200, result: 'loss', k: 32 },
    { name: 'Equal Match Draw', myRating: 1500, oppRating: 1500, result: 'draw', k: 20 },
    { name: 'Chess Master Win', myRating: 2200, oppRating: 2350, result: 'win', k: 10, game: 'chess' }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Elo Rating Calculator — Chess, eSports & Competitive Games | CalcLogic</title>
        <meta name="description" content="Free Elo rating calculator for chess, eSports, and competitive games. Calculate rating changes after wins and losses, expected win probability, and K-factor adjustments for any Elo-based ranking system." />
        <meta name="keywords" content="Elo rating calculator, elo calculator, chess elo calculator, elo rating system, elo score calculator, elo ranking calculator, esports elo calculator, elo rating change calculator, expected score elo" />
        <link rel="canonical" href="https://calclogic.com/sports/elo-rating-calculator" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Elo Rating Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate Elo rating changes, expected win probability, and K-factor adjustments for chess, eSports, and any competitive ranking system."
          }`}
        </script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Elo Rating Calculator</h1>
          <p className="calculator-description">
            Calculate rating changes for chess, eSports, and competitive games. Track your progress across multiple matches and compare different Elo systems.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          {['single', 'multi', 'reference'].map(tab => (
            <button
              key={tab}
              type="button"
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab ? '#2563eb' : 'transparent',
                color: activeTab === tab ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '0.5rem 0.5rem 0 0',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'single' ? 'Single Match' : tab === 'multi' ? 'Multi-Match Tracker' : 'System Comparison'}
            </button>
          ))}
        </div>

        {activeTab === 'single' && (
          <>
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

            <form onSubmit={handleSingleCalculate} className="calculator-form">
              <div className="input-section">
                <h2>Match Details</h2>
                <div className="input-group">
                  <label htmlFor="myRating">My Current Rating</label>
                  <input type="number" id="myRating" value={myRating} onChange={(e) => setMyRating(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label htmlFor="oppRating">Opponent Rating</label>
                  <input type="number" id="oppRating" value={oppRating} onChange={(e) => setOppRating(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label>Match Result</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['win', 'draw', 'loss'].map(res => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setMatchResult(res)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                          background: matchResult === res ? 
                            (res === 'win' ? '#22c55e' : res === 'draw' ? '#eab308' : '#ef4444') : '#f1f5f9',
                          color: matchResult === res ? 'white' : '#64748b'
                        }}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-section">
                <h2>Settings</h2>
                <div className="input-group">
                  <label htmlFor="gameType">Game Type</label>
                  <select id="gameType" value={gameType} onChange={(e) => setGameType(e.target.value)}>
                    <option value="chess">Chess</option>
                    <option value="leagueOfLegends">League of Legends</option>
                    <option value="valorant">Valorant</option>
                    <option value="dota2">Dota 2</option>
                    <option value="cs2">CS2</option>
                    <option value="fifa">FIFA</option>
                    <option value="generic">Generic Elo</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="kFactor">K-Factor</label>
                  <select id="kFactor" value={kFactorType} onChange={(e) => setKFactorType(e.target.value)}>
                    <option value="beginner">Beginner (32-40)</option>
                    <option value="standard">Standard (20-32)</option>
                    <option value="master">Master (10)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                {kFactorType === 'custom' && (
                  <div className="input-group">
                    <label htmlFor="customK">K Value</label>
                    <input type="number" id="customK" value={customKFactor} onChange={(e) => setCustomKFactor(e.target.value)} />
                  </div>
                )}
              </div>

              <button type="submit" className="calculate-btn">Calculate Elo Change</button>
            </form>
          </>
        )}

        {activeTab === 'multi' && (
          <form onSubmit={handleMultiCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Elo Tracker</h2>
              <div className="input-group">
                <label htmlFor="startRating">Starting Rating</label>
                <input type="number" id="startRating" value={startRating} onChange={(e) => setStartRating(e.target.value)} required />
              </div>
              
              {multiMatches.map((m, i) => (
                <div key={i} style={{ 
                  padding: '1rem', 
                  background: '#f8fafc', 
                  borderRadius: '8px', 
                  marginBottom: '1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '1rem',
                  alignItems: 'end'
                }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Opp Rating</label>
                    <input type="number" value={m.opponentRating} onChange={(e) => handleMultiMatchChange(i, 'opponentRating', e.target.value)} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Result</label>
                    <select value={m.result} onChange={(e) => handleMultiMatchChange(i, 'result', e.target.value)}>
                      <option value="win">Win</option>
                      <option value="draw">Draw</option>
                      <option value="loss">Loss</option>
                    </select>
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>K-Factor</label>
                    <input type="number" value={m.kFactor} onChange={(e) => handleMultiMatchChange(i, 'kFactor', e.target.value)} required />
                  </div>
                </div>
              ))}
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleAddMatch} style={{ flex: 1, padding: '0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Match</button>
                <button type="button" onClick={handleRemoveMatch} style={{ flex: 1, padding: '0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                <button type="button" onClick={() => setMultiMatches([{ opponentRating: '1500', result: 'win', kFactor: '32' }])} style={{ flex: 1, padding: '0.5rem', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset</button>
              </div>
            </div>
            <button type="submit" className="calculate-btn">Track Progression</button>
          </form>
        )}

        {activeTab === 'reference' && (
          <div className="input-section">
            <h2>Elo System Comparison</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                  <tr style={{ background: '#1e3a8a', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Game / Sport</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rating System</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>K-Factor</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Starting</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Chess (FIDE)', 'Classic Elo', '10–40', '1000', "Arpad Elo's original system"],
                    ['Chess.com', 'Glicko-2', 'Variable', '400', 'Online rapid/blitz'],
                    ['League of Legends', 'MMR-based', '~32', '1000', 'Hidden MMR, visible LP'],
                    ['Valorant', 'MMR-based', '~30', '0', 'Rank = Iron to Radiant'],
                    ['CS2 / CSGO', 'Glicko', '~50', '0', 'Premier rating system'],
                    ['Dota 2', 'MMR', '25–30', '0', 'Solo and party MMR'],
                    ['FIFA / FC', 'ELO-based', '20', '1200', 'Online seasons'],
                    ['Chess (US)', 'USCF Elo', '16–32', '100', 'Established players K=16']
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{row[0]}</td>
                      <td style={{ padding: '0.75rem' }}>{row[1]}</td>
                      <td style={{ padding: '0.75rem' }}>{row[2]}</td>
                      <td style={{ padding: '0.75rem' }}>{row[3]}</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'single' && singleResults && (
          <div className="results-section">
            <h2>Elo Calculation Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">New Elo Rating</span>
                <span className="result-value" style={{ 
                  fontSize: '3rem', 
                  fontWeight: '700',
                  color: singleResults.change > 0 ? '#22c55e' : singleResults.change < 0 ? '#ef4444' : '#eab308'
                }}>
                  {singleResults.newRating} {singleResults.change > 0 ? '↑' : singleResults.change < 0 ? '↓' : '→'}
                </span>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Your New Elo Rating</p>
              </div>
              <div className="result-item">
                <span className="result-label">Rating Change</span>
                <span className="result-value" style={{ 
                  color: singleResults.change > 0 ? '#22c55e' : singleResults.change < 0 ? '#ef4444' : '#64748b'
                }}>
                  {singleResults.change > 0 ? '+' : ''}{singleResults.change}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Win Probability</span>
                <span className="result-value">{singleResults.expectedWinPct}%</span>
                <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${singleResults.expectedWinPct}%`, background: '#2563eb' }}></div>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>Expected win probability before match</p>
              </div>
              <div className="result-item">
                <span className="result-label">Opponent Change</span>
                <span className="result-value" style={{ 
                  color: singleResults.oppChange > 0 ? '#22c55e' : singleResults.oppChange < 0 ? '#ef4444' : '#64748b'
                }}>
                  {singleResults.oppChange > 0 ? '+' : ''}{singleResults.oppChange}
                </span>
              </div>
              <div className="result-item" style={{ borderLeft: `6px solid ${singleResults.contextColor}` }}>
                <span className="result-label">Match Context</span>
                <span className="result-value" style={{ color: singleResults.contextColor }}>{singleResults.context}</span>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>Based on rating difference</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'multi' && multiResults && (
          <div className="results-section">
            <h2>Progression Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Final Rating</span>
                <span className="result-value" style={{ fontSize: '2.5rem' }}>{multiResults.finalRating}</span>
                <p style={{ color: multiResults.totalChange >= 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                  {multiResults.totalChange >= 0 ? '+' : ''}{multiResults.totalChange} Total
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Win Rate</span>
                <span className="result-value">{multiResults.winRate}%</span>
              </div>
              <div className="result-item">
                <span className="result-label">Best Win</span>
                <span className="result-value">{multiResults.bestWin}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Biggest Upset</span>
                <span className="result-value">{multiResults.biggestUpset}</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem', height: '300px' }}>
              <h3>Rating Progression</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={multiResults.history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="match" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#2563eb" strokeWidth={2} dot={(props) => {
                    const { cx, cy, payload } = props
                    return <circle cx={cx} cy={cy} r={4} fill={payload.color || '#2563eb'} stroke="none" />
                  }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1e3a8a', color: 'white' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Match</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Opponent</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Result</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Expected%</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Change</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rating After</th>
                  </tr>
                </thead>
                <tbody>
                  {multiResults.matchDetails.map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '0.75rem' }}>{m.matchNum}</td>
                      <td style={{ padding: '0.75rem' }}>{m.oppRating}</td>
                      <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{m.result}</td>
                      <td style={{ padding: '0.75rem' }}>{m.expectedPct}%</td>
                      <td style={{ padding: '0.75rem', color: m.change >= 0 ? '#22c55e' : '#ef4444', fontWeight: '600' }}>
                        {m.change >= 0 ? '+' : ''}{m.change}
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{m.ratingAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ShareButtons title="Elo Rating Calculator" url="https://calclogic.com/sports/elo-rating-calculator" />

        <div className="content-section">
          <h2>What is the Elo Rating System?</h2>
          <p>The Elo rating system is a method for calculating the relative skill levels of players in competitive games. Originally developed by Hungarian-American physics professor Arpad Elo in 1960 for chess, the Elo system has since been adopted by hundreds of competitive games, sports, and eSports platforms — from FIDE chess tournaments to League of Legends, Valorant, Dota 2, FIFA, and international football rankings.</p>
          <p>The core idea of Elo is simple: your rating goes up when you beat opponents and down when you lose. However, the amount your rating changes depends critically on the strength of your opponent. Beating a highly rated player earns far more points than beating someone rated below you. Losing to a weaker player costs more points than losing to a stronger one. Over time, this self-correcting mechanism ensures that your Elo rating converges toward a number that accurately reflects your true skill level.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How is Elo Rating Calculated?</h2>
          <p>The Elo calculation involves three steps:</p>
          <p><strong>Step 1 — Calculate Expected Score (Win Probability)</strong><br />
          The expected score formula predicts the probability of winning based on the rating difference between two players:<br />
          Expected Score = 1 ÷ (1 + 10^((Opponent Rating − Your Rating) ÷ 400))</p>
          <p><strong>Step 2 — Determine Actual Score</strong><br />
          Win = 1.0, Draw = 0.5, Loss = 0.0</p>
          <p><strong>Step 3 — Calculate Rating Change</strong><br />
          Rating Change = K × (Actual Score − Expected Score)</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>What is the K-Factor in Elo?</h2>
          <p>The K-factor determines how much your rating can change in a single match. A higher K-factor means ratings change faster and more dramatically; a lower K-factor means ratings are more stable and change slowly.</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>K-Factor</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Used For</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Effect</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: '40', used: 'Chess beginners (under 1000)', effect: 'High volatility — rating adjusts quickly for new players', color: '#ef4444' },
                  { k: '32', used: 'Most eSports / general use', effect: 'Standard volatility — balanced adjustment speed', color: '#f97316' },
                  { k: '24', used: 'Intermediate players', effect: 'Moderate volatility — established players', color: '#eab308' },
                  { k: '20', used: 'FIDE chess standard (under 2400)', effect: 'Lower volatility — more stable ratings', color: '#14b8a6' },
                  { k: '16', used: 'Experienced players', effect: 'Low volatility — rating reflects long-term skill', color: '#22c55e' },
                  { k: '10', used: 'FIDE chess masters (2400+)', effect: 'Very low volatility — elite ratings highly stable', color: '#3b82f6' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '1rem', borderLeft: `6px solid ${row.color}`, fontWeight: '600' }}>{row.k}</td>
                    <td style={{ padding: '1rem' }}>{row.used}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{row.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Elo Rating Ranges — What Do the Numbers Mean?</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Rating Range</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Level</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Win Probability vs 200-below</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['2400+', 'Grandmaster / Elite', '76%'],
                  ['2000–2399', 'Expert / Master', '76%'],
                  ['1800–1999', 'Advanced', '76%'],
                  ['1600–1799', 'Intermediate-High', '76%'],
                  ['1400–1599', 'Intermediate', '76%'],
                  ['1200–1399', 'Beginner-Intermediate', '76%'],
                  ['Below 1200', 'Beginner', '76%']
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>{row[0]}</td>
                    <td style={{ padding: '1rem' }}>{row[1]}</td>
                    <td style={{ padding: '1rem' }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Elo vs Glicko vs TrueSkill — Rating System Comparison</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>System</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Used By</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Key Improvement Over Elo</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>Elo</td>
                  <td style={{ padding: '1rem' }}>Chess (FIDE), many eSports</td>
                  <td style={{ padding: '1rem' }}>— Original system</td>
                  <td style={{ padding: '1rem' }}>1v1 head-to-head matches</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>Glicko / Glicko-2</td>
                  <td style={{ padding: '1rem' }}>Chess.com, Lichess, many games</td>
                  <td style={{ padding: '1rem' }}>Adds rating reliability (RD)</td>
                  <td style={{ padding: '1rem' }}>Players with irregular play frequency</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>TrueSkill</td>
                  <td style={{ padding: '1rem' }}>Xbox Live, Halo, Gears of War</td>
                  <td style={{ padding: '1rem' }}>Handles team games, multiple outcomes</td>
                  <td style={{ padding: '1rem' }}>Team-based multiplayer games</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { q: 'What is a good Elo rating?', a: 'Depends on the system. In FIDE chess, 1500 is casual, 2000 is expert, 2500+ is Grandmaster. In eSports, 1000-1500 is average, 2500-3000+ is top level.' },
              { q: 'Why does my Elo go up more when I beat a higher-rated opponent?', a: 'Elo rewards upsets. Beating a stronger opponent exceeds expectations, yielding more points. Losing to a weaker opponent falls below expectations, costing more.' },
              { q: 'What does a 400-point Elo difference mean?', a: 'It means the higher-rated player has approximately a 91% win probability. A 200-point difference corresponds to roughly 76%.' }
            ].map((faq, i) => (
              <details key={i} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem' }}>
                <summary style={{ fontWeight: '600', cursor: 'pointer' }}>{faq.q}</summary>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Related Calculators</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <a href="/sports/pickleball-rating-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Pickleball DUPR</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Estimate your pickleball rating</p>
            </a>
            <a href="/sports/golf-handicap-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Golf Handicap</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Calculate your golf handicap index</p>
            </a>
            <a href="/sports/true-shooting-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>True Shooting %</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Calculate basketball scoring efficiency</p>
            </a>
            <a href="/sports/wilks-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Wilks Score</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Compare powerlifting relative strength</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EloRatingCalculator
