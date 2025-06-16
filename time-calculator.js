document.addEventListener('DOMContentLoaded', function() {
    // --- Elements for Duration Calculation ---
    const durationForm = document.getElementById('time-duration-form');
    const startHourInput = document.getElementById('start-hour');
    const startMinInput = document.getElementById('start-min');
    const startSecInput = document.getElementById('start-sec');
    const startAmPmSelect = document.getElementById('start-ampm');
    const endHourInput = document.getElementById('end-hour');
    const endMinInput = document.getElementById('end-min');
    const endSecInput = document.getElementById('end-sec');
    const endAmPmSelect = document.getElementById('end-ampm');
    const durationResultDiv = document.getElementById('duration-result');

    // --- Elements for Add/Subtract Calculation ---
    const addSubtractForm = document.getElementById('time-add-subtract-form');
    const opStartHourInput = document.getElementById('op-start-hour');
    const opStartMinInput = document.getElementById('op-start-min');
    const opStartSecInput = document.getElementById('op-start-sec');
    const opStartAmPmSelect = document.getElementById('op-start-ampm');
    const timeOperationSelect = document.getElementById('time-operation');
    const opDaysInput = document.getElementById('op-days');
    const opHoursInput = document.getElementById('op-hours');
    const opMinutesInput = document.getElementById('op-minutes');
    const opSecondsInput = document.getElementById('op-seconds');
    const addSubtractResultDiv = document.getElementById('add-subtract-result');

    // --- Helper Functions ---

    // Convert HH:MM:SS AM/PM to 24-hour format seconds from midnight
    function timeToSeconds(hour, min, sec, ampm) {
        hour = parseInt(hour);
        min = parseInt(min);
        sec = parseInt(sec);

        if (isNaN(hour) || isNaN(min) || isNaN(sec) || hour < 0 || hour > 12 || min < 0 || min > 59 || sec < 0 || sec > 59) {
            return NaN; // Invalid time input
        }
        // Handle 12 AM/PM
        if (ampm === 'pm' && hour !== 12) {
            hour += 12;
        } else if (ampm === 'am' && hour === 12) {
            hour = 0; // Midnight case
        }
         if (hour === 24) hour = 0; // Adjust potential 12pm -> 24

        return hour * 3600 + min * 60 + sec;
    }

    // Format total seconds into D days HH hours MM minutes SS seconds
    function formatDuration(totalSeconds) {
        if (isNaN(totalSeconds)) return "Invalid calculation";

        const sign = totalSeconds < 0 ? '-' : '';
        totalSeconds = Math.abs(totalSeconds);

        const days = Math.floor(totalSeconds / (3600 * 24));
        totalSeconds %= (3600 * 24);
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        let result = sign;
        if (days > 0) result += `${days} day${days > 1 ? 's' : ''} `;
        result += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        result += ` (${sign}${hours}h ${minutes}m ${seconds}s)`;

        return result.trim();
    }

    // Format seconds since midnight back to HH:MM:SS AM/PM
    function formatTime(totalSeconds, daysOffset = 0) {
        if (isNaN(totalSeconds)) return "Invalid Time";

        totalSeconds = Math.round(totalSeconds); // Round to nearest second

        // Handle potential day rollovers
        const secondsInDay = 24 * 3600;
        daysOffset += Math.floor(totalSeconds / secondsInDay);
        totalSeconds = totalSeconds % secondsInDay;
        if (totalSeconds < 0) {
            totalSeconds += secondsInDay;
            daysOffset--;
        }

        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        let timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
        if (daysOffset !== 0) {
            timeString += ` (${daysOffset > 0 ? '+' : ''}${daysOffset} day${Math.abs(daysOffset) > 1 ? 's' : ''})`;
        }
        return timeString;
    }

    function displayResult(element, message) {
        element.innerHTML = `<span class="result-value">${message}</span>`;
        element.style.display = 'block';
    }
     function displayError(element, message) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
        element.style.display = 'block';
    }

    // --- Event Listeners ---

    // Duration Calculator Form
    durationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const startSeconds = timeToSeconds(startHourInput.value, startMinInput.value, startSecInput.value, startAmPmSelect.value);
        const endSeconds = timeToSeconds(endHourInput.value, endMinInput.value, endSecInput.value, endAmPmSelect.value);

        if (isNaN(startSeconds) || isNaN(endSeconds)) {
            displayError(durationResultDiv, 'Invalid time input.');
            return;
        }

        let difference = endSeconds - startSeconds;
        // If end time is earlier than start time, assume it's the next day
        // Note: This simple logic doesn't handle durations > 24h. More complex date handling would be needed.
        if (difference < 0) {
             // difference += 24 * 3600; // Assume next day - simple approach
             // Better: Just show negative duration or use date inputs for multi-day
        }

        displayResult(durationResultDiv, `Duration: ${formatDuration(difference)}`);
    });

    // Add/Subtract Time Form
    addSubtractForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const startSeconds = timeToSeconds(opStartHourInput.value, opStartMinInput.value, opStartSecInput.value, opStartAmPmSelect.value);

        const days = parseInt(opDaysInput.value) || 0;
        const hours = parseInt(opHoursInput.value) || 0;
        const minutes = parseInt(opMinutesInput.value) || 0;
        const seconds = parseInt(opSecondsInput.value) || 0;
        const operation = timeOperationSelect.value;

        if (isNaN(startSeconds)) {
             displayError(addSubtractResultDiv, 'Invalid start time input.');
            return;
        }
         if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
              displayError(addSubtractResultDiv, 'Invalid duration input.');
             return;
         }

        let durationTotalSeconds = (days * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds;

        let resultSeconds;
        if (operation === 'add') {
            resultSeconds = startSeconds + durationTotalSeconds;
        } else { // subtract
            resultSeconds = startSeconds - durationTotalSeconds;
        }

        displayResult(addSubtractResultDiv, `Resulting Time: ${formatTime(resultSeconds)}`);
    });

    // Initial state
    durationResultDiv.style.display = 'none';
    addSubtractResultDiv.style.display = 'none';
}); 