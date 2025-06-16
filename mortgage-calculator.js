document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const calculatorForm = document.getElementById('mortgage-calculator-form');
    const resultsSection = document.getElementById('results-section');
    const amortizationTable = document.getElementById('amortization-table');
    const monthlyPaymentResult = document.getElementById('monthly-payment');
    const totalPaymentResult = document.getElementById('total-payment');
    const totalInterestResult = document.getElementById('total-interest');

    // Initialize Chart.js
    let amortizationChart = null;

    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateMortgage();
    });

    // Input validation and formatting
    function setupInputValidation() {
        const numericInputs = document.querySelectorAll('input[type="number"]');
        numericInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
            });
        });

        // Format percentage inputs
        const percentageInputs = document.querySelectorAll('.percentage-input');
        percentageInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value) {
                    this.value = parseFloat(this.value).toFixed(2);
                }
            });
        });
    }

    function calculateMortgage() {
        // Get input values
        const homePrice = parseFloat(document.getElementById('home-price').value);
        const downPayment = parseFloat(document.getElementById('down-payment').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const propertyTax = parseFloat(document.getElementById('property-tax').value) / 100;
        const homeInsurance = parseFloat(document.getElementById('home-insurance').value);

        // Calculate loan amount
        const loanAmount = homePrice - downPayment;
        
        // Calculate monthly interest rate
        const monthlyRate = interestRate / 12;
        
        // Calculate number of payments
        const numberOfPayments = loanTerm * 12;

        // Calculate monthly mortgage payment (P&I)
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        // Calculate monthly tax and insurance
        const monthlyTax = (homePrice * propertyTax) / 12;
        const monthlyInsurance = homeInsurance / 12;

        // Calculate total monthly payment
        const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance;

        // Calculate total payment and interest
        const totalPayment = totalMonthlyPayment * numberOfPayments;
        const totalInterest = (totalMonthlyPayment * numberOfPayments) - loanAmount;

        // Display results
        displayResults(totalMonthlyPayment, totalPayment, totalInterest);
        
        // Generate and display amortization schedule
        const amortizationData = generateAmortizationSchedule(loanAmount, monthlyRate, numberOfPayments, monthlyPayment);
        displayAmortizationSchedule(amortizationData);
        
        // Update chart
        updateAmortizationChart(amortizationData);

        // Show results section
        resultsSection.style.display = 'block';
    }

    function displayResults(monthlyPayment, totalPayment, totalInterest) {
        monthlyPaymentResult.textContent = formatCurrency(monthlyPayment);
        totalPaymentResult.textContent = formatCurrency(totalPayment);
        totalInterestResult.textContent = formatCurrency(totalInterest);
    }

    function generateAmortizationSchedule(loanAmount, monthlyRate, numberOfPayments, monthlyPayment) {
        let balance = loanAmount;
        const schedule = [];

        for (let payment = 1; payment <= numberOfPayments; payment++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;

            schedule.push({
                payment: payment,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                balance: Math.max(0, balance)
            });
        }

        return schedule;
    }

    function displayAmortizationSchedule(schedule) {
        const tbody = amortizationTable.querySelector('tbody');
        tbody.innerHTML = '';

        schedule.forEach((row, index) => {
            if (index < 12 || index === schedule.length - 1) { // Show first year and last payment
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.payment}</td>
                    <td>${formatCurrency(row.principalPayment)}</td>
                    <td>${formatCurrency(row.interestPayment)}</td>
                    <td>${formatCurrency(row.balance)}</td>
                `;
                tbody.appendChild(tr);
            }
        });
    }

    function updateAmortizationChart(schedule) {
        const ctx = document.getElementById('amortization-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (amortizationChart) {
            amortizationChart.destroy();
        }

        // Prepare data for chart
        const labels = schedule.map(row => row.payment);
        const principalData = schedule.map(row => row.principalPayment);
        const interestData = schedule.map(row => row.interestPayment);

        amortizationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Principal',
                    data: principalData,
                    borderColor: '#4CAF50',
                    fill: false
                }, {
                    label: 'Interest',
                    data: interestData,
                    borderColor: '#2196F3',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Initialize input validation
    setupInputValidation();
}); 