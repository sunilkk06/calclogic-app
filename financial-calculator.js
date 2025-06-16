document.addEventListener('DOMContentLoaded', function() {
    // Get all input elements
    const loanAmountInput = document.getElementById('loanAmount');
    const loanAmountSlider = document.getElementById('loanAmountSlider');
    const interestRateInput = document.getElementById('interestRate');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const loanTermInput = document.getElementById('loanTerm');
    const loanTermSlider = document.getElementById('loanTermSlider');

    // Get result elements
    const monthlyPaymentElement = document.getElementById('monthlyPayment');
    const totalPrincipalElement = document.getElementById('totalPrincipal');
    const totalInterestElement = document.getElementById('totalInterest');
    const totalCostElement = document.getElementById('totalCost');
    const principalPortionElement = document.querySelector('.principal-portion');
    const interestPortionElement = document.querySelector('.interest-portion');

    // Sync sliders with number inputs
    function syncInputs(input, slider) {
        input.addEventListener('input', (e) => {
            slider.value = e.target.value;
            calculateLoan();
        });
        
        slider.addEventListener('input', (e) => {
            input.value = e.target.value;
            calculateLoan();
        });
    }

    syncInputs(loanAmountInput, loanAmountSlider);
    syncInputs(interestRateInput, interestRateSlider);
    syncInputs(loanTermInput, loanTermSlider);

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Calculate loan details
    function calculateLoan() {
        // Get values from inputs
        const principal = parseFloat(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value) / 100;
        const termInYears = parseFloat(loanTermInput.value);

        // Monthly calculations
        const monthlyRate = annualRate / 12;
        const numberOfPayments = termInYears * 12;

        // Calculate monthly payment using the loan payment formula
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        // Calculate totals
        const totalAmount = monthlyPayment * numberOfPayments;
        const totalInterest = totalAmount - principal;

        // Update the DOM with results
        monthlyPaymentElement.textContent = formatCurrency(monthlyPayment);
        totalPrincipalElement.textContent = formatCurrency(principal);
        totalInterestElement.textContent = formatCurrency(totalInterest);
        totalCostElement.textContent = formatCurrency(totalAmount);

        // Update the breakdown chart
        const principalPercentage = (principal / totalAmount) * 100;
        const interestPercentage = (totalInterest / totalAmount) * 100;
        
        principalPortionElement.style.width = principalPercentage + '%';
        interestPortionElement.style.width = interestPercentage + '%';
    }

    // Initial calculation
    calculateLoan();

    // --- Interest Calculator Logic ---
    const interestForm = document.getElementById('interest-calculator-form');
    const interestPrincipalInput = document.getElementById('principal');
    const interestRateField = document.getElementById('interest-rate');
    const interestTimeInput = document.getElementById('time-years');
    const interestCompoundFreqSelect = document.getElementById('compound-frequency');
    const interestContributionInput = document.getElementById('additional-contribution');
    const interestContribFreqSelect = document.getElementById('contribution-frequency');

    // Result elements
    const compoundFinalBalance = document.getElementById('compound-final-balance');
    const compoundInterestEarned = document.getElementById('compound-interest-earned');
    const totalContributions = document.getElementById('total-contributions');
    const simpleFinalBalance = document.getElementById('simple-final-balance');
    const simpleInterestEarned = document.getElementById('simple-interest-earned');

    // Tab elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Chart
    let interestChart = null;

    // Initialize Interest Calculator
    function initInterestCalculator() {
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                switchTab(tabId);
            });
        });

        // Form submission
        interestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateInterest();
        });

        // Input validation
        const numberInputs = [
            interestPrincipalInput, 
            interestRateField, 
            interestTimeInput, 
            interestContributionInput
        ];
        numberInputs.forEach(input => {
            input.addEventListener('input', validateNumberInput);
        });
    }

    // Validate number inputs
    function validateNumberInput(e) {
        const input = e.target;
        const value = parseFloat(input.value);
        
        if (value < parseFloat(input.min)) {
            input.value = input.min;
        } else if (input.max && value > parseFloat(input.max)) {
            input.value = input.max;
        }
    }

    // Switch between simple and compound interest tabs
    function switchTab(tabId) {
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        tabContents.forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tabId}-tab`);
        });
    }

    // Calculate compound interest with periodic contributions
    function calculateCompoundInterest(principal, rate, time, compoundFreq, contribution, contribFreq) {
        const r = rate / 100;
        const n = compoundFreq;
        const t = time;
        const PMT = contribution;
        const m = contribFreq;

        // Calculate compound interest without contributions
        let amount = principal * Math.pow(1 + r/n, n*t);

        // Add periodic contributions if any
        if (PMT > 0) {
            // Future value of periodic payments
            const contributionAmount = PMT * m * ((Math.pow(1 + r/n, n*t) - 1) / (Math.pow(1 + r/n, n/m) - 1));
            amount += contributionAmount;
        }

        const totalContributions = principal + (PMT * m * t);
        const interestEarned = amount - totalContributions;

        return {
            finalBalance: amount,
            interestEarned: interestEarned,
            totalContributions: totalContributions
        };
    }

    // Calculate simple interest
    function calculateSimpleInterest(principal, rate, time) {
        const r = rate / 100;
        const amount = principal * (1 + r * time);
        const interestEarned = amount - principal;

        return {
            finalBalance: amount,
            interestEarned: interestEarned
        };
    }

    // Generate data points for the chart
    function generateChartData(principal, rate, time, compoundFreq, contribution, contribFreq) {
        const points = Math.min(time * 12, 120); // Monthly points, max 120 points
        const timeStep = time / points;
        const compoundData = [];
        const simpleData = [];
        const contributionsData = [];

        let runningContributions = principal;

        for (let t = 0; t <= points; t++) {
            const currentTime = t * timeStep;
            
            // Calculate compound interest
            const compound = calculateCompoundInterest(
                principal, rate, currentTime, 
                compoundFreq, contribution, contribFreq
            );
            compoundData.push(compound.finalBalance);

            // Calculate simple interest
            const simple = calculateSimpleInterest(principal, rate, currentTime);
            simpleData.push(simple.finalBalance);

            // Track contributions
            if (t > 0) {
                runningContributions += contribution * contribFreq * timeStep;
            }
            contributionsData.push(runningContributions);
        }

        return {
            labels: Array.from({length: points + 1}, (_, i) => 
                (i * timeStep).toFixed(1) + (i * timeStep === 1 ? ' year' : ' years')
            ),
            compoundData,
            simpleData,
            contributionsData
        };
    }

    // Update the chart
    function updateChart(chartData) {
        if (interestChart) {
            interestChart.destroy();
        }

        const ctx = document.getElementById('interest-chart').getContext('2d');
        interestChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Compound Interest',
                        data: chartData.compoundData,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        fill: true
                    },
                    {
                        label: 'Simple Interest',
                        data: chartData.simpleData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: true
                    },
                    {
                        label: 'Total Contributions',
                        data: chartData.contributionsData,
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                    formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
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

    // Calculate and update results
    function calculateInterest() {
        const principal = parseFloat(interestPrincipalInput.value);
        const rate = parseFloat(interestRateField.value);
        const time = parseFloat(interestTimeInput.value);
        const compoundFreq = parseInt(interestCompoundFreqSelect.value);
        const contribution = parseFloat(interestContributionInput.value) || 0;
        const contribFreq = parseInt(interestContribFreqSelect.value);

        // Calculate compound interest
        const compound = calculateCompoundInterest(
            principal, rate, time, 
            compoundFreq, contribution, contribFreq
        );

        // Calculate simple interest
        const simple = calculateSimpleInterest(principal, rate, time);

        // Update results
        compoundFinalBalance.textContent = formatCurrency(compound.finalBalance);
        compoundInterestEarned.textContent = formatCurrency(compound.interestEarned);
        totalContributions.textContent = formatCurrency(compound.totalContributions);
        
        simpleFinalBalance.textContent = formatCurrency(simple.finalBalance);
        simpleInterestEarned.textContent = formatCurrency(simple.interestEarned);

        // Generate and update chart
        const chartData = generateChartData(
            principal, rate, time, 
            compoundFreq, contribution, contribFreq
        );
        updateChart(chartData);

        // Add animation class to results
        const resultElements = [
            compoundFinalBalance, 
            compoundInterestEarned, 
            totalContributions,
            simpleFinalBalance, 
            simpleInterestEarned
        ];
        resultElements.forEach(element => {
            element.classList.add('result-updated');
            setTimeout(() => element.classList.remove('result-updated'), 500);
        });
    }

    // Initialize calculator
    initInterestCalculator();

    // Investment Calculator Functions
    function initInvestmentCalculator() {
        const form = document.getElementById('investment-calculator-form');
        if (!form) return;

        const riskLevelSelect = document.getElementById('risk-level');
        const expectedReturnInput = document.getElementById('expected-return');

        // Update expected return based on risk level
        riskLevelSelect.addEventListener('change', (e) => {
            const riskLevel = e.target.value;
            switch(riskLevel) {
                case 'conservative':
                    expectedReturnInput.value = '4';
                    break;
                case 'moderate':
                    expectedReturnInput.value = '7';
                    break;
                case 'aggressive':
                    expectedReturnInput.value = '10';
                    break;
            }
            if (form.checkValidity()) {
                calculateInvestment();
            }
        });

        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateInvestment();
        });

        // Initialize chart
        let investmentChart = null;

        function calculateInvestment() {
            const initialInvestment = parseFloat(document.getElementById('initial-investment').value);
            const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
            const timeframe = parseInt(document.getElementById('investment-timeframe').value);
            const annualReturn = parseFloat(document.getElementById('expected-return').value) / 100;

            // Calculate investment growth
            const monthlyRate = annualReturn / 12;
            const totalMonths = timeframe * 12;
            let balance = initialInvestment;
            const dataPoints = [];
            let totalContributions = initialInvestment;

            dataPoints.push({
                month: 0,
                balance: balance,
                contributions: totalContributions
            });

            for (let month = 1; month <= totalMonths; month++) {
                balance = balance * (1 + monthlyRate) + monthlyContribution;
                totalContributions += monthlyContribution;

                if (month % 12 === 0) {
                    dataPoints.push({
                        month: month,
                        balance: balance,
                        contributions: totalContributions
                    });
                }
            }

            // Calculate returns
            const totalValue = balance;
            const totalReturn = totalValue - totalContributions;
            const roi = (totalReturn / totalContributions) * 100;

            // Update results
            updateResults(totalValue, totalContributions, totalReturn, roi);
            updateBreakdown(initialInvestment, totalContributions - initialInvestment, totalReturn);
            updateChart(dataPoints);
        }

        function updateResults(totalValue, totalContributions, totalReturn, roi) {
            document.getElementById('total-value').textContent = formatCurrency(totalValue);
            document.getElementById('total-contributed').textContent = formatCurrency(totalContributions);
            document.getElementById('total-return').textContent = formatCurrency(totalReturn);
            document.getElementById('roi-percentage').textContent = roi.toFixed(2) + '%';

            // Add animation class
            ['total-value', 'total-contributed', 'total-return', 'roi-percentage'].forEach(id => {
                const element = document.getElementById(id);
                element.classList.add('result-updated');
                setTimeout(() => element.classList.remove('result-updated'), 500);
            });
        }

        function updateBreakdown(initial, contributions, returns) {
            const total = initial + contributions + returns;
            
            // Calculate percentages
            const initialPercent = (initial / total) * 100;
            const contributionsPercent = (contributions / total) * 100;
            const returnsPercent = (returns / total) * 100;

            // Update bars
            document.getElementById('initial-portion').style.width = initialPercent + '%';
            document.getElementById('contributions-portion').style.width = contributionsPercent + '%';
            document.getElementById('returns-portion').style.width = returnsPercent + '%';

            // Update values
            document.getElementById('initial-portion-value').textContent = formatCurrency(initial);
            document.getElementById('contributions-portion-value').textContent = formatCurrency(contributions);
            document.getElementById('returns-portion-value').textContent = formatCurrency(returns);
        }

        function updateChart(dataPoints) {
            const ctx = document.getElementById('investment-chart').getContext('2d');
            
            if (investmentChart) {
                investmentChart.destroy();
            }

            const labels = dataPoints.map(point => `Year ${point.month / 12}`);
            const balanceData = dataPoints.map(point => point.balance);
            const contributionsData = dataPoints.map(point => point.contributions);

            investmentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total Balance',
                            data: balanceData,
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Total Contributions',
                            data: contributionsData,
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + 
                                        formatCurrency(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
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

        // Initial calculation
        calculateInvestment();
    }

    // Initialize calculators
    initInterestCalculator();
    initInvestmentCalculator();
}); 