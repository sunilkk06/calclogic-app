import React, { useState } from 'react'

const BMRCalculator = () => {
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

  const calculateBMR = (e) => {
    e.preventDefault()
    
    let heightCm, weightKg
    
    if (formData.units === 'metric') {
      heightCm = parseFloat(formData.height)
      weightKg = parseFloat(formData.weight)
    } else {
      const totalInches = (parseFloat(formData.heightFt) * 12) + parseFloat(formData.heightIn)
      heightCm = totalInches * 2.54
      weightKg = parseFloat(formData.weightLb) * 0.453592
    }
    
    const age = parseInt(formData.age)
    const activityLevel = parseFloat(formData.activityLevel)
    
    // Mifflin-St Jeor Equation
    let bmr
    if (formData.gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161
    }
    
    const tdee = bmr * activityLevel
    const weightLoss = tdee - 500
    const weightGain = tdee + 500
    
    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLoss: Math.round(weightLoss),
      maintenance: Math.round(tdee),
      weightGain: Math.round(weightGain)
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>BMR Calculator</h1>
        <p className="calculator-description">
          Calculate your Basal Metabolic Rate (BMR) and daily caloric needs based on your activity level.
        </p>
      </div>

      <form onSubmit={calculateBMR} className="calculator-form">
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
              Metric (cm/kg)
            </label>
            <label>
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={formData.units === 'imperial'}
                onChange={handleInputChange}
              />
              Imperial (in/lb)
            </label>
          </div>
        </div>

        <div className="input-section">
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
                max="120"
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
                <label htmlFor="weightLb">Weight (lb)</label>
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
                <option value="1.375">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="1.55">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="1.725">Very Active (hard exercise 6-7 days/week)</option>
                <option value="1.9">Extra Active (very hard exercise & physical job)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate BMR</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your BMR Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Your BMR</span>
              <span className="result-value">{results.bmr} calories/day</span>
            </div>
            <div className="result-item">
              <span className="result-label">Daily Caloric Needs</span>
              <span className="result-value">{results.tdee} calories/day</span>
            </div>
          </div>
          
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Weight Loss</span>
              <span className="result-value">{results.weightLoss} calories/day</span>
            </div>
            <div className="result-item">
              <span className="result-label">Weight Maintenance</span>
              <span className="result-value">{results.maintenance} calories/day</span>
            </div>
            <div className="result-item">
              <span className="result-label">Weight Gain</span>
              <span className="result-value">{results.weightGain} calories/day</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>BMR Formula (Mifflin-St Jeor)</h3>
          <p><strong>For Men:</strong><br />
          BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5</p>
          <p><strong>For Women:</strong><br />
          BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161</p>
        </div>
        <div className="info-card">
          <h3>Activity Level Multipliers</h3>
          <ul>
            <li><strong>Sedentary:</strong> × 1.2 (Office job, little exercise)</li>
            <li><strong>Light Activity:</strong> × 1.375 (Light exercise 1-3 days/week)</li>
            <li><strong>Moderate Activity:</strong> × 1.55 (Moderate exercise 3-5 days/week)</li>
            <li><strong>Very Active:</strong> × 1.725 (Hard exercise 6-7 days/week)</li>
            <li><strong>Extra Active:</strong> × 1.9 (Very hard exercise & physical job)</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Weight Management Goals</h3>
          <ul>
            <li><strong>Weight Loss:</strong> TDEE - 500 calories/day</li>
            <li><strong>Maintenance:</strong> TDEE</li>
            <li><strong>Weight Gain:</strong> TDEE + 500 calories/day</li>
          </ul>
          <p>Note: A 500-calorie deficit or surplus typically results in about 1 pound (0.45 kg) of weight change per week.</p>
        </div>
      </div>
    </div>
  )
}

export default BMRCalculator