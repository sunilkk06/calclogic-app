import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ShareButtons from '../../components/ShareButtons';

const FantasyFootballCalculator = () => {
  const [scoringFormat, setScoringFormat] = useState('ppr'); // 'standard', 'half', 'ppr'
  const [stats, setStats] = useState({
    passingYards: '',
    passingTDs: '',
    interceptions: '',
    passingTwoPoint: '',
    rushingYards: '',
    rushingTDs: '',
    rushingTwoPoint: '',
    receptions: '',
    receivingYards: '',
    receivingTDs: '',
    receivingTwoPoint: '',
    fumblesLost: '',
    returnTDs: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePoints = (e) => {
    if (e) e.preventDefault();
    
    const s = {
      passingYards: parseFloat(stats.passingYards) || 0,
      passingTDs: parseFloat(stats.passingTDs) || 0,
      interceptions: parseFloat(stats.interceptions) || 0,
      passingTwoPoint: parseFloat(stats.passingTwoPoint) || 0,
      rushingYards: parseFloat(stats.rushingYards) || 0,
      rushingTDs: parseFloat(stats.rushingTDs) || 0,
      rushingTwoPoint: parseFloat(stats.rushingTwoPoint) || 0,
      receptions: parseFloat(stats.receptions) || 0,
      receivingYards: parseFloat(stats.receivingYards) || 0,
      receivingTDs: parseFloat(stats.receivingTDs) || 0,
      receivingTwoPoint: parseFloat(stats.receivingTwoPoint) || 0,
      fumblesLost: parseFloat(stats.fumblesLost) || 0,
      returnTDs: parseFloat(stats.returnTDs) || 0
    };

    const receptionPts = scoringFormat === 'ppr' ? 1 : scoringFormat === 'half' ? 0.5 : 0;

    const passingPts =
      (s.passingYards * 0.04) +
      (s.passingTDs * 4) +
      (s.interceptions * -2) +
      (s.passingTwoPoint * 2);

    const rushingPts =
      (s.rushingYards * 0.1) +
      (s.rushingTDs * 6) +
      (s.rushingTwoPoint * 2);

    const receivingPts =
      (s.receptions * receptionPts) +
      (s.receivingYards * 0.1) +
      (s.receivingTDs * 6) +
      (s.receivingTwoPoint * 2);

    const miscPts =
      (s.fumblesLost * -2) +
      (s.returnTDs * 6);

    const total = passingPts + rushingPts + receivingPts + miscPts;

    setResults({
      passing: passingPts.toFixed(2),
      rushing: rushingPts.toFixed(2),
      receiving: receivingPts.toFixed(2),
      misc: miscPts.toFixed(2),
      total: total.toFixed(2),
      format: scoringFormat === 'ppr' ? 'PPR Scoring' : scoringFormat === 'half' ? 'Half PPR Scoring' : 'Standard Scoring'
    });
  };

  const presets = {
    eliteQB: {
      passingYards: '300', passingTDs: '3', interceptions: '0', passingTwoPoint: '0',
      rushingYards: '0', rushingTDs: '0', rushingTwoPoint: '0',
      receptions: '0', receivingYards: '0', receivingTDs: '0', receivingTwoPoint: '0',
      fumblesLost: '0', returnTDs: '0'
    },
    rb1: {
      passingYards: '0', passingTDs: '0', interceptions: '0', passingTwoPoint: '0',
      rushingYards: '100', rushingTDs: '1', rushingTwoPoint: '0',
      receptions: '5', receivingYards: '40', receivingTDs: '0', receivingTwoPoint: '0',
      fumblesLost: '0', returnTDs: '0'
    },
    wr1: {
      passingYards: '0', passingTDs: '0', interceptions: '0', passingTwoPoint: '0',
      rushingYards: '0', rushingTDs: '0', rushingTwoPoint: '0',
      receptions: '8', receivingYards: '120', receivingTDs: '1', receivingTwoPoint: '0',
      fumblesLost: '0', returnTDs: '0'
    },
    flex: {
      passingYards: '0', passingTDs: '0', interceptions: '0', passingTwoPoint: '0',
      rushingYards: '0', rushingTDs: '0', rushingTwoPoint: '0',
      receptions: '4', receivingYards: '55', receivingTDs: '0', receivingTwoPoint: '0',
      fumblesLost: '0', returnTDs: '0'
    }
  };

  const applyPreset = (presetKey) => {
    setStats(presets[presetKey]);
    if (presetKey === 'wr1') setScoringFormat('ppr');
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fantasy Football Points Calculator",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0" },
    "description": "Calculate fantasy football points for PPR, standard, and half-PPR scoring leagues instantly."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What does PPR mean in fantasy football?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PPR stands for 'Points Per Reception.' In a PPR league, a player earns 1 fantasy point for every pass they catch, in addition to points for yards and touchdowns. Half-PPR leagues award 0.5 points per reception instead."
        }
      },
      {
        "@type": "Question",
        "name": "How many fantasy points is a touchdown worth?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rushing and receiving touchdowns are worth 6 fantasy points in most leagues. Passing touchdowns are worth 4 points in standard scoring, though some leagues award 6 points for passing TDs as well."
        }
      },
      {
        "@type": "Question",
        "name": "How are passing yards scored in fantasy football?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In most fantasy leagues, passing yards are scored at 0.04 points per yard — meaning 1 point for every 25 passing yards. So a quarterback with 300 passing yards earns 12 fantasy points from yards alone."
        }
      },
      {
        "@type": "Question",
        "name": "Do fumbles lost cost fantasy points?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, in most leagues a fumble that is lost to the opposing team costs the player 2 fantasy points. Fumbles recovered by the player's own team typically do not cost any points."
        }
      },
      {
        "@type": "Question",
        "name": "What is the highest fantasy score ever recorded?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Several NFL performances have generated 60+ fantasy points in a single game in PPR scoring. Huge games combining 4+ TDs with 150+ yards from scrimmage and 8+ receptions in PPR leagues can approach these totals. Use our calculator to score any historical stat line."
        }
      }
    ]
  };

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Fantasy Football Points Calculator — PPR, Standard & Half PPR | CalcLogic</title>
        <meta name="description" content="Free fantasy football points calculator for PPR, standard, and half-PPR leagues. Instantly calculate player scores from passing yards, rushing TDs, receptions, and more." />
        <meta name="keywords" content="fantasy football points calculator, PPR calculator, fantasy football score calculator, fantasy points calculator, half PPR calculator" />
        <link rel="canonical" href="https://calclogic.com/sports/fantasy-football-calculator" />
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Fantasy Football Points Calculator</h1>
          <p className="calculator-description">
            Calculate fantasy football points for PPR, standard, and half-PPR scoring leagues instantly.
          </p>
        </div>

        <div className="calculator-form">
          <div className="input-section">
            <h2>Scoring Format</h2>
            <div className="toggle-group ppr-toggle">
              <button 
                className={`toggle-btn ${scoringFormat === 'standard' ? 'active' : ''}`}
                onClick={() => setScoringFormat('standard')}
              >Standard</button>
              <button 
                className={`toggle-btn ${scoringFormat === 'half' ? 'active' : ''}`}
                onClick={() => setScoringFormat('half')}
              >Half PPR</button>
              <button 
                className={`toggle-btn ${scoringFormat === 'ppr' ? 'active' : ''}`}
                onClick={() => setScoringFormat('ppr')}
              >PPR</button>
            </div>
          </div>

          <form onSubmit={calculatePoints}>
            {/* Passing Stats */}
            <div className="input-section stats-group">
              <h3 className="section-subtitle">🏈 Passing Stats</h3>
              <div className="stats-grid">
                <div className="input-group">
                  <label>Passing Yards</label>
                  <input type="number" name="passingYards" value={stats.passingYards} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>Passing TDs</label>
                  <input type="number" name="passingTDs" value={stats.passingTDs} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>Interceptions</label>
                  <input type="number" name="interceptions" value={stats.interceptions} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>2-Pt Conv (Pass)</label>
                  <input type="number" name="passingTwoPoint" value={stats.passingTwoPoint} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
              </div>
            </div>

            {/* Rushing Stats */}
            <div className="input-section stats-group">
              <h3 className="section-subtitle">🏃 Rushing Stats</h3>
              <div className="stats-grid">
                <div className="input-group">
                  <label>Rushing Yards</label>
                  <input type="number" name="rushingYards" value={stats.rushingYards} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>Rushing TDs</label>
                  <input type="number" name="rushingTDs" value={stats.rushingTDs} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>2-Pt Conv (Rush)</label>
                  <input type="number" name="rushingTwoPoint" value={stats.rushingTwoPoint} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
              </div>
            </div>

            {/* Receiving Stats */}
            <div className="input-section stats-group">
              <h3 className="section-subtitle">🙌 Receiving Stats</h3>
              <div className="stats-grid">
                <div className="input-group">
                  <label>Receptions</label>
                  <input type="number" name="receptions" value={stats.receptions} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>Receiving Yards</label>
                  <input type="number" name="receivingYards" value={stats.receivingYards} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>Receiving TDs</label>
                  <input type="number" name="receivingTDs" value={stats.receivingTDs} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>2-Pt Conv (Rec)</label>
                  <input type="number" name="receivingTwoPoint" value={stats.receivingTwoPoint} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
              </div>
            </div>

            {/* Misc Stats */}
            <div className="input-section stats-group">
              <h3 className="section-subtitle">💥 Misc / Bonus</h3>
              <div className="stats-grid">
                <div className="input-group">
                  <label>Fumbles Lost</label>
                  <input type="number" name="fumblesLost" value={stats.fumblesLost} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
                <div className="input-group">
                  <label>Return TDs</label>
                  <input type="number" name="returnTDs" value={stats.returnTDs} onChange={handleInputChange} placeholder="0" step="1" />
                </div>
              </div>
            </div>

            <div className="calculate-section">
              <button type="submit" className="calculate-btn">Calculate Fantasy Points</button>
            </div>
          </form>

          <div className="input-section">
            <h2>Quick-Fill Examples</h2>
            <div className="preset-grid">
              <button className="preset-btn" onClick={() => applyPreset('eliteQB')}>Elite QB</button>
              <button className="preset-btn" onClick={() => applyPreset('rb1')}>RB1 Week</button>
              <button className="preset-btn" onClick={() => applyPreset('wr1')}>WR1 Week</button>
              <button className="preset-btn" onClick={() => applyPreset('flex')}>Flex Play</button>
            </div>
          </div>
        </div>

        {results && (
          <div className="results-section ff-results">
            <div className="result-card highlight">
              <h2>Total Fantasy Points</h2>
              <div className="result-value-large">{results.total} <span className="pts-label">pts</span></div>
              <p className="scoring-indicator">{results.format}</p>
              <hr className="result-divider" />
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <span>Passing:</span>
                  <strong>{results.passing}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Rushing:</span>
                  <strong>{results.rushing}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Receiving:</span>
                  <strong>{results.receiving}</strong>
                </div>
                <div className="breakdown-item">
                  <span>Misc:</span>
                  <strong>{results.misc}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Sections */}
        <div className="info-sections">
          <section className="info-section">
            <h2>What is a Fantasy Football Points Calculator?</h2>
            <p>
              Fantasy football points calculators let you instantly see how many points a player scored — or will score — based on their real-game statistics. Whether you play in a standard, half-PPR, or PPR league, every stat from passing yards to receptions converts into points that determine your weekly winner.
            </p>
            <p>
              Understanding your league's scoring system is one of the most important edges in fantasy football. A wide receiver with 6 receptions for 60 yards and no touchdown scores just 6.0 points in a standard league — but 12.0 points in a full PPR league. That difference changes how you draft, trade, and start/sit players every week.
            </p>
          </section>

          <section className="info-section">
            <h2>How Fantasy Football Points Are Scored</h2>
            <p>Most leagues use one of three scoring formats:</p>
            <ul>
              <li><strong>Standard Scoring</strong> — points are earned only for yards and touchdowns. Receptions earn nothing.</li>
              <li><strong>Half PPR (0.5 per reception)</strong> — the most common format in competitive leagues. Each catch earns 0.5 points, rewarding pass-catching backs and slot receivers.</li>
              <li><strong>PPR (1 point per reception)</strong> — every catch earns 1 full point. This format dramatically boosts the value of high-volume receivers and pass-catching running backs.</li>
            </ul>
            <div className="formula-box">
              <h3>Common point values across all formats:</h3>
              <ul className="formula-list">
                <li>Passing: 1 pt per 25 yards (0.04/yd), 4 pts per TD, -2 pts per interception</li>
                <li>Rushing & Receiving: 1 pt per 10 yards (0.1/yd), 6 pts per TD</li>
                <li>2-point conversions: 2 pts</li>
                <li>Fumbles lost: -2 pts</li>
              </ul>
            </div>
          </section>

          <section className="info-section">
            <h2>PPR vs Standard vs Half PPR — Which Scoring Matters Most?</h2>
            <p>The scoring format you play in should directly influence how you value players at every position:</p>
            <p><strong>Running Backs</strong> — In PPR leagues, pass-catching RBs (like Christian McCaffrey or Austin Ekeler types) become far more valuable. A back with 5 catches per game gets +5 PPR points every week over standard scoring.</p>
            <p><strong>Wide Receivers</strong> — Slot receivers who run short, high-volume routes (think slot WRs with 8+ targets/game) are massively boosted in PPR. Deep threats with fewer catches but big plays are worth more in standard.</p>
            <p><strong>Tight Ends</strong> — Tight ends who are involved in the passing game every week get a huge PPR boost. In standard scoring, only TDs-and-yards TEs are consistently valuable.</p>
            <p><strong>Quarterbacks</strong> — QB scoring is identical across formats (passing yards + TDs - INTs). The format doesn't change QB value.</p>
          </section>

          <section className="info-section">
            <h2>Fantasy Football Points Reference Table</h2>
            <div className="table-container">
              <table className="pace-table">
                <thead>
                  <tr>
                    <th>Statistic</th>
                    <th>Standard</th>
                    <th>Half PPR</th>
                    <th>PPR</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1 Reception</td><td>0 pts</td><td>0.5 pts</td><td>1 pt</td></tr>
                  <tr><td>10 Rushing/Receiving Yards</td><td>1 pt</td><td>1 pt</td><td>1 pt</td></tr>
                  <tr><td>25 Passing Yards</td><td>1 pt</td><td>1 pt</td><td>1 pt</td></tr>
                  <tr><td>Rushing / Receiving TD</td><td>6 pts</td><td>6 pts</td><td>6 pts</td></tr>
                  <tr><td>Passing TD</td><td>4 pts</td><td>4 pts</td><td>4 pts</td></tr>
                  <tr><td>Interception</td><td>-2 pts</td><td>-2 pts</td><td>-2 pts</td></tr>
                  <tr><td>Fumble Lost</td><td>-2 pts</td><td>-2 pts</td><td>-2 pts</td></tr>
                  <tr><td>2-Point Conversion</td><td>2 pts</td><td>2 pts</td><td>2 pts</td></tr>
                  <tr><td>Return TD</td><td>6 pts</td><td>6 pts</td><td>6 pts</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="info-section">
            <h2>Example Fantasy Score Calculations</h2>
            <div className="example-box">
              <p><strong>Example 1 — Elite QB (PPR)</strong></p>
              <ul>
                <li>312 passing yards × 0.04 = 12.48 pts</li>
                <li>3 passing TDs × 4 = 12 pts</li>
                <li>1 interception × -2 = -2 pts</li>
                <li><strong>Total: 22.48 fantasy points</strong></li>
              </ul>
            </div>
            <div className="example-box">
              <p><strong>Example 2 — RB1 Week (Half PPR)</strong></p>
              <ul>
                <li>97 rushing yards × 0.1 = 9.7 pts</li>
                <li>1 rushing TD × 6 = 6 pts</li>
                <li>6 receptions × 0.5 = 3 pts</li>
                <li>44 receiving yards × 0.1 = 4.4 pts</li>
                <li><strong>Total: 23.1 fantasy points</strong></li>
              </ul>
            </div>
            <div className="example-box">
              <p><strong>Example 3 — PPR Wide Receiver</strong></p>
              <ul>
                <li>9 receptions × 1 = 9 pts</li>
                <li>118 receiving yards × 0.1 = 11.8 pts</li>
                <li>1 receiving TD × 6 = 6 pts</li>
                <li><strong>Total: 26.8 fantasy points</strong></li>
              </ul>
            </div>
          </section>

          <section className="info-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-container">
              <div className="faq-item">
                <h3>What does PPR mean in fantasy football?</h3>
                <p>PPR stands for 'Points Per Reception.' In a PPR league, a player earns 1 fantasy point for every pass they catch, in addition to points for yards and touchdowns. Half-PPR leagues award 0.5 points per reception instead.</p>
              </div>
              <div className="faq-item">
                <h3>How many fantasy points is a touchdown worth?</h3>
                <p>Rushing and receiving touchdowns are worth 6 fantasy points in most leagues. Passing touchdowns are worth 4 points in standard scoring, though some leagues award 6 points for passing TDs as well.</p>
              </div>
              <div className="faq-item">
                <h3>How are passing yards scored in fantasy football?</h3>
                <p>In most fantasy leagues, passing yards are scored at 0.04 points per yard — meaning 1 point for every 25 passing yards. So a quarterback with 300 passing yards earns 12 fantasy points from yards alone.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="info-section">
          <h2>Related Calculators</h2>
          <div className="calculator-grid">
            <div className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-running"></i></div>
              <h3>Pace Calculator</h3>
              <p>Calculate your running pace, speed, and finish time for any distance.</p>
              <a href="/sports/pace-calculator" className="calculator-btn">Open Calculator</a>
            </div>
            <div className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-baseball-bat-ball"></i></div>
              <h3>Batting Average Calculator</h3>
              <p>Calculate batting average, slugging percentage, and OPS. Coming soon!</p>
              <div className="calculator-btn disabled">Coming Soon</div>
            </div>
            <div className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-golf-ball-tee"></i></div>
              <h3>Golf Handicap Calculator</h3>
              <p>Calculate your golf handicap index based on your recent scores. Coming soon!</p>
              <div className="calculator-btn disabled">Coming Soon</div>
            </div>
          </div>
        </div>

        <ShareButtons 
          title="Fantasy Football Points Calculator - PPR, Standard & Half PPR"
          description="Calculate fantasy football points for PPR, standard, and half-PPR scoring leagues instantly. Free at CalcLogic."
          customMessage="Check out this fantasy football points calculator!"
        />
      </div>
    </div>
  );
};

export default FantasyFootballCalculator;
