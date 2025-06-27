import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="enhanced-footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
          <path fill="#1e2a38" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,53.3C672,53,768,75,864,80C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-section about">
          <h4>CalcLogic</h4>
          <p>Your go-to resource for free online calculators. Simple, accurate, and accessible for everyday needs.</p>
          <div className="social-icons">
            <a href="https://facebook.com/calclogic" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com/company/calclogic" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://instagram.com/calclogic" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
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
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p><i className="fas fa-envelope"></i> contact@calclogic.com</p>
          <div className="newsletter">
            <input type="email" placeholder="Subscribe to newsletter" />
            <button><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {new Date().getFullYear()} CalcLogic | All Rights Reserved
        </div>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer