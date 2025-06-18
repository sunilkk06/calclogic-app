import React from 'react'
import CalculatorCard from '../components/CalculatorCard'

const OtherCalculators = () => {
  const calculators = [
    {
      icon: 'fas fa-birthday-cake',
      title: 'Age Calculator',
      description: 'Calculate exact age between two dates in years, months, and days.',
      path: '/age-calculator'
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Date Calculator',
      description: 'Calculate days between dates or add/subtract days from a date.',
      path: '/date-calculator'
    },
    {
      icon: 'fas fa-clock',
      title: 'Time Calculator',
      description: 'Add or subtract times and calculate time differences.',
      path: '/time-calculator'
    },
    {
      icon: 'fas fa-baby',
      title: 'Pregnancy Calculator',
      description: 'Calculate due date and important pregnancy milestones.',
      path: '/pregnancy-calculator'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'GPA Calculator',
      description: 'Calculate your Grade Point Average for semester or cumulative GPA.',
      path: '/gpa-calculator'
    },
    {
      icon: 'fas fa-percentage',
      title: 'Grade Calculator',
      description: 'Calculate final course grades based on assignments and weights.',
      path: '/grade-calculator'
    }
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Other Calculators</h1>
        <p className="calculator-description">
          Explore our collection of useful utility calculators for time, pregnancy tracking, academic needs, and more.
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

export default OtherCalculators