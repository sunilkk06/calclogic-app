import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const WilksCalculator = () => {
  const [activeTab, setActiveTab] = useState('wilks')
  const [results, setResults] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)

  // Wilks Calculator State
  const [gender, setGender] = useState('male')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [bodyweight, setBodyweight] = useState('')
  const [squat, setSquat] = useState('')
  const [benchPress, setBenchPress] = useState('')
  const [deadlift, setDeadlift] = useState('')
  const [formula, setFormula] = useState('wilks')
  const [equipment, setEquipment] = useState('raw')

  // Comparison Tool State
  const [lifterA, setLifterA] = useState({
    name: '',
    gender: 'male',
    bodyweight: '',
    total: ''
  })
  const [lifterB, setLifterB] = useState({
    name: '',
    gender: 'male',
    bodyweight: '',
    total: ''
  })
  const [comparisonFormula, setComparisonFormula] = useState('wilks')

  // Conversion functions
  const lbsToKg = (lbs) => lbs * 0.453592
  const kgToLbs = (kg) => kg * 2.20462

  // Wilks Formula (Original)
  const menCoefficients = {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863E-06,
    f: -1.291E-08
  }

  const womenCoefficients = {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582E-05,
    f: -9.054E-08
  }

  const wilksCoefficient = (bodyweightKg, isMale) => {
    const c = isMale ? menCoefficients : womenCoefficients
    const x = bodyweightKg
    const denominator =
      c.a +
      (c.b * x) +
      (c.c * Math.pow(x, 2)) +
      (c.d * Math.pow(x, 3)) +
      (c.e * Math.pow(x, 4)) +
      (c.f * Math.pow(x, 5))
    return 500 / denominator
  }

  const wilksScore = (totalKg, bodyweightKg, isMale) => {
    const coefficient = wilksCoefficient(bodyweightKg, isMale)
    return (totalKg * coefficient).toFixed(2)
  }

  // Wilks2 Formula (2020 Updated)
  const wilks2Men = {
    a: 47.4617885411949,
    b: 8.47206137941125,
    c: 0.073694103462609,
    d: -0.00139583381094385,
    e: 7.07665973070743E-06,
    f: -1.20804336482315E-08
  }

  const wilks2Women = {
    a: -125.425539779509,
    b: 13.7121941940668,
    c: -0.0330725063103405,
    d: -0.000194301472451533,
    e: 1.56251497064895E-06,
    f: 1.62359000724073E-09
  }

  const wilks2Score = (totalKg, bodyweightKg, isMale) => {
    const c = isMale ? wilks2Men : wilks2Women
    const x = bodyweightKg
    const denominator =
      c.a +
      (c.b * x) +
      (c.c * Math.pow(x, 2)) +
      (c.d * Math.pow(x, 3)) +
      (c.e * Math.pow(x, 4)) +
      (c.f * Math.pow(x, 5))
    return (600 / denominator * totalKg).toFixed(2)
  }

  // DOTS Formula
  const dotsMen = {
    a: -307.75076,
    b: 24.0900756,
    c: -0.1918759221,
    d: 0.0007391293,
    e: -0.000001093
  }

  const dotsWomen = {
    a: -57.96288,
    b: 13.6175032,
    c: -0.1126655495,
    d: 0.0005158568,
    e: -0.0000010706
  }

  const dotsScore = (totalKg, bodyweightKg, isMale) => {
    const c = isMale ? dotsMen : dotsWomen
    const x = bodyweightKg
    const denominator =
      c.a +
      (c.b * x) +
      (c.c * Math.pow(x, 2)) +
      (c.d * Math.pow(x, 3)) +
      (c.e * Math.pow(x, 4))
    return (500 / denominator * totalKg).toFixed(2)
  }

  const calculateScore = (totalKg, bodyweightKg, isMale, formulaType) => {
    switch (formulaType) {
      case 'wilks2':
        return wilks2Score(totalKg, bodyweightKg, isMale)
      case 'dots':
        return dotsScore(totalKg, bodyweightKg, isMale)
      default:
        return wilksScore(totalKg, bodyweightKg, isMale)
    }
  }

  const getStrengthRating = (score) => {
    if (score >= 500) return { label: 'World Class', color: '#fbbf24' }
    if (score >= 425) return { label: 'Elite', color: '#3b82f6' }
    if (score >= 350) return { label: 'Advanced', color: '#22c55e' }
    if (score >= 275) return { label: 'Intermediate', color: '#14b8a6' }
    if (score >= 200) return { label: 'Novice', color: '#f97316' }
    return { label: 'Beginner', color: '#ef4444' }
  }

  const handleWilksCalculate = (e) => {
    e.preventDefault()
    
    const bodyweightKg = weightUnit === 'lbs' ? lbsToKg(parseFloat(bodyweight)) : parseFloat(bodyweight)
    const squatKg = weightUnit === 'lbs' ? lbsToKg(parseFloat(squat)) : parseFloat(squat)
    const benchKg = weightUnit === 'lbs' ? lbsToKg(parseFloat(benchPress)) : parseFloat(benchPress)
    const deadliftKg = weightUnit === 'lbs' ? lbsToKg(parseFloat(deadlift)) : parseFloat(deadlift)
    
    if (bodyweightKg > 0 && squatKg >= 0 && benchKg >= 0 && deadliftKg >= 0) {
      const totalKg = squatKg + benchKg + deadliftKg
      const isMale = gender === 'male'
      
      const wilks = wilksScore(totalKg, bodyweightKg, isMale)
      const wilks2 = wilks2Score(totalKg, bodyweightKg, isMale)
      const dots = dotsScore(totalKg, bodyweightKg, isMale)
      
      let selectedScore
      switch (formula) {
        case 'wilks2':
          selectedScore = wilks2
          break
        case 'dots':
          selectedScore = dots
          break
        default:
          selectedScore = wilks
      }
      
      const coefficient = wilksCoefficient(bodyweightKg, isMale)
      const rating = getStrengthRating(parseFloat(selectedScore))
      
      setResults({
        type: 'wilks',
        selectedScore: parseFloat(selectedScore),
        total: totalKg,
        coefficient,
        wilks: parseFloat(wilks),
        wilks2: parseFloat(wilks2),
        dots: parseFloat(dots),
        rating,
        formula
      })
    }
  }

  const handleComparisonCalculate = (e) => {
    e.preventDefault()
    
    const lifterABw = weightUnit === 'lbs' ? lbsToKg(parseFloat(lifterA.bodyweight)) : parseFloat(lifterA.bodyweight)
    const lifterATotal = weightUnit === 'lbs' ? lbsToKg(parseFloat(lifterA.total)) : parseFloat(lifterA.total)
    const lifterBBw = weightUnit === 'lbs' ? lbsToKg(parseFloat(lifterB.bodyweight)) : parseFloat(lifterB.bodyweight)
    const lifterBTotal = weightUnit === 'lbs' ? lbsToKg(parseFloat(lifterB.total)) : parseFloat(lifterB.total)
    
    if (lifterABw > 0 && lifterATotal > 0 && lifterBBw > 0 && lifterBTotal > 0) {
      const scoreA = calculateScore(lifterATotal, lifterABw, lifterA.gender === 'male', comparisonFormula)
      const scoreB = calculateScore(lifterBTotal, lifterBBw, lifterB.gender === 'male', comparisonFormula)
      
      const winner = parseFloat(scoreA) > parseFloat(scoreB) ? 'A' : 'B'
      const difference = Math.abs((parseFloat(scoreA) - parseFloat(scoreB)) / parseFloat(scoreB) * 100)
      
      setComparisonResults({
        scoreA: parseFloat(scoreA),
        scoreB: parseFloat(scoreB),
        winner,
        difference,
        lifterAName: lifterA.name || 'Lifter A',
        lifterBName: lifterB.name || 'Lifter B'
      })
    }
  }

  const applyPreset = (preset) => {
    setBodyweight(preset.bodyweight.toString())
    setSquat(preset.squat.toString())
    setBenchPress(preset.bench.toString())
    setDeadlift(preset.deadlift.toString())
    setGender(preset.gender)
    setWeightUnit('kg')
  }

  const presets = [
    { name: 'World Record Men', gender: 'male', bodyweight: 93, squat: 380, bench: 260, deadlift: 400 },
    { name: 'World Record Women', gender: 'female', bodyweight: 63, squat: 245, bench: 147.5, deadlift: 275 },
    { name: 'Elite Club Lifter (Men)', gender: 'male', bodyweight: 83, squat: 240, bench: 160, deadlift: 280 },
    { name: 'Intermediate Lifter', gender: 'male', bodyweight: 90, squat: 160, bench: 100, deadlift: 200 },
    { name: 'Beginner', gender: 'male', bodyweight: 80, squat: 80, bench: 60, deadlift: 100 }
  ]

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Wilks Score Calculator — Powerlifting Strength Comparison | CalcLogic</title>
        <meta name="description" content="Free Wilks Score calculator for powerlifting. Calculate your Wilks coefficient to compare squat, bench press, and deadlift totals across different body weights. Includes Wilks2 (2020 formula) and DOTS score." />
        <meta name="keywords" content="wilks score calculator, wilks coefficient calculator, powerlifting calculator, wilks2 calculator, DOTS score calculator, powerlifting total calculator, strength comparison calculator, wilks formula 2020" />
        <link rel="canonical" href="https://calclogic.com/sports/wilks-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Wilks Score Calculator — Powerlifting Strength Comparison | CalcLogic" />
        <meta property="og:description" content="Free Wilks Score calculator for powerlifting. Calculate your Wilks coefficient to compare strength across different bodyweights and weight classes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/wilks-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Wilks Score Calculator — Free Powerlifting Calculator | CalcLogic" />
        <meta name="twitter:description" content="Calculate Wilks Score, Wilks2, and DOTS score for powerlifting. Free, no signup required." />
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Wilks Score Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate Wilks Score, Wilks2, and DOTS score for powerlifting to compare strength across different body weights and weight classes."
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
                "name": "What is a good Wilks Score for a beginner?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For a beginner powerlifter, a Wilks Score of 150–200 is typical after the first year of training. A score of 200–275 represents a novice-to-intermediate level. Most recreational lifters who train consistently for 2–3 years reach Wilks Scores in the 250–325 range."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between Wilks and DOTS score?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Both Wilks and DOTS normalize powerlifting totals by bodyweight using polynomial equations, but they use different mathematical constants and scaling factors. DOTS was developed more recently and is now the official metric of the IPF (International Powerlifting Federation). Wilks is still used by many non-IPF federations. The scores are not directly comparable — a Wilks of 380 is not the same as a DOTS of 380."
                }
              },
              {
                "@type": "Question",
                "name": "Should I calculate Wilks in kg or lbs?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Wilks formula uses kilograms as its base unit. Our calculator automatically converts lbs to kg if you enter weights in pounds. For official competition purposes, always use kilograms as powerlifting federations worldwide record and compare totals in kg."
                }
              },
              {
                "@type": "Question",
                "name": "What is the highest Wilks Score ever recorded?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The highest Wilks Scores in powerlifting history have been achieved in equipped (multi-ply) lifting, with scores above 700 recorded. In raw powerlifting, scores above 550–600 represent the absolute pinnacle of the sport. Lifters like Ray Williams, Blaine Sumner, and Stefi Cohen have produced some of the highest raw Wilks Scores ever recorded."
                }
              },
              {
                "@type": "Question",
                "name": "Does Wilks Score work for equipped powerlifting?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — the Wilks formula can be applied to equipped totals (single-ply or multi-ply), but equipped and raw Wilks Scores should not be compared directly. Supportive equipment like squat suits and bench shirts add significant weight to totals, producing higher Wilks Scores than raw lifting at the same bodyweight."
                }
              },
              {
                "@type": "Question",
                "name": "Which powerlifting federation uses which formula?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The IPF (International Powerlifting Federation) and its affiliates — including USAPL, CPU (Canada), British Powerlifting, and Powerlifting Australia — use the DOTS formula. Many non-IPF federations such as the WRPF, RPS, and APF continue to use the original Wilks or Wilks2 formula. Always check your specific federation's rules before competition."
                }
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Wilks Score Calculator</h1>
          <p className="calculator-description">
            Calculate your Wilks Score, Wilks2, and DOTS score for powerlifting. Compare squat, bench press, and deadlift totals across different bodyweights and weight classes.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'wilks' ? 'active' : ''}`}
            onClick={() => setActiveTab('wilks')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'wilks' ? '#2563eb' : 'transparent',
              color: activeTab === 'wilks' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Wilks Score Calculator
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'comparison' ? '#2563eb' : 'transparent',
              color: activeTab === 'comparison' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '0.5rem 0.5rem 0 0',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Lift Comparison Tool
          </button>
        </div>

        {/* Quick Fill Presets for Wilks Calculator */}
        {activeTab === 'wilks' && (
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

        {/* Tab 1: Wilks Score Calculator */}
        {activeTab === 'wilks' && (
          <form onSubmit={handleWilksCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Lifter Information</h2>
              <div className="input-group">
                <label>Gender</label>
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${gender === 'male' ? 'active' : ''}`}
                    onClick={() => setGender('male')}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${gender === 'female' ? 'active' : ''}`}
                    onClick={() => setGender('female')}
                  >
                    Female
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="bodyweight">Bodyweight</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="bodyweight"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                    required
                    min="0"
                    step="0.1"
                    placeholder="e.g., 83"
                  />
                  <div className="unit-toggle">
                    <button
                      type="button"
                      className={`unit-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                      onClick={() => setWeightUnit('kg')}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      className={`unit-btn ${weightUnit === 'lbs' ? 'active' : ''}`}
                      onClick={() => setWeightUnit('lbs')}
                    >
                      lbs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Lifts (Best Attempts)</h2>
              <div className="input-group">
                <label htmlFor="squat">Squat</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="squat"
                    value={squat}
                    onChange={(e) => setSquat(e.target.value)}
                    required
                    min="0"
                    step="0.5"
                    placeholder="e.g., 240"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {weightUnit === 'kg' ? 'kilograms' : 'pounds'}
                  </small>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="benchPress">Bench Press</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="benchPress"
                    value={benchPress}
                    onChange={(e) => setBenchPress(e.target.value)}
                    required
                    min="0"
                    step="0.5"
                    placeholder="e.g., 160"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {weightUnit === 'kg' ? 'kilograms' : 'pounds'}
                  </small>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="deadlift">Deadlift</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="deadlift"
                    value={deadlift}
                    onChange={(e) => setDeadlift(e.target.value)}
                    required
                    min="0"
                    step="0.5"
                    placeholder="e.g., 280"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {weightUnit === 'kg' ? 'kilograms' : 'pounds'}
                  </small>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="total">Powerlifting Total</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="total"
                    value={
                      squat && benchPress && deadlift
                        ? (parseFloat(squat) + parseFloat(benchPress) + parseFloat(deadlift)).toFixed(1)
                        : ''
                    }
                    readOnly
                    style={{ background: '#f1f5f9', color: '#1e40af', fontWeight: '600' }}
                    placeholder="Auto-calculated"
                  />
                  <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Squat + Bench + Deadlift
                  </small>
                </div>
              </div>
            </div>

            <div className="input-section">
              <h2>Competition Settings</h2>
              <div className="input-group">
                <label htmlFor="formula">Formula Version</label>
                <div className="input-field">
                  <select
                    id="formula"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                    required
                  >
                    <option value="wilks">Original Wilks</option>
                    <option value="wilks2">Wilks2 (2020)</option>
                    <option value="dots">DOTS</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="equipment">Equipment</label>
                <div className="input-field">
                  <select
                    id="equipment"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    required
                  >
                    <option value="raw">Raw</option>
                    <option value="single-ply">Single-Ply</option>
                    <option value="multi-ply">Multi-Ply</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Calculate Wilks Score</button>
          </form>
        )}

        {/* Tab 2: Lift Comparison Tool */}
        {activeTab === 'comparison' && (
          <form onSubmit={handleComparisonCalculate} className="calculator-form">
            <div className="input-section">
              <h2>Lifter Comparison</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Lifter A */}
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '1.5rem' 
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Lifter A</h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="input-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={lifterA.name}
                        onChange={(e) => setLifterA({...lifterA, name: e.target.value})}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="input-group">
                      <label>Gender</label>
                      <div className="unit-toggle">
                        <button
                          type="button"
                          className={`unit-btn ${lifterA.gender === 'male' ? 'active' : ''}`}
                          onClick={() => setLifterA({...lifterA, gender: 'male'})}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`unit-btn ${lifterA.gender === 'female' ? 'active' : ''}`}
                          onClick={() => setLifterA({...lifterA, gender: 'female'})}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Bodyweight</label>
                      <input
                        type="number"
                        value={lifterA.bodyweight}
                        onChange={(e) => setLifterA({...lifterA, bodyweight: e.target.value})}
                        placeholder="e.g., 83"
                        min="0"
                        step="0.1"
                      />
                      <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {weightUnit === 'kg' ? 'kg' : 'lbs'}
                      </small>
                    </div>
                    <div className="input-group">
                      <label>Total</label>
                      <input
                        type="number"
                        value={lifterA.total}
                        onChange={(e) => setLifterA({...lifterA, total: e.target.value})}
                        placeholder="e.g., 680"
                        min="0"
                        step="0.5"
                      />
                      <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {weightUnit === 'kg' ? 'kg' : 'lbs'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Lifter B */}
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  padding: '1.5rem' 
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Lifter B</h3>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div className="input-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={lifterB.name}
                        onChange={(e) => setLifterB({...lifterB, name: e.target.value})}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="input-group">
                      <label>Gender</label>
                      <div className="unit-toggle">
                        <button
                          type="button"
                          className={`unit-btn ${lifterB.gender === 'male' ? 'active' : ''}`}
                          onClick={() => setLifterB({...lifterB, gender: 'male'})}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          className={`unit-btn ${lifterB.gender === 'female' ? 'active' : ''}`}
                          onClick={() => setLifterB({...lifterB, gender: 'female'})}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Bodyweight</label>
                      <input
                        type="number"
                        value={lifterB.bodyweight}
                        onChange={(e) => setLifterB({...lifterB, bodyweight: e.target.value})}
                        placeholder="e.g., 93"
                        min="0"
                        step="0.1"
                      />
                      <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {weightUnit === 'kg' ? 'kg' : 'lbs'}
                      </small>
                    </div>
                    <div className="input-group">
                      <label>Total</label>
                      <input
                        type="number"
                        value={lifterB.total}
                        onChange={(e) => setLifterB({...lifterB, total: e.target.value})}
                        placeholder="e.g., 720"
                        min="0"
                        step="0.5"
                      />
                      <small style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {weightUnit === 'kg' ? 'kg' : 'lbs'}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="comparisonFormula">Formula</label>
                <div className="input-field">
                  <select
                    id="comparisonFormula"
                    value={comparisonFormula}
                    onChange={(e) => setComparisonFormula(e.target.value)}
                    required
                  >
                    <option value="wilks">Original Wilks</option>
                    <option value="wilks2">Wilks2 (2020)</option>
                    <option value="dots">DOTS</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="calculate-btn">Compare Lifters</button>
          </form>
        )}

        {/* Results Section */}
        {results && results.type === 'wilks' && (
          <div className="results-section">
            <h2>Wilks Score Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="result-item">
                <span className="result-label">
                  {formula === 'wilks2' ? 'Wilks2 Score' : formula === 'dots' ? 'DOTS Score' : 'Wilks Score'}
                </span>
                <span className="result-value" style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: results.rating.color 
                }}>
                  {results.selectedScore}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Powerlifting Total</span>
                <span className="result-value" style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                  {weightUnit === 'kg' ? results.total.toFixed(1) : (results.total * 2.20462).toFixed(1)} {weightUnit}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Wilks Coefficient</span>
                <span className="result-value">{results.coefficient.toFixed(4)}</span>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Bodyweight adjustment factor
                </p>
              </div>
              <div className="result-item">
                <span className="result-label">Strength Rating</span>
                <span className="result-value" style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600',
                  color: results.rating.color 
                }}>
                  {results.rating.label}
                </span>
              </div>
            </div>

            <h3>Formula Comparison</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Formula</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Your Score</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Currently Used By</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Wilks (Original)</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>{results.wilks}</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Many local federations</td>
                </tr>
                <tr style={{ background: 'white' }}>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Wilks2 (2020)</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>{results.wilks2}</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Updated standard</td>
                </tr>
                <tr style={{ background: '#f8fafc' }}>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>DOTS</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>{results.dots}</td>
                  <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>IPF, CPU, USAPL</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {comparisonResults && (
          <div className="results-section">
            <h2>Lifter Comparison Results</h2>
            
            <div className="results-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="result-item" style={{
                border: comparisonResults.winner === 'A' ? '3px solid #fbbf24' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.5rem',
                background: comparisonResults.winner === 'A' ? '#fef3c7' : '#f8fafc'
              }}>
                <span className="result-label">{comparisonResults.lifterAName}</span>
                <span className="result-value" style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {comparisonResults.scoreA}
                </span>
                {comparisonResults.winner === 'A' && (
                  <div style={{ 
                    background: '#fbbf24', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    display: 'inline-block',
                    marginTop: '0.5rem'
                  }}>
                    🏆 Winner
                  </div>
                )}
              </div>
              
              <div className="result-item" style={{
                border: comparisonResults.winner === 'B' ? '3px solid #fbbf24' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.5rem',
                background: comparisonResults.winner === 'B' ? '#fef3c7' : '#f8fafc'
              }}>
                <span className="result-label">{comparisonResults.lifterBName}</span>
                <span className="result-value" style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {comparisonResults.scoreB}
                </span>
                {comparisonResults.winner === 'B' && (
                  <div style={{ 
                    background: '#fbbf24', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    display: 'inline-block',
                    marginTop: '0.5rem'
                  }}>
                    🏆 Winner
                  </div>
                )}
              </div>
            </div>

            <div style={{ 
              background: '#1e2235', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: 'white', fontSize: '1.1rem', margin: 0 }}>
                <strong>{comparisonResults.lifterAName}</strong> is <strong>{comparisonResults.difference.toFixed(1)}%</strong> {' '}
                {comparisonResults.winner === 'A' ? 'stronger' : 'weaker'} relative to bodyweight than {' '}
                <strong>{comparisonResults.lifterBName}</strong>
              </p>
            </div>

            {/* Simple Bar Chart Visualization */}
            <div style={{ marginTop: '2rem' }}>
              <h3>Visual Comparison</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>{comparisonResults.lifterAName}</span>
                    <span>{comparisonResults.scoreA}</span>
                  </div>
                  <div style={{ 
                    background: '#e5e7eb', 
                    height: '24px', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      background: comparisonResults.winner === 'A' ? '#fbbf24' : '#6b7280',
                      height: '100%',
                      width: `${(comparisonResults.scoreA / Math.max(comparisonResults.scoreA, comparisonResults.scoreB)) * 100}%`,
                      borderRadius: '12px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>{comparisonResults.lifterBName}</span>
                    <span>{comparisonResults.scoreB}</span>
                  </div>
                  <div style={{ 
                    background: '#e5e7eb', 
                    height: '24px', 
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      background: comparisonResults.winner === 'B' ? '#fbbf24' : '#6b7280',
                      height: '100%',
                      width: `${(comparisonResults.scoreB / Math.max(comparisonResults.scoreA, comparisonResults.scoreB)) * 100}%`,
                      borderRadius: '12px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ShareButtons 
          title="Wilks Score Calculator"
          url="https://calclogic.com/sports/wilks-calculator"
        />

        {/* Content Sections */}
        <div className="content-section">
          <h2>What is the Wilks Score in Powerlifting?</h2>
          <p>The Wilks Score (also called the Wilks Coefficient or Wilks Points) is a mathematical formula used in powerlifting to compare the relative strength of athletes competing in different weight classes. Because a heavier lifter will almost always lift more absolute weight than a lighter lifter, direct comparison of totals is unfair. The Wilks Score levels the playing field by adjusting each lifter's total based on their bodyweight.</p>
          <p>Developed by Robert Wilks, the Chief Executive of Powerlifting Australia, the original formula was adopted as the standard for powerlifting competition scoring and best-lifter awards for decades. A lifter with a higher Wilks Score is considered relatively stronger for their bodyweight than a lifter with a lower score, regardless of which weight class they compete in.</p>
          <p>In 2020, an updated formula called Wilks2 was introduced to address mathematical shortcomings in the original, particularly at very low and very high bodyweights. The International Powerlifting Federation (IPF) — the sport's largest governing body — has since moved to the DOTS formula for its official competitions, though Wilks remains widely used across many national and local federations.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How is the Wilks Score Calculated?</h2>
          <p>The Wilks Score is calculated by multiplying a lifter's total (squat + bench press + deadlift) by a bodyweight-dependent coefficient:</p>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            <strong>Wilks Score = Total (kg) × Wilks Coefficient</strong>
          </div>
          <p>The Wilks Coefficient is determined by a fifth-degree polynomial equation using the lifter's bodyweight in kilograms. Separate constants are used for male and female lifters to account for physiological differences in strength-to-weight ratios between genders.</p>
          
          <h3>Step-by-step example:</h3>
          <p>A male lifter weighing 83kg posts a total of 680kg (240kg squat + 160kg bench + 280kg deadlift).</p>
          <ol style={{ lineHeight: '1.8', color: '#374151' }}>
            <li>Calculate Wilks Coefficient for 83kg male: <strong>≈ 0.5659</strong></li>
            <li>Wilks Score = 680 × 0.5659 = <strong>384.8 points</strong></li>
          </ol>
          <p>This score can then be compared directly against any other lifter of any bodyweight, male or female (using gender-appropriate coefficients).</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Wilks vs Wilks2 vs DOTS — Which Formula Should You Use?</h2>
          <p>Three versions of bodyweight-normalized powerlifting scores are currently in use. Here is how they compare:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Formula</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Year</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Used By</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Best For</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Key Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Wilks (Original)</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1990s</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Many local/national federations</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Historical comparison</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Original standard, still widely used</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Wilks2</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2020</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Updated federations</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Current competition</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Fixes mathematical issues at extreme bodyweights</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>DOTS</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2019</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>IPF, USAPL, CPU, British PL</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>IPF-affiliated meets</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Current IPF official standard</td>
              </tr>
            </tbody>
          </table>

          <h3>Which should you use?</h3>
          <ul style={{ lineHeight: '1.8', color: '#374151' }}>
            <li>If you compete in an <strong>IPF-affiliated federation</strong> (USAPL, CPU, British Powerlifting, etc.) → use <strong>DOTS</strong></li>
            <li>If you compete in a <strong>non-IPF federation</strong> that still uses Wilks → use <strong>Wilks2</strong> (updated) or <strong>Original Wilks</strong> depending on your federation's rules</li>
            <li>For <strong>general comparison and historical records</strong> → Original Wilks is most commonly cited</li>
          </ul>
          <p>Our calculator shows all three scores simultaneously so you can compare across all systems.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Wilks Score Rating Scale — How Do You Compare?</h2>
          <p>Use this table to evaluate your Wilks Score against the broader powerlifting community:</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Wilks Score</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>What It Represents</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fef3c7' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#92400e', fontWeight: '600' }}>500 and above</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>World Class</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Elite international competitor level</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Gold</td>
              </tr>
              <tr style={{ background: '#eff6ff' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#1e40af', fontWeight: '600' }}>425 – 499</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Elite</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>National level competitor, top 1% of lifters</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td>
              </tr>
              <tr style={{ background: '#f0fdf4' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#166534', fontWeight: '600' }}>350 – 424</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Advanced</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Competitive club lifter, podium contender</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Green</td>
              </tr>
              <tr style={{ background: '#f0fdfa' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#134e4a', fontWeight: '600' }}>275 – 349</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Intermediate</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Experienced lifter with solid competition results</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Teal</td>
              </tr>
              <tr style={{ background: '#fefce8' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#713f12', fontWeight: '600' }}>200 – 274</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Novice</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Early competition stage, building foundation</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td>
              </tr>
              <tr style={{ background: '#fef2f2' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#991b1b', fontWeight: '600' }}>Below 200</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Beginner</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>New to the sport, significant gains ahead</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td>
              </tr>
            </tbody>
          </table>
          <p><em>Note: These benchmarks apply to raw (unequipped) lifting. Equipped lifting (single-ply or multi-ply) allows significantly higher totals and therefore higher Wilks Scores.</em></p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Powerlifting Weight Classes and Wilks</h2>
          <p>Powerlifting competitions are organized by bodyweight classes, but the Wilks Score allows cross-class comparison for best lifter awards. Understanding which weight classes produce the highest Wilks Scores helps explain why certain weight classes are considered the most competitive.</p>
          
          <h3>IPF Men's Weight Classes (Raw):</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Weight Class</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Typical Elite Total</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Approximate Elite Wilks</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>59 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>550–580 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>420–445</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>66 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>620–660 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>430–460</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>74 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>680–730 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>435–465</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>83 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>740–790 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>440–470</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>93 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>800–860 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>445–475</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>105 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>840–910 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>435–465</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>120 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>880–950 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>425–455</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>120 kg+</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>900–980 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>405–440</td>
              </tr>
            </tbody>
          </table>

          <h3>IPF Women's Weight Classes (Raw):</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Weight Class</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Typical Elite Total</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Approximate Elite Wilks</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>47 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>310–340 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>390–425</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>52 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>350–385 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>400–435</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>57 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>390–430 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>410–445</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>63 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>425–470 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>415–450</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>69 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>455–500 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>415–450</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>76 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>480–525 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>410–445</td>
              </tr>
              <tr style={{ background: '#f8fafc' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>84 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>500–550 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>400–435</td>
              </tr>
              <tr style={{ background: 'white' }}>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>84 kg+</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>520–570 kg</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>385–420</td>
              </tr>
            </tbody>
          </table>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Improve Your Wilks Score</h2>
          <p>Your Wilks Score improves when your total increases faster than your bodyweight. Here are the most effective strategies:</p>
          
          <h3>1. Find your optimal weight class.</h3>
          <p>Many lifters perform best when competing at the lower end of a weight class — being lean at your weight class rather than heavy in a higher class often produces better Wilks Scores.</p>
          
          <h3>2. Prioritize your weakest lift.</h3>
          <p>Because Wilks is based on total (squat + bench + deadlift), improving your weakest lift produces the biggest total gains. A lifter who deadlifts well but benches poorly will improve their Wilks faster by focusing on bench press.</p>
          
          <h3>3. Run a structured periodization program.</h3>
          <p>Powerlifting programs like 5/3/1, Sheiko, or Conjugate periodization are designed to peak your total for competition. Following a proven program produces more consistent total improvements than random training.</p>
          
          <h3>4. Compete regularly.</h3>
          <p>The meet environment pushes lifters to hit attempts they wouldn't attempt in training. Many lifters find their competition totals are significantly higher than their gym maxes, directly improving their Wilks Score.</p>
          
          <h3>5. Master technical efficiency.</h3>
          <p>Legal competition lifts require specific technique standards. Improving your squat depth, bench press pause, and deadlift lockout not only ensures white lights but often produces stronger, more efficient lifts.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What is a good Wilks Score for a beginner?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>For a beginner powerlifter, a Wilks Score of 150–200 is typical after the first year of training. A score of 200–275 represents a novice-to-intermediate level. Most recreational lifters who train consistently for 2–3 years reach Wilks Scores in the 250–325 range.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What is the difference between Wilks and DOTS score?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>Both Wilks and DOTS normalize powerlifting totals by bodyweight using polynomial equations, but they use different mathematical constants and scaling factors. DOTS was developed more recently and is now the official metric of the IPF (International Powerlifting Federation). Wilks is still used by many non-IPF federations. The scores are not directly comparable — a Wilks of 380 is not the same as a DOTS of 380.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Should I calculate Wilks in kg or lbs?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>The Wilks formula uses kilograms as its base unit. Our calculator automatically converts lbs to kg if you enter weights in pounds. For official competition purposes, always use kilograms as powerlifting federations worldwide record and compare totals in kg.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>What is the highest Wilks Score ever recorded?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>The highest Wilks Scores in powerlifting history have been achieved in equipped (multi-ply) lifting, with scores above 700 recorded. In raw powerlifting, scores above 550–600 represent the absolute pinnacle of the sport. Lifters like Ray Williams, Blaine Sumner, and Stefi Cohen have produced some of the highest raw Wilks Scores ever recorded.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Does Wilks Score work for equipped powerlifting?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>Yes — the Wilks formula can be applied to equipped totals (single-ply or multi-ply), but equipped and raw Wilks Scores should not be compared directly. Supportive equipment like squat suits and bench shirts add significant weight to totals, producing higher Wilks Scores than raw lifting at the same bodyweight.</p>
              </div>
            </details>
            
            <details style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '1rem' }}>
              <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: '600', color: '#1e293b' }}>Which powerlifting federation uses which formula?</summary>
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p>The IPF (International Powerlifting Federation) and its affiliates — including USAPL, CPU (Canada), British Powerlifting, and Powerlifting Australia — use the DOTS formula. Many non-IPF federations such as the WRPF, RPS, and APF continue to use the original Wilks or Wilks2 formula. Always check your specific federation's rules before competition.</p>
              </div>
            </details>
          </div>
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
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Estimate your one rep max for any lift with training zones</p>
            </a>
            <a href="/sports/vo2-max-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>VO2 Max Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate your VO2 max and cardiovascular fitness level</p>
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
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate running pace, speed, and finish times</p>
            </a>
            <a href="/health/bmi-calculator" style={{ 
              display: 'block', 
              padding: '1.5rem', 
              background: '#f8fafc', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s'
            }} onMouseOver={(e) => { e.target.style.background = '#f1f5f9'; e.target.style.borderColor = '#cbd5e1'; }} onMouseOut={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#e5e7eb'; }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.1rem' }}>BMI Calculator</h3>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#64748b' }}>Calculate your Body Mass Index and health category</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WilksCalculator
