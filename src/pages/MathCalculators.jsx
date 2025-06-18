import React from 'react'
import CalculatorCard from '../components/CalculatorCard'

const MathCalculators = () => {
  const calculators = [
    {
      icon: 'fas fa-percentage',
      title: 'Percentage Calculator',
      description: 'Calculate percentages, increases, decreases, and more.',
      path: '/percentage-calculator'
    },
    {
      icon: 'fas fa-divide',
      title: 'Fraction Calculator',
      description: 'Add, subtract, multiply, and divide fractions.',
      path: '/fraction-calculator'
    },
    {
      icon: 'fas fa-equals',
      title: 'Ratio Calculator',
      description: 'Simplify ratios or solve for missing values in proportions.',
      path: '/ratio-calculator'
    },
    {
      icon: 'fas fa-flask',
      title: 'Scientific Calculator',
      description: 'Perform advanced mathematical calculations.',
      path: '/scientific-calculator'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Statistics Calculator',
      description: 'Calculate mean, median, mode, and standard deviation.',
      path: '/statistics-calculator'
    },
    {
      icon: 'fas fa-ruler-combined',
      title: 'Unit Converter',
      description: 'Convert between different units of measurement.',
      path: '/unit-converter'
    }
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Math Calculators</h1>
        <p className="calculator-description">
          Solve complex math problems with our collection of calculators, covering percentages, fractions, statistics, unit conversions, and more.
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

export default MathCalculators