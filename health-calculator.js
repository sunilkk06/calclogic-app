document.addEventListener('DOMContentLoaded', function() {

    // --- BMI Calculator Logic ---
    const bmiForm = document.getElementById('bmi-calculator-form');
    const bmiUnitsMetric = document.getElementById('bmi-metric');
    const bmiUnitsImperial = document.getElementById('bmi-imperial');
    const heightCmInput = document.getElementById('bmi-height-cm');
    const heightFtInput = document.getElementById('bmi-height-ft');
    const heightInInput = document.getElementById('bmi-height-in');
    const weightKgInput = document.getElementById('bmi-weight-kg');
    const weightLbsInput = document.getElementById('bmi-weight-lbs');
    const metricHeightGroup = document.getElementById('bmi-height-metric');
    const imperialHeightGroup = document.getElementById('bmi-height-imperial');
    const metricWeightGroup = document.getElementById('bmi-weight-metric');
    const imperialWeightGroup = document.getElementById('bmi-weight-imperial');
    const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiIndicator = document.getElementById('bmi-indicator');

    // Function to toggle unit inputs
    function toggleBmiUnits() {
        if (bmiUnitsMetric.checked) {
            metricHeightGroup.style.display = 'block';
            metricWeightGroup.style.display = 'block';
            imperialHeightGroup.style.display = 'none';
            imperialWeightGroup.style.display = 'none';
        } else {
            metricHeightGroup.style.display = 'none';
            metricWeightGroup.style.display = 'none';
            imperialHeightGroup.style.display = 'flex'; // Use flex for inline display
            imperialWeightGroup.style.display = 'block';
        }
        clearBmiResults(); // Clear results when units change
    }

    // Function to clear BMI results and reset indicator
    function clearBmiResults() {
        bmiValueElement.textContent = '--.-';
        bmiCategoryElement.textContent = '---';
        updateBmiIndicator(0); // Reset indicator position
    }

    // Function to update BMI scale indicator position
    function updateBmiIndicator(bmi) {
        let percentage = 0;
        // Clamp BMI for scale positioning (e.g., between 10 and 40 for visual range)
        const minBmi = 10;
        const maxBmi = 40;
        if (bmi > 0) {
            const clampedBmi = Math.max(minBmi, Math.min(bmi, maxBmi));
            percentage = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
        }
        bmiIndicator.style.left = percentage + '%';
    }

    // Function to determine BMI category
    function getBmiCategory(bmi) {
        if (bmi <= 0) return '---';
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        if (bmi < 35) return 'Obesity (Class 1)';
        if (bmi < 40) return 'Obesity (Class 2)';
        return 'Extreme Obesity (Class 3)';
    }

    // Function to calculate BMI
    function calculateBmi() {
        let height = 0;
        let weight = 0;
        let bmi = 0;

        if (bmiUnitsMetric.checked) {
            const heightCm = parseFloat(heightCmInput.value);
            const weightKg = parseFloat(weightKgInput.value);
            if (heightCm > 0 && weightKg > 0) {
                height = heightCm / 100; // Convert cm to meters
                weight = weightKg;
                bmi = weight / (height * height);
            }
        } else { // Imperial units
            const heightFt = parseFloat(heightFtInput.value) || 0;
            const heightIn = parseFloat(heightInInput.value) || 0;
            const weightLbs = parseFloat(weightLbsInput.value);
            if ((heightFt > 0 || heightIn > 0) && weightLbs > 0) {
                height = (heightFt * 12) + heightIn; // Convert feet and inches to total inches
                weight = weightLbs;
                bmi = (weight / (height * height)) * 703;
            }
        }

        if (bmi > 0) {
            bmiValueElement.textContent = bmi.toFixed(1);
            bmiCategoryElement.textContent = getBmiCategory(bmi);
            updateBmiIndicator(bmi);
        } else {
            clearBmiResults();
        }
    }

    // Event listeners
    bmiUnitsMetric.addEventListener('change', toggleBmiUnits);
    bmiUnitsImperial.addEventListener('change', toggleBmiUnits);
    calculateBmiBtn.addEventListener('click', calculateBmi);

    // Add input event listeners to clear results if inputs are changed after calculation
    const bmiInputs = [heightCmInput, weightKgInput, heightFtInput, heightInInput, weightLbsInput];
    bmiInputs.forEach(input => {
        input.addEventListener('input', clearBmiResults);
    });

    // Initial setup
    toggleBmiUnits(); // Set initial visibility based on default checked radio

    // --- Calorie Calculator Logic ---
    const calorieForm = document.getElementById('calorie-calculator-form');
    const calorieUnitsMetric = document.getElementById('calorie-metric');
    const calorieUnitsImperial = document.getElementById('calorie-imperial');
    const calorieHeightCmInput = document.getElementById('calorie-height-cm');
    const calorieHeightFtInput = document.getElementById('calorie-height-ft');
    const calorieHeightInInput = document.getElementById('calorie-height-in');
    const calorieWeightKgInput = document.getElementById('calorie-weight-kg');
    const calorieWeightLbsInput = document.getElementById('calorie-weight-lbs');
    const calorieMetricHeightGroup = document.getElementById('calorie-height-metric');
    const calorieImperialHeightGroup = document.getElementById('calorie-height-imperial');
    const calorieMetricWeightGroup = document.getElementById('calorie-weight-metric');
    const calorieImperialWeightGroup = document.getElementById('calorie-weight-imperial');
    const ageInput = document.getElementById('calorie-age');
    const genderSelect = document.getElementById('calorie-gender');
    const activitySelect = document.getElementById('calorie-activity');
    const calculateCalorieBtn = document.getElementById('calculate-calorie-btn');
    const maintenanceCaloriesElement = document.getElementById('maintenance-calories');
    const mildLossElement = document.getElementById('mild-loss-calories');
    const lossElement = document.getElementById('loss-calories');
    const extremeLossElement = document.getElementById('extreme-loss-calories');
    const mildGainElement = document.getElementById('mild-gain-calories');
    const gainElement = document.getElementById('gain-calories');
    const extremeGainElement = document.getElementById('extreme-gain-calories');

    // Function to toggle calorie unit inputs
    function toggleCalorieUnits() {
        if (calorieUnitsMetric.checked) {
            calorieMetricHeightGroup.style.display = 'block';
            calorieMetricWeightGroup.style.display = 'block';
            calorieImperialHeightGroup.style.display = 'none';
            calorieImperialWeightGroup.style.display = 'none';
        } else {
            calorieMetricHeightGroup.style.display = 'none';
            calorieMetricWeightGroup.style.display = 'none';
            calorieImperialHeightGroup.style.display = 'flex'; // Use flex for inline display
            calorieImperialWeightGroup.style.display = 'block';
        }
        clearCalorieResults(); // Clear results when units change
    }

    // Function to clear calorie results
    function clearCalorieResults() {
        maintenanceCaloriesElement.textContent = '----';
        mildLossElement.textContent = '----';
        lossElement.textContent = '----';
        extremeLossElement.textContent = '----';
        mildGainElement.textContent = '----';
        gainElement.textContent = '----';
        extremeGainElement.textContent = '----';
    }

    // Function to calculate calories
    function calculateCalories() {
        const age = parseInt(ageInput.value);
        const gender = genderSelect.value;
        const activityFactor = parseFloat(activitySelect.value);
        let heightCm = 0;
        let weightKg = 0;

        // Get height and weight in metric units
        if (calorieUnitsMetric.checked) {
            heightCm = parseFloat(calorieHeightCmInput.value);
            weightKg = parseFloat(calorieWeightKgInput.value);
        } else { // Convert imperial to metric
            const heightFt = parseFloat(calorieHeightFtInput.value) || 0;
            const heightIn = parseFloat(calorieHeightInInput.value) || 0;
            const weightLbs = parseFloat(calorieWeightLbsInput.value);

            if (heightFt > 0 || heightIn > 0) {
                heightCm = ((heightFt * 12) + heightIn) * 2.54;
            }
            if (weightLbs > 0) {
                weightKg = weightLbs * 0.453592;
            }
        }

        // Validate inputs
        if (isNaN(age) || age <= 0 || isNaN(heightCm) || heightCm <= 0 || isNaN(weightKg) || weightKg <= 0 || isNaN(activityFactor)) {
            clearCalorieResults();
            // Optionally, show an error message to the user
            // alert("Please enter valid age, height, weight, and select an activity level.");
            return;
        }

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr = 0;
        if (gender === 'male') {
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
        } else { // female
            bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
        }

        // Calculate TDEE (Maintenance Calories)
        const tdee = bmr * activityFactor;

        // Update DOM with results
        maintenanceCaloriesElement.textContent = Math.round(tdee);

        // Calories for goals (approx. 500 calories deficit/surplus per pound (0.45kg) per week)
        // Deficit/Surplus per 0.25kg/week = 250 calories/day
        mildLossElement.textContent = Math.round(tdee - 250);
        lossElement.textContent = Math.round(tdee - 500);
        extremeLossElement.textContent = Math.round(tdee - 1000);
        mildGainElement.textContent = Math.round(tdee + 250);
        gainElement.textContent = Math.round(tdee + 500);
        extremeGainElement.textContent = Math.round(tdee + 1000);
    }

    // Event listeners for Calorie Calculator
    calorieUnitsMetric.addEventListener('change', toggleCalorieUnits);
    calorieUnitsImperial.addEventListener('change', toggleCalorieUnits);
    calculateCalorieBtn.addEventListener('click', calculateCalories);

    // Add input event listeners to clear results if inputs are changed after calculation
    const calorieInputs = [
        ageInput, genderSelect, activitySelect,
        calorieHeightCmInput, calorieWeightKgInput,
        calorieHeightFtInput, calorieHeightInInput, calorieWeightLbsInput
    ];
    calorieInputs.forEach(input => {
        input.addEventListener('input', clearCalorieResults);
    });

    // Initial setup for Calorie Calculator
    toggleCalorieUnits();

    // --- Body Fat Calculator Logic ---
    const bodyfatForm = document.getElementById('bodyfat-calculator-form');
    const bodyfatGender = document.getElementById('bodyfat-gender');
    const bodyfatUnitsMetric = document.getElementById('bodyfat-metric');
    const bodyfatUnitsImperial = document.getElementById('bodyfat-imperial');
    const bodyfatHeightCmInput = document.getElementById('bodyfat-height-cm');
    const bodyfatHeightFtInput = document.getElementById('bodyfat-height-ft');
    const bodyfatHeightInInput = document.getElementById('bodyfat-height-in');
    const bodyfatMetricHeightGroup = document.getElementById('bodyfat-height-metric');
    const bodyfatImperialHeightGroup = document.getElementById('bodyfat-height-imperial');
    const bodyfatNeckInput = document.getElementById('bodyfat-neck');
    const bodyfatWaistInput = document.getElementById('bodyfat-waist');
    const bodyfatHipInput = document.getElementById('bodyfat-hip');
    const bodyfatHipGroup = document.getElementById('bodyfat-hip-group');
    const calculateBodyfatBtn = document.getElementById('calculate-bodyfat-btn');
    const bodyfatPercentageElement = document.getElementById('bodyfat-percentage');
    const bodyfatMassElement = document.getElementById('bodyfat-mass');
    const bodyfatMassUnitElement = document.getElementById('bodyfat-mass-unit');
    const leanMassElement = document.getElementById('lean-mass');
    const leanMassUnitElement = document.getElementById('lean-mass-unit');
    const bodyfatCategoryElement = document.getElementById('bodyfat-category');
    const unitLabelsBf = document.querySelectorAll('.unit-label-bf'); // For cm/in labels

    // Function to toggle body fat units (cm/inches)
    function toggleBodyfatUnits() {
        const isMetric = bodyfatUnitsMetric.checked;
        const heightUnit = isMetric ? 'cm' : 'in';
        const circUnit = isMetric ? 'cm' : 'inches';

        bodyfatMetricHeightGroup.style.display = isMetric ? 'block' : 'none';
        bodyfatImperialHeightGroup.style.display = isMetric ? 'none' : 'flex';

        // Update circumference labels
        unitLabelsBf.forEach(label => label.textContent = circUnit);

        // Update result units
        bodyfatMassUnitElement.textContent = isMetric ? 'kg' : 'lbs';
        leanMassUnitElement.textContent = isMetric ? 'kg' : 'lbs';

        clearBodyfatResults();
    }

    // Function to toggle hip input based on gender
    function toggleHipInput() {
        bodyfatHipGroup.style.display = (bodyfatGender.value === 'female') ? 'block' : 'none';
        clearBodyfatResults();
    }

    // Function to clear body fat results
    function clearBodyfatResults() {
        bodyfatPercentageElement.textContent = '--.-';
        bodyfatMassElement.textContent = '---';
        leanMassElement.textContent = '---';
        bodyfatCategoryElement.textContent = '---';
    }

    // Function to get body fat category
    function getBodyfatCategory(percentage, gender) {
        if (percentage <= 0) return '---';
        if (gender === 'male') {
            if (percentage < 6) return 'Essential Fat';
            if (percentage < 14) return 'Athletes';
            if (percentage < 18) return 'Fitness';
            if (percentage < 25) return 'Acceptable';
            return 'Obese';
        } else { // female
            if (percentage < 14) return 'Essential Fat';
            if (percentage < 21) return 'Athletes';
            if (percentage < 25) return 'Fitness';
            if (percentage < 32) return 'Acceptable';
            return 'Obese';
        }
    }

    // Function to calculate body fat
    function calculateBodyfat() {
        const gender = bodyfatGender.value;
        const isMetric = bodyfatUnitsMetric.checked;
        let height = 0, neck = 0, waist = 0, hip = 0;
        let bodyfatPercent = 0;

        // Get measurements in inches (convert if metric)
        if (isMetric) {
            const heightCm = parseFloat(bodyfatHeightCmInput.value);
            const neckCm = parseFloat(bodyfatNeckInput.value);
            const waistCm = parseFloat(bodyfatWaistInput.value);
            const hipCm = parseFloat(bodyfatHipInput.value) || 0; // Default to 0 if not female
            if (heightCm > 0) height = heightCm / 2.54;
            if (neckCm > 0) neck = neckCm / 2.54;
            if (waistCm > 0) waist = waistCm / 2.54;
            if (hipCm > 0) hip = hipCm / 2.54;
        } else {
            const heightFt = parseFloat(bodyfatHeightFtInput.value) || 0;
            const heightIn = parseFloat(bodyfatHeightInInput.value) || 0;
            neck = parseFloat(bodyfatNeckInput.value) || 0;
            waist = parseFloat(bodyfatWaistInput.value) || 0;
            hip = parseFloat(bodyfatHipInput.value) || 0;
            if (heightFt > 0 || heightIn > 0) height = (heightFt * 12) + heightIn;
        }

        // Validate inputs
        if (height <= 0 || neck <= 0 || waist <= 0 || (gender === 'female' && hip <= 0)) {
            clearBodyfatResults();
            // alert("Please enter valid height and circumference measurements.");
            return;
        }

        // US Navy Body Fat formula
        if (gender === 'male') {
             bodyfatPercent = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        } else { // female
             bodyfatPercent = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
        }

        if (bodyfatPercent > 0 && bodyfatPercent < 100) { // Basic validity check
             bodyfatPercentageElement.textContent = bodyfatPercent.toFixed(1);
             bodyfatCategoryElement.textContent = getBodyfatCategory(bodyfatPercent, gender);

            // Calculate fat mass and lean mass (requires weight)
            // Find the corresponding weight input based on units
            let weightKg = NaN;
            if (calorieUnitsMetric.checked && !isNaN(parseFloat(calorieWeightKgInput.value))) {
                 weightKg = parseFloat(calorieWeightKgInput.value);
            } else if (calorieUnitsImperial.checked && !isNaN(parseFloat(calorieWeightLbsInput.value))){
                 weightKg = parseFloat(calorieWeightLbsInput.value) * 0.453592;
            }

            if (!isNaN(weightKg)) {
                const fatMassKg = (bodyfatPercent / 100) * weightKg;
                const leanMassKg = weightKg - fatMassKg;
                if (isMetric) {
                    bodyfatMassElement.textContent = fatMassKg.toFixed(1);
                    leanMassElement.textContent = leanMassKg.toFixed(1);
                } else {
                    bodyfatMassElement.textContent = (fatMassKg * 2.20462).toFixed(1); // to lbs
                    leanMassElement.textContent = (leanMassKg * 2.20462).toFixed(1); // to lbs
                }
            } else {
                 bodyfatMassElement.textContent = 'N/A*';
                 leanMassElement.textContent = 'N/A*';
                 // Add footnote later explaining weight needed from calorie calc
             }

        } else {
            clearBodyfatResults();
            bodyfatPercentageElement.textContent = 'Error'; // Indicate calculation issue
        }
    }

    // Event Listeners for Body Fat Calc
    bodyfatGender.addEventListener('change', toggleHipInput);
    bodyfatUnitsMetric.addEventListener('change', toggleBodyfatUnits);
    bodyfatUnitsImperial.addEventListener('change', toggleBodyfatUnits);
    calculateBodyfatBtn.addEventListener('click', calculateBodyfat);
    const bodyfatInputs = [bodyfatHeightCmInput, bodyfatHeightFtInput, bodyfatHeightInInput, bodyfatNeckInput, bodyfatWaistInput, bodyfatHipInput];
    bodyfatInputs.forEach(input => input.addEventListener('input', clearBodyfatResults));

    // Initial setup for Body Fat Calc
    toggleHipInput();
    toggleBodyfatUnits();

    // --- BMR Calculator Logic ---
    const bmrForm = document.getElementById('bmr-calculator-form');
    const bmrUnitInputs = document.getElementsByName('bmr-units');
    const bmrMetricInputs = document.getElementById('metric-bmr-inputs');
    const bmrImperialInputs = document.getElementById('imperial-bmr-inputs');

    // BMR Input Elements
    const bmrGenderSelect = document.getElementById('bmr-gender');
    const bmrAgeInput = document.getElementById('bmr-age');
    const bmrHeightCmInput = document.getElementById('bmr-height-cm');
    const bmrWeightKgInput = document.getElementById('bmr-weight-kg');
    const bmrHeightInInput = document.getElementById('bmr-height-in');
    const bmrWeightLbInput = document.getElementById('bmr-weight-lb');
    const bmrActivitySelect = document.getElementById('activity-level');

    // BMR Result Elements
    const bmrResultValue = document.getElementById('bmr-result');
    const tdeeResultValue = document.getElementById('tdee-result');
    const weightLossResultValue = document.getElementById('weight-loss');
    const maintenanceResultValue = document.getElementById('maintenance');
    const weightGainResultValue = document.getElementById('weight-gain');

    // Constants for BMR calculations
    const BMR_LB_TO_KG = 0.45359237;
    const BMR_IN_TO_CM = 2.54;

    // Initialize BMR Calculator
    function initBmrCalculator() {
        // Unit toggle handler
        bmrUnitInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const isMetric = e.target.value === 'metric';
                bmrMetricInputs.style.display = isMetric ? 'block' : 'none';
                bmrImperialInputs.style.display = isMetric ? 'none' : 'block';
                clearBmrInputs();
            });
        });

        // Form submission handler
        bmrForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateBmrAndUpdate();
        });

        // Input validation handlers
        const bmrNumberInputs = [bmrAgeInput, bmrHeightCmInput, bmrWeightKgInput, bmrHeightInInput, bmrWeightLbInput];
        bmrNumberInputs.forEach(input => {
            input.addEventListener('input', validateBmrInput);
        });
    }

    // Validate BMR number inputs
    function validateBmrInput(e) {
        const input = e.target;
        const value = parseFloat(input.value);
        
        if (value < parseFloat(input.min)) {
            input.value = input.min;
        } else if (value > parseFloat(input.max)) {
            input.value = input.max;
        }
    }

    // Clear BMR input fields
    function clearBmrInputs() {
        bmrHeightCmInput.value = '';
        bmrWeightKgInput.value = '';
        bmrHeightInInput.value = '';
        bmrWeightLbInput.value = '';
        clearBmrResults();
    }

    // Clear BMR results
    function clearBmrResults() {
        const defaultDisplay = '----<span class="result-unit">calories/day</span>';
        bmrResultValue.innerHTML = defaultDisplay;
        tdeeResultValue.innerHTML = defaultDisplay;
        weightLossResultValue.innerHTML = defaultDisplay;
        maintenanceResultValue.innerHTML = defaultDisplay;
        weightGainResultValue.innerHTML = defaultDisplay;
    }

    // Convert imperial to metric for BMR
    function convertToMetricBmr(height, weight) {
        return {
            heightCm: height * BMR_IN_TO_CM,
            weightKg: weight * BMR_LB_TO_KG
        };
    }

    // Calculate BMR and update results
    function calculateBmrAndUpdate() {
        let heightCm, weightKg;
        const isMetric = document.querySelector('input[name="bmr-units"]:checked').value === 'metric';
        
        if (isMetric) {
            heightCm = parseFloat(bmrHeightCmInput.value);
            weightKg = parseFloat(bmrWeightKgInput.value);
        } else {
            const imperial = convertToMetricBmr(
                parseFloat(bmrHeightInInput.value),
                parseFloat(bmrWeightLbInput.value)
            );
            heightCm = imperial.heightCm;
            weightKg = imperial.weightKg;
        }

        const age = parseInt(bmrAgeInput.value);
        const gender = bmrGenderSelect.value;
        const activityLevel = parseFloat(bmrActivitySelect.value);

        // Mifflin-St Jeor Equation
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;

        // Calculate TDEE and goals
        const tdee = Math.round(bmr * activityLevel);
        bmr = Math.round(bmr);
        const weightLossCals = tdee - 500;
        const weightGainCals = tdee + 500;

        // Update results with animation
        updateBmrResults(bmr, tdee, weightLossCals, tdee, weightGainCals);
    }

    // Update BMR calculator results
    function updateBmrResults(bmr, tdee, weightLoss, maintenance, weightGain) {
        const formatNumber = (num) => num.toLocaleString();
        
        const resultElements = [
            { element: bmrResultValue, value: bmr },
            { element: tdeeResultValue, value: tdee },
            { element: weightLossResultValue, value: weightLoss },
            { element: maintenanceResultValue, value: maintenance },
            { element: weightGainResultValue, value: weightGain }
        ];

        resultElements.forEach(({ element, value }) => {
            element.innerHTML = `${formatNumber(value)}<span class="result-unit">calories/day</span>`;
            element.classList.add('result-updated');
            setTimeout(() => element.classList.remove('result-updated'), 500);
        });
    }

    // Initialize BMR calculator
    initBmrCalculator();

}); 