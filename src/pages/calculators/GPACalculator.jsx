import React, { useState } from 'react'

const GPACalculator = () => {
  const [courses, setCourses] = useState([
    { name: '', credits: '', grade: '' }
  ])
  const [previousGPA, setPreviousGPA] = useState('')
  const [previousCredits, setPreviousCredits] = useState('')
  const [results, setResults] = useState(null)

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses]
    updatedCourses[index][field] = value
    setCourses(updatedCourses)
  }

  const addCourse = () => {
    setCourses([...courses, { name: '', credits: '', grade: '' }])
  }

  const removeCourse = (index) => {
    if (courses.length > 1) {
      const updatedCourses = [...courses]
      updatedCourses.splice(index, 1)
      setCourses(updatedCourses)
    }
  }

  const calculateGPA = (e) => {
    e.preventDefault()
    
    // Calculate semester GPA
    let totalPoints = 0
    let totalCredits = 0
    let validCourses = 0

    courses.forEach(course => {
      const credits = parseFloat(course.credits)
      const grade = course.grade
      
      if (!isNaN(credits) && grade && grade !== 'P' && grade !== 'NP') {
        const gradeValue = parseFloat(grade)
        totalPoints += gradeValue * credits
        totalCredits += credits
        validCourses++
      }
    })

    const semesterGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
    
    // Calculate cumulative GPA if previous data exists
    let cumulativeGPA = null
    let totalCumulativeCredits = null
    
    if (previousGPA && previousCredits) {
      const prevGPA = parseFloat(previousGPA)
      const prevCredits = parseFloat(previousCredits)
      
      if (!isNaN(prevGPA) && !isNaN(prevCredits) && prevGPA >= 0 && prevCredits >= 0) {
        const prevPoints = prevGPA * prevCredits
        const semPoints = parseFloat(semesterGPA) * totalCredits
        totalCumulativeCredits = prevCredits + totalCredits
        
        cumulativeGPA = totalCumulativeCredits > 0 ? 
          ((prevPoints + semPoints) / totalCumulativeCredits).toFixed(2) : '0.00'
      }
    }
    
    setResults({
      semesterGPA,
      totalCredits,
      cumulativeGPA,
      totalCumulativeCredits,
      validCourses
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>GPA Calculator</h1>
        <p className="calculator-description">
          Calculate your semester or cumulative Grade Point Average (GPA).
        </p>
      </div>

      <form onSubmit={calculateGPA} className="calculator-form">
        <div className="input-section">
          <h2>Current Semester Courses</h2>
          {courses.map((course, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
              marginBottom: '1rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              <div className="input-field" style={{ flex: 2 }}>
                <input
                  type="text"
                  placeholder="Course Name (Optional)"
                  value={course.name}
                  onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
                  min="0"
                  step="0.5"
                  required
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <select
                  value={course.grade}
                  onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                  required
                >
                  <option value="" disabled>Grade</option>
                  <option value="4.0">A</option>
                  <option value="3.7">A-</option>
                  <option value="3.3">B+</option>
                  <option value="3.0">B</option>
                  <option value="2.7">B-</option>
                  <option value="2.3">C+</option>
                  <option value="2.0">C</option>
                  <option value="1.7">C-</option>
                  <option value="1.3">D+</option>
                  <option value="1.0">D</option>
                  <option value="0.0">F</option>
                  <option value="P">P (Pass)</option>
                  <option value="NP">NP (No Pass)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeCourse(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53e3e',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
                title="Remove Course"
              >
                ×
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addCourse}
            style={{
              background: '#f8fafc',
              color: '#4285F4',
              border: '1px solid #4285F4',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            + Add Course
          </button>
        </div>

        <div className="input-section">
          <h2>Cumulative GPA (Optional)</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="previousGPA">Previous Cumulative GPA:</label>
              <div className="input-field">
                <input
                  type="number"
                  id="previousGPA"
                  value={previousGPA}
                  onChange={(e) => setPreviousGPA(e.target.value)}
                  step="0.01"
                  placeholder="e.g., 3.50"
                  min="0"
                  max="4"
                />
              </div>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="previousCredits">Previous Total Credits:</label>
              <div className="input-field">
                <input
                  type="number"
                  id="previousCredits"
                  value={previousCredits}
                  onChange={(e) => setPreviousCredits(e.target.value)}
                  min="0"
                  step="0.5"
                  placeholder="e.g., 60"
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate GPA</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Calculated GPA</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Semester GPA:</span>
              <span className="result-value">{results.semesterGPA}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Semester Credits:</span>
              <span className="result-value">{results.totalCredits}</span>
            </div>
          </div>
          
          {results.cumulativeGPA && (
            <div className="results-grid" style={{ marginTop: '1.5rem' }}>
              <div className="result-item">
                <span className="result-label">New Cumulative GPA:</span>
                <span className="result-value">{results.cumulativeGPA}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Overall Total Credits:</span>
                <span className="result-value">{results.totalCumulativeCredits}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Grade Points</h3>
          <p>Each letter grade (A, B, C, etc.) is assigned a numerical value (e.g., A=4.0, B=3.0). Pass/No Pass grades usually don't affect GPA. Check your institution's specific grading scale.</p>
        </div>
        <div className="info-card">
          <h3>Semester vs. Cumulative</h3>
          <p>Semester GPA reflects your performance in a single term. Cumulative GPA includes all coursework taken at the institution up to that point.</p>
        </div>
        <div className="info-card">
          <h3>Calculation</h3>
          <p>For each course, multiply the grade points by the number of credits. Sum these values for all courses, then divide by the total number of credits attempted (excluding Pass/No Pass).</p>
        </div>
      </div>
    </div>
  )
}

export default GPACalculator