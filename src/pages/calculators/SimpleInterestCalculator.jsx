import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'

const SimpleInterestCalculator = () => {
  const [formData, setFormData] = useState({
    principal: '1000',
    rate: '5',
    time: '2',
    timeUnit: 'years'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateSimpleInterest = (e) => {
    e.preventDefault()
    
    const principal = parseFloat(formData.principal)
    const rate = parseFloat(formData.rate)
    const time = parseFloat(formData.time)
    const timeUnit = formData.timeUnit

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal < 0 || rate < 0 || time < 0) {
      return
    }

    // Convert rate percentage to decimal
    const rateDecimal = rate / 100

    // Convert time to years
    let timeInYears
    switch (timeUnit) {
      case 'months':
        timeInYears = time / 12
        break
      case 'days':
        timeInYears = time / 365
        break
      case 'years':
      default:
        timeInYears = time
    }

    // Calculate Simple Interest: I = P * R * T
    const interest = principal * rateDecimal * timeInYears
    const totalAmount = principal + interest

    setResults({
      interest,
      totalAmount,
      principal
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Simple Interest Calculator</h1>
        <p className="calculator-description">
          Calculate the simple interest earned or paid on a principal amount over a period of time.
        </p>
      </div>

      <form onSubmit={calculateSimpleInterest} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="principal">Principal Amount</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="principal"
                name="principal"
                value={formData.principal}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 1000"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="rate">Annual Interest Rate</label>
            <div className="input-field">
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 5"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="time">Time Period</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-field" style={{ flex: 2 }}>
                <input
                  type="number"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  step="1"
                  placeholder="e.g., 2"
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <select
                  name="timeUnit"
                  value={formData.timeUnit}
                  onChange={handleInputChange}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Interest</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Simple Interest Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Total Simple Interest</span>
              <span className="result-value">{formatCurrency(results.interest)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Principal + Interest</span>
              <span className="result-value">{formatCurrency(results.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>The Formula (I = PRT)</h3>
          <p>Simple Interest (I) = Principal (P) × Rate (R) × Time (T).</p>
          <ul>
            <li><strong>P:</strong> The initial amount of money (loan or investment).</li>
            <li><strong>R:</strong> The annual interest rate (expressed as a decimal).</li>
            <li><strong>T:</strong> The time period the money is borrowed or invested for (in years).</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>How It's Used</h3>
          <p>Simple interest is often used for short-term loans, like auto loans or certain personal loans. It's straightforward to calculate but typically yields lower returns on investments compared to compound interest over longer periods.</p>
        </div>
        <div className="info-card">
          <h3>Simple vs. Compound Interest</h3>
          <p>The key difference is that compound interest calculates interest on the principal plus any accumulated interest from previous periods (interest on interest). Simple interest is always calculated only on the original principal.</p>
        </div>
      </div>
      
      <ShareButtons 
        title="Simple Interest Calculator"
        description="Calculate simple interest earned or paid on a principal amount over time"
        customMessage="Calculate simple interest with this easy-to-use calculator!"
      />
    </div>
  )
}

export default SimpleInterestCalculator