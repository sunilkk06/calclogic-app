import React from 'react'
import { Link } from 'react-router-dom'
import HeroCalculator from '../components/HeroCalculator'
import ShareButtons from '../components/ShareButtons'

const Home = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <HeroCalculator />
          <div className="hero-text">
            <h2>Free Online Calculators</h2>
            <form className="search-form">
              <input type="search" placeholder="Search calculators..." />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section className="calculator-container">
        {/* Financial Calculators */}
        <div className="calculator-category">
          <div className="category-header">
            <div className="category-icon">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h2>Financial Calculators</h2>
          </div>
          <ul className="calculator-grid">
            <li><Link to="/mortgage-calculator">Mortgage Calculator</Link></li>
            <li><Link to="/auto-loan-calculator">Auto Loan Calculator</Link></li>
            <li><Link to="/401k-calculator">401k Calculator</Link></li>
            <li><Link to="/retirement-calculator">Retirement Calculator</Link></li>
            <li><Link to="/compound-interest-calculator">Compound Interest Calculator</Link></li>
            <li><Link to="/investment-calculator">Investment Calculator</Link></li>
          </ul>
          <div className="category-footer">
            <Link to="/financial" className="calculator-btn">View All Financial Calculators</Link>
          </div>
        </div>

        {/* Health & Fitness Calculators */}
        <div className="calculator-category">
          <div className="category-header">
            <div className="category-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h2>Health & Fitness Calculators</h2>
          </div>
          <ul className="calculator-grid">
            <li><Link to="/bmi-calculator">BMI Calculator</Link></li>
            <li><Link to="/bmr-calculator">BMR Calculator</Link></li>
            <li><Link to="/body-fat-calculator">Body Fat Calculator</Link></li>
            <li><Link to="/macro-calculator">Macro Calculator</Link></li>
            <li><Link to="/calorie-calculator">Calorie Calculator</Link></li>
            <li><Link to="/ideal-weight-calculator">Ideal Weight Calculator</Link></li>
          </ul>
          <div className="category-footer">
            <Link to="/health" className="calculator-btn">View All Health Calculators</Link>
          </div>
        </div>

        {/* Math Calculators */}
        <div className="calculator-category">
          <div className="category-header">
            <div className="category-icon">
              <i className="fas fa-calculator"></i>
            </div>
            <h2>Math Calculators</h2>
          </div>
          <ul className="calculator-grid">
            <li><Link to="/percentage-calculator">Percentage Calculator</Link></li>
            <li><Link to="/fraction-calculator">Fraction Calculator</Link></li>
            <li><Link to="/scientific-calculator">Scientific Calculator</Link></li>
            <li><Link to="/ratio-calculator">Ratio Calculator</Link></li>
            <li><Link to="/statistics-calculator">Statistics Calculator</Link></li>
            <li><Link to="/unit-converter">Unit Converter</Link></li>
          </ul>
          <div className="category-footer">
            <Link to="/math" className="calculator-btn">View All Math Calculators</Link>
          </div>
        </div>

        {/* Other Calculators */}
        <div className="calculator-category">
          <div className="category-header">
            <div className="category-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h2>Other Calculators</h2>
          </div>
          <ul className="calculator-grid">
            <li><Link to="/age-calculator">Age Calculator</Link></li>
            <li><Link to="/date-calculator">Date Calculator</Link></li>
            <li><Link to="/time-calculator">Time Calculator</Link></li>
            <li><Link to="/pregnancy-calculator">Pregnancy Calculator</Link></li>
            <li><Link to="/gpa-calculator">GPA Calculator</Link></li>
            <li><Link to="/grade-calculator">Grade Calculator</Link></li>
          </ul>
          <div className="category-footer">
            <Link to="/other" className="calculator-btn">View All Other Calculators</Link>
          </div>
        </div>
      </section>

      <section className="calculator-container">
        <div style={{ textAlign: 'center' }}>
          <h2>Need More Calculators?</h2>
          <p>Explore our full range of calculators designed to help you make better decisions in finance, health, education, and more.</p>
          <Link to="/all-calculators" className="calculator-btn">Explore All Calculators</Link>
        </div>
        
        <ShareButtons 
          title="CalcLogic - Free Online Calculators"
          description="Your go-to resource for free online calculators. Simple, accurate, and accessible for everyday needs."
          customMessage="Check out CalcLogic - Amazing free calculators for all your needs! Financial, health, math and more."
        />
      </section>
    </>
  )
}

export default Home