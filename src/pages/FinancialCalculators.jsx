import React from 'react'
import CalculatorCard from '../components/CalculatorCard'

const FinancialCalculators = () => {
  const calculators = [
    {
      icon: 'fas fa-home',
      title: 'Mortgage Calculator',
      description: 'Calculate monthly mortgage payments, interest, and amortization schedule.',
      path: '/mortgage-calculator'
    },
    {
      icon: 'fas fa-car',
      title: 'Auto Loan Calculator',
      description: 'Calculate car loan payments and total costs including interest.',
      path: '/auto-loan-calculator'
    },
    {
      icon: 'fas fa-piggy-bank',
      title: '401k Calculator',
      description: 'Plan your retirement savings and estimate future account value.',
      path: '/401k-calculator'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Investment Calculator',
      description: 'Project investment growth and returns over time.',
      path: '/investment-calculator'
    },
    {
      icon: 'fas fa-coins',
      title: 'Compound Interest Calculator',
      description: 'Calculate how your investments grow with compound interest.',
      path: '/compound-interest-calculator'
    },
    {
      icon: 'fas fa-percentage',
      title: 'Simple Interest Calculator',
      description: 'Calculate interest earned or paid on investments and loans.',
      path: '/simple-interest-calculator'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Payment Calculator',
      description: 'Calculate payments for different frequencies and terms.',
      path: '/payment-calculator'
    },
    {
      icon: 'fas fa-chart-pie',
      title: 'Retirement Calculator',
      description: 'Plan your retirement savings and estimate future needs.',
      path: '/retirement-calculator'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'Credit Card Calculator',
      description: 'Calculate credit card payments and payoff time.',
      path: '/credit-card-calculator'
    },
    {
      icon: 'fas fa-hand-holding-usd',
      title: 'Debt Payoff Calculator',
      description: 'Create a plan to pay off your debts faster.',
      path: '/debt-payoff-calculator'
    },
    {
      icon: 'fas fa-wallet',
      title: 'Budget Calculator',
      description: 'Plan your monthly budget and track expenses.',
      path: '/budget-calculator'
    },
    {
      icon: 'fas fa-chart-bar',
      title: 'Interest Calculator',
      description: 'Compare different interest rates and payment scenarios.',
      path: '/interest-calculator'
    }
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Financial Calculators</h1>
        <p className="calculator-description">
          Access our comprehensive suite of financial calculators to help you make informed decisions about loans, investments, retirement, and more.
        </p>
      </div>

      <div className="calculator-grid">
        {calculators.map((calc, index) => (
          <CalculatorCard
            key={index}
            icon={calc.icon}
            title={calc.title}
            description={calc.description}
            path={calc.path}
          />
        ))}
      </div>
    </div>
  )
}

export default FinancialCalculators