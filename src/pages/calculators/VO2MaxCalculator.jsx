import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ShareButtons from '../../components/ShareButtons';

const VO2MaxCalculator = () => {
  const [activeTab, setActiveTab] = useState('pace'); // 'pace', 'hr', 'walk'
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  
  // Tab 1: Pace Method
  const [distance, setDistance] = useState('5k');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  // Tab 2: HR Method
  const [restingHR, setRestingHR] = useState('');
  const [maxHR, setMaxHR] = useState('');
  const [isAutoMaxHR, setIsAutoMaxHR] = useState(false);

  // Tab 3: Walk Test
  const [walkMinutes, setWalkMinutes] = useState('');
  const [walkSeconds, setWalkSeconds] = useState('');
  const [postWalkHR, setPostWalkHR] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('lbs');

  const [results, setResults] = useState(null);

  const distances = {
    '1mile': 1609.34,
    '5k': 5000,
    '10k': 10000,
    'halfMarathon': 21097,
    'marathon': 42195
  };

  const calculateVO2Max = (e) => {
    if (e) e.preventDefault();
    let vo2 = 0;

    if (activeTab === 'pace') {
      const timeMinutes = parseInt(hours || 0) * 60 + parseInt(minutes || 0) + parseInt(seconds || 0) / 60;
      if (timeMinutes <= 0) return;
      const distanceMeters = distances[distance];
      const velocity = distanceMeters / timeMinutes;

      const percentVO2Max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);
      const oxygenCost = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
      vo2 = oxygenCost / percentVO2Max;
    } else if (activeTab === 'hr') {
      const rHR = parseFloat(restingHR);
      let mHR = parseFloat(maxHR);
      if (isAutoMaxHR && age) {
        mHR = 220 - parseInt(age);
      }
      if (!rHR || !mHR) return;
      vo2 = 15 * (mHR / rHR);
    } else if (activeTab === 'walk') {
      const timeMinutes = parseInt(walkMinutes || 0) + parseInt(walkSeconds || 0) / 60;
      const hr = parseFloat(postWalkHR);
      const a = parseInt(age);
      let wKg = parseFloat(weight);
      if (weightUnit === 'lbs') wKg = wKg / 2.205;
      if (!timeMinutes || !hr || !a || !wKg) return;

      const genderFactor = gender === 'male' ? 1 : 0;
      vo2 = 132.853 - 0.0769 * (wKg * 2.205) - 0.3877 * a + 6.315 * genderFactor - 3.2649 * timeMinutes - 0.1565 * hr;
    }

    if (vo2 > 0) {
      processResults(vo2);
    }
  };

  const processResults = (vo2) => {
    const vo2Fixed = parseFloat(vo2.toFixed(1));
    const category = getFitnessCategory(vo2Fixed, parseInt(age), gender);
    const raceTimes = {
      '5K': formatTime(estimateRaceTime(vo2Fixed, 5000)),
      '10K': formatTime(estimateRaceTime(vo2Fixed, 10000)),
      'Half': formatTime(estimateRaceTime(vo2Fixed, 21097)),
      'Marathon': formatTime(estimateRaceTime(vo2Fixed, 42195))
    };

    setResults({
      vo2: vo2Fixed,
      category: category,
      percentile: getPercentile(vo2Fixed, category.label),
      raceTimes: raceTimes
    });
  };

  const getFitnessCategory = (vo2, ageVal, gen) => {
    if (gen === 'male') {
      if (vo2 >= 60) return { label: 'Superior', color: 'gold' };
      if (vo2 >= 52) return { label: 'Excellent', color: 'green' };
      if (vo2 >= 47) return { label: 'Good', color: 'teal' };
      if (vo2 >= 42) return { label: 'Above Average', color: 'blue' };
      if (vo2 >= 37) return { label: 'Average', color: 'yellow' };
      if (vo2 >= 30) return { label: 'Below Average', color: 'orange' };
      return { label: 'Poor', color: 'red' };
    } else {
      if (vo2 >= 54) return { label: 'Superior', color: 'gold' };
      if (vo2 >= 45) return { label: 'Excellent', color: 'green' };
      if (vo2 >= 41) return { label: 'Good', color: 'teal' };
      if (vo2 >= 37) return { label: 'Above Average', color: 'blue' };
      if (vo2 >= 32) return { label: 'Average', color: 'yellow' };
      if (vo2 >= 26) return { label: 'Below Average', color: 'orange' };
      return { label: 'Poor', color: 'red' };
    }
  };

  const getPercentile = (vo2, category) => {
    const map = {
      'Superior': 95,
      'Excellent': 85,
      'Good': 70,
      'Above Average': 55,
      'Average': 40,
      'Below Average': 25,
      'Poor': 10
    };
    return map[category] || 50;
  };

  const estimateRaceTime = (vo2max, distanceMeters) => {
    const vVO2max = (vo2max + 4.60) / (0.182258 + 0.000104 * (vo2max + 4.60) / 0.182258);
    const racePaceFactor = distanceMeters <= 5000 ? 0.93 :
                           distanceMeters <= 10000 ? 0.88 :
                           distanceMeters <= 21097 ? 0.82 : 0.76;
    const raceVelocity = vVO2max * racePaceFactor;
    return distanceMeters / raceVelocity;
  };

  const formatTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const s = Math.round((totalMinutes * 60) % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "VO2 Max Calculator",
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0" },
    "description": "Estimate your VO2 max and aerobic fitness level using running pace, heart rate, or fitness test results."
  };

  return (
    <div className="calculator-page-wrapper">
      <Helmet>
        <title>VO2 Max Calculator — Estimate Your Aerobic Fitness Level | CalcLogic</title>
        <meta name="description" content="Free VO2 max calculator. Estimate your maximum oxygen uptake from your running pace, heart rate, or fitness test results. See how your aerobic fitness compares by age and gender." />
        <meta name="keywords" content="VO2 max calculator, vo2max calculator, aerobic fitness calculator, running fitness test, cardio fitness level, maximal oxygen uptake" />
        <link rel="canonical" href="https://calclogic.com/sports/vo2-max-calculator" />
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
      </Helmet>

      <div className="calculator-container">
        <div className="calculator-header">
          <h1>VO2 Max Calculator</h1>
          <p className="calculator-description">Estimate your maximum oxygen uptake and cardiovascular fitness level.</p>
        </div>

        <div className="calculator-form">
          <div className="mode-tabs">
            <button className={`mode-tab ${activeTab === 'pace' ? 'active' : ''}`} onClick={() => setActiveTab('pace')}>Running Pace</button>
            <button className={`mode-tab ${activeTab === 'hr' ? 'active' : ''}`} onClick={() => setActiveTab('hr')}>Heart Rate</button>
            <button className={`mode-tab ${activeTab === 'walk' ? 'active' : ''}`} onClick={() => setActiveTab('walk')}>Walk Test</button>
          </div>

          <div className="input-section gender-age-section">
            <div className="input-group">
              <label>Gender</label>
              <div className="toggle-group">
                <button className={`toggle-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>Male</button>
                <button className={`toggle-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>Female</button>
              </div>
            </div>
            <div className="input-group">
              <label>Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Years" />
            </div>
          </div>

          <form onSubmit={calculateVO2Max}>
            {activeTab === 'pace' && (
              <div className="tab-inputs">
                <div className="input-group">
                  <label>Distance</label>
                  <select value={distance} onChange={(e) => setDistance(e.target.value)}>
                    <option value="1mile">1 Mile</option>
                    <option value="5k">5K</option>
                    <option value="10k">10K</option>
                    <option value="halfMarathon">Half Marathon</option>
                    <option value="marathon">Marathon</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Finish Time</label>
                  <div className="time-inputs-row">
                    <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="HH" />
                    <span>:</span>
                    <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="MM" />
                    <span>:</span>
                    <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="SS" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hr' && (
              <div className="tab-inputs">
                <div className="input-group">
                  <label>Resting Heart Rate (BPM)</label>
                  <input type="number" value={restingHR} onChange={(e) => setRestingHR(e.target.value)} placeholder="e.g. 60" />
                </div>
                <div className="input-group">
                  <label>Maximum Heart Rate (BPM)</label>
                  <div className="checkbox-input-row">
                    <input type="number" value={maxHR} onChange={(e) => setMaxHR(e.target.value)} placeholder="e.g. 185" disabled={isAutoMaxHR} />
                    <label className="auto-hr-check">
                      <input type="checkbox" checked={isAutoMaxHR} onChange={(e) => setIsAutoMaxHR(e.target.checked)} />
                      Auto-calculate (220-age)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'walk' && (
              <div className="tab-inputs">
                <div className="input-group">
                  <label>Walk Time (1 Mile)</label>
                  <div className="time-inputs-row">
                    <input type="number" value={walkMinutes} onChange={(e) => setWalkMinutes(e.target.value)} placeholder="MM" />
                    <span>:</span>
                    <input type="number" value={walkSeconds} onChange={(e) => setWalkSeconds(e.target.value)} placeholder="SS" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Heart Rate After Walk (BPM)</label>
                  <input type="number" value={postWalkHR} onChange={(e) => setPostWalkHR(e.target.value)} placeholder="e.g. 120" />
                </div>
                <div className="input-group">
                  <label>Weight</label>
                  <div className="weight-input-row">
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" />
                    <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                      <option value="lbs">lbs</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="calculate-section">
              <button type="submit" className="calculate-btn">Calculate VO2 Max</button>
            </div>
          </form>
        </div>

        {results && (
          <div className="results-section">
            <div className={`result-card highlight-glow category-${results.category.color}`}>
              <h2>Your VO2 Max</h2>
              <div className="result-value-large">{results.vo2} <span className="unit">mL/kg/min</span></div>
              <div className={`fitness-badge ${results.category.color}`}>{results.category.label}</div>
              <p className="percentile-text">Better than {results.percentile}% of people your age and gender</p>
              
              <div className="fitness-spectrum">
                <div className="spectrum-bar">
                  <div className="marker" style={{ left: `${Math.min(Math.max((results.vo2 - 20) / 50 * 100, 0), 100)}%` }}></div>
                </div>
                <div className="spectrum-labels">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Superior</span>
                </div>
              </div>
            </div>

            <div className="race-predictions">
              <h3>Estimated Race Times</h3>
              <div className="predictions-grid">
                {Object.entries(results.raceTimes).map(([dist, time]) => (
                  <div key={dist} className="prediction-item">
                    <span className="dist-label">{dist}</span>
                    <strong className="time-val">{time}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="info-sections">
          <section className="info-section">
            <h2>What is VO2 Max?</h2>
            <p>VO2 max — short for maximal oxygen uptake — is the maximum rate at which your body can consume oxygen during intense exercise. It's measured in milliliters of oxygen per kilogram of body weight per minute (mL/kg/min) and is widely considered the gold standard measure of cardiovascular fitness and aerobic endurance.</p>
            <p>A higher VO2 max means your body can deliver and use more oxygen during hard efforts, which translates directly to better endurance performance in running, cycling, swimming, and any sustained aerobic activity. Elite marathon runners typically have VO2 max values between 65–85 mL/kg/min, while the average untrained adult falls between 30–45 mL/kg/min.</p>
          </section>

          <section className="info-section">
            <h2>How is VO2 Max Calculated?</h2>
            <p>True VO2 max is measured in a lab using a graded exercise test (usually on a treadmill or bike) with a metabolic analyzer tracking oxygen consumption. However, several validated field tests and formulas let you estimate VO2 max accurately without lab equipment:</p>
            <ul>
              <li><strong>Running Pace Method</strong> — uses your finish time for a known distance (5K, 10K, etc.) to estimate the oxygen cost of that effort. Developed by exercise physiologist Jack Daniels, this method is highly accurate for regular runners.</li>
              <li><strong>Heart Rate Method</strong> — uses the ratio of your maximum to resting heart rate. Research correlates this ratio strongly with measured VO2 max.</li>
              <li><strong>1-Mile Walk Test (Rockport Test)</strong> — developed for populations who can't run, this test uses your walk time, post-walk heart rate, age, weight, and gender to estimate aerobic fitness.</li>
            </ul>
          </section>

          <section className="info-section">
            <h2>VO2 Max Fitness Categories by Age</h2>
            <div className="table-container">
              <h3>Men — VO2 Max Norms (mL/kg/min)</h3>
              <table className="pace-table">
                <thead>
                  <tr><th>Age</th><th>Poor</th><th>Average</th><th>Good</th><th>Excellent</th><th>Superior</th></tr>
                </thead>
                <tbody>
                  <tr><td>20–29</td><td>&lt;38</td><td>42–45</td><td>51–55</td><td>56–60</td><td>60+</td></tr>
                  <tr><td>30–39</td><td>&lt;36</td><td>40–43</td><td>48–53</td><td>54–58</td><td>58+</td></tr>
                  <tr><td>40–49</td><td>&lt;34</td><td>38–41</td><td>46–51</td><td>52–56</td><td>56+</td></tr>
                  <tr><td>50–59</td><td>&lt;31</td><td>35–38</td><td>43–48</td><td>49–53</td><td>53+</td></tr>
                  <tr><td>60+</td><td>&lt;28</td><td>32–35</td><td>40–45</td><td>46–49</td><td>49+</td></tr>
                </tbody>
              </table>
            </div>
            <div className="table-container">
              <h3>Women — VO2 Max Norms (mL/kg/min)</h3>
              <table className="pace-table">
                <thead>
                  <tr><th>Age</th><th>Poor</th><th>Average</th><th>Good</th><th>Excellent</th><th>Superior</th></tr>
                </thead>
                <tbody>
                  <tr><td>20–29</td><td>&lt;29</td><td>33–36</td><td>41–44</td><td>45–48</td><td>48+</td></tr>
                  <tr><td>30–39</td><td>&lt;27</td><td>31–34</td><td>39–42</td><td>43–46</td><td>46+</td></tr>
                  <tr><td>40–49</td><td>&lt;25</td><td>29–32</td><td>37–40</td><td>41–44</td><td>44+</td></tr>
                  <tr><td>50–59</td><td>&lt;22</td><td>26–29</td><td>34–37</td><td>38–41</td><td>41+</td></tr>
                  <tr><td>60+</td><td>&lt;20</td><td>24–27</td><td>32–35</td><td>36–38</td><td>38+</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="info-section">
            <h2>What is a Good VO2 Max?</h2>
            <p>What counts as a "good" VO2 max depends heavily on your age and gender — values naturally decline with age, and men typically score 10–15% higher than women due to differences in hemoglobin levels and muscle mass.</p>
            <p>For general health, research suggests a VO2 max above 35 mL/kg/min for women and above 40 mL/kg/min for men is associated with significantly lower risk of cardiovascular disease and all-cause mortality. You don't need to be an athlete — just avoiding the "poor" and "below average" categories has measurable health benefits.</p>
          </section>

          <section className="info-section">
            <h2>How to Improve Your VO2 Max</h2>
            <ol className="tips-list">
              <li><strong>High-Intensity Interval Training (HIIT)</strong> — Short bursts at 90–95% of max heart rate followed by recovery periods.</li>
              <li><strong>Increase weekly mileage gradually</strong> — More aerobic volume builds the cardiovascular base.</li>
              <li><strong>Tempo runs</strong> — Sustained efforts at "comfortably hard" pace (around 85–90% max HR).</li>
              <li><strong>Be consistent</strong> — Improvement takes 8–12 weeks of structured training.</li>
              <li><strong>Track your progress</strong> — Re-test every 6–8 weeks using the same method.</li>
            </ol>
          </section>

          <section className="info-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-container">
              <div className="faq-item">
                <h3>What is a good VO2 max for my age?</h3>
                <p>A good VO2 max varies by age and gender. For men aged 30–39, above 48 is considered good. For women, above 39 is good. See tables above for details.</p>
              </div>
              <div className="faq-item">
                <h3>How accurate are field estimates?</h3>
                <p>Field estimates like running pace or heart rate methods are typically within 5–10% of lab-measured VO2 max, enough to track trends and compare to norms.</p>
              </div>
              <div className="faq-item">
                <h3>Does VO2 max decline with age?</h3>
                <p>Yes, about 1% per year after age 25 in sedentary people. Regular aerobic training can significantly slow this decline.</p>
              </div>
            </div>
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
            <a href="/sports/golf-handicap-calculator" className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-golf-ball-tee"></i></div>
              <h3>Golf Handicap Calculator</h3>
              <p>Calculate your WHS Handicap Index and Course Handicap.</p>
            </a>
            <a href="/sports/fantasy-football-calculator" className="calculator-card">
              <div className="calculator-icon"><i className="fas fa-futbol"></i></div>
              <h3>Fantasy Football Calculator</h3>
              <p>Calculate points for all scoring formats.</p>
            </a>
          </div>
        </div>

        <ShareButtons 
          title="VO2 Max Calculator — Estimate Your Aerobic Fitness Level"
          description="Estimate your VO2 max from your running pace, heart rate, or walk test results. Free at CalcLogic."
          customMessage="Check out this aerobic fitness calculator!"
        />
      </div>
    </div>
  );
};

export default VO2MaxCalculator;
