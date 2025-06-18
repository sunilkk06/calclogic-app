import React, { useState } from 'react'

const StatisticsCalculator = () => {
  const [dataInput, setDataInput] = useState('')
  const [results, setResults] = useState(null)

  const formatMode = (modeResult) => {
    if (modeResult.modes.length === 0) {
      return 'None'
    }
    if (modeResult.isMultimodal && modeResult.modes.length === modeResult.maxFrequency) {
      if (modeResult.modes.length > 1 && modeResult.maxFrequency >= 1)
        return modeResult.modes.join(', ')
      else
        return 'None'
    }
    return modeResult.modes.join(', ')
  }

  const calculateStatistics = (numbers) => {
    const n = numbers.length
    if (n === 0) {
      return null
    }

    // Sort numbers for median calculation
    const sortedNumbers = [...numbers].sort((a, b) => a - b)

    // Sum & Mean
    const sum = numbers.reduce((acc, val) => acc + val, 0)
    const mean = sum / n

    // Median
    let median
    const mid = Math.floor(n / 2)
    if (n % 2 === 0) {
      median = (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2
    } else {
      median = sortedNumbers[mid]
    }

    // Mode
    const frequencyMap = {}
    let maxFrequency = 0
    let modes = []
    numbers.forEach(num => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1
      if (frequencyMap[num] > maxFrequency) {
        maxFrequency = frequencyMap[num]
      }
    })

    let uniqueFrequencies = new Set()
    for (const num in frequencyMap) {
      uniqueFrequencies.add(frequencyMap[num])
      if (frequencyMap[num] === maxFrequency) {
        modes.push(parseFloat(num))
      }
    }

    const allSameFrequency = uniqueFrequencies.size === 1 && maxFrequency > 1 && modes.length === n
    const noMode = maxFrequency === 1 && n > 1

    let modeResult = { modes: [], isMultimodal: false, maxFrequency: maxFrequency }
    if (!allSameFrequency && !noMode && maxFrequency > 1) {
      modeResult.modes = modes.sort((a, b) => a - b)
      modeResult.isMultimodal = modes.length > 1
    } else if (allSameFrequency && modes.length === n) {
      modeResult.modes = modes.sort((a, b) => a - b)
      modeResult.isMultimodal = true
    }

    // Variance & Standard Deviation (Sample)
    let variance = 0
    if (n > 1) {
      const sumOfSquares = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0)
      variance = sumOfSquares / (n - 1)
    }
    const stdDev = Math.sqrt(variance)

    return {
      count: n,
      sum: sum,
      mean: mean,
      median: median,
      mode: modeResult,
      variance: variance,
      stdDev: stdDev
    }
  }

  const handleCalculate = (e) => {
    e.preventDefault()

    // Parse data: split by commas, spaces, or newlines, then filter valid numbers
    const numbers = dataInput
      .split(/[\s,\n]+/)
      .map(item => item.trim())
      .filter(item => item !== '')
      .map(item => parseFloat(item))
      .filter(num => !isNaN(num))

    if (numbers.length === 0) {
      setResults({ error: 'No valid numerical data found. Please check your input.' })
      return
    }

    const stats = calculateStatistics(numbers)
    setResults(stats)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Statistics Calculator</h1>
        <p className="calculator-description">
          Calculate common statistical measures for a set of numerical data.
        </p>
      </div>

      <form onSubmit={handleCalculate} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="dataInput">Enter Data</label>
            <textarea
              id="dataInput"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              rows="8"
              placeholder="Enter numbers separated by commas, spaces, or new lines (e.g., 1, 2, 3 or 5 10 15)"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            <small>Input your numerical data here.</small>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Statistics</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Statistical Results</h2>
          {results.error ? (
            <div style={{ color: 'red', fontSize: '1.1rem', textAlign: 'center' }}>
              {results.error}
            </div>
          ) : (
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Count</span>
                <span className="result-value">{results.count}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Sum</span>
                <span className="result-value">{results.sum.toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Mean (Average)</span>
                <span className="result-value">{results.mean.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Median</span>
                <span className="result-value">{results.median.toLocaleString()}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Mode(s)</span>
                <span className="result-value">{formatMode(results.mode)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Variance (Sample)</span>
                <span className="result-value">{results.variance.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Standard Deviation (Sample)</span>
                <span className="result-value">{results.stdDev.toFixed(4)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Mean (Average)</h3>
          <p>The sum of all numbers in the dataset divided by the count of numbers. It represents the central tendency of the data.</p>
        </div>
        <div className="info-card">
          <h3>Median</h3>
          <p>The middle value in a dataset that is sorted in ascending order. If the dataset has an even number of values, the median is the average of the two middle numbers.</p>
        </div>
        <div className="info-card">
          <h3>Mode</h3>
          <p>The value that appears most frequently in the dataset. A dataset can have one mode (unimodal), multiple modes (multimodal), or no mode if all values appear only once.</p>
        </div>
        <div className="info-card">
          <h3>Standard Deviation</h3>
          <p>A measure of the amount of variation or dispersion of a set of values. A low standard deviation indicates that the values tend to be close to the mean, while a high standard deviation indicates that the values are spread out over a wider range.</p>
        </div>
      </div>
    </div>
  )
}

export default StatisticsCalculator