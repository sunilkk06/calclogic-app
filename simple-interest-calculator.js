document.addEventListener('DOMContentLoaded', function() {

    const principalInput = document.getElementById('si-principal');
    const rateInput = document.getElementById('si-rate');
    const timeInput = document.getElementById('si-time');
    const timeUnitSelect = document.getElementById('si-time-unit');
    const calculateBtn = document.getElementById('calculate-si-btn');
    const interestResultSpan = document.getElementById('si-interest');
    const totalAmountSpan = document.getElementById('si-total-amount');
    const resultsPanel = document.querySelector('.si-results-panel'); // To show/hide later if needed

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    function calculateSimpleInterest() {
        const principal = parseFloat(principalInput.value);
        const rate = parseFloat(rateInput.value);
        const time = parseFloat(timeInput.value);
        const timeUnit = timeUnitSelect.value;

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal < 0 || rate < 0 || time < 0) {
            interestResultSpan.textContent = '$---.--';
            totalAmountSpan.textContent = '$---.--';
            // Optionally show an error message
            return;
        }

        // Convert rate percentage to decimal
        const rateDecimal = rate / 100;

        // Convert time to years
        let timeInYears;
        switch (timeUnit) {
            case 'months':
                timeInYears = time / 12;
                break;
            case 'days':
                timeInYears = time / 365; // Using 365 for simplicity
                break;
            case 'years':
            default:
                timeInYears = time;
        }

        // Calculate Simple Interest: I = P * R * T
        const interest = principal * rateDecimal * timeInYears;
        const totalAmount = principal + interest;

        // Update DOM
        interestResultSpan.textContent = formatCurrency(interest);
        totalAmountSpan.textContent = formatCurrency(totalAmount);
    }

    function clearResults() {
         interestResultSpan.textContent = '$---.--';
         totalAmountSpan.textContent = '$---.--';
    }

    calculateBtn.addEventListener('click', calculateSimpleInterest);
    
    // Clear results on input change
    [principalInput, rateInput, timeInput, timeUnitSelect].forEach(input => {
        input.addEventListener('input', clearResults);
        if (input.tagName === 'SELECT') {
             input.addEventListener('change', clearResults);
        }
    });

}); 