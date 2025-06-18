import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const InvestmentCalculator = () => {
  const [formData, setFormData] = useState({
    initialInvestment: '10000',
    monthlyContribution: '500',
    investmentTimeframe: '10',
    expectedReturn: '7',
    riskLevel: 'moderate',
    investmentType: 'mixed'
  })
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Update expected return based on risk level if that's what changed
    if (name === 'riskLevel') {
      let expectedReturn
      switch(value) {
        case 'conservative':
          expectedReturn = '4'
          break
        case 'moderate':
          expectedReturn = '7'
          break
        case 'aggressive':
          expectedReturn = '10'
          break
        default:
          expectedReturn = '7'
      }
      setFormData(prev => ({
        ...prev,
        expectedReturn
      }))
    }
  }

  const calculateInvestment = (e) => {
    e.preventDefault()
    
    const initialInvestment = parseFloat(formData.initialInvestment)
    const monthlyContribution = parseFloat(formData.monthlyContribution)
    const timeframe = parseInt(formData.investmentTimeframe)
    const annualReturn = parseFloat(formData.expectedReturn) / 100

    if (isNaN(initialInvestment) || isNaN(monthlyContribution) || isNaN(timeframe) || isNaN(annualReturn)) {
      return
    }

    // Calculate investment growth
    const monthlyRate = annualReturn / 12
    const totalMonths = timeframe * 12
    let balance = initialInvestment
    const dataPoints = []
    let totalContributions = initialInvestment

    dataPoints.push({
      month: 0,
      balance: balance,
      contributions: totalContributions
    })

    for (let month = 1; month <= totalMonths; month++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution
      totalContributions += monthlyContribution

      if (month % 12 === 0) {
        dataPoints.push({
          month: month,
          balance: balance,
          contributions: totalContributions
        })
      }
    }

    // Calculate returns
    const totalValue = balance
    const totalReturn = totalValue - totalContributions
    const roi = (totalReturn / totalContributions) * 100

    setResults({
      totalValue,
      totalContributions,
      totalReturn,
      roi
    })

    // Prepare chart data
    const labels = dataPoints.map(data => `Year ${data.month / 12}`)
    const balanceData = dataPoints.map(data => data.balance)
    const contributionsData = dataPoints.map(data => data.contributions)

    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Balance',
          data: balanceData,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          fill: true
        },
        {
          label: 'Total Contributions',
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
        <h1>Investment Calculator</h1>
        <p className="calculator-description">
          Plan your investments and visualize potential returns with different investment strategies.
        </p>
      </div>

      <form onSubmit={calculateInvestment} className="calculator-form">
        <div className="input-section">
          <h2>Investment Details</h2>
          <div className="input-group">
            <label htmlFor="initialInvestment">Initial Investment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="initialInvestment"
                name="initialInvestment"
                value={formData.initialInvestment}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
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
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="investmentTimeframe">Investment Timeframe (Years)</label>
            <div className="input-field">
              <input
                type="number"
                id="investmentTimeframe"
                name="investmentTimeframe"
                value={formData.investmentTimeframe}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Return Expectations</h2>
          <div className="input-group">
            <label htmlFor="expectedReturn">Expected Annual Return</label>
            <div className="input-field">
              <input
                type="number"
                id="expectedReturn"
                name="expectedReturn"
                value={formData.expectedReturn}
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
            <label htmlFor="riskLevel">Risk Level</label>
            <div className="input-field">
              <select
                id="riskLevel"
                name="riskLevel"
                value={formData.riskLevel}
                onChange={handleInputChange}
                required
              >
                <option value="conservative">Conservative (3-5%)</option>
                <option value="moderate">Moderate (6-8%)</option>
                <option value="aggressive">Aggressive (9-12%)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="investmentType">Investment Type</label>
            <div className="input-field">
              <select
                id="investmentType"
                name="investmentType"
                value={formData.investmentType}
                onChange={handleInputChange}
                required
              >
                <option value="stocks">Stocks</option>
                <option value="bonds">Bonds</option>
                <option value="mixed">Mixed Portfolio</option>
                <option value="real-estate">Real Estate</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Investment</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Investment Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Total Investment Value</span>
              <span className="result-value">{formatCurrency(results.totalValue)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Contributions</span>
              <span className="result-value">{formatCurrency(results.totalContributions)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Return</span>
              <span className="result-value">{formatCurrency(results.totalReturn)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Return on Investment (ROI)</span>
              <span className="result-value">{results.roi.toFixed(2)}%</span>
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

          <div style={{ marginTop: '2rem' }}>
            <h3>Investment Breakdown</h3>
            <div style={{ marginTop: '1rem' }}>
              {/* Initial Investment Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>Initial Investment</div>
                  <div>{formatCurrency(parseFloat(formData.initialInvestment))}</div>
                </div>
                <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(parseFloat(formData.initialInvestment) / results.totalValue) * 100}%`,
                      background: '#4a90e2',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Contributions Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>Additional Contributions</div>
                  <div>{formatCurrency(results.totalContributions - parseFloat(formData.initialInvestment))}</div>
                </div>
                <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${((results.totalContributions - parseFloat(formData.initialInvestment)) / results.totalValue) * 100}%`,
                      background: '#50C878',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Returns Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>Investment Returns</div>
                  <div>{formatCurrency(results.totalReturn)}</div>
                </div>
                <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${(results.totalReturn / results.totalValue) * 100}%`,
                      background: '#FFA500',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Risk vs. Return</h3>
          <p>Generally, higher potential returns come with higher risk. Consider your risk tolerance when choosing investments:</p>
          <ul>
            <li>Conservative: Lower risk, stable returns</li>
            <li>Moderate: Balanced risk and return</li>
            <li>Aggressive: Higher risk, potential for higher returns</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Investment Types</h3>
          <ul>
            <li>Stocks: Higher risk, growth potential</li>
            <li>Bonds: Lower risk, steady income</li>
            <li>Mixed Portfolio: Balanced approach</li>
            <li>Real Estate: Tangible assets, rental income</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Investment Strategy Tips</h3>
          <ul>
            <li>Diversify your portfolio</li>
            <li>Invest regularly</li>
            <li>Consider long-term growth</li>
            <li>Monitor and rebalance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default InvestmentCalculator