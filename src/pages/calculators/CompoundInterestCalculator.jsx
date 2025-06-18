import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const CompoundInterestCalculator = () => {
  const [formData, setFormData] = useState({
    principal: '10000',
    contribution: '100',
    interestRate: '7',
    compoundFrequency: '12',
    timePeriod: '10'
  })
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateCompoundInterest = (e) => {
    e.preventDefault()
    
    const principal = parseFloat(formData.principal)
    const contribution = parseFloat(formData.contribution)
    const annualRate = parseFloat(formData.interestRate) / 100
    const compoundFrequency = parseInt(formData.compoundFrequency)
    const timePeriod = parseInt(formData.timePeriod)

    if (isNaN(principal) || isNaN(contribution) || isNaN(annualRate) || isNaN(compoundFrequency) || isNaN(timePeriod)) {
      return
    }

    // Calculate compound interest with regular contributions
    const periodicRate = annualRate / compoundFrequency
    const totalPeriods = compoundFrequency * timePeriod
    
    let balance = principal
    let totalContributions = principal
    const yearlyData = []
    
    for (let period = 1; period <= totalPeriods; period++) {
      // Add contribution
      balance += contribution
      totalContributions += contribution
      
      // Apply interest
      balance *= (1 + periodicRate)
      
      // Store data for each year
      if (period % compoundFrequency === 0) {
        const year = period / compoundFrequency
        yearlyData.push({
          year,
          balance,
          contributions: totalContributions
        })
      }
    }
    
    const totalInterest = balance - totalContributions

    setResults({
      futureValue: balance,
      totalContributions,
      totalInterest
    })

    // Prepare chart data
    const labels = yearlyData.map(data => `Year ${data.year}`)
    const balanceData = yearlyData.map(data => data.balance)
    const contributionsData = yearlyData.map(data => data.contributions)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Balance',
          data: balanceData,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          fill: true
        },
        {
          label: 'Contributions',
          data: contributionsData,
          borderColor: '#50C878',
          backgroundColor: 'rgba(80, 200, 120, 0.1)',
          fill: true
        }
      ]
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Compound Interest Calculator</h1>
        <p className="calculator-description">
          Calculate how your investments can grow with compound interest over time.
        </p>
      </div>

      <form onSubmit={calculateCompoundInterest} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="principal">Initial Investment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="principal"
                name="principal"
                value={formData.principal}
                onChange={handleInputChange}
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="contribution">Monthly Contribution</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="contribution"
                name="contribution"
                value={formData.contribution}
                onChange={handleInputChange}
                min="0"
                step="50"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="interestRate">Annual Interest Rate</label>
            <div className="input-field">
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.1"
                required
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="compoundFrequency">Compound Frequency</label>
            <div className="input-field">
              <select
                id="compoundFrequency"
                name="compoundFrequency"
                value={formData.compoundFrequency}
                onChange={handleInputChange}
                required
              >
                <option value="12">Monthly</option>
                <option value="4">Quarterly</option>
                <option value="2">Semi-annually</option>
                <option value="1">Annually</option>
                <option value="365">Daily</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="timePeriod">Time Period</label>
            <div className="input-field">
              <input
                type="number"
                id="timePeriod"
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleInputChange}
                min="1"
                max="50"
                required
              />
              <span className="unit">years</span>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Compound Interest Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Future Value</span>
              <span className="result-value">{formatCurrency(results.futureValue)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Contributions</span>
              <span className="result-value">{formatCurrency(results.totalContributions)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest Earned</span>
              <span className="result-value">{formatCurrency(results.totalInterest)}</span>
            </div>
          </div>

          {chartData && (
            <div className="chart-container" style={{ height: '400px', marginTop: '2rem' }}>
              <Line 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value)
                        }
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + formatCurrency(context.parsed.y)
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>What is Compound Interest?</h3>
          <p>Compound interest is interest earned on both your initial investment and previously accumulated interest. This creates a snowball effect that accelerates your wealth growth over time.</p>
        </div>
        <div className="info-card">
          <h3>Compound Frequency</h3>
          <ul>
            <li>Daily: Interest calculated 365 times per year</li>
            <li>Monthly: Interest calculated 12 times per year</li>
            <li>Quarterly: Interest calculated 4 times per year</li>
            <li>Annually: Interest calculated once per year</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Investment Tips</h3>
          <ul>
            <li>Start early to maximize compound growth</li>
            <li>Make regular contributions to boost returns</li>
            <li>Reinvest dividends for additional growth</li>
            <li>Consider your risk tolerance when choosing investments</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CompoundInterestCalculator