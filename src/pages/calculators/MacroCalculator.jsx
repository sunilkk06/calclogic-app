import React, { useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const MacroCalculator = () => {
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    activityLevel: '1.2',
    goal: 'maintain'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateMacros = (e) => {
    e.preventDefault()
    
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseInt(formData.age)
    const activityLevel = parseFloat(formData.activityLevel)
    
    if (isNaN(weight) || isNaN(height) || isNaN(age) || weight <= 0 || height <= 0 || age <= 0) {
      return
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr
    if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    }
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevel
    
    // Adjust calories based on goal
    let calories
    switch (formData.goal) {
      case 'lose':
        calories = tdee - 500 // 500 calorie deficit for weight loss
        break
      case 'gain':
        calories = tdee + 500 // 500 calorie surplus for weight gain
        break
      default:
        calories = tdee // Maintenance
    }
    
    // Calculate macros based on goal
    let proteinRatio, carbsRatio, fatsRatio
    
    if (formData.goal === 'lose') {
      proteinRatio = 0.40 // 40% protein
      carbsRatio = 0.30 // 30% carbs
      fatsRatio = 0.30 // 30% fats
    } else if (formData.goal === 'gain') {
      proteinRatio = 0.30 // 30% protein
      carbsRatio = 0.45 // 45% carbs
      fatsRatio = 0.25 // 25% fats
    } else {
      proteinRatio = 0.30 // 30% protein
      carbsRatio = 0.40 // 40% carbs
      fatsRatio = 0.30 // 30% fats
    }
    
    const proteinCalories = calories * proteinRatio
    const carbsCalories = calories * carbsRatio
    const fatsCalories = calories * fatsRatio
    
    const proteinGrams = proteinCalories / 4 // 4 calories per gram of protein
    const carbsGrams = carbsCalories / 4 // 4 calories per gram of carbs
    const fatsGrams = fatsCalories / 9 // 9 calories per gram of fat
    
    setResults({
      calories: Math.round(calories),
      protein: {
        grams: Math.round(proteinGrams),
        calories: Math.round(proteinCalories),
        percent: Math.round(proteinRatio * 100)
      },
      carbs: {
        grams: Math.round(carbsGrams),
        calories: Math.round(carbsCalories),
        percent: Math.round(carbsRatio * 100)
      },
      fats: {
        grams: Math.round(fatsGrams),
        calories: Math.round(fatsCalories),
        percent: Math.round(fatsRatio * 100)
      }
    })
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Macro Calculator</h1>
        <p className="calculator-description">
          Calculate your ideal macronutrient ratios based on your goals and activity level.
        </p>
      </div>

      <form onSubmit={calculateMacros} className="calculator-form">
        <div className="input-section">
          <h2>Personal Information</h2>
          <div className="input-group">
            <label htmlFor="gender">Gender</label>
            <div className="input-field">
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="age">Age</label>
            <div className="input-field">
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="15"
                max="100"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="weight">Weight (kg)</label>
            <div className="input-field">
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="30"
                max="300"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="height">Height (cm)</label>
            <div className="input-field">
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="120"
                max="250"
                required
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Activity & Goals</h2>
          <div className="input-group">
            <label htmlFor="activityLevel">Activity Level</label>
            <div className="input-field">
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                required
              >
                <option value="1.2">Sedentary (Office Job)</option>
                <option value="1.375">Light Exercise (1-2 days/week)</option>
                <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                <option value="1.9">Athlete (2x per day)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="goal">Goal</label>
            <div className="input-field">
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                required
              >
                <option value="lose">Weight Loss</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Muscle Gain</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Macros</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Macro Results</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Daily Calories</span>
              <span className="result-value">{results.calories} kcal</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '6px', textAlign: 'center' }}>
              <h3 style={{ color: '#4a90e2', marginBottom: '1rem' }}>Protein</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{results.protein.grams}g</div>
              <div>{results.protein.calories} kcal</div>
              <div>{results.protein.percent}%</div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '6px', textAlign: 'center' }}>
              <h3 style={{ color: '#50C878', marginBottom: '1rem' }}>Carbs</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{results.carbs.grams}g</div>
              <div>{results.carbs.calories} kcal</div>
              <div>{results.carbs.percent}%</div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '6px', textAlign: 'center' }}>
              <h3 style={{ color: '#FFA500', marginBottom: '1rem' }}>Fats</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{results.fats.grams}g</div>
              <div>{results.fats.calories} kcal</div>
              <div>{results.fats.percent}%</div>
            </div>
          </div>

          <div className="chart-container" style={{ height: '300px', marginTop: '2rem' }}>
            <Pie
              data={{
                labels: ['Protein', 'Carbs', 'Fats'],
                datasets: [
                  {
                    data: [results.protein.percent, results.carbs.percent, results.fats.percent],
                    backgroundColor: ['#4a90e2', '#50C878', '#FFA500'],
                    borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>Protein (4 kcal/g)</h3>
          <ul>
            <li>Essential for muscle growth and repair</li>
            <li>Helps maintain lean body mass</li>
            <li>Increases satiety and metabolism</li>
            <li>Sources: meat, fish, eggs, dairy, legumes</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Carbohydrates (4 kcal/g)</h3>
          <ul>
            <li>Primary energy source</li>
            <li>Fuels brain and muscle function</li>
            <li>Spares protein from being used for energy</li>
            <li>Sources: grains, fruits, vegetables, legumes</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Fats (9 kcal/g)</h3>
          <ul>
            <li>Essential for hormone production</li>
            <li>Helps absorb fat-soluble vitamins</li>
            <li>Provides energy and insulation</li>
            <li>Sources: oils, nuts, seeds, avocados</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MacroCalculator