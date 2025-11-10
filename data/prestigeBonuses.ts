import { PrestigeBonus } from '../types';

export const PRESTIGE_BONUSES: PrestigeBonus[] = [
  // STARTING BONUSES
  {
    id: 'STARTING_CAPITAL',
    name: 'Starting Capital',
    description: 'Begin each run with more money',
    cost: 1, // Points per level
    icon: '💰',
    effect: {
      type: 'starting_money',
      value: 1000 // +$1,000 per level
    },
    maxLevel: 10
  },
  {
    id: 'FAMOUS_START',
    name: 'Famous Start',
    description: 'Begin each run with higher reputation',
    cost: 1,
    icon: '⭐',
    effect: {
      type: 'starting_reputation',
      value: 25 // +25 reputation per level
    },
    maxLevel: 10
  },

  // DISCOUNT BONUSES
  {
    id: 'SKILL_MASTER',
    name: 'Skill Master',
    description: 'Reduce skill unlock costs',
    cost: 2,
    icon: '📚',
    effect: {
      type: 'skill_discount',
      value: 10 // 10% discount per level
    },
    maxLevel: 5
  },
  {
    id: 'REAL_ESTATE_EXPERT',
    name: 'Real Estate Expert',
    description: 'Reduce property purchase costs',
    cost: 2,
    icon: '🏠',
    effect: {
      type: 'property_discount',
      value: 10 // 10% discount per level
    },
    maxLevel: 5
  },

  // EARNINGS BONUSES
  {
    id: 'HARD_WORKER',
    name: 'Hard Worker',
    description: 'Increase job earnings',
    cost: 2,
    icon: '💼',
    effect: {
      type: 'job_earnings',
      value: 15 // 15% bonus per level
    },
    maxLevel: 5
  },
  {
    id: 'TRADING_GENIUS',
    name: 'Trading Genius',
    description: 'Increase trading profits',
    cost: 3,
    icon: '📈',
    effect: {
      type: 'trade_bonus',
      value: 10 // 10% bonus per level
    },
    maxLevel: 5
  },

  // SPECIAL BONUSES
  {
    id: 'QUICK_LEARNER',
    name: 'Quick Learner',
    description: 'Unlock achievements faster',
    cost: 3,
    icon: '⚡',
    effect: {
      type: 'unlock_speed',
      value: 20 // 20% faster per level
    },
    maxLevel: 3
  },
  {
    id: 'EVENTFUL_LIFE',
    name: 'Eventful Life',
    description: 'Increase random event frequency',
    cost: 2,
    icon: '🎲',
    effect: {
      type: 'event_frequency',
      value: 25 // 25% more frequent per level
    },
    maxLevel: 3
  }
];

// Calculate prestige points earned from a run
export function calculatePrestigePoints(finalMoney: number, achievementsUnlocked: number, turnsSurvived: number): number {
  let points = 0;

  // Points from money (1 point per $10,000)
  points += Math.floor(finalMoney / 10000);

  // Points from achievements (2 points each)
  points += achievementsUnlocked * 2;

  // Points from survival (1 point per 50 turns)
  points += Math.floor(turnsSurvived / 50);

  // Minimum 1 point for attempting
  return Math.max(1, points);
}

// Get the total cost to level up a bonus from current level to target level
export function getLevelUpCost(bonus: PrestigeBonus, fromLevel: number, toLevel: number): number {
  if (toLevel > bonus.maxLevel) return Infinity;
  if (toLevel <= fromLevel) return 0;

  let totalCost = 0;
  for (let level = fromLevel + 1; level <= toLevel; level++) {
    totalCost += bonus.cost * level; // Cost increases per level
  }
  return totalCost;
}

// Calculate effective bonus value from current level
export function getEffectiveBonus(bonus: PrestigeBonus, currentLevel: number): number {
  return bonus.effect.value * currentLevel;
}
