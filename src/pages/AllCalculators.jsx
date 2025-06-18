import React from 'react'
import CalculatorCard from '../components/CalculatorCard'

const AllCalculators = () => {
  const financialCalculators = [
    { icon: 'fas fa-home', title: 'Mortgage Calculator', description: 'Calculate monthly mortgage payments, interest, and amortization schedule.', path: '/mortgage-calculator' },
    { icon: 'fas fa-piggy-bank', title: '401k Calculator', description: 'Plan your retirement savings and estimate future account value.', path: '/401k-calculator' },
    { icon: 'fas fa-credit-card', title: 'Credit Card Calculator', description: 'Calculate payoff time and interest for credit card debt.', path: '/credit-card-calculator' }
  ]

  const healthCalculators = [
    { icon: 'fas fa-weight', title: 'BMI Calculator', description: 'Calculate your Body Mass Index and determine your healthy weight range.', path: '/bmi-calculator' },
    { icon: 'fas fa-fire', title: 'BMR Calculator', description: 'Calculate your Basal Metabolic Rate and daily calorie needs.', path: '/bmr-calculator' },
    { icon: 'fas fa-utensils', title: 'Macro Calculator', description: 'Calculate your ideal macronutrient ratios for your fitness goals.', path: '/macro-calculator' }
  ]

  const mathCalculators = [
    { icon: 'fas fa-calculator', title: 'Scientific Calculator', description: 'Perform complex mathematical calculations and conversions.', path: '/scientific-calculator' },
    { icon: 'fas fa-percentage', title: 'Percentage Calculator', description: 'Calculate percentages, percentage changes, and ratios.', path: '/percentage-calculator' }
  ]

  const otherCalculators = [
    { icon: 'fas fa-graduation-cap', title: 'GPA Calculator', description: 'Calculate your Grade Point Average for semester or cumulative GPA.', path: '/gpa-calculator' },
    { icon: 'fas fa-clock', title: 'Time Calculator', description: 'Calculate time differences, add or subtract time intervals.', path: '/time-calculator' }
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>All Calculators</h1>
        <p className="calculator-description">Explore our comprehensive collection of calculators for finance, health, math, and more.</p>
      </div>

      {/* Financial Calculators Section */}
      <section className="calculator-section">
        <h2>Financial Calculators</h2>
        <div className="calculator-grid">
          {financialCalculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              path={calc.path}
            />
          ))}
        </div>
      </section>

      {/* Health Calculators Section */}
      <section className="calculator-section">
        <h2>Health & Fitness Calculators</h2>
        <div className="calculator-grid">
          {healthCalculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              path={calc.path}
            />
          ))}
        </div>
      </section>

      {/* Math Calculators Section */}
      <section className="calculator-section">
        <h2>Math Calculators</h2>
        <div className="calculator-grid">
          {mathCalculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              path={calc.path}
            />
          ))}
        </div>
      </section>

      {/* Other Calculators Section */}
      <section className="calculator-section">
        <h2>Other Calculators</h2>
        <div className="calculator-grid">
          {otherCalculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              path={calc.path}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default AllCalculators