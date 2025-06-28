import React from 'react'
import { useParams, Link } from 'react-router-dom'

const BlogPost = () => {
  const { id } = useParams()
  
  // Sample blog posts data - in a real app, this would come from an API
  const blogPosts = [
    {
      id: 7,
      title: "How to Calculate Your Retirement Needs: A Step-by-Step Guide",
      date: "May 22, 2024",
      author: "Jennifer Wilson, CFP",
      category: "Financial",
      image: "https://images.pexels.com/photos/7821485/pexels-photo-7821485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>Planning for retirement can feel overwhelming. How much money will you need? How much should you save each month? When can you retire comfortably? This step-by-step guide will help you calculate your retirement needs and create a solid plan.</p>
        
        <h2>Step 1: Estimate Your Retirement Expenses</h2>
        <p>The first step in retirement planning is determining how much money you'll need annually during retirement. Many financial advisors suggest you'll need 70-80% of your pre-retirement income to maintain your standard of living.</p>
        
        <h3>Common Retirement Expenses</h3>
        <ul>
          <li><strong>Housing:</strong> Mortgage or rent, property taxes, insurance, maintenance</li>
          <li><strong>Healthcare:</strong> Insurance premiums, out-of-pocket expenses, long-term care</li>
          <li><strong>Food:</strong> Groceries and dining out</li>
          <li><strong>Transportation:</strong> Car payments, insurance, maintenance, fuel</li>
          <li><strong>Utilities:</strong> Electricity, water, gas, internet, phone</li>
          <li><strong>Travel and leisure:</strong> Vacations, hobbies, entertainment</li>
          <li><strong>Taxes:</strong> Income taxes, property taxes</li>
        </ul>
        
        <h3>Expenses That May Decrease</h3>
        <ul>
          <li>Commuting costs</li>
          <li>Work-related expenses (clothing, lunches)</li>
          <li>Retirement savings contributions</li>
          <li>Mortgage payments (if paid off)</li>
          <li>Child-related expenses</li>
        </ul>
        
        <h3>Expenses That May Increase</h3>
        <ul>
          <li>Healthcare costs</li>
          <li>Travel and leisure activities</li>
          <li>Gifts and charitable giving</li>
        </ul>
        
        <h2>Step 2: Calculate Your Retirement Income</h2>
        <p>Next, estimate your expected retirement income from various sources:</p>
        
        <h3>Social Security</h3>
        <p>Visit the Social Security Administration's website to get a personalized estimate of your benefits. The average monthly benefit is around $1,800, but yours may be higher or lower depending on your earnings history.</p>
        
        <h3>Pensions</h3>
        <p>If you have a pension plan, contact your plan administrator to get an estimate of your benefits.</p>
        
        <h3>Other Income Sources</h3>
        <ul>
          <li>Part-time work</li>
          <li>Rental income</li>
          <li>Annuities</li>
          <li>Royalties</li>
        </ul>
        
        <h2>Step 3: Identify the Gap</h2>
        <p>Subtract your expected retirement income from your estimated expenses. This is the gap that your retirement savings will need to fill.</p>
        
        <h3>The 4% Rule</h3>
        <p>A common guideline is the 4% rule, which suggests you can withdraw 4% of your retirement savings in the first year, then adjust that amount for inflation each subsequent year. This approach is designed to make your savings last for approximately 30 years.</p>
        
        <p>To calculate how much you need to save:</p>
        <p><strong>Required Retirement Savings = Annual Income Gap ÷ 0.04</strong></p>
        
        <h4>Example:</h4>
        <p>If your annual expenses will be $80,000 and you expect $30,000 from Social Security and other sources, your income gap is $50,000.</p>
        <p>Required Retirement Savings = $50,000 ÷ 0.04 = $1,250,000</p>
        
        <h2>Step 4: Determine How Much to Save Monthly</h2>
        <p>Once you know your target retirement savings, you can calculate how much you need to save each month to reach that goal.</p>
        
        <h3>Factors to Consider:</h3>
        <ul>
          <li>Current age</li>
          <li>Desired retirement age</li>
          <li>Current retirement savings</li>
          <li>Expected rate of return on investments</li>
          <li>Inflation rate</li>
        </ul>
        
        <h3>Compound Interest Formula</h3>
        <p>The formula for calculating future value with regular contributions is complex, but you can use our <a href="/retirement-calculator">Retirement Calculator</a> to simplify this process.</p>
        
        <h2>Step 5: Adjust for Inflation</h2>
        <p>Inflation erodes purchasing power over time. Historically, inflation has averaged about 3% annually in the United States.</p>
        
        <p>To account for inflation, you can:</p>
        <ul>
          <li>Increase your savings target by 3% annually</li>
          <li>Use an inflation-adjusted rate of return in your calculations (typically 3-4% lower than nominal returns)</li>
          <li>Regularly revisit and update your retirement plan</li>
        </ul>
        
        <h2>Step 6: Consider Different Scenarios</h2>
        <p>Retirement planning involves many variables and uncertainties. It's wise to calculate multiple scenarios:</p>
        
        <h3>Best-Case Scenario</h3>
        <ul>
          <li>Higher investment returns</li>
          <li>Lower inflation</li>
          <li>Good health with lower healthcare costs</li>
        </ul>
        
        <h3>Worst-Case Scenario</h3>
        <ul>
          <li>Lower investment returns</li>
          <li>Higher inflation</li>
          <li>Health issues requiring expensive care</li>
          <li>Longer lifespan requiring more savings</li>
        </ul>
        
        <h2>Step 7: Regularly Review and Adjust</h2>
        <p>Retirement planning isn't a one-time exercise. Review your plan annually and make adjustments based on:</p>
        <ul>
          <li>Changes in income or expenses</li>
          <li>Investment performance</li>
          <li>Changes in retirement goals</li>
          <li>Changes in tax laws or retirement account rules</li>
        </ul>
        
        <h2>Tools to Help You Calculate</h2>
        <p>While these steps provide a framework, retirement calculators can simplify the process and provide more accurate projections. Our <a href="/retirement-calculator">Retirement Calculator</a> takes into account all these factors and provides a comprehensive analysis of your retirement readiness.</p>
        
        <h2>Conclusion</h2>
        <p>Calculating your retirement needs may seem daunting, but breaking it down into these steps makes it manageable. The earlier you start planning, the more options you'll have and the more confident you can be about your financial future.</p>
        
        <p>Remember that retirement planning is personal—there's no one-size-fits-all approach. Your retirement needs will depend on your desired lifestyle, health status, location, and many other factors unique to you.</p>
      `
    },
    {
      id: 1,
      title: "Understanding Compound Interest: The Eighth Wonder of the World",
      date: "May 15, 2024",
      author: "Sarah Johnson",
      category: "Financial",
      image: "https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>Albert Einstein is often quoted as saying, "Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it." Whether Einstein actually said this is debated, but the sentiment remains powerful.</p>
        
        <h2>What is Compound Interest?</h2>
        <p>Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. In simple terms, it's "interest on interest" which can cause your wealth to grow exponentially over time.</p>
        
        <p>The formula for compound interest is:</p>
        <p><strong>A = P(1 + r/n)^(nt)</strong></p>
        <p>Where:</p>
        <ul>
          <li>A = Final amount</li>
          <li>P = Principal (initial investment)</li>
          <li>r = Annual interest rate (decimal)</li>
          <li>n = Number of times interest is compounded per year</li>
          <li>t = Time in years</li>
        </ul>
        
        <h2>The Power of Time</h2>
        <p>The true power of compound interest becomes apparent over long periods. Let's look at an example:</p>
        
        <p>Imagine two investors:</p>
        <ul>
          <li><strong>Investor A</strong> invests $5,000 per year from age 25 to 35 (10 years total), then stops but leaves the money to grow until age 65.</li>
          <li><strong>Investor B</strong> invests $5,000 per year from age 35 to 65 (30 years total).</li>
        </ul>
        
        <p>Assuming a 7% annual return, by age 65:</p>
        <ul>
          <li>Investor A will have about $602,070 (from $50,000 invested)</li>
          <li>Investor B will have about $505,365 (from $150,000 invested)</li>
        </ul>
        
        <p>Despite investing three times as much money, Investor B ends up with less because Investor A had the advantage of time.</p>
        
        <h2>How to Make Compound Interest Work for You</h2>
        <ol>
          <li><strong>Start early:</strong> The sooner you start investing, the more time your money has to grow.</li>
          <li><strong>Be consistent:</strong> Regular contributions amplify the compounding effect.</li>
          <li><strong>Reinvest dividends:</strong> Instead of taking dividend payments, reinvest them to purchase more shares.</li>
          <li><strong>Maximize tax-advantaged accounts:</strong> Accounts like 401(k)s and IRAs allow your investments to grow tax-free or tax-deferred.</li>
          <li><strong>Be patient:</strong> Compound interest works best over long periods. Avoid the temptation to withdraw early.</li>
        </ol>
        
        <h2>The Flip Side: Debt</h2>
        <p>Remember the second part of Einstein's quote: "He who doesn't understand it, pays it." Compound interest works against you when you're in debt, especially high-interest debt like credit cards. The same exponential growth applies to what you owe, making it crucial to pay down high-interest debt as quickly as possible.</p>
        
        <h2>Conclusion</h2>
        <p>Understanding and harnessing the power of compound interest is one of the most important financial concepts for building wealth. By starting early, being consistent, and staying patient, you can make this "eighth wonder" work in your favor.</p>
        
        <p>Use our <a href="/compound-interest-calculator">Compound Interest Calculator</a> to see how your investments could grow over time!</p>
      `
    },
    {
      id: 2,
      title: "5 Common Mistakes When Calculating Your BMI",
      date: "May 8, 2024",
      author: "Dr. Michael Chen",
      category: "Health",
      image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>Body Mass Index (BMI) is one of the most widely used metrics for assessing whether someone is at a healthy weight. While it's a useful screening tool, there are several common mistakes people make when calculating and interpreting their BMI results.</p>
        
        <h2>Mistake #1: Inaccurate Measurements</h2>
        <p>The BMI formula is simple: weight (kg) divided by height squared (m²). However, many people use inaccurate measurements when calculating their BMI. Common errors include:</p>
        <ul>
          <li>Using outdated weight measurements</li>
          <li>Rounding height incorrectly</li>
          <li>Measuring height with shoes on</li>
          <li>Weighing yourself at different times of day</li>
        </ul>
        <p>For the most accurate BMI calculation, measure your height without shoes and weigh yourself in the morning after using the bathroom but before eating breakfast.</p>
        
        <h2>Mistake #2: Using the Wrong Formula</h2>
        <p>There are two common formulas for BMI:</p>
        <ul>
          <li><strong>Metric:</strong> BMI = weight (kg) / height² (m²)</li>
          <li><strong>Imperial:</strong> BMI = 703 × weight (lbs) / height² (inches²)</li>
        </ul>
        <p>Using the wrong formula or forgetting the conversion factor of 703 for imperial measurements can lead to significantly incorrect results.</p>
        
        <h2>Mistake #3: Ignoring Body Composition</h2>
        <p>BMI doesn't distinguish between fat, muscle, and bone mass. This means that highly muscular individuals (like athletes) may have a high BMI despite having low body fat. Conversely, elderly individuals or those with low muscle mass might have a "normal" BMI despite having unhealthy levels of body fat.</p>
        <p>Consider complementing your BMI calculation with other measurements like waist circumference or body fat percentage for a more complete picture.</p>
        
        <h2>Mistake #4: Applying Adult BMI Categories to Children</h2>
        <p>Adult BMI categories (underweight, normal, overweight, obese) don't apply to children and teenagers. For individuals under 20, BMI should be calculated the same way but interpreted using age and sex-specific percentiles.</p>
        <p>Many people mistakenly use adult categories for children, which can lead to incorrect assessments of a child's weight status.</p>
        
        <h2>Mistake #5: Treating BMI as a Diagnostic Tool</h2>
        <p>Perhaps the biggest mistake is treating BMI as a comprehensive diagnostic tool rather than a screening method. BMI was designed as a population-level screening tool and has limitations when applied to individuals.</p>
        <p>BMI doesn't account for:</p>
        <ul>
          <li>Body composition (as mentioned above)</li>
          <li>Fat distribution (central vs. peripheral)</li>
          <li>Ethnic and racial differences</li>
          <li>Age-related changes in body composition</li>
        </ul>
        <p>A healthcare provider should consider BMI alongside other factors when assessing health risks.</p>
        
        <h2>Conclusion</h2>
        <p>BMI remains a useful screening tool when used correctly. By avoiding these common mistakes, you can get a more accurate BMI calculation and better understand what it means for your health.</p>
        
        <p>For a quick and accurate BMI calculation, try our <a href="/bmi-calculator">BMI Calculator</a>.</p>
      `
    },
    {
      id: 3,
      title: "How to Create a Budget That Actually Works",
      date: "April 30, 2024",
      author: "Emily Rodriguez",
      category: "Financial",
      image: "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>Creating a budget is easy. Creating a budget you'll actually stick to is the real challenge. Many people start budgeting with enthusiasm only to abandon their plans within weeks. Here's how to create a budget that actually works for your lifestyle.</p>
        
        <h2>Start With Your Why</h2>
        <p>Before diving into numbers, clarify why you're budgeting. Are you trying to pay off debt? Save for a house? Build an emergency fund? Having a clear, meaningful goal will help you stay motivated when budgeting gets tough.</p>
        
        <h2>Track Your Spending First</h2>
        <p>Before creating a budget, track all your spending for at least 30 days. This gives you an accurate picture of where your money is actually going, not where you think it's going. You might be surprised by what you discover!</p>
        <p>Categories to track include:</p>
        <ul>
          <li>Housing (rent/mortgage, utilities, maintenance)</li>
          <li>Transportation (car payment, gas, public transit, maintenance)</li>
          <li>Food (groceries, dining out)</li>
          <li>Entertainment (streaming services, hobbies, events)</li>
          <li>Personal (clothing, haircuts, gym membership)</li>
          <li>Healthcare (insurance, medications, appointments)</li>
          <li>Debt payments (credit cards, student loans)</li>
          <li>Savings and investments</li>
        </ul>
        
        <h2>Choose a Budgeting Method That Fits Your Personality</h2>
        <p>There's no one-size-fits-all approach to budgeting. Consider these popular methods:</p>
        
        <h3>50/30/20 Budget</h3>
        <p>Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment. This simple approach works well for beginners.</p>
        
        <h3>Zero-Based Budget</h3>
        <p>Give every dollar a job so your income minus expenses equals zero. This detailed approach works well for those who like control and precision.</p>
        
        <h3>Envelope System</h3>
        <p>Allocate cash to different spending categories (envelopes) at the beginning of the month. When an envelope is empty, you're done spending in that category. This works well for visual learners and those who struggle with overspending.</p>
        
        <h3>Pay Yourself First</h3>
        <p>Automatically direct a portion of your income to savings and investments before paying other expenses. This works well for those focused on long-term goals.</p>
        
        <h2>Build in Flexibility</h2>
        <p>A too-rigid budget is destined to fail. Include a "miscellaneous" or "fun money" category for unexpected expenses or spontaneous purchases. This prevents you from feeling deprived or abandoning your budget when life happens.</p>
        
        <h2>Automate What You Can</h2>
        <p>Set up automatic transfers for savings, investments, and bill payments. This reduces the mental load of budgeting and ensures your most important financial priorities are handled.</p>
        
        <h2>Review and Adjust Regularly</h2>
        <p>Your budget isn't set in stone. Review it monthly and make adjustments as needed. Life changes, income fluctuates, and priorities shift. Your budget should evolve accordingly.</p>
        
        <h2>Use Technology Wisely</h2>
        <p>Budgeting apps and tools can simplify the process, but only if you actually use them. Choose tools that match your preferences and habits. Some people prefer spreadsheets, while others like specialized apps that connect to their accounts.</p>
        
        <h2>Celebrate Small Wins</h2>
        <p>Acknowledge and celebrate your budgeting successes, no matter how small. Paid off a credit card? Reached a savings milestone? Stayed under budget in a challenging category? Take a moment to recognize your progress.</p>
        
        <h2>Conclusion</h2>
        <p>A successful budget reflects your values, accommodates your lifestyle, and helps you achieve your financial goals. It might take some trial and error to find the right approach, but the financial security and peace of mind are worth the effort.</p>
        
        <p>Ready to start budgeting? Try our <a href="/budget-calculator">Budget Calculator</a> to create a personalized plan.</p>
      `
    },
    {
      id: 4,
      title: "The Mathematics Behind Mortgage Calculations",
      date: "April 22, 2024",
      author: "Robert Chang, CFA",
      category: "Financial",
      image: "https://images.pexels.com/photos/7821485/pexels-photo-7821485.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>When you're shopping for a home, understanding how mortgage payments are calculated can help you make informed decisions. Let's dive into the mathematics behind mortgage calculations.</p>
        
        <h2>The Basic Mortgage Payment Formula</h2>
        <p>The formula for calculating a fixed-rate mortgage payment is:</p>
        <p><strong>M = P[r(1+r)^n]/[(1+r)^n-1]</strong></p>
        <p>Where:</p>
        <ul>
          <li><strong>M</strong> = Monthly payment</li>
          <li><strong>P</strong> = Principal (loan amount)</li>
          <li><strong>r</strong> = Monthly interest rate (annual rate divided by 12)</li>
          <li><strong>n</strong> = Total number of payments (loan term in years × 12)</li>
        </ul>
        
        <h2>Breaking Down the Formula</h2>
        <p>Let's break this down with an example. Suppose you're taking out a $300,000 mortgage with a 30-year term and a 4% annual interest rate.</p>
        
        <p><strong>Step 1:</strong> Calculate the monthly interest rate (r).</p>
        <p>r = 0.04 / 12 = 0.0033333</p>
        
        <p><strong>Step 2:</strong> Determine the total number of payments (n).</p>
        <p>n = 30 years × 12 months = 360 payments</p>
        
        <p><strong>Step 3:</strong> Apply the formula.</p>
        <p>M = $300,000 × [0.0033333 × (1 + 0.0033333)^360] / [(1 + 0.0033333)^360 - 1]</p>
        <p>M = $300,000 × [0.0033333 × 3.3152] / [3.3152 - 1]</p>
        <p>M = $300,000 × [0.0110507] / [2.3152]</p>
        <p>M = $300,000 × 0.0047731</p>
        <p>M = $1,431.93</p>
        
        <h2>Amortization: How Payments Are Applied</h2>
        <p>Each mortgage payment consists of both principal and interest. Initially, a larger portion goes toward interest, but this shifts over time.</p>
        
        <p>For the first payment in our example:</p>
        <ul>
          <li><strong>Interest:</strong> $300,000 × 0.0033333 = $1,000</li>
          <li><strong>Principal:</strong> $1,431.93 - $1,000 = $431.93</li>
        </ul>
        
        <p>For the second payment, the remaining loan balance is $300,000 - $431.93 = $299,568.07, so:</p>
        <ul>
          <li><strong>Interest:</strong> $299,568.07 × 0.0033333 = $998.56</li>
          <li><strong>Principal:</strong> $1,431.93 - $998.56 = $433.37</li>
        </ul>
        
        <p>This process continues for all 360 payments, with the principal portion gradually increasing and the interest portion decreasing.</p>
        
        <h2>Additional Costs: PITI</h2>
        <p>Your actual mortgage payment often includes more than just principal and interest. The acronym PITI represents the four components of a typical mortgage payment:</p>
        <ul>
          <li><strong>P</strong> = Principal</li>
          <li><strong>I</strong> = Interest</li>
          <li><strong>T</strong> = Property Taxes</li>
          <li><strong>I</strong> = Insurance (homeowner's insurance and possibly PMI)</li>
        </ul>
        
        <p>Property taxes and insurance are typically held in an escrow account and paid by your mortgage servicer when due.</p>
        
        <h2>The Impact of Interest Rates</h2>
        <p>Even small changes in interest rates can significantly affect your monthly payment and total interest paid. For our $300,000, 30-year mortgage example:</p>
        <ul>
          <li>At 4%: $1,431.93/month, total interest paid = $215,495</li>
          <li>At 5%: $1,610.46/month, total interest paid = $279,767</li>
          <li>At 6%: $1,798.65/month, total interest paid = $347,515</li>
        </ul>
        <p>That's a difference of over $130,000 in total interest between a 4% and 6% rate!</p>
        
        <h2>The Mathematics of Points and Fees</h2>
        <p>Mortgage points (or discount points) are upfront fees paid to lower your interest rate. One point typically costs 1% of the loan amount and reduces the rate by 0.25%.</p>
        
        <p>To determine if points are worth it, calculate the break-even point:</p>
        <p><strong>Break-even point = Cost of points / Monthly savings</strong></p>
        
        <p>For example, on a $300,000 loan, one point costs $3,000. If this reduces your payment by $40/month, the break-even point is $3,000 / $40 = 75 months (6.25 years). If you plan to keep the loan longer than that, buying points makes mathematical sense.</p>
        
        <h2>Conclusion</h2>
        <p>Understanding the mathematics behind mortgage calculations empowers you to make better decisions when shopping for a home loan. You can compare different scenarios, evaluate the true cost of a mortgage, and determine the most financially advantageous options for your situation.</p>
        
        <p>Use our <a href="/mortgage-calculator">Mortgage Calculator</a> to experiment with different loan amounts, interest rates, and terms to find the best mortgage for your needs.</p>
      `
    },
    {
      id: 5,
      title: "Calculating Macros: A Beginner's Guide to Nutrition",
      date: "April 15, 2024",
      author: "Jessica Martinez, RD",
      category: "Health",
      image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>If you've ventured into the world of nutrition and fitness, you've likely encountered the term "macros." Short for macronutrients, these are the nutrients your body needs in large amounts: protein, carbohydrates, and fats. Calculating and tracking your macros can be a powerful tool for achieving your health and fitness goals.</p>
        
        <h2>What Are Macronutrients?</h2>
        <p>Before diving into calculations, let's understand what each macronutrient does:</p>
        
        <h3>Protein (4 calories per gram)</h3>
        <ul>
          <li>Builds and repairs tissues</li>
          <li>Supports immune function</li>
          <li>Creates enzymes and hormones</li>
          <li>Sources: meat, fish, eggs, dairy, legumes, tofu</li>
        </ul>
        
        <h3>Carbohydrates (4 calories per gram)</h3>
        <ul>
          <li>Provides energy, especially for the brain and during high-intensity exercise</li>
          <li>Spares protein from being used for energy</li>
          <li>Supports digestive health (fiber)</li>
          <li>Sources: grains, fruits, vegetables, legumes</li>
        </ul>
        
        <h3>Fats (9 calories per gram)</h3>
        <ul>
          <li>Provides energy during rest and low-intensity activities</li>
          <li>Supports cell growth</li>
          <li>Protects organs</li>
          <li>Helps absorb certain vitamins</li>
          <li>Sources: oils, nuts, seeds, avocados, fatty fish</li>
        </ul>
        
        <h2>Step 1: Calculate Your Calorie Needs</h2>
        <p>Before determining your macro split, you need to know your total daily calorie needs. This depends on several factors:</p>
        
        <h3>Basal Metabolic Rate (BMR)</h3>
        <p>Your BMR is the number of calories your body needs at rest. The Mifflin-St Jeor equation is commonly used to calculate BMR:</p>
        
        <p><strong>For men:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5</p>
        <p><strong>For women:</strong> BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161</p>
        
        <h3>Total Daily Energy Expenditure (TDEE)</h3>
        <p>Your TDEE accounts for your activity level. Multiply your BMR by the appropriate activity factor:</p>
        <ul>
          <li>Sedentary (little or no exercise): BMR × 1.2</li>
          <li>Lightly active (light exercise 1-3 days/week): BMR × 1.375</li>
          <li>Moderately active (moderate exercise 3-5 days/week): BMR × 1.55</li>
          <li>Very active (hard exercise 6-7 days/week): BMR × 1.725</li>
          <li>Extra active (very hard exercise & physical job): BMR × 1.9</li>
        </ul>
        
        <h3>Adjust for Your Goal</h3>
        <ul>
          <li>Weight maintenance: Use your TDEE</li>
          <li>Weight loss: Subtract 250-500 calories from TDEE</li>
          <li>Weight gain: Add 250-500 calories to TDEE</li>
        </ul>
        
        <h2>Step 2: Determine Your Macro Ratios</h2>
        <p>Different goals call for different macro ratios. Here are some common starting points:</p>
        
        <h3>Balanced (General Health)</h3>
        <ul>
          <li>Protein: 30% of calories</li>
          <li>Carbohydrates: 40% of calories</li>
          <li>Fats: 30% of calories</li>
        </ul>
        
        <h3>Weight Loss</h3>
        <ul>
          <li>Protein: 40% of calories</li>
          <li>Carbohydrates: 30% of calories</li>
          <li>Fats: 30% of calories</li>
        </ul>
        
        <h3>Muscle Gain</h3>
        <ul>
          <li>Protein: 30% of calories</li>
          <li>Carbohydrates: 45% of calories</li>
          <li>Fats: 25% of calories</li>
        </ul>
        
        <h3>Endurance Athletes</h3>
        <ul>
          <li>Protein: 20% of calories</li>
          <li>Carbohydrates: 60% of calories</li>
          <li>Fats: 20% of calories</li>
        </ul>
        
        <h2>Step 3: Convert Percentages to Grams</h2>
        <p>Once you have your calorie target and macro percentages, convert them to grams:</p>
        
        <ol>
          <li>Protein grams = (Total calories × Protein percentage) ÷ 4</li>
          <li>Carbohydrate grams = (Total calories × Carb percentage) ÷ 4</li>
          <li>Fat grams = (Total calories × Fat percentage) ÷ 9</li>
        </ol>
        
        <h2>Example Calculation</h2>
        <p>Let's say you're a 30-year-old woman, 165 cm tall, weighing 65 kg, moderately active, looking to maintain weight with a balanced macro ratio.</p>
        
        <h3>Step 1: Calculate Calories</h3>
        <p>BMR = (10 × 65) + (6.25 × 165) - (5 × 30) - 161 = 1,381.25 calories</p>
        <p>TDEE = 1,381.25 × 1.55 = 2,141 calories</p>
        
        <h3>Step 2: Apply Macro Ratios (Balanced)</h3>
        <ul>
          <li>Protein: 30% of 2,141 = 642.3 calories</li>
          <li>Carbs: 40% of 2,141 = 856.4 calories</li>
          <li>Fats: 30% of 2,141 = 642.3 calories</li>
        </ul>
        
        <h3>Step 3: Convert to Grams</h3>
        <ul>
          <li>Protein: 642.3 ÷ 4 = 161 grams</li>
          <li>Carbs: 856.4 ÷ 4 = 214 grams</li>
          <li>Fats: 642.3 ÷ 9 = 71 grams</li>
        </ul>
        
        <h2>Fine-Tuning Your Macros</h2>
        <p>Remember that these calculations provide a starting point. You may need to adjust based on:</p>
        <ul>
          <li>How your body responds</li>
          <li>Your specific health conditions</li>
          <li>Your training schedule</li>
          <li>Your personal preferences</li>
        </ul>
        
        <p>Track your progress for 2-3 weeks, then make small adjustments if needed.</p>
        
        <h2>Conclusion</h2>
        <p>Calculating your macros can seem complex at first, but it becomes easier with practice. This approach offers more flexibility than traditional dieting while still providing structure for reaching your goals.</p>
        
        <p>Remember that quality matters too—focus on nutrient-dense foods within your macro targets for optimal health.</p>
        
        <p>Ready to calculate your personal macro targets? Try our <a href="/macro-calculator">Macro Calculator</a> for a customized plan.</p>
      `
    },
    {
      id: 6,
      title: "Statistics Made Simple: Understanding the Basics",
      date: "April 8, 2024",
      author: "Professor Alan Wright",
      category: "Math",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      content: `
        <p>Statistics can seem intimidating, but understanding the basics doesn't have to be complicated. Whether you're a student, professional, or just curious, grasping fundamental statistical concepts can help you make sense of data and make better decisions.</p>
        
        <h2>What is Statistics?</h2>
        <p>Statistics is the science of collecting, analyzing, interpreting, and presenting data. It helps us understand patterns, relationships, and trends in information. There are two main branches:</p>
        <ul>
          <li><strong>Descriptive statistics:</strong> Summarizes and describes data</li>
          <li><strong>Inferential statistics:</strong> Makes predictions or inferences based on data</li>
        </ul>
        
        <h2>Key Descriptive Statistics</h2>
        
        <h3>Measures of Central Tendency</h3>
        <p>These tell us about the "middle" or "center" of our data:</p>
        
        <h4>Mean (Average)</h4>
        <p>The sum of all values divided by the number of values.</p>
        <p><strong>Formula:</strong> μ = (Σx) / n</p>
        <p><strong>Example:</strong> For the data set {2, 4, 6, 8, 10}, the mean is (2+4+6+8+10)/5 = 30/5 = 6</p>
        
        <h4>Median</h4>
        <p>The middle value when data is arranged in order.</p>
        <p><strong>Example:</strong> For {2, 4, 6, 8, 10}, the median is 6</p>
        <p><strong>Example:</strong> For {2, 4, 6, 8}, the median is (4+6)/2 = 5</p>
        
        <h4>Mode</h4>
        <p>The most frequently occurring value.</p>
        <p><strong>Example:</strong> For {2, 4, 4, 6, 8, 10}, the mode is 4</p>
        
        <h3>Measures of Spread</h3>
        <p>These tell us how spread out our data is:</p>
        
        <h4>Range</h4>
        <p>The difference between the maximum and minimum values.</p>
        <p><strong>Formula:</strong> Range = Max - Min</p>
        <p><strong>Example:</strong> For {2, 4, 6, 8, 10}, the range is 10 - 2 = 8</p>
        
        <h4>Variance</h4>
        <p>The average of squared differences from the mean.</p>
        <p><strong>Formula (Population):</strong> σ² = Σ(x - μ)² / N</p>
        <p><strong>Formula (Sample):</strong> s² = Σ(x - x̄)² / (n-1)</p>
        
        <h4>Standard Deviation</h4>
        <p>The square root of the variance, giving us a measure of spread in the same units as our data.</p>
        <p><strong>Formula (Population):</strong> σ = √σ²</p>
        <p><strong>Formula (Sample):</strong> s = √s²</p>
        
        <h2>Probability Basics</h2>
        <p>Probability is the likelihood of an event occurring, expressed as a number between 0 (impossible) and 1 (certain).</p>
        
        <h3>Basic Probability Formula</h3>
        <p>P(Event) = Number of favorable outcomes / Total number of possible outcomes</p>
        
        <h3>Example:</h3>
        <p>When rolling a six-sided die, the probability of rolling a 3 is 1/6 ≈ 0.167 or about 16.7%.</p>
        
        <h2>Normal Distribution</h2>
        <p>The normal distribution (bell curve) is a continuous probability distribution that's symmetric around the mean. Many natural phenomena follow this distribution.</p>
        
        <h3>Properties:</h3>
        <ul>
          <li>Mean, median, and mode are all equal</li>
          <li>Symmetric around the mean</li>
          <li>68% of data falls within 1 standard deviation of the mean</li>
          <li>95% of data falls within 2 standard deviations</li>
          <li>99.7% of data falls within 3 standard deviations</li>
        </ul>
        
        <h2>Correlation</h2>
        <p>Correlation measures the strength and direction of the relationship between two variables.</p>
        
        <h3>Correlation Coefficient (r)</h3>
        <ul>
          <li>Ranges from -1 to +1</li>
          <li>+1 indicates a perfect positive correlation</li>
          <li>-1 indicates a perfect negative correlation</li>
          <li>0 indicates no correlation</li>
        </ul>
        
        <p><strong>Important note:</strong> Correlation does not imply causation. Just because two variables are correlated doesn't mean one causes the other.</p>
        
        <h2>Practical Applications</h2>
        <p>Statistics is used in countless fields:</p>
        <ul>
          <li><strong>Business:</strong> Market research, quality control, forecasting</li>
          <li><strong>Medicine:</strong> Clinical trials, epidemiology, diagnostic testing</li>
          <li><strong>Social Sciences:</strong> Survey analysis, demographic studies</li>
          <li><strong>Sports:</strong> Player performance analysis, game strategy</li>
          <li><strong>Finance:</strong> Risk assessment, investment analysis</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Statistics provides powerful tools for understanding data and making informed decisions. By grasping these fundamental concepts, you've taken the first step toward statistical literacy—an increasingly valuable skill in our data-driven world.</p>
        
        <p>Need to perform statistical calculations? Try our <a href="/statistics-calculator">Statistics Calculator</a> for quick and accurate results.</p>
      `
    }
  ]

  // Find the blog post that matches the ID from the URL
  const post = blogPosts.find(post => post.id === parseInt(id))

  if (!post) {
    return (
      <div className="calculator-container">
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Blog Post Not Found</h1>
          <p>Sorry, the blog post you're looking for doesn't exist.</p>
          <Link to="/blog" style={{ 
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: '#4a90e2',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Return to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="calculator-container">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/blog" style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            color: '#4a90e2',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Back to Blog
          </Link>
        </div>

        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <img 
            src={post.image} 
            alt={post.title} 
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
          
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                display: 'inline-block', 
                background: '#f0f9ff', 
                color: '#4a90e2', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px',
                fontSize: '0.875rem',
                marginRight: '1rem'
              }}>
                {post.category}
              </span>
              <span style={{ color: '#888', fontSize: '0.875rem' }}>{post.date}</span>
            </div>
            
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{post.title}</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>By {post.author}</p>
            
            <div 
              className="blog-content"
              style={{ lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3>Share this article</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="#" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#3b5998',
              color: 'white'
            }}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#1da1f2',
              color: 'white'
            }}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#0077b5',
              color: 'white'
            }}>
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#25D366',
              color: 'white'
            }}>
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3>Related Articles</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {blogPosts
              .filter(relatedPost => relatedPost.id !== post.id && relatedPost.category === post.category)
              .slice(0, 3)
              .map(relatedPost => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ 
                    background: '#f8fafc', 
                    borderRadius: '6px', 
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title} 
                      style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1rem', flex: '1' }}>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{relatedPost.title}</h4>
                      <span style={{ color: '#888', fontSize: '0.75rem' }}>{relatedPost.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPost