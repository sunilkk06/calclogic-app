import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ShareButtons from '../../components/ShareButtons';

const BattingAverageCalculator = () => {
  const [stats, setStats] = useState({
    atBats: '',
    hits: '',
    singles: '',
    doubles: '',
    triples: '',
    homeRuns: '',
    walks: '',
    hitByPitch: '',
    sacFlies: '',
    plateAppearances: ''
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBattingStats = (e) => {
    if (e) e.preventDefault();
    
    const s = {
      atBats: parseFloat(stats.atBats) || 0,
      hits: parseFloat(stats.hits) || 0,
      doubles: parseFloat(stats.doubles) || 0,
      triples: parseFloat(stats.triples) || 0,
      homeRuns: parseFloat(stats.homeRuns) || 0,
      walks: parseFloat(stats.walks) || 0,
      hitByPitch: parseFloat(stats.hitByPitch) || 0,
      sacFlies: parseFloat(stats.sacFlies) || 0,
      plateAppearances: parseFloat(stats.plateAppearances) || 0
    };

    // Batting Average
    const ba = s.atBats > 0 ? s.hits / s.atBats : 0;

    // On-Base Percentage
    const obpNumerator = s.hits + s.walks + s.hitByPitch;
    const obpDenominator = s.atBats + s.walks + s.hitByPitch + s.sacFlies;
    const obp = obpDenominator > 0 ? obpNumerator / obpDenominator : 0;

    // Slugging Percentage
    const singles = s.hits - s.doubles - s.triples - s.homeRuns;
    const totalBases = (singles >= 0 ? singles : 0) + (s.doubles * 2) + (s.triples * 3) + (s.homeRuns * 4);
    const slg = s.atBats > 0 ? totalBases / s.atBats : 0;

    // OPS
    const ops = obp + slg;

    setResults({
      ba: ba.toFixed(3),
      obp: obp.toFixed(3),
      slg: slg.toFixed(3),
      ops: ops.toFixed(3),
      totalBases,
      singles: singles >= 0 ? singles : 0
    });
  };

  const presets = {
    allStar: {
      atBats: '550', hits: '175', doubles: '35', triples: '5', homeRuns: '30',
      walks: '70', hitByPitch: '5', sacFlies: '4', plateAppearances: ''
    },
    average: {
      atBats: '500', hits: '130', doubles: '25', triples: '2', homeRuns: '15',
      walks: '50', hitByPitch: '3', sacFlies: '3', plateAppearances: ''
    },
    leadoff: {
      atBats: '580', hits: '165', doubles: '28', triples: '6', homeRuns: '8',
      walks: '80', hitByPitch: '6', sacFlies: '2', plateAppearances: ''
    },
    power: {
      atBats: '480', hits: '125', doubles: '22', triples: '1', homeRuns: '45',
      walks: '60', hitByPitch: '4', sacFlies: '5', plateAppearances: ''
    }
  };

  const applyPreset = (presetKey) => {
    setStats(presets[presetKey]);
  };

  const getColorClass = (val, type) => {
    const value = parseFloat(val);
    if (type === 'ba') {
      if (value >= 0.300) return 'excellent';
      if (value >= 0.250) return 'average';
      return 'poor';
    }
    if (type === 'obp') {
      if (value >= 0.350) return 'excellent';
      if (value >= 0.300) return 'average';
      return 'poor';
    }
    if (type === 'slg') {
      if (value >= 0.450) return 'excellent';
      if (value >= 0.370) return 'average';
      return 'poor';
    }
    if (type === 'ops') {
      if (value >= 0.800) return 'excellent';
      if (value >= 0.700) return 'average';
      return 'poor';
    }
    return '';
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Batting Average Calculator",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0" },
    "description": "Calculate baseball batting average, on-base percentage, slugging percentage, and OPS instantly."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a good batting average in baseball?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A batting average of .300 or above is considered excellent at the MLB level. The league average typically falls between .240 and .260. Anything below .220 is generally considered poor for a regular starter."
        }
      },
      {
        "@type": "Question",
        "name": "Does a walk count as an at-bat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Walks (BB), hit-by-pitches (HBP), and sacrifice flies (SF) do not count as official at-bats and do not affect batting average. They do count toward on-base percentage (OBP)."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good OPS in baseball?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An OPS above .800 is considered above average in MLB. An OPS above .900 is excellent, and OPS above 1.000 is elite — typically reserved for MVP-caliber seasons. The league average OPS is usually around .720–.740."
        }
      },
      {
        "@type": "Question",
        "name": "How is slugging percentage different from batting average?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Batting average treats all hits equally — a single counts the same as a home run. Slugging percentage weights hits by the number of bases earned, so a home run (4 bases) is worth four times a single (1 base). This makes slugging a better measure of a hitter's power."
        }
      },
      {
        "@type": "Question",
        "name": "What is the highest batting average ever recorded in MLB?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ty Cobb holds the MLB career batting average record at .366. The highest single-season average in the modern era belongs to Rogers Hornsby, who hit .424 in 1924. Ted Williams hit .406 in 1941 — the last time any player finished a season above .400."
        }
      }
    ]
  };

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Batting Average Calculator — BA, OBP, SLG & OPS | CalcLogic</title>
        <meta name="description" content="Free baseball batting average calculator. Instantly calculate batting average (BA), on-base percentage (OBP), slugging percentage (SLG), and OPS from any stat line." />
        <meta name="keywords" content="batting average calculator, baseball stats calculator, OBP calculator, slugging percentage calculator, OPS calculator, baseball batting stats" />
        <link rel="canonical" href="https://calclogic.com/sports/batting-average-calculator" />
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Batting Average Calculator</h1>
          <p className="calculator-description">
            Calculate baseball batting average, on-base percentage, slugging percentage, and OPS instantly.
          </p>
        </div>

        <div className="calculator-form">
          <form onSubmit={calculateBattingStats}>
            <div className="input-grid-two-column">
              {/* Left Column: Batting Stats */}
              <div className="input-section">
                <h2>Batting Stats</h2>
                <div className="input-group">
                  <label>At Bats (AB)</label>
                  <input type="number" name="atBats" value={stats.atBats} onChange={handleInputChange} placeholder="Required" required />
                </div>
                <div className="input-group">
                  <label>Hits (H)</label>
                  <input type="number" name="hits" value={stats.hits} onChange={handleInputChange} placeholder="Required" required />
                </div>
                <div className="input-group">
                  <label>Singles (1B)</label>
                  <input type="number" name="singles" value={stats.singles} onChange={handleInputChange} placeholder="Optional" />
                </div>
                <div className="input-group">
                  <label>Doubles (2B)</label>
                  <input type="number" name="doubles" value={stats.doubles} onChange={handleInputChange} placeholder="Optional" />
                </div>
                <div className="input-group">
                  <label>Triples (3B)</label>
                  <input type="number" name="triples" value={stats.triples} onChange={handleInputChange} placeholder="Optional" />
                </div>
                <div className="input-group">
                  <label>Home Runs (HR)</label>
                  <input type="number" name="homeRuns" value={stats.homeRuns} onChange={handleInputChange} placeholder="Optional" />
                </div>
              </div>

              {/* Right Column: OBP Stats */}
              <div className="input-section">
                <h2>OBP & Plate Stats</h2>
                <div className="input-group">
                  <label>Walks (BB)</label>
                  <input type="number" name="walks" value={stats.walks} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Hit by Pitch (HBP)</label>
                  <input type="number" name="hitByPitch" value={stats.hitByPitch} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Sacrifice Flies (SF)</label>
                  <input type="number" name="sacFlies" value={stats.sacFlies} onChange={handleInputChange} placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Plate Appearances (PA)</label>
                  <input type="number" name="plateAppearances" value={stats.plateAppearances} onChange={handleInputChange} placeholder="Optional" />
                </div>
              </div>
            </div>

            <div className="calculate-section">
              <button type="submit" className="calculate-btn">Calculate Stats</button>
            </div>
          </form>

          <div className="input-section">
            <h2>Quick-Fill Presets</h2>
            <div className="preset-grid preset-orange">
              <button className="preset-btn" onClick={() => applyPreset('allStar')}>All-Star Season</button>
              <button className="preset-btn" onClick={() => applyPreset('average')}>Average MLB Hitter</button>
              <button className="preset-btn" onClick={() => applyPreset('leadoff')}>Leadoff Hitter</button>
              <button className="preset-btn" onClick={() => applyPreset('power')}>Power Hitter</button>
            </div>
          </div>
        </div>

        {results && (
          <div className="results-section">
            <h2>Batting Performance</h2>
            <div className="results-grid-2x2">
              <div className={`result-card-stat ${getColorClass(results.ba, 'ba')}`}>
                <div className="stat-value">{results.ba}</div>
                <div className="stat-label">Batting Average</div>
              </div>
              <div className={`result-card-stat ${getColorClass(results.obp, 'obp')}`}>
                <div className="stat-value">{results.obp}</div>
                <div className="stat-label">On-Base Percentage</div>
              </div>
              <div className={`result-card-stat ${getColorClass(results.slg, 'slg')}`}>
                <div className="stat-value">{results.slg}</div>
                <div className="stat-label">Slugging Percentage</div>
              </div>
              <div className={`result-card-stat ${getColorClass(results.ops, 'ops')}`}>
                <div className="stat-value">{results.ops}</div>
                <div className="stat-label">OPS</div>
              </div>
            </div>
          </div>
        )}

        <div className="info-sections">
          <section className="info-section">
            <h2>What is Batting Average?</h2>
            <p>
              Batting average (BA) is the most recognized statistic in baseball. It measures how often a batter gets a hit relative to their official at-bats, expressed as a three-digit decimal. A batting average of .300 means a player gets a hit in 30% of their at-bats — a benchmark widely considered the mark of an elite hitter.
            </p>
            <p>
              Batting average has been used since the 1870s and remains the most commonly cited offensive stat, despite newer metrics like OPS and wRC+ offering a more complete picture of a hitter's value.
            </p>
          </section>

          <section className="info-section">
            <h2>How to Calculate Batting Average</h2>
            <p>The batting average formula is simple:</p>
            <div className="formula-box">
              <strong>Batting Average (BA) = Hits (H) ÷ At Bats (AB)</strong>
            </div>
            <p>
              For example, a player with 165 hits in 550 at-bats has a batting average of .300 (165 ÷ 550 = 0.300).
            </p>
            <p>
              Important: Walks, hit-by-pitches, and sacrifice flies do NOT count as at-bats and do not affect batting average — they affect on-base percentage instead.
            </p>
          </section>

          <section className="info-section">
            <h2>What is OBP, SLG, and OPS?</h2>
            <p><strong>On-Base Percentage (OBP)</strong> measures how often a batter reaches base — including hits, walks, and hit-by-pitches. It's considered a better measure of offensive value than batting average alone because it accounts for walks.</p>
            <p>Formula: OBP = (H + BB + HBP) ÷ (AB + BB + HBP + SF)</p>
            <p><strong>Slugging Percentage (SLG)</strong> measures the total bases a batter earns per at-bat, giving extra weight to extra-base hits. A home run counts for 4 bases, a triple for 3, a double for 2, and a single for 1.</p>
            <p>Formula: SLG = Total Bases ÷ At Bats</p>
            <p><strong>OPS (On-base Plus Slugging)</strong> combines OBP and SLG into a single number that captures both a hitter's ability to get on base and hit for power. It is one of the most widely used advanced stats in baseball today.</p>
            <p>Formula: OPS = OBP + SLG</p>
          </section>

          <section className="info-section">
            <h2>Baseball Stats Rating Scale</h2>
            <div className="table-container">
              <table className="pace-table">
                <thead>
                  <tr>
                    <th>Rating</th>
                    <th>Batting Average</th>
                    <th>OBP</th>
                    <th>Slugging</th>
                    <th>OPS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Excellent</td><td>.300+</td><td>.370+</td><td>.500+</td><td>.900+</td></tr>
                  <tr><td>Above Average</td><td>.280–.299</td><td>.340–.369</td><td>.450–.499</td><td>.800–.899</td></tr>
                  <tr><td>Average</td><td>.250–.279</td><td>.310–.339</td><td>.370–.449</td><td>.700–.799</td></tr>
                  <tr><td>Below Average</td><td>.220–.249</td><td>.280–.309</td><td>.320–.369</td><td>.600–.699</td></tr>
                  <tr><td>Poor</td><td>Below .220</td><td>Below .280</td><td>Below .320</td><td>Below .600</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="info-section">
            <h2>Batting Average vs. OPS — Which Stat Matters More?</h2>
            <p>
              For decades, batting average was the primary way fans and scouts evaluated hitters. A .300 hitter was a star; a .250 hitter was average. But modern baseball analytics have shifted the focus toward OPS and other advanced metrics.
            </p>
            <p>
              Here's why OPS tells a fuller story: a player hitting .280 with 40 home runs and 80 walks will have a much higher OPS than a player hitting .290 with 5 home runs and 20 walks — even though the second player has the higher batting average. The power hitter creates more run-scoring opportunities, and OPS captures that difference.
            </p>
            <p>
              That said, batting average still matters for context. Extremely high batting averages (above .330) combined with strong OPS numbers identify the game's truly elite contact hitters.
            </p>
          </section>

          <section className="info-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-container">
              <div className="faq-item">
                <h3>What is a good batting average in baseball?</h3>
                <p>A batting average of .300 or above is considered excellent at the MLB level. The league average typically falls between .240 and .260. Anything below .220 is generally considered poor for a regular starter.</p>
              </div>
              <div className="faq-item">
                <h3>Does a walk count as an at-bat?</h3>
                <p>No. Walks (BB), hit-by-pitches (HBP), and sacrifice flies (SF) do not count as official at-bats and do not affect batting average. They do count toward on-base percentage (OBP).</p>
              </div>
              <div className="faq-item">
                <h3>What is a good OPS in baseball?</h3>
                <p>An OPS above .800 is considered above average in MLB. An OPS above .900 is excellent, and OPS above 1.000 is elite — typically reserved for MVP-caliber seasons. The league average OPS is usually around .720–.740.</p>
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
              <div className="calculator-icon"><i className="fas fa-futbol"></i></div>
              <h3>Fantasy Football Calculator</h3>
              <p>Calculate fantasy football points for PPR, standard, and half-PPR scoring leagues.</p>
              <a href="/sports/fantasy-football-calculator" className="calculator-btn">Open Calculator</a>
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
          title="Batting Average Calculator — BA, OBP, SLG & OPS"
          description="Calculate baseball batting average, on-base percentage, slugging percentage, and OPS instantly. Free at CalcLogic."
          customMessage="Check out this baseball batting average calculator!"
        />
      </div>
    </div>
  );
};

export default BattingAverageCalculator;
