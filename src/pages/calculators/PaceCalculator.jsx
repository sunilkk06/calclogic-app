import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const PaceCalculator = () => {
  const [distance, setDistance] = useState('')
  const [distanceUnit, setDistanceUnit] = useState('miles')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [paceMinutes, setPaceMinutes] = useState('')
  const [paceSeconds, setPaceSeconds] = useState('')
  const [paceUnit, setPaceUnit] = useState('mile')
  const [activeMode, setActiveMode] = useState(null) // pace, time, distance

  // Race distance presets
  const racePresets = {
    '5K': { distance: 3.107, unit: 'miles' },
    '10K': { distance: 6.214, unit: 'miles' },
    'Half Marathon': { distance: 13.1, unit: 'miles' },
    'Marathon': { distance: 26.2, unit: 'miles' }
  }

  // Convert time to total seconds
  const timeToSeconds = (h, m, s) => {
    return (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0)
  }

  // Convert seconds to MM:SS format
  const formatPace = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = Math.round(totalSeconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Convert seconds to HH:MM:SS format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = Math.round(totalSeconds % 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Calculate pace based on distance and time
  const calculatePace = (e) => {
    if (e) e.preventDefault()
    if (!distance || (!hours && !minutes && !seconds)) return

    const totalSeconds = timeToSeconds(hours, minutes, seconds)
    if (!totalSeconds) return

    const distanceInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
    const paceSecondsPerMile = totalSeconds / distanceInMiles
    
    setPaceMinutes(Math.floor(paceSecondsPerMile / 60))
    setPaceSeconds(Math.round(paceSecondsPerMile % 60))
    setActiveMode('pace')
  }

  // Calculate time based on distance and pace
  const calculateTime = (e) => {
    if (e) e.preventDefault()
    if (!distance || (!paceMinutes && !paceSeconds)) return

    const totalPaceSeconds = timeToSeconds(0, paceMinutes, paceSeconds)
    if (!totalPaceSeconds) return

    const distanceInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
    const totalSeconds = totalPaceSeconds * distanceInMiles
    
    const totalHours = Math.floor(totalSeconds / 3600)
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
    const remainingSeconds = Math.round(totalSeconds % 60)
    
    setHours(totalHours)
    setMinutes(totalMinutes)
    setSeconds(remainingSeconds)
    setActiveMode('time')
  }

  // Calculate distance based on time and pace
  const calculateDistance = (e) => {
    if (e) e.preventDefault()
    if ((!hours && !minutes && !seconds) || (!paceMinutes && !paceSeconds)) return

    const totalSeconds = timeToSeconds(hours, minutes, seconds)
    const totalPaceSeconds = timeToSeconds(0, paceMinutes, paceSeconds)
    
    if (!totalSeconds || !totalPaceSeconds) return

    const distanceInMiles = totalSeconds / totalPaceSeconds
    const finalDistance = distanceUnit === 'miles' ? distanceInMiles : distanceInMiles / 0.621371
    
    setDistance(finalDistance.toFixed(2))
    setActiveMode('distance')
  }

  // Get results based on active mode
  const getResults = () => {
    if (activeMode === 'pace') {
      const pSecs = timeToSeconds(0, paceMinutes, paceSeconds)
      const dInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
      const sMph = dInMiles > 0 ? (3600 / pSecs) : 0
      const sKph = sMph * 1.60934
      
      return {
        pace: formatPace(pSecs),
        speed: sMph > 0 ? `${sMph.toFixed(2)} mph` : '0 mph',
        speedKph: sKph > 0 ? `${sKph.toFixed(2)} kph` : '0 kph',
        time: formatTime(timeToSeconds(hours, minutes, seconds))
      }
    } else if (activeMode === 'time') {
      const tSecs = timeToSeconds(hours, minutes, seconds)
      const pSecs = timeToSeconds(0, paceMinutes, paceSeconds)
      const dInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
      const sMph = 3600 / pSecs
      const sKph = sMph * 1.60934
      return {
        pace: formatPace(pSecs),
        speed: `${sMph.toFixed(2)} mph`,
        speedKph: `${sKph.toFixed(2)} kph`,
        time: formatTime(tSecs)
      }
    } else if (activeMode === 'distance') {
      const tSecs = timeToSeconds(hours, minutes, seconds)
      const pSecs = timeToSeconds(0, paceMinutes, paceSeconds)
      const sMph = 3600 / pSecs
      const sKph = sMph * 1.60934
      return {
        pace: formatPace(pSecs),
        speed: `${sMph.toFixed(2)} mph`,
        speedKph: `${sKph.toFixed(2)} kph`,
        time: formatTime(tSecs),
        distance: `${parseFloat(distance).toFixed(2)} ${distanceUnit}`
      }
    }
    return {}
  }

  const results = getResults()

  // Generate split table
  const generateSplitTable = () => {
    if (!activeMode || !distance) return []
    
    const tSecs = timeToSeconds(hours, minutes, seconds)
    const dInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
    if (!dInMiles) return []
    const pSecs = tSecs / dInMiles
    
    const splits = []
    const numSplits = Math.min(Math.ceil(dInMiles), 50)
    
    for (let i = 1; i <= numSplits; i++) {
      const splitTime = pSecs * i
      splits.push({
        mile: i,
        time: formatTime(splitTime)
      })
    }
    
    return splits
  }

  const splitTable = generateSplitTable()

  return (
    <>
      <Helmet>
        <title>Pace Calculator — Running, Cycling & Walking | CalcLogic</title>
        <meta name="description" content="Free pace calculator for runners, cyclists, and walkers. Instantly convert between pace, speed, and finish time for any distance — 5K, 10K, half marathon, and marathon." />
        <meta name="keywords" content="pace calculator, running pace calculator, min per mile calculator, marathon pace calculator, 5k pace calculator" />
        <link rel="canonical" href="https://calclogic.com/sports/pace-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Pace Calculator — Running, Cycling & Walking" />
        <meta property="og:description" content="Free pace calculator for runners, cyclists, and walkers. Instantly convert between pace, speed, and finish time." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports/pace-calculator" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Pace Calculator — Running, Cycling & Walking" />
        <meta name="twitter:description" content="Free pace calculator for runners, cyclists, and walkers. Instantly convert between pace, speed, and finish time." />

        {/* SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Pace Calculator",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Calculate running, cycling, or walking pace, speed, and finish time instantly."
          }
          `}
        </script>

        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a good running pace for beginners?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good beginner running pace is typically between 10:00–12:00 minutes per mile (6:12–7:27 per km). The most important thing is to run at a conversational pace where you can speak in short sentences."
                }
              },
              {
                "@type": "Question",
                "name": "How do I convert pace to speed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Divide 60 by your pace in minutes. For example, a 8:00/mile pace equals 60 ÷ 8 = 7.5 mph. Our calculator does this conversion automatically."
                }
              },
              {
                "@type": "Question",
                "name": "What pace do I need to run a sub-4 hour marathon?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "To finish a marathon in under 4 hours, you need to maintain a pace of approximately 9:09 per mile (5:41 per kilometer) for all 26.2 miles."
                }
              },
              {
                "@type": "Question",
                "name": "Is pace the same for running and cycling?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The concept is the same but the numbers differ significantly. Cyclists typically move 3–5× faster than runners, so cycling pace is usually measured in mph or kph rather than min/mile."
                }
              }
            ]
          }
          `}
        </script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Pace Calculator</h1>
          <p className="calculator-description">
            Calculate your running pace, speed, and finish time for any distance. Perfect for runners, cyclists, and walkers.
          </p>
        </div>

        <form className="calculator-form" onSubmit={(e) => e.preventDefault()}>
          <div className="input-section">
            <h2>Unit System</h2>
            <div className="input-group">
              <label>
                <input
                  type="radio"
                  value="miles"
                  checked={distanceUnit === 'miles'}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                />
                Imperial (miles)
              </label>
              <label>
                <input
                  type="radio"
                  value="kilometers"
                  checked={distanceUnit === 'kilometers'}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                />
                Metric (kilometers)
              </label>
            </div>
          </div>

          <div className="input-section">
            <h2>Enter Your Information</h2>
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="distance">Distance</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Enter distance"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label>Time</label>
                <div className="time-inputs">
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="HH"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="MM"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    placeholder="SS"
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label>Pace</label>
                <div className="pace-inputs">
                  <input
                    type="number"
                    value={paceMinutes}
                    onChange={(e) => setPaceMinutes(e.target.value)}
                    placeholder="MM"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={paceSeconds}
                    onChange={(e) => setPaceSeconds(e.target.value)}
                    placeholder="SS"
                  />
                  <span className="input-unit">per {paceUnit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="input-section">
            <h2>Quick Race Distances</h2>
            <div className="race-presets">
              {Object.entries(racePresets).map(([race, data]) => (
                <button
                  key={race}
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setDistance(data.distance.toString())
                    setDistanceUnit(data.unit)
                  }}
                >
                  {race}
                </button>
              ))}
            </div>
          </div>

          <div className="input-section">
            <div className="button-group">
              <button type="button" className="calculate-btn" onClick={calculatePace}>Calculate Pace</button>
              <button type="button" className="calculate-btn" onClick={calculateTime}>Calculate Time</button>
              <button type="button" className="calculate-btn" onClick={calculateDistance}>Calculate Distance</button>
            </div>
          </div>
        </form>

        {activeMode && (
          <div className="results-section">
            <h2>Results</h2>
            <div className="results-grid">
              <div className="result-card">
                <h3>Your Pace</h3>
                <div className="result-value">{results.pace}</div>
                <div className="result-unit">per {paceUnit}</div>
              </div>
              <div className="result-card">
                <h3>Your Speed</h3>
                <div className="result-value">{results.speed}</div>
                <div className="result-value">{results.speedKph}</div>
              </div>
              <div className="result-card">
                <h3>Finish Time</h3>
                <div className="result-value">{results.time}</div>
              </div>
              {results.distance && (
                <div className="result-card">
                  <h3>Total Distance</h3>
                  <div className="result-value">{results.distance}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {splitTable.length > 0 && (
          <div className="results-section">
            <h2>Mile/Kilometer Splits</h2>
            <div className="split-table">
              <div className="split-header">
                <span>Mile/Km</span>
                <span>Time</span>
              </div>
              {splitTable.map((split, index) => (
                <div key={index} className={`split-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <span>{split.mile}</span>
                  <span>{split.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="info-sections">
          <div className="info-section">
            <h2>What is a Running Pace?</h2>
            <p>Your running pace is the amount of time it takes you to cover one mile or one kilometer. It's expressed as minutes per mile (min/mi) or minutes per kilometer (min/km) and is the most common way runners track and compare their speed.</p>
            <p>For example, a pace of 9:00/mile means you run one mile every nine minutes. At that pace, you'd finish a 5K in about 27:58 and a marathon in roughly 3:55:58.</p>
          </div>

          <div className="info-section">
            <h2>How to Calculate Running Pace</h2>
            <p>The formula for pace is straightforward:</p>
            <div className="formula-box"><code>Pace = Total Time ÷ Distance</code></div>
            <p>If you run 5 kilometers in 30 minutes, your pace is 6:00 per kilometer (or about 9:39 per mile).</p>
            <p>You can also work backwards:</p>
            <ul className="formula-list">
              <li>To find finish time: <code>Finish Time = Pace × Distance</code></li>
              <li>To find distance covered: <code>Distance = Total Time ÷ Pace</code></li>
            </ul>
          </div>

          <div className="info-section">
            <h2>Common Race Pace Reference Table</h2>
            <div className="table-container">
              <table className="pace-table">
                <thead>
                  <tr>
                    <th>Finish Goal</th>
                    <th>5K Pace</th>
                    <th>10K Pace</th>
                    <th>Half Marathon Pace</th>
                    <th>Marathon Pace</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>20 min 5K</td><td>6:26/mi</td><td>6:26/mi</td><td>—</td><td>—</td></tr>
                  <tr><td>45 min 10K</td><td>—</td><td>7:15/mi</td><td>—</td><td>—</td></tr>
                  <tr><td>Sub 2hr Half</td><td>—</td><td>—</td><td>9:09/mi</td><td>—</td></tr>
                  <tr><td>Sub 4hr Marathon</td><td>—</td><td>—</td><td>—</td><td>9:09/mi</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="info-section">
            <h2>Pace vs. Speed — What's the Difference?</h2>
            <p>Pace and speed measure the same thing from opposite directions:</p>
            <ul className="formula-list">
              <li><strong>Pace</strong> tells you how long it takes to cover a fixed distance (time per mile/km).</li>
              <li><strong>Speed</strong> tells you how far you travel in a fixed time (miles or km per hour).</li>
            </ul>
            <p>Most runners prefer pace because it maps directly to race planning — knowing your min/mile tells you instantly when you'll cross each mile marker.</p>
          </div>

          <div className="info-section">
            <h2>5 Tips to Improve Your Running Pace</h2>
            <ol className="tips-list">
              <li><strong>Run easy 80% of the time.</strong> Most runners improve by slowing down their easy runs so they can push harder in speed workouts.</li>
              <li><strong>Add one interval session per week.</strong> Short, fast repeats (400m–1 mile) build speed without excessive fatigue.</li>
              <li><strong>Track your pace consistently.</strong> Use this calculator before every race to set realistic targets based on your recent training.</li>
              <li><strong>Account for elevation.</strong> Uphill segments slow your pace — a good rule is to add ~30 seconds/mile for every 100 feet of gain.</li>
              <li><strong>Build endurance gradually.</strong> Increase your long run distance by no more than 10% per week to avoid injury and build sustainable speed.</li>
            </ol>
          </div>

          <div className="info-section">
            <h2>Related Calculators</h2>
            <div className="calculator-grid">
              <div className="calculator-card">
                <div className="calculator-icon"><i className="fas fa-weight"></i></div>
                <h3>BMI Calculator</h3>
                <p>Calculate your Body Mass Index and see your weight category.</p>
                <a href="/bmi-calculator" className="calculator-btn">Try BMI Calculator</a>
              </div>
              <div className="calculator-card">
                <div className="calculator-icon"><i className="fas fa-fire"></i></div>
                <h3>Calorie Calculator</h3>
                <p>Calculate daily calorie needs and track your nutrition.</p>
                <a href="/calorie-calculator" className="calculator-btn">Try Calorie Calculator</a>
              </div>
              <div className="calculator-card">
                <div className="calculator-icon"><i className="fas fa-heartbeat"></i></div>
                <h3>VO2 Max Calculator</h3>
                <p>Calculate your maximum oxygen uptake. Coming soon!</p>
                <div className="calculator-btn disabled">Coming Soon</div>
              </div>
              <div className="calculator-card">
                <div className="calculator-icon"><i className="fas fa-futbol"></i></div>
                <h3>Fantasy Football Calculator</h3>
                <p>Calculate fantasy points and draft values. Coming soon!</p>
                <div className="calculator-btn disabled">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>

        <ShareButtons 
          title="Pace Calculator - Free Running & Sports Calculator"
          description="Calculate running pace, speed, and finish time instantly. Perfect for runners, cyclists, and walkers."
          customMessage="Check out this amazing pace calculator for runners and athletes!"
        />
      </div>
    </>
  )
}

export default PaceCalculator
