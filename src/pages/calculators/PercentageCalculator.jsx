import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const PercentageCalculator = () => {
  const [percentOfNumber, setPercentOfNumber] = useState({ percent: '', number: '', result: null })
  const [whatPercent, setWhatPercent] = useState({ part: '', total: '', result: null })
  const [percentChange, setPercentChange] = useState({ initial: '', final: '', result: null })

  const calculatePercentOfNumber = (e) => {
    e.preventDefault()
    const percent = parseFloat(percentOfNumber.percent)
    const number = parseFloat(percentOfNumber.number)
    
    if (!isNaN(percent) && !isNaN(number)) {
      const result = (percent / 100) * number
      setPercentOfNumber(prev => ({ ...prev, result: result.toLocaleString() }))
    }
  }

  const calculateWhatPercent = (e) => {
    e.preventDefault()
    const part = parseFloat(whatPercent.part)
    const total = parseFloat(whatPercent.total)
    
    if (!isNaN(part) && !isNaN(total) && total !== 0) {
      const result = (part / total) * 100
      setWhatPercent(prev => ({ ...prev, result: result.toFixed(2) }))
    }
  }

  const calculatePercentChange = (e) => {
    e.preventDefault()
    const initial = parseFloat(percentChange.initial)
    const final = parseFloat(percentChange.final)
    
    if (!isNaN(initial) && !isNaN(final) && initial !== 0) {
      const result = ((final - initial) / initial) * 100
      const type = result >= 0 ? 'Increase' : 'Decrease'
      setPercentChange(prev => ({ ...prev, result: { value: Math.abs(result).toFixed(2), type } }))
    }
  }

  return (
    <>
      <Helmet>
        <title>Percentage Calculator — 3 Free Tools: Find %, Percentage Change & More | CalcLogic</title>
        <meta name="description" content="Free percentage calculator with 3 tools: find what % of a number is, calculate what percentage one number is of another, and calculate percentage increase or decrease. Instant results." />
        <meta name="keywords" content="percentage calculator, percent calculator, percentage change calculator, percentage increase calculator, percentage decrease calculator, what is 20% of 150, how to calculate percentage, percentage difference, percent of a number" />
        <link rel="canonical" href="https://calclogic.com/percentage-calculator" />
        <meta property="og:title" content="Percentage Calculator — 3 Free Tools | CalcLogic" />
        <meta property="og:description" content="Calculate percentages instantly: find X% of Y, what percentage one number is of another, and percentage change. Free, no signup." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/percentage-calculator" />

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I calculate a percentage of a number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To find X% of a number Y, multiply Y by X and divide by 100. Formula: Result = (X ÷ 100) × Y. Example: 20% of 150 = (20 ÷ 100) × 150 = 0.20 × 150 = 30."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate what percentage one number is of another?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To find what percentage X is of Y, divide X by Y and multiply by 100. Formula: Percentage = (X ÷ Y) × 100. Example: 30 is what percent of 150? (30 ÷ 150) × 100 = 20%."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate percentage increase?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Percentage increase = ((New Value − Original Value) ÷ Original Value) × 100. Example: Price goes from $80 to $100. Increase = ((100 − 80) ÷ 80) × 100 = (20 ÷ 80) × 100 = 25% increase."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate percentage decrease?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Percentage decrease = ((Original Value − New Value) ÷ Original Value) × 100. Example: Price drops from $200 to $150. Decrease = ((200 − 150) ÷ 200) × 100 = (50 ÷ 200) × 100 = 25% decrease."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between percentage change and percentage difference?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Percentage change measures how much a value has increased or decreased from an original value — it has a direction (up or down). Percentage difference measures how different two values are from each other without implying one came before the other — it has no direction. Use percentage change when comparing old vs new; use percentage difference when comparing two equal values side by side."
                }
              },
              {
                "@type": "Question",
                "name": "How do I add or subtract a percentage from a number?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To add X% to a number: multiply the number by (1 + X/100). Example: Add 15% to $200 = 200 × 1.15 = $230. To subtract X%: multiply by (1 − X/100). Example: Subtract 20% from $500 = 500 × 0.80 = $400."
                }
              },
              {
                "@type": "Question",
                "name": "What is 1% of 1000?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "1% of 1000 is 10. To find 1% of any number, simply divide it by 100. So 1% of 1000 = 1000 ÷ 100 = 10."
                }
              },
              {
                "@type": "Question",
                "name": "How do I calculate tip percentage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To calculate a tip, multiply your bill total by the tip percentage as a decimal. For a 20% tip on a $85 bill: 85 × 0.20 = $17 tip, making the total $102. For a 15% tip: 85 × 0.15 = $12.75."
                }
              }
            ]
          }`}
        </script>

        {/* HowTo Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate a Percentage",
            "description": "Step-by-step guide to calculating three types of percentage problems.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Find X% of a number",
                "text": "Multiply the number by the percentage divided by 100. Example: 25% of 80 = (25 ÷ 100) × 80 = 20."
              },
              {
                "@type": "HowToStep",
                "name": "Find what % one number is of another",
                "text": "Divide the first number by the second, then multiply by 100. Example: 20 is what % of 80? (20 ÷ 80) × 100 = 25%."
              },
              {
                "@type": "HowToStep",
                "name": "Calculate percentage change",
                "text": "Subtract the original from the new value, divide by the original, and multiply by 100. A positive result is an increase; negative is a decrease."
              }
            ]
          }`}
        </script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Percentage Calculator</h1>
          <p className="calculator-description">
            Calculate various percentage problems easily with our suite of percentage calculators.
          </p>
        </div>

      {/* What is X% of Y? */}
      <div className="calculator-form">
        <div className="input-section">
          <h2>1. Calculate Percentage of a Number (What is X% of Y?)</h2>
          <form onSubmit={calculatePercentOfNumber}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
              <div className="input-group">
                <label>What is</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={percentOfNumber.percent}
                    onChange={(e) => setPercentOfNumber(prev => ({ ...prev, percent: e.target.value, result: null }))}
                    placeholder="e.g., 20"
                    step="any"
                  />
                  <span className="percentage-symbol">%</span>
                </div>
              </div>
              <div className="input-group">
                <label>of</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={percentOfNumber.number}
                    onChange={(e) => setPercentOfNumber(prev => ({ ...prev, number: e.target.value, result: null }))}
                    placeholder="e.g., 150"
                    step="any"
                  />
                </div>
              </div>
              <button type="submit" className="calculate-btn" style={{ margin: 0, width: 'auto', padding: '0.75rem 1.5rem' }}>
                Calculate
              </button>
            </div>
          </form>
          {percentOfNumber.result && (
            <div className="result-item" style={{ marginTop: '1rem' }}>
              <span className="result-label">Result:</span>
              <span className="result-value">{percentOfNumber.result}</span>
            </div>
          )}
        </div>
      </div>

      {/* X is what % of Y? */}
      <div className="calculator-form">
        <div className="input-section">
          <h2>2. Find What Percentage One Number is of Another (X is what % of Y?)</h2>
          <form onSubmit={calculateWhatPercent}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
              <div className="input-group">
                <label>X is</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={whatPercent.part}
                    onChange={(e) => setWhatPercent(prev => ({ ...prev, part: e.target.value, result: null }))}
                    placeholder="e.g., 30"
                    step="any"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>of Y</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={whatPercent.total}
                    onChange={(e) => setWhatPercent(prev => ({ ...prev, total: e.target.value, result: null }))}
                    placeholder="e.g., 150"
                    step="any"
                  />
                </div>
              </div>
              <button type="submit" className="calculate-btn" style={{ margin: 0, width: 'auto', padding: '0.75rem 1.5rem' }}>
                Calculate %
              </button>
            </div>
          </form>
          {whatPercent.result && (
            <div className="result-item" style={{ marginTop: '1rem' }}>
              <span className="result-label">Result:</span>
              <span className="result-value">{whatPercent.result}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Percentage Change */}
      <div className="calculator-form">
        <div className="input-section">
          <h2>3. Calculate Percentage Change (Increase/Decrease)</h2>
          <form onSubmit={calculatePercentChange}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
              <div className="input-group">
                <label>Initial Value (V1)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={percentChange.initial}
                    onChange={(e) => setPercentChange(prev => ({ ...prev, initial: e.target.value, result: null }))}
                    placeholder="e.g., 100"
                    step="any"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>New Value (V2)</label>
                <div className="input-field">
                  <input
                    type="number"
                    value={percentChange.final}
                    onChange={(e) => setPercentChange(prev => ({ ...prev, final: e.target.value, result: null }))}
                    placeholder="e.g., 125"
                    step="any"
                  />
                </div>
              </div>
              <button type="submit" className="calculate-btn" style={{ margin: 0, width: 'auto', padding: '0.75rem 1.5rem' }}>
                Calculate Change
              </button>
            </div>
          </form>
          {percentChange.result && (
            <div className="result-item" style={{ marginTop: '1rem' }}>
              <span className="result-label">Result:</span>
              <span className="result-value">{percentChange.result.value + '%'} ({percentChange.result.type})</span>
            </div>
          )}
        </div>
      </div>

      <div className="label" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '3px', display: 'inline-block', marginBottom: '1rem', fontFamily: 'monospace' }}>
        📋 Page Content — Place below all 3 calculator widgets
      </div>

      <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2.8rem', marginBottom: '0.7rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
        The 3 Types of Percentage Calculations — Explained Simply
      </h2>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        Percentages come up constantly in daily life — discounts, test scores, tips, salary raises, tax rates, interest. Most people learned the basic formula in school and promptly forgot it. Here's a clear, practical breakdown of all three calculators on this page.
      </p>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Calculator 1 — What is X% of Y?
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        This is the most common percentage question. You have a percentage and a number, and you want to find the actual value that percentage represents.
      </p>
      <div style={{ background: '#1e1e2e', color: '#e2e8f0', fontFamily: '"Courier New", monospace', fontSize: '0.92rem', padding: '1.2rem 1.5rem', borderRadius: '8px', margin: '1.2rem 0', lineHeight: '1.9' }}>
        Result = (X ÷ 100) × Y<br />
        <span style={{ color: '#64748b', fontSize: '0.82rem' }}>Or simply: multiply Y by X as a decimal (e.g. 20% = 0.20)</span>
      </div>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem' }}>
        <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.4rem' }}>📘 Real-world examples</strong>
        What is 20% of $85 restaurant bill? → 0.20 × 85 = <strong>$17 tip</strong><br />
        What is 8.5% sales tax on a $299 purchase? → 0.085 × 299 = <strong>$25.42 tax</strong><br />
        What is 15% off a $120 jacket? → 0.15 × 120 = $18 off → <strong>$102 final price</strong><br />
        What is 35% of your 2,000 calorie daily target? → 0.35 × 2000 = <strong>700 calories from fat</strong>
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Calculator 2 — X is What % of Y?
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        You have two numbers and want to understand the relationship between them as a percentage. This tells you the proportion one value represents of another.
      </p>
      <div style={{ background: '#1e1e2e', color: '#e2e8f0', fontFamily: '"Courier New", monospace', fontSize: '0.92rem', padding: '1.2rem 1.5rem', borderRadius: '8px', margin: '1.2rem 0', lineHeight: '1.9' }}>
        Percentage = (X ÷ Y) × 100
      </div>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem' }}>
        <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.4rem' }}>📘 Real-world examples</strong>
        You scored 43 out of 50 on a test. What's your grade? → (43 ÷ 50) × 100 = <strong>86%</strong><br />
        Your company earned $340,000 against a $500,000 target. What % did you hit? → (340,000 ÷ 500,000) × 100 = <strong>68%</strong><br />
        You've saved $8,500 toward a $20,000 car. How far along are you? → (8,500 ÷ 20,000) × 100 = <strong>42.5%</strong>
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Calculator 3 — Percentage Change (Increase or Decrease)
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        This calculator compares two values over time — an original value and a new value — to tell you by what percentage things have gone up or down. A positive result means an increase; a negative result means a decrease.
      </p>
      <div style={{ background: '#1e1e2e', color: '#e2e8f0', fontFamily: '"Courier New", monospace', fontSize: '0.92rem', padding: '1.2rem 1.5rem', borderRadius: '8px', margin: '1.2rem 0', lineHeight: '1.9' }}>
        Percentage Change = ((New Value − Original Value) ÷ Original Value) × 100
      </div>
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem' }}>
        <strong style={{ color: '#92400e', display: 'block', marginBottom: '0.4rem' }}>📘 Real-world examples</strong>
        Your rent went from $1,200 to $1,380. How much did it increase? → ((1,380 − 1,200) ÷ 1,200) × 100 = <strong>+15% increase</strong><br />
        A stock dropped from $85 to $68. By how much? → ((68 − 85) ÷ 85) × 100 = <strong>−20% decrease</strong><br />
        Your website traffic grew from 4,200 to 6,300 visits. What's the growth rate? → ((6,300 − 4,200) ÷ 4,200) × 100 = <strong>+50% increase</strong>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

      <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2.8rem', marginBottom: '0.7rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
        Where You'll Actually Use These Calculations
      </h2>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        Percentages aren't just a math class concept — they appear constantly in the decisions that affect your money, career, and daily life.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🛍️</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Shopping & Discounts</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Calculate the actual price after a "30% off" sale, or compare two discounts to find the better deal.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>💰</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Salary & Pay Raises</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Find out how much more you'll take home after a 7% raise, or what % increase to ask for based on inflation.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🧾</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Tax Calculations</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Calculate sales tax, VAT, income tax brackets, or what percentage of your income goes to tax.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>📈</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Investments & Finance</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Track portfolio growth, calculate returns on investment, or compare rate changes over time.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🍽️</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Tips & Dining</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Calculate a 18%, 20%, or 25% tip quickly — and split it across a group without the table argument.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🎓</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Grades & Test Scores</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Convert raw scores to percentages, calculate your class average, or find what you need on the final.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🏡</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Real Estate</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Calculate how much your home has appreciated, what percentage a down payment is, or closing cost ratios.</p>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>🏋️</div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem' }}>Health & Fitness</h4>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>Calculate macronutrient percentages, body fat percentage changes, or how much weight you've lost.</p>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

      <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2.8rem', marginBottom: '0.7rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
        Percentage Quick Reference — Common Values
      </h2>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        Bookmark this table for instant mental math. Knowing a few key percentage relationships by heart makes everyday calculations dramatically faster.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.92rem' }}>
        <thead>
          <tr>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>Percentage</th>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>Decimal</th>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>Fraction</th>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>Mental Math Shortcut</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><strong>1%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>0.01</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1/100</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Divide by 100</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><strong>5%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.05</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1/20</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Divide by 20 (or find 10% and halve it)</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><strong>10%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>0.10</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1/10</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Move decimal point one place left</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><strong>12.5%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.125</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1/8</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Divide by 8</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><strong>15%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>0.15</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>3/20</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Find 10% + half of 10%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><strong>20%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.20</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1/5</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Divide by 5 (or double 10%)</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><strong>25%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>0.25</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1/4</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Divide by 4</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><strong>33.3%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.333</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>1/3</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Divide by 3</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><strong>50%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>0.50</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1/2</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Divide by 2</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><strong>75%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>0.75</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>3/4</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Find 50% + 25%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><strong>100%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1.00</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>1/1</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>The whole number itself</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><strong>200%</strong></td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>2.00</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>2/1</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Double the number</td></tr>
        </tbody>
      </table>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #22c55e', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem' }}>
        <strong style={{ color: '#15803d', display: 'block', marginBottom: '0.3rem' }}>💡 The fastest tip calculation in existence</strong>
        For a 20% tip: find 10% (move decimal left), then double it. $67.50 bill → 10% = $6.75 → 20% = $13.50. Done in 5 seconds, no calculator needed.
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

      <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2.8rem', marginBottom: '0.7rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
        Common Percentage Mistakes (And How to Avoid Them)
      </h2>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Mistake 1: Confusing percentage change with percentage difference
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        Percentage <em>change</em> compares a new value to an original one — it has a direction (increase or decrease) and assumes one value came before the other. Percentage <em>difference</em> compares two values without implying order. Use percentage change for "before vs. after" comparisons; use percentage difference for "side by side" comparisons where neither value is the baseline.
      </p>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Mistake 2: Percentage increases and decreases don't cancel out
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        This catches people out constantly. If a price increases by 50% and then decreases by 50%, it does NOT return to the original price. A $100 item increases by 50% to $150. Then decreases by 50% to $75. You've lost $25. The math is asymmetric — percentage changes are always relative to the current value, not the starting value.
      </p>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '4px solid #3b82f6', borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem', margin: '1.2rem 0', fontSize: '0.92rem' }}>
        <strong style={{ color: '#1d4ed8', display: 'block', marginBottom: '0.3rem' }}>📌 Why this matters in real life</strong>
        Investment advisors use this asymmetry to explain why avoiding losses matters more than chasing gains. A portfolio that drops 50% needs to gain 100% just to break even — not 50%.
      </div>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Mistake 3: Getting the base value wrong
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        When calculating "X% of Y," the base (Y) is everything. A 20% discount off $80 saves $16. A 20% discount off $120 saves $24. The percentage is the same; the dollar amount is entirely different. Always make sure you're applying the percentage to the right number — especially with taxes, where the base can be pre-tax or post-tax depending on the context.
      </p>

      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '1.8rem', marginBottom: '0.4rem', color: '#1e3a5f' }}>
        Mistake 4: Reversing a percentage incorrectly
      </h3>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        If you know a price after a 20% discount, you cannot simply add 20% back to find the original. If a sale item costs $80 after 20% off, the original was NOT $80 + 20% = $96. The correct reverse calculation: Original = Sale Price ÷ (1 − discount%) = $80 ÷ 0.80 = <strong>$100</strong>. The discount was applied to the original $100, not the sale price.
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

      <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2.8rem', marginBottom: '0.7rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
        Percentage Change at a Glance
      </h2>
      <p style={{ marginBottom: '1rem', color: '#374151' }}>
        Use this table to quickly understand what common percentage changes look like in practical terms — from salary negotiations to price comparisons to investment returns.
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.92rem' }}>
        <thead>
          <tr>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>Scenario</th>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>Original Value</th>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>New Value</th>
            <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>% Change</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Modest salary raise</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$55,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$57,750</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>+5%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Strong salary raise</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$55,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$60,500</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>+10%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Typical annual inflation</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$100</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$103</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>+3%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Home appreciation (strong year)</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$350,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$402,500</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>+15%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Black Friday discount</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$299</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>$209.30</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>−30%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Stock market correction</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$10,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>$8,000</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>−20%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Weight loss goal (10 lbs from 180)</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>180 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>170 lbs</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>−5.6%</td></tr>
          <tr><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Website traffic growth</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>5,000 visits</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>7,500 visits</td><td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>+50%</td></tr>
        </tbody>
      </table>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1.2rem 1.5rem', margin: '2rem 0' }}>
        <h3 style={{ marginTop: 0, color: '#1d4ed8', fontSize: '0.92rem' }}>🔗 Related CalcLogic Calculators</h3>
        <a href="/fraction-calculator" style={{ color: '#2563eb', fontWeight: 500, marginRight: '1.2rem', fontSize: '0.88rem', textDecoration: 'none' }}>Fraction Calculator</a>
        <a href="/scientific-calculator" style={{ color: '#2563eb', fontWeight: 500, marginRight: '1.2rem', fontSize: '0.88rem', textDecoration: 'none' }}>Scientific Calculator</a>
        <a href="/grade-calculator" style={{ color: '#2563eb', fontWeight: 500, marginRight: '1.2rem', fontSize: '0.88rem', textDecoration: 'none' }}>Grade Calculator</a>
        <a href="/tip-calculator" style={{ color: '#2563eb', fontWeight: 500, marginRight: '1.2rem', fontSize: '0.88rem', textDecoration: 'none' }}>Tip Calculator</a>
        <a href="/sales-tax-calculator" style={{ color: '#2563eb', fontWeight: 500, marginRight: '1.2rem', fontSize: '0.88rem', textDecoration: 'none' }}>Sales Tax Calculator</a>
        <a href="/discount-calculator" style={{ color: '#2563eb', fontWeight: 500, marginRight: '1.2rem', fontSize: '0.88rem', textDecoration: 'none' }}>Discount Calculator</a>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

      <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginTop: '2.8rem', marginBottom: '0.7rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
        Frequently Asked Questions
      </h2>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>How do I calculate a percentage of a number?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Multiply the number by the percentage divided by 100. Formula: Result = (X ÷ 100) × Y. Example: 30% of 250 = (30 ÷ 100) × 250 = 0.30 × 250 = <strong>75</strong>. For quick mental math, convert the percentage to its decimal form first — 30% becomes 0.30, 15% becomes 0.15, and so on.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>How do I calculate percentage increase or decrease?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Percentage Change = ((New Value − Original Value) ÷ Original Value) × 100. A positive result is an increase; negative is a decrease. Example: Price rose from $40 to $52. Change = ((52 − 40) ÷ 40) × 100 = (12 ÷ 40) × 100 = <strong>30% increase</strong>.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>What is the difference between percentage change and percentage difference?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Percentage change compares a new value to an original one — it has a direction (increase or decrease) and assumes one value came before the other. Percentage difference simply compares two values without implying order. Use percentage change for "before vs. after" comparisons; use percentage difference for "side by side" comparisons where neither value is the baseline.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>How do I add a percentage to a number?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Multiply the number by (1 + percentage/100). To add 15% to $200: 200 × (1 + 0.15) = 200 × 1.15 = <strong>$230</strong>. This is the correct method — it is faster and more accurate than calculating the percentage separately and then adding it.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>How do I subtract a percentage from a number?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Multiply the number by (1 − percentage/100). To subtract 25% from $400: 400 × (1 − 0.25) = 400 × 0.75 = <strong>$300</strong>. Note: this is NOT the same as finding 25% of $400 ($100) and then adding 25% back — percentage operations are not perfectly reversible using the same percentage.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>What is 20% of 100?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          20% of 100 is <strong>20</strong>. Since 20% means "20 per hundred," 20% of 100 = 20 × (100/100) = 20. For any number, 20% is always one-fifth of that number — divide by 5 for a quick answer.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>How do I calculate a tip?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Multiply your bill total by the tip percentage as a decimal. For 20% tip on $65: 65 × 0.20 = <strong>$13 tip</strong>, total $78. Quick mental math shortcut: find 10% (move decimal left), then double it for 20% ($13). For 15%, find 10% ($6.50) and add half of that ($3.25) = $9.75.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem', marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '0.98rem', color: '#1e3a5f' }}>How do I reverse a percentage to find the original number?</h3>
        <p style={{ marginBottom: 0, fontSize: '0.92rem' }}>
          Divide the known value by (1 ± the percentage as decimal). If a price after 20% discount is $80, the original = 80 ÷ (1 − 0.20) = 80 ÷ 0.80 = <strong>$100</strong>. If a price after 15% tax is $115, the pre-tax original = 115 ÷ (1 + 0.15) = 115 ÷ 1.15 = <strong>$100</strong>.
        </p>
      </div>

      <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '2rem', fontStyle: 'italic' }}>
        All calculations are performed instantly in your browser. CalcLogic's percentage calculator handles decimals, negative percentages, and large numbers accurately. Results are rounded to two decimal places by default.
      </p>
    </div>
    </>
  )
}

export default PercentageCalculator