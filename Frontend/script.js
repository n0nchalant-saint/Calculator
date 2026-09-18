// ===============================
// GET ELEMENTS
// ===============================
let display = document.getElementById('display');
let historyList = document.getElementById('history-list');

// Load history from localStorage
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];


// ===============================
// SHOW HISTORY WHEN PAGE LOADS
// ===============================
window.onload = function () {
    showHistory();
};


// ===============================
// HELPER: DEGREES TO RADIANS
// ===============================
function toRadians(deg) {
    return deg * Math.PI / 180;
}


// ===============================
// BASIC BUTTONS
// ===============================

// Add a value to the display
function append(value) {
    display.value += value;
}


// Clear display
function clearDisplay() {
    display.value = '';
}


// Delete the last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}


// ===============================
// MAIN CALCULATE FUNCTION
// ===============================
function calculate() {
    try {
        let originalExpression = display.value;

    let expression = display.value.replace(/\^/g, '**');
    expression = expression.replace(/π/g, 'Math.PI');

    let result = eval(expression);

    let match = originalExpression.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*\/^])\s*(-?\d+(?:\.\d+)?)$/);

    if (match) {
        let num1 = Number(match[1]);
        let operator = match[2];
        let num2 = Number(match[3]);

      fetch('https://calculator-8wts.onrender.com/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                num1: num1,
                num2: num2,
                operator: operator,
                value: 0
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Backend response:", data);
        })
        .catch(error => {
            console.log("Backend connection error:", error);
        });
    }

    let historyItem = originalExpression + ' = ' + result;

    history.push(historyItem);

    localStorage.setItem(
        'calcHistory',
        JSON.stringify(history)
    );

    display.value = result;

    showHistory();

} catch (error) {
    display.value = 'Error';
}
}


// ===============================
// SCIENTIFIC FUNCTIONS
// ===============================

// Sine
function sin() {
let input = display.value;
let result = Math.sin(toRadians(input));

if (Math.abs(result) < 1e-10) {
result = 0;
}

if (Math.abs(result - 0.5) < 1e-10) {
result = 0.5;
}

display.value = result;
saveToHistory('sin(' + input + ') = ' + result);
}


// Cosine
function cos() {
let input = display.value;
let result = Math.cos(toRadians(input));

if (Math.abs(result - 0.5) < 1e-10) {
result = 0.5;
}

display.value = result;
saveToHistory('cos(' + input + ') = ' + result);
}


// Tangent
function tan() {
let input = display.value;
let result = Math.tan(toRadians(input));

if (Math.abs(result - 1) < 1e-10) {
result = 1;
}

display.value = result;
saveToHistory('tan(' + input + ') = ' + result);
}


// Square root
function sqrt() {
    let input = display.value;
    let result = Math.sqrt(Number(input));

    display.value = result;

    saveToHistory('√(' + input + ') = ' + result);
}


// Power
function power() {
    display.value += '^';
}


// Pi
function pi() {
    display.value += 'π';
}


// ===============================
// HISTORY
// ===============================

// Save item to history
function saveToHistory(item) {
    history.push(item);

    localStorage.setItem(
        'calcHistory',
        JSON.stringify(history)
    );

    showHistory();
}


// Show history
function showHistory() {
    if (!historyList) return;

    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<p>No history yet</p>';
        return;
    }

    // Show newest first
    [...history].reverse().forEach(function (item) {
        let div = document.createElement('div');

        div.className = 'history-item';

        div.textContent = item;

        historyList.appendChild(div);
    });
}


// ===============================
// HISTORY OVERLAY
// ===============================

// Open history
function openHistory() {
    document.getElementById('history-overlay').style.display = 'block';

    showHistory();
}


// Close history
function closeHistory() {
    document.getElementById('history-overlay').style.display = 'none';
}


// Clear history
function clearHistory() {
    history = [];

    localStorage.removeItem('calcHistory');

    showHistory();
}
