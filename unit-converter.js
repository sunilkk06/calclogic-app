document.addEventListener('DOMContentLoaded', function() {
    const conversionTypeSelect = document.getElementById('conversionType');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const fromValueInput = document.getElementById('fromValue');
    const toValueInput = document.getElementById('toValue');
    const swapUnitsBtn = document.getElementById('swapUnitsBtn');

    // --- Unit Definitions ---
    const units = {
        length: {
            meter: { name: 'Meter (m)', factor: 1 },
            kilometer: { name: 'Kilometer (km)', factor: 1000 },
            centimeter: { name: 'Centimeter (cm)', factor: 0.01 },
            millimeter: { name: 'Millimeter (mm)', factor: 0.001 },
            mile: { name: 'Mile (mi)', factor: 1609.34 },
            yard: { name: 'Yard (yd)', factor: 0.9144 },
            foot: { name: 'Foot (ft)', factor: 0.3048 },
            inch: { name: 'Inch (in)', factor: 0.0254 }
        },
        weight: {
            kilogram: { name: 'Kilogram (kg)', factor: 1 },
            gram: { name: 'Gram (g)', factor: 0.001 },
            milligram: { name: 'Milligram (mg)', factor: 1e-6 },
            pound: { name: 'Pound (lb)', factor: 0.453592 },
            ounce: { name: 'Ounce (oz)', factor: 0.0283495 },
            stone: { name: 'Stone (st)', factor: 6.35029 },
            metric_ton: { name: 'Metric Ton (t)', factor: 1000 }
        },
        temperature: {
            celsius: { name: 'Celsius (°C)', toBase: c => c, fromBase: c => c },
            fahrenheit: { name: 'Fahrenheit (°F)', toBase: f => (f - 32) * 5/9, fromBase: c => (c * 9/5) + 32 },
            kelvin: { name: 'Kelvin (K)', toBase: k => k - 273.15, fromBase: c => c + 273.15 }
        },
        volume: {
            liter: { name: 'Liter (L)', factor: 1 },
            milliliter: { name: 'Milliliter (mL)', factor: 0.001 },
            gallon_us: { name: 'Gallon (US)', factor: 3.78541 },
            quart_us: { name: 'Quart (US qt)', factor: 0.946353 },
            pint_us: { name: 'Pint (US pt)', factor: 0.473176 },
            cup_us: { name: 'Cup (US)', factor: 0.236588 }, // US legal cup
            fluid_ounce_us: { name: 'Fluid Ounce (US fl oz)', factor: 0.0295735 },
            gallon_uk: { name: 'Gallon (UK)', factor: 4.54609 },
            pint_uk: { name: 'Pint (UK pt)', factor: 0.568261 },
            fluid_ounce_uk: { name: 'Fluid Ounce (UK fl oz)', factor: 0.0284131 }
        },
        area: {
            square_meter: { name: 'Square Meter (m²)', factor: 1 },
            square_kilometer: { name: 'Square Kilometer (km²)', factor: 1e6 },
            square_mile: { name: 'Square Mile (mi²)', factor: 2.59e6 },
            hectare: { name: 'Hectare (ha)', factor: 10000 },
            acre: { name: 'Acre', factor: 4046.86 },
            square_foot: { name: 'Square Foot (ft²)', factor: 0.092903 },
            square_inch: { name: 'Square Inch (in²)', factor: 0.00064516 }
        },
        speed: {
            mps: { name: 'Meter per second (m/s)', factor: 1 },
            kph: { name: 'Kilometer per hour (km/h)', factor: 1 / 3.6 },
            mph: { name: 'Mile per hour (mph)', factor: 0.44704 },
            knot: { name: 'Knot (kn)', factor: 0.514444 }
        }
        // Add more categories (e.g., time, pressure) here
    };

    // --- Functions ---

    function populateUnitOptions(type) {
        const unitData = units[type];
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        for (const key in unitData) {
            const option1 = document.createElement('option');
            option1.value = key;
            option1.textContent = unitData[key].name;
            fromUnitSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = key;
            option2.textContent = unitData[key].name;
            toUnitSelect.appendChild(option2);
        }

        // Set default different selections
        if (fromUnitSelect.options.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
         triggerConversion(); // Perform initial conversion with defaults
    }

    function convertUnits() {
        const fromValue = parseFloat(fromValueInput.value);
        if (isNaN(fromValue)) {
            toValueInput.value = '';
            return;
        }

        const type = conversionTypeSelect.value;
        const fromUnitKey = fromUnitSelect.value;
        const toUnitKey = toUnitSelect.value;

        if (!units[type] || !units[type][fromUnitKey] || !units[type][toUnitKey]) {
            toValueInput.value = 'Error';
            return;
        }

        const fromUnit = units[type][fromUnitKey];
        const toUnit = units[type][toUnitKey];

        let result;

        if (type === 'temperature') {
            // Handle temperature conversion using specific functions
            const baseValue = fromUnit.toBase(fromValue);
            result = toUnit.fromBase(baseValue);
        } else {
            // Handle other conversions using factors
            const baseValue = fromValue * fromUnit.factor;
            result = baseValue / toUnit.factor;
        }

        // Display result with appropriate precision
        if (Math.abs(result) < 0.0001 && result !== 0) {
            toValueInput.value = result.toExponential(4);
        } else {
             // Round to a reasonable number of decimal places
            toValueInput.value = parseFloat(result.toFixed(6));
        }
    }

     function triggerConversion() {
        if (fromValueInput.value !== '' && !isNaN(parseFloat(fromValueInput.value))) {
             convertUnits();
         } else {
            toValueInput.value = ''; // Clear result if input is empty or invalid
         }
     }

    function swapUnits() {
        const fromIndex = fromUnitSelect.selectedIndex;
        const toIndex = toUnitSelect.selectedIndex;

        fromUnitSelect.selectedIndex = toIndex;
        toUnitSelect.selectedIndex = fromIndex;

        triggerConversion(); // Recalculate after swapping
    }

    // --- Event Listeners ---

    conversionTypeSelect.addEventListener('change', (e) => {
        populateUnitOptions(e.target.value);
    });

    fromValueInput.addEventListener('input', triggerConversion);
    fromUnitSelect.addEventListener('change', triggerConversion);
    toUnitSelect.addEventListener('change', triggerConversion);
    swapUnitsBtn.addEventListener('click', swapUnits);

    // --- Initialization ---
    populateUnitOptions(conversionTypeSelect.value); // Initial population

}); 