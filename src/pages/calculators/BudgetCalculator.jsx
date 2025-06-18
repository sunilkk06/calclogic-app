import React, { useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const BudgetCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '5000',
    otherIncome: '0',
    housing: '1500',
    utilities: '200',
    insurance: '300',
    debtPayments: '500',
    groceries: '400',
    transportation: '200',
    entertainment: '300',
    otherExpenses: '200',
    savingsPercent: '20'
  })
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateBudget = (e) => {
    e.preventDefault()
    
    // Parse input values
    const monthlyIncome = parseFloat(formData.monthlyIncome) || 0
    const otherIncome = parseFloat(formData.otherIncome) || 0
    const housing = parseFloat(formData.housing) || 0
    const utilities = parseFloat(formData.utilities) || 0
    const insurance = parseFloat(formData.insurance) || 0
    const debtPayments = parseFloat(formData.debtPayments) || 0
    const groceries = parseFloat(formData.groceries) || 0
    const transportation = parseFloat(formData.transportation) || 0
    const entertainment = parseFloat(formData.entertainment) || 0
    const otherExpenses = parseFloat(formData.otherExpenses) || 0
    const savingsPercent = parseFloat(formData.savingsPercent) || 0

    // Calculate totals
    const totalIncome = monthlyIncome + otherIncome
    const totalExpenses = housing + utilities + insurance + debtPayments + 
                          groceries + transportation + entertainment + otherExpenses
    
    const targetSavings = totalIncome * (savingsPercent / 100)
    const actualSavings = totalIncome - totalExpenses
    const savingsRate = (actualSavings / totalIncome) * 100

    // Prepare expense breakdown for table and chart
    const expenses = [
      { category: 'Housing', amount: housing },
      { category: 'Utilities', amount: utilities },
      { category: 'Insurance', amount: insurance },
      { category: 'Debt Payments', amount: debtPayments },
      { category: 'Groceries', amount: groceries },
      { category: 'Transportation', amount: transportation },
      { category: 'Entertainment', amount: entertainment },
      { category: 'Other Expenses', amount: otherExpenses }
    ]

    // Calculate percentages
    expenses.forEach(expense => {
      expense.percentage = (expense.amount / totalIncome) * 100
    })

    // Sort expenses by amount (descending)
    expenses.sort((a, b) => b.amount - a.amount)

    setResults({
      totalIncome,
      totalExpenses,
      monthlySavings: actualSavings,
      savingsRate,
      targetSavings,
      expenses
    })

    // Prepare chart data
    setChartData({
      labels: expenses.map(expense => expense.category),
      datasets: [
        {
          data: expenses.map(expense => expense.amount),
          backgroundColor: [
            '#4a90e2',
            '#50C878',
            '#FFA500',
            '#FF6347',
            '#9370DB',
            '#20B2AA',
            '#F08080',
            '#BDB76B'
          ],
          borderColor: [
            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff',
            '#ffffff'
          ],
          borderWidth: 1,
        },
      ],
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h1>Budget Calculator</h1>
        <p className="calculator-description">
          Create a detailed monthly budget to track your income and expenses. Visualize your spending patterns and identify areas for savings.
        </p>
      </div>

      <form onSubmit={calculateBudget} className="calculator-form">
        <div className="input-section">
          <h2>Income</h2>
          <div className="input-group">
            <label htmlFor="monthlyIncome">Monthly Income</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="monthlyIncome"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="otherIncome">Other Monthly Income</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="otherIncome"
                name="otherIncome"
                value={formData.otherIncome}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Fixed Expenses</h2>
          <div className="input-group">
            <label htmlFor="housing">Housing (Rent/Mortgage)</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="housing"
                name="housing"
                value={formData.housing}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="utilities">Utilities</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="utilities"
                name="utilities"
                value={formData.utilities}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="insurance">Insurance</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="insurance"
                name="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="debtPayments">Debt Payments</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="debtPayments"
                name="debtPayments"
                value={formData.debtPayments}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Variable Expenses</h2>
          <div className="input-group">
            <label htmlFor="groceries">Groceries</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="groceries"
                name="groceries"
                value={formData.groceries}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="transportation">Transportation</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="transportation"
                name="transportation"
                value={formData.transportation}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="entertainment">Entertainment</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="entertainment"
                name="entertainment"
                value={formData.entertainment}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="otherExpenses">Other Expenses</label>
            <div className="input-field">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="otherExpenses"
                name="otherExpenses"
                value={formData.otherExpenses}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="input-section">
          <h2>Savings Goals</h2>
          <div className="input-group">
            <label htmlFor="savingsPercent">Monthly Savings Target</label>
            <div className="input-field">
              <input
                type="number"
                id="savingsPercent"
                name="savingsPercent"
                value={formData.savingsPercent}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                step="0.1"
              />
              <span className="percentage-symbol">%</span>
            </div>
          </div>
        </div>

        <button type="submit" className="calculate-btn">Calculate Budget</button>
      </form>

      {results && (
        <div className="results-section">
          <h2>Your Monthly Budget Summary</h2>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Total Income</span>
              <span className="result-value">{formatCurrency(results.totalIncome)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Expenses</span>
              <span className="result-value">{formatCurrency(results.totalExpenses)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Monthly Savings</span>
              <span className="result-value">{formatCurrency(results.monthlySavings)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Savings Rate</span>
              <span className="result-value">{results.savingsRate.toFixed(1)}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ flex: '1 1 400px' }}>
              <h3>Expense Breakdown</h3>
              <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Category</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.expenses.map((expense, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{expense.category}</td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{formatCurrency(expense.amount)}</td>
                        <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>{expense.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div style={{ flex: '1 1 400px' }}>
              <h3>Expense Distribution</h3>
              <div style={{ height: '300px', marginTop: '1rem' }}>
                {chartData && (
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const percentage = (value / results.totalIncome * 100).toFixed(1);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {results.monthlySavings < results.targetSavings && (
            <div style={{ 
              marginTop: '2rem', 
              background: '#fff8e1', 
              padding: '1rem', 
              borderRadius: '4px',
              border: '1px solid #ffd54f'
            }}>
              <p style={{ color: '#ff6f00' }}>
                <strong>Note:</strong> Your current monthly savings of {formatCurrency(results.monthlySavings)} is less than your target of {formatCurrency(results.targetSavings)} ({formData.savingsPercent}% of income).
                Consider reducing expenses or increasing income to meet your savings goal.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="info-cards">
        <div className="info-card">
          <h3>50/30/20 Rule</h3>
          <p>A popular budgeting guideline suggests allocating 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.</p>
        </div>
        <div className="info-card">
          <h3>Emergency Fund</h3>
          <p>Financial experts recommend having 3-6 months of living expenses saved in an emergency fund for unexpected situations.</p>
        </div>
        <div className="info-card">
          <h3>Budgeting Tips</h3>
          <p>Track your spending, set realistic goals, and review your budget regularly. Small changes can lead to significant savings over time.</p>
        </div>
      </div>
    </div>
  )
}

export default BudgetCalculator