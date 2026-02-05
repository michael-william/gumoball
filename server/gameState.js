/**
 * Game State Management for GumboBall
 */

class GameState {
  constructor() {
    this.reset();
    this.streakHistory = []; // Track all streaks that ended with a 7
  }

  reset() {
    this.streak = 0;
    this.gumboStep = 0;
    this.gumboTimes = 0;
    this.throwCount = 0;
    this.diceRolls = [];
    this.hardPercent = 0;
    this.maxGumboSlams = 0;
    this.avgStreak = 0;
    this.gameActive = true;
    this.streakHistory = [];
  }

  processDiceRoll(die1, die2) {
    if (!this.gameActive) {
      throw new Error('Game is not active');
    }

    // Validate dice values
    if (die1 < 1 || die1 > 6 || die2 < 1 || die2 > 6) {
      throw new Error('Invalid dice values');
    }

    // Increment throw count
    this.throwCount++;

    // Add to dice rolls history
    this.diceRolls.push({ die1, die2 });

    // Calculate sum
    const sum = die1 + die2;

    // Process the roll
    if (sum !== 7) {
      // Successful roll
      this.streak++;
      this.gumboStep++;

      // Check if we reached 4 steps (earned a Gumbo Time)
      if (this.gumboStep === 4) {
        this.gumboTimes++;
        this.gumboStep = 0;

        // Update max gumbo slams if this is a new record
        if (this.gumboTimes > this.maxGumboSlams) {
          this.maxGumboSlams = this.gumboTimes;
        }
      }
    } else {
      // Rolled a 7 - end of round
      // Record the streak before resetting
      if (this.streak > 0) {
        this.streakHistory.push(this.streak);
      }

      // Reset for new round
      this.streak = 0;
      this.gumboStep = 0;
      this.gumboTimes = 0;
    }

    // Recalculate analytics
    this.calculateAnalytics();

    return {
      sum,
      rolledSeven: sum === 7,
      state: this.getState()
    };
  }

  calculateAnalytics() {
    // Calculate hard percentage (both dice same value)
    const hardRolls = this.diceRolls.filter(roll => roll.die1 === roll.die2).length;
    this.hardPercent = this.throwCount > 0
      ? Math.round((hardRolls / this.throwCount) * 100)
      : 0;

    // Calculate average streak
    if (this.streakHistory.length > 0) {
      const totalStreaks = this.streakHistory.reduce((sum, streak) => sum + streak, 0);
      this.avgStreak = Math.round(totalStreaks / this.streakHistory.length);
    } else {
      this.avgStreak = 0;
    }
  }

  endGame() {
    this.gameActive = false;
  }

  getState() {
    return {
      streak: this.streak,
      gumboStep: this.gumboStep,
      gumboTimes: this.gumboTimes,
      throwCount: this.throwCount,
      diceRolls: this.diceRolls,
      hardPercent: this.hardPercent,
      maxGumboSlams: this.maxGumboSlams,
      avgStreak: this.avgStreak,
      gameActive: this.gameActive
    };
  }
}

module.exports = GameState;
