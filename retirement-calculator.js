document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    const form = document.getElementById('retirement-calculator-form');
    const calculateBtn = document.getElementById('calculate-retirement-btn');
    
    // Initialize Chart.js
    let retirementChart = null;

    // Currency formatter
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    // Set default values
    document.getElementById('current-age').value = '30';
    document.getElementById('retirement-age').value = '65';
    document.getElementById('life-expectancy').value = '90';
    document.getElementById('investment-return').value = '7';
    document.getElementById('inflation-rate').value = '3';
    document.getElementById('employer-match').value = '3';

    calculateBtn.addEventListener('click', calculateRetirement);

    function calculateRetirement() {
        if (!validateInputs()) {
            return;
        }

        // Get input values
        const inputs = getInputValues();
        
        // Calculate retirement details
        const results = calculateRetirementDetails(inputs);
        
        // Update the display
        updateResults(results);
        
        // Update the chart
        updateChart(results);
        
        // Update the breakdown table
        updateBreakdownTable(results);
    }

    function validateInputs() {
        const requiredInputs = [
            'current-age', 'retirement-age', 'life-expectancy',
            'current-savings', 'monthly-contribution', 'investment-return',
            'inflation-rate', 'desired-income'
        ];

        let isValid = true;
        requiredInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const value = parseFloat(input.value);
            
            if (isNaN(value) || value < 0) {
                alert(`Please enter a valid value for ${input.previousElementSibling.textContent}`);
                isValid = false;
            }
        });

        const currentAge = parseInt(document.getElementById('current-age').value);
        const retirementAge = parseInt(document.getElementById('retirement-age').value);
        const lifeExpectancy = parseInt(document.getElementById('life-expectancy').value);

        if (retirementAge <= currentAge) {
            alert('Retirement age must be greater than current age');
            isValid = false;
        }

        if (lifeExpectancy <= retirementAge) {
            alert('Life expectancy must be greater than retirement age');
            isValid = false;
        }

        return isValid;
    }

    function getInputValues() {
        return {
            currentAge: parseInt(document.getElementById('current-age').value),
            retirementAge: parseInt(document.getElementById('retirement-age').value),
            lifeExpectancy: parseInt(document.getElementById('life-expectancy').value),
            currentSavings: parseFloat(document.getElementById('current-savings').value),
            monthlyContribution: parseFloat(document.getElementById('monthly-contribution').value),
            employerMatch: parseFloat(document.getElementById('employer-match').value) || 0,
            investmentReturn: parseFloat(document.getElementById('investment-return').value) / 100,
            inflationRate: parseFloat(document.getElementById('inflation-rate').value) / 100,
            desiredIncome: parseFloat(document.getElementById('desired-income').value),
            socialSecurity: parseFloat(document.getElementById('social-security').value) || 0,
            otherIncome: parseFloat(document.getElementById('other-income').value) || 0
        };
    }

    function calculateRetirementDetails(inputs) {
        const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
        const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
        
        // Calculate real rate of return (adjusted for inflation)
        const realReturn = (1 + inputs.investmentReturn) / (1 + inputs.inflationRate) - 1;
        
        // Calculate annual contribution including employer match
        const annualContribution = inputs.monthlyContribution * 12 * (1 + inputs.employerMatch / 100);
        
        let yearlyBreakdown = [];
        let balance = inputs.currentSavings;
        const currentYear = new Date().getFullYear();
        
        // Calculate accumulation phase
        for (let year = 0; year <= yearsToRetirement; year++) {
            const age = inputs.currentAge + year;
            const investmentReturns = balance * inputs.investmentReturn;
            balance = balance * (1 + inputs.investmentReturn) + annualContribution;
            
            yearlyBreakdown.push({
                age: age,
                year: currentYear + year,
                annualSavings: annualContribution,
                investmentReturns: investmentReturns,
                totalBalance: balance
            });
        }

        // Calculate retirement income
        const monthlyRetirementIncome = (balance * 0.04) / 12; // Using 4% withdrawal rule
        const totalMonthlyIncome = monthlyRetirementIncome + 
            (inputs.socialSecurity / 12) + (inputs.otherIncome / 12);
        const desiredMonthlyIncome = inputs.desiredIncome / 12;
        const incomeGap = desiredMonthlyIncome - totalMonthlyIncome;
        
        return {
            totalSavings: balance,
            monthlyRetirementIncome: monthlyRetirementIncome,
            totalMonthlyIncome: totalMonthlyIncome,
            incomeGap: incomeGap,
            yearlyBreakdown: yearlyBreakdown,
            savingsProgress: (totalMonthlyIncome / desiredMonthlyIncome) * 100
        };
    }

    function updateResults(results) {
        document.getElementById('total-savings').textContent = 
            currencyFormatter.format(results.totalSavings);
        document.getElementById('monthly-retirement-income').textContent = 
            currencyFormatter.format(results.totalMonthlyIncome);
        document.getElementById('income-gap').textContent = 
            currencyFormatter.format(results.incomeGap);
        
        // Update progress bar
        const progressBar = document.getElementById('savings-progress');
        const progress = Math.min(Math.max(results.savingsProgress, 0), 100);
        progressBar.style.width = `${progress}%`;
        progressBar.style.backgroundColor = progress >= 100 ? '#4CAF50' : '#ff9800';
    }

    function updateChart(results) {
        const ctx = document.getElementById('retirement-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (retirementChart) {
            retirementChart.destroy();
        }
        
        const labels = results.yearlyBreakdown.map(item => item.year);
        const balances = results.yearlyBreakdown.map(item => item.totalBalance);
        
        retirementChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Projected Savings Balance',
                    data: balances,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Retirement Savings Projection'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return currencyFormatter.format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return currencyFormatter.format(value);
                            }
                        }
                    }
                }
            }
        });
    }

    function updateBreakdownTable(results) {
        const tbody = document.getElementById('breakdown-body');
        tbody.innerHTML = '';
        
        results.yearlyBreakdown.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.age}</td>
                <td>${item.year}</td>
                <td>${currencyFormatter.format(item.annualSavings)}</td>
                <td>${currencyFormatter.format(item.investmentReturns)}</td>
                <td>${currencyFormatter.format(item.totalBalance)}</td>
            `;
            tbody.appendChild(row);
        });
    }
}); 