import React, { useState } from 'react'

const FractionCalculator = () => {
  const [formData, setFormData] = useState({
    num1: '',
    den1: '',
    num2: '',
    den2: '',
    operator: 'add'
  })
  const [result, setResult] = useState(null)
  const [steps, setSteps] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear results when inputs change
    setResult(null)
    setSteps([])
  }

  // Greatest Common Divisor (GCD)
  const gcd = (a, b) => {
    a = Math.abs(a)
    b = Math.abs(b)
    if (b === 0) return a
    return gcd(b, a % b)
  }

  // Least Common Multiple (LCM)
  const lcm = (a, b) => {
    return Math.abs(a * b) / gcd(a, b)
  }

  // Simplify Fraction
  const simplifyFraction = (numerator, denominator) => {
    if (denominator === 0) {
      return { numerator: NaN, denominator: NaN }
    }
    if (numerator === 0) {
      return { numerator: 0, denominator: 1 }
    }
    const commonDivisor = gcd(numerator, denominator)
    let simplifiedNum = numerator / commonDivisor
    let simplifiedDen = denominator / commonDivisor

    // Ensure denominator is positive
    if (simplifiedDen < 0) {
      simplifiedNum = -simplifiedNum
      simplifiedDen = -simplifiedDen
    }
    return { numerator: simplifiedNum, denominator: simplifiedDen }
  }

  const calculate = (n1, d1, n2, d2, operator) => {
    let resultNum, resultDen
    let calculationSteps = []

    const opSymbol = operator === 'add' ? '+' : operator === 'subtract' ? '−' : operator === 'multiply' ? '×' : '÷'
    const initialFraction1Str = `${n1}/${d1}`
    const initialFraction2Str = `${n2}/${d2}`
    calculationSteps.push(`Operation: ${initialFraction1Str} ${opSymbol} ${initialFraction2Str}`)

    switch (operator) {
      case 'add':
        // Find LCM
        resultDen = lcm(d1, d2)
        calculationSteps.push(`Find the least common multiple (LCM) of ${d1} and ${d2}: ${resultDen}`)
        // Convert fractions
        const convertedN1 = n1 * (resultDen / d1)
        const convertedN2 = n2 * (resultDen / d2)
        calculationSteps.push(`Convert fractions: ${convertedN1}/${resultDen} ${opSymbol} ${convertedN2}/${resultDen}`)
        // Add numerators
        resultNum = convertedN1 + convertedN2
        calculationSteps.push(`Add numerators: ${convertedN1} + ${convertedN2} = ${resultNum}`)
        calculationSteps.push(`Result before simplification: ${resultNum}/${resultDen}`)
        break
      case 'subtract':
        // Find LCM
        resultDen = lcm(d1, d2)
        calculationSteps.push(`Find the least common multiple (LCM) of ${d1} and ${d2}: ${resultDen}`)
        // Convert fractions
        const subConvertedN1 = n1 * (resultDen / d1)
        const subConvertedN2 = n2 * (resultDen / d2)
        calculationSteps.push(`Convert fractions: ${subConvertedN1}/${resultDen} ${opSymbol} ${subConvertedN2}/${resultDen}`)
        // Subtract numerators
        resultNum = subConvertedN1 - subConvertedN2
        calculationSteps.push(`Subtract numerators: ${subConvertedN1} - ${subConvertedN2} = ${resultNum}`)
        calculationSteps.push(`Result before simplification: ${resultNum}/${resultDen}`)
        break
      case 'multiply':
        resultNum = n1 * n2
        resultDen = d1 * d2
        calculationSteps.push(`Multiply numerators: ${n1} × ${n2} = ${resultNum}`)
        calculationSteps.push(`Multiply denominators: ${d1} × ${d2} = ${resultDen}`)
        calculationSteps.push(`Result before simplification: ${resultNum}/${resultDen}`)
        break
      case 'divide':
        // Multiply by reciprocal
        resultNum = n1 * d2
        resultDen = d1 * n2
        calculationSteps.push(`Multiply by the reciprocal: ${initialFraction1Str} × ${d2}/${n2}`)
        calculationSteps.push(`Multiply numerators: ${n1} × ${d2} = ${resultNum}`)
        calculationSteps.push(`Multiply denominators: ${d1} × ${n2} = ${resultDen}`)
        if (resultDen === 0) {
          calculationSteps.push('Error: Division by zero in calculation.')
          return { numerator: NaN, denominator: NaN, steps: calculationSteps }
        }
        calculationSteps.push(`Result before simplification: ${resultNum}/${resultDen}`)
        break
      default:
        return { numerator: NaN, denominator: NaN, steps: ['Invalid operator'] }
    }

    // Simplify the result
    const simplified = simplifyFraction(resultNum, resultDen)
    calculationSteps.push(`Simplify the fraction: ${resultNum}/${resultDen} = ${simplified.numerator}/${simplified.denominator}`)

    return { numerator: simplified.numerator, denominator: simplified.denominator, steps: calculationSteps }
  }

  const calculateFraction = (e) => {
    e.preventDefault()

    // Get and parse inputs
    const n1 = parseInt(formData.num1)
    const d1 = parseInt(formData.den1)
    const n2 = parseInt(formData.num2)
    const d2 = parseInt(formData.den2)
    const operator = formData.operator

    // Validation
    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
      setResult({ error: 'Please enter valid numbers for all fraction parts.' })
      setSteps([])
      return
    }
    if (d1 === 0 || d2 === 0) {
      setResult({ error: 'Denominators cannot be zero.' })
      setSteps([])
      return
    }

    // Calculate
    const calculationResult = calculate(n1, d1, n2, d2, operator)

    // Display
    setResult(calculationResult)
    setSteps(calculationResult.steps)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Fraction Calculator</h1>
        <p className="calculator-description">
          Easily perform calculations with fractions, including addition, subtraction, multiplication, and division.
        </p>
      </div>

      <form onSubmit={calculateFraction} className="calculator-form">
        <div className="input-section">
          <h2>Enter Fractions</h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            {/* Fraction 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="input-field" style={{ width: '80px', marginBottom: '0.25rem' }}>
                <input
                  type="number"
                  name="num1"
                  value={formData.num1}
                  onChange={handleInputChange}
                  placeholder="Numerator"
                  required
                />
              </div>
              <div style={{ width: '80px', height: '2px', background: '#333', margin: '0.25rem 0' }}></div>
              <div className="input-field" style={{ width: '80px', marginTop: '0.25rem' }}>
                <input
                  type="number"
                  name="den1"
                  value={formData.den1}
                  onChange={handleInputChange}
                  placeholder="Denominator"
                  required
                />
              </div>
            </div>

            {/* Operator */}
            <div className="input-field" style={{ width: '80px' }}>
              <select
                name="operator"
                value={formData.operator}
                onChange={handleInputChange}
              >
                <option value="add">+</option>
                <option value="subtract">−</option>
                <option value="multiply">×</option>
                <option value="divide">÷</option>
              </select>
            </div>

            {/* Fraction 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="input-field" style={{ width: '80px', marginBottom: '0.25rem' }}>
                <input
                  type="number"
                  name="num2"
                  value={formData.num2}
                  onChange={handleInputChange}
                  placeholder="Numerator"
                  required
                />
              </div>
              <div style={{ width: '80px', height: '2px', background: '#333', margin: '0.25rem 0' }}></div>
              <div className="input-field" style={{ width: '80px', marginTop: '0.25rem' }}>
                <input
                  type="number"
                  name="den2"
                  value={formData.den2}
                  onChange={handleInputChange}
                  placeholder="Denominator"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Fraction</button>
      </form>

      {result && (
        <div className="results-section">
          <h2>Result</h2>
          {result.error ? (
            <div style={{ color: 'red', fontSize: '1.1rem', textAlign: 'center' }}>
              {result.error}
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{result.numerator}</div>
                  <div style={{ width: '60px', height: '3px', background: '#333', margin: '0.5rem 0' }}></div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{result.denominator}</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <strong>Decimal:</strong> {(result.numerator / result.denominator).toFixed(6).replace(/\.?0+$/, '')}
              </div>

              {steps.length > 0 && (
                <div>
                  <h3>Steps:</h3>
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '1rem', 
                    borderRadius: '6px'
                  }}>
                    {steps.map((step, index) => (
                      <p key={index} style={{ margin: '0.5rem 0' }}>{step}</p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Adding & Subtracting</h3>
          <p>To add or subtract fractions, they must have a common denominator. Find the least common multiple (LCM) of the denominators, convert each fraction to an equivalent fraction with that denominator, and then add or subtract the numerators.</p>
        </div>
        <div className="info-card">
          <h3>Multiplying Fractions</h3>
          <p>Multiply the numerators together to get the new numerator, and multiply the denominators together to get the new denominator. Simplify the resulting fraction if possible.</p>
        </div>
        <div className="info-card">
          <h3>Dividing Fractions</h3>
          <p>To divide by a fraction, multiply by its reciprocal. Invert the second fraction (swap numerator and denominator) and then multiply the first fraction by this inverted fraction.</p>
        </div>
        <div className="info-card">
          <h3>Simplifying Fractions</h3>
          <p>Find the greatest common divisor (GCD) of the numerator and the denominator. Divide both the numerator and the denominator by their GCD to get the simplest form of the fraction.</p>
        </div>
      </div>
    </div>
  )
}

export default FractionCalculator