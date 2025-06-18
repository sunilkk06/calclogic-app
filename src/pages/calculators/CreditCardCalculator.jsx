import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const CreditCardCalculator = () => {
  const [formData, setFormData] = useState({
    balance: '5000',
    apr: '18',
    minPayment: '100',
    paymentType: 'fixed',
    monthlyPayment: '200',
    extraPayment: '0'
  })
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [payoffSchedule, setPayoffSchedule] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculatePayoff = (e) => {
    e.preventDefault()
    
    const balance = parseFloat(formData.balance)
    const apr = parseFloat(formData.apr)
    const minPayment = parseFloat(formData.minPayment)
    const paymentType = formData.paymentType
    const fixedPayment = parseFloat(formData.monthlyPayment)
    const extraPayment = parseFloat(formData.extraPayment) || 0

    if (isNaN(balance) || isNaN(apr) || isNaN(minPayment) || 
        (paymentType === 'fixed' && isNaN(fixedPayment))) {
      return
    }

    // Calculate minimum payment for a debt
    const calculateMinPayment = (balance, rate, minPayment) => {
      const monthlyRate = rate / 1200
      const interest = balance * monthlyRate
      return Math.max(minPayment, interest + 1) // Ensure payment covers at least interest plus $1
    }

    // Calculate payoff schedule
    let remainingBalance = balance
    let month = 0
    let totalInterestPaid = 0
    const schedule = []
    const balanceData = [balance]
    const interestData = [0]
    const principalData = [0]

    while (remainingBalance > 0 && month < 1200) { // Cap at 100 years
      month++
      const monthlyRate = apr / 1200
      const interest = remainingBalance * monthlyRate
      
      let payment
      if (paymentType === 'fixed') {
        payment = fixedPayment + extraPayment
      } else { // percentage
        payment = calculateMinPayment(remainingBalance, apr, minPayment) + extraPayment
      }
      
      const principal = Math.min(payment, remainingBalance + interest) - interest
      
      totalInterestPaid += interest
      remainingBalance -= principal
      
      if (remainingBalance < 0.01) remainingBalance = 0

      schedule.push({
        month,
        payment,
        principal,
        interest,
        remainingBalance
      })
      
      balanceData.push(remainingBalance)
      interestData.push(interest)
      principalData.push(principal)
    }

    // Calculate minimum payment only scenario for comparison
    let minPaymentBalance = balance
    let minPaymentMonth = 0
    let minPaymentTotalInterest = 0

    while (minPaymentBalance > 0 && minPaymentMonth < 1200) {
      minPaymentMonth++
      const monthlyRate = apr / 1200
      const interest = minPaymentBalance * monthlyRate
      const payment = calculateMinPayment(minPaymentBalance, apr, minPayment)
      const principal = payment - interest
      
      minPaymentTotalInterest += interest
      minPaymentBalance -= principal
      
      if (minPaymentBalance < 0.01) minPaymentBalance = 0
    }

    const interestSaved = minPaymentTotalInterest - totalInterestPaid

    setResults({
      months: month,
      totalInterest: totalInterestPaid,
      totalPaid: balance + totalInterestPaid,
      interestSaved: interestSaved > 0 ? interestSaved : 0
    })

    setPayoffSchedule(schedule)

    // Prepare chart data
    const labels = Array.from({ length: month + 1 }, (_, i) => i)
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Balance',
          data: balanceData,
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Credit Card Calculator</h1>
        <p className="calculator-description">
          Calculate your credit card payoff time and interest costs. See how different payment strategies can help you become debt-free faster.
        </p>
      </div>

      <form onSubmit={calculatePayoff} className="calculator-form">
        <div className="input-section">
          <h2>Credit Card Details</h2>
          <div className="input-group">
            <label htmlFor="balance">Current Balance</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="apr">Annual Interest Rate (APR)</label>
            <div className="input-field">
              <input
                type="number"
                id="apr"
                name="apr"
                value={formData.apr}
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
            <label htmlFor="minPayment">Minimum Payment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="minPayment"
                name="minPayment"
                value={formData.minPayment}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Payment Strategy</h2>
          <div className="input-group">
            <label htmlFor="paymentType">Payment Type</label>
            <div className="input-field">
              <select
                id="paymentType"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                required
              >
                <option value="fixed">Fixed Monthly Payment</option>
                <option value="percentage">Percentage of Balance</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="monthlyPayment">Monthly Payment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="monthlyPayment"
                name="monthlyPayment"
                value={formData.monthlyPayment}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="extraPayment">Extra Monthly Payment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="extraPayment"
                name="extraPayment"
                value={formData.extraPayment}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Payoff Plan</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Credit Card Payoff Plan</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Time to Payoff</span>
              <span className="result-value">{results.months} months</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest Paid</span>
              <span className="result-value">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Amount Paid</span>
              <span className="result-value">{formatCurrency(results.totalPaid)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Interest Saved</span>
              <span className="result-value">{formatCurrency(results.interestSaved)}</span>
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
                          return 'Balance: ' + formatCurrency(context.parsed.y)
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          )}

          <div style={{ marginTop: '2rem' }}>
            <h3>Payment Schedule</h3>
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Month</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Principal</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Interest</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {payoffSchedule.slice(0, 12).map(payment => (
                    <tr key={payment.month}>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{payment.month}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.payment)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.principal)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.interest)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.remainingBalance)}</td>
                    </tr>
                  ))}
                  {payoffSchedule.length > 12 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '0.75rem 1rem', textAlign: 'center', fontStyle: 'italic' }}>
                        ... {payoffSchedule.length - 12} more payments ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Understanding APR</h3>
          <p>APR (Annual Percentage Rate) is the yearly interest rate charged on outstanding balances. A lower APR means you'll pay less in interest over time.</p>
        </div>
        <div className="info-card">
          <h3>Minimum Payments</h3>
          <p>Making only minimum payments can significantly extend your payoff time and increase total interest paid. Try to pay more than the minimum whenever possible.</p>
        </div>
        <div className="info-card">
          <h3>Extra Payments</h3>
          <p>Even small extra payments can make a big difference in reducing your total interest and payoff time. Consider allocating windfalls or bonuses to credit card payments.</p>
        </div>
      </div>
    </div>
  )
}

export default CreditCardCalculator