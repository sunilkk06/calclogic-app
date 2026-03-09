import React, { useState, useEffect } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'

const HeartRateZonesCalculator = () => {
  const [activeTab, setActiveTab] = useState('zones')
  
  // Tab 1: Inputs
  const [age, setAge] = useState('32')
  const [restingHR, setRestingHR] = useState('65')
  const [maxHRInput, setMaxHRInput] = useState('')
  const [method, setMethod] = useState('fox')
  const [gender, setGender] = useState('male')
  const [fitnessLevel, setFitnessLevel] = useState('moderate')
  const [showComparison, setShowComparison] = useState(false)
  
  // Results State
  const [results, setResults] = useState(null)
  
  // Tab 2: Training Plan State
  const [goal, setGoal] = useState('generalHealth')

  const foxMaxHR = (age) => 220 - age
  const tanakaMaxHR = (age) => Math.round(208 - (0.7 * age))
  const gulatiMaxHR = (age) => Math.round(206 - (0.88 * age))

  const karvonenTargetHR = (maxHR, restingHR, intensityPercent) => {
    const hrr = maxHR - restingHR
    return Math.round((hrr * (intensityPercent / 100)) + restingHR)
  }

  const simpleTargetHR = (maxHR, intensityPercent) => {
    return Math.round(maxHR * (intensityPercent / 100))
  }

  const calculateZones = () => {
    const numericAge = parseInt(age)
    const numericRestingHR = parseInt(restingHR)
    
    let estimatedMaxHR
    if (maxHRInput) {
      estimatedMaxHR = parseInt(maxHRInput)
    } else {
      if (method === 'fox') estimatedMaxHR = foxMaxHR(numericAge)
      else if (method === 'tanaka') estimatedMaxHR = tanakaMaxHR(numericAge)
      else if (method === 'gulati') estimatedMaxHR = gulatiMaxHR(numericAge)
      else estimatedMaxHR = foxMaxHR(numericAge)
    }

    const hrr = estimatedMaxHR - numericRestingHR

    const zones = {
      zone1: {
        name: 'Zone 1 — Active Recovery',
        min: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 50),
        max: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 60),
        simpleMin: simpleTargetHR(estimatedMaxHR, 50),
        simpleMax: simpleTargetHR(estimatedMaxHR, 60),
        minPct: 50,
        maxPct: 60,
        color: '#4ade80',
        description: 'Very easy effort. Warm-up, cool-down, recovery days.',
        duration: 'Hours',
        goal: 'Recovery'
      },
      zone2: {
        name: 'Zone 2 — Fat Burn / Aerobic Base',
        min: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 60),
        max: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 70),
        simpleMin: simpleTargetHR(estimatedMaxHR, 60),
        simpleMax: simpleTargetHR(estimatedMaxHR, 70),
        minPct: 60,
        maxPct: 70,
        color: '#86efac',
        description: 'Easy conversational pace. The foundation of endurance fitness.',
        duration: '45–90 min',
        goal: 'Endurance base'
      },
      zone3: {
        name: 'Zone 3 — Aerobic / Cardio',
        min: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 70),
        max: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 80),
        simpleMin: simpleTargetHR(estimatedMaxHR, 70),
        simpleMax: simpleTargetHR(estimatedMaxHR, 80),
        minPct: 70,
        maxPct: 80,
        color: '#facc15',
        description: 'Moderate effort. Improves cardiovascular efficiency.',
        duration: '20–60 min',
        goal: 'Cardiovascular fitness'
      },
      zone4: {
        name: 'Zone 4 — Lactate Threshold',
        min: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 80),
        max: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 90),
        simpleMin: simpleTargetHR(estimatedMaxHR, 80),
        simpleMax: simpleTargetHR(estimatedMaxHR, 90),
        minPct: 80,
        maxPct: 90,
        color: '#fb923c',
        description: 'Hard effort. Race pace training, tempo runs, threshold work.',
        duration: '10–30 min',
        goal: 'Speed, race pace'
      },
      zone5: {
        name: 'Zone 5 — VO2 Max / Peak',
        min: karvonenTargetHR(estimatedMaxHR, numericRestingHR, 90),
        max: estimatedMaxHR,
        simpleMin: simpleTargetHR(estimatedMaxHR, 90),
        simpleMax: estimatedMaxHR,
        minPct: 90,
        maxPct: 100,
        color: '#ef4444',
        description: 'Maximum effort. Intervals, sprints. Only sustainable for short bursts.',
        duration: '30 sec–5 min',
        goal: 'Maximum performance'
      }
    }

    setResults({
      maxHR: estimatedMaxHR,
      hrr,
      restingHR: numericRestingHR,
      zones,
      method: maxHRInput ? 'Known Max HR' : method
    })
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    calculateZones()
  }

  const trainingDistributions = {
    generalHealth: {
      data: [
        { name: 'Zone 1', value: 20, color: '#4ade80' },
        { name: 'Zone 2', value: 50, color: '#86efac' },
        { name: 'Zone 3', value: 20, color: '#facc15' },
        { name: 'Zone 4', value: 10, color: '#fb923c' },
        { name: 'Zone 5', value: 0, color: '#ef4444' }
      ],
      summary: 'Focus on Zone 2 aerobic activity for health benefits',
      sessions: [
        '3-4 × Zone 2 walks or easy rides (30-45 min)',
        '1-2 × Zone 3 moderate activities (20-30 min)',
        'Active recovery (Zone 1) on off days'
      ]
    },
    fatLoss: {
      data: [
        { name: 'Zone 1', value: 15, color: '#4ade80' },
        { name: 'Zone 2', value: 55, color: '#86efac' },
        { name: 'Zone 3', value: 20, color: '#facc15' },
        { name: 'Zone 4', value: 10, color: '#fb923c' },
        { name: 'Zone 5', value: 0, color: '#ef4444' }
      ],
      summary: 'Zone 2 maximizes fat oxidation per session',
      sessions: [
        '4-5 × Zone 2 steady state cardio (45-60 min)',
        '1 × Zone 4 interval session (20 min)',
        'Consistent movement in Zone 1 throughout the day'
      ]
    },
    aerobicBase: {
      data: [
        { name: 'Zone 1', value: 20, color: '#4ade80' },
        { name: 'Zone 2', value: 60, color: '#86efac' },
        { name: 'Zone 3', value: 15, color: '#facc15' },
        { name: 'Zone 4', value: 5, color: '#fb923c' },
        { name: 'Zone 5', value: 0, color: '#ef4444' }
      ],
      summary: '80/20 rule — 80% easy (Z1-Z2), 20% moderate-hard',
      sessions: [
        '3-4 × Zone 2 long easy runs/rides (60-90 min)',
        '1 × Zone 4 tempo session (30 min)',
        'Plenty of Zone 1 recovery time'
      ]
    },
    racePerformance: {
      data: [
        { name: 'Zone 1', value: 15, color: '#4ade80' },
        { name: 'Zone 2', value: 45, color: '#86efac' },
        { name: 'Zone 3', value: 15, color: '#facc15' },
        { name: 'Zone 4', value: 20, color: '#fb923c' },
        { name: 'Zone 5', value: 5, color: '#ef4444' }
      ],
      summary: 'Polarized training — mostly easy with targeted hard efforts',
      sessions: [
        '3 × Zone 2 base runs (45-60 min)',
        '1 × Zone 4 race pace tempo (40 min)',
        '1 × Zone 5 interval session (sprints)'
      ]
    },
    marathon: {
      data: [
        { name: 'Zone 1', value: 15, color: '#4ade80' },
        { name: 'Zone 2', value: 55, color: '#86efac' },
        { name: 'Zone 3', value: 10, color: '#facc15' },
        { name: 'Zone 4', value: 15, color: '#fb923c' },
        { name: 'Zone 5', value: 5, color: '#ef4444' }
      ],
      summary: 'High aerobic base volume with threshold work',
      sessions: [
        '1 × Zone 2 long run (120+ min)',
        '2-3 × Zone 2 mid-distance (60-90 min)',
        '1 × Zone 4 threshold intervals'
      ]
    },
    hiit: {
      data: [
        { name: 'Zone 1', value: 20, color: '#4ade80' },
        { name: 'Zone 2', value: 30, color: '#86efac' },
        { name: 'Zone 3', value: 15, color: '#facc15' },
        { name: 'Zone 4', value: 20, color: '#fb923c' },
        { name: 'Zone 5', value: 15, color: '#ef4444' }
      ],
      summary: 'High intensity focus with adequate recovery',
      sessions: [
        '2-3 × Zone 5 HIIT sessions (20-30 min)',
        '2 × Zone 2 recovery flush rides (30 min)',
        'Focus on Zone 1 for full rest'
      ]
    }
  }

  const applyPreset = (preset) => {
    setAge(preset.age.toString())
    setRestingHR(preset.restingHR.toString())
    setMethod(preset.method)
    setMaxHRInput('')
    calculateZones()
  }

  const presets = [
    { name: 'Average Adult', age: 35, restingHR: 65, method: 'fox' },
    { name: 'Fit Runner', age: 28, restingHR: 48, method: 'tanaka' },
    { name: 'Older Athlete', age: 55, restingHR: 58, method: 'tanaka' },
    { name: 'Female Athlete', age: 32, restingHR: 52, method: 'gulati' },
    { name: 'Beginner', age: 45, restingHR: 72, method: 'fox' }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Heart Rate Zones Calculator — Karvonen Method & Max HR | CalcLogic</title>
        <meta name="description" content="Free heart rate zones calculator using the Karvonen method. Calculate your 5 training zones from your age, resting heart rate and max heart rate. Includes target HR for fat burn, cardio, and peak performance zones." />
        <meta name="keywords" content="heart rate zones calculator, Karvonen heart rate calculator, target heart rate calculator, heart rate training zones, max heart rate calculator, fat burning heart rate calculator, cardio heart rate zones, heart rate zone 2 calculator" />
        <link rel="canonical" href="https://calclogic.com/sports/heart-rate-zones-calculator" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Heart Rate Zones Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate your 5 heart rate training zones using the Karvonen method from your age and resting heart rate. Includes fat burn, cardio, and peak zones."
          }`}
        </script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Heart Rate Zones Calculator</h1>
          <p className="calculator-description">
            Calculate your 5 heart rate training zones using the Karvonen method. Find your personalized target heart rate for fat burning, endurance, and peak performance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            className={`tab-btn ${activeTab === 'zones' ? 'active' : ''}`}
            onClick={() => setActiveTab('zones')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'zones' ? '#2563eb' : 'transparent',
              color: activeTab === 'zones' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Heart Rate Zones
          </button>
          <button
            className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'plan' ? '#2563eb' : 'transparent',
              color: activeTab === 'plan' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Training Plan Guide
          </button>
        </div>

        {activeTab === 'zones' && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>Quick-Fill Presets</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {presets.map((p, i) => (
                  <button
                    key={i}
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

            <form onSubmit={handleCalculate} className="calculator-form">
              <div className="input-section">
                <h2>Your Profile</h2>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label htmlFor="restingHR">Resting Heart Rate (BPM)</label>
                  <input type="number" id="restingHR" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} required />
                  <small style={{ color: '#64748b' }}>Measured in morning before getting out of bed</small>
                </div>
                <div className="input-group">
                  <label htmlFor="gender">Gender</label>
                  <div className="unit-toggle">
                    <button type="button" className={`unit-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>Male</button>
                    <button type="button" className={`unit-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>Female</button>
                  </div>
                </div>
              </div>

              <div className="input-section">
                <h2>Maximum Heart Rate</h2>
                <div className="input-group">
                  <label htmlFor="maxHRMethod">Max HR Method</label>
                  <select id="maxHRMethod" value={method} onChange={(e) => setMethod(e.target.value)}>
                    <option value="fox">Fox Formula (220 - age)</option>
                    <option value="tanaka">Tanaka Formula (208 - 0.7 × age)</option>
                    <option value="gulati">Gulati Formula (Women specific)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="maxHRInput">Known Max HR (Optional)</label>
                  <input type="number" id="maxHRInput" value={maxHRInput} onChange={(e) => setMaxHRInput(e.target.value)} placeholder="Leave blank to auto-calculate" />
                </div>
                <div className="input-group">
                  <label htmlFor="fitness">Fitness Level</label>
                  <select id="fitness" value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
                    <option value="sedentary">Sedentary</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="athletic">Athletic</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="calculate-btn">Calculate Zones</button>
            </form>

            {results && (
              <div className="results-section">
                <h2>Calculation Results</h2>
                <div className="results-grid">
                  <div className="result-item">
                    <span className="result-label">Estimated Max HR</span>
                    <span className="result-value" style={{ fontSize: '2.5rem', fontWeight: '700' }}>{results.maxHR} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>bpm</span></span>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Method: {results.method}</p>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Heart Rate Reserve</span>
                    <span className="result-value">{results.hrr} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>bpm</span></span>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Range your heart uses for exercise intensity</p>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h3>Training Zone Visualization</h3>
                  <div style={{ 
                    display: 'flex', 
                    height: '40px', 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    margin: '2rem 0',
                    background: '#f1f5f9'
                  }}>
                    {Object.values(results.zones).map((zone, i) => (
                      <div key={i} style={{ 
                        flex: 1, 
                        background: zone.color, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: i === 2 ? '#000' : '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        Z{i+1}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>{results.restingHR} BPM (Rest)</span>
                    <span>{results.maxHR} BPM (Max)</span>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3>Training Zones Breakdown</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={showComparison} onChange={() => setShowComparison(!showComparison)} />
                      Show Karvonen vs Simple % comparison
                    </label>
                  </div>

                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {Object.values(results.zones).map((zone, i) => (
                      <div key={i} style={{ 
                        background: '#f8fafc', 
                        borderLeft: `6px solid ${zone.color}`, 
                        borderRadius: '0 8px 8px 0', 
                        padding: '1.25rem',
                        display: 'grid',
                        gridTemplateColumns: showComparison ? '1.5fr 1fr 1fr' : '1fr 1fr',
                        gap: '1rem',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h4 style={{ margin: 0, color: '#1e293b' }}>{zone.name}</h4>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>{zone.description}</p>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', fontWeight: '600' }}>Sustain: {zone.duration}</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{zone.min}–{zone.max}</span>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>BPM (Karvonen)</span>
                        </div>
                        {showComparison && (
                          <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#94a3b8' }}>{zone.simpleMin}–{zone.simpleMax}</span>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>BPM (Simple %)</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'plan' && (
          <div className="input-section">
            <h2>Personalized Training Plan</h2>
            <div className="input-group">
              <label htmlFor="goal">Your Training Goal</label>
              <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="generalHealth">General Health</option>
                <option value="fatLoss">Fat Loss</option>
                <option value="aerobicBase">Build Aerobic Base (Endurance)</option>
                <option value="racePerformance">Improve Race Performance (5K/10K)</option>
                <option value="marathon">Marathon / Half Marathon Training</option>
                <option value="hiit">HIIT / Peak Performance</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ height: '300px' }}>
                <h3>Weekly Intensity Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trainingDistributions[goal].data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {trainingDistributions[goal].data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3>Recommended Strategy</h3>
                <p style={{ fontWeight: '600', color: '#2563eb', marginBottom: '1.5rem' }}>{trainingDistributions[goal].summary}</p>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {trainingDistributions[goal].sessions.map((session, i) => (
                    <div key={i} style={{ background: '#1e2235', color: '#fff', padding: '1rem', borderRadius: '8px' }}>
                      {session}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <ShareButtons title="Heart Rate Zones Calculator" url="https://calclogic.com/sports/heart-rate-zones-calculator" />

        <div className="content-section">
          <h2>What Are Heart Rate Training Zones?</h2>
          <p>Heart rate training zones are ranges of heart rate that correspond to different levels of exercise intensity, each producing distinct physiological effects on your body. By training in specific zones, athletes and fitness enthusiasts can precisely target different energy systems — from fat-burning aerobic work to high-intensity anaerobic efforts — making every workout more purposeful and effective.</p>
          <p>Most training systems divide exercise intensity into 5 zones based on a percentage of your maximum heart rate (Max HR) or, more accurately, your heart rate reserve (HRR). The five zones range from Zone 1 (very easy, active recovery) through Zone 5 (maximum effort, VO2 max work), each building different aspects of fitness.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>The Karvonen Method — Why It's More Accurate Than Simple Percentages</h2>
          <p>Most basic heart rate calculators use a simple percentage of maximum heart rate to define zones. For example, Zone 2 might be defined as 60–70% of Max HR. While this is easy to calculate, it ignores a critical piece of information: your resting heart rate.</p>
          <p>The **Karvonen method**, developed by Finnish scientist Martti Karvonen in 1957, uses your **Heart Rate Reserve (HRR)** — the difference between your maximum and resting heart rate — to calculate more personalized training zones.</p>
          <p><strong>The Karvonen Formula:</strong> Target HR = ((Max HR − Resting HR) × % Intensity) + Resting HR</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Calculate Your Maximum Heart Rate</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Formula</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Equation</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>Fox Formula</td>
                  <td style={{ padding: '1rem' }}>220 − Age</td>
                  <td style={{ padding: '1rem' }}>General population</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>Tanaka Formula</td>
                  <td style={{ padding: '1rem' }}>208 − (0.7 × Age)</td>
                  <td style={{ padding: '1rem' }}>Adults over 40</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>Gulati Formula</td>
                  <td style={{ padding: '1rem' }}>206 − (0.88 × Age)</td>
                  <td style={{ padding: '1rem' }}>Women specific</td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>The 5 Heart Rate Training Zones Explained</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Zone</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>% of Max HR</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Training Effect</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { z: 'Zone 1', name: 'Active Recovery', pct: '50–60%', effect: 'Recovery, blood flow, fat metabolism', color: '#4ade80' },
                  { z: 'Zone 2', name: 'Aerobic Base / Fat Burn', pct: '60–70%', effect: 'Aerobic base, fat oxidation, mitochondria', color: '#86efac' },
                  { z: 'Zone 3', name: 'Aerobic / Cardio', pct: '70–80%', effect: 'Cardiovascular efficiency, lactate clearance', color: '#facc15' },
                  { z: 'Zone 4', name: 'Lactate Threshold', pct: '80–90%', effect: 'Lactate threshold, race pace, speed endurance', color: '#fb923c' },
                  { z: 'Zone 5', name: 'VO2 Max / Peak', pct: '90–100%', effect: 'Maximum oxygen uptake, neuromuscular power', color: '#ef4444' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '1rem', borderLeft: `6px solid ${row.color}`, fontWeight: '600' }}>{row.z}</td>
                    <td style={{ padding: '1rem' }}>{row.name}</td>
                    <td style={{ padding: '1rem' }}>{row.pct}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{row.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Zone 2 Training — Why Everyone Is Talking About It</h2>
          <p>Zone 2 training has become one of the most discussed concepts in endurance sports and longevity research. Zone 2 is the intensity at which your body primarily uses fat as fuel while clearing lactate as fast as it is produced — a steady, sustainable aerobic state. Training in Zone 2 builds mitochondrial density, improves fat oxidation, and develops the aerobic base that supports all higher-intensity work.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Measure Your Resting Heart Rate</h2>
          <p>Your resting heart rate (RHR) is one of the most important numbers in the Karvonen formula. Measure it accurately by lying still for 5 minutes after waking. Count your pulse for 60 seconds.</p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0' }}>
              <thead>
                <tr style={{ background: '#1e3a8a', color: 'white' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Resting HR</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { hr: 'Below 40 bpm', cat: 'Athletic (endurance trained)', color: '#3b82f6' },
                  { hr: '40–50 bpm', cat: 'Excellent', color: '#22c55e' },
                  { hr: '51–60 bpm', cat: 'Good', color: '#14b8a6' },
                  { hr: '61–70 bpm', cat: 'Above Average', color: '#eab308' },
                  { hr: '71–80 bpm', cat: 'Average', color: '#f97316' },
                  { hr: '81–90 bpm', cat: 'Below Average', color: '#ef4444' },
                  { hr: 'Above 90 bpm', cat: 'Poor — consult a doctor', color: '#ef4444' }
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: row.color }}>{row.hr}</td>
                    <td style={{ padding: '1rem' }}>{row.cat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { q: 'What is the Karvonen formula for heart rate?', a: 'Target HR = ((Max HR − Resting HR) × % Intensity) + Resting HR. It is more accurate than simple % methods because it accounts for resting heart rate.' },
              { q: 'What heart rate zone burns the most fat?', a: 'Zone 2 (60–70% intensity) burns the highest proportion of fat, though higher intensities burn more total calories.' },
              { q: 'How do I find my maximum heart rate?', a: 'Use a formula like 220 - age or Tanaka (208 - 0.7*age). For the most accuracy, perform a supervised graded exercise test.' }
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
            <a href="/bmi-calculator" className="related-calc-card">
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>BMI Calculator</h3>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Calculate your Body Mass Index</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeartRateZonesCalculator
