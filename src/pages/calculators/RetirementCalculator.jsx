import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const RetirementCalculator = () => {
  const [formData, setFormData] = useState({
    currentAge: '30',
    retirementAge: '65',
    lifeExpectancy: '90',
    currentSavings: '50000',
    monthlyContribution: '500',
    employerMatch: '3',
    investmentReturn: '7',
    inflationRate: '3',
    desiredIncome: '60000',
    socialSecurity: '20000',
    otherIncome: '0'
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

  const calculateRetirement = (e) => {
    e.preventDefault()
    
    const currentAge = parseInt(formData.currentAge)
    const retirementAge = parseInt(formData.retirementAge)
    const lifeExpectancy = parseInt(formData.lifeExpectancy)
    const currentSavings = parseFloat(formData.currentSavings)
    const monthlyContribution = parseFloat(formData.monthlyContribution)
    const employerMatch = parseFloat(formData.employerMatch) / 100
    const investmentReturn = parseFloat(formData.investmentReturn) / 100
    const inflationRate = parseFloat(formData.inflationRate) / 100
    const desiredIncome = parseFloat(formData.desiredIncome)
    const socialSecurity = parseFloat(formData.socialSecurity) || 0
    const otherIncome = parseFloat(formData.otherIncome) || 0

    if (isNaN(currentAge) || isNaN(retirementAge) || isNaN(lifeExpectancy) || 
        isNaN(currentSavings) || isNaN(monthlyContribution) || isNaN(employerMatch) || 
        isNaN(investmentReturn) || isNaN(inflationRate) || isNaN(desiredIncome)) {
      return
    }

    const yearsToRetirement = retirementAge - currentAge
    const yearsInRetirement = lifeExpectancy - retirementAge
    
    // Calculate real rate of return (adjusted for inflation)
    const realReturn = (1 + investmentReturn) / (1 + inflationRate) - 1
    
    // Calculate annual contribution including employer match
    const annualContribution = monthlyContribution * 12 * (1 + employerMatch)
    
    let yearlyBreakdown = []
    let balance = currentSavings
    const currentYear = new Date().getFullYear()
    
    // Calculate accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year
      const investmentReturns = balance * investmentReturn
      balance = balance * (1 + investmentReturn) + annualContribution
      
      yearlyBreakdown.push({
        age,
        year: currentYear + year,
        annualSavings: annualContribution,
        investmentReturns,
        totalBalance: balance
      })
    }

    // Calculate retirement income
    const monthlyRetirementIncome = (balance * 0.04) / 12 // Using 4% withdrawal rule
    const totalMonthlyIncome = monthlyRetirementIncome + (socialSecurity / 12) + (otherIncome / 12)
    const desiredMonthlyIncome = desiredIncome / 12
    const incomeGap = desiredMonthlyIncome - totalMonthlyIncome
    const savingsProgress = (totalMonthlyIncome / desiredMonthlyIncome) * 100

    setResults({
      totalSavings: balance,
      monthlyRetirementIncome,
      totalMonthlyIncome,
      incomeGap,
      savingsProgress: Math.min(Math.max(savingsProgress, 0), 100)
    })

    // Prepare chart data
    const labels = yearlyBreakdown.map(item => `Age ${item.age}`)
    const balances = yearlyBreakdown.map(item => item.totalBalance)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Projected Savings Balance',
          data: balances,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
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
        <h1>Retirement Calculator</h1>
        <p className="calculator-description">
          Plan your retirement by estimating your savings and analyzing different scenarios.
        </p>
      </div>

      <form onSubmit={calculateRetirement} className="calculator-form">
        <div className="input-section">
          <h2>Current Status</h2>
          <div className="input-group">
            <label htmlFor="currentAge">Current Age</label>
            <div className="input-field">
              <input
                type="number"
                id="currentAge"
                name="currentAge"
                value={formData.currentAge}
                onChange={handleInputChange}
                min="18"
                max="100"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="retirementAge">Planned Retirement Age</label>
            <div className="input-field">
              <input
                type="number"
                id="retirementAge"
                name="retirementAge"
                value={formData.retirementAge}
                onChange={handleInputChange}
                min="40"
                max="100"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="lifeExpectancy">Life Expectancy</label>
            <div className="input-field">
              <input
                type="number"
                id="lifeExpectancy"
                name="lifeExpectancy"
                value={formData.lifeExpectancy}
                onChange={handleInputChange}
                min="50"
                max="120"
                required
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Current Savings</h2>
          <div className="input-group">
            <label htmlFor="currentSavings">Current Retirement Savings</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="currentSavings"
                name="currentSavings"
                value={formData.currentSavings}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="monthlyContribution">Monthly Contribution</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="monthlyContribution"
                name="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="employerMatch">Employer Match</label>
            <div className="input-field">
              <input
                type="number"
                id="employerMatch"
                name="employerMatch"
                value={formData.employerMatch}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Investment Details</h2>
          <div className="input-group">
            <label htmlFor="investmentReturn">Expected Annual Return</label>
            <div className="input-field">
              <input
                type="number"
                id="investmentReturn"
                name="investmentReturn"
                value={formData.investmentReturn}
                onChange={handleInputChange}
                min="0"
                max="20"
                step="0.1"
                required
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="inflationRate">Expected Inflation Rate</label>
            <div className="input-field">
              <input
                type="number"
                id="inflationRate"
                name="inflationRate"
                value={formData.inflationRate}
                onChange={handleInputChange}
                min="0"
                max="10"
                step="0.1"
                required
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Retirement Income</h2>
          <div className="input-group">
            <label htmlFor="desiredIncome">Desired Annual Retirement Income</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="desiredIncome"
                name="desiredIncome"
                value={formData.desiredIncome}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="socialSecurity">Expected Annual Social Security</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="socialSecurity"
                name="socialSecurity"
                value={formData.socialSecurity}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="otherIncome">Other Annual Income</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="otherIncome"
                name="otherIncome"
                value={formData.otherIncome}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Retirement Plan</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Retirement Analysis</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Total Savings at Retirement</span>
              <span className="result-value">{formatCurrency(results.totalSavings)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Monthly Income in Retirement</span>
              <span className="result-value">{formatCurrency(results.totalMonthlyIncome)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Income Gap</span>
              <span className="result-value">{formatCurrency(results.incomeGap)}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Savings Goal Progress:</span>
              <span>{results.savingsProgress.toFixed(1)}%</span>
            </div>
            <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${results.savingsProgress}%`,
                  background: results.savingsProgress >= 100 ? '#4CAF50' : '#ff9800',
                  borderRadius: '10px'
                }}
              ></div>
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
          <h3>Investment Returns</h3>
          <p>Historical average stock market returns have been around 7-10% annually before inflation. Consider your risk tolerance when setting expected returns.</p>
        </div>
        <div className="info-card">
          <h3>Inflation Impact</h3>
          <p>Inflation reduces purchasing power over time. The historical average is about 3% annually. Your retirement savings need to account for this.</p>
        </div>
        <div className="info-card">
          <h3>Social Security</h3>
          <p>Social Security benefits can provide supplemental retirement income. Visit the Social Security Administration website to estimate your benefits.</p>
        </div>
        <div className="info-card">
          <h3>Savings Rate</h3>
          <p>Financial experts often recommend saving 10-15% of your income for retirement. Employer matches can help you reach this goal.</p>
        </div>
      </div>
    </div>
  )
}

export default RetirementCalculator