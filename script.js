const calculator = {
    displayValue: '0',
    previousValue: '',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0.";
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);
        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.previousValue = calculator.displayValue;
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    updatePreviousOperand();
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => {
        if (secondOperand === 0) {
            alert("Cannot divide by zero!");
            return firstOperand;
        }
        return firstOperand / secondOperand;
    },
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '%': (firstOperand, secondOperand) => (firstOperand * secondOperand) / 100,
    '=': (firstOperand, secondOperand) => secondOperand
};

function handleFunction(func) {
    switch(func) {
        case '(':
            // Implementation for parentheses can be added here
            break;
        case ')':
            // Implementation for parentheses can be added here
            break;
        case '%':
            if (calculator.displayValue !== '0') {
                const currentValue = parseFloat(calculator.displayValue);
                calculator.displayValue = (currentValue / 100).toString();
            }
            break;
    }
    updateDisplay();
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.previousValue = '';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    updatePreviousOperand();
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function updatePreviousOperand() {
    const previousOperandDisplay = document.querySelector('.previous-operand');
    if (calculator.operator && calculator.previousValue) {
        previousOperandDisplay.textContent = `${calculator.previousValue} ${calculator.operator}`;
    } else {
        previousOperandDisplay.textContent = '';
    }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    let key = event.key;
    
    if (key >= '0' && key <= '9') {
        event.preventDefault();
        inputDigit(key);
    } else if (key === '.') {
        event.preventDefault();
        inputDecimal(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleOperator('=');
    } else if (key === 'Escape') {
        event.preventDefault();
        resetCalculator();
    }
    
    updateDisplay();
});

// Event listeners for buttons
document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('function')) {
        handleFunction(target.value);
        return;
    }

    if (target.classList.contains('equal-sign')) {
        handleOperator('=');
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

// Initialize the display
updateDisplay();
