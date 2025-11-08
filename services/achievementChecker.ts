import { GameState, Achievement, UnlockedAchievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

/**
 * Checks all achievements and returns newly unlocked ones
 */
export function checkAchievements(gameState: GameState): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    const alreadyUnlocked = gameState.player.achievements.some(
      a => a.achievementId === achievement.id
    );

    if (alreadyUnlocked) continue;

    // Check if requirements are met
    try {
      if (achievement.requirement(gameState)) {
        newlyUnlocked.push(achievement);
      }
    } catch (error) {
      console.warn(`Error checking achievement ${achievement.id}:`, error);
    }
  }

  return newlyUnlocked;
}

/**
 * Awards an achievement to the player
 */
export function awardAchievement(
  gameState: GameState,
  achievement: Achievement
): GameState {
  const unlockData: UnlockedAchievement = {
    achievementId: achievement.id,
    unlockedAtTurn: gameState.gameTurn,
    unlockedDate: gameState.currentDate
  };

  const updatedPlayer = {
    ...gameState.player,
    achievements: [...gameState.player.achievements, unlockData],
    money: gameState.player.money + (achievement.reward?.money || 0),
    reputation: gameState.player.reputation + (achievement.reward?.reputation || 0)
  };

  return {
    ...gameState,
    player: updatedPlayer,
    newAchievementUnlocked: achievement
  };
}

/**
 * Updates player statistics after an action
 */
export function updateStatistics(
  gameState: GameState,
  updates: Partial<GameState['player']['statistics']>
): GameState {
  const currentStats = gameState.player.statistics;

  return {
    ...gameState,
    player: {
      ...gameState.player,
      statistics: {
        ...currentStats,
        ...updates
      }
    }
  };
}

/**
 * Tracks a trade in statistics
 */
export function recordTrade(
  gameState: GameState,
  profit: number,
  isProfitable: boolean
): GameState {
  const stats = gameState.player.statistics;

  const updates = {
    totalTrades: stats.totalTrades + 1,
    profitableTrades: stats.profitableTrades + (isProfitable ? 1 : 0),
    totalProfit: stats.totalProfit + (isProfitable ? profit : 0),
    totalLoss: stats.totalLoss + (!isProfitable ? profit : 0),
    biggestWin: Math.max(stats.biggestWin, isProfitable ? profit : 0),
    biggestLoss: Math.min(stats.biggestLoss, !isProfitable ? profit : 0)
  };

  return updateStatistics(gameState, updates);
}

/**
 * Tracks a job completion in statistics
 */
export function recordJobCompletion(gameState: GameState): GameState {
  return updateStatistics(gameState, {
    jobsCompleted: gameState.player.statistics.jobsCompleted + 1
  });
}

/**
 * Tracks a gambling result in statistics
 */
export function recordGambling(
  gameState: GameState,
  winnings: number
): GameState {
  const stats = gameState.player.statistics;

  if (winnings > 0) {
    return updateStatistics(gameState, {
      totalGamblingWins: stats.totalGamblingWins + winnings
    });
  } else {
    return updateStatistics(gameState, {
      totalGamblingLosses: stats.totalGamblingLosses + Math.abs(winnings)
    });
  }
}

/**
 * Tracks a property purchase in statistics
 */
export function recordPropertyPurchase(gameState: GameState): GameState {
  return updateStatistics(gameState, {
    propertiesPurchased: gameState.player.statistics.propertiesPurchased + 1
  });
}

/**
 * Tracks a skill unlock in statistics
 */
export function recordSkillUnlock(gameState: GameState): GameState {
  return updateStatistics(gameState, {
    skillsUnlocked: gameState.player.statistics.skillsUnlocked + 1
  });
}

/**
 * Updates peak net worth if current is higher
 */
export function updatePeakNetWorth(gameState: GameState, currentNetWorth: number): GameState {
  const stats = gameState.player.statistics;

  if (currentNetWorth > stats.peakNetWorth) {
    return updateStatistics(gameState, {
      peakNetWorth: currentNetWorth
    });
  }

  return gameState;
}

/**
 * Helper to calculate current net worth
 */
export function calculateNetWorth(gameState: GameState): number {
  let netWorth = gameState.player.money;

  // Add property values
  Object.keys(gameState.player.properties).forEach(propId => {
    const property = gameState.properties[propId];
    if (property) {
      netWorth += property.cost;
    }
  });

  // Add commodity values
  Object.keys(gameState.player.commodities).forEach(commId => {
    const commodity = gameState.commodities[commId];
    const playerComm = gameState.player.commodities[commId];
    if (commodity && playerComm) {
      netWorth += commodity.price * playerComm.quantity;
    }
  });

  return netWorth;
}
