import React, { useState } from 'react'

const GradeCalculator = () => {
  const [assignments, setAssignments] = useState([
    { name: '', weight: '', grade: '' }
  ])
  const [totalWeight, setTotalWeight] = useState(0)
  const [result, setResult] = useState(null)

  const handleAssignmentChange = (index, field, value) => {
    const updatedAssignments = [...assignments]
    updatedAssignments[index][field] = value
    setAssignments(updatedAssignments)
    
    // Update total weight
    if (field === 'weight') {
      calculateTotalWeight(updatedAssignments)
    }
  }

  const calculateTotalWeight = (assignments) => {
    const total = assignments.reduce((sum, assignment) => {
      const weight = parseFloat(assignment.weight) || 0
      return sum + weight
    }, 0)
    setTotalWeight(total)
  }

  const addAssignment = () => {
    setAssignments([...assignments, { name: '', weight: '', grade: '' }])
  }

  const removeAssignment = (index) => {
    if (assignments.length > 1) {
      const updatedAssignments = [...assignments]
      updatedAssignments.splice(index, 1)
      setAssignments(updatedAssignments)
      calculateTotalWeight(updatedAssignments)
    }
  }

  const calculateGrade = (e) => {
    e.preventDefault()
    
    let totalWeightedGrade = 0
    let validAssignments = 0
    let totalUsedWeight = 0
    
    assignments.forEach(assignment => {
      const weight = parseFloat(assignment.weight)
      const grade = parseFloat(assignment.grade)
      
      if (!isNaN(weight) && !isNaN(grade)) {
        totalWeightedGrade += (grade * weight / 100)
        totalUsedWeight += weight
        validAssignments++
      }
    })
    
    if (validAssignments === 0) {
      alert('Please enter at least one valid assignment with weight and grade.')
      return
    }
    
    // Normalize if total weight is not 100%
    let finalGrade = totalWeightedGrade
    if (totalUsedWeight !== 100) {
      finalGrade = (totalWeightedGrade / totalUsedWeight) * 100
    }
    
    // Determine letter grade (approximate)
    let letterGrade
    if (finalGrade >= 90) letterGrade = 'A'
    else if (finalGrade >= 80) letterGrade = 'B'
    else if (finalGrade >= 70) letterGrade = 'C'
    else if (finalGrade >= 60) letterGrade = 'D'
    else letterGrade = 'F'
    
    setResult({
      grade: finalGrade.toFixed(2),
      letterGrade,
      totalWeight: totalUsedWeight
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Grade Calculator</h1>
        <p className="calculator-description">
          Calculate your final course grade based on weighted assignments and categories.
        </p>
      </div>

      <form onSubmit={calculateGrade} className="calculator-form">
        <div className="input-section">
          <h2>Course Assignments/Categories</h2>
          {assignments.map((assignment, index) => (
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
                  placeholder="Assignment/Category (e.g., Homework)"
                  value={assignment.name}
                  onChange={(e) => handleAssignmentChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Weight (%)"
                  value={assignment.weight}
                  onChange={(e) => handleAssignmentChange(index, 'weight', e.target.value)}
                  min="0"
                  max="100"
                  step="any"
                  required
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Grade (%)"
                  value={assignment.grade}
                  onChange={(e) => handleAssignmentChange(index, 'grade', e.target.value)}
                  min="0"
                  step="any"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeAssignment(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53e3e',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
                title="Remove Assignment"
              >
                ×
              </button>
            </div>
          ))}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={addAssignment}
              style={{
                background: '#f8fafc',
                color: '#4285F4',
                border: '1px solid #4285F4',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              + Add Assignment
            </button>
            <div style={{ fontWeight: 'bold' }}>
              Total Weight: {totalWeight}%
              {totalWeight !== 100 && totalWeight > 0 && (
                <span style={{ color: '#e53e3e', marginLeft: '0.5rem' }}>
                  (Warning: Total should be 100%)
                </span>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Overall Grade</button>
      </form>

      {result && (
        <div className="results-section">
          <h2>Calculated Grade</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Overall Course Grade:</span>
              <span className="result-value">{result.grade}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Letter Grade (Approximate):</span>
              <span className="result-value">{result.letterGrade}</span>
            </div>
          </div>
          
          {result.totalWeight !== 100 && (
            <div style={{ 
              marginTop: '1.5rem', 
              background: '#fff8e1', 
              padding: '1rem', 
              borderRadius: '4px',
              border: '1px solid #ffd54f'
            }}>
              <p style={{ color: '#ff6f00' }}>
                <strong>Note:</strong> The total weight of your assignments is {result.totalWeight}%, not 100%. 
                The calculator has normalized your grade as if the weights totaled 100%.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Weights</h3>
          <p>The weight (%) represents how much each category contributes to the final grade. Ensure the total weight of all categories adds up to 100% for an accurate calculation.</p>
        </div>
        <div className="info-card">
          <h3>Calculation</h3>
          <p>The calculator multiplies the grade received in each category by its weight, sums these weighted scores, and then divides by the sum of the weights entered.</p>
        </div>
        <div className="info-card">
          <h3>Planning Ahead</h3>
          <p>Use this tool to track your progress throughout the semester and understand how performance in different areas impacts your overall course grade.</p>
        </div>
      </div>
    </div>
  )
}

export default GradeCalculator