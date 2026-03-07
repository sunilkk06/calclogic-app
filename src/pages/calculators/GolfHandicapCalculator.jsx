import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ShareButtons from '../../components/ShareButtons';

const GolfHandicapCalculator = () => {
  const [activeTab, setActiveTab] = useState('index'); // 'index' or 'course'
  const [numScores, setNumScores] = useState(3);
  const [scores, setScores] = useState(Array(8).fill({ gross: '', rating: '', slope: '', par: '' }));
  const [indexInput, setIndexInput] = useState({ index: '', slope: '', rating: '', par: '' });
  const [indexResult, setIndexResult] = useState(null);
  const [courseResult, setCourseResult] = useState(null);

  const handleScoreChange = (index, field, value) => {
    const newScores = [...scores];
    newScores[index] = { ...newScores[index], [field]: value };
    setScores(newScores);
  };

  const applyStandardCourse = (index) => {
    const newScores = [...scores];
    newScores[index] = { ...newScores[index], rating: '72.0', slope: '113', par: '72' };
    setScores(newScores);
  };

  const applyStandardCourseToIndex = () => {
    setIndexInput(prev => ({ ...prev, rating: '72.0', slope: '113', par: '72' }));
  };

  const scoreDifferential = (grossScore, courseRating, slopeRating) => {
    return ((113 / slopeRating) * (grossScore - courseRating));
  };

  const calculateIndex = (e) => {
    if (e) e.preventDefault();
    const differentials = [];
    const activeScores = scores.slice(0, numScores);

    for (const s of activeScores) {
      const gross = parseFloat(s.gross);
      const rating = parseFloat(s.rating);
      const slope = parseInt(s.slope);
      if (!isNaN(gross) && !isNaN(rating) && !isNaN(slope) && slope !== 0) {
        differentials.push(scoreDifferential(gross, rating, slope));
      }
    }

    if (differentials.length < 3) return;

    const sorted = [...differentials].sort((a, b) => a - b);
    let selected;
    const count = differentials.length;
    
    if (count <= 5) selected = sorted.slice(0, 1);
    else if (count >= 6 && count <= 8) selected = sorted.slice(0, 2);
    else selected = sorted.slice(0, 8);

    const avg = selected.reduce((a, b) => a + b, 0) / selected.length;
    const finalIndex = (avg * 0.96).toFixed(1);

    const getCategory = (idx) => {
      const v = parseFloat(idx);
      if (v <= 0) return { label: 'Scratch', class: 'scratch' };
      if (v <= 9) return { label: 'Low Handicap', class: 'low' };
      if (v <= 18) return { label: 'Mid Handicap', class: 'mid' };
      if (v <= 28) return { label: 'High Handicap', class: 'high' };
      return { label: 'Beginner', class: 'beginner' };
    };

    setIndexResult({
      index: finalIndex,
      differentials: differentials.map(d => d.toFixed(1)),
      selectedCount: selected.length,
      category: getCategory(finalIndex)
    });
  };

  const calculateCourseHandicap = (e) => {
    if (e) e.preventDefault();
    const idx = parseFloat(indexInput.index);
    const slope = parseInt(indexInput.slope);
    const rating = parseFloat(indexInput.rating);
    const par = parseInt(indexInput.par);

    if (isNaN(idx) || isNaN(slope) || isNaN(rating) || isNaN(par)) return;

    const ch = Math.round((idx * (slope / 113)) + (rating - par));
    const ph = Math.round(ch * 0.95);
    const netPar = par - ch;

    setCourseResult({
      courseHandicap: ch,
      playingHandicap: ph,
      netPar: netPar
    });
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Golf Handicap Calculator",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0" },
    "description": "Calculate your golf Handicap Index and Course Handicap using the World Handicap System (WHS) formula."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many rounds do I need to get a golf handicap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Under the World Handicap System, you need a minimum of 3 submitted scores to receive an initial Handicap Index. However, a handicap becomes more accurate and stable as you submit more rounds — ideally 20 or more over time."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good golf handicap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A handicap index below 10 is considered a low handicap and represents a strong golfer. The average male club golfer has a handicap of around 14–16, and the average female club golfer around 25–27. A scratch handicap (0) means you typically shoot par."
        }
      },
      {
        "@type": "Question",
        "name": "What is the maximum golf handicap?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Under the World Handicap System, the maximum Handicap Index is 54.0 for both men and women. This was introduced in 2020 to make the game more inclusive for beginners and high-handicap players."
        }
      },
      {
        "@type": "Question",
        "name": "What slope rating should I use if I don't know my course's slope?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The standard slope rating used in handicap calculations is 113, which represents a course of average difficulty. If you don't know your course's specific slope rating, using 113 will give you a reasonable estimate."
        }
      },
      {
        "@type": "Question",
        "name": "Does my handicap go up if I play badly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not significantly. The World Handicap System only uses your best score differentials to calculate your index — so a few bad rounds won't dramatically increase your handicap."
        }
      }
    ]
  };

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>Golf Handicap Calculator — Handicap Index & Course Handicap | CalcLogic</title>
        <meta name="description" content="Free golf handicap calculator. Calculate your World Handicap System (WHS) Handicap Index and Course Handicap from your recent scores, course rating, and slope rating." />
        <meta name="keywords" content="golf handicap calculator, handicap index calculator, course handicap calculator, world handicap system, golf slope rating calculator, WHS handicap" />
        <link rel="canonical" href="https://calclogic.com/sports/golf-handicap-calculator" />
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Golf Handicap Calculator</h1>
          <p className="calculator-description">
            Professional handicap tracking using the World Handicap System (WHS).
          </p>
        </div>

        <div className="calculator-form">
          <div className="mode-tabs">
            <button 
              className={`mode-tab ${activeTab === 'index' ? 'active' : ''}`}
              onClick={() => setActiveTab('index')}
            >Handicap Index</button>
            <button 
              className={`mode-tab ${activeTab === 'course' ? 'active' : ''}`}
              onClick={() => setActiveTab('course')}
            >Course Handicap</button>
          </div>

          {activeTab === 'index' ? (
            <form onSubmit={calculateIndex}>
              <div className="input-section">
                <label>Number of scores to enter</label>
                <select 
                  className="num-scores-select"
                  value={numScores} 
                  onChange={(e) => setNumScores(parseInt(e.target.value))}
                >
                  {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} Rounds</option>)}
                </select>
              </div>

              <div className="scores-table-wrapper">
                <table className="scores-entry-table">
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Gross Score</th>
                      <th>Course Rating</th>
                      <th>Slope Rating</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: numScores }).map((_, i) => (
                      <tr key={i}>
                        <td>#{i + 1}</td>
                        <td><input type="number" value={scores[i].gross} onChange={(e) => handleScoreChange(i, 'gross', e.target.value)} placeholder="e.g. 85" required /></td>
                        <td><input type="number" step="0.1" value={scores[i].rating} onChange={(e) => handleScoreChange(i, 'rating', e.target.value)} placeholder="72.0" required /></td>
                        <td><input type="number" value={scores[i].slope} onChange={(e) => handleScoreChange(i, 'slope', e.target.value)} placeholder="113" required /></td>
                        <td><button type="button" className="std-course-btn" onClick={() => applyStandardCourse(i)}>Standard</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="calculate-section">
                <button type="submit" className="calculate-btn">Calculate Handicap Index</button>
              </div>
            </form>
          ) : (
            <form onSubmit={calculateCourseHandicap}>
              <div className="input-grid">
                <div className="input-group">
                  <label>Handicap Index</label>
                  <input type="number" step="0.1" value={indexInput.index} onChange={(e) => setIndexInput({...indexInput, index: e.target.value})} placeholder="e.g. 14.2" required />
                </div>
                <div className="input-group">
                  <label>Slope Rating</label>
                  <input type="number" value={indexInput.slope} onChange={(e) => setIndexInput({...indexInput, slope: e.target.value})} placeholder="113" required />
                </div>
                <div className="input-group">
                  <label>Course Rating</label>
                  <input type="number" step="0.1" value={indexInput.rating} onChange={(e) => setIndexInput({...indexInput, rating: e.target.value})} placeholder="72.0" required />
                </div>
                <div className="input-group">
                  <label>Par</label>
                  <input type="number" value={indexInput.par} onChange={(e) => setIndexInput({...indexInput, par: e.target.value})} placeholder="72" required />
                </div>
              </div>
              <div className="helper-note">
                <button type="button" className="std-course-btn" onClick={applyStandardCourseToIndex}>Use Standard Course (72.0 / 113 / 72)</button>
              </div>
              <div className="calculate-section">
                <button type="submit" className="calculate-btn">Calculate Course Handicap</button>
              </div>
            </form>
          )}
        </div>

        {activeTab === 'index' && indexResult && (
          <div className="results-section">
            <div className={`result-card highlight ${indexResult.category.class}`}>
              <h2>Your Handicap Index</h2>
              <div className="result-value-large">{indexResult.index}</div>
              <p className="category-label">{indexResult.category.label}</p>
              <hr className="result-divider" />
              <p>Based on the lowest {indexResult.selectedCount} differentials from your {numScores} rounds.</p>
            </div>
            <div className="differentials-list">
              <h3>Round Differentials</h3>
              <div className="diff-grid">
                {indexResult.differentials.map((d, i) => (
                  <div key={i} className="diff-item">
                    <span>Round {i+1}:</span>
                    <strong>{d}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'course' && courseResult && (
          <div className="results-section results-grid-3">
            <div className="result-card-stat">
              <div className="stat-value">{courseResult.courseHandicap}</div>
              <div className="stat-label">Course Handicap</div>
            </div>
            <div className="result-card-stat">
              <div className="stat-value">{courseResult.playingHandicap}</div>
              <div className="stat-label">Playing Handicap (95%)</div>
            </div>
            <div className="result-card-stat">
              <div className="stat-value">{courseResult.netPar}</div>
              <div className="stat-label">Net Par Target</div>
            </div>
            <div className="explanation-card full-width">
              <p>On this course, you receive <strong>{courseResult.courseHandicap}</strong> strokes. Your target score to play to your handicap is <strong>{courseResult.netPar + courseResult.courseHandicap}</strong> ({courseResult.netPar} net).</p>
            </div>
          </div>
        )}

        <div className="info-sections">
          <section className="info-section">
            <h2>What is a Golf Handicap?</h2>
            <p>A golf handicap is a numerical measure of a golfer's potential ability, allowing players of different skill levels to compete fairly against each other. Under the World Handicap System (WHS), which has been the global standard since 2020, your Handicap Index represents the number of strokes above par you're expected to shoot on a course of average difficulty.</p>
            <p>A scratch golfer has a Handicap Index of 0, meaning they're expected to shoot par. A 20-handicapper is expected to shoot around 20 over par. The handicap system lets a beginner and an expert play a competitive round together by adjusting scores accordingly.</p>
          </section>

          <section className="info-section">
            <h2>How to Calculate a Golf Handicap Index</h2>
            <p>The World Handicap System uses the following steps:</p>
            <div className="formula-box">
              <h3>Step 1 — Calculate Score Differentials</h3>
              <p>For each round, calculate: <code>Score Differential = (113 ÷ Slope Rating) × (Gross Score − Course Rating)</code></p>
            </div>
            <p><strong>Step 2 — Select the Best Differentials</strong></p>
            <p>The number of differentials used depends on how many rounds you've submitted:</p>
            <ul>
              <li>3 rounds submitted → use the lowest 1 differential</li>
              <li>6 rounds submitted → use the lowest 2 differentials</li>
              <li>20 rounds submitted → use the lowest 8 differentials</li>
            </ul>
            <p><strong>Step 3 — Average and Adjust</strong></p>
            <p>Average the selected differentials, then multiply by 0.96 (the WHS playing conditions adjustment). The result is your Handicap Index, displayed to one decimal place.</p>
          </section>

          <section className="info-section">
            <h2>Course Rating vs Slope Rating — What's the Difference?</h2>
            <p><strong>Course Rating</strong> is the expected score for a scratch golfer (0 handicap) on that course under normal conditions. A course rated 71.4 means a scratch player is expected to shoot 71.4.</p>
            <p><strong>Slope Rating</strong> measures the relative difficulty of a course for a bogey golfer compared to a scratch golfer. The standard slope is 113. A slope above 113 means the course is harder than average; below 113 means easier. Slope ratings range from 55 to 155.</p>
            <p>Both numbers are printed on every official scorecard and are set by your national golf association.</p>
          </section>

          <section className="info-section">
            <h2>Golf Handicap Reference Table</h2>
            <div className="table-container">
              <table className="pace-table">
                <thead>
                  <tr>
                    <th>Handicap Index</th>
                    <th>Category</th>
                    <th>Typical Score (Par 72)</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>+5 to 0</td><td>Scratch</td><td>67–72</td><td>Expert / Tournament</td></tr>
                  <tr><td>1–9</td><td>Low Handicap</td><td>73–81</td><td>Strong Club Player</td></tr>
                  <tr><td>10–18</td><td>Mid Handicap</td><td>82–90</td><td>Average Club Player</td></tr>
                  <tr><td>19–28</td><td>High Handicap</td><td>91–100</td><td>Recreational Player</td></tr>
                  <tr><td>29–36</td><td>Beginner</td><td>101–108</td><td>Beginner / Social</td></tr>
                  <tr><td>37–54</td><td>Maximum</td><td>109+</td><td>New to Golf</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="info-section">
            <h2>What is Course Handicap and How is it Different?</h2>
            <p>Your <strong>Handicap Index</strong> is a portable number that travels with you to any course in the world. Your <strong>Course Handicap</strong> converts that index into strokes for a specific course, accounting for that course's difficulty via its slope and rating.</p>
            <p className="formula-box">
              Course Handicap = (Handicap Index × Slope/113) + (Course Rating − Par)
            </p>
            <p>In competition, most clubs apply a 95% playing allowance, so the player would receive strokes based on: <code>Playing Handicap = Course Handicap × 0.95</code>.</p>
          </section>

          <section className="info-section">
            <h2>Tips to Lower Your Golf Handicap</h2>
            <ol className="tips-list">
              <li><strong>Track every round officially.</strong> Your handicap only improves when you submit scores consistently.</li>
              <li><strong>Focus on eliminating big numbers.</strong> Course management to avoid disasters lowers your handicap faster.</li>
              <li><strong>Practice your short game.</strong> Improving putting and chipping has the fastest impact on scores.</li>
              <li><strong>Play from appropriate tees.</strong> tees that match your distance lead to more manageable approach shots.</li>
              <li><strong>Review your score differentials.</strong> Identify which parts of your game need the most work.</li>
            </ol>
          </section>
        </div>

        <div className="related-calculators">
          <h2>Related Calculators</h2>
          <div className="calculator-grid">
            <a href="/sports/pace-calculator" className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-running"></i></div>
              <h3>Pace Calculator</h3>
              <p>Calculate running pace, speed, and finish time.</p>
            </a>
            <a href="/sports/fantasy-football-calculator" className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-futbol"></i></div>
              <h3>Fantasy Football Calculator</h3>
              <p>Calculate fantasy points for all scoring formats.</p>
            </a>
            <a href="/sports/batting-average-calculator" className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-baseball-ball"></i></div>
              <h3>Batting Average Calculator</h3>
              <p>Calculate BA, OBP, SLG, and OPS instantly.</p>
            </a>
          </div>
        </div>

        <ShareButtons 
          title="Golf Handicap Calculator — Handicap Index & Course Handicap"
          description="Calculate your World Handicap System (WHS) Handicap Index and Course Handicap instantly. Free at CalcLogic."
          customMessage="Check out this accurate golf handicap calculator!"
        />
      </div>
    </div>
  );
};

export default GolfHandicapCalculator;
