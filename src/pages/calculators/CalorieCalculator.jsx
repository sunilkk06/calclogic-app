import React, { useState } from 'react'

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
    
    // Input validation
    if (isNaN(age) || isNaN(heightCm) || isNaN(weight) || isNaN(activityLevel) || 
        age <= 0 || heightCm <= 0 || weight <= 0) {
      return
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevel
    
    // Calculate calorie goals
    const lossMild = tdee - 250 // 0.5 lb/week
    const lossModerate = tdee - 500 // 1 lb/week
    const gainMild = tdee + 250 // 0.5 lb/week
    const gainModerate = tdee + 500 // 1 lb/week
    
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
          <h3>Weight Management</h3>
          <p>A calorie deficit of approximately 500 calories per day will result in about 1 pound of weight loss per week. Similarly, a surplus of 500 calories per day will result in about 1 pound of weight gain per week.</p>
          <p>For sustainable results, moderate deficits or surpluses (250-500 calories) are generally recommended.</p>
        </div>
      </div>
    </div>
  )
}

export default CalorieCalculator