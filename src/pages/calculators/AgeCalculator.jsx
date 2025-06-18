import React, { useState } from 'react'

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [result, setResult] = useState(null)

  const calculateAge = (e) => {
    e.preventDefault()
    
    if (!birthDate) return
    
    const birth = new Date(birthDate)
    const current = new Date(currentDate)
    
    if (birth > current) {
      alert("Birth date cannot be in the future")
      return
    }
    
    let years = current.getFullYear() - birth.getFullYear()
    let months = current.getMonth() - birth.getMonth()
    let days = current.getDate() - birth.getDate()
    
    // Adjust for negative days
    if (days < 0) {
      months--
      const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0)
      days += prevMonth.getDate()
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--
      months += 12
    }
    
    // Calculate total days
    const totalDays = Math.floor((current - birth) / (1000 * 60 * 60 * 24))
    
    setResult({
      years,
      months,
      days,
      totalDays
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Age Calculator</h1>
        <p className="calculator-description">
          Calculate your exact age in years, months, and days based on your date of birth.
        </p>
      </div>

      <form onSubmit={calculateAge} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="birthDate">Date of Birth</label>
            <div className="input-field">
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="currentDate">Calculate Age as of</label>
            <div className="input-field">
              <input
                type="date"
                id="currentDate"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Age</button>
      </form>

      {result && (
        <div className="results-section">
          <h2>Your Age</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Age</span>
              <span className="result-value">
                {result.years} years, {result.months} months, {result.days} days
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Days Lived</span>
              <span className="result-value">{result.totalDays.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>How It Works</h3>
          <p>The calculation involves subtracting the birth date from the current date. It accounts for variations in the number of days in months and leap years to provide an accurate duration.</p>
        </div>
        <div className="info-card">
          <h3>Common Uses</h3>
          <p>Age calculation is used in various contexts, such as determining eligibility for services or benefits, tracking milestones, filling out forms, or simply satisfying curiosity about one's precise age.</p>
        </div>
        <div className="info-card">
          <h3>Leap Years</h3>
          <p>Leap years (occurring every 4 years, except for years divisible by 100 but not by 400) add an extra day (February 29th). Accurate age calculation considers these extra days.</p>
        </div>
      </div>
    </div>
  )
}

export default AgeCalculator