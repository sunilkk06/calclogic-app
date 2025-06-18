import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="main-header">
      <nav className="nav-container">
        <div className="logo">
          <Link to="/">
            <i className="fas fa-calculator"></i>
            <span>Calc</span><span>Logic</span>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/financial" className={isActive('/financial') ? 'active' : ''}>
              Financial
            </Link>
          </li>
          <li>
            <Link to="/health" className={isActive('/health') ? 'active' : ''}>
              Fitness
            </Link>
          </li>
          <li>
            <Link to="/math" className={isActive('/math') ? 'active' : ''}>
              Math
            </Link>
          </li>
          <li>
            <Link to="/other" className={isActive('/other') ? 'active' : ''}>
              Other
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header