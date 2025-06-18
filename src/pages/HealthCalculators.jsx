import React from 'react'
import CalculatorCard from '../components/CalculatorCard'

const HealthCalculators = () => {
  const calculators = [
    {
      icon: 'fas fa-weight',
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index and determine your healthy weight range.',
      path: '/bmi-calculator'
    },
    {
      icon: 'fas fa-fire',
      title: 'BMR Calculator',
      description: 'Calculate your Basal Metabolic Rate and daily calorie needs.',
      path: '/bmr-calculator'
    },
    {
      icon: 'fas fa-percentage',
      title: 'Body Fat Calculator',
      description: 'Estimate your body fat percentage using various measurement methods.',
      path: '/body-fat-calculator'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Macro Calculator',
      description: 'Calculate your ideal macronutrient ratios for your fitness goals.',
      path: '/macro-calculator'
    },
    {
      icon: 'fas fa-apple-alt',
      title: 'Calorie Calculator',
      description: 'Determine your daily calorie needs based on your activity level and goals.',
      path: '/calorie-calculator'
    },
    {
      icon: 'fas fa-balance-scale',
      title: 'Ideal Weight Calculator',
      description: 'Find your ideal weight range based on height, age, and body frame.',
      path: '/ideal-weight-calculator'
    }
  ]

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Health & Fitness Calculators</h1>
        <p className="calculator-description">
          Access our comprehensive suite of health and fitness calculators to help you track your body metrics, plan your nutrition, and achieve your fitness goals.
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

export default HealthCalculators