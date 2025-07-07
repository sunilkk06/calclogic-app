import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'

const BMICalculator = () => {
  const [units, setUnits] = useState('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [result, setResult] = useState(null)

  const calculateBMI = (e) => {
    e.preventDefault()
    
    let heightInMeters, weightInKg
    
    if (units === 'metric') {
      heightInMeters = parseFloat(height) / 100
      weightInKg = parseFloat(weight)
    } else {
      const totalInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn)
      heightInMeters = totalInches * 0.0254
      weightInKg = parseFloat(weight) * 0.453592
    }
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmi = weightInKg / (heightInMeters * heightInMeters)
      const category = getBMICategory(bmi)
      setResult({ bmi: bmi.toFixed(1), category })
    }
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>BMI Calculator</h1>
        <p className="calculator-description">
          Calculate your Body Mass Index (BMI) based on your height and weight. BMI is a common indicator of body fatness.
        </p>
      </div>

      <form onSubmit={calculateBMI} className="calculator-form">
        <div className="input-section">
          <h2>Unit Selection</h2>
          <div className="input-group">
            <label>
              <input
                type="radio"
                value="metric"
                checked={units === 'metric'}
                onChange={(e) => setUnits(e.target.value)}
              />
              Metric (kg, cm)
            </label>
            <label>
              <input
                type="radio"
                value="imperial"
                checked={units === 'imperial'}
                onChange={(e) => setUnits(e.target.value)}
              />
              Imperial (lb, ft, in)
            </label>
          </div>
        </div>

        {units === 'metric' ? (
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="height">Height (cm)</label>
              <div className="input-field">
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
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
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  min="10"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="input-section">
            <div className="input-group">
              <label>Height</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-field">
                  <input
                    type="number"
                    placeholder="Feet"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    required
                    min="1"
                    step="1"
                  />
                </div>
                <div className="input-field">
                  <input
                    type="number"
                    placeholder="Inches"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    required
                    min="0"
                    max="11"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="weight-lb">Weight (lb)</label>
              <div className="input-field">
                <input
                  type="number"
                  id="weight-lb"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  min="20"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="calculate-btn">Calculate BMI</button>
      </form>

      {result && (
        <div className="results-section">
          <h2>Your BMI Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Your BMI</span>
              <span className="result-value">{result.bmi}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Category</span>
              <span className="result-value">{result.category}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>BMI Categories</h3>
          <ul>
            <li><strong>Underweight:</strong> BMI less than 18.5</li>
            <li><strong>Normal weight:</strong> BMI 18.5 to 24.9</li>
            <li><strong>Overweight:</strong> BMI 25 to 29.9</li>
            <li><strong>Obesity:</strong> BMI 30 or greater</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Limitations of BMI</h3>
          <p>BMI does not directly measure body fat. Muscle mass can affect BMI, so athletes may have a high BMI but low body fat. It's also not always accurate for older adults or different ethnic groups.</p>
        </div>
        <div className="info-card">
          <h3>Health Risks</h3>
          <p>Higher BMI is associated with increased risk for certain diseases like heart disease, high blood pressure, type 2 diabetes, gallstones, breathing problems, and certain cancers.</p>
        </div>
      </div>
      
      <ShareButtons 
        title="BMI Calculator"
        description="Calculate your Body Mass Index (BMI) with this free, easy-to-use calculator"
        customMessage="Check out this BMI Calculator - Calculate your Body Mass Index quickly and easily!"
      />
    </div>
  )
}

export default BMICalculator