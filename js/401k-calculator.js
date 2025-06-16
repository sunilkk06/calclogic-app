document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('401k-form');
    const resultsSection = document.getElementById('results');
    let balanceChart = null;

    // Format currency
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    // Calculate annual contribution with employer match
    function calculateAnnualContribution(salary, contributionPercent, employerMatch, employerMatchLimit) {
        const employeeContribution = salary * (contributionPercent / 100);
        const maxMatchableContribution = salary * (employerMatchLimit / 100);
        const actualMatchableContribution = Math.min(employeeContribution, maxMatchableContribution);
        const employerContribution = actualMatchableContribution * (employerMatch / 100);
        
        return {
            employee: employeeContribution,
            employer: employerContribution,
            total: employeeContribution + employerContribution
        };
    }

    // Calculate 401k growth
    function calculate401k(data) {
        const results = {
            years: [],
            balances: [],
            contributions: [],
            employerMatch: [],
            totalContributions: 0,
            totalEmployerMatch: 0,
            finalBalance: 0
        };

        let currentBalance = parseFloat(data.currentBalance);
        let currentSalary = parseFloat(data.annualSalary);
        const yearsToRetirement = data.retirementAge - data.currentAge;
        const annualReturn = data.annualReturn / 100;
        const salaryIncrease = data.salaryIncrease / 100;

        for (let year = 0; year <= yearsToRetirement; year++) {
            const age = data.currentAge + year;
            const yearNumber = new Date().getFullYear() + year;
            
            // Calculate contributions for the year
            const yearlyContribution = calculateAnnualContribution(
                currentSalary,
                data.contributionPercent,
                data.employerMatch,
                data.employerMatchLimit
            );

            // Add contributions to balance
            currentBalance += yearlyContribution.total;
            
            // Calculate returns
            currentBalance *= (1 + annualReturn);

            // Track results
            results.years.push(age);
            results.balances.push(currentBalance);
            results.contributions.push(yearlyContribution.employee);
            results.employerMatch.push(yearlyContribution.employer);
            
            // Update running totals
            results.totalContributions += yearlyContribution.employee;
            results.totalEmployerMatch += yearlyContribution.employer;

            // Increase salary for next year
            currentSalary *= (1 + salaryIncrease);
        }

        results.finalBalance = currentBalance;
        results.totalReturns = currentBalance - results.totalContributions - results.totalEmployerMatch - data.currentBalance;

        return results;
    }

    // Update the breakdown table
    function updateBreakdownTable(results) {
        const tbody = document.querySelector('#yearBreakdown tbody');
        tbody.innerHTML = '';

        const currentYear = new Date().getFullYear();

        results.years.forEach((age, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${age}</td>
                <td>${currentYear + index}</td>
                <td>${formatCurrency(results.contributions[index])}</td>
                <td>${formatCurrency(results.employerMatch[index])}</td>
                <td>${formatCurrency(results.balances[index])}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Update the chart
    function updateChart(results) {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        
        if (balanceChart) {
            balanceChart.destroy();
        }

        balanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: results.years,
                datasets: [{
                    label: '401k Balance',
                    data: results.balances,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Balance: ' + formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Age'
                        }
                    }
                }
            }
        });
    }

    // Update results display
    function updateResults(results) {
        document.getElementById('final-balance').textContent = formatCurrency(results.finalBalance);
        document.getElementById('total-contributions').textContent = formatCurrency(results.totalContributions);
        document.getElementById('total-employer').textContent = formatCurrency(results.totalEmployerMatch);
        document.getElementById('total-returns').textContent = formatCurrency(results.totalReturns);
        
        updateChart(results);
        updateBreakdownTable(results);
        resultsSection.classList.remove('hidden');
    }

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const data = {
            currentAge: parseInt(document.getElementById('current-age').value),
            retirementAge: parseInt(document.getElementById('retirement-age').value),
            currentBalance: parseFloat(document.getElementById('current-401k').value) || 0,
            annualSalary: parseFloat(document.getElementById('annual-salary').value),
            contributionPercent: parseFloat(document.getElementById('contribution-percent').value),
            employerMatch: parseFloat(document.getElementById('employer-match').value),
            employerMatchLimit: parseFloat(document.getElementById('employer-match-limit').value),
            annualReturn: parseFloat(document.getElementById('annual-return').value),
            salaryIncrease: parseFloat(document.getElementById('salary-increase').value)
        };

        const results = calculate401k(data);
        updateResults(results);
    });

    // Input validation
    form.addEventListener('input', function(e) {
        const input = e.target;
        if (input.type === 'number') {
            const value = parseFloat(input.value);
            
            if (input.id === 'current-age' || input.id === 'retirement-age') {
                if (value < parseInt(input.min)) input.value = input.min;
                if (value > parseInt(input.max)) input.value = input.max;
            }
            
            if (input.id === 'contribution-percent' || input.id === 'employer-match' || 
                input.id === 'employer-match-limit' || input.id === 'annual-return' || 
                input.id === 'salary-increase') {
                if (value < 0) input.value = 0;
                if (value > 100) input.value = 100;
            }

            if (input.id === 'current-401k' || input.id === 'annual-salary') {
                if (value < 0) input.value = 0;
            }
        }
    });
}); 