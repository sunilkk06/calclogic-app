import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    units: 'metric',
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    heightFt: '',
    heightIn: '',
    weightLb: '',
    activityLevel: '1.2'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateCalories = (e) => {
    e.preventDefault()
    
    let weight, heightCm
    
    if (formData.units === 'metric') {
      heightCm = parseFloat(formData.height)
      weight = parseFloat(formData.weight)
    } else {
      const heightFt = parseFloat(formData.heightFt) || 0
      const heightIn = parseFloat(formData.heightIn) || 0
      const totalInches = (heightFt * 12) + heightIn
      heightCm = totalInches * 2.54
      weight = parseFloat(formData.weightLb) * 0.453592 // Convert lbs to kg
    }
    
    const age = parseInt(formData.age)
    const activityLevel = parseFloat(formData.activityLevel)
    
    if (isNaN(age) || isNaN(heightCm) || isNaN(weight) || isNaN(activityLevel) || 
        age <= 0 || heightCm <= 0 || weight <= 0) {
      return
    }

    let bmr
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161
    }
    
    const tdee = bmr * activityLevel
    
    const lossMild = tdee - 250
    const lossModerate = tdee - 500
    const gainMild = tdee + 250
    const gainModerate = tdee + 500
    
    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      lossMild: Math.round(lossMild),
      lossModerate: Math.round(lossModerate),
      gainMild: Math.round(gainMild),
      gainModerate: Math.round(gainModerate)
    })
  }

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Calorie Calculator — Daily Calorie Needs for Weight Loss & Maintenance | CalcLogic</title>
        <meta name="description" content="Free calorie calculator using the Mifflin-St Jeor equation. Find your daily calorie needs based on age, height, weight, and activity level." />
        <link rel="canonical" href="https://calclogic.com/calorie-calculator" />
        
        <meta property="og:title" content="Calorie Calculator — Daily Calorie Needs for Weight Loss & Gain | CalcLogic" />
        <meta property="og:description" content="Calculate your daily calorie needs using the science-backed Mifflin-St Jeor equation. Get personalized targets for weight loss, maintenance, and muscle gain." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/calorie-calculator" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Calorie Calculator — Free & Personalised | CalcLogic" />
        <meta name="twitter:description" content="Calculate your daily calorie needs using the Mifflin-St Jeor equation. Get personalized targets for weight loss, maintenance, and muscle gain." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How many calories should I eat per day?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The average adult needs 1,600–3,000 calories per day, depending on age, sex, height, weight, and activity level. Sedentary women typically need around 1,600–2,000 calories, while active men may need 2,400–3,000. Use a TDEE calculator for a personalized estimate."
                }
              },
              {
                "@type": "Question",
                "name": "How many calories do I need to lose weight?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To lose weight, you need to consume fewer calories than you burn (a calorie deficit). A deficit of 500 calories per day leads to approximately 0.5 kg (1 lb) of fat loss per week. Most health guidelines recommend a minimum of 1,200 calories per day for women and 1,500 for men."
                }
              },
              {
                "@type": "Question",
                "name": "What is TDEE?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "TDEE stands for Total Daily Energy Expenditure — the total number of calories your body burns in a day, including your resting metabolism and all physical activity. It is the most accurate number to use when setting calorie targets for weight management."
                }
              },
              {
                "@type": "Question",
                "name": "What is BMR and how is it calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to sustain basic functions like breathing and circulation. The Mifflin-St Jeor equation is the most widely validated formula: For men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5. For women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161."
                }
              },
              {
                "@type": "Question",
                "name": "How many calories should I eat to gain muscle?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To build muscle, consume a modest calorie surplus above your TDEE — typically 250–500 extra calories per day. A larger surplus results in more fat gain alongside muscle. Pair the surplus with adequate protein intake (1.6–2.2g per kg of body weight) and progressive resistance training."
                }
              },
              {
                "@type": "Question",
                "name": "Is 1200 calories a day enough?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "1,200 calories is the commonly cited minimum for women to obtain adequate nutrition. Harvard Health warns against consistently eating below this level without medical supervision, as it can lead to nutrient deficiencies, muscle loss, and metabolic adaptation. For most active adults, 1,200 calories is not sufficient for long-term health."
                }
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate Your Daily Calorie Needs",
            "description": "Step-by-step guide to calculating your BMR and TDEE for weight loss, maintenance, or muscle gain.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Enter your personal details",
                "text": "Enter your gender, age, height, and weight into the calorie calculator. Use metric (kg, cm) or imperial (lbs, ft, in) — both are supported."
              },
              {
                "@type": "HowToStep",
                "name": "Select your activity level",
                "text": "Choose the activity level that best describes your typical week — from sedentary (desk job, little exercise) to extra active (physical job plus hard training). Be honest — overestimating activity is the most common mistake."
              },
              {
                "@type": "HowToStep",
                "name": "Read your BMR and TDEE",
                "text": "Your BMR is your resting calorie burn. Your TDEE is your total daily burn including activity. Use your TDEE as your maintenance baseline."
              },
              {
                "@type": "HowToStep",
                "name": "Set your calorie target",
                "text": "Subtract 500 from your TDEE to lose approximately 0.5kg per week. Eat at your TDEE to maintain weight. Add 200–300 calories above TDEE to build muscle gradually."
              }
            ]
          })}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Calorie Calculator (BMR & TDEE)</h1>
          <p className="calculator-description">
            Estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
          </p>
        </div>

        <form onSubmit={calculateCalories} className="calculator-form">
          <div className="input-section">
            <h2>Unit Selection</h2>
            <div className="input-group">
              <label>
                <input
                  type="radio"
                  name="units"
                  value="metric"
                  checked={formData.units === 'metric'}
                  onChange={handleInputChange}
                />
                Metric (kg, cm)
              </label>
              <label>
                <input
                  type="radio"
                  name="units"
                  value="imperial"
                  checked={formData.units === 'imperial'}
                  onChange={handleInputChange}
                />
                Imperial (lbs, ft, in)
              </label>
            </div>
          </div>

          <div className="input-section">
            <h2>Personal Information</h2>
            <div className="input-group">
              <label htmlFor="gender">Gender</label>
              <div className="input-field">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="age">Age (years)</label>
              <div className="input-field">
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="15"
                  max="100"
                />
              </div>
            </div>

            {formData.units === 'metric' ? (
              <>
                <div className="input-group">
                  <label htmlFor="height">Height (cm)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                      min="50"
                      max="300"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      min="20"
                      max="500"
                      step="0.1"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label>Height</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="input-field">
                      <input
                        type="number"
                        name="heightFt"
                        placeholder="Feet"
                        value={formData.heightFt}
                        onChange={handleInputChange}
                        required
                        min="1"
                        max="8"
                      />
                    </div>
                    <div className="input-field">
                      <input
                        type="number"
                        name="heightIn"
                        placeholder="Inches"
                        value={formData.heightIn}
                        onChange={handleInputChange}
                        required
                        min="0"
                        max="11"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="weightLb">Weight (lbs)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      id="weightLb"
                      name="weightLb"
                      value={formData.weightLb}
                      onChange={handleInputChange}
                      required
                      min="44"
                      max="1100"
                      step="0.1"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label htmlFor="activityLevel">Activity Level</label>
              <div className="input-field">
                <select
                  id="activityLevel"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
                  <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                  <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
                  <option value="1.9">Extra active (very hard exercise/sports & physical job)</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="calculate-btn">Calculate Calories</button>
        </form>

        {results && (
          <div className="results-section">
            <h2>Estimated Daily Calorie Needs</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Basal Metabolic Rate (BMR)</span>
                <span className="result-value">{results.bmr} Calories/day</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Daily Energy Expenditure (TDEE)</span>
                <span className="result-value">{results.tdee} Calories/day</span>
              </div>
            </div>
            
            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Calorie Goals</h3>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Weight Loss (0.5 lb/week)</span>
                <span className="result-value">{results.lossMild} Calories/day</span>
              </div>
              <div className="result-item">
                <span className="result-label">Weight Loss (1 lb/week)</span>
                <span className="result-value">{results.lossModerate} Calories/day</span>
              </div>
              <div className="result-item">
                <span className="result-label">Weight Maintenance</span>
                <span className="result-value">{results.tdee} Calories/day</span>
              </div>
              <div className="result-item">
                <span className="result-label">Weight Gain (0.5 lb/week)</span>
                <span className="result-value">{results.gainMild} Calories/day</span>
              </div>
              <div className="result-item">
                <span className="result-label">Weight Gain (1 lb/week)</span>
                <span className="result-value">{results.gainModerate} Calories/day</span>
              </div>
            </div>
          </div>
        )}

        <div className="content-section">
          <h2>How Your Daily Calorie Needs Are Calculated</h2>
          <p>This calculator uses the <strong>Mifflin-St Jeor equation</strong>, the formula most widely recommended by registered dietitians and validated in clinical research for estimating Basal Metabolic Rate (BMR). Your BMR is then multiplied by an activity factor to produce your <strong>Total Daily Energy Expenditure (TDEE)</strong> — the real number of calories your body needs each day.</p>

          <h3>Step 1: Calculate BMR (Basal Metabolic Rate)</h3>
          <p>BMR is the number of calories your body burns at complete rest — just to keep you alive. It accounts for approximately 60–75% of total calorie expenditure in sedentary individuals.</p>

          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.8' }}>
            <strong>Mifflin-St Jeor Equation:</strong><br /><br />
            For Men:    BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5<br />
            For Women:  BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161<br /><br />
            Example (Woman, 30 years, 65 kg, 165 cm):<br />
            BMR = (10 × 65) + (6.25 × 165) − (5 × 30) − 161<br />
            BMR = 650 + 1031.25 − 150 − 161 = <strong>1,370 calories/day</strong>
          </div>

          <h3>Step 2: Multiply by Your Activity Level (TDEE)</h3>
          <p>BMR alone tells you the minimum calories needed for survival. To account for movement, multiply your BMR by an activity factor:</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Activity Level</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Definition</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Multiplier</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Sedentary</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Little or no exercise, desk job</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>BMR × 1.2</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Lightly Active</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Light exercise 1–3 days/week</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>BMR × 1.375</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Moderately Active</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Moderate exercise 3–5 days/week</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>BMR × 1.55</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Very Active</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Hard exercise 6–7 days/week</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>BMR × 1.725</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Extra Active</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Very hard exercise or physical job</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>BMR × 1.9</td></tr>
            </tbody>
          </table>
          <p>Using the example above: a moderately active woman with a BMR of 1,370 has a TDEE of 1,370 × 1.55 = <strong>2,124 calories/day</strong>.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Setting Your Calorie Target by Goal</h2>

          <h3>For Weight Loss</h3>
          <p>To lose body fat, consume fewer calories than your TDEE — creating a <strong>calorie deficit</strong>. A deficit of 500 calories per day produces roughly 0.45 kg (1 lb) of fat loss per week, a widely endorsed rate that preserves muscle mass.</p>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '1rem 1.4rem', margin: '1.5rem 0' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#9a3412' }}>⚠️ <strong>Safety thresholds:</strong> Harvard Health recommends against eating fewer than 1,200 calories/day for women or 1,500 calories/day for men without medical supervision. Going below these levels risks muscle loss, nutrient deficiency, and metabolic slowdown.</p>
          </div>

          <h3>For Weight Maintenance</h3>
          <p>Eat at your TDEE. This keeps your body weight stable. Adjust over time as your weight, age, or activity level changes.</p>

          <h3>For Muscle Gain</h3>
          <p>Consume a modest surplus above your TDEE — typically 250–500 extra calories per day. A smaller surplus minimizes fat gain while still providing energy for muscle synthesis. Ensure adequate protein intake (1.6–2.2g per kg of body weight per day).</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Goal</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Calorie Target</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Expected Rate</th></tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Fast weight loss</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>TDEE − 750</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>~0.7 kg / week (max recommended)</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Moderate weight loss</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>TDEE − 500</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>~0.5 kg / week</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Slow / sustainable loss</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>TDEE − 250</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>~0.25 kg / week</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Maintenance</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>TDEE</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Stable weight</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Lean bulk (muscle gain)</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>TDEE + 250</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>~0.25 kg lean mass / week</td></tr>
              <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Aggressive bulk</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>TDEE + 500</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>~0.5 kg / week (mixed muscle + fat)</td></tr>
            </tbody>
          </table>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Practical Tips for Tracking Calories</h2>

          <h3>Focus on protein and fiber first</h3>
          <p>Protein has the highest satiety per calorie of any macronutrient — it keeps you fuller for longer and preserves muscle during a deficit. Fiber-rich foods (vegetables, legumes, whole grains) also reduce hunger without adding many calories. Prioritizing these two food types makes calorie deficits much easier to sustain.</p>

          <h3>Calorie cycling ("zigzag" approach)</h3>
          <p>Instead of eating the same number of calories every day, some people find it effective to alternate between slightly higher-calorie days (e.g., on workout days) and lower-calorie days (rest days). This zigzag approach helps prevent metabolic adaptation and keeps meals flexible for social situations.</p>

          <h3>Why your results will vary</h3>
          <p>The Mifflin-St Jeor equation provides an estimate based on population averages. Individual factors like gut microbiome composition, thyroid function, sleep quality, and stress hormones all affect how many calories you actually absorb and burn. Treat the calculator output as a starting point, track your actual weight for 2–3 weeks, and adjust by 100–200 calories if results don't match expectations.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.2rem 1.4rem', margin: '2rem 0' }}>
            <h3 style={{ margin: '0 0 0.75rem 0', color: '#15803d', fontSize: '0.95rem' }}>🔗 Related CalcLogic Calculators</h3>
            <a href="/bmi-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>BMI Calculator</a>
            <a href="/macros-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Macros Calculator</a>
            <a href="/ideal-weight-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Ideal Weight Calculator</a>
            <a href="/body-fat-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Body Fat Calculator</a>
            <a href="/pace-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Pace Calculator</a>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How many calories should I eat per day to lose weight?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>To lose weight at a healthy pace of 0.5 kg (1 lb) per week, aim for a daily intake of approximately 500 calories below your TDEE. For most women, this falls between 1,200–1,500 calories per day; for most men, 1,500–1,800 calories. Always stay above the minimum safe thresholds (1,200 for women, 1,500 for men).</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Is 2,000 calories a day too much?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>It depends entirely on your TDEE. For a sedentary woman, 2,000 calories may be a slight surplus. For an active man, it could represent a deficit. Use this calculator to find your personal TDEE — there is no universal answer.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Do calories matter more than what you eat?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>For body weight management, total calories are the primary driver. However, food quality matters significantly for health, energy levels, and sustainable adherence. 1,800 calories of whole foods will likely produce better health outcomes and more stable hunger than 1,800 calories of processed food, even if weight change is similar.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Why am I not losing weight in a calorie deficit?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Common reasons include: underestimating calorie intake (studies show people consistently underreport by 20–40%), water retention masking fat loss on the scale, metabolic adaptation after prolonged dieting, or errors in estimating your activity level. If your weight hasn't changed after 3 weeks at your target intake, reduce calories by 100–150 and reassess.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How many calories are in a pound or kilogram of fat?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>One pound of body fat contains approximately 3,500 calories; one kilogram contains approximately 7,700 calories. This is why a daily deficit of 500 calories (3,500 per week) produces roughly one pound of fat loss per week. These are approximations — actual fat loss also depends on water retention and metabolic factors.</p>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#6b7280', fontStyle: 'italic', marginTop: '2rem' }}>
            This calculator provides estimates based on established nutritional science formulas. It is not a substitute for advice from a registered dietitian or physician.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CalorieCalculator
