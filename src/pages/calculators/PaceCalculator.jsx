import React, { useState } from 'react'
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
  const [activeMode, setActiveMode] = useState('pace') // pace, time, distance

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
  const calculatePace = () => {
    if (!distance || (!hours && !minutes && !seconds)) return

    const totalSeconds = timeToSeconds(hours, minutes, seconds)
    if (!totalSeconds) return

    const distanceInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
    const paceSecondsPerMile = totalSeconds / distanceInMiles
    
    setPaceMinutes(Math.floor(paceSecondsPerMile / 60))
    setPaceSeconds(Math.round(paceSecondsPerMile % 60))
  }

  // Calculate time based on distance and pace
  const calculateTime = () => {
    if (!distance || (!paceMinutes && !paceSeconds)) return

    const totalPaceSeconds = timeToSeconds(paceMinutes, paceSeconds)
    if (!totalPaceSeconds) return

    const distanceInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
    const totalSeconds = totalPaceSeconds * distanceInMiles
    
    const totalHours = Math.floor(totalSeconds / 3600)
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60)
    const remainingSeconds = Math.round(totalSeconds % 60)
    
    setHours(totalHours)
    setMinutes(totalMinutes)
    setSeconds(remainingSeconds)
  }

  // Calculate distance based on time and pace
  const calculateDistance = () => {
    if ((!hours && !minutes && !seconds) || (!paceMinutes && !paceSeconds)) return

    const totalSeconds = timeToSeconds(hours, minutes, seconds)
    const totalPaceSeconds = timeToSeconds(paceMinutes, paceSeconds)
    
    if (!totalSeconds || !totalPaceSeconds) return

    const distanceInMiles = totalSeconds / totalPaceSeconds
    const finalDistance = distanceUnit === 'miles' ? distanceInMiles : distanceInMiles / 0.621371
    
    setDistance(finalDistance.toFixed(2))
  }

  // Auto-detect which calculation to perform
  const detectMode = () => {
    const hasDistance = distance && parseFloat(distance) > 0
    const hasTime = (hours || minutes || seconds) && timeToSeconds(hours, minutes, seconds) > 0
    const hasPace = (paceMinutes || paceSeconds) && timeToSeconds(paceMinutes, paceSeconds) > 0

    if (hasDistance && hasTime && !hasPace) {
      setActiveMode('pace')
      calculatePace()
    } else if (hasDistance && hasPace && !hasTime) {
      setActiveMode('time')
      calculateTime()
    } else if (hasTime && hasPace && !hasDistance) {
      setActiveMode('distance')
      calculateDistance()
    }
  }

  // Get results based on active mode
  const getResults = () => {
    if (activeMode === 'pace') {
      const paceSeconds = timeToSeconds(paceMinutes, paceSeconds)
      const distanceInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
      const speedMph = distanceInMiles > 0 ? (3600 / paceSeconds) : 0
      const speedKph = distanceUnit === 'kilometers' && parseFloat(distance) > 0 ? (3600 / (paceSeconds * 0.621371)) : speedMph * 1.60934
      
      return {
        pace: formatPace(paceSeconds),
        speed: speedMph > 0 ? `${speedMph.toFixed(2)} mph` : '0 mph',
        speedKph: speedKph > 0 ? `${speedKph.toFixed(2)} kph` : '0 kph',
        time: 'N/A'
      }
    } else if (activeMode === 'time') {
      const totalSeconds = timeToSeconds(hours, minutes, seconds)
      return {
        pace: 'N/A',
        speed: 'N/A',
        speedKph: 'N/A',
        time: formatTime(totalSeconds)
      }
    } else if (activeMode === 'distance') {
      const finalDistance = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance)
      return {
        pace: 'N/A',
        speed: 'N/A',
        speedKph: 'N/A',
        time: 'N/A',
        distance: `${finalDistance.toFixed(2)} ${distanceUnit}`
      }
    }
    return {}
  }

  const results = getResults()

  // Generate split table
  const generateSplitTable = () => {
    if (activeMode !== 'time' || !distance) return []
    
    const totalSeconds = timeToSeconds(hours, minutes, seconds)
    const distanceInMiles = distanceUnit === 'miles' ? parseFloat(distance) : parseFloat(distance) * 0.621371
    const paceSeconds = totalSeconds / distanceInMiles
    
    const splits = []
    const numSplits = Math.ceil(distanceInMiles)
    
    for (let i = 1; i <= numSplits && i <= 26; i++) {
      const splitTime = paceSeconds * i
      splits.push({
        mile: i,
        time: formatTime(splitTime)
      })
    }
    
    return slices
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
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Pace Calculator</h1>
          <p className="calculator-description">
            Calculate your running pace, speed, and finish time for any distance. Perfect for runners, cyclists, and walkers.
          </p>
        </div>

        <div className="calculator-form">
          {/* Unit Toggle */}
          <div className="input-section">
            <div className="unit-toggle">
              <button 
                className={`toggle-btn ${distanceUnit === 'miles' ? 'active' : ''}`}
                onClick={() => setDistanceUnit('miles')}
              >
                Miles
              </button>
              <button 
                className={`toggle-btn ${distanceUnit === 'kilometers' ? 'active' : ''}`}
                onClick={() => setDistanceUnit('kilometers')}
              >
                Kilometers
              </button>
            </div>
          </div>

          {/* Input Fields */}
          <div className="input-section">
            <div className="input-row">
              <div className="input-group">
                <label>Distance</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance"
                  step="0.01"
                />
                <span className="input-unit">{distanceUnit}</span>
              </div>
              
              <div className="input-group">
                <label>Time</label>
                <div className="time-inputs">
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="HH"
                    min="0"
                    max="99"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="MM"
                    min="0"
                    max="59"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    placeholder="SS"
                    min="0"
                    max="59"
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
                    min="0"
                    max="59"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    value={paceSeconds}
                    onChange={(e) => setPaceSeconds(e.target.value)}
                    placeholder="SS"
                    min="0"
                    max="59"
                  />
                  <span className="input-unit">per {paceUnit}</span>
                </div>
              </div>
            </div>

            {/* Race Presets */}
            <div className="input-section">
              <label>Quick Race Distances</label>
              <div className="race-presets">
                {Object.entries(racePresets).map(([race, data]) => (
                  <button
                    key={race}
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

            {/* Calculate Button */}
            <button 
              className="calculate-btn"
              onClick={detectMode}
            >
              Calculate
            </button>
          </div>

          {/* Results */}
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

          {/* Split Table */}
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
        </div>
      </div>
    </>
  )
}

export default PaceCalculator
