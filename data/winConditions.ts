import { WinCondition, GameState } from '../types';
import { calculateNetWorth } from '../services/achievementChecker';

/**
 * Helper function to calculate total property value
 */
const calculatePropertyValue = (gameState: GameState): number => {
  let totalValue = 0;
  for (const propertyId in gameState.player.properties) {
    const propertyData = gameState.player.properties[propertyId];
    const property = gameState.properties[propertyId];
    if (property) {
      totalValue += propertyData.currentValue || property.cost;
    }
  }
  return totalValue;
};

/**
 * Win Conditions - Multiple ways to win the game
 *
 * Categories:
 * - Wealth: Net worth milestones
 * - Property: Real estate empire
 * - Trading: Trading volume and profitability
 * - Speed: Time-based challenges
 * - Diversification: Portfolio variety
 * - Era: Historical navigation
 * - Special: Unique accomplishments
 */

export const WIN_CONDITIONS: WinCondition[] = [
  // ============================================
  // WEALTH WIN CONDITIONS
  // ============================================
  {
    id: 'MILLIONAIRE',
    name: '💰 Millionaire',
    description: 'Reach a net worth of $1,000,000',
    category: 'wealth',
    difficulty: 'easy',
    icon: '💰',
    requirement: (gs: GameState) => calculateNetWorth(gs) >= 1_000_000,
    progress: (gs: GameState) => ({
      current: calculateNetWorth(gs),
      target: 1_000_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 5,
      title: 'Millionaire',
      unlocks: ['First major wealth milestone']
    }
  },
  {
    id: 'MULTI_MILLIONAIRE',
    name: '💎 Multi-Millionaire',
    description: 'Reach a net worth of $10,000,000',
    category: 'wealth',
    difficulty: 'medium',
    icon: '💎',
    requirement: (gs: GameState) => calculateNetWorth(gs) >= 10_000_000,
    progress: (gs: GameState) => ({
      current: calculateNetWorth(gs),
      target: 10_000_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 15,
      title: 'Multi-Millionaire',
      unlocks: ['Elite wealth status']
    }
  },
  {
    id: 'TYCOON',
    name: '👑 Tycoon',
    description: 'Reach a net worth of $50,000,000',
    category: 'wealth',
    difficulty: 'hard',
    icon: '👑',
    requirement: (gs: GameState) => calculateNetWorth(gs) >= 50_000_000,
    progress: (gs: GameState) => ({
      current: calculateNetWorth(gs),
      target: 50_000_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 30,
      title: 'Business Tycoon',
      unlocks: ['Ultimate wealth achievement']
    }
  },
  {
    id: 'BILLIONAIRE',
    name: '🌟 Billionaire',
    description: 'Reach a net worth of $1,000,000,000',
    category: 'wealth',
    difficulty: 'legendary',
    icon: '🌟',
    requirement: (gs: GameState) => calculateNetWorth(gs) >= 1_000_000_000,
    progress: (gs: GameState) => ({
      current: calculateNetWorth(gs),
      target: 1_000_000_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 100,
      title: 'Billionaire',
      unlocks: ['Legendary wealth status']
    }
  },

  // ============================================
  // PROPERTY EMPIRE WIN CONDITIONS
  // ============================================
  {
    id: 'REAL_ESTATE_MOGUL',
    name: '🏢 Real Estate Mogul',
    description: 'Own property worth $5,000,000',
    category: 'property',
    difficulty: 'medium',
    icon: '🏢',
    requirement: (gs: GameState) => calculatePropertyValue(gs) >= 5_000_000,
    progress: (gs: GameState) => ({
      current: calculatePropertyValue(gs),
      target: 5_000_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 20,
      title: 'Real Estate Mogul',
      unlocks: ['Property empire established']
    }
  },
  {
    id: 'PROPERTY_BARON',
    name: '🏰 Property Baron',
    description: 'Own 20 or more properties',
    category: 'property',
    difficulty: 'hard',
    icon: '🏰',
    requirement: (gs: GameState) => Object.keys(gs.player.properties).length >= 20,
    progress: (gs: GameState) => ({
      current: Object.keys(gs.player.properties).length,
      target: 20,
      unit: 'properties'
    }),
    reward: {
      prestigePoints: 25,
      title: 'Property Baron',
      unlocks: ['Massive real estate portfolio']
    }
  },

  // ============================================
  // TRADING WIN CONDITIONS
  // ============================================
  {
    id: 'DAY_TRADER',
    name: '📈 Day Trader',
    description: 'Complete 100 profitable trades',
    category: 'trading',
    difficulty: 'easy',
    icon: '📈',
    requirement: (gs: GameState) => gs.player.statistics.profitableTrades >= 100,
    progress: (gs: GameState) => ({
      current: gs.player.statistics.profitableTrades,
      target: 100,
      unit: 'trades'
    }),
    reward: {
      prestigePoints: 10,
      title: 'Day Trader',
      unlocks: ['Trading prowess recognized']
    }
  },
  {
    id: 'TRADING_MASTER',
    name: '🎯 Trading Master',
    description: 'Complete 500 profitable trades',
    category: 'trading',
    difficulty: 'hard',
    icon: '🎯',
    requirement: (gs: GameState) => gs.player.statistics.profitableTrades >= 500,
    progress: (gs: GameState) => ({
      current: gs.player.statistics.profitableTrades,
      target: 500,
      unit: 'trades'
    }),
    reward: {
      prestigePoints: 35,
      title: 'Trading Master',
      unlocks: ['Elite trading status']
    }
  },
  {
    id: 'PROFIT_KING',
    name: '💹 Profit King',
    description: 'Earn $10,000,000 in total trading profit',
    category: 'trading',
    difficulty: 'hard',
    icon: '💹',
    requirement: (gs: GameState) => gs.player.statistics.totalProfit >= 10_000_000,
    progress: (gs: GameState) => ({
      current: gs.player.statistics.totalProfit,
      target: 10_000_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 40,
      title: 'Profit King',
      unlocks: ['Massive trading profits']
    }
  },

  // ============================================
  // SPEED RUN WIN CONDITIONS
  // ============================================
  {
    id: 'SPEED_MILLIONAIRE',
    name: '⚡ Speed Millionaire',
    description: 'Reach $1,000,000 in under 100 turns',
    category: 'speed',
    difficulty: 'medium',
    icon: '⚡',
    requirement: (gs: GameState) => {
      const netWorth = calculateNetWorth(gs);
      return netWorth >= 1_000_000 && gs.gameTurn < 100;
    },
    progress: (gs: GameState) => ({
      current: gs.gameTurn,
      target: 100,
      unit: 'turns'
    }),
    reward: {
      prestigePoints: 25,
      title: 'Speed Millionaire',
      unlocks: ['Lightning-fast wealth building']
    }
  },
  {
    id: 'LIGHTNING_TYCOON',
    name: '⚡💎 Lightning Tycoon',
    description: 'Reach $10,000,000 in under 200 turns',
    category: 'speed',
    difficulty: 'hard',
    icon: '⚡',
    requirement: (gs: GameState) => {
      const netWorth = calculateNetWorth(gs);
      return netWorth >= 10_000_000 && gs.gameTurn < 200;
    },
    progress: (gs: GameState) => ({
      current: gs.gameTurn,
      target: 200,
      unit: 'turns'
    }),
    reward: {
      prestigePoints: 50,
      title: 'Lightning Tycoon',
      unlocks: ['Incredible speed achievement']
    }
  },

  // ============================================
  // DIVERSIFICATION WIN CONDITIONS
  // ============================================
  {
    id: 'DIVERSIFICATION_MASTER',
    name: '🌈 Diversification Master',
    description: 'Own holdings in all commodity categories',
    category: 'diversification',
    difficulty: 'medium',
    icon: '🌈',
    requirement: (gs: GameState) => {
      const categories = new Set<string>();
      for (const commodityId in gs.player.commodities) {
        const commodity = gs.commodities[commodityId];
        if (commodity?.category && gs.player.commodities[commodityId].quantity > 0) {
          categories.add(commodity.category);
        }
      }
      // Check for all categories: agricultural, energy, precious_metal, stock, bond, currency, crypto
      const requiredCategories = ['agricultural', 'energy', 'precious_metal', 'stock', 'bond'];
      return requiredCategories.every(cat => categories.has(cat));
    },
    progress: (gs: GameState) => {
      const categories = new Set<string>();
      for (const commodityId in gs.player.commodities) {
        const commodity = gs.commodities[commodityId];
        if (commodity?.category && gs.player.commodities[commodityId].quantity > 0) {
          categories.add(commodity.category);
        }
      }
      return {
        current: categories.size,
        target: 5,
        unit: 'categories'
      };
    },
    reward: {
      prestigePoints: 20,
      title: 'Diversification Master',
      unlocks: ['Balanced portfolio achievement']
    }
  },
  {
    id: 'BALANCED_INVESTOR',
    name: '⚖️ Balanced Investor',
    description: 'Hold at least $100,000 in stocks, bonds, and real estate simultaneously',
    category: 'diversification',
    difficulty: 'medium',
    icon: '⚖️',
    requirement: (gs: GameState) => {
      let stockValue = 0;
      let bondValue = 0;

      for (const commodityId in gs.player.commodities) {
        const commodity = gs.commodities[commodityId];
        const holding = gs.player.commodities[commodityId];
        if (commodity?.category === 'stock') {
          stockValue += commodity.price * holding.quantity;
        }
        if (commodity?.category === 'bond') {
          bondValue += commodity.price * holding.quantity;
        }
      }

      const propertyValue = calculatePropertyValue(gs);

      return stockValue >= 100_000 && bondValue >= 100_000 && propertyValue >= 100_000;
    },
    progress: (gs: GameState) => {
      let stockValue = 0;
      let bondValue = 0;

      for (const commodityId in gs.player.commodities) {
        const commodity = gs.commodities[commodityId];
        const holding = gs.player.commodities[commodityId];
        if (commodity?.category === 'stock') {
          stockValue += commodity.price * holding.quantity;
        }
        if (commodity?.category === 'bond') {
          bondValue += commodity.price * holding.quantity;
        }
      }

      const propertyValue = calculatePropertyValue(gs);
      const min = Math.min(stockValue, bondValue, propertyValue);

      return {
        current: min,
        target: 100_000,
        unit: '$'
      };
    },
    reward: {
      prestigePoints: 15,
      title: 'Balanced Investor',
      unlocks: ['Diversified investment strategy']
    }
  },

  // ============================================
  // SPECIAL WIN CONDITIONS
  // ============================================
  {
    id: 'REPUTATION_KING',
    name: '⭐ Reputation King',
    description: 'Reach 1000 reputation points',
    category: 'special',
    difficulty: 'hard',
    icon: '⭐',
    requirement: (gs: GameState) => gs.player.reputation >= 1000,
    progress: (gs: GameState) => ({
      current: gs.player.reputation,
      target: 1000,
      unit: 'reputation'
    }),
    reward: {
      prestigePoints: 30,
      title: 'Reputation King',
      unlocks: ['Maximum reputation achieved']
    }
  },
  {
    id: 'ACHIEVEMENT_HUNTER',
    name: '🏆 Achievement Hunter',
    description: 'Unlock 50 achievements',
    category: 'special',
    difficulty: 'hard',
    icon: '🏆',
    requirement: (gs: GameState) => gs.player.achievements.length >= 50,
    progress: (gs: GameState) => ({
      current: gs.player.achievements.length,
      target: 50,
      unit: 'achievements'
    }),
    reward: {
      prestigePoints: 40,
      title: 'Achievement Hunter',
      unlocks: ['Master of all achievements']
    }
  },
  {
    id: 'SKILL_MASTER',
    name: '🎓 Skill Master',
    description: 'Unlock all available skills',
    category: 'special',
    difficulty: 'hard',
    icon: '🎓',
    requirement: (gs: GameState) => {
      const totalSkills = Object.keys(gs.skills).length;
      return gs.player.skills.length >= totalSkills;
    },
    progress: (gs: GameState) => ({
      current: gs.player.skills.length,
      target: Object.keys(gs.skills).length,
      unit: 'skills'
    }),
    reward: {
      prestigePoints: 25,
      title: 'Skill Master',
      unlocks: ['All skills unlocked']
    }
  },
  {
    id: 'DIVIDEND_KING',
    name: '💵 Dividend King',
    description: 'Earn $100,000 in total dividends',
    category: 'special',
    difficulty: 'medium',
    icon: '💵',
    requirement: (gs: GameState) => gs.player.statistics.totalDividendsEarned >= 100_000,
    progress: (gs: GameState) => ({
      current: gs.player.statistics.totalDividendsEarned,
      target: 100_000,
      unit: '$'
    }),
    reward: {
      prestigePoints: 20,
      title: 'Dividend King',
      unlocks: ['Passive income mastery']
    }
  },
];

/**
 * Check all win conditions and return the first one that is completed
 */
export const checkWinConditions = (gameState: GameState): WinCondition | null => {
  // Don't check if game is already won
  if (gameState.gameWon) return null;

  // Check each win condition
  for (const condition of WIN_CONDITIONS) {
    // Skip if already completed
    const progress = gameState.winConditionProgress.find(p => p.conditionId === condition.id);
    if (progress?.completed) continue;

    // Check if requirement is met
    if (condition.requirement(gameState)) {
      return condition;
    }
  }

  return null;
};

/**
 * Get progress for all win conditions
 */
export const getAllWinConditionProgress = (gameState: GameState) => {
  return WIN_CONDITIONS.map(condition => {
    const existing = gameState.winConditionProgress.find(p => p.conditionId === condition.id);
    const progressData = condition.progress(gameState);
    const completed = condition.requirement(gameState);

    return {
      condition,
      progress: progressData,
      completed: existing?.completed || completed,
      completedAtTurn: existing?.completedAtTurn,
      completedDate: existing?.completedDate,
      percentage: Math.min(100, (progressData.current / progressData.target) * 100)
    };
  });
};
