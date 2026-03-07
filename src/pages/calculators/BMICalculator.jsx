import React, { useState } from 'react'
import ShareButtons from '../../components/ShareButtons'
import { Helmet } from 'react-helmet-async'

const BMICalculator = () => {
  const [units, setUnits] = useState('metric')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [result, setResult] = useState(null)

  const calculateBMI = (e) => {
    e.preventDefault()
    
    let heightInMeters, weightInKg
    
    if (units === 'metric') {
      heightInMeters = parseFloat(height) / 100
      weightInKg = parseFloat(weight)
    } else {
      const totalInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn)
      heightInMeters = totalInches * 0.0254
      weightInKg = parseFloat(weight) * 0.453592
    }
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmi = weightInKg / (heightInMeters * heightInMeters)
      const category = getBMICategory(bmi)
      setResult({ bmi: bmi.toFixed(1), category })
    }
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  return (
    <>
      <Helmet>
        <title>BMI Calculator — Instant Results with Health Insights | CalcLogic</title>
        <meta name="description" content="Free BMI calculator with instant results. Find your Body Mass Index, see your weight category, and get personalised health insights. Metric &amp; imperial supported." />
        <link rel="canonical" href="https://calclogic.com/bmi-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="BMI Calculator — Instant Results with Health Insights | CalcLogic" />
        <meta property="og:description" content="Free BMI calculator. Enter your height and weight to instantly find your BMI score, weight category, and health insights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/bmi-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="BMI Calculator — Free &amp; Instant | CalcLogic" />
        <meta name="twitter:description" content="Calculate your BMI in seconds. Free, no signup, metric and imperial supported." />
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a normal BMI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A normal BMI is between 18.5 and 24.9. A BMI below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese."
      }
    },
    {
      "@type": "Question",
      "name": "How is BMI calculated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BMI is calculated by dividing your weight in kilograms by the square of your height in meters: BMI = weight (kg) divided by height squared (m). In imperial units: BMI = (weight in lbs x 703) divided by height squared (inches)."
      }
    },
    {
      "@type": "Question",
      "name": "Is BMI accurate for women?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BMI uses the same formula for men and women, but it can be less accurate for women because it does not account for differences in body fat distribution. Women naturally carry more body fat than men at the same BMI. It is best used as a screening tool alongside other measurements."
      }
    },
    {
      "@type": "Question",
      "name": "What is a healthy BMI for adults?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For most adults, a healthy BMI is between 18.5 and 24.9. However, healthy ranges can vary by age, sex, and ethnicity. Asian populations may face health risks at BMIs lower than 25."
      }
    },
    {
      "@type": "Question",
      "name": "Can you be healthy with a high BMI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Athletes and people with high muscle mass may have a high BMI but low body fat and excellent health. BMI is a population-level screening tool and does not diagnose individual health. A doctor can assess your health using additional metrics like waist circumference, blood pressure, and cholesterol."
      }
    },
    {
      "@type": "Question",
      "name": "What is the BMI formula in imperial units?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In imperial units, the BMI formula is: BMI = (weight in pounds x 703) divided by (height in inches squared). For example, a person who is 5 feet 9 inches (69 inches) and weighs 160 lbs has a BMI of (160 x 703) divided by (69 x 69) = 23.6."
      }
    }
  ]
}`}
        </script>
        
        {/* HowTo Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Calculate BMI",
            "description": "Calculate your Body Mass Index using the standard BMI formula.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Measure your height",
                "text": "Measure your height in centimeters (metric) or feet and inches (imperial)."
              },
              {
                "@type": "HowToStep",
                "name": "Measure your weight",
                "text": "Measure your weight in kilograms (metric) or pounds (imperial)."
              },
              {
                "@type": "HowToStep",
                "name": "Apply the formula",
                "text": "Divide your weight (kg) by your height in meters squared: BMI = kg ÷ m². Or use CalcLogic's free BMI calculator above for instant results."
              },
              {
                "@type": "HowToStep",
                "name": "Interpret your result",
                "text": "Compare your BMI to standard categories: Under 18.5 (Underweight), 18.5–24.9 (Normal), 25–29.9 (Overweight), 30+ (Obese)."
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>BMI Calculator</h1>
          <p className="calculator-description">
            Calculate your Body Mass Index (BMI) based on your height and weight. BMI is a common indicator of body fatness.
          </p>
        </div>

        <form onSubmit={calculateBMI} className="calculator-form">
          <div className="input-section">
            <h2>Unit Selection</h2>
            <div className="input-group">
              <label>
                <input
                  type="radio"
                  value="metric"
                  checked={units === 'metric'}
                  onChange={(e) => setUnits(e.target.value)}
                />
                Metric (kg, cm)
              </label>
              <label>
                <input
                  type="radio"
                  value="imperial"
                  checked={units === 'imperial'}
                  onChange={(e) => setUnits(e.target.value)}
                />
                Imperial (lb, ft, in)
              </label>
            </div>
          </div>

          {units === 'metric' ? (
            <div className="input-section">
              <div className="input-group">
                <label htmlFor="height">Height (cm)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    min="50"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="weight">Weight (kg)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    min="10"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="input-section">
              <div className="input-group">
                <label>Height</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="input-field">
                    <input
                      type="number"
                      placeholder="Feet"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      required
                      min="1"
                      step="1"
                    />
                  </div>
                  <div className="input-field">
                    <input
                      type="number"
                      placeholder="Inches"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      required
                      min="0"
                      max="11"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="weight-lb">Weight (lb)</label>
                <div className="input-field">
                  <input
                    type="number"
                    id="weight-lb"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    min="20"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="calculate-btn">Calculate BMI</button>
        </form>

        {result && (
          <div className="results-section">
            <h2>Your BMI Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Your BMI</span>
                <span className="result-value">{result.bmi}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Category</span>
                <span className="result-value">{result.category}</span>
              </div>
            </div>
          </div>
        )}

        <div className="content-section">
          <h2>BMI Categories & What They Mean</h2>
          <p>Your BMI result falls into one of four standard categories defined by the World Health Organization (WHO). Use the table below to understand where you stand and what health risks may apply.</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1.5rem 0', fontSize: '0.95rem' }}>
            <thead>
              <tr>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>BMI Range</th>
                <th style={{ background: '#1e3a5f', color: 'white', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: '600' }}>Health Implication</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#0284c7', fontWeight: '600' }}>Underweight</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Below 18.5</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>May indicate malnutrition, eating disorders, or other health conditions. Talk to a doctor.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#16a34a', fontWeight: '600' }}>Normal Weight</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>18.5 – 24.9</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Associated with lower risk of weight-related diseases. Maintain with balanced diet and regular exercise.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#d97706', fontWeight: '600' }}>Overweight</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>25.0 – 29.9</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Increased risk of cardiovascular disease, type 2 diabetes, and high blood pressure.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Obese (Class I)</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>30.0 – 34.9</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>High risk of serious health conditions. Medical guidance is recommended.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Obese (Class II)</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>35.0 – 39.9</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb' }}>Very high risk. Weight management programs and medical supervision advised.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}><span style={{ color: '#dc2626', fontWeight: '600' }}>Obese (Class III)</span></td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>40.0 and above</td>
                <td style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}>Extremely high risk. Sometimes called "severe obesity." Medical intervention often required.</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic', borderTop: '1px dashed #e5e7eb', paddingTop: '0.5rem', marginTop: '0.5rem' }}>Note: BMI categories for children and teens use age- and sex-specific percentile charts, not the adult ranges above. Consult your pediatrician for children's BMI interpretation.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>How is BMI Calculated? The Formula Explained</h2>
          <p>BMI is calculated using a simple mathematical formula that compares your weight to your height. There are two versions depending on your preferred unit system:</p>

          <h3>Metric Formula (kg and cm)</h3>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            BMI = weight (kg) ÷ height² (m)<br /><br />
            Example: 70 kg ÷ (1.75 m × 1.75 m) = <strong>22.9</strong> → Normal weight
          </div>

          <h3>Imperial Formula (lbs and inches)</h3>
          <div style={{ background: '#f1f5f9', borderLeft: '4px solid #3b82f6', padding: '1rem 1.4rem', borderRadius: '0 8px 8px 0', margin: '1.5rem 0', fontFamily: 'monospace', fontSize: '1rem' }}>
            BMI = (weight in lbs × 703) ÷ height² (inches)<br /><br />
            Example: (154 lbs × 703) ÷ (69 in × 69 in) = <strong>22.7</strong> → Normal weight
          </div>

          <p>The CalcLogic BMI Calculator handles both formulas automatically — just select your preferred unit system and enter your measurements above.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Limitations of BMI: What It Doesn't Tell You</h2>
          <p>BMI is a useful screening tool, but it has well-documented limitations that are important to understand before drawing health conclusions from your result.</p>

          <h3>It doesn't distinguish muscle from fat</h3>
          <p>A highly muscular athlete may register an "overweight" or even "obese" BMI despite having very low body fat and excellent cardiovascular health. Conversely, a sedentary person with a "normal" BMI may have dangerously high levels of visceral fat — a condition sometimes called "skinny fat" or normal-weight obesity.</p>

          <h3>It doesn't account for fat distribution</h3>
          <p>Where you carry body fat matters as much as how much you carry. Fat concentrated around the abdomen (central or visceral fat) is associated with higher metabolic risk than fat stored in the hips and thighs. Waist circumference measurements can complement your BMI result.</p>

          <h3>It varies by age and sex</h3>
          <p>Older adults naturally carry more body fat at the same BMI compared to younger adults. Women typically have higher body fat percentages than men at identical BMIs. Some researchers suggest that sex-adjusted BMI thresholds would be more clinically useful.</p>

          <h3>Ethnic differences in risk thresholds</h3>
          <p>Studies have found that people of Asian descent face increased health risks at BMIs lower than the standard 25 threshold. The World Health Organization recommends that Asian populations consider an overweight cut-off as low as 23, and obesity as low as 27.5.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Health Risks Associated with BMI</h2>
          <p>Research consistently shows that both ends of the BMI spectrum — underweight and obese — are associated with elevated health risks.</p>

          <h3>Risks of a high BMI (Overweight & Obese)</h3>
          <p>A BMI of 25 or above is associated with increased risk of: type 2 diabetes, high blood pressure (hypertension), heart disease and stroke, certain cancers (including colon, breast, and endometrial), sleep apnea, osteoarthritis, and non-alcoholic fatty liver disease.</p>

          <h3>Risks of a low BMI (Underweight)</h3>
          <p>A BMI below 18.5 may indicate insufficient nutrient intake and is associated with: weakened immune function, bone density loss and increased fracture risk, anemia, fertility issues, and complications during surgery or illness recovery.</p>

          <p>BMI is a <em>screening tool</em>, not a diagnosis. If your BMI falls outside the normal range, speak with a healthcare professional for a comprehensive assessment.</p>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1.2rem 1.4rem', margin: '2rem 0' }}>
            <h3 style={{ marginTop: '0', color: '#15803d', fontSize: '0.95rem' }}>🔗 Related CalcLogic Calculators</h3>
            <a href="/calorie-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Calorie Calculator</a>
            <a href="/body-fat-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Body Fat % Calculator</a>
            <a href="/tdee-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>TDEE Calculator</a>
            <a href="/ideal-weight-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Ideal Weight Calculator</a>
            <a href="/macros-calculator" style={{ color: '#16a34a', fontWeight: '500', marginRight: '1.2rem', textDecoration: 'none', fontSize: '0.9rem' }}>Macros Calculator</a>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }} />

          <h2>Frequently Asked Questions</h2>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What is a normal BMI for adults?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>A normal, healthy BMI for adults is between <strong>18.5 and 24.9</strong>. This range is associated with the lowest risk of weight-related health conditions for most people. However, ideal BMI can vary slightly based on age, sex, and ethnicity.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Is BMI different for men and women?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The BMI formula is the same for both men and women, but its interpretation can differ. Women naturally have a higher body fat percentage than men at the same BMI. Some health professionals argue that women's healthy BMI range should be interpreted with this in mind, though standard clinical thresholds remain the same.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What is a healthy BMI for women over 50?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>For women over 50, the standard BMI ranges still apply (18.5–24.9 for normal weight). However, post-menopausal women often experience changes in body composition, with fat redistribution to the abdomen. A slightly higher BMI (up to ~26–27) in older women may not carry the same risks as in younger adults, but maintaining a healthy lifestyle remains important regardless.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>How accurate is the BMI calculator?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>The BMI formula is mathematically precise — it will give the same result every time for the same inputs. However, BMI's accuracy as a <em>health indicator</em> has limitations, particularly for athletes, older adults, and certain ethnic groups. Use it as a starting point, not a definitive health verdict.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>What is a good BMI to lose weight?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>If your BMI is 25 or above, losing weight to bring it below 25 may improve health outcomes. A safe rate of weight loss is 0.5–1 kg (1–2 lbs) per week, achieved through a calorie deficit. Use our <a href="/calorie-calculator" style={{ color: '#3b82f6' }}>Calorie Calculator</a> to find your daily calorie targets for weight loss.</p>
          </div>

          <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem 1.4rem' }}>
            <h3 style={{ marginTop: '0', fontSize: '0.98rem', color: '#1e3a5f' }}>Can I have a normal BMI but still be unhealthy?</h3>
            <p style={{ marginBottom: '0', fontSize: '0.92rem' }}>Yes. A phenomenon called "metabolically obese normal weight" (MONW) affects people who fall within the normal BMI range but have excess visceral fat, insulin resistance, or other metabolic risk factors. Regular health check-ups including blood pressure, blood sugar, and cholesterol tests are important regardless of BMI.</p>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2rem' }}>
            <em>This calculator is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before making decisions about your health.</em>
          </p>
        </div>
        
        <ShareButtons 
          title="BMI Calculator"
          description="Calculate your Body Mass Index (BMI) with this free, easy-to-use calculator"
          customMessage="Check out this BMI Calculator - Calculate your Body Mass Index quickly and easily!"
        />
      </div>
    </>
  )
}

export default BMICalculator