import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const InterestCalculator = () => {
  const [formData, setFormData] = useState({
    principal: '10000',
    interestRate: '5',
    timeYears: '5',
    compoundFrequency: '12',
    additionalContribution: '0',
    contributionFrequency: '12'
  })
  const [activeTab, setActiveTab] = useState('compound')
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateInterest = (e) => {
    e.preventDefault()
    
    const principal = parseFloat(formData.principal)
    const rate = parseFloat(formData.interestRate)
    const time = parseFloat(formData.timeYears)
    const compoundFreq = parseInt(formData.compoundFrequency)
    const contribution = parseFloat(formData.additionalContribution) || 0
    const contribFreq = parseInt(formData.contributionFrequency)

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(compoundFreq) || 
        principal < 0 || rate < 0 || time <= 0 || compoundFreq <= 0) {
      return
    }

    // Calculate compound interest
    const r = rate / 100
    const n = compoundFreq
    const t = time
    const PMT = contribution
    const m = contribFreq

    // Calculate compound interest without contributions
    let compoundAmount = principal * Math.pow(1 + r/n, n*t)

    // Add periodic contributions if any
    if (PMT > 0) {
      // Future value of periodic payments
      const contributionAmount = PMT * m * ((Math.pow(1 + r/n, n*t) - 1) / (Math.pow(1 + r/n, n/m) - 1))
      compoundAmount += contributionAmount
    }

    const totalContributions = principal + (PMT * m * t)
    const compoundInterest = compoundAmount - totalContributions

    // Calculate simple interest
    const simpleAmount = principal * (1 + r * t)
    const simpleInterest = simpleAmount - principal

    // Generate chart data
    const chartData = generateChartData(principal, r, t, n, PMT, m)

    setResults({
      compound: {
        finalBalance: compoundAmount,
        interestEarned: compoundInterest,
        totalContributions: totalContributions
      },
      simple: {
        finalBalance: simpleAmount,
        interestEarned: simpleInterest
      }
    })

    setChartData(chartData)
  }

  const generateChartData = (principal, rate, time, compoundFreq, contribution, contribFreq) => {
    const points = Math.min(time * 12, 120) // Monthly points, max 120 points
    const timeStep = time / points
    const compoundData = []
    const simpleData = []
    const contributionsData = []

    let runningContributions = principal

    for (let t = 0; t <= points; t++) {
      const currentTime = t * timeStep
      
      // Calculate compound interest
      const compound = calculateCompoundInterest(
        principal, rate, currentTime, 
        compoundFreq, contribution, contribFreq
      )
      compoundData.push(compound.finalBalance)

      // Calculate simple interest
      const simple = calculateSimpleInterest(principal, rate, currentTime)
      simpleData.push(simple.finalBalance)

      // Track contributions
      if (t > 0) {
        runningContributions += contribution * contribFreq * timeStep
      }
      contributionsData.push(runningContributions)
    }

    return {
      labels: Array.from({length: points + 1}, (_, i) => 
        (i * timeStep).toFixed(1) + (i * timeStep === 1 ? ' year' : ' years')
      ),
      compoundData,
      simpleData,
      contributionsData
    }
  }

  const calculateCompoundInterest = (principal, rate, time, compoundFreq, contribution, contribFreq) => {
    const r = rate
    const n = compoundFreq
    const t = time
    const PMT = contribution
    const m = contribFreq

    // Calculate compound interest without contributions
    let amount = principal * Math.pow(1 + r/n, n*t)

    // Add periodic contributions if any
    if (PMT > 0) {
      // Future value of periodic payments
      const contributionAmount = PMT * m * ((Math.pow(1 + r/n, n*t) - 1) / (Math.pow(1 + r/n, n/m) - 1))
      amount += contributionAmount
    }

    const totalContributions = principal + (PMT * m * t)
    const interestEarned = amount - totalContributions

    return {
      finalBalance: amount,
      interestEarned: interestEarned,
      totalContributions: totalContributions
    }
  }

  const calculateSimpleInterest = (principal, rate, time) => {
    const r = rate
    const amount = principal * (1 + r * time)
    const interestEarned = amount - principal

    return {
      finalBalance: amount,
      interestEarned: interestEarned
    }
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
        <h1>Interest Calculator</h1>
        <p className="calculator-description">
          Calculate and compare both simple and compound interest for your investments and loans.
        </p>
      </div>

      <form onSubmit={calculateInterest} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="principal">Principal Amount ($)</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="principal"
                name="principal"
                value={formData.principal}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="interestRate">Annual Interest Rate (%)</label>
            <div className="input-field">
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                step="0.01"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="timeYears">Time Period (Years)</label>
            <div className="input-field">
              <input
                type="number"
                id="timeYears"
                name="timeYears"
                value={formData.timeYears}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
              />
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
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="24">Semi-monthly</option>
                <option value="26">Bi-weekly</option>
                <option value="52">Weekly</option>
                <option value="365">Daily</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="additionalContribution">Additional Contribution ($)</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="additionalContribution"
                name="additionalContribution"
                value={formData.additionalContribution}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="contributionFrequency">Contribution Frequency</label>
            <div className="input-field">
              <select
                id="contributionFrequency"
                name="contributionFrequency"
                value={formData.contributionFrequency}
                onChange={handleInputChange}
              >
                <option value="12">Monthly</option>
                <option value="1">Annually</option>
                <option value="4">Quarterly</option>
                <option value="26">Bi-weekly</option>
                <option value="52">Weekly</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Interest</button>
      </form>

      {results && (
        <div className="results-section">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('compound')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: activeTab === 'compound' ? '#4a90e2' : '#f8fafc',
                color: activeTab === 'compound' ? 'white' : '#333',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Compound Interest
            </button>
            <button 
              onClick={() => setActiveTab('simple')}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: activeTab === 'simple' ? '#4a90e2' : '#f8fafc',
                color: activeTab === 'simple' ? 'white' : '#333',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Simple Interest
            </button>
          </div>

          {activeTab === 'compound' ? (
            <div>
              <div className="results-grid">
                <div className="result-item">
                  <span className="result-label">Final Balance</span>
                  <span className="result-value">{formatCurrency(results.compound.finalBalance)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Total Interest Earned</span>
                  <span className="result-value">{formatCurrency(results.compound.interestEarned)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Total Contributions</span>
                  <span className="result-value">{formatCurrency(results.compound.totalContributions)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="results-grid">
                <div className="result-item">
                  <span className="result-label">Final Balance</span>
                  <span className="result-value">{formatCurrency(results.simple.finalBalance)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Total Interest Earned</span>
                  <span className="result-value">{formatCurrency(results.simple.interestEarned)}</span>
                </div>
              </div>
            </div>
          )}

          {chartData && (
            <div className="chart-container" style={{ height: '400px', marginTop: '2rem' }}>
              <Line 
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: 'Compound Interest',
                      data: chartData.compoundData,
                      borderColor: '#2196F3',
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      fill: true
                    },
                    {
                      label: 'Simple Interest',
                      data: chartData.simpleData,
                      borderColor: '#4CAF50',
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      fill: true
                    },
                    {
                      label: 'Total Contributions',
                      data: chartData.contributionsData,
                      borderColor: '#FFC107',
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + formatCurrency(context.parsed.y)
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value) {
                          return formatCurrency(value)
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
          <h3>Compound Interest Formula</h3>
          <p>A = P(1 + r/n)^(nt)</p>
          <ul>
            <li>A = Final amount</li>
            <li>P = Principal amount</li>
            <li>r = Annual interest rate (decimal)</li>
            <li>n = Number of times interest is compounded per year</li>
            <li>t = Time in years</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Simple Interest Formula</h3>
          <p>A = P(1 + rt)</p>
          <ul>
            <li>A = Final amount</li>
            <li>P = Principal amount</li>
            <li>r = Annual interest rate (decimal)</li>
            <li>t = Time in years</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Common Compound Frequencies</h3>
          <ul>
            <li>Annually: 1 time per year</li>
            <li>Semi-annually: 2 times per year</li>
            <li>Quarterly: 4 times per year</li>
            <li>Monthly: 12 times per year</li>
            <li>Daily: 365 times per year</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InterestCalculator