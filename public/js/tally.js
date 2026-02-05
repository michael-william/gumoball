/**
 * GumboBall Tally Page Client
 * WebSocket client for real-time game state updates
 */

// Connect to Socket.io server
const socket = io();

// DOM elements
const elements = {
    streak: document.getElementById('streak'),
    gumboStep: document.getElementById('gumboStep'),
    gumboTimes: document.getElementById('gumboTimes'),
    throwCount: document.getElementById('throwCount'),
    hardPercent: document.getElementById('hardPercent'),
    avgStreak: document.getElementById('avgStreak'),
    maxGumboSlams: document.getElementById('maxGumboSlams'),
    stepRoux: document.getElementById('stepRoux'),
    step2nd: document.getElementById('step2nd'),
    step3rd: document.getElementById('step3rd'),
    step4th: document.getElementById('step4th'),
    sevenOutFlash: document.getElementById('sevenOutFlash'),
    // Grid Tiles
    gumboTimeLeft: document.querySelector('.gumbo-time-left'),
    gumboTimeRight: document.querySelector('.gumbo-time-right'),
    snakeEyes: document.querySelector('.snake-eyes'),
    hardFour: document.querySelector('.hard-four'),
    hardSix: document.querySelector('.hard-six'),
    twoOrFive: document.querySelector('.two-or-five'),
    threeOrFour: document.querySelector('.three-or-four'),
    six: document.querySelector('.six'),
    sevenOut: document.querySelector('.seven-out'),
    hardEight: document.querySelector('.hard-eight'),
    hardTen: document.querySelector('.hard-ten'),
    boxCars: document.querySelector('.box-cars'),
    eight: document.querySelector('.eight'),
    tenOrEleven: document.querySelector('.ten-or-eleven'),
    nineOrTwelve: document.querySelector('.nine-or-twelve')
};

let previousState = null;

// Handle state updates
socket.on('STATE_UPDATE', (state) => {
    console.log('State updated:', state);
    updateDisplay(state);

    if (previousState) {
        // Check for Gumbo Time Achievement (count increased)
        if (state.gumboTimes > previousState.gumboTimes) {
            flashGumboTime();
        }

        // Check for New Dice Roll (throw count increased)
        if (state.throwCount > previousState.throwCount) {
            const lastRoll = state.diceRolls[state.diceRolls.length - 1];
            if (lastRoll) {
                highlightDiceRoll(lastRoll.die1, lastRoll.die2);
            }
        }

        // Check if a seven was just rolled (flash overlay)
        if (previousState.gumboStep > 0 && state.gumboStep === 0 && state.streak === 0) {
            flashSevenOut();
        }
    }

    previousState = { ...state };
});

// Update display with new state
function updateDisplay(state) {
    // Update stat values
    if (elements.streak) elements.streak.textContent = state.streak;
    if (elements.gumboStep) elements.gumboStep.textContent = state.gumboStep;
    if (elements.gumboTimes) elements.gumboTimes.textContent = state.gumboTimes;
    if (elements.throwCount) elements.throwCount.textContent = state.throwCount;
    if (elements.hardPercent) elements.hardPercent.textContent = state.hardPercent;
    if (elements.avgStreak) elements.avgStreak.textContent = state.avgStreak;
    if (elements.maxGumboSlams) elements.maxGumboSlams.textContent = state.maxGumboSlams;

    // Update step highlighting (cumulative)
    updateStepHighlighting(state.gumboStep);
}

// Update step box highlighting
function updateStepHighlighting(gumboStep) {
    // Clear all highlights
    if (elements.stepRoux) elements.stepRoux.classList.remove('highlighted');
    if (elements.step2nd) elements.step2nd.classList.remove('highlighted');
    if (elements.step3rd) elements.step3rd.classList.remove('highlighted');
    if (elements.step4th) elements.step4th.classList.remove('highlighted');

    // Apply cumulative highlighting
    if (gumboStep >= 1 && elements.stepRoux) {
        elements.stepRoux.classList.add('highlighted');
    }
    if (gumboStep >= 2 && elements.step2nd) {
        elements.step2nd.classList.add('highlighted');
    }
    if (gumboStep >= 3 && elements.step3rd) {
        elements.step3rd.classList.add('highlighted');
    }
    if (gumboStep >= 4 && elements.step4th) {
        elements.step4th.classList.add('highlighted');
    }
}

// Flash the "SEVEN OUT" area
function flashSevenOut() {
    if (elements.sevenOutFlash) {
        elements.sevenOutFlash.classList.add('active');
        setTimeout(() => {
            elements.sevenOutFlash.classList.remove('active');
        }, 500);
    }
}

// Flash Gumbo Time (Tiles + Steps)
function flashGumboTime() {
    const flashElements = [
        elements.gumboTimeLeft,
        elements.gumboTimeRight,
        elements.stepRoux,
        elements.step2nd,
        elements.step3rd,
        elements.step4th
    ];

    flashElements.forEach(el => {
        if (el) {
            el.classList.add('gumbo-time-flash');
            // Remove class after animation completes (1.5s = 0.5s * 3)
            setTimeout(() => {
                el.classList.remove('gumbo-time-flash');
            }, 1500);
        }
    });
}

// Highlight tiles based on dice roll
function highlightDiceRoll(die1, die2) {
    const sum = die1 + die2;
    const tilesToHighlight = [];

    // Helper to add if exists
    const addFn = (el) => { if (el) tilesToHighlight.push(el); };

    // Standard Value Tiles
    if (sum === 2 || sum === 5) addFn(elements.twoOrFive);
    if (sum === 3 || sum === 4) addFn(elements.threeOrFour);
    if (sum === 6) addFn(elements.six);
    if (sum === 8) addFn(elements.eight);
    if (sum === 9 || sum === 12) addFn(elements.nineOrTwelve);
    if (sum === 10 || sum === 11) addFn(elements.tenOrEleven);

    // Hard Ways / Special Tiles
    if (die1 === die2) { // Pairs
        if (sum === 2) addFn(elements.snakeEyes);
        if (sum === 4) addFn(elements.hardFour);
        if (sum === 6) addFn(elements.hardSix);
        if (sum === 8) addFn(elements.hardEight);
        if (sum === 10) addFn(elements.hardTen);
        if (sum === 12) addFn(elements.boxCars);
    }

    // Apply Highlight
    tilesToHighlight.forEach(el => {
        // Reset animation if already present (by removing and re-adding)
        el.classList.remove('highlight-temp');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('highlight-temp');

        // Remove after 10 seconds
        setTimeout(() => {
            el.classList.remove('highlight-temp');
        }, 10000);
    });

    // Special case for seven
    if (sum === 7 && elements.sevenOut) {
        elements.sevenOut.classList.remove('highlight-temp-bad');
        void elements.sevenOut.offsetWidth; // Trigger reflow
        elements.sevenOut.classList.add('highlight-temp-bad');

        setTimeout(() => {
            elements.sevenOut.classList.remove('highlight-temp-bad');
        }, 10000);
    }
}

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('ERROR', (data) => {
    console.error('Server error:', data.message);
});
