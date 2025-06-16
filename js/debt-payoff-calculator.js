document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('debt-form');
    const debtsContainer = document.getElementById('debts-container');
    const addDebtBtn = document.getElementById('add-debt-btn');
    const resultsSection = document.getElementById('results');
    let payoffChart = null;

    // Format currency
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    // Format percentage
    function formatPercent(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }

    // Add debt entry row
    function addDebtEntry() {
        const debtEntry = document.createElement('div');
        debtEntry.className = 'debt-entry form-group-inline';
        debtEntry.innerHTML = `
            <input type="text" class="debt-name" placeholder="Debt Name" required>
            <input type="number" class="debt-balance" placeholder="Balance ($)" min="0" step="0.01" required>
            <input type="number" class="debt-rate" placeholder="Interest Rate (%)" min="0" max="100" step="0.01" required>
            <input type="number" class="debt-payment" placeholder="Min Payment ($)" min="0" step="0.01" required>
            <button type="button" class="btn-remove-debt" title="Remove Debt">
                <i class="fas fa-times"></i>
            </button>
        `;

        debtsContainer.appendChild(debtEntry);

        // Add event listener to remove button
        const removeBtn = debtEntry.querySelector('.btn-remove-debt');
        removeBtn.addEventListener('click', function() {
            if (debtsContainer.children.length > 1) {
                debtEntry.remove();
            }
        });
    }

    // Calculate minimum payment for a debt
    function calculateMinPayment(balance, rate, minPayment) {
        const monthlyRate = rate / 1200;
        const interest = balance * monthlyRate;
        return Math.max(minPayment, interest + 1); // Ensure payment covers at least interest plus $1
    }

    // Calculate months to payoff and total interest for a single debt
    function calculateDebtPayoff(balance, rate, payment) {
        let remainingBalance = balance;
        let totalInterest = 0;
        let months = 0;
        const monthlyRate = rate / 1200;

        while (remainingBalance > 0 && months < 1200) { // Cap at 100 years
            const interest = remainingBalance * monthlyRate;
            const principal = Math.min(payment, remainingBalance + interest) - interest;
            
            totalInterest += interest;
            remainingBalance -= principal;
            months++;

            if (remainingBalance < 0.01) remainingBalance = 0;
        }

        return {
            months: months,
            totalInterest: totalInterest
        };
    }

    // Calculate full debt payoff schedule
    function calculatePayoffSchedule(debts, totalPayment, strategy, extraPayment = 0) {
        const schedule = [];
        let remainingDebts = debts.map(debt => ({
            ...debt,
            remainingBalance: debt.balance
        }));
        let month = 0;
        const startDate = new Date();
        let totalInterestPaid = 0;
        let availablePayment = totalPayment + extraPayment;

        while (remainingDebts.length > 0 && month < 1200) { // Cap at 100 years
            const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);
            
            // Sort debts according to strategy
            remainingDebts.sort((a, b) => {
                if (strategy === 'avalanche') {
                    return b.rate - a.rate;
                } else { // snowball
                    return a.remainingBalance - b.remainingBalance;
                }
            });

            // Calculate minimum payments
            let remainingPayment = availablePayment;
            const monthlyPayments = [];

            // First, allocate minimum payments
            remainingDebts.forEach(debt => {
                const minPayment = calculateMinPayment(debt.remainingBalance, debt.rate, debt.minPayment);
                const payment = Math.min(minPayment, debt.remainingBalance + (debt.remainingBalance * debt.rate / 1200));
                remainingPayment -= payment;
                monthlyPayments.push({
                    debtName: debt.name,
                    payment: payment,
                    remainingBalance: debt.remainingBalance
                });
            });

            // Then, allocate remaining payment to highest priority debt
            if (remainingPayment > 0 && remainingDebts.length > 0) {
                const targetDebt = monthlyPayments[0];
                targetDebt.payment += remainingPayment;
            }

            // Apply payments and calculate new balances
            for (let i = 0; i < remainingDebts.length; i++) {
                const debt = remainingDebts[i];
                const payment = monthlyPayments[i];
                const monthlyRate = debt.rate / 1200;
                const interest = debt.remainingBalance * monthlyRate;
                const principal = payment.payment - interest;

                totalInterestPaid += interest;
                debt.remainingBalance -= principal;

                if (debt.remainingBalance < 0.01) {
                    debt.remainingBalance = 0;
                }

                schedule.push({
                    date: monthDate,
                    debtName: debt.name,
                    payment: payment.payment,
                    principal: principal,
                    interest: interest,
                    remainingBalance: debt.remainingBalance
                });
            }

            // Remove paid off debts
            remainingDebts = remainingDebts.filter(debt => debt.remainingBalance > 0);
            month++;
        }

        return {
            schedule: schedule,
            months: month,
            totalInterest: totalInterestPaid
        };
    }

    // Update the payoff schedule table
    function updatePayoffTable(schedule) {
        const tbody = document.querySelector('#payoffTable tbody');
        tbody.innerHTML = '';

        schedule.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date.toLocaleDateString()}</td>
                <td>${entry.debtName}</td>
                <td>${formatCurrency(entry.payment)}</td>
                <td>${formatCurrency(entry.principal)}</td>
                <td>${formatCurrency(entry.interest)}</td>
                <td>${formatCurrency(entry.remainingBalance)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Update the chart
    function updateChart(schedule) {
        const ctx = document.getElementById('payoffChart').getContext('2d');
        
        // Aggregate data by month
        const monthlyData = {};
        schedule.forEach(entry => {
            const monthKey = entry.date.toISOString().slice(0, 7);
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    date: entry.date,
                    totalBalance: 0
                };
            }
            monthlyData[monthKey].totalBalance += entry.remainingBalance;
        });

        const sortedMonths = Object.values(monthlyData).sort((a, b) => a.date - b.date);
        
        if (payoffChart) {
            payoffChart.destroy();
        }

        payoffChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedMonths.map(month => month.date.toLocaleDateString()),
                datasets: [{
                    label: 'Total Debt Balance',
                    data: sortedMonths.map(month => month.totalBalance),
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
                    }
                }
            }
        });
    }

    // Update results display
    function updateResults(debts, payoffResults, baselineResults) {
        const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
        const interestSaved = baselineResults.totalInterest - payoffResults.totalInterest;

        document.getElementById('total-debt').textContent = formatCurrency(totalDebt);
        document.getElementById('payoff-time').textContent = `${payoffResults.months} months`;
        document.getElementById('total-interest').textContent = formatCurrency(payoffResults.totalInterest);
        document.getElementById('interest-saved').textContent = formatCurrency(interestSaved);

        updateChart(payoffResults.schedule);
        updatePayoffTable(payoffResults.schedule);
        resultsSection.classList.remove('hidden');
    }

    // Initialize with one debt entry
    if (debtsContainer.children.length === 0) {
        addDebtEntry();
    }

    // Add Debt Button Click Handler
    addDebtBtn.addEventListener('click', addDebtEntry);

    // Form Submit Handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect debt data
        const debts = [];
        const debtEntries = debtsContainer.querySelectorAll('.debt-entry');
        
        debtEntries.forEach(entry => {
            debts.push({
                name: entry.querySelector('.debt-name').value,
                balance: parseFloat(entry.querySelector('.debt-balance').value),
                rate: parseFloat(entry.querySelector('.debt-rate').value),
                minPayment: parseFloat(entry.querySelector('.debt-payment').value)
            });
        });

        const totalPayment = parseFloat(document.getElementById('monthly-payment').value);
        const extraPayment = parseFloat(document.getElementById('extra-payment').value) || 0;
        const strategy = document.getElementById('strategy').value;

        // Calculate payoff schedule with selected strategy
        const payoffResults = calculatePayoffSchedule(debts, totalPayment, strategy, extraPayment);

        // Calculate baseline (minimum payments only) for comparison
        const baselineResults = calculatePayoffSchedule(debts, totalPayment, strategy, 0);

        updateResults(debts, payoffResults, baselineResults);
    });

    // Input Validation
    form.addEventListener('input', function(e) {
        const input = e.target;
        if (input.type === 'number') {
            const value = parseFloat(input.value);
            
            if (input.classList.contains('debt-rate')) {
                if (value < 0) input.value = 0;
                if (value > 100) input.value = 100;
            }
            
            if (input.classList.contains('debt-balance') || 
                input.classList.contains('debt-payment') || 
                input.id === 'monthly-payment' || 
                input.id === 'extra-payment') {
                if (value < 0) input.value = 0;
            }
        }
    });
}); 