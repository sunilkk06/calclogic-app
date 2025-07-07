import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    homePrice: '300000',
    downPayment: '60000',
    loanTerm: '30',
    interestRate: '3.5',
    propertyTax: '1.2',
    homeInsurance: '1200'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateMortgage = (e) => {
    e.preventDefault()
    
    const homePrice = parseFloat(formData.homePrice)
    const downPayment = parseFloat(formData.downPayment)
    const loanTerm = parseInt(formData.loanTerm)
    const interestRate = parseFloat(formData.interestRate) / 100
    const propertyTax = parseFloat(formData.propertyTax) / 100
    const homeInsurance = parseFloat(formData.homeInsurance)

    // Calculate loan amount
    const loanAmount = homePrice - downPayment
    
    // Calculate monthly interest rate
    const monthlyRate = interestRate / 12
    
    // Calculate number of payments
    const numberOfPayments = loanTerm * 12

    // Calculate monthly mortgage payment (P&I)
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    // Calculate monthly tax and insurance
    const monthlyTax = (homePrice * propertyTax) / 12
    const monthlyInsurance = homeInsurance / 12

    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance

    // Calculate total payment and interest
    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - loanAmount

    setResults({
      monthlyPayment: monthlyPayment,
      monthlyTax: monthlyTax,
      monthlyInsurance: monthlyInsurance,
      totalMonthlyPayment: totalMonthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      loanAmount: loanAmount
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
        <h1>Mortgage Calculator</h1>
        <p className="calculator-description">
          Calculate your monthly mortgage payments, view amortization schedule, and understand the total cost of your home loan.
        </p>
      </div>

      <form onSubmit={calculateMortgage} className="calculator-form">
        <div className="input-section">
          <h2>Loan Details</h2>
          <div className="input-group">
            <label htmlFor="homePrice">Home Price</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="homePrice"
                name="homePrice"
                value={formData.homePrice}
                onChange={handleInputChange}
                required
                min="0"
                step="1000"
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
                required
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="loanTerm">Loan Term (Years)</label>
            <div className="input-field">
              <select
                id="loanTerm"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
                required
              >
                <option value="30">30 Years</option>
                <option value="20">20 Years</option>
                <option value="15">15 Years</option>
                <option value="10">10 Years</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <div className="input-field">
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Additional Costs</h2>
          <div className="input-group">
            <label htmlFor="propertyTax">Property Tax Rate (%)</label>
            <div className="input-field">
              <input
                type="number"
                id="propertyTax"
                name="propertyTax"
                value={formData.propertyTax}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="homeInsurance">Annual Home Insurance</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="homeInsurance"
                name="homeInsurance"
                value={formData.homeInsurance}
                onChange={handleInputChange}
                required
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Mortgage</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Mortgage Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Principal & Interest</span>
              <span className="result-value">{formatCurrency(results.monthlyPayment)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Property Tax</span>
              <span className="result-value">{formatCurrency(results.monthlyTax)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Home Insurance</span>
              <span className="result-value">{formatCurrency(results.monthlyInsurance)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Monthly Payment</span>
              <span className="result-value">{formatCurrency(results.totalMonthlyPayment)}</span>
            </div>
          </div>
          
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Loan Amount</span>
              <span className="result-value">{formatCurrency(results.loanAmount)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest</span>
              <span className="result-value">{formatCurrency(results.totalInterest)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Payment</span>
              <span className="result-value">{formatCurrency(results.totalPayment)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Principal & Interest</h3>
          <p>The principal is the amount you borrow, and interest is the cost of borrowing. Your monthly payment includes both, with early payments having a higher proportion of interest.</p>
        </div>
        <div className="info-card">
          <h3>Property Taxes</h3>
          <p>Annual property taxes are often divided into monthly payments and held in an escrow account. The amount varies by location and property value.</p>
        </div>
        <div className="info-card">
          <h3>Insurance</h3>
          <p>Homeowners insurance is typically required by lenders and is often included in your monthly payment. Private Mortgage Insurance (PMI) may be required if your down payment is less than 20%.</p>
        </div>
      </div>
      
      <ShareButtons 
        title="Mortgage Calculator"
        description="Calculate your monthly mortgage payments and understand the total cost of your home loan"
        customMessage="Calculate your monthly mortgage payments with this easy-to-use calculator!"
      />
    </div>
  )
}

export default MortgageCalculator