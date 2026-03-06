import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import HeroCalculator from '../components/HeroCalculator'
import ShareButtons from '../components/ShareButtons'

const Home = () => {
  return (
    <>
      <Helmet>
        <title>CalcLogic — Free Online Calculators for Finance, Health & Math</title>
        <meta name="description" content="Free online calculators for finance, health, math and everyday use. BMI, mortgage, calorie, GPA, percentage calculators and 20+ more tools. Instant results, no signup ever required." />
        <link rel="canonical" href="https://calclogic.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CalcLogic — Free Online Calculators for Finance, Health & Math" />
        <meta property="og:description" content="20+ free online calculators for finance, health, math and more. Instant results, no signup." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="CalcLogic — Free Online Calculators" />
        <meta name="twitter:description" content="20+ free calculators. Instant results, no signup required." />

        {/* WebSite Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CalcLogic",
            "url": "https://calclogic.com",
            "description": "Free online calculators for finance, health, math and everyday use. Over 20 free tools with instant results.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://calclogic.com/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }
          `}
        </script>

        {/* ItemList Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Free Online Calculators",
            "description": "CalcLogic's complete suite of free online calculators for finance, health, math and more.",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Mortgage Calculator", "url": "https://calclogic.com/mortgage-calculator" },
              { "@type": "ListItem", "position": 2, "name": "BMI Calculator", "url": "https://calclogic.com/bmi-calculator" },
              { "@type": "ListItem", "position": 3, "name": "Calorie Calculator", "url": "https://calclogic.com/calorie-calculator" },
              { "@type": "ListItem", "position": 4, "name": "Auto Loan Calculator", "url": "https://calclogic.com/auto-loan-calculator" },
              { "@type": "ListItem", "position": 5, "name": "Percentage Calculator", "url": "https://calclogic.com/percentage-calculator" },
              { "@type": "ListItem", "position": 6, "name": "Scientific Calculator", "url": "https://calclogic.com/scientific-calculator" },
              { "@type": "ListItem", "position": 7, "name": "GPA Calculator", "url": "https://calclogic.com/gpa-calculator" },
              { "@type": "ListItem", "position": 8, "name": "Grade Calculator", "url": "https://calclogic.com/grade-calculator" },
              { "@type": "ListItem", "position": 9, "name": "Compound Interest Calculator", "url": "https://calclogic.com/compound-interest-calculator" },
              { "@type": "ListItem", "position": 10, "name": "Age Calculator", "url": "https://calclogic.com/age-calculator" }
            ]
          }
          `}
        </script>
      </Helmet>

      <section className="hero">
        <div className="hero-content">
          <HeroCalculator />
          <div className="hero-text">
            <h2>Free Online Calculators</h2>
            
            {/* Hero Supporting Text */}
            <p className="hero-sub">Over 20 free online calculators for finance, health, math and everyday decisions. From mortgage payments to BMI, calorie counting to GPA — get instant, accurate results with no signup, no ads, and no cost. Ever.</p>
            
            {/* Trust Bar */}
            <div className="trust-bar">
              <div className="trust-pill"><span className="check">✓</span> 100% Free</div>
              <div className="trust-pill"><span className="check">✓</span> Instant Results</div>
              <div className="trust-pill"><span className="check">✓</span> No Signup Required</div>
              <div className="trust-pill"><span className="check">✓</span> Mobile Friendly</div>
              <div className="trust-pill"><span className="check">✓</span> No Data Stored</div>
            </div>
            
            <form className="search-form">
              <input type="search" placeholder="Search calculators..." />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Overview */}
      <section className="calculator-container">
        <div className="cat-desc-grid">
          <div className="cat-desc-card">
            <div className="cat-icon">💰</div>
            <h4>Financial Calculators</h4>
            <p>Plan your financial future with free mortgage calculators, auto loan calculators, compound interest tools, investment projections, and more. Make informed money decisions in minutes.</p>
          </div>
          <div className="cat-desc-card">
            <div className="cat-icon">💪</div>
            <h4>Health & Fitness Calculators</h4>
            <p>Track your health goals with our free BMI calculator, calorie calculator, TDEE, body fat percentage, and ideal weight tools — all based on medically verified formulas.</p>
          </div>
          <div className="cat-desc-card">
            <div className="cat-icon">📐</div>
            <h4>Math Calculators</h4>
            <p>From our free scientific calculator and fraction calculator to percentage, algebra, and statistics tools — we cover every math calculation students and professionals need.</p>
          </div>
          <div className="cat-desc-card">
            <div className="cat-icon">🔧</div>
            <h4>Other Calculators</h4>
            <p>Age calculators, GPA calculators, grade calculators, tip calculators, unit converters and more — the everyday calculation tools that don't fit a single category but are just as essential.</p>
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

      {/* Most Popular Calculators */}
      <section className="calculator-container">
        <div className="calculator-header">
          <h2>Most Popular Calculators</h2>
          <p className="calculator-description">Quick access to our highest-traffic tools - trusted by millions of users worldwide</p>
        </div>
        
        <div className="popular-grid">
          <a href="/bmi-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">9.1M searches/mo</div>
              <h4>BMI Calculator</h4>
              <p>Body Mass Index — metric & imperial</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/mortgage-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">4.4M searches/mo</div>
              <h4>Mortgage Calculator</h4>
              <p>Monthly payment + amortization</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/percentage-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">4.1M searches/mo</div>
              <h4>Percentage Calculator</h4>
              <p>3 tools: X% of Y, change, difference</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/scientific-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">3.7M searches/mo</div>
              <h4>Scientific Calculator</h4>
              <p>Trig, logs, exponents & more</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/calorie-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">2.4M searches/mo</div>
              <h4>Calorie Calculator</h4>
              <p>TDEE, deficit & macros</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/age-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">5.5M searches/mo</div>
              <h4>Age Calculator</h4>
              <p>Exact age in years, days & hours</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/auto-loan-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">1.8M searches/mo</div>
              <h4>Auto Loan Calculator</h4>
              <p>Monthly car payment estimator</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
          <a href="/gpa-calculator" className="popular-item">
            <div className="popular-item-left">
              <div className="vol-tag">1.4M searches/mo</div>
              <h4>GPA Calculator</h4>
              <p>Semester & cumulative GPA</p>
            </div>
            <div className="popular-item-arrow">→</div>
          </a>
        </div>
      </section>

      {/* People Also Ask */}
      <section className="calculator-container">
        <div className="calculator-header">
          <h2>People Also Ask</h2>
          <p className="calculator-description">Common questions about our most popular calculators</p>
        </div>
        
        <div className="faq-row">
          <a href="/bmi-calculator" className="faq-chip">What is a healthy BMI?</a>
          <a href="/mortgage-calculator" className="faq-chip">How is a mortgage payment calculated?</a>
          <a href="/calorie-calculator" className="faq-chip">How many calories should I eat?</a>
          <a href="/percentage-calculator" className="faq-chip">How do I calculate a percentage?</a>
          <a href="/gpa-calculator" className="faq-chip">What is a good GPA?</a>
          <a href="/compound-interest-calculator" className="faq-chip">How does compound interest work?</a>
          <a href="/age-calculator" className="faq-chip">How old am I exactly?</a>
          <a href="/body-fat-calculator" className="faq-chip">What is a healthy body fat %?</a>
        </div>
      </section>

      {/* Why CalcLogic */}
      <section className="calculator-container">
        <div className="calculator-header">
          <h2>Why CalcLogic?</h2>
          <p className="calculator-description">Built for accuracy, privacy, and ease of use</p>
        </div>
        
        <div className="why-grid">
          <div className="why-item">
            <div className="why-icon">🎯</div>
            <div>
              <h4>Verified Accuracy</h4>
              <p>Every formula sourced from WHO, NIH, and standard financial mathematics. Results you can trust.</p>
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">⚡</div>
            <div>
              <h4>Instant Results</h4>
              <p>No page reloads. No waiting. Enter your numbers and get your answer immediately on any device.</p>
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">🔒</div>
            <div>
              <h4>Private & Secure</h4>
              <p>All calculations run in your browser. We never store, collect, or share your personal data.</p>
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">📱</div>
            <div>
              <h4>Works on Any Device</h4>
              <p>Mobile-first design. Every calculator works perfectly on phones, tablets, and desktops.</p>
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">📚</div>
            <div>
              <h4>Explained, Not Just Calculated</h4>
              <p>Every tool includes formulas, examples, and FAQs so you understand your results, not just see them.</p>
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">🆓</div>
            <div>
              <h4>Always Free</h4>
              <p>No freemium. No paywalls. No hidden costs. Every calculator on CalcLogic is 100% free, forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="calculator-container">
        <div className="footer-cta">
          <h3>Ready to start calculating?</h3>
          <p>Free, instant, no signup — over 20 tools across finance, health, math and more</p>
          <a href="/financial" className="cta-btn">Financial Tools</a>
          <a href="/health" className="cta-btn">Health Tools</a>
          <a href="/math" className="cta-btn">Math Tools</a>
          <a href="/other" className="cta-btn">Other Tools</a>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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
