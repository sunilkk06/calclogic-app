import React from 'react'
import { Helmet } from 'react-helmet-async'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About CalcLogic — Free Online Calculators You Can Trust | CalcLogic</title>
        <meta name="description" content="CalcLogic provides free, accurate online calculators for finance, health, math and more. Learn about our mission, our commitment to accuracy, and why millions trust our free tools." />
        <link rel="canonical" href="https://calclogic.com/about" />
        
        {/* Open Graph */}
        <meta property="og:title" content="About CalcLogic — Free Online Calculators You Can Trust" />
        <meta property="og:description" content="Learn about CalcLogic — our mission to make calculations free, accurate and accessible to everyone. Finance, health, math and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/about" />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CalcLogic",
            "url": "https://calclogic.com",
            "description": "CalcLogic provides free, accurate online calculators for finance, health, math, and everyday use. Our tools are built for accuracy, accessibility, and user privacy.",
            "foundingDate": "2024",
            "areaServed": "Worldwide",
            "serviceType": "Free Online Calculators",
            "knowsAbout": [
              "Financial Calculators",
              "Health and Fitness Calculators",
              "Math Calculators",
              "BMI Calculator",
              "Mortgage Calculator",
              "Calorie Calculator",
              "GPA Calculator",
              "Percentage Calculator"
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Free Online Calculators",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "BMI Calculator" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mortgage Calculator" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Calorie Calculator" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Scientific Calculator" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Percentage Calculator" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GPA Calculator" } }
              ]
            }
          }
          `}
        </script>

        {/* WebSite Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "CalcLogic",
            "url": "https://calclogic.com",
            "description": "Free online calculators for finance, health, math and everyday calculations.",
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
      </Helmet>

      <div className="calculator-container">
        {/* HERO SECTION */}
        <div className="about-hero">
          <h1>Free Calculators Built for Real Life</h1>
          <p>CalcLogic gives everyone access to accurate, free online calculators — no signup, no ads, no catches. From mortgage payments to BMI, we make math simple so you can make better decisions.</p>
        </div>

        {/* STAT BAR */}
        <div className="stat-bar">
          <div className="stat-item">
            <div className="stat-number">20+</div>
            <div className="stat-label">Free calculators available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4</div>
            <div className="stat-label">Categories: Finance, Health, Math & More</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free — no signup ever required</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">0</div>
            <div className="stat-label">Personal data stored or shared</div>
          </div>
        </div>

        {/* OUR MISSION */}
        <div className="section">
          <h2>Our Mission</h2>
          <p>At CalcLogic, we believe that access to accurate financial, health, and mathematical tools shouldn't depend on expensive software, a paid subscription, or a finance degree. Whether you're a student trying to figure out what grade you need on your final exam, a first-time homebuyer calculating mortgage payments, or someone simply trying to understand their BMI — you deserve a clear, instant, reliable answer.</p>
          <p>Our mission is to be the most accurate, most accessible, and most trusted free calculator platform on the internet. Every tool we build is tested for mathematical precision, designed for ease of use on any device, and kept completely free — always.</p>
          <p>We cover the calculations that matter most in everyday life: <strong>financial planning</strong> (mortgages, loans, investments, interest), <strong>health and fitness</strong> (BMI, calories, body fat, ideal weight), <strong>mathematics</strong> (percentages, fractions, algebra, statistics), and <strong>everyday utilities</strong> (age, GPA, grades, unit conversion). No topic is too complex for us to simplify.</p>
        </div>

        {/* OUR VALUES */}
        <div className="section">
          <h2>Our Values</h2>
          <p>Five principles guide every decision we make — from how we build our calculators to how we protect your data.</p>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✅</div>
              <h3>Accuracy</h3>
              <p>Every calculator uses verified formulas from authoritative sources — WHO guidelines, financial standards, and academic research. We test extensively so you can trust the results.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Accessibility</h3>
              <p>Our tools work on any device — phone, tablet, or desktop — with no app to download and no account to create. Calculations should be available to everyone, everywhere.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Privacy</h3>
              <p>All calculations happen instantly in your browser. We never store, sell, or share your personal data. What you calculate stays with you — always.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Speed</h3>
              <p>Results are instant. No waiting for page loads, no spinning wheels. Enter your numbers and get your answer immediately — because your time matters.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">📚</div>
              <h3>Education</h3>
              <p>We don't just give you a number — we help you understand it. Every calculator page includes explanations, formulas, real-world examples, and expert FAQs.</p>
            </div>
          </div>
        </div>

        {/* WHAT SETS US APART */}
        <div className="section">
          <h2>What Sets CalcLogic Apart</h2>
          <p>There are hundreds of calculator websites. Here's why CalcLogic is different.</p>
          <ul className="apart-list">
            <li>
              <div className="apart-icon">🎯</div>
              <div className="apart-content">
                <h4>Comprehensive Suite of Tools</h4>
                <p>From mortgage amortization schedules to TDEE calculations to weighted GPA — we cover the calculations people actually need, not just the obvious ones. Over 20 free tools and growing every month.</p>
              </div>
            </li>
            <li>
              <div className="apart-icon">⚡</div>
              <div className="apart-content">
                <h4>Real-Time, Instant Results</h4>
                <p>Every calculator delivers results the moment you enter your numbers. No form submissions, no page reloads — just instant answers on any device, anywhere in the world.</p>
              </div>
            </li>
            <li>
              <div className="apart-icon">📖</div>
              <div className="apart-content">
                <h4>Educational Content That Explains the Math</h4>
                <p>Unlike tools that just give you a number, CalcLogic explains the formula behind every result, provides worked examples, and answers the questions people actually ask. Our blog covers everything from how compound interest works to what your BMI really means.</p>
              </div>
            </li>
            <li>
              <div className="apart-icon">🔄</div>
              <div className="apart-content">
                <h4>Continuously Updated and Verified</h4>
                <p>Financial regulations change. Health guidelines are updated. Mathematical standards evolve. We regularly review and update every calculator to reflect the latest authoritative standards — so you're never working with outdated information.</p>
              </div>
            </li>
            <li>
              <div className="apart-icon">📱</div>
              <div className="apart-content">
                <h4>Built Mobile-First</h4>
                <p>Over half of all calculator searches happen on phones. Every CalcLogic tool is designed for mobile first — large inputs, readable results, and smooth performance on any screen size.</p>
              </div>
            </li>
            <li>
              <div className="apart-icon">🆓</div>
              <div className="apart-content">
                <h4>Completely Free — No Catches</h4>
                <p>No freemium. No paywalls. No "premium" features. Every single calculator on CalcLogic is 100% free, for every user, forever. We believe access to accurate information is a right, not a product.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* OUR CALCULATORS */}
        <div className="section">
          <h2>Our Calculator Categories</h2>
          <p>We organize our tools into four categories to help you find exactly what you need quickly. Every calculator is free, instant, and requires no account.</p>
          <div className="cat-grid">
            <div className="cat-card">
              <h4>💰 Financial</h4>
              <ul>
                <li><a href="/mortgage-calculator">Mortgage Calculator</a></li>
                <li><a href="/auto-loan-calculator">Auto Loan Calculator</a></li>
                <li><a href="/compound-interest-calculator">Compound Interest</a></li>
                <li><a href="/investment-calculator">Investment Calculator</a></li>
                <li><a href="/roi-calculator">ROI Calculator</a></li>
                <li><a href="/salary-calculator">Salary Calculator</a></li>
              </ul>
            </div>
            <div className="cat-card">
              <h4>💪 Health & Fitness</h4>
              <ul>
                <li><a href="/bmi-calculator">BMI Calculator</a></li>
                <li><a href="/calorie-calculator">Calorie Calculator</a></li>
                <li><a href="/body-fat-calculator">Body Fat Calculator</a></li>
                <li><a href="/tdee-calculator">TDEE Calculator</a></li>
                <li><a href="/ideal-weight-calculator">Ideal Weight</a></li>
                <li><a href="/pregnancy-calculator">Pregnancy Calculator</a></li>
              </ul>
            </div>
            <div className="cat-card">
              <h4>📐 Math</h4>
              <ul>
                <li><a href="/scientific-calculator">Scientific Calculator</a></li>
                <li><a href="/percentage-calculator">Percentage Calculator</a></li>
                <li><a href="/fraction-calculator">Fraction Calculator</a></li>
                <li><a href="/algebra-calculator">Algebra Calculator</a></li>
                <li><a href="/triangle-calculator">Triangle Calculator</a></li>
                <li><a href="/standard-deviation-calculator">Standard Deviation</a></li>
              </ul>
            </div>
            <div className="cat-card">
              <h4>🔧 Other</h4>
              <ul>
                <li><a href="/age-calculator">Age Calculator</a></li>
                <li><a href="/gpa-calculator">GPA Calculator</a></li>
                <li><a href="/grade-calculator">Grade Calculator</a></li>
                <li><a href="/tip-calculator">Tip Calculator</a></li>
                <li><a href="/unit-converter">Unit Converter</a></li>
                <li><a href="/date-calculator">Date Calculator</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* TRUST SIGNALS */}
        <div className="section">
          <h2>Why You Can Trust CalcLogic</h2>
          <p>Trust is earned through consistency, transparency, and accuracy. Here's how we earn yours.</p>
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-check">✓</div>
              <div>
                <h4>Verified Formulas</h4>
                <p>Every formula is sourced from authoritative references — WHO, NIH, standard financial mathematics, and peer-reviewed research.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-check">✓</div>
              <div>
                <h4>No Data Collection</h4>
                <p>We don't collect, store, or sell your calculation data. Your numbers never leave your device.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-check">✓</div>
              <div>
                <h4>No Ads Influencing Results</h4>
                <p>Our calculators are independent tools. No advertiser can influence how our results are calculated or presented.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-check">✓</div>
              <div>
                <h4>Transparent Methodology</h4>
                <p>Every calculator page shows the formula used, worked examples, and explanations so you can verify results yourself.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-check">✓</div>
              <div>
                <h4>Regularly Updated</h4>
                <p>We review all calculators regularly to ensure formulas, thresholds, and guidelines reflect current standards.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-check">✓</div>
              <div>
                <h4>Medical & Financial Disclaimers</h4>
                <p>We clearly label health and financial tools as informational aids, not professional advice — because your decisions deserve full context.</p>
              </div>
            </div>
          </div>
        </div>

        {/* OUR COMMITMENT */}
        <div className="section">
          <h2>Our Commitment to You</h2>
          <div className="commitment-highlight">
            <p>CalcLogic exists because we believe that making an informed decision — whether it's about your mortgage, your health, your savings, or your education — should never require expensive software or professional consultations for the basics.</p>
            <p>We are committed to <strong>keeping every tool free</strong>, <strong>expanding our calculator library</strong> based on what people actually search for, <strong>improving accuracy</strong> through regular formula reviews, and <strong>educating our users</strong> through blog content that explains not just the numbers, but what they mean in real life.</p>
            <p>If you ever find an error in one of our calculators, or want to suggest a tool we should add, we genuinely want to hear from you. Every improvement we make serves millions of people making real decisions with real consequences — and that responsibility drives everything we do.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h3>Ready to start calculating?</h3>
          <p>Free, instant, no signup — over 20 tools across finance, health, math and more</p>
          <a className="cta-btn" href="/financial">Financial Tools</a>
          <a className="cta-btn" href="/health">Health Tools</a>
          <a className="cta-btn" href="/math">Math Tools</a>
          <a className="cta-btn cta-btn-outline" href="/blog">Read Our Blog</a>
        </div>
      </div>
    </>
  )
}

export default About
