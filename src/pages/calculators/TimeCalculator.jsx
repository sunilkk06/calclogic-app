import React, { useState } from 'react'

const TimeCalculator = () => {
  const [durationForm, setDurationForm] = useState({
    startHour: '',
    startMin: '',
    startSec: '',
    startAmPm: 'am',
    endHour: '',
    endMin: '',
    endSec: '',
    endAmPm: 'am'
  })
  const [durationResult, setDurationResult] = useState(null)
  
  const [addSubtractForm, setAddSubtractForm] = useState({
    startHour: '',
    startMin: '',
    startSec: '',
    startAmPm: 'am',
    operation: 'add',
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0'
  })
  const [addSubtractResult, setAddSubtractResult] = useState(null)

  const handleDurationChange = (e) => {
    const { name, value } = e.target
    setDurationForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddSubtractChange = (e) => {
    const { name, value } = e.target
    setAddSubtractForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Convert HH:MM:SS AM/PM to 24-hour format seconds from midnight
  const timeToSeconds = (hour, min, sec, ampm) => {
    hour = parseInt(hour)
    min = parseInt(min)
    sec = parseInt(sec)

    if (isNaN(hour) || isNaN(min) || isNaN(sec) || hour < 0 || hour > 12 || min < 0 || min > 59 || sec < 0 || sec > 59) {
      return NaN
    }
    
    // Handle 12 AM/PM
    if (ampm === 'pm' && hour !== 12) {
      hour += 12
    } else if (ampm === 'am' && hour === 12) {
      hour = 0
    }
    
    return hour * 3600 + min * 60 + sec
  }

  // Format total seconds into D days HH hours MM minutes SS seconds
  const formatDuration = (totalSeconds) => {
    if (isNaN(totalSeconds)) return "Invalid calculation"

    const sign = totalSeconds < 0 ? '-' : ''
    totalSeconds = Math.abs(totalSeconds)

    const days = Math.floor(totalSeconds / (3600 * 24))
    totalSeconds %= (3600 * 24)
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)

    let result = sign
    if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `
    result += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    result += ` (${sign}${hours}h ${minutes}m ${seconds}s)`

    return result.trim()
  }

  // Format seconds since midnight back to HH:MM:SS AM/PM
  const formatTime = (totalSeconds, daysOffset = 0) => {
    if (isNaN(totalSeconds)) return "Invalid Time"

    totalSeconds = Math.round(totalSeconds)

    // Handle potential day rollovers
    const secondsInDay = 24 * 3600
    daysOffset += Math.floor(totalSeconds / secondsInDay)
    totalSeconds = totalSeconds % secondsInDay
    if (totalSeconds < 0) {
      totalSeconds += secondsInDay
      daysOffset--
    }

    let hours = Math.floor(totalSeconds / 3600)
    let minutes = Math.floor((totalSeconds % 3600) / 60)
    let seconds = totalSeconds % 60

    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'

    let timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`
    if (daysOffset !== 0) {
      timeString += ` (${daysOffset > 0 ? '+' : ''}${daysOffset} day${Math.abs(daysOffset) > 1 ? 's' : ''})`
    }
    return timeString
  }

  const calculateDuration = (e) => {
    e.preventDefault()
    
    const startSeconds = timeToSeconds(
      durationForm.startHour, 
      durationForm.startMin, 
      durationForm.startSec, 
      durationForm.startAmPm
    )
    
    const endSeconds = timeToSeconds(
      durationForm.endHour, 
      durationForm.endMin, 
      durationForm.endSec, 
      durationForm.endAmPm
    )

    if (isNaN(startSeconds) || isNaN(endSeconds)) {
      alert('Please enter valid time values')
      return
    }

    let difference = endSeconds - startSeconds
    
    // If end time is earlier than start time, assume it's the next day
    if (difference < 0) {
      difference += 24 * 3600
    }

    setDurationResult(formatDuration(difference))
  }

  const calculateAddSubtract = (e) => {
    e.preventDefault()
    
    const startSeconds = timeToSeconds(
      addSubtractForm.startHour, 
      addSubtractForm.startMin, 
      addSubtractForm.startSec, 
      addSubtractForm.startAmPm
    )

    const days = parseInt(addSubtractForm.days) || 0
    const hours = parseInt(addSubtractForm.hours) || 0
    const minutes = parseInt(addSubtractForm.minutes) || 0
    const seconds = parseInt(addSubtractForm.seconds) || 0
    const operation = addSubtractForm.operation

    if (isNaN(startSeconds)) {
      alert('Please enter a valid start time')
      return
    }

    let durationTotalSeconds = (days * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds

    let resultSeconds
    if (operation === 'add') {
      resultSeconds = startSeconds + durationTotalSeconds
    } else {
      resultSeconds = startSeconds - durationTotalSeconds
    }

    setAddSubtractResult(formatTime(resultSeconds))
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Time Calculator</h1>
        <p className="calculator-description">
          Perform calculations with time, including adding/subtracting durations and finding the difference between times.
        </p>
      </div>

      <div className="calculator-form">
        <div className="input-section">
          <h2>Calculate Duration Between Two Times</h2>
          <form onSubmit={calculateDuration}>
            <div className="input-group">
              <label>Start Time:</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="startHour"
                    value={durationForm.startHour}
                    onChange={handleDurationChange}
                    placeholder="HH"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <span>:</span>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="startMin"
                    value={durationForm.startMin}
                    onChange={handleDurationChange}
                    placeholder="MM"
                    min="0"
                    max="59"
                    required
                  />
                </div>
                <span>:</span>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="startSec"
                    value={durationForm.startSec}
                    onChange={handleDurationChange}
                    placeholder="SS"
                    min="0"
                    max="59"
                    defaultValue="0"
                  />
                </div>
                <div className="input-field" style={{ width: '80px' }}>
                  <select
                    name="startAmPm"
                    value={durationForm.startAmPm}
                    onChange={handleDurationChange}
                  >
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <label>End Time:</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="endHour"
                    value={durationForm.endHour}
                    onChange={handleDurationChange}
                    placeholder="HH"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <span>:</span>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="endMin"
                    value={durationForm.endMin}
                    onChange={handleDurationChange}
                    placeholder="MM"
                    min="0"
                    max="59"
                    required
                  />
                </div>
                <span>:</span>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="endSec"
                    value={durationForm.endSec}
                    onChange={handleDurationChange}
                    placeholder="SS"
                    min="0"
                    max="59"
                    defaultValue="0"
                  />
                </div>
                <div className="input-field" style={{ width: '80px' }}>
                  <select
                    name="endAmPm"
                    value={durationForm.endAmPm}
                    onChange={handleDurationChange}
                  >
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button type="submit" className="calculate-btn">Calculate Duration</button>
          </form>
          
          {durationResult && (
            <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '6px' }}>
              <strong>Duration:</strong> {durationResult}
            </div>
          )}
        </div>
      </div>

      <div className="calculator-form" style={{ marginTop: '2rem' }}>
        <div className="input-section">
          <h2>Add or Subtract Time Duration</h2>
          <form onSubmit={calculateAddSubtract}>
            <div className="input-group">
              <label>Start Time:</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="startHour"
                    value={addSubtractForm.startHour}
                    onChange={handleAddSubtractChange}
                    placeholder="HH"
                    min="1"
                    max="12"
                    required
                  />
                </div>
                <span>:</span>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="startMin"
                    value={addSubtractForm.startMin}
                    onChange={handleAddSubtractChange}
                    placeholder="MM"
                    min="0"
                    max="59"
                    required
                  />
                </div>
                <span>:</span>
                <div className="input-field" style={{ width: '70px' }}>
                  <input
                    type="number"
                    name="startSec"
                    value={addSubtractForm.startSec}
                    onChange={handleAddSubtractChange}
                    placeholder="SS"
                    min="0"
                    max="59"
                    defaultValue="0"
                  />
                </div>
                <div className="input-field" style={{ width: '80px' }}>
                  <select
                    name="startAmPm"
                    value={addSubtractForm.startAmPm}
                    onChange={handleAddSubtractChange}
                  >
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="input-group">
              <label>Operation:</label>
              <div className="input-field">
                <select
                  name="operation"
                  value={addSubtractForm.operation}
                  onChange={handleAddSubtractChange}
                >
                  <option value="add">Add (+)</option>
                  <option value="subtract">Subtract (−)</option>
                </select>
              </div>
            </div>
            
            <div className="input-group">
              <label>Time Duration:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <div className="input-field">
                  <input
                    type="number"
                    name="days"
                    value={addSubtractForm.days}
                    onChange={handleAddSubtractChange}
                    placeholder="Days"
                    min="0"
                  />
                  <small>Days</small>
                </div>
                <div className="input-field">
                  <input
                    type="number"
                    name="hours"
                    value={addSubtractForm.hours}
                    onChange={handleAddSubtractChange}
                    placeholder="Hours"
                    min="0"
                  />
                  <small>Hours</small>
                </div>
                <div className="input-field">
                  <input
                    type="number"
                    name="minutes"
                    value={addSubtractForm.minutes}
                    onChange={handleAddSubtractChange}
                    placeholder="Minutes"
                    min="0"
                  />
                  <small>Minutes</small>
                </div>
                <div className="input-field">
                  <input
                    type="number"
                    name="seconds"
                    value={addSubtractForm.seconds}
                    onChange={handleAddSubtractChange}
                    placeholder="Seconds"
                    min="0"
                  />
                  <small>Seconds</small>
                </div>
              </div>
            </div>
            
            <button type="submit" className="calculate-btn">Calculate New Time</button>
          </form>
          
          {addSubtractResult && (
            <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '6px' }}>
              <strong>Resulting Time:</strong> {addSubtractResult}
            </div>
          )}
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <h3>Time Duration</h3>
          <p>Calculate the exact length of time (in days, hours, minutes, seconds) between a specified start time and end time.</p>
        </div>
        <div className="info-card">
          <h3>Adding/Subtracting Time</h3>
          <p>Determine a future or past time by adding or subtracting a duration (days, hours, minutes, seconds) from a given start time.</p>
        </div>
        <div className="info-card">
          <h3>AM/PM and 24-Hour</h3>
          <p>This calculator uses the 12-hour AM/PM format for input clarity but performs calculations internally using a 24-hour system to avoid ambiguity.</p>
        </div>
      </div>
    </div>
  )
}

export default TimeCalculator