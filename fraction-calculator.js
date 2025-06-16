document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fraction-form');
    const num1Input = document.getElementById('num1');
    const den1Input = document.getElementById('den1');
    const num2Input = document.getElementById('num2');
    const den2Input = document.getElementById('den2');
    const operatorSelect = document.getElementById('operator');
    const resultDisplay = document.getElementById('fraction-result-display');
    const stepsDisplay = document.getElementById('steps-content');

    // --- Helper Functions ---

    // Greatest Common Divisor (GCD)
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        if (b === 0) return a;
        return gcd(b, a % b);
    }

    // Least Common Multiple (LCM)
    function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    // Simplify Fraction
    function simplifyFraction(numerator, denominator) {
        if (denominator === 0) {
            return { numerator: NaN, denominator: NaN }; // Indicate error
        }
        if (numerator === 0) {
            return { numerator: 0, denominator: 1 };
        }
        const commonDivisor = gcd(numerator, denominator);
        let simplifiedNum = numerator / commonDivisor;
        let simplifiedDen = denominator / commonDivisor;

        // Ensure denominator is positive
        if (simplifiedDen < 0) {
            simplifiedNum = -simplifiedNum;
            simplifiedDen = -simplifiedDen;
        }
        return { numerator: simplifiedNum, denominator: simplifiedDen };
    }

    // --- Calculation Functions ---

    function calculate(n1, d1, n2, d2, operator) {
        let resultNum, resultDen;
        let steps = [];

        const opSymbol = operatorSelect.options[operatorSelect.selectedIndex].text;
        const initialFraction1Str = `${n1}/${d1}`;
        const initialFraction2Str = `${n2}/${d2}`;
        steps.push(`Operation: ${initialFraction1Str} ${opSymbol} ${initialFraction2Str}`);

        switch (operator) {
            case 'add':
                // Find LCM
                resultDen = lcm(d1, d2);
                steps.push(`Find the least common multiple (LCM) of ${d1} and ${d2}: ${resultDen}`);
                // Convert fractions
                const convertedN1 = n1 * (resultDen / d1);
                const convertedN2 = n2 * (resultDen / d2);
                steps.push(`Convert fractions: ${convertedN1}/${resultDen} ${opSymbol} ${convertedN2}/${resultDen}`);
                // Add numerators
                resultNum = convertedN1 + convertedN2;
                steps.push(`Add numerators: ${convertedN1} + ${convertedN2} = ${resultNum}`);
                steps.push(`Result before simplification: ${resultNum}/${resultDen}`);
                break;
            case 'subtract':
                // Find LCM
                resultDen = lcm(d1, d2);
                 steps.push(`Find the least common multiple (LCM) of ${d1} and ${d2}: ${resultDen}`);
                // Convert fractions
                const subConvertedN1 = n1 * (resultDen / d1);
                const subConvertedN2 = n2 * (resultDen / d2);
                steps.push(`Convert fractions: ${subConvertedN1}/${resultDen} ${opSymbol} ${subConvertedN2}/${resultDen}`);
                // Subtract numerators
                resultNum = subConvertedN1 - subConvertedN2;
                steps.push(`Subtract numerators: ${subConvertedN1} - ${subConvertedN2} = ${resultNum}`);
                steps.push(`Result before simplification: ${resultNum}/${resultDen}`);
                break;
            case 'multiply':
                resultNum = n1 * n2;
                resultDen = d1 * d2;
                steps.push(`Multiply numerators: ${n1} × ${n2} = ${resultNum}`);
                steps.push(`Multiply denominators: ${d1} × ${d2} = ${resultDen}`);
                steps.push(`Result before simplification: ${resultNum}/${resultDen}`);
                break;
            case 'divide':
                // Multiply by reciprocal
                resultNum = n1 * d2;
                resultDen = d1 * n2;
                steps.push(`Multiply by the reciprocal: ${initialFraction1Str} × ${d2}/${n2}`);
                steps.push(`Multiply numerators: ${n1} × ${d2} = ${resultNum}`);
                steps.push(`Multiply denominators: ${d1} × ${n2} = ${resultDen}`);
                if (resultDen === 0) {
                     steps.push('Error: Division by zero in calculation.');
                     return { numerator: NaN, denominator: NaN, steps };
                }
                steps.push(`Result before simplification: ${resultNum}/${resultDen}`);
                break;
            default:
                return { numerator: NaN, denominator: NaN, steps: ['Invalid operator'] };
        }

        // Simplify the result
        const simplified = simplifyFraction(resultNum, resultDen);
        steps.push(`Simplify the fraction: ${resultNum}/${resultDen} = ${simplified.numerator}/${simplified.denominator}`);

        return { numerator: simplified.numerator, denominator: simplified.denominator, steps };
    }

    // --- Display Functions ---

    function displayResult(num, den, steps) {
        resultDisplay.innerHTML = ''; // Clear previous result/placeholder
        stepsDisplay.innerHTML = ''; // Clear previous steps

        if (isNaN(num) || isNaN(den)) {
            resultDisplay.innerHTML = `<div class="error-message">Error in calculation. Please check inputs.</div>`;
            steps.push('Calculation resulted in an error (NaN).');
        } else if (den === 0) {
             resultDisplay.innerHTML = `<div class="error-message">Error: Result denominator is zero.</div>`;
             steps.push('Error: Resulting denominator is zero.');
        } else {
            // Display Fraction
            const fractionDiv = document.createElement('div');
            fractionDiv.classList.add('result-fraction');
            fractionDiv.innerHTML = `
                <span class="result-num">${num}</span>
                <span class="fraction-line result-line"></span>
                <span class="result-den">${den}</span>
            `;
            resultDisplay.appendChild(fractionDiv);

            // Display Decimal
            const decimalDiv = document.createElement('div');
            decimalDiv.classList.add('result-decimal');
            const decimalValue = (num / den).toFixed(6); // Show up to 6 decimal places
            decimalDiv.innerHTML = `Decimal: <span>${parseFloat(decimalValue)}</span>`; // parseFloat removes trailing zeros
            resultDisplay.appendChild(decimalDiv);
        }

        // Display Steps
        steps.forEach(step => {
            const stepP = document.createElement('p');
            stepP.textContent = step;
            stepsDisplay.appendChild(stepP);
        });
        document.getElementById('fraction-steps').style.display = 'block'; // Show steps section
    }

    function displayError(message) {
        resultDisplay.innerHTML = `<div class="error-message">${message}</div>`;
        stepsDisplay.innerHTML = '';
        document.getElementById('fraction-steps').style.display = 'none'; // Hide steps section on error
    }

    // --- Event Listener ---

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get and parse inputs
        const n1 = parseInt(num1Input.value);
        const d1 = parseInt(den1Input.value);
        const n2 = parseInt(num2Input.value);
        const d2 = parseInt(den2Input.value);
        const operator = operatorSelect.value;

        // Validation
        if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
            displayError('Please enter valid numbers for all fraction parts.');
            return;
        }
        if (d1 === 0 || d2 === 0) {
            displayError('Denominators cannot be zero.');
            return;
        }

        // Calculate
        const result = calculate(n1, d1, n2, d2, operator);

        // Display
        displayResult(result.numerator, result.denominator, result.steps);
    });

    // Initial state
    document.getElementById('fraction-steps').style.display = 'none'; // Hide steps initially
}); 