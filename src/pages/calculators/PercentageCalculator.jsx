import React, { useState } from 'react'

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
              <span className="result-value">{percentChange.result.value}% ({percentChange.result.type})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PercentageCalculator