document.addEventListener('DOMContentLoaded', function() {
    const expression = document.getElementById('expression');
    const result = document.getElementById('result');
    const historyList = document.getElementById('history-list');
    const modeBtns = document.querySelectorAll('.mode-btn');
    
    let currentMode = 'rad';
    let memory = 0;
    let currentExpression = '';
    let lastResult = 0;
    let isNewCalculation = true;

    // Constants
    const PI = Math.PI;
    const E = Math.E;

    // Initialize calculator
    function init() {
        attachEventListeners();
        updateDisplay();
    }

    // Attach event listeners to all buttons
    function attachEventListeners() {
        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', () => handleButtonClick(button));
        });

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => switchMode(btn.dataset.mode));
        });

        // Add keyboard support
        document.addEventListener('keydown', handleKeyPress);
    }

    // Handle button clicks
    function handleButtonClick(button) {
        const action = button.dataset.action;
        const buttonText = button.textContent;

        if (button.classList.contains('number')) {
            appendNumber(buttonText);
        } else if (button.classList.contains('operator')) {
            handleOperator(action);
        } else if (button.classList.contains('function')) {
            handleFunction(action);
        } else if (button.classList.contains('memory')) {
            handleMemory(action);
        }

        updateDisplay();
    }

    // Handle keyboard input
    function handleKeyPress(e) {
        const key = e.key;
        
        if (/[0-9.]/.test(key)) {
            appendNumber(key);
        } else if (['+', '-', '*', '/', '=', 'Enter'].includes(key)) {
            e.preventDefault();
            handleOperator(key);
        } else if (key === 'Backspace') {
            handleOperator('backspace');
        } else if (key === 'Escape') {
            handleOperator('clear');
        }

        updateDisplay();
    }

    // Append number to expression
    function appendNumber(num) {
        if (isNewCalculation) {
            currentExpression = '';
            isNewCalculation = false;
        }
        currentExpression += num;
    }

    // Handle operators
    function handleOperator(action) {
        switch(action) {
            case 'clear':
                currentExpression = '';
                lastResult = 0;
                break;
            case 'backspace':
                currentExpression = currentExpression.slice(0, -1);
                break;
            case 'equals':
                calculate();
                break;
            case 'add':
                currentExpression += '+';
                break;
            case 'subtract':
                currentExpression += '-';
                break;
            case 'multiply':
                currentExpression += '*';
                break;
            case 'divide':
                currentExpression += '/';
                break;
        }
    }

    // Handle scientific functions
    function handleFunction(action) {
        switch(action) {
            case 'sin':
                applyFunction('sin');
                break;
            case 'cos':
                applyFunction('cos');
                break;
            case 'tan':
                applyFunction('tan');
                break;
            case 'sin-1':
                applyFunction('asin');
                break;
            case 'cos-1':
                applyFunction('acos');
                break;
            case 'tan-1':
                applyFunction('atan');
                break;
            case 'log':
                applyFunction('log10');
                break;
            case 'ln':
                applyFunction('log');
                break;
            case 'square':
                currentExpression += '^2';
                break;
            case 'sqrt':
                applyFunction('sqrt');
                break;
            case 'power':
                currentExpression += '^';
                break;
            case 'pi':
                currentExpression += 'π';
                break;
            case 'e':
                currentExpression += 'e';
                break;
        }
    }

    // Apply mathematical function
    function applyFunction(func) {
        if (isNewCalculation) {
            currentExpression = '';
            isNewCalculation = false;
        }
        currentExpression = `${func}(${currentExpression})`;
    }

    // Handle memory operations
    function handleMemory(action) {
        switch(action) {
            case 'mc':
                memory = 0;
                break;
            case 'mr':
                currentExpression = memory.toString();
                break;
            case 'm-plus':
                memory += parseFloat(lastResult);
                break;
            case 'm-minus':
                memory -= parseFloat(lastResult);
                break;
            case 'ms':
                memory = parseFloat(lastResult);
                break;
        }
    }

    // Switch between RAD/DEG/GRAD modes
    function switchMode(mode) {
        currentMode = mode;
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }

    // Calculate the result
    function calculate() {
        try {
            let expr = currentExpression
                .replace(/π/g, Math.PI)
                .replace(/e/g, Math.E)
                .replace(/\^/g, '**')
                .replace(/√/g, 'Math.sqrt');

            // Handle trigonometric functions based on mode
            if (currentMode !== 'rad') {
                expr = convertTrigExpression(expr);
            }

            lastResult = eval(expr);
            
            // Add to history
            addToHistory(currentExpression, lastResult);
            
            currentExpression = lastResult.toString();
            isNewCalculation = true;
        } catch (error) {
            lastResult = 'Error';
            currentExpression = '';
        }
    }

    // Convert trigonometric expressions based on mode
    function convertTrigExpression(expr) {
        const conversion = currentMode === 'deg' ? Math.PI / 180 : Math.PI / 200;
        
        expr = expr.replace(/sin\((.*?)\)/g, (match, p1) => `Math.sin(${p1} * ${conversion})`);
        expr = expr.replace(/cos\((.*?)\)/g, (match, p1) => `Math.cos(${p1} * ${conversion})`);
        expr = expr.replace(/tan\((.*?)\)/g, (match, p1) => `Math.tan(${p1} * ${conversion})`);
        
        return expr;
    }

    // Add calculation to history
    function addToHistory(expr, res) {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <div class="history-expression">${expr}</div>
            <div class="history-result">${formatResult(res)}</div>
        `;
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Limit history items
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    // Format result for display
    function formatResult(value) {
        if (typeof value !== 'number') return value;
        
        if (Math.abs(value) < 0.000001 || Math.abs(value) > 999999999) {
            return value.toExponential(6);
        }
        
        return Number(value.toPrecision(10)).toString();
    }

    // Update the display
    function updateDisplay() {
        expression.textContent = currentExpression || '0';
        result.textContent = lastResult || '0';
    }

    // Initialize the calculator
    init();
}); 