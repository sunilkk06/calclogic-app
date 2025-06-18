import React, { useState } from 'react'

const PregnancyCalculator = () => {
  const [formData, setFormData] = useState({
    calcMethod: 'lmp',
    lmpDate: '',
    conceptionDate: '',
    ivfTransferDate: '',
    ivfDay: '5',
    cycleLength: '28'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateDueDate = (e) => {
    e.preventDefault()
    
    let dueDate, conceptionDate
    const standardPregnancyDuration = 280 // days (40 weeks)
    const conceptionToBirth = 266 // days (38 weeks)
    
    try {
      switch (formData.calcMethod) {
        case 'lmp':
          if (!formData.lmpDate) {
            throw new Error('Please enter your last menstrual period date.')
          }
          
          const lmpDate = new Date(formData.lmpDate)
          const cycleLength = parseInt(formData.cycleLength)
          
          // Adjust ovulation day based on cycle length
          const cycleAdjustment = cycleLength - 28
          conceptionDate = new Date(lmpDate)
          conceptionDate.setDate(conceptionDate.getDate() + 14 + cycleAdjustment)
          
          dueDate = new Date(lmpDate)
          dueDate.setDate(dueDate.getDate() + standardPregnancyDuration + cycleAdjustment)
          break
          
        case 'conception':
          if (!formData.conceptionDate) {
            throw new Error('Please enter your conception date.')
          }
          
          conceptionDate = new Date(formData.conceptionDate)
          dueDate = new Date(conceptionDate)
          dueDate.setDate(dueDate.getDate() + conceptionToBirth)
          break
          
        case 'ivf':
          if (!formData.ivfTransferDate) {
            throw new Error('Please enter your IVF transfer date.')
          }
          
          const ivfDate = new Date(formData.ivfTransferDate)
          const ivfDay = parseInt(formData.ivfDay)
          
          // For IVF, due date is calculated from transfer date + standard gestation - embryo age
          const effectiveLmpOffset = 14 + ivfDay
          
          // Calculate equivalent LMP date
          const equivalentLmp = new Date(ivfDate)
          equivalentLmp.setDate(equivalentLmp.getDate() - effectiveLmpOffset)
          
          dueDate = new Date(equivalentLmp)
          dueDate.setDate(dueDate.getDate() + standardPregnancyDuration)
          
          // Estimate conception based on due date
          conceptionDate = new Date(dueDate)
          conceptionDate.setDate(conceptionDate.getDate() - conceptionToBirth)
          break
          
        default:
          throw new Error('Invalid calculation method.')
      }
      
      // Calculate current gestational age
      const today = new Date()
      const gestationalAge = calculateGestationalAge(conceptionDate, today)
      
      setResults({
        dueDate,
        conceptionDate,
        gestationalAge,
        trimester: getTrimester(gestationalAge.weeks)
      })
      
    } catch (error) {
      alert(error.message)
    }
  }

  const calculateGestationalAge = (startDate, currentDate) => {
    startDate = new Date(startDate)
    startDate.setHours(0, 0, 0, 0)
    
    currentDate = new Date(currentDate)
    currentDate.setHours(0, 0, 0, 0)
    
    if (isNaN(startDate.getTime()) || startDate > currentDate) {
      return { weeks: 0, days: 0, text: "Not yet started or invalid date" }
    }
    
    const diffTime = Math.abs(currentDate - startDate)
    const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDaysTotal / 7)
    const days = diffDaysTotal % 7
    
    return {
      weeks,
      days,
      text: `${weeks} week${weeks !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`
    }
  }

  const getTrimester = (weeks) => {
    if (weeks >= 1 && weeks <= 13) {
      return "First Trimester"
    } else if (weeks >= 14 && weeks <= 27) {
      return "Second Trimester"
    } else if (weeks >= 28) {
      return "Third Trimester"
    } else {
      return "-"
    }
  }

  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) {
      return "Invalid Date"
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Pregnancy Calculator</h1>
        <p className="calculator-description">
          Estimate your baby's due date and track key pregnancy milestones.
        </p>
      </div>

      <form onSubmit={calculateDueDate} className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="calcMethod">Calculate based on:</label>
            <div className="input-field">
              <select
                id="calcMethod"
                name="calcMethod"
                value={formData.calcMethod}
                onChange={handleInputChange}
              >
                <option value="lmp">Last Menstrual Period (LMP)</option>
                <option value="conception">Conception Date</option>
                <option value="ivf">IVF Transfer Date</option>
              </select>
            </div>
          </div>

          {formData.calcMethod === 'lmp' && (
            <>
              <div className="input-group">
                <label htmlFor="lmpDate">First Day of Last Menstrual Period:</label>
                <div className="input-field">
                  <input
                    type="date"
                    id="lmpDate"
                    name="lmpDate"
                    value={formData.lmpDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="cycleLength">Average Cycle Length (days):</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="cycleLength"
                    name="cycleLength"
                    value={formData.cycleLength}
                    onChange={handleInputChange}
                    min="20"
                    max="45"
                  />
                </div>
                <small>Default is 28 days. Adjust if your cycle is different.</small>
              </div>
            </>
          )}

          {formData.calcMethod === 'conception' && (
            <div className="input-group">
              <label htmlFor="conceptionDate">Estimated Conception Date:</label>
              <div className="input-field">
                <input
                  type="date"
                  id="conceptionDate"
                  name="conceptionDate"
                  value={formData.conceptionDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {formData.calcMethod === 'ivf' && (
            <>
              <div className="input-group">
                <label htmlFor="ivfTransferDate">IVF Transfer Date:</label>
                <div className="input-field">
                  <input
                    type="date"
                    id="ivfTransferDate"
                    name="ivfTransferDate"
                    value={formData.ivfTransferDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="ivfDay">Day of embryo transfer:</label>
                <div className="input-field">
                  <select
                    id="ivfDay"
                    name="ivfDay"
                    value={formData.ivfDay}
                    onChange={handleInputChange}
                  >
                    <option value="3">Day 3</option>
                    <option value="5">Day 5</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <button type="submit" className="calculate-btn">Calculate Due Date</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Estimated Due Date & Milestones</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Estimated Due Date:</span>
              <span className="result-value">{formatDate(results.dueDate)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Current Gestational Age:</span>
              <span className="result-value">{results.gestationalAge.text}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Current Trimester:</span>
              <span className="result-value">{results.trimester}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Estimated Conception Date:</span>
              <span className="result-value">{formatDate(results.conceptionDate)}</span>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '6px' }}>
            <h3>Trimester Timeline (Approximate):</h3>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li><strong>First Trimester:</strong> Week 1 - Week 13</li>
              <li><strong>Second Trimester:</strong> Week 14 - Week 27</li>
              <li><strong>Third Trimester:</strong> Week 28 - Birth</li>
            </ul>
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Naegele's Rule (LMP Method)</h3>
          <p>The most common method: Add 7 days to the first day of your LMP and subtract 3 months (or add 9 months). This assumes a 28-day cycle with ovulation on day 14.</p>
        </div>
        <div className="info-card">
          <h3>Conception Date Method</h3>
          <p>If you know the exact date of conception, the due date is typically estimated as 266 days (38 weeks) from that date.</p>
        </div>
        <div className="info-card">
          <h3>Cycle Length Adjustment</h3>
          <p>If your cycle is longer or shorter than 28 days, the calculator adjusts the due date accordingly, as ovulation likely occurs earlier or later than day 14.</p>
        </div>
        <div className="info-card">
          <h3>Important Note</h3>
          <p>This calculator provides an estimate. Your actual due date may vary. Ultrasound measurements during the first trimester often provide the most accurate dating. Always consult your healthcare provider.</p>
        </div>
      </div>
    </div>
  )
}

export default PregnancyCalculator