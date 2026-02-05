# GumboBall Game Documentation

## Game Overview

GumboBall is a dice game where players try to avoid rolling a sum of 7. The goal is to achieve consecutive successful rolls (non-7s) to earn "Gumbo Times" and build up streaks.

## Game Rules

### Basic Gameplay
1. Players roll two dice and enter the values
2. If the sum of the dice **does NOT equal 7**: the roll is successful
3. If the sum **equals 7**: the current round ends (but the game continues)
4. After **4 consecutive successful rolls**, the player earns 1 "Gumbo Time"
5. The game continues until the user presses "End Game"

### Winning Condition
There is no traditional "win" condition. Players aim to:
- Maximize their total "Gumbo Times" earned
- Achieve the longest streak of successful rolls
- Build the highest "Gumbo Slam" (most Gumbo Times before rolling a 7)

### Rolling a Seven
When a 7 is rolled:
- The current **streak** resets to 0
- The current **gumbo step** resets to 0
- The **gumbo times** count is NOT reset (it's cumulative for the entire game)
- Play continues immediately (it's not game over)

## Game Variables

### Core Variables

| Variable | Type | Definition |
|----------|------|------------|
| **`streak`** | number | Current number of consecutive successful rolls (not 7). Resets to 0 after rolling a 7. |
| **`gumboStep`** | number | Current progress toward earning the next Gumbo Time (0-4). After reaching 4, increments `gumboTimes` and resets to 0. |
| **`gumboTimes`** | number | Total number of "Gumbo Times" earned in the current game. Incremented by 1 each time player reaches 4 successful rolls in a row. |
| **`throwCount`** | number | Total number of dice throws since the game started. |
| **`diceRolls`** | array | Array of all `{die1, die2}` pairs entered during the game. Format: `[{die1: 3, die2: 5}, ...]` |
| **`gameActive`** | boolean | Whether a game is currently in progress. |

### Calculated Analytics

| Variable | Type | Calculation |
|----------|------|-------------|
| **`hardPercent`** | number | Percentage of throws where both dice had the same value. Formula: `(hard throws / throwCount) × 100` |
| **`maxGumboSlams`** | number | Maximum `gumboTimes` reached before rolling a 7 (i.e., the highest gumbo streak achieved in the game). |
| **`avgStreak`** | number | Average number of successful throws before rolling a 7. Calculated from the history of all streaks in the game. |

## Game Logic

### Starting a New Game
When "Start New Game" is pressed:
```javascript
streak = 0
gumboStep = 0
gumboTimes = 0
throwCount = 0
diceRolls = []
hardPercent = 0
maxGumboSlams = 0
avgStreak = 0
gameActive = true
```

### Processing a Dice Roll
When dice are submitted:
1. Increment `throwCount`
2. Add `{die1, die2}` to `diceRolls` array
3. Calculate sum: `sum = die1 + die2`
4. **If sum ≠ 7** (successful roll):
   - Increment `streak`
   - Increment `gumboStep`
   - If `gumboStep` reaches 4:
     - Increment `gumboTimes`
     - Reset `gumboStep` to 0
     - Update `maxGumboSlams` if current `gumboTimes` > `maxGumboSlams`
5. **If sum = 7** (failed roll):
   - Reset `streak` to 0
   - Reset `gumboStep` to 0
   - Record this streak in history for `avgStreak` calculation
6. Recalculate analytics:
   - Update `hardPercent`
   - Update `avgStreak`

### Ending a Game
When "End Game" is pressed:
- Set `gameActive = false`
- All stats remain visible
- No further dice rolls accepted until "Start New Game"

## Analytics Formulas

### Hard Percentage
```javascript
hardPercent = (diceRolls.filter(roll => roll.die1 === roll.die2).length / throwCount) × 100
```

### Average Streak
Track all streaks that ended with a 7:
```javascript
avgStreak = sum(all_streaks) / number_of_sevens_rolled
```

### Max Gumbo Slams
Track the highest `gumboTimes` value reached before any 7 was rolled:
```javascript
maxGumboSlams = Math.max(...gumboTimesBeforeEachSeven)
```

## Tally Page Display

The Tally page displays the following analytics in real-time:

1. **Streak**: Current consecutive successful rolls
2. **Gumbo Step**: Visual progress (0-4) with cumulative highlighting:
   - Step 0: Nothing highlighted
   - Step 1: "ROUX" box highlighted green
   - Step 2: "2ND" box highlighted green
   - Step 3: "3RD" box highlighted green
   - Step 4: "4TH" box highlighted green
3. **Gumbo Times**: Total Gumbo Times earned
4. **Throw Count**: Total throws in the game
5. **Hard %**: Percentage of "hard" throws (doubles)
6. **Max Gumbo Slams**: Highest Gumbo Times before rolling a 7
7. **Avg. Streak**: Average throws before rolling a 7

## Manager Page (Game Control)

### Interface Elements
- **Start New Game** button: Resets all stats and begins a new game
- **End Game** button: Stops the current game
- **Dice Selector**: 2 columns × 3 rows
  - Left column: 1, 3, 5 (top to bottom)
  - Right column: 2, 4, 6 (top to bottom)
  - User taps one from each column
  - Selected dice are highlighted
- **Enter** button: Submits the selected dice values
  - Selection clears automatically after submit
  - Brief green flash confirms successful entry

## Visual Design

### Color Scheme
- **Background**: Purple/mauve `rgb(165, 110, 148)`
- **Primary Text**: Yellow `rgb(255, 227, 59)`
- **Highlight**: Green (for step progress and success feedback)
- **Alert**: Red (optional, for "SEVEN OUT" flash)

### Fonts
- **Titles**: Phosphate-Inline
- **Stats/Numbers**: Futura-Bold

### Background
The Tally page uses `GumboBall Tally.svg` as the main background image with analytics overlaid on top.

## Technical Notes

### Real-Time Updates
- Both pages connect via WebSocket
- Manager page sends dice submissions to server
- Server updates game state
- Server broadcasts state updates to all connected clients
- Tally page updates immediately without page refresh

### Deployment
- Runs on LXC container on Proxmox
- Accessible on local network
- Tally page optimized for TV display (cast from browser)
- Manager page optimized for iPad touch interface