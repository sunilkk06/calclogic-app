import React from 'react'
import { Link } from 'react-router-dom'

const CalculatorCard = ({ icon, title, description, path }) => {
  return (
    <div className="calculator-card">
      <div className="calculator-icon">
        <i className={icon}></i>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link to={path} className="calculator-btn">
        Open Calculator
      </Link>
    </div>
  )
}

export default CalculatorCard