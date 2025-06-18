import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="enhanced-footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#1e2a38" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-section about">
          <h4>CalcLogic</h4>
          <p>Your go-to resource for free online calculators. Simple, accurate, and accessible for everyday needs.</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
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
          <p><i className="fas fa-envelope"></i> support@calclogic.com</p>
          <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
          <div className="newsletter">
            <input type="email" placeholder="Subscribe to our newsletter" />
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