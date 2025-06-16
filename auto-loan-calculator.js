document.addEventListener('DOMContentLoaded', function() {

    const vehiclePriceInput = document.getElementById('al-vehicle-price');
    const downPaymentInput = document.getElementById('al-down-payment');
    const tradeInInput = document.getElementById('al-trade-in');
    const salesTaxRateInput = document.getElementById('al-sales-tax');
    const interestRateInput = document.getElementById('al-rate');
    const loanTermInput = document.getElementById('al-term');
    const calculateBtn = document.getElementById('calculate-al-btn');

    const monthlyPaymentSpan = document.getElementById('al-monthly-payment');
    const totalLoanSpan = document.getElementById('al-total-loan');
    const totalInterestSpan = document.getElementById('al-total-interest');
    const totalCostSpan = document.getElementById('al-total-cost');

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function calculateAutoLoan() {
        const vehiclePrice = parseFloat(vehiclePriceInput.value) || 0;
        const downPayment = parseFloat(downPaymentInput.value) || 0;
        const tradeIn = parseFloat(tradeInInput.value) || 0;
        const salesTaxRate = parseFloat(salesTaxRateInput.value) || 0;
        const annualRate = parseFloat(interestRateInput.value);
        const termInMonths = parseInt(loanTermInput.value);

        if (isNaN(annualRate) || isNaN(termInMonths) || termInMonths <= 0 || vehiclePrice <= 0) {
            clearResults();
            // alert("Please enter valid Vehicle Price, Interest Rate, and Loan Term.");
            return;
        }

        // Calculate taxable amount
        const taxableAmount = vehiclePrice - tradeIn;
        // Calculate sales tax amount
        const salesTaxAmount = taxableAmount * (salesTaxRate / 100);

        // Calculate total amount to be financed
        const amountAfterTax = vehiclePrice + salesTaxAmount;
        const principal = amountAfterTax - downPayment - tradeIn; // Amount to borrow

        if (principal <= 0) { // If down payment + trade-in covers the cost
            monthlyPaymentSpan.textContent = formatCurrency(0);
            totalLoanSpan.textContent = formatCurrency(0);
            totalInterestSpan.textContent = formatCurrency(0);
            totalCostSpan.textContent = formatCurrency(downPayment + tradeIn); // Total cost is just what they paid upfront
            return;
        }

        // Calculate monthly payment
        const monthlyRate = (annualRate / 100) / 12;
        let monthlyPayment;

        if (monthlyRate === 0) { // Handle 0% interest rate
            monthlyPayment = principal / termInMonths;
        } else {
             monthlyPayment = principal * 
                (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / 
                (Math.pow(1 + monthlyRate, termInMonths) - 1);
        }
        
        // Calculate totals
        const totalPayment = monthlyPayment * termInMonths;
        const totalInterest = totalPayment - principal;
        const totalCost = principal + totalInterest + downPayment + tradeIn; // Principal financed + interest + downpayment + tradein value

        // Update DOM
        monthlyPaymentSpan.textContent = formatCurrency(monthlyPayment);
        totalLoanSpan.textContent = formatCurrency(principal);
        totalInterestSpan.textContent = formatCurrency(totalInterest);
        totalCostSpan.textContent = formatCurrency(totalCost);
    }

    function clearResults() {
         monthlyPaymentSpan.textContent = '$---.--';
         totalLoanSpan.textContent = '$---.--';
         totalInterestSpan.textContent = '$---.--';
         totalCostSpan.textContent = '$---.--';
    }

    calculateBtn.addEventListener('click', calculateAutoLoan);

     // Clear results on input change
    [vehiclePriceInput, downPaymentInput, tradeInInput, salesTaxRateInput, interestRateInput, loanTermInput].forEach(input => {
        input.addEventListener('input', clearResults);
    });

}); 