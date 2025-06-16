document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ratio-form');
    const ratioAInput = document.getElementById('ratioA');
    const ratioBInput = document.getElementById('ratioB');
    const ratioCInput = document.getElementById('ratioC');
    const ratioDInput = document.getElementById('ratioD');
    const resultDisplay = document.getElementById('ratio-result-display');
    const explanationDisplay = document.getElementById('explanation-content');
    const explanationSection = document.getElementById('ratio-explanation');

    // --- Helper Function: Greatest Common Divisor (GCD) ---
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        if (b === 0) return a;
        return gcd(b, a % b);
    }

    // --- Display Functions ---
    function displayResult(resultHtml, explanationHtml) {
        resultDisplay.innerHTML = resultHtml;
        if (explanationHtml) {
            explanationDisplay.innerHTML = explanationHtml;
            explanationSection.style.display = 'block';
        } else {
            explanationDisplay.innerHTML = '';
            explanationSection.style.display = 'none';
        }
    }

    function displayError(message) {
        resultDisplay.innerHTML = `<div class="error-message">${message}</div>`;
        explanationDisplay.innerHTML = '';
        explanationSection.style.display = 'none';
    }

    // --- Event Listener ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get values, treat empty or 'x' as null for solving
        const values = [ratioAInput, ratioBInput, ratioCInput, ratioDInput].map(input => {
            const val = input.value.trim().toLowerCase();
            if (val === '' || val === 'x') {
                return null;
            }
            const num = parseFloat(val);
            return isNaN(num) ? NaN : num; // Keep NaN for invalid number check
        });

        let [a, b, c, d] = values;
        const validNumbers = values.filter(v => typeof v === 'number' && !isNaN(v));
        const nullCount = values.filter(v => v === null).length;
        const nanCount = values.filter(v => isNaN(v)).length;

        // --- Input Validation ---
        if (nanCount > 0) {
            displayError('Invalid input. Please enter numbers or leave one field blank/enter \'x\' to solve.');
            return;
        }

        // --- Calculation Logic ---

        // Case 1: Simplify Ratio (A:B)
        if (validNumbers.length === 2 && a !== null && b !== null && c === null && d === null) {
             if (a === 0 && b === 0) {
                 displayError('Cannot simplify ratio 0 : 0.');
                 return;
             }
            const commonDivisor = gcd(a, b);
            const simplifiedA = a / commonDivisor;
            const simplifiedB = b / commonDivisor;
            let explanation = `<p>Original Ratio: ${a} : ${b}</p>`;
            explanation += `<p>Find the Greatest Common Divisor (GCD) of ${a} and ${b}: ${commonDivisor}</p>`;
            explanation += `<p>Divide both parts by the GCD:</p>`;
            explanation += `<p>${a} ÷ ${commonDivisor} = ${simplifiedA}</p>`;
            explanation += `<p>${b} ÷ ${commonDivisor} = ${simplifiedB}</p>`;
            displayResult(`Simplified Ratio: <span class="result-value">${simplifiedA} : ${simplifiedB}</span>`, explanation);

        // Case 2: Solve Proportion (A:B = C:D)
        } else if (validNumbers.length === 3 && nullCount === 1) {
            let solvedValue;
            let explanation = `Solving the proportion: ${a ?? 'A'} : ${b ?? 'B'} = ${c ?? 'C'} : ${d ?? 'D'}<br>`;
            explanation += `Using the cross-multiplication rule: A × D = B × C<br><br>`;

            try {
                if (a === null) { // Solve for A
                    if (d === 0) throw new Error('Cannot solve for A when D is zero (division by zero).');
                    solvedValue = (b * c) / d;
                    explanation += `A = (B × C) / D<br>A = (${b} × ${c}) / ${d}<br>A = ${b * c} / ${d}`;
                    a = solvedValue;
                } else if (b === null) { // Solve for B
                    if (c === 0) throw new Error('Cannot solve for B when C is zero (division by zero).');
                    solvedValue = (a * d) / c;
                    explanation += `B = (A × D) / C<br>B = (${a} × ${d}) / ${c}<br>B = ${a * d} / ${c}`;
                    b = solvedValue;
                } else if (c === null) { // Solve for C
                    if (b === 0) throw new Error('Cannot solve for C when B is zero (division by zero).');
                    solvedValue = (a * d) / b;
                    explanation += `C = (A × D) / B<br>C = (${a} × ${d}) / ${b}<br>C = ${a * d} / ${b}`;
                    c = solvedValue;
                } else { // Solve for D (d === null)
                    if (a === 0) throw new Error('Cannot solve for D when A is zero (division by zero).');
                    solvedValue = (b * c) / a;
                    explanation += `D = (B × C) / A<br>D = (${b} × ${c}) / ${a}<br>D = ${b * c} / ${a}`;
                    d = solvedValue;
                }
                 explanation += `<br><br>Solved Value = ${solvedValue.toFixed(4)}`; // Limit decimal places
                 displayResult(`Solved Value: <span class="result-value">${parseFloat(solvedValue.toFixed(4))}</span>`, explanation);

            } catch (error) {
                displayError(`Calculation Error: ${error.message}`);
            }

        // Case 3: Invalid scenario
        } else {
            displayError('Invalid input combination. Enter A and B to simplify, or exactly three values (A, B, C, D) to solve for the missing one.');
        }
    });

    // Initial state
    explanationSection.style.display = 'none';
}); 