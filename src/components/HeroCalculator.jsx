import React, { useState } from 'react'

const HeroCalculator = () => {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState(0)
  const [isInRadianMode, setIsInRadianMode] = useState(true)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [pendingOperator, setPendingOperator] = useState(null)
  const [storedValue, setStoredValue] = useState(null)

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

  const toggleSign = () => {
    const value = parseFloat(display)
    setDisplay(String(-value))
  }

  const performOperation = (operator) => {
    const operand = parseFloat(display)

    if (storedValue === null) {
      setStoredValue(operand)
    } else if (pendingOperator) {
      const result = calculate(storedValue, operand, pendingOperator)
      setDisplay(String(result))
      setStoredValue(result)
    }

    setWaitingForOperand(true)
    setPendingOperator(operator)
  }

  const calculate = (firstOperand, secondOperand, operator) => {
    switch (operator) {
      case '+': return firstOperand + secondOperand
      case '-': return firstOperand - secondOperand
      case '×': return firstOperand * secondOperand
      case '÷': return firstOperand / secondOperand
      case '=': return secondOperand
      default: return secondOperand
    }
  }

  const calculateResult = () => {
    const operand = parseFloat(display)

    if (storedValue === null) {
      return
    }

    if (pendingOperator) {
      const result = calculate(storedValue, operand, pendingOperator)
      setDisplay(String(result))
      setStoredValue(null)
      setPendingOperator(null)
    }
  }

  const percent = () => {
    const value = parseFloat(display)
    setDisplay(String(value / 100))
  }

  const square = () => {
    const value = parseFloat(display)
    setDisplay(String(value * value))
  }

  const cube = () => {
    const value = parseFloat(display)
    setDisplay(String(value * value * value))
  }

  const power = () => {
    setStoredValue(parseFloat(display))
    setPendingOperator('power')
    setWaitingForOperand(true)
  }

  const squareRoot = () => {
    const value = parseFloat(display)
    setDisplay(String(Math.sqrt(value)))
  }

  const exponential = () => {
    const value = parseFloat(display)
    setDisplay(String(Math.exp(value)))
  }

  const powerOfTen = () => {
    const value = parseFloat(display)
    setDisplay(String(Math.pow(10, value)))
  }

  // Trigonometric functions
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
  }

  const toDegrees = (radians) => {
    return radians * (180 / Math.PI)
  }

  const sin = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? 
      Math.sin(value) : 
      Math.sin(toRadians(value))
    setDisplay(String(result))
  }

  const cos = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? 
      Math.cos(value) : 
      Math.cos(toRadians(value))
    setDisplay(String(result))
  }

  const tan = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? 
      Math.tan(value) : 
      Math.tan(toRadians(value))
    setDisplay(String(result))
  }

  const asin = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? 
      Math.asin(value) : 
      toDegrees(Math.asin(value))
    setDisplay(String(result))
  }

  const acos = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? 
      Math.acos(value) : 
      toDegrees(Math.acos(value))
    setDisplay(String(result))
  }

  const atan = () => {
    const value = parseFloat(display)
    const result = isInRadianMode ? 
      Math.atan(value) : 
      toDegrees(Math.atan(value))
    setDisplay(String(result))
  }

  const pi = () => {
    setDisplay(String(Math.PI))
    setWaitingForOperand(true)
  }

  const e = () => {
    setDisplay(String(Math.E))
    setWaitingForOperand(true)
  }

  // Memory functions
  const memoryRecall = () => {
    setDisplay(String(memory))
    setWaitingForOperand(true)
  }

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display))
  }

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display))
  }

  const toggleMode = () => {
    setIsInRadianMode(!isInRadianMode)
  }

  return (
    <div className="calculator-widget">
      <div className="calculator-display">
        {display}
      </div>
      
      <div className="mode-toggle">
        <button 
          className={isInRadianMode ? 'active' : ''} 
          onClick={toggleMode}
        >
          Rad
        </button>
        <button 
          className={!isInRadianMode ? 'active' : ''} 
          onClick={toggleMode}
        >
          Deg
        </button>
      </div>
      
      <div className="calculator-buttons">
        <button onClick={asin}>sin<sup>-1</sup></button>
        <button onClick={acos}>cos<sup>-1</sup></button>
        <button onClick={atan}>tan<sup>-1</sup></button>
        <button onClick={pi}>π</button>
        <button onClick={e}>e</button>
        
        <button onClick={square}>x<sup>2</sup></button>
        <button onClick={cube}>x<sup>3</sup></button>
        <button onClick={power}>x<sup>y</sup></button>
        <button onClick={exponential}>e<sup>x</sup></button>
        <button onClick={powerOfTen}>10<sup>x</sup></button>
        
        <button onClick={() => inputDigit(7)}>7</button>
        <button onClick={() => inputDigit(8)}>8</button>
        <button onClick={() => inputDigit(9)}>9</button>
        <button onClick={() => performOperation('+')}>+</button>
        <button onClick={clear}>C</button>
        
        <button onClick={() => inputDigit(4)}>4</button>
        <button onClick={() => inputDigit(5)}>5</button>
        <button onClick={() => inputDigit(6)}>6</button>
        <button onClick={() => performOperation('-')}>-</button>
        <button onClick={memoryAdd}>M+</button>
        
        <button onClick={() => inputDigit(1)}>1</button>
        <button onClick={() => inputDigit(2)}>2</button>
        <button onClick={() => inputDigit(3)}>3</button>
        <button onClick={() => performOperation('×')}>×</button>
        <button onClick={memorySubtract}>M-</button>
        
        <button onClick={() => inputDigit(0)}>0</button>
        <button onClick={inputDecimal}>.</button>
        <button onClick={calculateResult}>=</button>
        <button onClick={() => performOperation('÷')}>÷</button>
        <button onClick={memoryRecall}>MR</button>
      </div>
    </div>
  )
}

export default HeroCalculator