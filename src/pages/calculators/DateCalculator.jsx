import React, { useState } from 'react'

const DateCalculator = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [includeEndDate, setIncludeEndDate] = useState(false)
  const [durationResult, setDurationResult] = useState(null)

  const calculateDuration = (e) => {
    e.preventDefault()
    
    if (!startDate || !endDate) {
      return
    }
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // Ensure start date is not after end date
    if (start > end) {
      alert('Start date must be before end date')
      return
    }
    
    // Adjust end date if checkbox is checked
    const effectiveEndDate = new Date(end)
    if (includeEndDate) {
      effectiveEndDate.setDate(effectiveEndDate.getDate() + 1)
    }
    
    // Calculate total days difference
    const timeDiff = effectiveEndDate.getTime() - start.getTime()
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    
    // Calculate Y/M/D difference
    const years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()
    
    // Adjust for negative days
    if (days < 0) {
      months--
      // Get days in the previous month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
      days += prevMonth.getDate()
    }
    
    // Adjust for negative months
    if (months < 0) {
      months += 12
    }
    
    setDurationResult({
      years,
      months,
      days: includeEndDate ? days + 1 : days,
      totalDays
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Date Calculator</h1>
        <p className="calculator-description">
          Calculate the duration between two dates or find a date by adding or subtracting days, weeks, months, or years.
        </p>
      </div>

      <div className="calculator-form">
        <div className="input-section">
          <h2>Calculate Duration Between Two Dates</h2>
          <form onSubmit={calculateDuration}>
            <div className="input-group">
              <label htmlFor="startDate">Start Date</label>
              <div className="input-field">
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="endDate">End Date</label>
              <div className="input-field">
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  checked={includeEndDate}
                  onChange={(e) => setIncludeEndDate(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Include end date in calculation (adds 1 day)
              </label>
            </div>
            
            <button type="submit" className="calculate-btn">Calculate Duration</button>
          </form>
          
          {durationResult && (
            <div style={{ marginTop: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '6px' }}>
              <h3>Duration:</h3>
              <div style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                <strong>{durationResult.years}</strong> Years, <strong>{durationResult.months}</strong> Months, <strong>{durationResult.days}</strong> Days
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                Total: <strong>{durationResult.totalDays}</strong> Days
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <h3>Duration Calculation</h3>
          <p>To find the duration, the difference between the start and end dates is calculated. This difference is then broken down into years, months, and days, accounting for the varying lengths of months and leap years.</p>
        </div>
        <div className="info-card">
          <h3>Adding/Subtracting Time</h3>
          <p>Finding a future or past date involves adding or subtracting a specific number of days, weeks, months, or years to a starting date. The calculator handles date rollovers across months and years automatically.</p>
        </div>
        <div className="info-card">
          <h3>Include End Date Option</h3>
          <p>When calculating duration for billing cycles or events spanning multiple days, you might need to count both the start and end days. Checking the "Include end date" option adds one day to the total duration.</p>
        </div>
      </div>
    </div>
  )
}

export default DateCalculator