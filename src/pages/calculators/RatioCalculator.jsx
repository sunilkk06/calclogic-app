import React, { useState } from 'react'

const RatioCalculator = () => {
  const [formData, setFormData] = useState({
    ratioA: '',
    ratioB: '',
    ratioC: '',
    ratioD: ''
  })
  const [result, setResult] = useState(null)
  const [explanation, setExplanation] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear results when inputs change
    setResult(null)
    setExplanation('')
  }

  // Greatest Common Divisor (GCD)
  const gcd = (a, b) => {
    a = Math.abs(a)
    b = Math.abs(b)
    if (b === 0) return a
    return gcd(b, a % b)
  }

  const calculateRatio = (e) => {
    e.preventDefault()

    // Get values, treat empty or 'x' as null for solving
    const values = [formData.ratioA, formData.ratioB, formData.ratioC, formData.ratioD].map(input => {
      const val = input.trim().toLowerCase()
      if (val === '' || val === 'x') {
        return null
      }
      const num = parseFloat(val)
      return isNaN(num) ? NaN : num
    })

    let [a, b, c, d] = values
    const validNumbers = values.filter(v => typeof v === 'number' && !isNaN(v))
    const nullCount = values.filter(v => v === null).length
    const nanCount = values.filter(v => isNaN(v)).length

    // Input Validation
    if (nanCount > 0) {
      setResult('Invalid input. Please enter numbers or leave one field blank/enter \'x\' to solve.')
      setExplanation('')
      return
    }

    // Case 1: Simplify Ratio (A:B)
    if (validNumbers.length === 2 && a !== null && b !== null && c === null && d === null) {
      if (a === 0 && b === 0) {
        setResult('Cannot simplify ratio 0 : 0.')
        setExplanation('')
        return
      }
      const commonDivisor = gcd(a, b)
      const simplifiedA = a / commonDivisor
      const simplifiedB = b / commonDivisor
      let explanationText = `Original Ratio: ${a} : ${b}\n`
      explanationText += `Find the Greatest Common Divisor (GCD) of ${a} and ${b}: ${commonDivisor}\n`
      explanationText += `Divide both parts by the GCD:\n`
      explanationText += `${a} ÷ ${commonDivisor} = ${simplifiedA}\n`
      explanationText += `${b} ÷ ${commonDivisor} = ${simplifiedB}`
      
      setResult(`Simplified Ratio: ${simplifiedA} : ${simplifiedB}`)
      setExplanation(explanationText)

    // Case 2: Solve Proportion (A:B = C:D)
    } else if (validNumbers.length === 3 && nullCount === 1) {
      let solvedValue
      let explanationText = `Solving the proportion: ${a ?? 'A'} : ${b ?? 'B'} = ${c ?? 'C'} : ${d ?? 'D'}\n`
      explanationText += `Using the cross-multiplication rule: A × D = B × C\n\n`

      try {
        if (a === null) { // Solve for A
          if (d === 0) throw new Error('Cannot solve for A when D is zero (division by zero).')
          solvedValue = (b * c) / d
          explanationText += `A = (B × C) / D\nA = (${b} × ${c}) / ${d}\nA = ${b * c} / ${d}`
          a = solvedValue
        } else if (b === null) { // Solve for B
          if (c === 0) throw new Error('Cannot solve for B when C is zero (division by zero).')
          solvedValue = (a * d) / c
          explanationText += `B = (A × D) / C\nB = (${a} × ${d}) / ${c}\nB = ${a * d} / ${c}`
          b = solvedValue
        } else if (c === null) { // Solve for C
          if (b === 0) throw new Error('Cannot solve for C when B is zero (division by zero).')
          solvedValue = (a * d) / b
          explanationText += `C = (A × D) / B\nC = (${a} × ${d}) / ${b}\nC = ${a * d} / ${b}`
          c = solvedValue
        } else { // Solve for D (d === null)
          if (a === 0) throw new Error('Cannot solve for D when A is zero (division by zero).')
          solvedValue = (b * c) / a
          explanationText += `D = (B × C) / A\nD = (${b} × ${c}) / ${a}\nD = ${b * c} / ${a}`
          d = solvedValue
        }
        explanationText += `\n\nSolved Value = ${solvedValue.toFixed(4)}`
        setResult(`Solved Value: ${parseFloat(solvedValue.toFixed(4))}`)
        setExplanation(explanationText)

      } catch (error) {
        setResult(`Calculation Error: ${error.message}`)
        setExplanation('')
      }

    // Case 3: Invalid scenario
    } else {
      setResult('Invalid input combination. Enter A and B to simplify, or exactly three values (A, B, C, D) to solve for the missing one.')
      setExplanation('')
    }
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Ratio Calculator</h1>
        <p className="calculator-description">
          Simplify ratios or solve for a missing value in a proportion (e.g., A : B = C : D).
        </p>
      </div>

      <form onSubmit={calculateRatio} className="calculator-form">
        <div className="input-section">
          <h2>Enter Ratio / Proportion</h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div className="input-field" style={{ width: '100px' }}>
              <input
                type="text"
                name="ratioA"
                value={formData.ratioA}
                onChange={handleInputChange}
                placeholder="A"
              />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>:</span>
            <div className="input-field" style={{ width: '100px' }}>
              <input
                type="text"
                name="ratioB"
                value={formData.ratioB}
                onChange={handleInputChange}
                placeholder="B"
              />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>=</span>
            <div className="input-field" style={{ width: '100px' }}>
              <input
                type="text"
                name="ratioC"
                value={formData.ratioC}
                onChange={handleInputChange}
                placeholder="C"
              />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>:</span>
            <div className="input-field" style={{ width: '100px' }}>
              <input
                type="text"
                name="ratioD"
                value={formData.ratioD}
                onChange={handleInputChange}
                placeholder="D"
              />
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Enter numbers for A, B, C, and D. Leave one field blank (or enter 'x') to solve for the missing value. 
            If only A and B are entered, the ratio will be simplified.
          </p>
        </div>

        <button type="submit" className="calculate-btn">Calculate Ratio</button>
      </form>

      {result && (
        <div className="results-section">
          <h2>Result</h2>
          <div className="result-item">
            <span className="result-value" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {result}
            </span>
          </div>
          
          {explanation && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Explanation:</h3>
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '6px',
                whiteSpace: 'pre-line',
                fontFamily: 'monospace'
              }}>
                {explanation}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Simplifying Ratios</h3>
          <p>To simplify a ratio (e.g., A:B), find the greatest common divisor (GCD) of A and B. Divide both A and B by their GCD to get the simplest form.</p>
        </div>
        <div className="info-card">
          <h3>Solving Proportions</h3>
          <p>In a proportion A:B = C:D, the product of the means (B and C) equals the product of the extremes (A and D). Use this cross-multiplication property (A × D = B × C) to solve for the unknown value.</p>
        </div>
        <div className="info-card">
          <h3>Real-World Uses</h3>
          <p>Ratios are used in cooking (scaling recipes), maps (scale ratio), finance (debt-to-income ratio), and comparing quantities in various fields like science and engineering.</p>
        </div>
      </div>
    </div>
  )
}

export default RatioCalculator