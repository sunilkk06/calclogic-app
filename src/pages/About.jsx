import React from 'react'

const About = () => {
  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>About CalcLogic</h1>
        <p className="calculator-description">Empowering Better Decisions Through Precise Calculations</p>
      </div>

      <div className="hero-image-section" style={{ textAlign: 'center', margin: '2rem 0 3rem 0', padding: '0 1rem' }}>
        <img 
          src="/future-calculator.jpg" 
          alt="Professional calculator with charts and office supplies" 
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            maxHeight: '400px',
            objectFit: 'cover'
          }} 
        />
      </div>

      <div className="calculator-form">
        <div className="input-section">
          <h2>Our Mission</h2>
          <p>At CalcLogic, we're dedicated to making complex calculations simple and accessible. Our suite of calculators helps individuals and professionals make informed decisions about their finances, health, and mathematical computations.</p>
        </div>

        <div className="input-section">
          <h2>Our Values</h2>
          <div className="calculator-grid">
            <div className="calculator-card">
              <div className="calculator-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Accuracy</h2>
              <p>We prioritize precision in all our calculators, ensuring reliable results you can trust.</p>
            </div>
            <div className="calculator-card">
              <div className="calculator-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h2>Accessibility</h2>
              <p>Our tools are designed to be user-friendly and accessible to everyone, regardless of technical expertise.</p>
            </div>
            <div className="calculator-card">
              <div className="calculator-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h2>Privacy</h2>
              <p>Your data security is paramount. We never store or share your personal information.</p>
            </div>
          </div>
        </div>


        <div className="input-section">
          <h2>What Sets Us Apart</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <strong>Comprehensive Suite:</strong> From mortgage calculations to BMI tracking, we offer tools for every need.
            </li>
            <li style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <strong>Real-Time Results:</strong> Get instant calculations with our responsive interface.
            </li>
            <li style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <strong>Educational Resources:</strong> Access our blog and FAQs to better understand your calculations.
            </li>
            <li style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '6px' }}>
              <strong>Regular Updates:</strong> Our calculators are continuously updated to reflect the latest standards and regulations.
            </li>
          </ul>
        </div>

        <div className="input-section">
          <h2>Our Commitment</h2>
          <p>We're committed to continuous improvement and innovation. Our team regularly updates our calculators and adds new features based on user feedback and industry changes. Whether you're planning your financial future, tracking your health goals, or solving complex math problems, CalcLogic is here to help you make informed decisions.</p>
        </div>
      </div>
    </div>
  )
}

export default About