import React, { useState } from 'react'

const AutoLoanCalculator = () => {
  const [formData, setFormData] = useState({
    vehiclePrice: '25000',
    downPayment: '5000',
    tradeIn: '2000',
    salesTax: '6',
    interestRate: '4.5',
    loanTerm: '60'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateAutoLoan = (e) => {
    e.preventDefault()
    
    const vehiclePrice = parseFloat(formData.vehiclePrice) || 0
    const downPayment = parseFloat(formData.downPayment) || 0
    const tradeIn = parseFloat(formData.tradeIn) || 0
    const salesTaxRate = parseFloat(formData.salesTax) || 0
    const annualRate = parseFloat(formData.interestRate)
    const termInMonths = parseInt(formData.loanTerm)

    if (isNaN(annualRate) || isNaN(termInMonths) || termInMonths <= 0 || vehiclePrice <= 0) {
      return
    }

    // Calculate taxable amount
    const taxableAmount = vehiclePrice - tradeIn
    // Calculate sales tax amount
    const salesTaxAmount = taxableAmount * (salesTaxRate / 100)

    // Calculate total amount to be financed
    const amountAfterTax = vehiclePrice + salesTaxAmount
    const principal = amountAfterTax - downPayment - tradeIn

    if (principal <= 0) {
      setResults({
        monthlyPayment: 0,
        totalLoan: 0,
        totalInterest: 0,
        totalCost: downPayment + tradeIn
      })
      return
    }

    // Calculate monthly payment
    const monthlyRate = (annualRate / 100) / 12
    let monthlyPayment

    if (monthlyRate === 0) {
      monthlyPayment = principal / termInMonths
    } else {
      monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
        (Math.pow(1 + monthlyRate, termInMonths) - 1)
    }
    
    // Calculate totals
    const totalPayment = monthlyPayment * termInMonths
    const totalInterest = totalPayment - principal
    const totalCost = principal + totalInterest + downPayment + tradeIn

    setResults({
      monthlyPayment,
      totalLoan: principal,
      totalInterest,
      totalCost
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
        <h1>Auto Loan Calculator</h1>
        <p className="calculator-description">
          Estimate your monthly car payment and see how factors like loan term, down payment, and interest rate affect your costs.
        </p>
      </div>

      <form onSubmit={calculateAutoLoan} className="calculator-form">
        <div className="input-section">
          <h2>Vehicle Information</h2>
          <div className="input-group">
            <label htmlFor="vehiclePrice">Vehicle Price</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="vehiclePrice"
                name="vehiclePrice"
                value={formData.vehiclePrice}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 25000"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="downPayment">Down Payment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="downPayment"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 5000"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="tradeIn">Trade-in Value</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="tradeIn"
                name="tradeIn"
                value={formData.tradeIn}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 2000"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="salesTax">Sales Tax Rate</label>
            <div className="input-field">
              <input
                type="number"
                id="salesTax"
                name="salesTax"
                value={formData.salesTax}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 6"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Loan Details</h2>
          <div className="input-group">
            <label htmlFor="interestRate">Annual Interest Rate (APR)</label>
            <div className="input-field">
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 4.5"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="loanTerm">Loan Term (Months)</label>
            <div className="input-field">
              <input
                type="number"
                id="loanTerm"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
                step="1"
                placeholder="e.g., 60"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Payment</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Auto Loan Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Estimated Monthly Payment</span>
              <span className="result-value">{formatCurrency(results.monthlyPayment)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Loan Amount</span>
              <span className="result-value">{formatCurrency(results.totalLoan)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest Paid</span>
              <span className="result-value">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Cost (Loan + Down Payment)</span>
              <span className="result-value">{formatCurrency(results.totalCost)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Key Loan Components</h3>
          <ul>
            <li><strong>Vehicle Price:</strong> The starting cost of the car.</li>
            <li><strong>Down Payment/Trade-in:</strong> Reduces the amount you need to borrow.</li>
            <li><strong>Sales Tax:</strong> Added to the price, increasing the loan amount if financed.</li>
            <li><strong>Interest Rate (APR):</strong> The annual cost of borrowing, expressed as a percentage.</li>
            <li><strong>Loan Term:</strong> The length of time you have to repay the loan (in months).</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Factors Affecting Your Payment</h3>
          <p>Your monthly payment is primarily influenced by the total loan amount, the interest rate (APR), and the loan term. A larger down payment, lower APR, or longer term generally reduces the monthly payment, but a longer term means paying more total interest.</p>
        </div>
        <div className="info-card">
          <h3>APR vs. Interest Rate</h3>
          <p>The Annual Percentage Rate (APR) includes the interest rate plus any lender fees, providing a more complete picture of the borrowing cost. This calculator uses the provided rate as the APR for simplicity.</p>
        </div>
      </div>
    </div>
  )
}

export default AutoLoanCalculator