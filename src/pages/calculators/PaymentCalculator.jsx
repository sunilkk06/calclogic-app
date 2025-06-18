import React, { useState } from 'react'

const PaymentCalculator = () => {
  const [formData, setFormData] = useState({
    paymentType: 'monthly',
    amount: '10000',
    rate: '5',
    term: '5',
    startDate: new Date().toISOString().split('T')[0]
  })
  const [results, setResults] = useState(null)
  const [schedule, setSchedule] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculatePayment = (e) => {
    e.preventDefault()
    
    const amount = parseFloat(formData.amount)
    const annualRate = parseFloat(formData.rate) / 100
    const years = parseFloat(formData.term)
    const startDate = new Date(formData.startDate)
    const paymentType = formData.paymentType

    if (isNaN(amount) || isNaN(annualRate) || isNaN(years) || !(startDate instanceof Date) || isNaN(startDate)) {
      return
    }

    let periodsPerYear
    switch(paymentType) {
      case 'weekly':
        periodsPerYear = 52
        break
      case 'biweekly':
        periodsPerYear = 26
        break
      default: // monthly
        periodsPerYear = 12
        break
    }

    const totalPeriods = Math.floor(years * periodsPerYear)
    const periodicRate = annualRate / periodsPerYear

    // Calculate regular payment using the loan payment formula
    let regularPayment
    if (periodicRate === 0) {
      regularPayment = amount / totalPeriods
    } else {
      regularPayment = amount * 
        (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / 
        (Math.pow(1 + periodicRate, totalPeriods) - 1)
    }

    // Generate payment schedule
    let remainingBalance = amount
    let totalInterest = 0
    const paymentSchedule = []
    let currentDate = new Date(startDate)

    for (let period = 1; period <= totalPeriods; period++) {
      const interestPayment = remainingBalance * periodicRate
      const principalPayment = regularPayment - interestPayment
      totalInterest += interestPayment
      remainingBalance -= principalPayment

      paymentSchedule.push({
        period,
        date: new Date(currentDate),
        payment: regularPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance)
      })

      // Increment date based on payment type
      switch(paymentType) {
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7)
          break
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14)
          break
        default: // monthly
          currentDate.setMonth(currentDate.getMonth() + 1)
          break
      }
    }

    setResults({
      regularPayment,
      totalPrincipal: amount,
      totalInterest,
      totalAmount: amount + totalInterest
    })

    setSchedule(paymentSchedule)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Payment Calculator</h1>
        <p className="calculator-description">
          Calculate different types of payments and create payment schedules based on various payment frequencies.
        </p>
      </div>

      <form onSubmit={calculatePayment} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="paymentType">Select Payment Type:</label>
            <div className="input-field">
              <select
                id="paymentType"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
              >
                <option value="monthly">Monthly Payment</option>
                <option value="biweekly">Biweekly Payment</option>
                <option value="weekly">Weekly Payment</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="amount">Total Amount</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 10000"
                required
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
                required
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="term">Term (Years)</label>
            <div className="input-field">
              <input
                type="number"
                id="term"
                name="term"
                value={formData.term}
                onChange={handleInputChange}
                step="0.25"
                placeholder="e.g., 5"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="startDate">Start Date</label>
            <div className="input-field">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Payment</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Payment Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Regular Payment Amount</span>
              <span className="result-value">{formatCurrency(results.regularPayment)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Principal</span>
              <span className="result-value">{formatCurrency(results.totalPrincipal)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest</span>
              <span className="result-value">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Amount</span>
              <span className="result-value">{formatCurrency(results.totalAmount)}</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Payment Schedule</h3>
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Payment #</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Payment</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Principal</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Interest</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.slice(0, 12).map(payment => (
                    <tr key={payment.period}>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{payment.period}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatDate(payment.date)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.payment)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.principal)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.interest)}</td>
                      <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(payment.balance)}</td>
                    </tr>
                  ))}
                  {schedule.length > 12 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '0.75rem 1rem', textAlign: 'center', fontStyle: 'italic' }}>
                        ... {schedule.length - 12} more payments ...
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
          <h3>Payment Frequencies</h3>
          <ul>
            <li><strong>Monthly Payments:</strong> Most common payment schedule, with 12 payments per year</li>
            <li><strong>Biweekly Payments:</strong> 26 payments per year, can help reduce interest and loan term</li>
            <li><strong>Weekly Payments:</strong> 52 payments per year, smallest individual payment amount</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Benefits of Different Payment Schedules</h3>
          <p>More frequent payments (biweekly or weekly) can reduce the total interest paid and help pay off the debt faster. However, monthly payments might be easier to budget and manage. Choose the schedule that best fits your financial situation.</p>
        </div>
        <div className="info-card">
          <h3>Payment Components</h3>
          <p>Each payment consists of two parts: principal and interest. Early payments have a higher proportion of interest, while later payments have more principal. This is known as amortization. The payment schedule shows how each payment is split between principal and interest.</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentCalculator