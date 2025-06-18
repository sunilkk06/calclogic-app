import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const DebtPayoffCalculator = () => {
  const [debts, setDebts] = useState([
    { name: 'Credit Card', balance: '5000', rate: '18', minPayment: '150' }
  ])
  const [formData, setFormData] = useState({
    monthlyPayment: '500',
    strategy: 'avalanche',
    extraPayment: '0'
  })
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [payoffSchedule, setPayoffSchedule] = useState([])

  const handleDebtChange = (index, field, value) => {
    const updatedDebts = [...debts]
    updatedDebts[index][field] = value
    setDebts(updatedDebts)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addDebt = () => {
    setDebts([...debts, { name: '', balance: '', rate: '', minPayment: '' }])
  }

  const removeDebt = (index) => {
    if (debts.length > 1) {
      const updatedDebts = [...debts]
      updatedDebts.splice(index, 1)
      setDebts(updatedDebts)
    }
  }

  const calculatePayoff = (e) => {
    e.preventDefault()
    
    // Validate and parse inputs
    const parsedDebts = debts.map(debt => ({
      name: debt.name || 'Unnamed Debt',
      balance: parseFloat(debt.balance),
      rate: parseFloat(debt.rate),
      minPayment: parseFloat(debt.minPayment)
    }))
    
    const totalPayment = parseFloat(formData.monthlyPayment)
    const extraPayment = parseFloat(formData.extraPayment) || 0
    const strategy = formData.strategy
    
    if (parsedDebts.some(debt => isNaN(debt.balance) || isNaN(debt.rate) || isNaN(debt.minPayment)) || 
        isNaN(totalPayment)) {
      alert('Please enter valid numbers for all fields')
      return
    }

    // Calculate minimum payment for a debt
    const calculateMinPayment = (balance, rate, minPayment) => {
      const monthlyRate = rate / 1200
      const interest = balance * monthlyRate
      return Math.max(minPayment, interest + 1) // Ensure payment covers at least interest plus $1
    }

    // Calculate full debt payoff schedule
    const calculatePayoffSchedule = (debts, totalPayment, strategy, extraPayment = 0) => {
      const schedule = []
      let remainingDebts = debts.map(debt => ({
        ...debt,
        remainingBalance: debt.balance
      }))
      let month = 0
      const startDate = new Date()
      let totalInterestPaid = 0
      let availablePayment = totalPayment + extraPayment

      while (remainingDebts.length > 0 && month < 1200) { // Cap at 100 years
        const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1)
        
        // Sort debts according to strategy
        remainingDebts.sort((a, b) => {
          if (strategy === 'avalanche') {
            return b.rate - a.rate
          } else { // snowball
            return a.remainingBalance - b.remainingBalance
          }
        })

        // Calculate minimum payments
        let remainingPayment = availablePayment
        const monthlyPayments = []

        // First, allocate minimum payments
        remainingDebts.forEach(debt => {
          const minPayment = calculateMinPayment(debt.remainingBalance, debt.rate, debt.minPayment)
          const payment = Math.min(minPayment, debt.remainingBalance + (debt.remainingBalance * debt.rate / 1200))
          remainingPayment -= payment
          monthlyPayments.push({
            debtName: debt.name,
            payment: payment,
            remainingBalance: debt.remainingBalance
          })
        })

        // Then, allocate remaining payment to highest priority debt
        if (remainingPayment > 0 && remainingDebts.length > 0) {
          const targetDebt = monthlyPayments[0]
          targetDebt.payment += remainingPayment
        }

        // Apply payments and calculate new balances
        for (let i = 0; i < remainingDebts.length; i++) {
          const debt = remainingDebts[i]
          const payment = monthlyPayments[i]
          const monthlyRate = debt.rate / 1200
          const interest = debt.remainingBalance * monthlyRate
          const principal = payment.payment - interest

          totalInterestPaid += interest
          debt.remainingBalance -= principal

          if (debt.remainingBalance < 0.01) {
            debt.remainingBalance = 0
          }

          schedule.push({
            date: monthDate,
            debtName: debt.name,
            payment: payment.payment,
            principal: principal,
            interest: interest,
            remainingBalance: debt.remainingBalance
          })
        }

        // Remove paid off debts
        remainingDebts = remainingDebts.filter(debt => debt.remainingBalance > 0)
        month++
      }

      return {
        schedule: schedule,
        months: month,
        totalInterest: totalInterestPaid
      }
    }

    // Calculate payoff schedule with selected strategy
    const payoffResults = calculatePayoffSchedule(parsedDebts, totalPayment, strategy, extraPayment)

    // Calculate baseline (minimum payments only) for comparison
    const baselineResults = calculatePayoffSchedule(parsedDebts, totalPayment, strategy, 0)

    // Calculate total debt
    const totalDebt = parsedDebts.reduce((sum, debt) => sum + debt.balance, 0)
    const interestSaved = baselineResults.totalInterest - payoffResults.totalInterest

    setResults({
      months: payoffResults.months,
      totalInterest: payoffResults.totalInterest,
      totalPaid: totalDebt + payoffResults.totalInterest,
      interestSaved: interestSaved > 0 ? interestSaved : 0,
      totalDebt
    })

    setPayoffSchedule(payoffResults.schedule)

    // Aggregate data by month for chart
    const monthlyData = {}
    payoffResults.schedule.forEach(entry => {
      const monthKey = entry.date.toISOString().slice(0, 7)
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          date: entry.date,
          totalBalance: 0
        }
      }
      monthlyData[monthKey].totalBalance += entry.remainingBalance
    })

    const sortedMonths = Object.values(monthlyData).sort((a, b) => a.date - b.date)
    
    // Prepare chart data
    const labels = sortedMonths.map(month => month.date.toLocaleDateString())
    const balanceData = sortedMonths.map(month => month.totalBalance)
    
    setChartData({
      labels,
      datasets: [
        {
          label: 'Total Debt Balance',
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Debt Payoff Calculator</h1>
        <p className="calculator-description">
          Create a plan to pay off your debts faster. Compare different repayment strategies and see how extra payments can accelerate your debt-free journey.
        </p>
      </div>

      <form onSubmit={calculatePayoff} className="calculator-form">
        <div className="input-section">
          <h2>Your Debts</h2>
          {debts.map((debt, index) => (
            <div key={index} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '1rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Debt Name"
                  value={debt.name}
                  onChange={(e) => handleDebtChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  placeholder="Balance"
                  value={debt.balance}
                  onChange={(e) => handleDebtChange(index, 'balance', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="number"
                  placeholder="Interest Rate"
                  value={debt.rate}
                  onChange={(e) => handleDebtChange(index, 'rate', e.target.value)}
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
                <span className="percentage-symbol">%</span>
              </div>
              <div className="input-field">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  placeholder="Min Payment"
                  value={debt.minPayment}
                  onChange={(e) => handleDebtChange(index, 'minPayment', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeDebt(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53e3e',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  fontSize: '1.25rem'
                }}
                title="Remove Debt"
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addDebt}
            style={{
              background: '#f8fafc',
              color: '#4285F4',
              border: '1px solid #4285F4',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            + Add Another Debt
          </button>
        </div>

        <div className="input-section">
          <h2>Payment Strategy</h2>
          <div className="input-group">
            <label htmlFor="monthlyPayment">Total Monthly Payment</label>
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
                step="1"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="strategy">Repayment Strategy</label>
            <div className="input-field">
              <select
                id="strategy"
                name="strategy"
                value={formData.strategy}
                onChange={handleInputChange}
                required
              >
                <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                <option value="snowball">Debt Snowball (Lowest Balance First)</option>
              </select>
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
                step="1"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Payoff Plan</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Debt Payoff Plan</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Total Debt</span>
              <span className="result-value">{formatCurrency(results.totalDebt)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Time to Debt Free</span>
              <span className="result-value">{results.months} months</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest Paid</span>
              <span className="result-value">{formatCurrency(results.totalInterest)}</span>
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
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Debt Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Principal</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Interest</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {payoffSchedule.slice(0, 12).map((payment, index) => (
                    <tr key={index}>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{payment.date.toLocaleDateString()}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{payment.debtName}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.payment)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.principal)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.interest)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.remainingBalance)}</td>
                    </tr>
                  ))}
                  {payoffSchedule.length > 12 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '0.75rem 1rem', textAlign: 'center', fontStyle: 'italic' }}>
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
          <h3>Debt Avalanche</h3>
          <p>The Debt Avalanche method prioritizes paying off debts with the highest interest rates first. This strategy minimizes the total interest paid and typically results in the fastest payoff time.</p>
        </div>
        <div className="info-card">
          <h3>Debt Snowball</h3>
          <p>The Debt Snowball method focuses on paying off the smallest debts first. While it may cost more in interest, the psychological boost from quick wins can help maintain motivation.</p>
        </div>
        <div className="info-card">
          <h3>Extra Payments</h3>
          <p>Making extra payments, even small ones, can significantly reduce your total interest paid and help you become debt-free faster. Consider allocating windfalls or bonuses to debt repayment.</p>
        </div>
      </div>
    </div>
  )
}

export default DebtPayoffCalculator