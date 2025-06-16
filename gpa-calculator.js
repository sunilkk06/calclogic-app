document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gpa-form');
    const coursesContainer = document.getElementById('courses-container');
    const addCourseBtn = document.getElementById('add-course-btn');
    const resultDisplay = document.getElementById('gpa-result-display');

    // Initialize with one course row
    if (coursesContainer.children.length === 0) {
        addCourseRow();
    }

    // Add Course Row
    function addCourseRow() {
        const courseRow = document.createElement('div');
        courseRow.className = 'course-row form-group-inline';
        courseRow.innerHTML = `
            <input type="text" class="course-name" placeholder="Course Name (Optional)">
            <input type="number" class="course-credits" placeholder="Credits" min="0" step="0.5" required>
            <select class="course-grade" required>
                <option value="" disabled selected>Grade</option>
                <option value="4.0">A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
                <option value="P">P (Pass)</option>
                <option value="NP">NP (No Pass)</option>
            </select>
            <button type="button" class="btn btn-remove-course" title="Remove Course">
                <i class="fas fa-times"></i>
            </button>
        `;

        coursesContainer.appendChild(courseRow);

        // Add event listener to remove button
        const removeBtn = courseRow.querySelector('.btn-remove-course');
        removeBtn.addEventListener('click', function() {
            if (coursesContainer.children.length > 1) {
                courseRow.remove();
            }
        });
    }

    // Add Course Button Click Handler
    addCourseBtn.addEventListener('click', addCourseRow);

    // Calculate GPA
    function calculateGPA(courses) {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {
            if (course.grade !== 'P' && course.grade !== 'NP') {
                totalPoints += (parseFloat(course.grade) * parseFloat(course.credits));
                totalCredits += parseFloat(course.credits);
            }
        });

        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    }

    // Calculate Cumulative GPA
    function calculateCumulativeGPA(semesterGPA, semesterCredits, previousGPA, previousCredits) {
        const prevPoints = previousGPA * previousCredits;
        const semPoints = semesterGPA * semesterCredits;
        const totalCredits = previousCredits + semesterCredits;
        
        return totalCredits > 0 ? ((prevPoints + semPoints) / totalCredits).toFixed(2) : '0.00';
    }

    // Format GPA Display
    function formatGPADisplay(gpa) {
        return parseFloat(gpa).toFixed(2);
    }

    // Update Results Display
    function updateResults(semesterGPA, totalCredits, cumulativeGPA = null, totalCumulativeCredits = null) {
        let html = `
            <div class="result-item">
                <span class="result-label">Semester GPA:</span>
                <span class="result-value main-result">${formatGPADisplay(semesterGPA)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Total Semester Credits:</span>
                <span class="result-value">${totalCredits}</span>
            </div>
        `;

        if (cumulativeGPA !== null && totalCumulativeCredits !== null) {
            html += `
                <div class="result-item highlight" style="margin-top:15px; padding-top: 15px; border-top: 1px dashed #ccc;">
                    <span class="result-label">New Cumulative GPA:</span>
                    <span class="result-value main-result">${formatGPADisplay(cumulativeGPA)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Overall Total Credits:</span>
                    <span class="result-value">${totalCumulativeCredits}</span>
                </div>
            `;
        }

        resultDisplay.innerHTML = html;
    }

    // Form Submit Handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect course data
        const courses = [];
        const courseRows = coursesContainer.querySelectorAll('.course-row');
        let totalSemesterCredits = 0;

        courseRows.forEach(row => {
            const credits = row.querySelector('.course-credits').value;
            const grade = row.querySelector('.course-grade').value;

            if (credits && grade) {
                courses.push({
                    name: row.querySelector('.course-name').value,
                    credits: credits,
                    grade: grade
                });

                if (grade !== 'P' && grade !== 'NP') {
                    totalSemesterCredits += parseFloat(credits);
                }
            }
        });

        // Calculate Semester GPA
        const semesterGPA = calculateGPA(courses);

        // Get previous GPA data
        const previousGPA = parseFloat(document.getElementById('previous-gpa').value) || 0;
        const previousCredits = parseFloat(document.getElementById('previous-credits').value) || 0;

        // Calculate Cumulative GPA if previous data exists
        if (previousGPA > 0 && previousCredits > 0) {
            const cumulativeGPA = calculateCumulativeGPA(
                parseFloat(semesterGPA),
                totalSemesterCredits,
                previousGPA,
                previousCredits
            );
            const totalCumulativeCredits = previousCredits + totalSemesterCredits;
            updateResults(semesterGPA, totalSemesterCredits, cumulativeGPA, totalCumulativeCredits);
        } else {
            updateResults(semesterGPA, totalSemesterCredits);
        }
    });

    // Input Validation
    form.addEventListener('input', function(e) {
        if (e.target.classList.contains('course-credits')) {
            const value = parseFloat(e.target.value);
            if (value < 0) e.target.value = 0;
            if (value > 12) e.target.value = 12; // Max credits per course
        }
        if (e.target.id === 'previous-gpa') {
            const value = parseFloat(e.target.value);
            if (value < 0) e.target.value = 0;
            if (value > 4) e.target.value = 4;
        }
        if (e.target.id === 'previous-credits') {
            const value = parseFloat(e.target.value);
            if (value < 0) e.target.value = 0;
            if (value > 200) e.target.value = 200; // Reasonable max for total credits
        }
    });
}); 