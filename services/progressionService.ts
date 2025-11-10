import { GameState, Milestone, WinCondition, LogEntry } from '../types';
import { TIER_REQUIREMENTS, TIER_NAMES } from '../constants';
import { createLog } from './gameLogic';

/**
 * Check for newly completed milestones
 * Returns array of milestones that are completed but not yet claimed
 */
export function checkMilestones(gameState: GameState): Milestone[] {
  const newlyCompleted: Milestone[] = [];

  Object.values(gameState.milestones).forEach(milestone => {
    // Skip if already claimed
    if (gameState.player.progress.claimedMilestones.includes(milestone.id)) {
      return;
    }

    // Check if requirement is met
    if (milestone.requirement(gameState)) {
      // Only add if not already in completed list
      if (!gameState.player.progress.completedMilestones.includes(milestone.id)) {
        newlyCompleted.push(milestone);
      }
    }
  });

  return newlyCompleted;
}

/**
 * Claim a milestone reward
 */
export function claimMilestone(
  gameState: GameState,
  milestoneId: string
): { gameState: Partial<GameState>; logs: LogEntry[] } {
  const milestone = gameState.milestones[milestoneId];
  if (!milestone) {
    return { gameState: {}, logs: [] };
  }

  // Check if already claimed
  if (gameState.player.progress.claimedMilestones.includes(milestoneId)) {
    return { gameState: {}, logs: [createLog('Milestone already claimed!', 'warning')] };
  }

  // Check if requirement is met
  if (!milestone.requirement(gameState)) {
    return { gameState: {}, logs: [createLog('Milestone requirements not met!', 'error')] };
  }

  const logs: LogEntry[] = [];
  let moneyGained = 0;
  let reputationGained = 0;

  // Apply rewards
  if (milestone.reward.money) {
    moneyGained = milestone.reward.money;
  }

  if (milestone.reward.reputation) {
    reputationGained = milestone.reward.reputation;
  }

  // Log reward
  logs.push(createLog(
    `🎉 Claimed milestone: ${milestone.name}! Earned $${moneyGained.toLocaleString()} and ${reputationGained} reputation`,
    'success'
  ));

  // Update player progress
  const updatedProgress = {
    ...gameState.player.progress,
    completedMilestones: [...gameState.player.progress.completedMilestones, milestoneId],
    claimedMilestones: [...gameState.player.progress.claimedMilestones, milestoneId]
  };

  const updatedPlayer = {
    ...gameState.player,
    money: gameState.player.money + moneyGained,
    reputation: gameState.player.reputation + reputationGained,
    progress: updatedProgress
  };

  return {
    gameState: { player: updatedPlayer },
    logs
  };
}

/**
 * Calculate current tier and progress
 */
export function calculateTierProgress(gameState: GameState): {
  currentTier: number;
  progress: number;
  nextTierRequirements: { netWorth: number; milestones: number } | null;
} {
  const netWorth = calculateNetWorth(gameState);
  const milestonesCompleted = gameState.player.progress.claimedMilestones.length;

  let currentTier = 0;
  
  // Find current tier
  for (let i = TIER_REQUIREMENTS.length - 1; i >= 0; i--) {
    const req = TIER_REQUIREMENTS[i];
    if (netWorth >= req.netWorth && milestonesCompleted >= req.milestones) {
      currentTier = i;
      break;
    }
  }

  // Calculate progress to next tier
  let progress = 100; // Default if at max tier
  let nextTierRequirements = null;

  if (currentTier < TIER_REQUIREMENTS.length - 1) {
    const currentReq = TIER_REQUIREMENTS[currentTier];
    const nextReq = TIER_REQUIREMENTS[currentTier + 1];
    nextTierRequirements = nextReq;

    // Calculate progress as percentage between current and next tier
    const netWorthProgress = Math.min(
      ((netWorth - currentReq.netWorth) / (nextReq.netWorth - currentReq.netWorth)) * 100,
      100
    );
    const milestoneProgress = Math.min(
      ((milestonesCompleted - currentReq.milestones) / (nextReq.milestones - currentReq.milestones)) * 100,
      100
    );

    // Take the minimum of both to ensure both requirements are met
    progress = Math.min(netWorthProgress, milestoneProgress);
  }

  return {
    currentTier,
    progress: Math.max(0, Math.min(progress, 100)),
    nextTierRequirements
  };
}

/**
 * Update tier in game state and return logs if tier changed
 */
export function updateTier(gameState: GameState): { gameState: Partial<GameState>; logs: LogEntry[] } {
  const { currentTier, progress } = calculateTierProgress(gameState);
  const logs: LogEntry[] = [];

  // Check if tier changed
  if (currentTier > gameState.player.progress.currentTier) {
    logs.push(createLog(
      `🎊 Tier Up! You've advanced to ${TIER_NAMES[currentTier]} tier!`,
      'success'
    ));
  }

  const updatedProgress = {
    ...gameState.player.progress,
    currentTier,
    tierProgress: progress
  };

  return {
    gameState: {
      player: {
        ...gameState.player,
        progress: updatedProgress
      }
    },
    logs
  };
}

/**
 * Check for win conditions
 */
export function checkWinConditions(gameState: GameState): WinCondition | null {
  // Skip if already achieved victory
  if (gameState.victoryAchieved) {
    return null;
  }

  // Check all win conditions
  for (const condition of Object.values(gameState.winConditions)) {
    if (condition.checkCompleted(gameState)) {
      return condition;
    }
  }

  return null;
}

/**
 * Calculate net worth helper
 */
export function calculateNetWorth(gameState: GameState): number {
  let total = gameState.player.money;
  
  // Add commodity values
  Object.entries(gameState.player.commodities).forEach(([id, holding]) => {
    const commodity = gameState.commodities[id];
    if (commodity && !commodity.isBankrupt) {
      total += holding.quantity * commodity.price;
    }
  });
  
  // Add property values
  gameState.player.properties.forEach(propId => {
    const property = gameState.properties[propId];
    if (property) {
      total += property.cost;
    }
  });
  
  return total;
}

/**
 * Update highest net worth in player progress
 */
export function updateHighestNetWorth(gameState: GameState): Partial<GameState> {
  const currentNetWorth = calculateNetWorth(gameState);
  
  if (currentNetWorth > gameState.player.progress.highestNetWorth) {
    return {
      player: {
        ...gameState.player,
        progress: {
          ...gameState.player.progress,
          highestNetWorth: currentNetWorth
        }
      }
    };
  }

  return {};
}

/**
 * Track trading stats update
 */
export function updateTradingStats(
  gameState: GameState,
  profit: number,
  isProfitable: boolean
): Partial<GameState> {
  return {
    player: {
      ...gameState.player,
      tradingStats: {
        ...gameState.player.tradingStats,
        totalTrades: gameState.player.tradingStats.totalTrades + 1,
        profitableTrades: gameState.player.tradingStats.profitableTrades + (isProfitable ? 1 : 0),
        totalProfit: gameState.player.tradingStats.totalProfit + profit
      }
    }
  };
}

/**
 * Track dividend payment
 */
export function addDividendPayment(gameState: GameState, amount: number): Partial<GameState> {
  return {
    player: {
      ...gameState.player,
      tradingStats: {
        ...gameState.player.tradingStats,
        totalDividends: gameState.player.tradingStats.totalDividends + amount
      }
    }
  };
}
