document.addEventListener('DOMContentLoaded', function() {

    const dobInput = document.getElementById('dob');
    const calculateAgeBtn = document.getElementById('calculate-age-btn');
    const ageYearsSpan = document.getElementById('age-years');
    const ageMonthsSpan = document.getElementById('age-months');
    const ageDaysSpan = document.getElementById('age-days');
    const totalDaysSpan = document.getElementById('total-days');
    const ageResultDisplay = document.getElementById('age-result-display').parentNode; // The result-item highlight div

    function calculateAge() {
        const dobString = dobInput.value;
        if (!dobString) {
            clearAgeResults();
            // alert("Please select a date of birth.");
            return;
        }

        const dob = new Date(dobString);
        const today = new Date();

        // Basic validation: Check if dob is valid and not in the future
        if (isNaN(dob.getTime()) || dob > today) {
            clearAgeResults();
             ageYearsSpan.textContent = 'Invalid';
            ageMonthsSpan.textContent = 'Date';
            ageDaysSpan.textContent = '';
            totalDaysSpan.textContent = '----';
            ageResultDisplay.style.display = 'block';
             return;
        }

        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        // Adjust months and years if the current date's month/day is before the birth date's month/day
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12; // Borrow a year
        }

        // Adjust days if negative
        if (days < 0) {
            // Borrow a month
            months--;
            // Get days in the previous month (relative to today)
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Day 0 gives last day of previous month
            days += prevMonth.getDate();
             // Re-check month adjustment after borrowing day
             if (months < 0) {
                years--;
                months += 12;
            }
        }

        // Calculate total days lived (approximation)
        const totalDaysLived = Math.floor((today - dob) / (1000 * 60 * 60 * 24));

        // Update DOM
        ageYearsSpan.textContent = years;
        ageMonthsSpan.textContent = months;
        ageDaysSpan.textContent = days;
        totalDaysSpan.textContent = totalDaysLived.toLocaleString();
        ageResultDisplay.style.display = 'block';
    }

    function clearAgeResults() {
        ageYearsSpan.textContent = '--';
        ageMonthsSpan.textContent = '--';
        ageDaysSpan.textContent = '--';
        totalDaysSpan.textContent = '----';
        // Keep display block but show placeholders
        // ageResultDisplay.style.display = 'none'; 
    }

    calculateAgeBtn.addEventListener('click', calculateAge);
    dobInput.addEventListener('input', clearAgeResults); // Clear if date changes
    dobInput.addEventListener('change', clearAgeResults); // Clear if date changes

}); 