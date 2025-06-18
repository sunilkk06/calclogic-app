import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Calculator401k = () => {
  const [formData, setFormData] = useState({
    currentAge: '30',
    retirementAge: '65',
    currentBalance: '10000',
    annualSalary: '60000',
    contributionPercent: '6',
    employerMatch: '3',
    employerMatchLimit: '6',
    annualReturn: '7',
    salaryIncrease: '2'
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

  // Calculate annual contribution with employer match
  const calculateAnnualContribution = (salary, contributionPercent, employerMatch, employerMatchLimit) => {
    const employeeContribution = salary * (contributionPercent / 100)
    const maxMatchableContribution = salary * (employerMatchLimit / 100)
    const actualMatchableContribution = Math.min(employeeContribution, maxMatchableContribution)
    const employerContribution = actualMatchableContribution * (employerMatch / 100)
    
    return {
      employee: employeeContribution,
      employer: employerContribution,
      total: employeeContribution + employerContribution
    }
  }

  const calculate401k = (e) => {
    e.preventDefault()
    
    const currentAge = parseInt(formData.currentAge)
    const retirementAge = parseInt(formData.retirementAge)
    const currentBalance = parseFloat(formData.currentBalance)
    const annualSalary = parseFloat(formData.annualSalary)
    const contributionPercent = parseFloat(formData.contributionPercent)
    const employerMatch = parseFloat(formData.employerMatch)
    const employerMatchLimit = parseFloat(formData.employerMatchLimit)
    const annualReturn = parseFloat(formData.annualReturn) / 100
    const salaryIncrease = parseFloat(formData.salaryIncrease) / 100

    if (isNaN(currentAge) || isNaN(retirementAge) || isNaN(currentBalance) || isNaN(annualSalary) || 
        isNaN(contributionPercent) || isNaN(employerMatch) || isNaN(employerMatchLimit) || 
        isNaN(annualReturn) || isNaN(salaryIncrease)) {
      return
    }

    const years = []
    const balances = []
    const contributions = []
    const employerMatches = []
    
    let balance = currentBalance
    let currentSalary = annualSalary
    let totalContributions = 0
    let totalEmployerMatch = 0
    const yearsToRetirement = retirementAge - currentAge

    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year
      
      // Calculate contributions for the year
      const yearlyContribution = calculateAnnualContribution(
        currentSalary,
        contributionPercent,
        employerMatch,
        employerMatchLimit
      )

      // Add contributions to balance
      balance += yearlyContribution.total
      
      // Calculate returns
      balance *= (1 + annualReturn)

      // Track results
      years.push(age)
      balances.push(balance)
      contributions.push(yearlyContribution.employee)
      employerMatches.push(yearlyContribution.employer)
      
      // Update running totals
      totalContributions += yearlyContribution.employee
      totalEmployerMatch += yearlyContribution.employer

      // Increase salary for next year
      currentSalary *= (1 + salaryIncrease)
    }

    const finalBalance = balance
    const totalReturns = finalBalance - totalContributions - totalEmployerMatch - currentBalance

    setResults({
      finalBalance,
      totalContributions,
      totalEmployerMatch,
      totalReturns
    })

    setChartData({
      labels: years,
      datasets: [
        {
          label: '401k Balance',
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
        <h1>401k Calculator</h1>
        <p className="calculator-description">
          Plan your retirement savings with 401k contributions and see how your investments can grow over time.
        </p>
      </div>

      <form onSubmit={calculate401k} className="calculator-form">
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
                required
                min="18"
                max="80"
              />
              <span className="unit">years</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="retirementAge">Retirement Age</label>
            <div className="input-field">
              <input
                type="number"
                id="retirementAge"
                name="retirementAge"
                value={formData.retirementAge}
                onChange={handleInputChange}
                required
                min="50"
                max="85"
              />
              <span className="unit">years</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="currentBalance">Current 401k Balance</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="currentBalance"
                name="currentBalance"
                value={formData.currentBalance}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="annualSalary">Annual Salary</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="annualSalary"
                name="annualSalary"
                value={formData.annualSalary}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Contributions</h2>
          <div className="input-group">
            <label htmlFor="contributionPercent">Your Contribution</label>
            <div className="input-field">
              <input
                type="number"
                id="contributionPercent"
                name="contributionPercent"
                value={formData.contributionPercent}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                step="0.1"
              />
              <span className="percentage-symbol">%</span>
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
                required
                min="0"
                max="100"
                step="0.1"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="employerMatchLimit">Employer Match Limit</label>
            <div className="input-field">
              <input
                type="number"
                id="employerMatchLimit"
                name="employerMatchLimit"
                value={formData.employerMatchLimit}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                step="0.1"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Growth Assumptions</h2>
          <div className="input-group">
            <label htmlFor="annualReturn">Expected Annual Return</label>
            <div className="input-field">
              <input
                type="number"
                id="annualReturn"
                name="annualReturn"
                value={formData.annualReturn}
                onChange={handleInputChange}
                required
                min="0"
                max="30"
                step="0.1"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="salaryIncrease">Annual Salary Increase</label>
            <div className="input-field">
              <input
                type="number"
                id="salaryIncrease"
                name="salaryIncrease"
                value={formData.salaryIncrease}
                onChange={handleInputChange}
                required
                min="0"
                max="20"
                step="0.1"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Retirement Savings</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your 401k Projection</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">401k Balance at Retirement</span>
              <span className="result-value">{formatCurrency(results.finalBalance)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Contributions</span>
              <span className="result-value">{formatCurrency(results.totalContributions)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Employer Match</span>
              <span className="result-value">{formatCurrency(results.totalEmployerMatch)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Investment Returns</span>
              <span className="result-value">{formatCurrency(results.totalReturns)}</span>
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
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Age'
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return 'Balance: ' + formatCurrency(context.parsed.y)
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
          <h3>About 401k Plans</h3>
          <p>A 401k is a tax-advantaged retirement account offered by employers. Contributions are made with pre-tax dollars, reducing your taxable income for the year.</p>
        </div>
        <div className="info-card">
          <h3>Employer Matching</h3>
          <p>Many employers match a portion of your contributions. This is essentially free money for your retirement - try to contribute at least enough to get the full match.</p>
        </div>
        <div className="info-card">
          <h3>Investment Returns</h3>
          <p>The power of compound interest means your investments can grow significantly over time. Historical stock market returns have averaged around 7% per year after inflation.</p>
        </div>
      </div>
    </div>
  )
}

export default Calculator401k