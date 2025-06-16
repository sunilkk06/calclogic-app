document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const form = document.getElementById('payment-calculator-form');
    const paymentTypeSelect = document.getElementById('payment-type');
    const amountInput = document.getElementById('payment-amount');
    const rateInput = document.getElementById('payment-rate');
    const termInput = document.getElementById('payment-term');
    const startDateInput = document.getElementById('payment-start');
    const calculateBtn = document.getElementById('calculate-payment-btn');

    // Set default start date to today
    const today = new Date();
    startDateInput.value = today.toISOString().split('T')[0];

    // Add event listeners
    calculateBtn.addEventListener('click', calculatePayment);
    paymentTypeSelect.addEventListener('change', calculatePayment);

    // Main calculation function
    function calculatePayment() {
        // Get input values
        const amount = parseFloat(amountInput.value);
        const annualRate = parseFloat(rateInput.value) / 100;
        const years = parseFloat(termInput.value);
        const startDate = new Date(startDateInput.value);
        const paymentType = paymentTypeSelect.value;

        // Validate inputs
        if (!validateInputs(amount, annualRate, years, startDate)) {
            return;
        }

        // Calculate payments based on payment type
        const { 
            regularPayment, 
            totalInterest,
            schedule 
        } = calculatePaymentDetails(amount, annualRate, years, startDate, paymentType);

        // Update results
        updateResults(regularPayment, amount, totalInterest);
        updatePaymentSchedule(schedule);
    }

    function validateInputs(amount, rate, years, startDate) {
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount greater than 0');
            return false;
        }
        if (isNaN(rate) || rate < 0) {
            alert('Please enter a valid interest rate (0 or greater)');
            return false;
        }
        if (isNaN(years) || years <= 0) {
            alert('Please enter a valid term greater than 0');
            return false;
        }
        if (!(startDate instanceof Date) || isNaN(startDate)) {
            alert('Please enter a valid start date');
            return false;
        }
        return true;
    }

    function calculatePaymentDetails(principal, annualRate, years, startDate, paymentType) {
        let periodsPerYear;
        switch(paymentType) {
            case 'weekly':
                periodsPerYear = 52;
                break;
            case 'biweekly':
                periodsPerYear = 26;
                break;
            default: // monthly
                periodsPerYear = 12;
                break;
        }

        const totalPeriods = Math.floor(years * periodsPerYear);
        const periodicRate = annualRate / periodsPerYear;

        // Calculate regular payment using the loan payment formula
        const regularPayment = principal * 
            (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / 
            (Math.pow(1 + periodicRate, totalPeriods) - 1);

        // Generate amortization schedule
        let remainingBalance = principal;
        let totalInterest = 0;
        const schedule = [];
        let currentDate = new Date(startDate);

        for (let period = 1; period <= totalPeriods; period++) {
            const interestPayment = remainingBalance * periodicRate;
            const principalPayment = regularPayment - interestPayment;
            totalInterest += interestPayment;
            remainingBalance -= principalPayment;

            schedule.push({
                period: period,
                date: new Date(currentDate),
                payment: regularPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, remainingBalance)
            });

            // Increment date based on payment type
            switch(paymentType) {
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'biweekly':
                    currentDate.setDate(currentDate.getDate() + 14);
                    break;
                default: // monthly
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
            }
        }

        return {
            regularPayment,
            totalInterest,
            schedule
        };
    }

    function updateResults(regularPayment, principal, totalInterest) {
        document.getElementById('regular-payment').textContent = formatCurrency(regularPayment);
        document.getElementById('total-principal').textContent = formatCurrency(principal);
        document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
        document.getElementById('total-amount').textContent = formatCurrency(principal + totalInterest);
    }

    function updatePaymentSchedule(schedule) {
        const tbody = document.getElementById('schedule-body');
        tbody.innerHTML = '';

        schedule.forEach(payment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.period}</td>
                <td>${formatDate(payment.date)}</td>
                <td>${formatCurrency(payment.payment)}</td>
                <td>${formatCurrency(payment.principal)}</td>
                <td>${formatCurrency(payment.interest)}</td>
                <td>${formatCurrency(payment.balance)}</td>
            `;
            tbody.appendChild(row);
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

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
}); 