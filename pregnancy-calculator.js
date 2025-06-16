document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pregnancy-form');
    const calcMethodSelect = document.getElementById('calcMethod');
    const lmpDateInput = document.getElementById('lmpDate');
    const cycleLengthInput = document.getElementById('cycleLength');
    const conceptionDateInput = document.getElementById('conceptionDate');
    const ivfTransferDateInput = document.getElementById('ivfTransferDate');
    const ivfDaySelect = document.getElementById('ivfDay');
    const resultDisplay = document.getElementById('pregnancy-result-display');

    const lmpGroup = document.getElementById('lmpDateGroup');
    const cycleGroup = document.getElementById('cycleLengthGroup');
    const conceptionGroup = document.getElementById('conceptionDateGroup');
    const ivfGroup = document.getElementById('ivfDateGroup');

    // --- Helper Functions ---
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function formatDate(date) {
        if (!date || isNaN(date.getTime())) {
             return "Invalid Date";
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function calculateGestationalAge(startDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        startDate.setHours(0, 0, 0, 0); // Normalize start date

        if (isNaN(startDate.getTime()) || startDate > today) {
            return { weeks: 0, days: 0, text: "Not yet started or invalid date" };
        }

        const diffTime = Math.abs(today - startDate);
        const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDaysTotal / 7);
        const days = diffDaysTotal % 7;

        return {
            weeks: weeks,
            days: days,
            text: `${weeks} week${weeks !== 1 ? 's' : ''}, ${days} day${days !== 1 ? 's' : ''}`
        };
    }

    function getTrimester(weeks) {
        if (weeks >= 1 && weeks <= 13) {
            return "First Trimester";
        } else if (weeks >= 14 && weeks <= 27) {
            return "Second Trimester";
        } else if (weeks >= 28) {
            return "Third Trimester";
        } else {
            return "-";
        }
    }

    // --- Calculation Logic ---
    function calculateDueDate(method, date1, cycleLength = 28, ivfDay = 5) {
        let estimatedConception;
        let dueDate;
        const standardPregnancyDuration = 280; // days (40 weeks)
        const conceptionToBirth = 266; // days (38 weeks)

        const baseDate = new Date(date1 + 'T00:00:00'); // Ensure date is parsed correctly
        if (isNaN(baseDate.getTime())) return { dueDate: null, conceptionDate: null };

        switch (method) {
            case 'lmp':
                // Adjust ovulation day based on cycle length
                const cycleAdjustment = cycleLength - 28;
                estimatedConception = addDays(baseDate, 14 + cycleAdjustment);
                dueDate = addDays(baseDate, standardPregnancyDuration + cycleAdjustment);
                break;
            case 'conception':
                estimatedConception = baseDate;
                dueDate = addDays(baseDate, conceptionToBirth);
                break;
             case 'ivf':
                // For IVF, due date is calculated from transfer date + standard gestation - embryo age
                 // Gestation from LMP = 280 days. Embryo age = 14 days (avg ovulation) + transfer day
                 const effectiveLmpOffset = 14 + parseInt(ivfDay);
                 // Calculate equivalent LMP date
                 const equivalentLmp = addDays(baseDate, -effectiveLmpOffset);
                 dueDate = addDays(equivalentLmp, standardPregnancyDuration);
                 estimatedConception = addDays(dueDate, -conceptionToBirth); // Estimate conception based on due date
                 break;
            default:
                return { dueDate: null, conceptionDate: null };
        }
        return { dueDate: dueDate, conceptionDate: estimatedConception };
    }

    // --- Display Logic ---
    function displayResults(results) {
         resultDisplay.innerHTML = ''; // Clear placeholder

         if (!results || !results.dueDate || isNaN(results.dueDate.getTime())) {
             resultDisplay.innerHTML = '<div class="error-message">Could not calculate due date. Please check inputs.</div>';
             return;
         }

         const { dueDate, conceptionDate } = results;
         const gestationalAge = calculateGestationalAge(conceptionDate); // Use conception date for gestational age
         const trimester = getTrimester(gestationalAge.weeks);

         const resultsHtml = `
             <div class="result-item highlight">
                 <span class="result-label">Estimated Due Date:</span>
                 <span class="result-value main-result">${formatDate(dueDate)}</span>
             </div>
             <div class="result-item">
                 <span class="result-label">Current Gestational Age:</span>
                 <span class="result-value">${gestationalAge.text}</span>
             </div>
             <div class="result-item">
                 <span class="result-label">Current Trimester:</span>
                 <span class="result-value">${trimester}</span>
             </div>
              <div class="result-item">
                 <span class="result-label">Estimated Conception Date:</span>
                 <span class="result-value">${formatDate(conceptionDate)}</span>
             </div>
         `;
         resultDisplay.innerHTML = resultsHtml;
    }

    function displayError(message) {
        resultDisplay.innerHTML = `<div class="error-message">${message}</div>`;
    }

    // --- UI Update Logic ---
    function updateFormVisibility() {
        const method = calcMethodSelect.value;
        lmpGroup.style.display = 'none';
        cycleGroup.style.display = 'none';
        conceptionGroup.style.display = 'none';
        ivfGroup.style.display = 'none';

        // Clear input requirements initially
        lmpDateInput.required = false;
        conceptionDateInput.required = false;
        ivfTransferDateInput.required = false;

        if (method === 'lmp') {
            lmpGroup.style.display = 'block';
            cycleGroup.style.display = 'block';
            lmpDateInput.required = true;
        } else if (method === 'conception') {
            conceptionGroup.style.display = 'block';
            conceptionDateInput.required = true;
        } else if (method === 'ivf') {
            ivfGroup.style.display = 'block';
             ivfTransferDateInput.required = true;
        }
    }

    // --- Event Listeners ---
    calcMethodSelect.addEventListener('change', updateFormVisibility);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const method = calcMethodSelect.value;
        let results;

        try {
            if (method === 'lmp') {
                const lmpDate = lmpDateInput.value;
                const cycleLength = parseInt(cycleLengthInput.value) || 28;
                 if (!lmpDate) throw new Error("LMP date is required.");
                results = calculateDueDate(method, lmpDate, cycleLength);
            } else if (method === 'conception') {
                const conceptionDate = conceptionDateInput.value;
                 if (!conceptionDate) throw new Error("Conception date is required.");
                results = calculateDueDate(method, conceptionDate);
            } else if (method === 'ivf') {
                 const ivfDate = ivfTransferDateInput.value;
                 const ivfDay = parseInt(ivfDaySelect.value);
                  if (!ivfDate) throw new Error("IVF transfer date is required.");
                 results = calculateDueDate(method, ivfDate, undefined, ivfDay);
            }

            displayResults(results);

        } catch (error) {
             displayError(error.message);
        }
    });

    // --- Initialization ---
    updateFormVisibility(); // Set initial form visibility

}); 