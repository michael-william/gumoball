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
    sevenOutFlash: document.getElementById('sevenOutFlash')
};

let previousState = null;

// Handle state updates
socket.on('STATE_UPDATE', (state) => {
    console.log('State updated:', state);
    updateDisplay(state);

    // Check if a seven was just rolled
    if (previousState && previousState.gumboStep > 0 && state.gumboStep === 0 && state.streak === 0) {
        flashSevenOut();
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
    elements.sevenOutFlash.classList.add('active');
    setTimeout(() => {
        elements.sevenOutFlash.classList.remove('active');
    }, 500);
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
