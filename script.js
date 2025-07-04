// CalcLogic JavaScript

document.addEventListener('DOMContentLoaded', () => {

    console.log("CalcLogic script loaded.");

    // --- Smooth Scrolling --- (Already present)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Check if it's just '#' or a valid ID
            if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (targetId === '#') {
                // Scroll to top if href is just '#'
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // Let default behavior handle full page links like 'financial-calculator.html'
        });
    });

    // --- Home Page Calculator (Hero Section) ---
    const heroDisplay = document.getElementById('hero-calc-display');
    const heroButtons = document.querySelector('.simple-calc-buttons');
    const heroModeBtns = document.querySelectorAll('.calc-modes .mode-btn');
    let heroCurrentInput = '';
    let heroShouldResetDisplay = false;
    let heroMemory = 0;
    let heroMode = 'deg'; // 'deg' or 'rad'

    if (heroModeBtns.length) {
        heroModeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                heroModeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                heroMode = btn.dataset.mode;
            });
        });
    }

    function heroToRadians(val) {
        return heroMode === 'deg' ? val * Math.PI / 180 : val;
    }
    function heroToDegrees(val) {
        return heroMode === 'rad' ? val * 180 / Math.PI : val;
    }

    function heroUpdateDisplay(val) {
        heroDisplay.textContent = val;
    }

    function heroSafeEval(expr) {
        // Replace symbols with JS functions/constants
        expr = expr.replace(/π/g, 'Math.PI')
                   .replace(/e(?![a-zA-Z])/g, 'Math.E')
                   .replace(/÷/g, '/')
                   .replace(/×/g, '*');
        // Exponents
        expr = expr.replace(/(\d+(?:\.\d+)?)\s*x²/g, 'Math.pow($1,2)')
                   .replace(/(\d+(?:\.\d+)?)\s*x³/g, 'Math.pow($1,3)')
                   .replace(/(\d+(?:\.\d+)?)\s*xʸ\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)')
                   .replace(/(\d+(?:\.\d+)?)\s*eˣ/g, 'Math.exp($1)')
                   .replace(/(\d+(?:\.\d+)?)\s*10ˣ/g, 'Math.pow(10,$1)');
        // Inverse trig
        expr = expr.replace(/sin⁻¹\(([^)]+)\)/g, (m, p1) => `heroToDegrees(Math.asin(${p1}))`)
                   .replace(/cos⁻¹\(([^)]+)\)/g, (m, p1) => `heroToDegrees(Math.acos(${p1}))`)
                   .replace(/tan⁻¹\(([^)]+)\)/g, (m, p1) => `heroToDegrees(Math.atan(${p1}))`);
        // Trig
        expr = expr.replace(/sin\(([^)]+)\)/g, (m, p1) => `Math.sin(heroToRadians(${p1}))`)
                   .replace(/cos\(([^)]+)\)/g, (m, p1) => `Math.cos(heroToRadians(${p1}))`)
                   .replace(/tan\(([^)]+)\)/g, (m, p1) => `Math.tan(heroToRadians(${p1}))`);
        // Power
        expr = expr.replace(/([\d.]+)\s*\^\s*([\d.]+)/g, 'Math.pow($1,$2)');
        // Remove unsupported characters
        if (/[^0-9+\-*/(). MathPIEexpowsincoatanMR]+/.test(expr)) return 'Error';
        try {
            // eslint-disable-next-line no-eval
            let result = eval(expr);
            if (!isFinite(result)) return 'Error';
            return parseFloat(result.toFixed(10));
        } catch {
            return 'Error';
        }
    }

    if (heroButtons && heroDisplay) {
        heroButtons.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const btnText = e.target.textContent;
                if (/^[0-9.]$/.test(btnText)) {
                    if (heroDisplay.textContent === '0' || heroShouldResetDisplay) {
                        heroUpdateDisplay(btnText);
                        heroShouldResetDisplay = false;
                    } else {
                        heroUpdateDisplay(heroDisplay.textContent + btnText);
                    }
                } else if (btnText === 'C') {
                    heroUpdateDisplay('0');
                    heroCurrentInput = '';
                } else if (btnText === '=') {
                    let expr = heroDisplay.textContent;
                    // Replace xʸ with ^ for easier parsing
                    expr = expr.replace(/([\d.]+)\s*xʸ\s*([\d.]+)/g, '$1^$2');
                    // Replace x², x³, eˣ, 10ˣ
                    expr = expr.replace(/([\d.]+)x²/g, 'Math.pow($1,2)')
                               .replace(/([\d.]+)x³/g, 'Math.pow($1,3)')
                               .replace(/([\d.]+)eˣ/g, 'Math.exp($1)')
                               .replace(/([\d.]+)10ˣ/g, 'Math.pow(10,$1)');
                    // Replace π, e
                    expr = expr.replace(/π/g, 'Math.PI').replace(/e/g, 'Math.E');
                    // Replace operators
                    expr = expr.replace(/÷/g, '/').replace(/×/g, '*');
                    // Trig and inverse trig
                    expr = expr.replace(/sin⁻¹\(([^)]+)\)/g, (m, p1) => heroToDegrees(Math.asin(Number(p1))))
                               .replace(/cos⁻¹\(([^)]+)\)/g, (m, p1) => heroToDegrees(Math.acos(Number(p1))))
                               .replace(/tan⁻¹\(([^)]+)\)/g, (m, p1) => heroToDegrees(Math.atan(Number(p1))));
                    expr = expr.replace(/sin\(([^)]+)\)/g, (m, p1) => Math.sin(heroToRadians(Number(p1))))
                               .replace(/cos\(([^)]+)\)/g, (m, p1) => Math.cos(heroToRadians(Number(p1))))
                               .replace(/tan\(([^)]+)\)/g, (m, p1) => Math.tan(heroToRadians(Number(p1))));
                    // Power
                    expr = expr.replace(/([\d.]+)\s*\^\s*([\d.]+)/g, (m, b, e) => Math.pow(Number(b), Number(e)));
                    // Evaluate
                    let result;
                    try {
                        // eslint-disable-next-line no-eval
                        result = eval(expr);
                        if (!isFinite(result)) result = 'Error';
                    } catch {
                        result = 'Error';
                    }
                    heroUpdateDisplay(result);
                    heroShouldResetDisplay = true;
                } else if (btnText === '+') {
                    heroUpdateDisplay(heroDisplay.textContent + '+');
                } else if (btnText === '-') {
                    heroUpdateDisplay(heroDisplay.textContent + '-');
                } else if (btnText === '×') {
                    heroUpdateDisplay(heroDisplay.textContent + '×');
                } else if (btnText === '÷') {
                    heroUpdateDisplay(heroDisplay.textContent + '÷');
                } else if (btnText === 'π') {
                    heroUpdateDisplay(heroDisplay.textContent + 'π');
                } else if (btnText === 'e') {
                    heroUpdateDisplay(heroDisplay.textContent + 'e');
                } else if (btnText === 'x²') {
                    heroUpdateDisplay(heroDisplay.textContent + 'x²');
                } else if (btnText === 'x³') {
                    heroUpdateDisplay(heroDisplay.textContent + 'x³');
                } else if (btnText === 'xʸ') {
                    heroUpdateDisplay(heroDisplay.textContent + 'xʸ');
                } else if (btnText === 'eˣ') {
                    heroUpdateDisplay(heroDisplay.textContent + 'eˣ');
                } else if (btnText === '10ˣ') {
                    heroUpdateDisplay(heroDisplay.textContent + '10ˣ');
                } else if (btnText === 'sin⁻¹') {
                    heroUpdateDisplay(heroDisplay.textContent + 'sin⁻¹(');
                } else if (btnText === 'cos⁻¹') {
                    heroUpdateDisplay(heroDisplay.textContent + 'cos⁻¹(');
                } else if (btnText === 'tan⁻¹') {
                    heroUpdateDisplay(heroDisplay.textContent + 'tan⁻¹(');
                } else if (btnText === 'MR') {
                    heroUpdateDisplay(heroMemory.toString());
                    heroShouldResetDisplay = true;
                } else if (btnText === 'M+') {
                    heroMemory += Number(heroDisplay.textContent) || 0;
                } else if (btnText === 'M-') {
                    heroMemory -= Number(heroDisplay.textContent) || 0;
                }
            }
        });
    }

    // --- Basic/Scientific Calculator (Hero Section) ---
    const display = document.getElementById('calculator-display');
    const buttons = document.querySelector('.calculator-buttons');
    const calculatorWidget = document.querySelector('.calculator-widget'); // Get the widget element
    let currentInput = '';
    let shouldResetDisplay = false;

    // Add click listener for animation
    if (calculatorWidget) {
        calculatorWidget.addEventListener('click', (e) => {
            // Only trigger animation if clicking the widget itself, not the buttons inside
            if (e.target === calculatorWidget || e.target === display) {
                 calculatorWidget.classList.add('active');
                 // Remove the active class after a short delay
                 setTimeout(() => {
                     calculatorWidget.classList.remove('active');
                 }, 300); // Match the CSS transition duration
            }
        });
    }

    if (buttons && display) {
        buttons.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const value = e.target.dataset.value;
                const action = e.target.dataset.action;

                if (value) {
                    if (display.textContent === '0' || shouldResetDisplay) {
                        display.textContent = value;
                        shouldResetDisplay = false;
                    } else {
                        display.textContent += value;
                    }
                    currentInput = display.textContent; // Keep track internally
                } else if (action) {
                    handleAction(action);
                }
            }
        });
    }

    function handleAction(action) {
        switch (action) {
            case 'clear':
                display.textContent = '0';
                currentInput = '';
                break;
            case 'calculate':
                try {
                    // Basic eval - BE CAREFUL with eval in real apps
                    // For more complex math, use a library like math.js
                    // Sanitize input to prevent issues
                    let expression = currentInput
                                       .replace(/sin\(/g, 'Math.sin(')
                                       .replace(/cos\(/g, 'Math.cos(')
                                       .replace(/tan\(/g, 'Math.tan(')
                                       // Ensure radians if needed, or convert degrees
                                       // Example: Math.sin(degrees * Math.PI / 180)

                    // Basic validation for safety
                    if (/^[0-9+\-*/(). Mathsqrtcino]*$/.test(expression)) {
                        let result = eval(expression);
                        // Check for NaN or Infinity
                        if (!isFinite(result)) {
                             display.textContent = 'Error';
                        } else {
                            // Round to avoid floating point issues
                            result = parseFloat(result.toFixed(10));
                            display.textContent = result;
                        }
                    } else {
                        display.textContent = 'Error';
                    }
                } catch (error) {
                    console.error("Calculation Error:", error);
                    display.textContent = 'Error';
                }
                shouldResetDisplay = true; // Reset on next number input
                currentInput = display.textContent; // Update internal state
                break;
             case 'backspace':
                if (display.textContent.length > 1) {
                    display.textContent = display.textContent.slice(0, -1);
                } else {
                    display.textContent = '0';
                }
                 currentInput = display.textContent;
                break;
        }
    }

    // --- Loan Payment Calculator --- (financial-calculator.html)
    const loanForm = document.getElementById('loan-payment-form');
    if (loanForm) {
        loanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('loan-amount').value);
            const annualRate = parseFloat(document.getElementById('loan-rate').value);
            const termYears = parseFloat(document.getElementById('loan-term').value);
            const resultDiv = document.getElementById('loan-result');

            if (isNaN(amount) || isNaN(annualRate) || isNaN(termYears) || amount <= 0 || annualRate < 0 || termYears <= 0) {
                alert('Please enter valid positive numbers for amount, rate (can be 0), and term.');
                resultDiv.style.display = 'none';
                return;
            }

            const monthlyRate = annualRate / 100 / 12;
            const termMonths = termYears * 12;
            let monthlyPayment;

            if (monthlyRate === 0) { // Handle 0% interest rate
                monthlyPayment = amount / termMonths;
            } else {
                 monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
            }

            const totalCost = monthlyPayment * termMonths;
            const totalInterest = totalCost - amount;

            document.getElementById('monthly-payment').textContent = monthlyPayment.toFixed(2);
            document.getElementById('total-principal').textContent = amount.toFixed(2);
            document.getElementById('total-interest').textContent = totalInterest.toFixed(2);
            document.getElementById('total-cost').textContent = totalCost.toFixed(2);
            resultDiv.style.display = 'block';
        });
    }

    // --- BMI Calculator --- (health-calculator.html)
    const bmiForm = document.getElementById('bmi-form');
    const bmiUnitsSelect = document.getElementById('bmi-units');
    const metricInputs = document.getElementById('metric-inputs');
    const imperialInputs = document.getElementById('imperial-inputs');
    const resultDivBmi = document.querySelector('.bmi-results-panel'); // Target the results panel
    const bmiValueEl = document.getElementById('bmi-value');
    const bmiCategoryEl = document.getElementById('bmi-category');
    const idealWeightEl = document.getElementById('ideal-weight');
    const bmiIndicator = document.getElementById('bmi-scale-indicator');

    // Sliders and Number Inputs Synchronization
    const sliders = [
        { slider: 'weight-kg-slider', number: 'weight-kg' },
        { slider: 'height-cm-slider', number: 'height-cm' },
        { slider: 'weight-lbs-slider', number: 'weight-lbs' },
        { slider: 'height-ft-slider', number: 'height-ft' },
        { slider: 'height-in-slider', number: 'height-in' },
    ];

    sliders.forEach(({ slider, number }) => {
        const sliderEl = document.getElementById(slider);
        const numberEl = document.getElementById(number);
        if (sliderEl && numberEl) {
            // Update number input when slider changes
            sliderEl.addEventListener('input', () => {
                numberEl.value = sliderEl.value;
                 // Optionally trigger calculation automatically on slider change
                 // calculateAndDisplayBMI();
            });
            // Update slider when number input changes
            numberEl.addEventListener('input', () => {
                // Basic validation to prevent slider breaking
                const min = parseFloat(sliderEl.min);
                const max = parseFloat(sliderEl.max);
                let value = parseFloat(numberEl.value);
                if (isNaN(value)) value = parseFloat(sliderEl.value); // Revert if invalid
                if (value < min) value = min;
                if (value > max) value = max;
                sliderEl.value = value;
                numberEl.value = value; // Update input field in case it was adjusted
                 // Optionally trigger calculation automatically on input change
                 // calculateAndDisplayBMI();
            });
        }
    });

    // Handle Unit Change
    if (bmiUnitsSelect) {
        bmiUnitsSelect.addEventListener('change', function() {
            const isMetric = this.value === 'metric';
            metricInputs.style.display = isMetric ? 'block' : 'none';
            imperialInputs.style.display = isMetric ? 'none' : 'block';
            // Reset form and results on unit change
            if (bmiForm) bmiForm.reset();
            syncSlidersOnReset(); // Reset sliders to default values
            if (resultDivBmi) {
                resultDivBmi.style.display = 'none'; // Hide results panel
                // Reset result texts and indicator
                 bmiValueEl.textContent = '--.-';
                 bmiCategoryEl.textContent = '---';
                 idealWeightEl.textContent = '--- kg/lbs';
                 updateBmiIndicator(0); // Reset indicator
            }
        });
    }

    // Function to sync sliders to their default values after form reset
    function syncSlidersOnReset() {
         sliders.forEach(({ slider, number }) => {
            const sliderEl = document.getElementById(slider);
            const numberEl = document.getElementById(number);
            if (sliderEl && numberEl) {
                sliderEl.value = numberEl.defaultValue; // Reset slider to input's default value
            }
        });
    }

    // Handle Form Submission
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateAndDisplayBMI();
        });
    }

    // Calculation and Display Logic
    function calculateAndDisplayBMI() {
         if (!bmiForm || !resultDivBmi) return; // Ensure elements exist

        let weight, heightMeters;
        const selectedUnit = bmiUnitsSelect.value;
        let unitLabelWeight = 'kg';
        let unitLabelIdeal = 'kg';

        try {
            if (selectedUnit === 'metric') {
                weight = parseFloat(document.getElementById('weight-kg').value);
                const heightCm = parseFloat(document.getElementById('height-cm').value);
                 if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
                    throw new Error('Please enter valid positive weight and height in metric units.');
                 }
                 heightMeters = heightCm / 100;
            } else { // Imperial
                unitLabelWeight = 'lbs';
                unitLabelIdeal = 'lbs';
                weight = parseFloat(document.getElementById('weight-lbs').value);
                const heightFt = parseFloat(document.getElementById('height-ft').value) || 0;
                const heightIn = parseFloat(document.getElementById('height-in').value) || 0;
                const totalInches = (heightFt * 12) + heightIn;
                 if (isNaN(weight) || isNaN(totalInches) || weight <= 0 || totalInches <= 0) {
                     throw new Error('Please enter valid positive weight and height in imperial units.');
                 }
                heightMeters = totalInches * 0.0254; // Convert inches to meters
                weight = weight * 0.453592; // Convert lbs to kg for calculation
            }

            const bmi = weight / (heightMeters * heightMeters);

            // Calculate Ideal Weight Range (using BMI 18.5 to 24.9)
            const idealMinWeightKg = 18.5 * (heightMeters * heightMeters);
            const idealMaxWeightKg = 24.9 * (heightMeters * heightMeters);

            let idealMinDisplay = idealMinWeightKg;
            let idealMaxDisplay = idealMaxWeightKg;

             if (selectedUnit === 'imperial') {
                idealMinDisplay = idealMinWeightKg / 0.453592; // kg to lbs
                idealMaxDisplay = idealMaxWeightKg / 0.453592; // kg to lbs
            }

            // Display Results
            bmiValueEl.textContent = bmi.toFixed(1);
            bmiCategoryEl.textContent = getBmiCategory(bmi);
            idealWeightEl.textContent = `${idealMinDisplay.toFixed(1)} - ${idealMaxDisplay.toFixed(1)} ${unitLabelIdeal}`;
            updateBmiIndicator(bmi);
            resultDivBmi.style.display = 'block'; // Show results panel

        } catch (error) {
            alert(error.message);
            resultDivBmi.style.display = 'none'; // Hide results on error
             // Reset result texts and indicator
             bmiValueEl.textContent = '--.-';
             bmiCategoryEl.textContent = '---';
             idealWeightEl.textContent = '--- kg/lbs';
             updateBmiIndicator(0);
        }
    }

    // --- BMI Category Function (already present) ---
    function getBmiCategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
        if (bmi >= 25 && bmi < 29.9) return 'Overweight';
         if (bmi >= 30 && bmi < 34.9) return 'Obese'; // Added Obese range explicitly
        return 'Severely Obese'; // Over 35
    }

     // --- Update BMI Indicator Position ---
    function updateBmiIndicator(bmi) {
        if (!bmiIndicator) return;
        let percentage = 0;
        // Define ranges and corresponding percentages roughly based on visual scale
        if (bmi <= 0) { percentage = 0; } // Error or no calc yet
        else if (bmi < 18.5) { percentage = (bmi / 18.5) * 15; } // 0-15% for Underweight
        else if (bmi < 25) { percentage = 15 + ((bmi - 18.5) / (25 - 18.5)) * 35; } // 15-50% for Normal
        else if (bmi < 30) { percentage = 50 + ((bmi - 25) / (30 - 25)) * 25; } // 50-75% for Overweight
        else if (bmi < 35) { percentage = 75 + ((bmi - 30) / (35 - 30)) * 15; } // 75-90% for Obese
        else { percentage = Math.min(100, 90 + ((bmi - 35) / 5) * 10) ; } // 90-100% for Severely Obese (cap at 100)

        // Clamp percentage between 0 and 100
        percentage = Math.max(0, Math.min(100, percentage));

        bmiIndicator.style.left = `${percentage}%`;
    }

    // Initial setup: Hide imperial, reset results panel display (optional)
    if (imperialInputs) imperialInputs.style.display = 'none';
    if (resultDivBmi) resultDivBmi.style.display = 'none';

    // --- Calorie Calculator (BMR/TDEE) --- (calorie-calculator.html)
    const calorieForm = document.getElementById('calorie-form');
    const calUnits = document.querySelectorAll('input[name="cal-units"]');
    const metricInputsCal = document.getElementById('metric-inputs-cal');
    const imperialInputsCal = document.getElementById('imperial-inputs-cal');
    const calorieInputs = [
        document.getElementById('weight-kg-cal'),
        document.getElementById('height-cm-cal'),
        document.getElementById('weight-lbs-cal'),
        document.getElementById('height-ft-cal'),
        document.getElementById('height-in-cal'),
        document.getElementById('age-cal'),
        document.getElementById('gender-cal'),
        document.getElementById('activity-level')
    ];

    function calculateCalorieResults() {
        let weight, heightCm;
        const age = parseInt(document.getElementById('age-cal').value);
        const gender = document.getElementById('gender-cal').value;
        const activityLevel = parseFloat(document.getElementById('activity-level').value);
        const selectedUnit = document.querySelector('input[name="cal-units"]:checked').value;
        const resultDiv = document.getElementById('calorie-result');

        // Input validation
        if (isNaN(age) || age <= 0) {
            resultDiv.style.display = 'none'; return;
        }
        if (isNaN(activityLevel)) {
            resultDiv.style.display = 'none'; return;
        }

        // Get and validate weight/height based on units
        if (selectedUnit === 'metric') {
            weight = parseFloat(document.getElementById('weight-kg-cal').value);
            heightCm = parseFloat(document.getElementById('height-cm-cal').value);
            if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
                resultDiv.style.display = 'none'; return;
            }
        } else { // Imperial
            weight = parseFloat(document.getElementById('weight-lbs-cal').value);
            const heightFt = parseFloat(document.getElementById('height-ft-cal').value) || 0;
            const heightIn = parseFloat(document.getElementById('height-in-cal').value) || 0;
            const totalInches = (heightFt * 12) + heightIn;
            if (isNaN(weight) || isNaN(totalInches) || weight <= 0 || totalInches <= 0) {
                resultDiv.style.display = 'none'; return;
            }
            // Convert imperial to metric for calculation
            weight = weight * 0.453592; // lbs to kg
            heightCm = totalInches * 2.54; // inches to cm
        }

        // Calculate BMR using Mifflin-St Jeor equation
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) + 5;
        } else { // female
            bmr = (10 * weight) + (6.25 * heightCm) - (5 * age) - 161;
        }

        const tdee = bmr * activityLevel;

        document.getElementById('bmr-value').textContent = Math.round(bmr);
        document.getElementById('tdee-value').textContent = Math.round(tdee);
        document.getElementById('loss-mild').textContent = Math.round(tdee - 250);
        document.getElementById('gain-mild').textContent = Math.round(tdee + 250);

        resultDiv.style.display = 'block';
    }

    if (calUnits.length > 0) {
        calUnits.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'metric') {
                    metricInputsCal.style.display = 'block';
                    imperialInputsCal.style.display = 'none';
                } else {
                    metricInputsCal.style.display = 'none';
                    imperialInputsCal.style.display = 'block';
                }
                document.getElementById('calorie-form').reset();
                document.getElementById('calorie-result').style.display = 'none';
            });
        });
    }

    if (calorieForm) {
        calorieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateCalorieResults();
        });
        // Auto-calculate on any input change
        calorieInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', calculateCalorieResults);
                input.addEventListener('change', calculateCalorieResults);
            }
        });
    }

    // --- Age Calculator --- (other-calculator.html)
    const ageForm = document.getElementById('age-form');
    const currentDateInput = document.getElementById('currentdate');

     // Set default current date to today
    if (currentDateInput) {
        currentDateInput.valueAsDate = new Date();
    }

    if (ageForm) {
        ageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const birthdateStr = document.getElementById('birthdate').value;
            let currentdateStr = currentDateInput.value;

            if (!birthdateStr) {
                 alert('Please enter your date of birth.');
                 return;
            }
            if (!currentdateStr) {
                currentDateInput.valueAsDate = new Date(); // Set to today if cleared
                currentdateStr = currentDateInput.value;
            }

            const birthDate = new Date(birthdateStr);
            const currentDate = new Date(currentdateStr);

             if (birthDate > currentDate) {
                alert("Date of birth cannot be in the future or after the 'Calculate Age as of' date.");
                document.getElementById('age-result').style.display = 'none';
                return;
            }

            let years = currentDate.getFullYear() - birthDate.getFullYear();
            let months = currentDate.getMonth() - birthDate.getMonth();
            let days = currentDate.getDate() - birthDate.getDate();

            // Adjust months and years if days are negative
            if (days < 0) {
                months--;
                // Get days in the previous month
                const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                days += prevMonthDate.getDate();
            }

            // Adjust years if months are negative
            if (months < 0) {
                years--;
                months += 12;
            }

            const resultDiv = document.getElementById('age-result');
            const ageOutputEl = document.getElementById('age-output');

            ageOutputEl.textContent = `${years} years, ${months} months, and ${days} days`;
            resultDiv.style.display = 'block';
        });
    }

    // --- Date Duration Calculator --- (date-calculator.html)
    const dateDurationForm = document.getElementById('date-duration-form');
    if (dateDurationForm) {
        dateDurationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const startDateStr = document.getElementById('start-date').value;
            const endDateStr = document.getElementById('end-date').value;
            const includeEndDate = document.getElementById('include-end-date').checked;
            const resultDiv = document.getElementById('date-duration-result');

             if (!startDateStr || !endDateStr) {
                 alert('Please select both a start and end date.');
                 resultDiv.style.display = 'none';
                 return;
            }

            let startDate = new Date(startDateStr + 'T00:00:00'); // Use T00:00:00 to avoid timezone issues
            let endDate = new Date(endDateStr + 'T00:00:00');

            if (startDate > endDate) {
                alert('Start date cannot be after end date.');
                resultDiv.style.display = 'none';
                return;
            }

            // Calculate the difference in milliseconds
            let diffTime = endDate.getTime() - startDate.getTime();

             // Add one day in milliseconds if checkbox is checked
            if (includeEndDate) {
                diffTime += (24 * 60 * 60 * 1000);
            }

            // Calculate total days
            const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

             // Calculate years, months, days for display (approximation)
            let tempStartDate = new Date(startDateStr + 'T00:00:00');
            let tempEndDate = new Date(endDateStr + 'T00:00:00');

             if (includeEndDate) {
                 // Adjust end date by adding one day for the inclusive calculation display
                 tempEndDate.setDate(tempEndDate.getDate() + 1);
             }

            let years = tempEndDate.getFullYear() - tempStartDate.getFullYear();
            let months = tempEndDate.getMonth() - tempStartDate.getMonth();
            let days = tempEndDate.getDate() - tempStartDate.getDate();

            if (days < 0) {
                months--;
                const prevMonthEndDate = new Date(tempEndDate.getFullYear(), tempEndDate.getMonth(), 0);
                days += prevMonthEndDate.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            let durationString = [];
            if (years > 0) durationString.push(`${years} year${years > 1 ? 's' : ''}`);
            if (months > 0) durationString.push(`${months} month${months > 1 ? 's' : ''}`);
            if (days > 0) durationString.push(`${days} day${days > 1 ? 's' : ''}`);
             if (durationString.length === 0 && totalDays === 0 && !includeEndDate) durationString.push("0 days"); // Same day exclusive
             if (durationString.length === 0 && totalDays === 1 && includeEndDate) durationString.push("1 day"); // Same day inclusive

            document.getElementById('date-duration-output').textContent = durationString.join(', ') || 'Less than a day';
            document.getElementById('total-days-output').textContent = totalDays;
            resultDiv.style.display = 'block';
        });
    }

     // --- Percentage Calculator --- (percentage-calculator.html)
    const percentOfForm = document.getElementById('percent-of-form');
    const isWhatPercentForm = document.getElementById('is-what-percent-form');
    const percentChangeForm = document.getElementById('percent-change-form');

    // Form 1: What is X% of Y?
    if (percentOfForm) {
        percentOfForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const percent = parseFloat(document.getElementById('percent-val').value);
            const total = parseFloat(document.getElementById('percent-total').value);
            const resultDiv = document.getElementById('percent-of-result');

            if (isNaN(percent) || isNaN(total)) {
                alert('Please enter valid numbers for both fields.');
                 resultDiv.style.display = 'none'; return;
            }
            const result = (percent / 100) * total;
            document.getElementById('percent-of-output').textContent = result.toLocaleString();
            resultDiv.style.display = 'block';
        });
    }

    // Form 2: X is what % of Y?
    if (isWhatPercentForm) {
        isWhatPercentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const part = parseFloat(document.getElementById('is-val').value);
            const total = parseFloat(document.getElementById('is-total').value);
            const resultDiv = document.getElementById('is-what-percent-result');

            if (isNaN(part) || isNaN(total) || total === 0) {
                alert('Please enter valid numbers. Total (Y) cannot be zero.');
                resultDiv.style.display = 'none'; return;
            }
            const result = (part / total) * 100;
            document.getElementById('is-what-percent-output').textContent = result.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
            resultDiv.style.display = 'block';
        });
    }

    // Form 3: Percentage Change
    if (percentChangeForm) {
        percentChangeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const v1 = parseFloat(document.getElementById('change-v1').value);
            const v2 = parseFloat(document.getElementById('change-v2').value);
            const resultDiv = document.getElementById('percent-change-result');

            if (isNaN(v1) || isNaN(v2) || v1 === 0) {
                alert('Please enter valid numbers. Initial Value (V1) cannot be zero for percentage change calculation.');
                 resultDiv.style.display = 'none'; return;
            }
            const result = ((v2 - v1) / v1) * 100;
            document.getElementById('percent-change-output').textContent = result.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 });
            resultDiv.style.display = 'block';
        });
    }

}); // End DOMContentLoaded
