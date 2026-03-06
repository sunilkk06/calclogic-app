import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ShareButtons from '../../components/ShareButtons'

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    homePrice: '300000',
    downPayment: '60000',
    loanTerm: '30',
    interestRate: '3.5',
    propertyTax: '1.2',
    homeInsurance: '1200'
  })
  const [results, setResults] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateMortgage = (e) => {
    e.preventDefault()
    
    const homePrice = parseFloat(formData.homePrice)
    const downPayment = parseFloat(formData.downPayment)
    const loanTerm = parseInt(formData.loanTerm)
    const interestRate = parseFloat(formData.interestRate) / 100
    const propertyTax = parseFloat(formData.propertyTax) / 100
    const homeInsurance = parseFloat(formData.homeInsurance)

    // Calculate loan amount
    const loanAmount = homePrice - downPayment
    
    // Calculate monthly interest rate
    const monthlyRate = interestRate / 12
    
    // Calculate number of payments
    const numberOfPayments = loanTerm * 12

    // Calculate monthly mortgage payment (P&I)
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    // Calculate monthly tax and insurance
    const monthlyTax = (homePrice * propertyTax) / 12
    const monthlyInsurance = homeInsurance / 12

    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance

    // Calculate total payment and interest
    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - loanAmount

    setResults({
      monthlyPayment: monthlyPayment,
      monthlyTax: monthlyTax,
      monthlyInsurance: monthlyInsurance,
      totalMonthlyPayment: totalMonthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      loanAmount: loanAmount
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  return (
    <>
      <Helmet>
        <title>Mortgage Calculator — Monthly Payment + Amortization | CalcLogic</title>
        <meta name="description" content="Calculate your monthly mortgage payment including principal, interest, taxes &amp; insurance. Free mortgage calculator with full amortization schedule. Instant results." />
        <link rel="canonical" href="https://calclogic.com/mortgage-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Mortgage Calculator — Monthly Payment + Amortization | CalcLogic" />
        <meta property="og:description" content="Free mortgage calculator. Estimate your monthly payment with taxes and insurance, and view your full amortization schedule instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calclogic.com/mortgage-calculator" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Mortgage Calculator — Free &amp; Instant | CalcLogic" />
        <meta name="twitter:description" content="Calculate monthly mortgage payments with taxes & insurance. Includes full amortization schedule." />
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How is a monthly mortgage payment calculated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A monthly mortgage payment is calculated using the loan amount (home price minus down payment), the interest rate, and the loan term. The formula is: M = P[r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of payments. Property taxes and homeowners insurance are typically added on top of this base payment."
                }
              },
              {
                "@type": "Question",
                "name": "What is included in a monthly mortgage payment?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A full monthly mortgage payment typically includes four components, often called PITI: Principal (repayment of the loan balance), Interest (the cost of borrowing), Taxes (property taxes collected in escrow), and Insurance (homeowners insurance and PMI if applicable)."
                }
              },
              {
                "@type": "Question",
                "name": "What is a good interest rate for a mortgage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A good mortgage interest rate depends on the current market, your credit score, loan type, and down payment. Generally, rates within 0.5% of the national average for your loan type are considered competitive. Borrowers with credit scores above 740 and down payments of 20% or more typically qualify for the best rates."
                }
              },
              {
                "@type": "Question",
                "name": "How much house can I afford?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A common guideline is to keep your total monthly housing payment (PITI) at or below 28% of your gross monthly income, and total debt payments below 36%. For example, if you earn $6,000/month, your mortgage payment should ideally stay under $1,680. Use the mortgage calculator above to find what home price fits your budget."
                }
              },
              {
                "@type": "Question",
                "name": "What is the difference between a 15-year and 30-year mortgage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A 15-year mortgage has higher monthly payments but you pay significantly less interest over the life of the loan and build equity faster. A 30-year mortgage has lower monthly payments, making it more affordable month-to-month, but you pay more total interest. For example, on a $300,000 loan at 7%, a 30-year term costs roughly $418,000 in total interest vs. about $185,000 on a 15-year term."
                }
              },
              {
                "@type": "Question",
                "name": "When is PMI required and how much does it cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Private Mortgage Insurance (PMI) is typically required when your down payment is less than 20% of the home's purchase price. PMI usually costs between 0.5% and 1.5% of the original loan amount per year, added to your monthly payment. Once your loan balance reaches 80% of the home's value, you can request PMI cancellation."
                }
              },
              {
                "@type": "Question",
                "name": "What is an amortization schedule?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "An amortization schedule is a complete table showing every monthly payment over the life of your loan, breaking down how much goes toward principal vs. interest each month. In the early years, most of your payment covers interest. Over time, the balance shifts until your final payments are almost entirely principal."
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
            "name": "How to Calculate Your Monthly Mortgage Payment",
            "description": "Calculate your estimated monthly mortgage payment using home price, down payment, interest rate, and loan term.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Enter your home price",
                "text": "Input the purchase price of the home you are buying or refinancing."
              },
              {
                "@type": "HowToStep",
                "name": "Enter your down payment",
                "text": "Enter the amount you plan to put down. A down payment of 20% or more avoids PMI."
              },
              {
                "@type": "HowToStep",
                "name": "Select your loan term",
                "text": "Choose 15, 20, or 30 years. Shorter terms mean higher payments but less total interest paid."
              },
              {
                "@type": "HowToStep",
                "name": "Enter your interest rate",
                "text": "Input your mortgage interest rate. Check with lenders for current rates based on your credit profile."
              },
              {
                "@type": "HowToStep",
                "name": "Add property tax and insurance",
                "text": "Enter your estimated annual property tax rate and homeowners insurance cost for a complete PITI payment estimate."
              },
              {
                "@type": "HowToStep",
                "name": "Review your results",
                "text": "CalcLogic calculates your total monthly payment, total interest paid, and full amortization schedule."
              }
            ]
          }`}
        </script>
      </Helmet>
      
      <div className="calculator-container">
        <div className="calculator-header">
          <h1>Mortgage Calculator</h1>
          <p className="calculator-description">
            Calculate your monthly mortgage payments, view amortization schedule, and understand the total cost of your home loan.
          </p>
        </div>

        <form onSubmit={calculateMortgage} className="calculator-form">
          <div className="input-section">
            <h2>Loan Details</h2>
            <div className="input-group">
              <label htmlFor="homePrice">Home Price</label>
              <div className="input-field">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="homePrice"
                  name="homePrice"
                  value={formData.homePrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="downPayment">Down Payment</label>
              <div className="input-field">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="downPayment"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="loanTerm">Loan Term (Years)</label>
              <div className="input-field">
                <select
                  id="loanTerm"
                  name="loanTerm"
                  value={formData.loanTerm}
                  onChange={handleInputChange}
                  required
                >
                  <option value="30">30 Years</option>
                  <option value="20">20 Years</option>
                  <option value="15">15 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <div className="input-field">
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
                <span className="percentage-symbol">%</span>
              </div>
            </div>
          </div>

          <div className="input-section">
            <h2>Additional Costs</h2>
            <div className="input-group">
              <label htmlFor="propertyTax">Property Tax Rate (%)</label>
              <div className="input-field">
                <input
                  type="number"
                  id="propertyTax"
                  name="propertyTax"
                  value={formData.propertyTax}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
                <span className="percentage-symbol">%</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="homeInsurance">Annual Home Insurance</label>
              <div className="input-field">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="homeInsurance"
                  name="homeInsurance"
                  value={formData.homeInsurance}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="calculate-btn">Calculate Mortgage</button>
        </form>

        {results && (
          <div className="results-section">
            <h2>Your Mortgage Results</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Principal & Interest</span>
                <span className="result-value">{formatCurrency(results.monthlyPayment)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Property Tax</span>
                <span className="result-value">{formatCurrency(results.monthlyTax)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Home Insurance</span>
                <span className="result-value">{formatCurrency(results.monthlyInsurance)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Monthly Payment</span>
                <span className="result-value">{formatCurrency(results.totalMonthlyPayment)}</span>
              </div>
            </div>
            
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Loan Amount</span>
                <span className="result-value">{formatCurrency(results.loanAmount)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Interest</span>
                <span className="result-value">{formatCurrency(results.totalInterest)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Payment</span>
                <span className="result-value">{formatCurrency(results.totalPayment)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mortgage-content">
          <h2>What's Included in Your Monthly Mortgage Payment?</h2>
          <p>Your total monthly mortgage payment is made up of four components, commonly referred to as <strong>PITI</strong>. Understanding each part helps you budget accurately and avoid surprises at closing.</p>

          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>What It Is</th>
                <th>Typical % of Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Principal (P)</strong></td>
                <td>The portion that reduces your outstanding loan balance</td>
                <td>Grows over time</td>
              </tr>
              <tr>
                <td><strong>Interest (I)</strong></td>
                <td>The lender's fee for borrowing — highest in early years</td>
                <td>Shrinks over time</td>
              </tr>
              <tr>
                <td><strong>Taxes (T)</strong></td>
                <td>Annual property taxes divided into 12 monthly installments, held in escrow</td>
                <td>Varies by location</td>
              </tr>
              <tr>
                <td><strong>Insurance (I)</strong></td>
                <td>Homeowners insurance + PMI if down payment is under 20%</td>
                <td>Varies by home value</td>
              </tr>
            </tbody>
          </table>

          <div className="tip-box">
            <strong>💡 Pro Tip:</strong> Many first-time buyers only account for principal and interest and are caught off-guard by the full PITI payment. Our calculator includes taxes and insurance so your estimate reflects your real monthly obligation.
          </div>

          <hr className="section-divider" />

          <h2>How is a Mortgage Payment Calculated?</h2>
          <p>The core of your mortgage payment is calculated using the standard amortization formula. This determines how your fixed monthly payment is split between principal and interest each month.</p>

          <div className="formula-box">
            M = P × [r(1+r)^n] ÷ [(1+r)^n − 1]<br /><br />
            Where:<br />
            M = Monthly payment<br />
            P = Principal loan amount (home price − down payment)<br />
            r = Monthly interest rate (annual rate ÷ 12)<br />
            n = Total number of payments (loan term in years × 12)
          </div>

          <h3>Worked Example</h3>
          <p>Home price: $300,000 | Down payment: $60,000 | Loan: $240,000 | Rate: 7% | Term: 30 years</p>
          <div className="formula-box">
            r = 7% ÷ 12 = 0.5833% per month<br />
            n = 30 × 12 = 360 payments<br /><br />
            M = 240,000 × [0.005833 × (1.005833)^360] ÷ [(1.005833)^360 − 1]<br />
            M = <strong>$1,597/month</strong> (principal + interest only)<br /><br />
            Add property tax (~$300/mo) + insurance (~$100/mo) = <strong>~$1,997 total PITI</strong>
          </div>

          <hr className="section-divider" />

          <h2>15-Year vs. 30-Year Mortgage: Which Is Right for You?</h2>
          <p>Your loan term has a massive impact on both your monthly payment and the total amount you pay over the life of the loan. Here's a direct comparison using a $300,000 loan at 7%:</p>

          <table>
            <thead>
              <tr>
                <th>Loan Term</th>
                <th>Monthly Payment</th>
                <th>Total Interest Paid</th>
                <th>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>30 Years</strong></td>
                <td>$1,996</td>
                <td className="highlight">$418,527</td>
                <td>$718,527</td>
              </tr>
              <tr>
                <td><strong>20 Years</strong></td>
                <td>$2,326</td>
                <td className="highlight">$258,220</td>
                <td>$558,220</td>
              </tr>
              <tr>
                <td><strong>15 Years</strong></td>
                <td>$2,696</td>
                <td className="highlight">$185,367</td>
                <td>$485,367</td>
              </tr>
            </tbody>
          </table>

          <p>Choosing a 15-year over a 30-year mortgage on a $300,000 loan saves over <strong>$233,000 in interest</strong> — but requires paying $700 more per month. The right choice depends on your cash flow, job stability, and other financial goals.</p>

          <hr className="section-divider" />

          <h2>Down Payment, Equity & PMI Explained</h2>

          <h3>Why 20% down matters</h3>
          <p>A down payment of 20% or more eliminates the need for Private Mortgage Insurance (PMI), which typically costs 0.5%–1.5% of your loan amount annually. On a $240,000 loan, PMI could add $100–$300 to your monthly payment — money that builds no equity.</p>

          <h3>How much down payment do you actually need?</h3>
          <table>
            <thead>
              <tr>
                <th>Loan Type</th>
                <th>Minimum Down Payment</th>
                <th>PMI Required?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Conventional Loan</td>
                <td>3% – 5%</td>
                <td>Yes, until 20% equity reached</td>
              </tr>
              <tr>
                <td>FHA Loan</td>
                <td>3.5% (credit score 580+)</td>
                <td>Yes (MIP for life of loan in most cases)</td>
              </tr>
              <tr>
                <td>VA Loan (veterans)</td>
                <td>0%</td>
                <td>No</td>
              </tr>
              <tr>
                <td>USDA Loan (rural)</td>
                <td>0%</td>
                <td>No (annual fee instead)</td>
              </tr>
              <tr>
                <td>Jumbo Loan</td>
                <td>10% – 20%</td>
                <td>Varies by lender</td>
              </tr>
            </tbody>
          </table>

          <hr className="section-divider" />

          <h2>How Much House Can You Afford?</h2>
          <p>Lenders use two key debt-to-income ratios to determine how much mortgage you qualify for:</p>

          <h3>The 28% Front-End Rule</h3>
          <p>Your total monthly housing payment (PITI) should not exceed <strong>28% of your gross monthly income</strong>. If you earn $7,000/month before taxes, your maximum housing payment would be $1,960.</p>

          <h3>The 36% Back-End Rule</h3>
          <p>Your total monthly debt payments — including mortgage, car loans, student loans, and credit cards — should not exceed <strong>36% of gross monthly income</strong>. Some lenders allow up to 43–50% for well-qualified borrowers.</p>

          <table>
            <thead>
              <tr>
                <th>Annual Income</th>
                <th>Max Monthly Payment (28%)</th>
                <th>Estimated Home Price (7%, 30yr)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>$50,000</td><td>$1,167</td><td>~$175,000</td></tr>
              <tr><td>$75,000</td><td>$1,750</td><td>~$262,000</td></tr>
              <tr><td>$100,000</td><td>$2,333</td><td>~$350,000</td></tr>
              <tr><td>$150,000</td><td>$3,500</td><td>~$524,000</td></tr>
            </tbody>
          </table>

          <div className="tip-box">
            <strong>⚠️ Remember:</strong> Lender approval and personal affordability are different things. Just because a lender approves you for a certain amount doesn't mean that payment comfortably fits your lifestyle and savings goals.
          </div>

          <hr className="section-divider" />

          <h2>5 Ways to Lower Your Monthly Mortgage Payment</h2>

          <h3>1. Improve your credit score before applying</h3>
          <p>Even a 0.5% reduction in your interest rate saves tens of thousands over a 30-year loan. Borrowers with scores above 740 consistently receive the best rates. Pay down revolving debt and avoid new credit inquiries for 6–12 months before applying.</p>

          <h3>2. Make a larger down payment</h3>
          <p>A larger down payment reduces your loan principal, eliminates PMI sooner (or immediately), and may qualify you for a lower interest rate. Even moving from 5% to 10% down can meaningfully reduce your payment.</p>

          <h3>3. Choose a longer loan term</h3>
          <p>Extending from a 15-year to a 30-year term reduces your monthly payment significantly, though you'll pay more total interest. This can make sense if cash flow is a priority and you plan to invest the difference.</p>

          <h3>4. Shop multiple lenders</h3>
          <p>Mortgage rates vary significantly between lenders. Getting quotes from at least 3–5 lenders — including banks, credit unions, and online mortgage companies — can save you thousands. Rate shopping within a 45-day window is treated as a single inquiry by credit bureaus.</p>

          <h3>5. Consider buying mortgage points</h3>
          <p>Mortgage discount points let you pay upfront to permanently lower your interest rate. One point costs 1% of the loan amount and typically reduces your rate by 0.25%. This makes sense if you plan to stay in the home long enough to recoup the upfront cost (usually 4–7 years).</p>

          <hr className="section-divider" />

          <div className="internal-links">
            <h3>🔗 Related CalcLogic Calculators</h3>
            <a href="/auto-loan-calculator">Auto Loan Calculator</a>
            <a href="/refinance-calculator">Refinance Calculator</a>
            <a href="/amortization-calculator">Amortization Calculator</a>
            <a href="/compound-interest-calculator">Compound Interest Calculator</a>
            <a href="/loan-calculator">Personal Loan Calculator</a>
          </div>

          <hr className="section-divider" />

          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>What is the monthly payment on a $300,000 mortgage?</h3>
            <p>At a 7% interest rate on a 30-year term, a $300,000 mortgage has a principal and interest payment of approximately <strong>$1,996/month</strong>. Adding property taxes (~$300/mo) and homeowners insurance (~$100/mo) brings the total PITI payment to roughly <strong>$2,400/month</strong>. Use the calculator above with your actual rate and costs for a precise figure.</p>
          </div>

          <div className="faq-item">
            <h3>What credit score do I need to get a mortgage?</h3>
            <p>The minimum credit score depends on loan type: conventional loans typically require 620+, FHA loans require 580+ (with 3.5% down) or 500+ (with 10% down), and VA loans have no official minimum though lenders usually require 620+. Higher scores qualify for significantly better interest rates.</p>
          </div>

          <div className="faq-item">
            <h3>How much is PMI per month?</h3>
            <p>PMI typically costs between 0.5% and 1.5% of your original loan amount per year. On a $240,000 loan, that's $1,200–$3,600 per year, or <strong>$100–$300 per month</strong>. Your exact PMI rate depends on your credit score, down payment percentage, and loan type.</p>
          </div>

          <div className="faq-item">
            <h3>Can I pay off my mortgage early?</h3>
            <p>Yes — making extra payments toward principal reduces your loan balance faster, shortens your loan term, and saves significantly on interest. Even one extra payment per year on a 30-year mortgage can shave 4–6 years off the loan. Check your loan agreement for any prepayment penalties before doing so.</p>
          </div>

          <div className="faq-item">
            <h3>What is an escrow account in a mortgage?</h3>
            <p>An escrow account is a holding account managed by your lender that collects a portion of your property taxes and homeowners insurance with each monthly payment. When those bills come due, the lender pays them directly on your behalf. Most lenders require escrow accounts when your down payment is under 20%.</p>
          </div>

          <div className="faq-item">
            <h3>Is it better to rent or buy a home?</h3>
            <p>This depends on your financial situation, local market, and how long you plan to stay. Generally, buying makes more financial sense if you plan to stay 5+ years, have a stable income and emergency fund, and the local price-to-rent ratio is favorable. Renting offers more flexibility and lower upfront costs. A mortgage calculator helps you see the true cost of buying for comparison.</p>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2rem' }}>
            <em>This calculator provides estimates for informational purposes only and does not constitute financial or lending advice. Actual mortgage terms depend on your lender, credit profile, and local market conditions. Always consult a licensed mortgage professional before making home financing decisions.</em>
          </p>
        </div>
        
        <ShareButtons 
          title="Mortgage Calculator"
          description="Calculate your monthly mortgage payments and understand the total cost of your home loan"
          customMessage="Calculate your monthly mortgage payments with this easy-to-use calculator!"
        />
      </div>
    </>
  )
}

export default MortgageCalculator