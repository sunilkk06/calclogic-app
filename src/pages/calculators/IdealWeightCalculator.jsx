import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const IdealWeightCalculator = () => {
  const [formData, setFormData] = useState({
    gender: 'male',
    height: '',
    frameSize: 'medium',
    age: ''
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateIdealWeight = (e) => {
    e.preventDefault()
    
    const height = parseFloat(formData.height)
    const gender = formData.gender
    const frameSize = formData.frameSize
    const age = parseInt(formData.age)
    
    if (isNaN(height) || height <= 0 || isNaN(age) || age <= 0) {
      return
    }

    // Convert height to inches for formulas
    const heightInInches = height / 2.54
    
    // Calculate ideal weight using different formulas
    
    // Devine Formula
    let devineWeight
    if (gender === 'male') {
      devineWeight = 50 + 2.3 * (heightInInches - 60)
    } else {
      devineWeight = 45.5 + 2.3 * (heightInInches - 60)
    }
    
    // Hamwi Formula
    let hamwiWeight
    if (gender === 'male') {
      hamwiWeight = 48 + 2.7 * (heightInInches - 60)
    } else {
      hamwiWeight = 45.5 + 2.2 * (heightInInches - 60)
    }
    
    // Miller Formula
    let millerWeight
    if (gender === 'male') {
      millerWeight = 56.2 + 1.41 * (heightInInches - 60)
    } else {
      millerWeight = 53.1 + 1.36 * (heightInInches - 60)
    }
    
    // Robinson Formula
    let robinsonWeight
    if (gender === 'male') {
      robinsonWeight = 52 + 1.9 * (heightInInches - 60)
    } else {
      robinsonWeight = 49 + 1.7 * (heightInInches - 60)
    }
    
    // Adjust for frame size
    const frameFactor = frameSize === 'small' ? 0.9 : frameSize === 'large' ? 1.1 : 1
    
    devineWeight *= frameFactor
    hamwiWeight *= frameFactor
    millerWeight *= frameFactor
    robinsonWeight *= frameFactor
    
    // Calculate BMI ranges
    const heightInMeters = height / 100
    const underweightMax = 18.5 * (heightInMeters * heightInMeters)
    const normalMin = 18.5 * (heightInMeters * heightInMeters)
    const normalMax = 24.9 * (heightInMeters * heightInMeters)
    const overweightMin = 25 * (heightInMeters * heightInMeters)
    const overweightMax = 29.9 * (heightInMeters * heightInMeters)
    
    // Calculate average of all formulas
    const avgWeight = (devineWeight + hamwiWeight + millerWeight + robinsonWeight) / 4
    
    // Calculate weight range based on frame size
    const minWeight = Math.min(devineWeight, hamwiWeight, millerWeight, robinsonWeight)
    const maxWeight = Math.max(devineWeight, hamwiWeight, millerWeight, robinsonWeight)
    
    setResults({
      devineWeight: devineWeight.toFixed(1),
      hamwiWeight: hamwiWeight.toFixed(1),
      millerWeight: millerWeight.toFixed(1),
      robinsonWeight: robinsonWeight.toFixed(1),
      weightRange: `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)}`,
      bmiRanges: {
        underweight: `0 - ${underweightMax.toFixed(1)}`,
        normal: `${normalMin.toFixed(1)} - ${normalMax.toFixed(1)}`,
        overweight: `${overweightMin.toFixed(1)} - ${overweightMax.toFixed(1)}`
      },
      chartData: [devineWeight, hamwiWeight, millerWeight, robinsonWeight]
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Ideal Weight Calculator</h1>
        <p className="calculator-description">
          Calculate your ideal weight based on height, gender, and body frame using multiple formulas.
        </p>
      </div>

      <form onSubmit={calculateIdealWeight} className="calculator-form">
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
            <label htmlFor="height">Height (cm)</label>
            <div className="input-field">
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="120"
                max="250"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="frameSize">Body Frame Size</label>
            <div className="input-field">
              <select
                id="frameSize"
                name="frameSize"
                value={formData.frameSize}
                onChange={handleInputChange}
                required
              >
                <option value="small">Small Frame</option>
                <option value="medium">Medium Frame</option>
                <option value="large">Large Frame</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="age">Age</label>
            <div className="input-field">
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                max="100"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Ideal Weight</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Ideal Weight Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Recommended Weight Range</span>
              <span className="result-value">{results.weightRange} kg</span>
            </div>
          </div>
          
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Weight Calculations by Formula</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Devine Formula</span>
              <span className="result-value">{results.devineWeight} kg</span>
            </div>
            <div className="result-item">
              <span className="result-label">Hamwi Formula</span>
              <span className="result-value">{results.hamwiWeight} kg</span>
            </div>
            <div className="result-item">
              <span className="result-label">Miller Formula</span>
              <span className="result-value">{results.millerWeight} kg</span>
            </div>
            <div className="result-item">
              <span className="result-label">Robinson Formula</span>
              <span className="result-value">{results.robinsonWeight} kg</span>
            </div>
          </div>
          
          <div className="chart-container" style={{ height: '300px', marginTop: '2rem' }}>
            <Bar
              data={{
                labels: ['Devine', 'Hamwi', 'Miller', 'Robinson'],
                datasets: [
                  {
                    label: 'Weight (kg)',
                    data: results.chartData,
                    backgroundColor: [
                      'rgba(74, 144, 226, 0.6)',
                      'rgba(80, 200, 120, 0.6)',
                      'rgba(255, 165, 0, 0.6)',
                      'rgba(255, 99, 132, 0.6)'
                    ],
                    borderColor: [
                      'rgba(74, 144, 226, 1)',
                      'rgba(80, 200, 120, 1)',
                      'rgba(255, 165, 0, 1)',
                      'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false
                  }
                }
              }}
            />
          </div>
          
          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>BMI Weight Ranges</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Underweight</span>
              <span className="result-value">{results.bmiRanges.underweight} kg</span>
              <span className="result-label">{'< 18.5 BMI'}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Normal Weight</span>
              <span className="result-value">{results.bmiRanges.normal} kg</span>
              <span className="result-label">18.5 - 24.9 BMI</span>
            </div>
            <div className="result-item">
              <span className="result-label">Overweight</span>
              <span className="result-value">{results.bmiRanges.overweight} kg</span>
              <span className="result-label">25 - 29.9 BMI</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Body Frame Size</h3>
          <ul>
            <li>Small Frame: Wrist circumference < 16.5 cm</li>
            <li>Medium Frame: Wrist 16.5-18.5 cm</li>
            <li>Large Frame: Wrist > 18.5 cm</li>
            <li>Frame size affects ideal weight range</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Weight Formulas</h3>
          <ul>
            <li>Devine: Standard medical calculations</li>
            <li>Hamwi: Classic method from 1964</li>
            <li>Miller: Updated modern formula</li>
            <li>Robinson: Research-based approach</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Healthy Weight Tips</h3>
          <ul>
            <li>Consider muscle mass vs. fat mass</li>
            <li>Account for age and activity level</li>
            <li>Focus on overall health, not just weight</li>
            <li>Consult healthcare providers for guidance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IdealWeightCalculator