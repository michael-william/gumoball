/**
 * GumboBall Manager Page Client
 * WebSocket client for game control and dice submission
 */

// Connect to Socket.io server
const socket = io();

// DOM elements
const startGameBtn = document.getElementById('startGameBtn');
const endGameBtn = document.getElementById('endGameBtn');
const enterBtn = document.getElementById('enterBtn');
const diceItems = document.querySelectorAll('.dice-item');
const selectedDie1El = document.getElementById('selectedDie1');
const selectedDie2El = document.getElementById('selectedDie2');
const selectedSumEl = document.getElementById('selectedSum');
const feedbackFlash = document.getElementById('feedbackFlash');

// Status display elements
const statusElements = {
    streak: document.getElementById('statusStreak'),
    gumboStep: document.getElementById('statusGumboStep'),
    gumboTimes: document.getElementById('statusGumboTimes'),
    throwCount: document.getElementById('statusThrowCount')
};

// Selected dice state (stores { value: number, element: HTMLElement })
let selectedDice = {
    die1: null,
    die2: null
};

// Initialize dice selector
diceItems.forEach(item => {
    item.addEventListener('click', () => {
        const value = parseInt(item.dataset.value);
        handleDieSelection(value, item);
    });
});

// Handle die selection logic
function handleDieSelection(value, element) {
    const selection = { value, element };

    // State machine for selection
    if (selectedDice.die1 === null) {
        // State 0: No dice selected -> Set Die 1
        selectedDice.die1 = selection;
    } else if (selectedDice.die2 === null) {
        // State 1: Die 1 selected -> Set Die 2
        selectedDice.die2 = selection;
    } else {
        // State 2: Both selected -> Overwrite Die 1 with new selection, Clear Die 2
        selectedDice.die1 = selection;
        selectedDice.die2 = null;
    }

    updateVisuals();
    updateSelectedDisplay();
    updateEnterButton();
}

// Update visual selection state
function updateVisuals() {
    // Clear all selections first
    diceItems.forEach(item => {
        item.classList.remove('selected');
    });

    // Apply selection to current state
    if (selectedDice.die1) {
        selectedDice.die1.element.classList.add('selected');
    }
    if (selectedDice.die2) {
        selectedDice.die2.element.classList.add('selected');
    }
}

// Update selected display
function updateSelectedDisplay() {
    const val1 = selectedDice.die1 ? selectedDice.die1.value : null;
    const val2 = selectedDice.die2 ? selectedDice.die2.value : null;

    selectedDie1El.textContent = val1 !== null ? val1 : '-';
    selectedDie2El.textContent = val2 !== null ? val2 : '-';

    if (val1 !== null && val2 !== null) {
        const sum = val1 + val2;
        selectedSumEl.textContent = sum;
        selectedSumEl.style.color = sum === 7 ? '#ff0000' : 'rgb(255, 227, 59)';
    } else {
        selectedSumEl.textContent = '-';
        selectedSumEl.style.color = 'rgb(255, 227, 59)';
    }
}

// Update enter button state
function updateEnterButton() {
    enterBtn.disabled = selectedDice.die1 === null || selectedDice.die2 === null;
}

// Clear selection
function clearSelection() {
    selectedDice.die1 = null;
    selectedDice.die2 = null;
    updateVisuals();
    updateSelectedDisplay();
    updateEnterButton();
}

// Start new game
startGameBtn.addEventListener('click', () => {
    socket.emit('START_GAME');
    clearSelection();
});

// End game
endGameBtn.addEventListener('click', () => {
    socket.emit('END_GAME');
});

// Submit dice
enterBtn.addEventListener('click', () => {
    if (selectedDice.die1 !== null && selectedDice.die2 !== null) {
        socket.emit('SUBMIT_DICE', {
            die1: selectedDice.die1.value,
            die2: selectedDice.die2.value
        });
    }
});

// Handle dice accepted
socket.on('DICE_ACCEPTED', (data) => {
    console.log('Dice accepted:', data);

    // Show feedback flash
    if (data.rolledSeven) {
        showFeedback('seven');
    } else {
        showFeedback('success');
    }

    // Clear selection
    clearSelection();
});

// Show feedback flash
function showFeedback(type) {
    feedbackFlash.classList.add(type);
    setTimeout(() => {
        feedbackFlash.classList.remove(type);
    }, 500);
}

// Handle state updates
socket.on('STATE_UPDATE', (state) => {
    console.log('State updated:', state);
    updateStatus(state);
});

// Update status display
function updateStatus(state) {
    statusElements.streak.textContent = state.streak;
    statusElements.gumboStep.textContent = state.gumboStep;
    statusElements.gumboTimes.textContent = state.gumboTimes;
    statusElements.throwCount.textContent = state.throwCount;
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
    alert('Error: ' + data.message);
});
