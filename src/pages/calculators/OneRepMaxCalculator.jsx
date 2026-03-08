import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const OneRepMaxCalculator = () => {
  const [units, setUnits] = useState('imperial')
  const [exercise, setExercise] = useState('bench-press')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [gender, setGender] = useState('male')
  const [bodyweight, setBodyweight] = useState('')
  const [formula, setFormula] = useState('epley')
  const [results, setResults] = useState(null)

  const exercises = [
    { value: 'bench-press', label: 'Bench Press' },
    { value: 'squat', label: 'Squat' },
    { value: 'deadlift', label: 'Deadlift' },
    { value: 'overhead-press', label: 'Overhead Press' },
    { value: 'barbell-row', label: 'Barbell Row' },
    { value: 'custom', label: 'Custom' }
  ]

  const formulas = [
    { value: 'epley', label: 'Epley' },
    { value: 'brzycki', label: 'Brzycki' },
    { value: 'lander', label: 'Lander' },
    { value: 'lombardi', label: 'Lombardi' },
    { value: 'mayhew', label: 'Mayhew' },
    { value: 'oconner', label: 'O\'Conner' },
    { value: 'wathan', label: 'Wathan' }
  ]

  const calculate1RM = (weight, reps, formula) => {
    if (reps === 1) return weight

    switch (formula) {
      case 'epley':
        return weight * (1 + reps / 30)
      case 'brzycki':
        return weight * (36 / (37 - reps))
      case 'lander':
        return (100 * weight) / (101.3 - 2.67123 * reps)
      case 'lombardi':
        return weight * Math.pow(reps, 0.10)
      case 'mayhew':
        return (100 * weight) / (52.2 + (41.9 * Math.exp(-0.055 * reps)))
      case 'oconner':
        return weight * (1 + reps / 40)
      case 'wathan':
        return (100 * weight) / (48.8 + (53.8 * Math.exp(-0.075 * reps)))
      default:
        return weight * (1 + reps / 30)
    }
  }

  const calculateAllFormulas = (weight, reps) => {
    return formulas.map(f => ({
      name: f.label,
      value: f.value,
      estimated1RM: calculate1RM(weight, reps, f.value)
    }))
  }

  const getStrengthStandard = (exercise, gender, bodyweight, oneRepMax) => {
    const ratio = oneRepMax / bodyweight
    let level = 'beginner'
    let color = '#dc2626'

    const standards = {
      'bench-press': {
        male: [
          { max: 0.5, level: 'beginner', color: '#dc2626' },
          { max: 0.99, level: 'novice', color: '#ea580c' },
          { max: 1.24, level: 'intermediate', color: '#ca8a04' },
          { max: 1.74, level: 'advanced', color: '#16a34a' },
          { max: Infinity, level: 'elite', color: '#2563eb' }
        ],
        female: [
          { max: 0.35, level: 'beginner', color: '#dc2626' },
          { max: 0.64, level: 'novice', color: '#ea580c' },
          { max: 0.99, level: 'intermediate', color: '#ca8a04' },
          { max: 1.29, level: 'advanced', color: '#16a34a' },
          { max: Infinity, level: 'elite', color: '#2563eb' }
        ]
      },
      'squat': {
        male: [
          { max: 0.75, level: 'beginner', color: '#dc2626' },
          { max: 1.24, level: 'novice', color: '#ea580c' },
          { max: 1.74, level: 'intermediate', color: '#ca8a04' },
          { max: 2.24, level: 'advanced', color: '#16a34a' },
          { max: Infinity, level: 'elite', color: '#2563eb' }
        ],
        female: [
          { max: 0.5, level: 'beginner', color: '#dc2626' },
          { max: 0.99, level: 'novice', color: '#ea580c' },
          { max: 1.49, level: 'intermediate', color: '#ca8a04' },
          { max: 1.99, level: 'advanced', color: '#16a34a' },
          { max: Infinity, level: 'elite', color: '#2563eb' }
        ]
      },
      'deadlift': {
        male: [
          { max: 1.0, level: 'beginner', color: '#dc2626' },
          { max: 1.49, level: 'novice', color: '#ea580c' },
          { max: 1.99, level: 'intermediate', color: '#ca8a04' },
          { max: 2.49, level: 'advanced', color: '#16a34a' },
          { max: Infinity, level: 'elite', color: '#2563eb' }
        ],
        female: [
          { max: 0.75, level: 'beginner', color: '#dc2626' },
          { max: 1.24, level: 'novice', color: '#ea580c' },
          { max: 1.74, level: 'intermediate', color: '#ca8a04' },
          { max: 2.24, level: 'advanced', color: '#16a34a' },
          { max: Infinity, level: 'elite', color: '#2563eb' }
        ]
      }
    }

    const exerciseStandards = standards[exercise] || standards['bench-press']
    const genderStandards = exerciseStandards[gender] || exerciseStandards.male

    for (const standard of genderStandards) {
      if (ratio <= standard.max) {
        level = standard.level
        color = standard.color
        break
      }
    }

    return { level, color, ratio }
  }

  const getTrainingZones = (oneRepMax) => {
    return [
      { zone: 'Max Strength', minPercent: 95, maxPercent: 100, reps: '1–2', goal: 'Peak strength' },
      { zone: 'Heavy Strength', minPercent: 85, maxPercent: 94, reps: '2–4', goal: 'Strength gain' },
      { zone: 'Strength', minPercent: 75, maxPercent: 84, reps: '4–6', goal: 'Strength + size' },
      { zone: 'Hypertrophy', minPercent: 65, maxPercent: 74, reps: '8–12', goal: 'Muscle building' },
      { zone: 'Endurance', minPercent: 50, maxPercent: 64, reps: '15–20', goal: 'Muscular endurance' },
      { zone: 'Active Recovery', minPercent: 40, maxPercent: 49, reps: '20+', goal: 'Recovery work' }
    ].map(zone => ({
      ...zone,
      minWeight: oneRepMax * (zone.minPercent / 100),
      maxWeight: oneRepMax * (zone.maxPercent / 100)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const weightNum = parseFloat(weight)
    const repsNum = parseInt(reps)
    const bodyweightNum = parseFloat(bodyweight)

    if (weightNum > 0 && repsNum > 0 && bodyweightNum > 0) {
      const primary1RM = calculate1RM(weightNum, repsNum, formula)
      const allFormulas = calculateAllFormulas(weightNum, repsNum)
      const strengthStandard = getStrengthStandard(exercise, gender, bodyweightNum, primary1RM)
      const trainingZones = getTrainingZones(primary1RM)

      setResults({
        primary1RM,
        formula,
        allFormulas,
        strengthStandard,
        trainingZones,
        warning: repsNum > 12
      })
    }
  }

  const convertWeight = (value, toUnit) => {
    if (toUnit === 'metric') {
      return (value * 0.453592).toFixed(1)
    } else {
      return (value * 2.20462).toFixed(1)
    }
  }

  const displayWeight = (weight) => {
    if (units === 'metric') {
      return `${(weight * 0.453592).toFixed(1)} kg`
    } else {
      return `${weight.toFixed(0)} lbs`
    }
  }

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>One Rep Max Calculator (1RM) — Bench Press, Squat & Deadlift | CalcLogic</title>
        <meta name="description" content="Free one rep max calculator. Instantly estimate your 1RM for bench press, squat, deadlift, and any lift using 7 proven formulas. Includes training zone percentages and strength standards by bodyweight." />
        <meta name="keywords" content="one rep max calculator, 1rm calculator, bench press max calculator, squat max calculator, deadlift max calculator, 1 rep max formula, epley formula calculator" />
        <link rel="canonical" href="https://calclogic.com/sports/one-rep-max-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="One Rep Max Calculator (1RM) — Bench Press, Squat & Deadlift | CalcLogic" />
        <meta property="og:description" content="Free one rep max calculator. Instantly estimate your 1RM for bench press, squat, deadlift, and any lift using 7 proven formulas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/one-rep-max-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="One Rep Max Calculator (1RM) — Free & Instant | CalcLogic" />
        <meta name="twitter:description" content="Calculate your one rep max in seconds. Free, no signup, 7 proven formulas included." />
        
        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "One Rep Max Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Estimate your one rep max (1RM) for any lift using 7 proven formulas. Includes training zones and strength standards."
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
                "name": "How accurate is a 1RM calculator?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "1RM calculators are most accurate when based on sets of 3–6 reps. Accuracy decreases as rep count increases — estimates based on 10+ reps can be off by 5–10%. For the most reliable estimate, use a weight you can lift for 3–5 reps with perfect form and calculate from there."
                }
              },
              {
                "@type": "Question",
                "name": "What is a good 1RM bench press?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good bench press 1RM depends on your bodyweight. For men, lifting your bodyweight (1× BW) is considered intermediate level. For women, a 0.75× bodyweight bench press is a strong intermediate benchmark. Elite male powerlifters typically bench 2× bodyweight or more."
                }
              },
              {
                "@type": "Question",
                "name": "Should I actually attempt my 1RM in the gym?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not necessarily. For most people training for health, fitness, or muscle building, a calculated 1RM from a heavy 3–5 rep set is accurate enough to set training percentages — and much safer. True 1RM testing is most relevant for competitive powerlifters preparing for a meet."
                }
              },
              {
                "@type": "Question",
                "name": "Which 1RM formula is the most accurate?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The Brzycki formula is generally considered the most accurate for sets of 10 reps or fewer. The Epley formula is the most widely used overall. For sets above 10 reps, accuracy drops across all formulas — keeping your test set to 6 reps or fewer gives the best estimate regardless of formula."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I test my 1RM?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For most lifters, testing or calculating your 1RM every 8–12 weeks is sufficient to update your training percentages. More frequent testing can interfere with your training program and increase injury risk. Competitive powerlifters typically peak for a true 1RM attempt 2–3 times per year around competitions."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use the 1RM calculator for all exercises?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — the formulas work for any barbell or dumbbell exercise where you can measure a consistent weight and rep count. They are most commonly used for the big compound lifts: bench press, squat, deadlift, and overhead press. They are less reliable for machine exercises or movements where form significantly changes under heavy load."
                }
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>One Rep Max Calculator (1RM)</h1>
          <p className="calculator-description">
            Estimate your one rep max for bench press, squat, deadlift, and any lift using 7 proven formulas. Includes training zones and strength standards.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="input-section">
            <h2>Exercise Selection</h2>
            <div className="input-group">
              <label htmlFor="exercise">Exercise</label>
              <div className="input-field">
                <select
                  id="exercise"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  required
                >
                  {exercises.map(ex => (
                    <option key={ex.value} value={ex.value}>{ex.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="input-section">
            <h2>Lift Performance</h2>
            <div className="input-group">
              <label htmlFor="units">Units</label>
              <div className="unit-toggle">
                <button
                  type="button"
                  className={`unit-btn ${units === 'imperial' ? 'active' : ''}`}
                  onClick={() => setUnits('imperial')}
                >
                  lbs
                </button>
                <button
                  type="button"
                  className={`unit-btn ${units === 'metric' ? 'active' : ''}`}
                  onClick={() => setUnits('metric')}
                >
                  kg
                </button>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="weight">Weight Lifted</label>
              <div className="input-field">
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  min="1"
                  step="0.1"
                  placeholder={units === 'imperial' ? 'lbs' : 'kg'}
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="reps">Reps Performed</label>
              <div className="input-field">
                <input
                  type="number"
                  id="reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  required
                  min="1"
                  max="20"
                  placeholder="1-12"
                />
              </div>
            </div>
          </div>

          <div className="input-section">
            <h2>Strength Standards</h2>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
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
                  min="1"
                  step="0.1"
                  placeholder={units === 'imperial' ? 'lbs' : 'kg'}
                />
              </div>
            </div>
          </div>

          <div className="input-section">
            <h2>Calculation Method</h2>
            <div className="input-group">
              <label htmlFor="formula">Formula</label>
              <div className="input-field">
                <select
                  id="formula"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  required
                >
                  {formulas.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="calculate-btn">Calculate My 1RM</button>
        </form>

        {results && (
          <div className="results-section">
            <h2>Your 1RM Results</h2>
            
            {results.warning && (
              <div style={{ 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px', 
                padding: '1rem', 
                marginBottom: '1.5rem',
                color: '#92400e'
              }}>
                ⚠️ Results are less accurate above 12 reps. For best accuracy, use a weight you can lift for 3-6 reps.
              </div>
            )}

            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Your Estimated 1RM</span>
                <span className="result-value">{displayWeight(results.primary1RM)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Formula Used</span>
                <span className="result-value">{formulas.find(f => f.value === results.formula)?.label}</span>
              </div>
            </div>

            <div style={{ 
              background: '#1e2235', 
              borderRadius: '12px', 
              padding: '1.5rem', 
              marginTop: '2rem' 
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>
                Strength Standard: {results.strengthStandard.level.charAt(0).toUpperCase() + results.strengthStandard.level.slice(1)}
              </h3>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                backgroundColor: results.strengthStandard.color,
                color: 'white',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                {results.strengthStandard.level.toUpperCase()}
              </div>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                Your 1RM is {results.strengthStandard.ratio.toFixed(2)}× your bodyweight
              </p>
            </div>
          </div>
        )}

        {results && (
          <div className="content-section">
            <h2>Formula Comparison</h2>
            <p>Different formulas can give slightly different estimates. Here's how all 7 formulas compare:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Formula</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Estimated 1RM</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {results.allFormulas.map((f, index) => (
                  <tr key={f.value} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ fontWeight: f.value === results.formula ? '600' : 'normal', color: f.value === results.formula ? '#2563eb' : 'inherit' }}>
                        {f.name} {f.value === results.formula && '(Used)'}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                      {displayWeight(f.estimated1RM)}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#64748b' }}>
                      {f.value === 'epley' && 'General use, most popular'}
                      {f.value === 'brzycki' && 'Low rep sets (1–6 reps)'}
                      {f.value === 'lander' && 'Moderate rep ranges'}
                      {f.value === 'lombardi' && 'Higher rep sets'}
                      {f.value === 'mayhew' && 'Athletes, sport science'}
                      {f.value === 'oconner' && 'Beginners'}
                      {f.value === 'wathan' && 'General fitness'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && (
          <div className="content-section">
            <h2>Training Zones</h2>
            <p>Use these percentages to structure your training based on your goals:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
              <thead>
                <tr>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Training Zone</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>% of 1RM</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Weight to Use</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Reps</th>
                  <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Goal</th>
                </tr>
              </thead>
              <tbody>
                {results.trainingZones.map((zone, index) => {
                  const borderColors = {
                    'Max Strength': '#dc2626',
                    'Heavy Strength': '#ea580c',
                    'Strength': '#ca8a04',
                    'Hypertrophy': '#16a34a',
                    'Endurance': '#2563eb',
                    'Active Recovery': '#7c3aed'
                  }
                  return (
                    <tr key={zone.zone} style={{ 
                      background: index % 2 === 0 ? '#f8fafc' : 'white',
                      borderLeft: `4px solid ${borderColors[zone.zone]}`
                    }}>
                      <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>
                        {zone.zone}
                      </td>
                      <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                        {zone.minPercent}–{zone.maxPercent}%
                      </td>
                      <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                        {displayWeight(zone.minWeight)} – {displayWeight(zone.maxWeight)}
                      </td>
                      <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                        {zone.reps}
                      </td>
                      <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                        {zone.goal}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="content-section">
          <h2>What is a One Rep Max (1RM)?</h2>
          <p>Your one rep max (1RM) is the maximum amount of weight you can lift for a single repetition of any given exercise with proper form. It is the universal standard for measuring absolute strength in weightlifting, powerlifting, and strength training programs.</p>
          <p>Knowing your 1RM serves two key purposes. First, it gives you an objective benchmark to track strength progress over time. Second, it allows you to calculate precise training weights for every rep range — so instead of guessing how much to lift, you can train with scientific accuracy based on your actual strength level.</p>
          <p>You don't need to attempt a dangerous maximum lift to find your 1RM. Our calculator estimates it from a weight you can lift for multiple reps using proven mathematical formulas developed by sports scientists and strength coaches.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How is 1RM Calculated? The Formulas Explained</h2>
          <p>Several validated formulas exist for estimating your one rep max. Each was developed by different researchers and performs best under different conditions. Our calculator uses all seven and shows you the full comparison.</p>

          <h3>Epley Formula (Most Popular)</h3>
          <p>Developed by Boyd Epley in 1985, this is the most widely used 1RM formula in gyms worldwide:</p>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            1RM = Weight × (1 + Reps ÷ 30)<br /><br />
            Example: If you lift 185 lbs for 8 reps → 185 × (1 + 8/30) = 185 × 1.267 = <strong>234 lbs</strong>
          </div>

          <h3>Brzycki Formula (Most Accurate for Low Reps)</h3>
          <p>Matt Brzycki's formula is considered the most accurate for sets of 10 reps or fewer:</p>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            1RM = Weight × (36 ÷ (37 − Reps))
          </div>

          <h3>Other Formulas</h3>
          <ul style={{ lineHeight: '1.8', color: '#374151' }}>
            <li><strong>Lander Formula:</strong> 1RM = (100 × Weight) ÷ (101.3 − 2.67 × Reps)</li>
            <li><strong>Lombardi Formula:</strong> 1RM = Weight × Reps^0.10</li>
            <li><strong>Mayhew Formula:</strong> Popular in sports science research: 1RM = (100 × Weight) ÷ (52.2 + 41.9 × e^(−0.055 × Reps))</li>
            <li><strong>O'Conner Formula:</strong> A simpler formula often recommended for beginners: 1RM = Weight × (1 + Reps ÷ 40)</li>
            <li><strong>Wathan Formula:</strong> 1RM = (100 × Weight) ÷ (48.8 + 53.8 × e^(−0.075 × Reps))</li>
          </ul>

          <p><strong>Which formula should you use?</strong> For most people, the <strong>Epley</strong> formula is the best default. If you're performing sets of 6 reps or fewer, <strong>Brzycki</strong> tends to be more precise. Our calculator shows all seven results so you can see the full range of estimates.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>1RM Strength Standards — How Do You Compare?</h2>
          <p>Use these standards to see how your one rep max compares to other lifters of the same bodyweight. Standards are expressed as a ratio of your 1RM to your bodyweight.</p>

          <h3>Bench Press Standards (Men)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Bodyweight Multiplier</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (180 lb person)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Beginner</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 0.5×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 90 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#ea580c', fontWeight: '600' }}>Novice</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.5–0.99×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>90–178 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Orange</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#ca8a04', fontWeight: '600' }}>Intermediate</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.0–1.24×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>180–223 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Advanced</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1.25–1.74×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>225–313 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Green</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#2563eb', fontWeight: '600' }}>Elite</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.75× and above</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>315 lbs+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td></tr>
            </tbody>
          </table>

          <h3>Bench Press Standards (Women)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Bodyweight Multiplier</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (140 lb person)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Beginner</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 0.35×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 49 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#ea580c', fontWeight: '600' }}>Novice</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.35–0.64×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>49–89 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Orange</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#ca8a04', fontWeight: '600' }}>Intermediate</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>0.65–0.99×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>91–138 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Advanced</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1.0–1.29×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>140–180 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Green</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#2563eb', fontWeight: '600' }}>Elite</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.3× and above</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>182 lbs+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td></tr>
            </tbody>
          </table>

          <h3>Squat Standards (Men)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Bodyweight Multiplier</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (180 lb person)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Beginner</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 0.75×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 135 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#ea580c', fontWeight: '600' }}>Novice</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.75–1.24×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>135–223 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Orange</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#ca8a04', fontWeight: '600' }}>Intermediate</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.25–1.74×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>225–313 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Advanced</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1.75–2.24×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>315–403 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Green</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#2563eb', fontWeight: '600' }}>Elite</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2.25× and above</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>405 lbs+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td></tr>
            </tbody>
          </table>

          <h3>Squat Standards (Women)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Bodyweight Multiplier</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (140 lb person)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Beginner</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 0.5×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 70 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#ea580c', fontWeight: '600' }}>Novice</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.5–0.99×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>70–138 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Orange</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#ca8a04', fontWeight: '600' }}>Intermediate</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.0–1.49×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>140–208 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Advanced</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1.5–1.99×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>210–278 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Green</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#2563eb', fontWeight: '600' }}>Elite</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2.0× and above</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>280 lbs+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td></tr>
            </tbody>
          </table>

          <h3>Deadlift Standards (Men)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Bodyweight Multiplier</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (180 lb person)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Beginner</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 1.0×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 180 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#ea580c', fontWeight: '600' }}>Novice</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1.0–1.49×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>180–268 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Orange</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#ca8a04', fontWeight: '600' }}>Intermediate</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.5–1.99×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>270–358 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Advanced</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>2.0–2.49×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>360–448 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Green</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#2563eb', fontWeight: '600' }}>Elite</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2.5× and above</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>450 lbs+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td></tr>
            </tbody>
          </table>

          <h3>Deadlift Standards (Women)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Level</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Bodyweight Multiplier</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (140 lb person)</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Color</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Beginner</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 0.75×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 105 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Red</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#ea580c', fontWeight: '600' }}>Novice</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.75–1.24×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>105–173 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Orange</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#ca8a04', fontWeight: '600' }}>Intermediate</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.25–1.74×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>175–243 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Yellow</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Advanced</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1.75–2.24×</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>245–313 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Green</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#2563eb', fontWeight: '600' }}>Elite</span></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2.25× and above</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>315 lbs+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blue</td></tr>
            </tbody>
          </table>

          <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic', borderTop: '1px dashed #e5e7eb', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            Note: Standards are based on raw (unequipped) lifting without supportive gear. Individual variation in limb length, leverages, and training history means these are general benchmarks, not rigid rules.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Training Zones — How to Use Your 1RM</h2>
          <p>Once you know your one rep max, you can structure every training session with precision. Different percentages of your 1RM produce different physiological adaptations. Use the table below to match your training weight to your goal.</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Zone</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>% of 1RM</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Reps per Set</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Primary Goal</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Example (225 lb 1RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderLeft: '4px solid #dc2626' }}><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc', fontWeight: '600' }}>Max Strength</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>95–100%</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1–2</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Absolute strength</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>214–225 lbs</td></tr>
              <tr style={{ borderLeft: '4px solid #ea580c' }}><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Heavy Strength</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>85–94%</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>2–4</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Strength development</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>191–211 lbs</td></tr>
              <tr style={{ borderLeft: '4px solid #ca8a04' }}><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc', fontWeight: '600' }}>Strength</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>75–84%</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>4–6</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Strength + size</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>169–189 lbs</td></tr>
              <tr style={{ borderLeft: '4px solid #16a34a' }}><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Hypertrophy</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>65–74%</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>8–12</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Muscle building</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>146–167 lbs</td></tr>
              <tr style={{ borderLeft: '4px solid #2563eb' }}><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc', fontWeight: '600' }}>Muscular Endurance</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>50–64%</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>15–20</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Endurance + tone</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>113–144 lbs</td></tr>
              <tr style={{ borderLeft: '4px solid #7c3aed' }}><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Active Recovery</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 50%</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>20+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Blood flow, recovery</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 113 lbs</td></tr>
            </tbody>
          </table>

          <p><strong>How to apply this:</strong> If your goal is building muscle (hypertrophy), train between 65–74% of your 1RM for sets of 8–12 reps. If you want to build maximum strength, train above 85% for low rep sets. Most well-designed programs include a mix of zones across the training week.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How to Test Your 1RM Safely</h2>
          <p>Attempting a true one rep max lift carries injury risk if done incorrectly. Follow these guidelines to test your 1RM as safely as possible:</p>
          
          <p><strong>1. Warm up thoroughly.</strong> Start with 5–10 minutes of light cardio followed by progressive warm-up sets. A typical warm-up sequence for a 225 lb bench press might be: 45 lbs × 10, 95 lbs × 8, 135 lbs × 5, 165 lbs × 3, 185 lbs × 1, then attempt 225 lbs.</p>
          
          <p><strong>2. Use a spotter.</strong> Never attempt a true 1RM on bench press or squat without an experienced spotter or safety equipment such as a power rack with properly set safety bars.</p>
          
          <p><strong>3. Rest fully between attempts.</strong> Take 3–5 minutes of rest between heavy singles. Fatigue will artificially limit your max and increase injury risk.</p>
          
          <p><strong>4. Stop at technical failure.</strong> Your 1RM should be the heaviest weight you can lift with controlled, safe technique. A lift with severe form breakdown does not count and risks injury.</p>
          
          <p><strong>5. Consider using this calculator instead.</strong> For most training purposes, an estimated 1RM from a heavy set of 3–5 reps is safer and accurate enough to set your training percentages. You don't need to test your true 1RM more than 2–3 times per year.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>1RM by Age — Does Strength Decline With Age?</h2>
          <p>Yes — maximum strength naturally peaks in most people between ages 25–35 and gradually declines thereafter. However, the rate of decline is strongly influenced by training consistency. Research consistently shows that people who continue strength training maintain significantly more muscle mass and strength into their 60s, 70s, and beyond compared to sedentary individuals.</p>
          
          <p>General age-related strength adjustments (approximate):</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Age Group</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Relative Strength Expectation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>18–25</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Peak strength development period</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>26–35</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Absolute peak strength for most lifters</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>36–45</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Minor decline (~5–10% from peak)</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>46–55</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Moderate decline (~15–20% from peak)</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>56–65</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Noticeable decline (~25–30% from peak)</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>65+</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Significant decline, but training still very effective</td></tr>
            </tbody>
          </table>

          <p>The key takeaway: strength standards should be adjusted for age. A 55-year-old lifter with an intermediate-level bench press for their bodyweight is performing at an exceptionally high level relative to their age group.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How accurate is a 1RM calculator?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>1RM calculators are most accurate when based on sets of 3–6 reps. Accuracy decreases as rep count increases — estimates based on 10+ reps can be off by 5–10%. For the most reliable estimate, use a weight you can lift for 3–5 reps with perfect form and calculate from there.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What is a good 1RM bench press?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>A good bench press 1RM depends on your bodyweight. For men, lifting your bodyweight (1× BW) is considered intermediate level. For women, a 0.75× bodyweight bench press is a strong intermediate benchmark. Elite male powerlifters typically bench 2× bodyweight or more.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Should I actually attempt my 1RM in the gym?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Not necessarily. For most people training for health, fitness, or muscle building, a calculated 1RM from a heavy 3–5 rep set is accurate enough to set training percentages — and much safer. True 1RM testing is most relevant for competitive powerlifters preparing for a meet.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Which 1RM formula is the most accurate?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The Brzycki formula is generally considered the most accurate for sets of 10 reps or fewer. The Epley formula is the most widely used overall. For sets above 10 reps, accuracy drops across all formulas — keeping your test set to 6 reps or fewer gives the best estimate regardless of formula.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How often should I test my 1RM?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>For most lifters, testing or calculating your 1RM every 8–12 weeks is sufficient to update your training percentages. More frequent testing can interfere with your training program and increase injury risk. Competitive powerlifters typically peak for a true 1RM attempt 2–3 times per year around competitions.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Can I use the 1RM calculator for all exercises?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Yes — the formulas work for any barbell or dumbbell exercise where you can measure a consistent weight and rep count. They are most commonly used for the big compound lifts: bench press, squat, deadlift, and overhead press. They are less reliable for machine exercises or movements where form significantly changes under heavy load.</p>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2rem' }}>
            <em>This calculator is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before making decisions about your health.</em>
          </p>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.2rem 1.4rem', margin: '2rem 0' }}>
          <h3 style={{ marginTop: '0', color: '#15803d', fontSize: '0.95rem' }}>🔗 Related CalcLogic Calculators</h3>
          <a href="/sports/pace-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Pace Calculator</a>
          <a href="/sports/vo2-max-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>VO2 Max Calculator</a>
          <a href="/fitness/bmi-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>BMI Calculator</a>
          <a href="/fitness/calorie-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Calorie Calculator</a>
        </div>
        
        <ShareButtons 
          title="One Rep Max Calculator"
          description="Calculate your one rep max (1RM) for any lift using 7 proven formulas"
          customMessage="Check out this One Rep Max Calculator - Calculate your 1RM for bench press, squat, deadlift and any lift!"
        />
      </div>
    </div>
  )
}

export default OneRepMaxCalculator
