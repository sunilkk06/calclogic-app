import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import CalculatorCard from '../components/CalculatorCard'

const Sports = () => {
  const calculators = [
    {
      icon: 'fas fa-running',
      title: 'Pace Calculator',
      description: 'Calculate running pace, speed, and finish time for any distance. Perfect for runners, cyclists, and walkers.',
      path: '/sports/pace-calculator'
    },
    {
      icon: 'fas fa-futbol',
      title: 'Fantasy Football Calculator',
      description: 'Calculate fantasy football points, draft values, and team performance metrics.',
      path: '/sports/fantasy-football-calculator'
    },
    {
      icon: 'fas fa-baseball-ball',
      title: 'Batting Average Calculator',
      description: 'Calculate baseball batting average, on-base percentage, and slugging percentage.',
      path: '/sports/batting-average-calculator'
    },
    {
      icon: 'fas fa-golf-ball',
      title: 'Golf Handicap Calculator',
      description: 'Calculate golf handicap index, course rating, and adjusted gross score.',
      path: '/sports/golf-handicap-calculator'
    },
    {
      icon: 'fas fa-heartbeat',
      title: 'VO2 Max Calculator',
      description: 'Calculate VO2 max, aerobic capacity, and cardiovascular fitness levels.',
      path: '/sports/vo2-max-calculator'
    },
    {
      icon: 'fas fa-dumbbell',
      title: 'One Rep Max Calculator',
      description: 'Estimate your one rep max for bench press, squat, deadlift and any lift. Includes training zones and strength standards.',
      path: '/sports/one-rep-max-calculator'
    },
    {
      icon: 'fas fa-basketball-ball',
      title: 'True Shooting % Calculator',
      description: 'Calculate True Shooting % (TS%) and Effective Field Goal % (eFG%) for any basketball player. Includes NBA efficiency ratings and historical comparisons.',
      path: '/sports/true-shooting-calculator'
    },
    {
      icon: 'fas fa-cricket-ball',
      title: 'Net Run Rate Calculator',
      description: 'Calculate cricket Net Run Rate (NRR) for IPL, T20 and ODI matches. Includes tournament NRR, required NRR for qualification, and what-if scenarios.',
      path: '/sports/net-run-rate-calculator'
    },
    {
      icon: 'fas fa-futbol',
      title: 'Expected Goals Calculator',
      description: 'Calculate Expected Goals (xG) for any soccer shot based on distance, angle, and shot type. Used by Premier League analysts worldwide.',
      path: '/sports/expected-goals-calculator'
    },
    {
      icon: 'fas fa-dumbbell',
      title: 'Wilks Score Calculator',
      description: 'Calculate your Wilks Score, Wilks2, and DOTS score for powerlifting. Compare squat, bench, and deadlift totals across different bodyweights and weight classes.',
      path: '/sports/wilks-calculator'
    },
    {
      icon: 'fas fa-table-tennis-paddle-ball',
      title: 'Pickleball DUPR Rating Calculator',
      badge: '🔥 Trending',
      description: 'Estimate your pickleball DUPR rating from match results or skill self-assessment. Includes complete rating scale from beginner (2.0) to professional (8.0).',
      path: '/sports/pickleball-rating-calculator'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Free Sports Calculators | CalcLogic</title>
        <meta name="description" content="Calculate pace, fantasy points, batting average, golf handicap and more with CalcLogic's free sports calculators. Perfect for athletes and sports fans." />
        <link rel="canonical" href="https://calclogic.com/sports" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Sports Calculators | CalcLogic" />
        <meta property="og:description" content="Calculate pace, fantasy points, batting average, golf handicap and more with CalcLogic's free sports calculators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/sports" />
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Sports Calculators</h1>
          <p className="calculator-description">
            Professional sports calculators for athletes, coaches, and sports fans. From running pace to fantasy football, 
            get accurate calculations for training, competition, and sports analysis.
          </p>
        </div>

        <div className="calculator-grid">
          {calculators.map((calc, index) => (
            <CalculatorCard
              key={index}
              icon={calc.icon}
              title={calc.title}
              description={calc.description}
              path={calc.path}
            />
          ))}
        </div>

        <div className="calculator-form">
          <div className="input-section">
            <h2>Why Choose CalcLogic Sports Calculators?</h2>
            <div className="calculator-grid">
              <div className="calculator-card">
                <div className="calculator-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <h3>Professional Accuracy</h3>
                <p>All calculators use standard sports formulas and measurements trusted by athletes and coaches worldwide.</p>
              </div>
              <div className="calculator-card">
                <div className="calculator-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3>Instant Results</h3>
                <p>Get immediate calculations for pace, fantasy points, averages, and more - no waiting or page reloads.</p>
              </div>
              <div className="calculator-card">
                <div className="calculator-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3>Mobile Optimized</h3>
                <p>Perfect for trackside use, race day calculations, and quick fantasy sports analysis on any device.</p>
              </div>
              <div className="calculator-card">
                <div className="calculator-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Training Insights</h3>
                <p>Not just numbers - get actionable insights to improve your performance and strategy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sports
