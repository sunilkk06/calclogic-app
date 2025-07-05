import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.nav-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden' // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'visible' : ''}`} onClick={closeMobileMenu}></div>
      <header className="main-header">
        <nav className="nav-container">
          <div className="logo">
            <Link to="/">
              <i className="fas fa-calculator"></i>
              <span>Calc</span><span>Logic</span>
            </Link>
          </div>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>
          
          <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/financial" className={isActive('/financial') ? 'active' : ''} onClick={closeMobileMenu}>
                Financial
              </Link>
            </li>
            <li>
              <Link to="/health" className={isActive('/health') ? 'active' : ''} onClick={closeMobileMenu}>
                Fitness
              </Link>
            </li>
            <li>
              <Link to="/math" className={isActive('/math') ? 'active' : ''} onClick={closeMobileMenu}>
                Math
              </Link>
            </li>
            <li>
              <Link to="/other" className={isActive('/other') ? 'active' : ''} onClick={closeMobileMenu}>
                Other
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Header