import React, { useState, useEffect } from 'react'

const UnitConverter = () => {
  const [conversionType, setConversionType] = useState('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')

  // Unit definitions
  const units = {
    length: {
      meter: { name: 'Meter (m)', factor: 1 },
      kilometer: { name: 'Kilometer (km)', factor: 1000 },
      centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
      millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
      mile: { name: 'Mile (mi)', factor: 1609.34 },
      yard: { name: 'Yard (yd)', factor: 0.9144 },
      foot: { name: 'Foot (ft)', factor: 0.3048 },
      inch: { name: 'Inch (in)', factor: 0.0254 }
    },
    weight: {
      kilogram: { name: 'Kilogram (kg)', factor: 1 },
      gram: { name: 'Gram (g)', factor: 0.001 },
      milligram: { name: 'Milligram (mg)', factor: 1e-6 },
      pound: { name: 'Pound (lb)', factor: 0.453592 },
      ounce: { name: 'Ounce (oz)', factor: 0.0283495 },
      stone: { name: 'Stone (st)', factor: 6.35029 },
      metric_ton: { name: 'Metric Ton (t)', factor: 1000 }
    },
    temperature: {
      celsius: { name: 'Celsius (°C)', toBase: c => c, fromBase: c => c },
      fahrenheit: { name: 'Fahrenheit (°F)', toBase: f => (f - 32) * 5/9, fromBase: c => (c * 9/5) + 32 },
      kelvin: { name: 'Kelvin (K)', toBase: k => k - 273.15, fromBase: c => c + 273.15 }
    },
    volume: {
      liter: { name: 'Liter (L)', factor: 1 },
      milliliter: { name: 'Milliliter (mL)', factor: 0.001 },
      gallon_us: { name: 'Gallon (US)', factor: 3.78541 },
      quart_us: { name: 'Quart (US qt)', factor: 0.946353 },
      pint_us: { name: 'Pint (US pt)', factor: 0.473176 },
      cup_us: { name: 'Cup (US)', factor: 0.236588 },
      fluid_ounce_us: { name: 'Fluid Ounce (US fl oz)', factor: 0.0295735 },
      gallon_uk: { name: 'Gallon (UK)', factor: 4.54609 },
      pint_uk: { name: 'Pint (UK pt)', factor: 0.568261 },
      fluid_ounce_uk: { name: 'Fluid Ounce (UK fl oz)', factor: 0.0284131 }
    },
    area: {
      square_meter: { name: 'Square Meter (m²)', factor: 1 },
      square_kilometer: { name: 'Square Kilometer (km²)', factor: 1e6 },
      square_mile: { name: 'Square Mile (mi²)', factor: 2.59e6 },
      hectare: { name: 'Hectare (ha)', factor: 10000 },
      acre: { name: 'Acre', factor: 4046.86 },
      square_foot: { name: 'Square Foot (ft²)', factor: 0.092903 },
      square_inch: { name: 'Square Inch (in²)', factor: 0.00064516 }
    },
    speed: {
      mps: { name: 'Meter per second (m/s)', factor: 1 },
      kph: { name: 'Kilometer per hour (km/h)', factor: 1 / 3.6 },
      mph: { name: 'Mile per hour (mph)', factor: 0.44704 },
      knot: { name: 'Knot (kn)', factor: 0.514444 }
    }
  }

  // Populate unit options when conversion type changes
  useEffect(() => {
    const unitData = units[conversionType]
    const unitKeys = Object.keys(unitData)
    setFromUnit(unitKeys[0])
    setToUnit(unitKeys[1] || unitKeys[0])
    setFromValue('')
    setToValue('')
  }, [conversionType])

  // Convert units when inputs change
  useEffect(() => {
    if (fromValue && !isNaN(parseFloat(fromValue))) {
      convertUnits()
    } else {
      setToValue('')
    }
  }, [fromValue, fromUnit, toUnit, conversionType])

  const convertUnits = () => {
    const inputValue = parseFloat(fromValue)
    if (isNaN(inputValue)) {
      setToValue('')
      return
    }

    const unitData = units[conversionType]
    if (!unitData || !unitData[fromUnit] || !unitData[toUnit]) {
      setToValue('Error')
      return
    }

    const fromUnitData = unitData[fromUnit]
    const toUnitData = unitData[toUnit]

    let result

    if (conversionType === 'temperature') {
      // Handle temperature conversion using specific functions
      const baseValue = fromUnitData.toBase(inputValue)
      result = toUnitData.fromBase(baseValue)
    } else {
      // Handle other conversions using factors
      const baseValue = inputValue * fromUnitData.factor
      result = baseValue / toUnitData.factor
    }

    // Display result with appropriate precision
    if (Math.abs(result) < 0.0001 && result !== 0) {
      setToValue(result.toExponential(4))
    } else {
      setToValue(parseFloat(result.toFixed(6)).toString())
    }
  }

  const swapUnits = () => {
    const tempUnit = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempUnit)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Unit Converter</h1>
        <p className="calculator-description">
          Convert between various units of measurement for length, weight, temperature, and more.
        </p>
      </div>

      <div className="calculator-form">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="conversionType">Conversion Type:</label>
            <div className="input-field">
              <select
                id="conversionType"
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value)}
              >
                <option value="length">Length</option>
                <option value="weight">Weight/Mass</option>
                <option value="temperature">Temperature</option>
                <option value="volume">Volume</option>
                <option value="area">Area</option>
                <option value="speed">Speed</option>
              </select>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr auto 1fr', 
            gap: '1rem', 
            alignItems: 'end',
            marginTop: '2rem'
          }}>
            {/* From Unit */}
            <div className="input-group">
              <label htmlFor="fromValue">From:</label>
              <div className="input-field">
                <input
                  type="number"
                  id="fromValue"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
              <div className="input-field" style={{ marginTop: '0.5rem' }}>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                >
                  {Object.entries(units[conversionType] || {}).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={swapUnits}
              style={{
                background: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}
              title="Swap Units"
            >
              ⇄
            </button>

            {/* To Unit */}
            <div className="input-group">
              <label htmlFor="toValue">To:</label>
              <div className="input-field">
                <input
                  type="text"
                  id="toValue"
                  value={toValue}
                  placeholder="Result"
                  readOnly
                  style={{ background: '#f8fafc' }}
                />
              </div>
              <div className="input-field" style={{ marginTop: '0.5rem' }}>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                >
                  {Object.entries(units[conversionType] || {}).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <h3>Length</h3>
          <p>Convert between meters, kilometers, feet, miles, inches, yards, and more. Useful for measuring distances, heights, or dimensions.</p>
        </div>
        <div className="info-card">
          <h3>Weight/Mass</h3>
          <p>Switch between kilograms, grams, pounds, ounces, stones, and metric tons. Important for weighing ingredients, objects, or people.</p>
        </div>
        <div className="info-card">
          <h3>Temperature</h3>
          <p>Convert Celsius, Fahrenheit, and Kelvin. Crucial for weather forecasts, scientific experiments, and cooking instructions.</p>
        </div>
        <div className="info-card">
          <h3>Volume</h3>
          <p>Translate between liters, milliliters, gallons (US & UK), quarts, pints, cups, and fluid ounces. Needed for measuring liquids in recipes or capacities.</p>
        </div>
      </div>
    </div>
  )
}

export default UnitConverter