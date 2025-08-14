import React, { useState } from 'react'

const HeroCalculator = () => {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [isInRadianMode, setIsInRadianMode] = useState(false)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [pendingOperator, setPendingOperator] = useState(null)
  const [storedValue, setStoredValue] = useState(null)

  // Helper function to format display
  const formatDisplay = (value) => {
    if (value === 'Error' || value === 'Infinity' || value === '-Infinity') return value
    const num = parseFloat(value)
    if (isNaN(num)) return '0'
    if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
      return num.toExponential(6)
    }
    return num.toString().length > 12 ? num.toPrecision(8) : num.toString()
  }

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setWaitingForOperand(false)
    setPendingOperator(null)
    setStoredValue(null)
  }

  const clearAll = () => {
    clear()
    setMemory(0)
  }

  const performOperation = (operator) => {
    const operand = parseFloat(display)

    if (storedValue === null) {
      setStoredValue(operand)
    } else if (pendingOperator && !waitingForOperand) {
      const result = calculate(storedValue, operand, pendingOperator)
      setDisplay(formatDisplay(result))
      setStoredValue(result)
    }

    setWaitingForOperand(true)
    setPendingOperator(operator)
  }

  const calculate = (firstOperand, secondOperand, operator) => {
    try {
      switch (operator) {
        case '+': return firstOperand + secondOperand
        case '-': return firstOperand - secondOperand
        case '×': return firstOperand * secondOperand
        case '÷': 
          if (secondOperand === 0) return 'Error'
          return firstOperand / secondOperand
        case 'x^y': return Math.pow(firstOperand, secondOperand)
        case '=': return secondOperand
        default: return secondOperand
      }
    } catch {
      return 'Error'
    }
  }

  const calculateResult = () => {
    const operand = parseFloat(display)

    if (storedValue === null || pendingOperator === null) {
      return
    }

    const result = calculate(storedValue, operand, pendingOperator)
    setDisplay(formatDisplay(result))
    setStoredValue(null)
    setPendingOperator(null)
    setWaitingForOperand(true)
  }

  // Trigonometric functions
  const toRadians = (degrees) => degrees * (Math.PI / 180)
  const toDegrees = (radians) => radians * (180 / Math.PI)

  const sin = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? Math.sin(value) : Math.sin(toRadians(value))
    setDisplay(formatDisplay(result))
    setWaitingForOperand(true)
  }

  const cos = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? Math.cos(value) : Math.cos(toRadians(value))
    setDisplay(formatDisplay(result))
    setWaitingForOperand(true)
  }

  const tan = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? Math.tan(value) : Math.tan(toRadians(value))
    setDisplay(formatDisplay(result))
    setWaitingForOperand(true)
  }

  const log = () => {
    const value = parseFloat(display)
    if (value <= 0) {
      setDisplay('Error')
    } else {
      setDisplay(formatDisplay(Math.log10(value)))
    }
    setWaitingForOperand(true)
  }

  const ln = () => {
    const value = parseFloat(display)
    if (value <= 0) {
      setDisplay('Error')
    } else {
      setDisplay(formatDisplay(Math.log(value)))
    }
    setWaitingForOperand(true)
  }

  const reciprocal = () => {
    const value = parseFloat(display)
    if (value === 0) {
      setDisplay('Error')
    } else {
      setDisplay(formatDisplay(1 / value))
    }
    setWaitingForOperand(true)
  }

  const square = () => {
    const value = parseFloat(display)
    setDisplay(formatDisplay(value * value))
    setWaitingForOperand(true)
  }

  const cube = () => {
    const value = parseFloat(display)
    setDisplay(formatDisplay(Math.pow(value, 3)))
    setWaitingForOperand(true)
  }

  const power = () => {
    performOperation('x^y')
  }

  const squareRoot = () => {
    const value = parseFloat(display)
    if (value < 0) {
      setDisplay('Error')
    } else {
      setDisplay(formatDisplay(Math.sqrt(value)))
    }
    setWaitingForOperand(true)
  }

  const exponential = () => {
    const value = parseFloat(display)
    setDisplay(formatDisplay(Math.exp(value)))
    setWaitingForOperand(true)
  }

  const powerOfTen = () => {
    const value = parseFloat(display)
    setDisplay(formatDisplay(Math.pow(10, value)))
    setWaitingForOperand(true)
  }

  const pi = () => {
    setDisplay(formatDisplay(Math.PI))
    setWaitingForOperand(true)
  }

  const e = () => {
    setDisplay(formatDisplay(Math.E))
    setWaitingForOperand(true)
  }

  const percent = () => {
    const value = parseFloat(display)
    setDisplay(formatDisplay(value / 100))
    setWaitingForOperand(true)
  }

  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(display))
  }

  const memoryRecall = () => {
    setDisplay(formatDisplay(memory))
    setWaitingForOperand(true)
  }

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display))
  }

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display))
  }

  const memoryClear = () => {
    setMemory(0)
  }

  const toggleMode = () => {
    setIsInRadianMode(!isInRadianMode)
  }

  return (
    <div className="calculator-widget">
      <h3 className="calculator-title">Scientific Calculator</h3>
      <div className="calculator-display">
        {display}
      </div>
      
      <div className="mode-toggle">
        <button 
          className={!isInRadianMode ? 'active' : ''} 
          onClick={toggleMode}
        >
          Deg
        </button>
        <button 
          className={isInRadianMode ? 'active' : ''} 
          onClick={toggleMode}
        >
          Rad
        </button>
      </div>
      
      <div className="calculator-buttons">
        {/* Row 1: Memory and Clear */}
        <button onClick={memoryClear} className="memory-btn">MC</button>
        <button onClick={memoryRecall} className="memory-btn">MR</button>
        <button onClick={memoryAdd} className="memory-btn">M+</button>
        <button onClick={memorySubtract} className="memory-btn">M-</button>
        <button onClick={clearAll} className="clear-btn">C</button>
        
        {/* Row 2: Parentheses and functions */}
        <button onClick={() => setDisplay(display === '0' ? '(' : display + '(')} className="function-btn">(</button>
        <button onClick={() => setDisplay(display === '0' ? ')' : display + ')')} className="function-btn">)</button>
        <button onClick={pi} className="function-btn">π</button>
        <button onClick={e} className="function-btn">e</button>
        <button onClick={power} className="function-btn">^</button>
        
        {/* Row 3: Trig functions */}
        <button onClick={sin} className="trig-btn">sin</button>
        <button onClick={cos} className="trig-btn">cos</button>
        <button onClick={tan} className="trig-btn">tan</button>
        <button onClick={log} className="trig-btn">log</button>
        <button onClick={ln} className="trig-btn">ln</button>
        
        {/* Row 4: Numbers and operations */}
        <button onClick={() => inputDigit(7)} className="number-btn">7</button>
        <button onClick={() => inputDigit(8)} className="number-btn">8</button>
        <button onClick={() => inputDigit(9)} className="number-btn">9</button>
        <button onClick={() => performOperation('÷')} className="operator-btn">÷</button>
        <button onClick={percent} className="function-btn">%</button>
        
        {/* Row 5: Numbers and operations */}
        <button onClick={() => inputDigit(4)} className="number-btn">4</button>
        <button onClick={() => inputDigit(5)} className="number-btn">5</button>
        <button onClick={() => inputDigit(6)} className="number-btn">6</button>
        <button onClick={() => performOperation('×')} className="operator-btn">×</button>
        <button onClick={square} className="function-btn">x²</button>
        
        {/* Row 6: Numbers and operations */}
        <button onClick={() => inputDigit(1)} className="number-btn">1</button>
        <button onClick={() => inputDigit(2)} className="number-btn">2</button>
        <button onClick={() => inputDigit(3)} className="number-btn">3</button>
        <button onClick={() => performOperation('-')} className="operator-btn">-</button>
        <button onClick={cube} className="function-btn">x³</button>
        
        {/* Row 7: Bottom row */}
        <button onClick={() => inputDigit(0)} className="number-btn">0</button>
        <button onClick={inputDecimal} className="number-btn">.</button>
        <button onClick={calculateResult} className="equals-btn">=</button>
        <button onClick={() => performOperation('+')} className="operator-btn">+</button>
        <button onClick={squareRoot} className="function-btn">√</button>
      </div>
    </div>
  )
}

export default HeroCalculator