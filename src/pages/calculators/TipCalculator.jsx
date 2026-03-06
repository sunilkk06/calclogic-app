import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const TipCalculator = () => {
  const [formData, setFormData] = useState({
    billAmount: '',
    tipPercentage: '15',
    numberOfPeople: '1'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateTip = (e) => {
    e.preventDefault()
    
    const billAmount = parseFloat(formData.billAmount)
    const tipPercentage = parseFloat(formData.tipPercentage) / 100
    const numberOfPeople = parseInt(formData.numberOfPeople)
    
    if (isNaN(billAmount) || isNaN(tipPercentage) || isNaN(numberOfPeople) || billAmount <= 0 || numberOfPeople <= 0) {
      return
    }

    const tipAmount = billAmount * tipPercentage
    const totalAmount = billAmount + tipAmount
    const tipPerPerson = tipAmount / numberOfPeople
    const totalPerPerson = totalAmount / numberOfPeople

    setResults({
      tipAmount,
      totalAmount,
      tipPerPerson,
      totalPerPerson,
      billAmount
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
    <>
      <Helmet>
        <title>Tip Calculator — Split Bills & Calculate Tips | CalcLogic</title>
        <meta name="description" content="Free tip calculator. Calculate tips, split bills between friends, and see what everyone owes. Instant results, no signup needed." />
        <link rel="canonical" href="https://calclogic.com/tip-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Tip Calculator — Split Bills & Calculate Tips | CalcLogic" />
        <meta property="og:description" content="Free tip calculator for restaurants and services. Split bills between friends and calculate fair tips instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/tip-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Tip Calculator — Free | CalcLogic" />
        <meta name="twitter:description" content="Calculate tips and split bills between friends. Free calculator, instant results." />
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Tip Calculator</h1>
          <p className="calculator-description">
            Calculate tips and split bills between multiple people. Perfect for restaurants, taxis, and shared expenses.
          </p>
        </div>

        <form onSubmit={calculateTip} className="calculator-form">
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="billAmount">Bill Amount</label>
              <div className="input-field">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="billAmount"
                  name="billAmount"
                  value={formData.billAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="tipPercentage">Tip Percentage</label>
              <div className="input-field">
                <input
                  type="number"
                  id="tipPercentage"
                  name="tipPercentage"
                  value={formData.tipPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                  required
                />
                <span className="percentage-symbol">%</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="numberOfPeople">Number of People</label>
              <div className="input-field">
                <input
                  type="number"
                  id="numberOfPeople"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  required
                />
                <span className="unit">people</span>
              </div>
            </div>

            {/* Quick tip percentage buttons */}
            <div className="tip-buttons">
              <button
                type="button"
                className="tip-btn"
                onClick={() => setFormData(prev => ({ ...prev, tipPercentage: '10' }))}
              >
                10%
              </button>
              <button
                type="button"
                className="tip-btn"
                onClick={() => setFormData(prev => ({ ...prev, tipPercentage: '15' }))}
              >
                15%
              </button>
              <button
                type="button"
                className="tip-btn"
                onClick={() => setFormData(prev => ({ ...prev, tipPercentage: '18' }))}
              >
                18%
              </button>
              <button
                type="button"
                className="tip-btn"
                onClick={() => setFormData(prev => ({ ...prev, tipPercentage: '20' }))}
              >
                20%
              </button>
              <button
                type="button"
                className="tip-btn"
                onClick={() => setFormData(prev => ({ ...prev, tipPercentage: '25' }))}
              >
                25%
              </button>
            </div>
          </div>

          <button type="submit" className="calculate-btn">Calculate Tip</button>
        </form>

        {results && (
          <div className="results-section">
            <h2>Tip Calculation Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Tip Amount</span>
                <span className="result-value">{formatCurrency(results.tipAmount)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Amount</span>
                <span className="result-value">{formatCurrency(results.totalAmount)}</span>
              </div>
              {parseInt(formData.numberOfPeople) > 1 && (
                <>
                  <div className="result-item">
                    <span className="result-label">Tip Per Person</span>
                    <span className="result-value">{formatCurrency(results.tipPerPerson)}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Total Per Person</span>
                    <span className="result-value">{formatCurrency(results.totalPerPerson)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="info-cards">
          <div className="info-card">
            <h3>Common Tip Percentages</h3>
            <ul>
              <li><strong>10%:</strong> Basic service, takeout, or buffet</li>
              <li><strong>15%:</strong> Standard restaurant service</li>
              <li><strong>18-20%:</strong> Excellent service</li>
              <li><strong>25%:</strong> Exceptional service or large groups</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>When to Tip</h3>
            <ul>
              <li>Restaurants and cafes</li>
              <li>Food delivery services</li>
              <li>Taxi and ride-sharing</li>
              <li>Hairstylists and barbers</li>
              <li>Hotel housekeeping</li>
              <li>Tour guides and drivers</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>Tipping Tips</h3>
            <ul>
              <li>Calculate tip on pre-tax amount for fairness</li>
              <li>Consider service quality when choosing percentage</li>
              <li>Round up for convenience when splitting bills</li>
              <li>Check if service charge is already included</li>
              <li>Be generous with exceptional service</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default TipCalculator
