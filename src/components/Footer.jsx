import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section about">
          <h4>CalcLogic</h4>
          <p>Your go-to resource for free online calculators. Simple, accurate, and accessible for everyday needs.</p>
        </div>
        <div className="footer-section links">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/financial">Financial Calculators</Link></li>
            <li><Link to="/health">Fitness & Health Calculators</Link></li>
            <li><Link to="/math">Math Calculators</Link></li>
            <li><Link to="/other">Other Calculators</Link></li>
          </ul>
        </div>
        <div className="footer-section links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 CalcLogic | All Rights Reserved
      </div>
    </footer>
  )
}

export default Footer