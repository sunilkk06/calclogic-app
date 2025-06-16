document.addEventListener('DOMContentLoaded', function() {

    // --- Percentage Calculator Logic ---

    // Sub-calculator 1: Percentage of a Number (PON)
    const ponPercentInput = document.getElementById('pon-percent');
    const ponNumberInput = document.getElementById('pon-number');
    const calculatePonBtn = document.getElementById('calculate-pon-btn');
    const ponResultDiv = document.getElementById('pon-result');
    const ponResultValueSpan = document.getElementById('pon-result-value');

    function calculatePon() {
        const percent = parseFloat(ponPercentInput.value);
        const number = parseFloat(ponNumberInput.value);

        if (isNaN(percent) || isNaN(number)) {
            ponResultValueSpan.textContent = 'Invalid input';
        } else {
            const result = (percent / 100) * number;
            // Format result nicely (e.g., limit decimal places if necessary)
            ponResultValueSpan.textContent = result.toLocaleString(); 
        }
        ponResultDiv.style.display = 'block'; // Show the result div
    }

    function clearPonResult() {
        ponResultDiv.style.display = 'none';
        ponResultValueSpan.textContent = '';
    }

    calculatePonBtn.addEventListener('click', calculatePon);
    ponPercentInput.addEventListener('input', clearPonResult);
    ponNumberInput.addEventListener('input', clearPonResult);

    // Sub-calculator 2: Is What Percent (IWP)
    const iwpPartInput = document.getElementById('iwp-part');
    const iwpTotalInput = document.getElementById('iwp-total');
    const calculateIwpBtn = document.getElementById('calculate-iwp-btn');
    const iwpResultDiv = document.getElementById('iwp-result');
    const iwpResultValueSpan = document.getElementById('iwp-result-value');

    function calculateIwp() {
        const part = parseFloat(iwpPartInput.value);
        const total = parseFloat(iwpTotalInput.value);

        if (isNaN(part) || isNaN(total)) {
            iwpResultValueSpan.textContent = 'Invalid input';
        } else if (total === 0) {
            iwpResultValueSpan.textContent = 'Cannot divide by zero';
        } else {
            const result = (part / total) * 100;
            // Format result nicely (e.g., limit decimal places)
            iwpResultValueSpan.textContent = result.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        }
        iwpResultDiv.style.display = 'block'; // Show the result div
    }

    function clearIwpResult() {
        iwpResultDiv.style.display = 'none';
        iwpResultValueSpan.textContent = '';
    }

    calculateIwpBtn.addEventListener('click', calculateIwp);
    iwpPartInput.addEventListener('input', clearIwpResult);
    iwpTotalInput.addEventListener('input', clearIwpResult);

    // Sub-calculator 3: Percentage Change (PC)
    const pcValue1Input = document.getElementById('pc-value1');
    const pcValue2Input = document.getElementById('pc-value2');
    const calculatePcBtn = document.getElementById('calculate-pc-btn');
    const pcResultDiv = document.getElementById('pc-result');
    const pcResultValueSpan = document.getElementById('pc-result-value');
    const pcResultTypeSpan = document.getElementById('pc-result-type');

    function calculatePc() {
        const v1 = parseFloat(pcValue1Input.value);
        const v2 = parseFloat(pcValue2Input.value);

        if (isNaN(v1) || isNaN(v2)) {
            pcResultValueSpan.textContent = 'Invalid input';
            pcResultTypeSpan.textContent = '';
        } else if (v1 === 0) {
             if (v2 === 0) {
                pcResultValueSpan.textContent = '0'; // No change
            } else {
                 pcResultValueSpan.textContent = 'Undefined'; // Infinite change if v1 is 0 and v2 is not
            }
            pcResultTypeSpan.textContent = (v2 >= v1) ? 'Increase' : 'Decrease';
        } else {
            const change = ((v2 - v1) / v1) * 100;
            pcResultValueSpan.textContent = Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            pcResultTypeSpan.textContent = (change >= 0) ? 'Increase' : 'Decrease';
        }
        pcResultDiv.style.display = 'block'; // Show the result div
    }

    function clearPcResult() {
        pcResultDiv.style.display = 'none';
        pcResultValueSpan.textContent = '';
        pcResultTypeSpan.textContent = '';
    }

    calculatePcBtn.addEventListener('click', calculatePc);
    pcValue1Input.addEventListener('input', clearPcResult);
    pcValue2Input.addEventListener('input', clearPcResult);

    // --- End of Percentage Calculator Logic ---

}); 