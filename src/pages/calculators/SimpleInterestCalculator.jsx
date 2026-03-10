import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ShareButtons from '../../components/ShareButtons'

const SimpleInterestCalculator = () => {
  const [formData, setFormData] = useState({
    principal: '1000',
    rate: '5',
    time: '2',
    timeUnit: 'years'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateSimpleInterest = (e) => {
    e.preventDefault()
    
    const principal = parseFloat(formData.principal)
    const rate = parseFloat(formData.rate)
    const time = parseFloat(formData.time)
    const timeUnit = formData.timeUnit

    if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal < 0 || rate < 0 || time < 0) {
      return
    }

    // Convert rate percentage to decimal
    const rateDecimal = rate / 100

    // Convert time to years
    let timeInYears
    switch (timeUnit) {
      case 'months':
        timeInYears = time / 12
        break
      case 'days':
        timeInYears = time / 365
        break
      case 'years':
      default:
        timeInYears = time
    }

    // Calculate Simple Interest: I = P * R * T
    const interest = principal * rateDecimal * timeInYears
    const totalAmount = principal + interest

    setResults({
      interest,
      totalAmount,
      principal
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
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Simple Interest Calculator — Formula, Examples & Comparison | CalcLogic</title>
        <meta name="description" content="Calculate simple interest instantly. Includes I=PRT formula, 3 worked examples, and a comparison with compound interest." />
        <link rel="canonical" href="https://calclogic.com/simple-interest-calculator" />
        
        <meta property="og:title" content="Simple Interest Calculator — Formula, Examples & Comparison | CalcLogic" />
        <meta property="og:description" content="Free simple interest calculator. Learn SI formula, see worked examples, and understand when simple vs compound interest applies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/simple-interest-calculator" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Simple Interest Calculator — Free & Easy to Use | CalcLogic" />
        <meta name="twitter:description" content="Calculate simple interest instantly with our free calculator. Includes formula, examples, and comparison with compound interest." />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is simple interest formula?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The simple interest formula is I = P × R × T, where I = interest, P = principal, R = annual rate as a decimal, and T = time in years. Total amount: A = P + I."
                }
              },
              {
                "@type": "Question",
                "name": "What is difference between simple and compound interest?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simple interest is calculated only on original principal. Compound interest is calculated on principal plus all previously earned interest, causing exponential growth over time."
                }
              },
              {
                "@type": "Question",
                "name": "Where is simple interest used in real life?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simple interest is used for auto loans, short-term personal loans, some bonds, and Treasury bills. Most long-term savings accounts and mortgages use compound interest instead."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate simple interest for months?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Convert months to years by dividing by 12. For 6 months, T = 0.5. Example: $1,000 at 8% for 6 months = 1000 × 0.08 × 0.5 = $40 interest."
                }
              },
              {
                "@type": "Question",
                "name": "Is simple interest better than compound interest for borrowers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. As a borrower, simple interest costs less because interest never accumulates on previously owed interest. For investors and lenders, compound interest is better."
                }
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Simple Interest Calculator</h1>
          <p className="calculator-description">
            Calculate simple interest earned or paid on a principal amount over a period of time.
          </p>
        </div>

        <form onSubmit={calculateSimpleInterest} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="principal">Principal Amount</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="principal"
                name="principal"
                value={formData.principal}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 1000"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="rate">Annual Interest Rate</label>
            <div className="input-field">
              <input
                type="number"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                step="0.01"
                placeholder="e.g., 5"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="time">Time Period</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-field" style={{ flex: 2 }}>
                <input
                  type="number"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  step="1"
                  placeholder="e.g., 2"
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <select
                  name="timeUnit"
                  value={formData.timeUnit}
                  onChange={handleInputChange}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Interest</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Simple Interest Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Total Simple Interest</span>
              <span className="result-value">{formatCurrency(results.interest)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Principal + Interest</span>
              <span className="result-value">{formatCurrency(results.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>The Formula (I = PRT)</h3>
          <p>Simple Interest (I) = Principal (P) × Rate (R) × Time (T).</p>
          <ul>
            <li><strong>P:</strong> The initial amount of money (loan or investment).</li>
            <li><strong>R:</strong> The annual interest rate (expressed as a decimal).</li>
            <li><strong>T:</strong> The time period the money is borrowed or invested for (in years).</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>How It's Used</h3>
          <p>Simple interest is often used for short-term loans, like auto loans or certain personal loans. It's straightforward to calculate but typically yields lower returns on investments compared to compound interest over longer periods.</p>
        </div>
        <div className="info-card">
          <h3>Simple vs. Compound Interest</h3>
          <p>The key difference is that compound interest calculates interest on the principal plus any accumulated interest from previous periods (interest on interest). Simple interest is always calculated only on the original principal.</p>
        </div>
      </div>
      
      <div className="content-section">
        <h2>The Simple Interest Formula</h2>
        <p>Simple interest is the most straightforward method of calculating interest — it is computed solely on the original principal amount, never on accumulated interest. It is defined by a single equation:</p>

        <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.9' }}>
          <strong>I = P × R × T</strong><br /><br />
          Where:<br />
          I = Interest earned or owed<br />
          P = Principal (the original amount borrowed or invested)<br />
          R = Annual interest rate (as a decimal — e.g., 5% = 0.05)<br />
          T = Time in years<br /><br />
          <strong>Total Amount: A = P + I</strong>
        </div>

        <h3>Worked Example 1: Short-Term Personal Loan</h3>
        <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.9' }}>
          You borrow $5,000 at 6% per year for 3 years.<br /><br />
          I = 5000 × 0.06 × 3 = <strong>$900</strong><br />
          Total repayment = $5,000 + $900 = <strong>$5,900</strong>
        </div>

        <h3>Worked Example 2: Calculating for Months</h3>
        <p>When time is given in months, divide by 12 to convert to years before applying the formula.</p>
        <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.9' }}>
          You invest $2,000 at 4% annual interest for 9 months.<br /><br />
          T = 9 ÷ 12 = 0.75 years<br />
          I = 2000 × 0.04 × 0.75 = <strong>$60</strong><br />
          Total = $2,000 + $60 = <strong>$2,060</strong>
        </div>

        <h3>Worked Example 3: Finding the Rate</h3>
        <p>The formula can be rearranged to find any missing variable. To find the interest rate:</p>
        <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '0.95rem', lineHeight: '1.9' }}>
          R = I ÷ (P × T)<br /><br />
          You earned $400 interest on a $4,000 investment over 2 years.<br />
          R = 400 ÷ (4000 × 2) = 400 ÷ 8000 = 0.05 = <strong>5% per year</strong>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

        <h2>Simple Interest vs. Compound Interest: Key Differences</h2>
        <p>Understanding this distinction is critical for making smart borrowing and saving decisions.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
          <thead>
            <tr><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Feature</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Simple Interest</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Compound Interest</th></tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Calculated on</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Principal only</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Principal + accumulated interest</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Growth over time</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Linear</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Exponential</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Better for borrowers?</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>✅ Yes — costs less</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>❌ No — costs more over time</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Better for investors?</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>❌ No — earns less</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>✅ Yes — earns more over time</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Common applications</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Car loans, short-term personal loans, some bonds</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Savings accounts, mortgages, credit cards, investments</td></tr>
          </tbody>
        </table>

        <h3>Side-by-Side Comparison: $10,000 at 5% Over 10 Years</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
          <thead>
            <tr><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Year</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Simple Interest Balance</th><th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Compound Interest Balance (Annual)</th></tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$10,500</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$10,500</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>2</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$11,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$11,025</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>5</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$12,500</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$12,763</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>10</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$15,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$16,289</td></tr>
            <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>20</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$20,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$26,533</td></tr>
          </tbody>
        </table>
        <p>The difference becomes dramatic over longer time periods — a key reason financial advisors emphasize starting to invest early. Use CalcLogic's <a href="/compound-interest-calculator" style={{ color: '#3b82f6', textDecoration: 'none' }}>Compound Interest Calculator</a> to model long-term investment growth.</p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

        <h2>Where Simple Interest Is Used in Real Life</h2>

        <h3>Auto Loans</h3>
        <p>Most car loans in the United States use simple interest. Interest accrues daily on the outstanding balance, which means making extra payments directly reduces the principal and saves money on interest. Unlike compound interest loans, there's no "interest on interest" penalty for carrying a balance.</p>

        <h3>Short-Term Personal Loans and Payday Alternatives</h3>
        <p>Credit unions and some community banks offer short-term personal loans using simple interest. Understanding the SI formula helps you compare the true cost of borrowing before signing an agreement.</p>

        <h3>Bonds and Treasury Bills</h3>
        <p>Many government and corporate bonds pay simple interest (called a coupon) on the face value. A $10,000 Treasury note at 4% pays $400/year in interest until maturity — a straightforward simple interest calculation.</p>

        <h3>Classroom and Exam Problems</h3>
        <p>Simple interest is a foundational concept in high school math, business studies, and banking exams. The formula I = PRT appears frequently in standardized tests like the SAT, GRE, and professional finance certifications.</p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.2rem 1.4rem', margin: '2rem 0' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: '#15803d', fontSize: '0.95rem' }}>🔗 Related CalcLogic Calculators</h3>
          <a href="/compound-interest-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Compound Interest Calculator</a>
          <a href="/loan-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Loan Calculator</a>
          <a href="/mortgage-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Mortgage Calculator</a>
          <a href="/investment-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Investment Calculator</a>
          <a href="/percentage-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Percentage Calculator</a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

        <h2>Frequently Asked Questions</h2>

        <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
          <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What is the formula for simple interest?</h3>
          <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The simple interest formula is <strong>I = P × R × T</strong>, where I = interest, P = principal, R = annual rate (as a decimal), and T = time in years. To find the total amount repaid or accumulated: <strong>A = P + I</strong>.</p>
        </div>

        <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
          <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How do I calculate simple interest on a loan?</h3>
          <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Multiply the loan amount (P) by the annual interest rate as a decimal (R) and the number of years (T). For a $3,000 loan at 7% for 2 years: I = 3000 × 0.07 × 2 = <strong>$420</strong>. Total repayment = $3,000 + $420 = $3,420.</p>
        </div>

        <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
          <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Does simple interest change each year?</h3>
          <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>No — with simple interest, the interest amount stays the same each year because it is always calculated on the original principal, not the growing balance. This is what makes it "simple." With compound interest, the annual interest amount grows each year.</p>
        </div>

        <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
          <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How do I find the principal if I know the interest?</h3>
          <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Rearrange the formula: <strong>P = I ÷ (R × T)</strong>. For example, if you earned $150 in interest at 5% per year over 2 years: P = 150 ÷ (0.05 × 2) = 150 ÷ 0.1 = <strong>$1,500</strong>.</p>
        </div>

        <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
          <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What is simple interest on $1,000 at 10% for 2 years?</h3>
          <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>I = 1000 × 0.10 × 2 = <strong>$200</strong>. The total amount after 2 years = $1,000 + $200 = <strong>$1,200</strong>.</p>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#6b7280', fontStyle: 'italic', marginTop: '2rem' }}>
          This calculator is for educational and general informational purposes. For official loan terms, consult your lender's disclosure documents or a qualified financial advisor.
        </p>
n      </div>
        <ShareButtons 
          title="Simple Interest Calculator"
          description="Calculate simple interest earned or paid on a principal amount over time"
          customMessage="Calculate simple interest with this easy-to-use calculator!"
        />
      </div>
    </div>
  )}

export default SimpleInterestCalculator