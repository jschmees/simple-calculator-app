document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    const display = document.getElementById('display');

    function updateDisplay() {
        display.textContent = calculator.displayValue;
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        // If we're waiting for a second operand, reset the display
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        // Add a decimal point if the display doesn't already have one
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

        if (firstOperand === null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                return firstOperand / secondOperand;
            case 'percent':
                return firstOperand * (secondOperand / 100);
            default:
                return secondOperand;
        }
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    function deleteLastDigit() {
        if (calculator.waitingForSecondOperand) return;

        calculator.displayValue = calculator.displayValue.slice(0, -1);
        if (calculator.displayValue === '') {
            calculator.displayValue = '0';
        }
    }

    // Add event listener for calculator keys
    document.querySelector('.calculator-keys').addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        const action = target.dataset.action;
        
        if (!action) return;

        if ('0123456789'.includes(action)) {
            inputDigit(action);
            updateDisplay();
            return;
        }

        if (action === 'decimal') {
            inputDecimal('.');
            updateDisplay();
            return;
        }

        if (['add', 'subtract', 'multiply', 'divide', 'percent'].includes(action)) {
            handleOperator(action);
            updateDisplay();
            return;
        }

        if (action === 'clear') {
            resetCalculator();
            updateDisplay();
            return;
        }

        if (action === 'delete') {
            deleteLastDigit();
            updateDisplay();
            return;
        }

        if (action === 'calculate') {
            if (calculator.firstOperand === null || calculator.operator === null) return;
            
            handleOperator('=');
            updateDisplay();
            return;
        }
    });
});