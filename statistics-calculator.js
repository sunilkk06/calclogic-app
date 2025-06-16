document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('stats-form');
    const dataInput = document.getElementById('dataInput');
    const resultDisplay = document.getElementById('stats-result-display');

    // --- Helper: Format Mode(s) for Display ---
    function formatMode(modeResult) {
        if (modeResult.modes.length === 0) {
            return 'None';
        }
        if (modeResult.isMultimodal && modeResult.modes.length === modeResult.maxFrequency) {
             // If all values appear with the same highest frequency (e.g., 1, 2, 3)
             // Or if multiple values share the max frequency and it's >= 2
             if (modeResult.modes.length > 1 && modeResult.maxFrequency >= 1)
                 return modeResult.modes.join(', ');
             else
                 return 'None'; // Treat as no mode if single occurrences or uniform distribution
        }
        return modeResult.modes.join(', ');
    }

    // --- Calculation Functions ---
    function calculateStatistics(numbers) {
        const n = numbers.length;
        if (n === 0) {
            return null; // No data
        }

        // Sort numbers for median calculation
        const sortedNumbers = [...numbers].sort((a, b) => a - b);

        // Sum & Mean
        const sum = numbers.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;

        // Median
        let median;
        const mid = Math.floor(n / 2);
        if (n % 2 === 0) {
            // Even number of elements: average of the two middle ones
            median = (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2;
        } else {
            // Odd number of elements: the middle one
            median = sortedNumbers[mid];
        }

        // Mode
        const frequencyMap = {};
        let maxFrequency = 0;
        let modes = [];
        numbers.forEach(num => {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
            if (frequencyMap[num] > maxFrequency) {
                maxFrequency = frequencyMap[num];
            }
        });

        let uniqueFrequencies = new Set();
        for (const num in frequencyMap) {
            uniqueFrequencies.add(frequencyMap[num]);
            if (frequencyMap[num] === maxFrequency) {
                modes.push(parseFloat(num)); // Store mode as number
            }
        }

        // Check if all numbers appear with the same frequency > 1 (no distinct mode)
        const allSameFrequency = uniqueFrequencies.size === 1 && maxFrequency > 1 && modes.length === n;
         const noMode = maxFrequency === 1 && n > 1; // Every number appears only once

        let modeResult = { modes: [], isMultimodal: false, maxFrequency: maxFrequency };
        if (!allSameFrequency && !noMode && maxFrequency > 1) {
             modeResult.modes = modes.sort((a, b) => a - b); // Sort modes numerically
             modeResult.isMultimodal = modes.length > 1;
        } else if (allSameFrequency && modes.length === n) {
            // Handle case like [2, 2, 5, 5]
            modeResult.modes = modes.sort((a, b) => a - b);
            modeResult.isMultimodal = true;
        }
        // else: No mode (modes array remains empty)


        // Variance & Standard Deviation (Sample)
        let variance = 0;
        if (n > 1) {
            const sumOfSquares = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
            variance = sumOfSquares / (n - 1);
        }
        const stdDev = Math.sqrt(variance);

        return {
            count: n,
            sum: sum,
            mean: mean,
            median: median,
            mode: modeResult,
            variance: variance,
            stdDev: stdDev
        };
    }

    // --- Display Function ---
    function displayResults(stats) {
        resultDisplay.innerHTML = ''; // Clear previous results

        if (!stats) {
            resultDisplay.innerHTML = '<div class="error-message">No valid numerical data found.</div>';
            return;
        }

        const resultsHtml = `
            <div class="result-item">
                <span class="result-label">Count:</span>
                <span class="result-value">${stats.count}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Sum:</span>
                <span class="result-value">${stats.sum.toLocaleString()}</span>
            </div>
             <div class="result-item">
                <span class="result-label">Mean (Average):</span>
                <span class="result-value">${stats.mean.toFixed(4)}</span>
            </div>
             <div class="result-item">
                <span class="result-label">Median:</span>
                <span class="result-value">${stats.median.toLocaleString()}</span>
            </div>
             <div class="result-item">
                <span class="result-label">Mode(s):</span>
                <span class="result-value">${formatMode(stats.mode)}</span>
            </div>
             <div class="result-item">
                <span class="result-label">Variance (Sample):</span>
                <span class="result-value">${stats.variance.toFixed(4)}</span>
            </div>
             <div class="result-item">
                <span class="result-label">Standard Deviation (Sample):</span>
                <span class="result-value">${stats.stdDev.toFixed(4)}</span>
            </div>
        `;
        resultDisplay.innerHTML = resultsHtml;
    }

     function displayError(message) {
        resultDisplay.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // --- Event Listener ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const rawData = dataInput.value;

        // Parse data: split by commas, spaces, or newlines, then filter valid numbers
        const numbers = rawData
            .split(/[\s, \n]+/) // Split by whitespace, comma, or newline
            .map(item => item.trim()) // Trim whitespace
            .filter(item => item !== '') // Remove empty strings
            .map(item => parseFloat(item)) // Convert to numbers
            .filter(num => !isNaN(num)); // Filter out NaN values

        if (numbers.length === 0) {
            displayError('No valid numerical data found. Please check your input.');
            return;
        }

        // Calculate statistics
        const stats = calculateStatistics(numbers);

        // Display results
        displayResults(stats);
    });
}); 