import React, { useState } from 'react'

const BodyFatCalculator = () => {
  const [formData, setFormData] = useState({
    units: 'metric',
    gender: 'male',
    height: '',
    neck: '',
    waist: '',
    hip: '',
    heightFt: '',
    heightIn: '',
    weight: ''
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateBodyFat = (e) => {
    e.preventDefault()
    
    let height, neck, waist, hip, weight
    const gender = formData.gender
    const isMetric = formData.units === 'metric'
    
    // Get measurements in inches (convert if metric)
    if (isMetric) {
      const heightCm = parseFloat(formData.height)
      const neckCm = parseFloat(formData.neck)
      const waistCm = parseFloat(formData.waist)
      const hipCm = parseFloat(formData.hip) || 0
      weight = parseFloat(formData.weight)
      
      if (heightCm > 0) height = heightCm / 2.54
      if (neckCm > 0) neck = neckCm / 2.54
      if (waistCm > 0) waist = waistCm / 2.54
      if (hipCm > 0) hip = hipCm / 2.54
    } else {
      const heightFt = parseFloat(formData.heightFt) || 0
      const heightIn = parseFloat(formData.heightIn) || 0
      neck = parseFloat(formData.neck) || 0
      waist = parseFloat(formData.waist) || 0
      hip = parseFloat(formData.hip) || 0
      weight = parseFloat(formData.weight)
      
      height = (heightFt * 12) + heightIn
    }

    // Validate inputs
    if (height <= 0 || neck <= 0 || waist <= 0 || (gender === 'female' && hip <= 0) || weight <= 0) {
      return
    }

    // US Navy Body Fat formula
    let bodyfatPercent
    if (gender === 'male') {
      bodyfatPercent = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
    } else {
      bodyfatPercent = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387
    }

    if (bodyfatPercent > 0 && bodyfatPercent < 100) {
      const fatMass = (bodyfatPercent / 100) * weight
      const leanMass = weight - fatMass
      
      setResults({
        bodyFatPercentage: bodyfatPercent.toFixed(1),
        category: getBodyFatCategory(bodyfatPercent, gender),
        fatMass: isMetric ? fatMass.toFixed(1) : (fatMass * 2.20462).toFixed(1),
        leanMass: isMetric ? leanMass.toFixed(1) : (leanMass * 2.20462).toFixed(1),
        unit: isMetric ? 'kg' : 'lbs'
      })
    }
  }

  const getBodyFatCategory = (percentage, gender) => {
    if (percentage <= 0) return '---'
    if (gender === 'male') {
      if (percentage < 6) return 'Essential Fat'
      if (percentage < 14) return 'Athletes'
      if (percentage < 18) return 'Fitness'
      if (percentage < 25) return 'Acceptable'
      return 'Obese'
    } else {
      if (percentage < 14) return 'Essential Fat'
      if (percentage < 21) return 'Athletes'
      if (percentage < 25) return 'Fitness'
      if (percentage < 32) return 'Acceptable'
      return 'Obese'
    }
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Body Fat Calculator</h1>
        <p className="calculator-description">
          Estimate your body fat percentage using the U.S. Navy method based on body measurements.
        </p>
      </div>

      <form onSubmit={calculateBodyFat} className="calculator-form">
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
              Metric (cm, kg)
            </label>
            <label>
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={formData.units === 'imperial'}
                onChange={handleInputChange}
              />
              Imperial (in, lbs)
            </label>
          </div>
        </div>

        <div className="input-section">
          <h2>Body Measurements</h2>
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
                    step="0.1"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="neck">Neck Circumference (cm)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="neck"
                    name="neck"
                    value={formData.neck}
                    onChange={handleInputChange}
                    required
                    min="10"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="waist">Waist Circumference (cm)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="waist"
                    name="waist"
                    value={formData.waist}
                    onChange={handleInputChange}
                    required
                    min="30"
                    step="0.1"
                  />
                </div>
              </div>
              {formData.gender === 'female' && (
                <div className="input-group">
                  <label htmlFor="hip">Hip Circumference (cm)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      id="hip"
                      name="hip"
                      value={formData.hip}
                      onChange={handleInputChange}
                      required
                      min="30"
                      step="0.1"
                    />
                  </div>
                </div>
              )}
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
                <label htmlFor="weight">Weight (lbs)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    min="50"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="neck">Neck Circumference (inches)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="neck"
                    name="neck"
                    value={formData.neck}
                    onChange={handleInputChange}
                    required
                    min="5"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="waist">Waist Circumference (inches)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="waist"
                    name="waist"
                    value={formData.waist}
                    onChange={handleInputChange}
                    required
                    min="15"
                    step="0.1"
                  />
                </div>
              </div>
              {formData.gender === 'female' && (
                <div className="input-group">
                  <label htmlFor="hip">Hip Circumference (inches)</label>
                  <div className="input-field">
                    <input
                      type="number"
                      id="hip"
                      name="hip"
                      value={formData.hip}
                      onChange={handleInputChange}
                      required
                      min="15"
                      step="0.1"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <button type="submit" className="calculate-btn">Calculate Body Fat</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Body Fat Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Body Fat Percentage</span>
              <span className="result-value">{results.bodyFatPercentage}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Category</span>
              <span className="result-value">{results.category}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Body Fat Mass</span>
              <span className="result-value">{results.fatMass} {results.unit}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Lean Body Mass</span>
              <span className="result-value">{results.leanMass} {results.unit}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Healthy Ranges (Approximate)</h3>
          <ul>
            <li><strong>Essential Fat:</strong> Men 2-5%, Women 10-13%</li>
            <li><strong>Athletes:</strong> Men 6-13%, Women 14-20%</li>
            <li><strong>Fitness:</strong> Men 14-17%, Women 21-24%</li>
            <li><strong>Acceptable:</strong> Men 18-24%, Women 25-31%</li>
            <li><strong>Obesity:</strong> Men 25%+, Women 32%+</li>
          </ul>
          <small>Source: American Council on Exercise (ACE)</small>
        </div>
        <div className="info-card">
          <h3>Measurement Tips</h3>
          <p>Ensure accurate measurements for best results:</p>
          <ul>
            <li>Use a flexible tape measure.</li>
            <li>Measure directly on skin if possible.</li>
            <li>Keep the tape snug but not compressing the skin.</li>
            <li><strong>Neck:</strong> Below the larynx (Adam's apple).</li>
            <li><strong>Waist:</strong> At the narrowest point (males) or at the navel level (females).</li>
            <li><strong>Hips (Females):</strong> At the widest point.</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Method Limitations</h3>
          <p>The US Navy method is an estimation and can have inaccuracies. Factors like hydration levels, recent exercise, and individual body composition variations can affect results. For precise measurements, consider methods like DEXA scans or hydrostatic weighing.</p>
        </div>
      </div>
    </div>
  )
}

export default BodyFatCalculator