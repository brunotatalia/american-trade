import { ReputationTier, Milestone, GameState } from '../types';
import * as AchievementService from '../services/achievementChecker';

// Reputation Tiers - Define social status and unlock gates
export const REPUTATION_TIERS: ReputationTier[] = [
  {
    id: 'UNKNOWN',
    name: 'Unknown',
    minReputation: 0,
    maxReputation: 49,
    description: 'Nobody knows who you are. You\'re just starting out.',
    icon: '👤',
    color: 'text-gray-400',
    unlocks: ['Basic jobs', 'Starter properties', 'Common skills']
  },
  {
    id: 'NOTICED',
    name: 'Noticed',
    minReputation: 50,
    maxReputation: 149,
    description: 'People are starting to recognize your name in business circles.',
    icon: '👁️',
    color: 'text-blue-400',
    unlocks: ['Intermediate jobs', 'Better properties', 'Advanced skills']
  },
  {
    id: 'KNOWN',
    name: 'Known',
    minReputation: 150,
    maxReputation: 299,
    description: 'You have a solid reputation in your community.',
    icon: '⭐',
    color: 'text-green-400',
    unlocks: ['Professional jobs', 'Quality properties', 'Expert skills']
  },
  {
    id: 'RESPECTED',
    name: 'Respected',
    minReputation: 300,
    maxReputation: 599,
    description: 'Business leaders respect your opinion and expertise.',
    icon: '🎖️',
    color: 'text-purple-400',
    unlocks: ['Executive jobs', 'Luxury properties', 'Master skills', 'Elite opportunities']
  },
  {
    id: 'FAMOUS',
    name: 'Famous',
    minReputation: 600,
    maxReputation: 999,
    description: 'You\'re a household name in the business world.',
    icon: '🌟',
    color: 'text-yellow-400',
    unlocks: ['C-Suite positions', 'Premium estates', 'Legendary skills', 'Investment clubs']
  },
  {
    id: 'RENOWNED',
    name: 'Renowned',
    minReputation: 1000,
    maxReputation: 1999,
    description: 'Your name appears in financial magazines and news.',
    icon: '💫',
    color: 'text-orange-400',
    unlocks: ['Industry leader roles', 'Exclusive properties', 'Secret opportunities']
  },
  {
    id: 'LEGENDARY',
    name: 'Legendary',
    minReputation: 2000,
    maxReputation: Infinity,
    description: 'You\'re a legend in American business history.',
    icon: '👑',
    color: 'text-gold-500',
    unlocks: ['Everything unlocked', 'Special events', 'Historical recognition']
  }
];

// Milestones - Concrete goals with rewards
export const MILESTONES: Milestone[] = [
  // Wealth Milestones
  {
    id: 'FIRST_THOUSAND',
    name: 'First Thousand',
    description: 'Accumulate $1,000 in cash',
    category: 'wealth',
    requirement: (gs) => gs.player.money >= 1000,
    reward: { reputation: 5 },
    icon: '💵',
    order: 1
  },
  {
    id: 'FIVE_GRAND',
    name: 'Five Grand',
    description: 'Reach $5,000 in cash',
    category: 'wealth',
    requirement: (gs) => gs.player.money >= 5000,
    reward: { reputation: 10, unlocks: ['Intermediate properties'] },
    icon: '💰',
    order: 2
  },
  {
    id: 'TEN_K_NET_WORTH',
    name: 'Five Figures',
    description: 'Achieve $10,000 net worth',
    category: 'wealth',
    requirement: (gs) => AchievementService.calculateNetWorth(gs) >= 10000,
    reward: { reputation: 15, unlocks: ['Professional jobs'] },
    icon: '📊',
    order: 3
  },
  {
    id: 'FIFTY_K_NET_WORTH',
    name: 'Growing Wealth',
    description: 'Achieve $50,000 net worth',
    category: 'wealth',
    requirement: (gs) => AchievementService.calculateNetWorth(gs) >= 50000,
    reward: { reputation: 25, unlocks: ['Luxury properties'] },
    icon: '💎',
    order: 4
  },
  {
    id: 'HUNDRED_K_NET_WORTH',
    name: 'Six Figures',
    description: 'Achieve $100,000 net worth',
    category: 'wealth',
    requirement: (gs) => AchievementService.calculateNetWorth(gs) >= 100000,
    reward: { reputation: 50, money: 5000, unlocks: ['Elite investments'] },
    icon: '💰',
    order: 5
  },
  {
    id: 'HALF_MILLION',
    name: 'Half Millionaire',
    description: 'Achieve $500,000 net worth',
    category: 'wealth',
    requirement: (gs) => AchievementService.calculateNetWorth(gs) >= 500000,
    reward: { reputation: 100, money: 25000, unlocks: ['Premium estates', 'Investment clubs'] },
    icon: '🏆',
    order: 6
  },
  {
    id: 'MILLIONAIRE',
    name: 'Millionaire Status',
    description: 'Achieve $1,000,000 net worth',
    category: 'wealth',
    requirement: (gs) => AchievementService.calculateNetWorth(gs) >= 1000000,
    reward: { reputation: 200, money: 50000, unlocks: ['Everything'] },
    icon: '👑',
    order: 7
  },

  // Property Milestones
  {
    id: 'FIRST_PROPERTY',
    name: 'Homeowner',
    description: 'Purchase your first property',
    category: 'property',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 1,
    reward: { reputation: 10 },
    icon: '🏠',
    order: 10
  },
  {
    id: 'THREE_PROPERTIES',
    name: 'Investor',
    description: 'Own 3 properties',
    category: 'property',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 3,
    reward: { reputation: 20, money: 1000 },
    icon: '🏘️',
    order: 11
  },
  {
    id: 'FIVE_PROPERTIES',
    name: 'Landlord',
    description: 'Own 5 properties',
    category: 'property',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 5,
    reward: { reputation: 30, money: 2500, unlocks: ['Commercial properties'] },
    icon: '🏢',
    order: 12
  },
  {
    id: 'TEN_PROPERTIES',
    name: 'Real Estate Mogul',
    description: 'Own 10 properties',
    category: 'property',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 10,
    reward: { reputation: 50, money: 10000, unlocks: ['Industrial properties'] },
    icon: '🏭',
    order: 13
  },

  // Trading Milestones
  {
    id: 'FIRST_TRADE',
    name: 'First Trade',
    description: 'Complete your first commodity trade',
    category: 'trading',
    requirement: (gs) => gs.player.statistics.totalTrades >= 1,
    reward: { reputation: 5 },
    icon: '📈',
    order: 20
  },
  {
    id: 'PROFITABLE_TRADER',
    name: 'Profitable Trader',
    description: 'Make $5,000 profit from trading',
    category: 'trading',
    requirement: (gs) => gs.player.statistics.totalProfit >= 5000,
    reward: { reputation: 20, unlocks: ['Advanced trading'] },
    icon: '💹',
    order: 21
  },
  {
    id: 'DAY_TRADER',
    name: 'Day Trader',
    description: 'Complete 50 trades',
    category: 'trading',
    requirement: (gs) => gs.player.statistics.totalTrades >= 50,
    reward: { reputation: 30, unlocks: ['Options trading'] },
    icon: '⚡',
    order: 22
  },
  {
    id: 'TRADING_EXPERT',
    name: 'Trading Expert',
    description: 'Make $50,000 profit from trading',
    category: 'trading',
    requirement: (gs) => gs.player.statistics.totalProfit >= 50000,
    reward: { reputation: 50, money: 5000, unlocks: ['Leverage trading'] },
    icon: '🎯',
    order: 23
  },

  // Career Milestones
  {
    id: 'FIRST_JOB',
    name: 'Employed',
    description: 'Complete your first job',
    category: 'career',
    requirement: (gs) => gs.player.statistics.jobsCompleted >= 1,
    reward: { reputation: 5 },
    icon: '💼',
    order: 30
  },
  {
    id: 'TEN_JOBS',
    name: 'Hard Worker',
    description: 'Complete 10 jobs',
    category: 'career',
    requirement: (gs) => gs.player.statistics.jobsCompleted >= 10,
    reward: { reputation: 15, money: 500 },
    icon: '⚙️',
    order: 31
  },
  {
    id: 'CAREER_EARNINGS',
    name: 'Career Success',
    description: 'Earn $10,000 from jobs',
    category: 'career',
    requirement: (gs) => {
      const totalJobEarnings = Object.values(gs.player.jobPerformance)
        .reduce((sum, perf) => sum + perf.totalEarnings, 0);
      return totalJobEarnings >= 10000;
    },
    reward: { reputation: 25, unlocks: ['Management positions'] },
    icon: '📈',
    order: 32
  },

  // Skills Milestones
  {
    id: 'FIRST_SKILL',
    name: 'Student',
    description: 'Unlock your first skill',
    category: 'skills',
    requirement: (gs) => gs.player.skills.length >= 1,
    reward: { reputation: 5 },
    icon: '📚',
    order: 40
  },
  {
    id: 'FIVE_SKILLS',
    name: 'Skilled Professional',
    description: 'Unlock 5 skills',
    category: 'skills',
    requirement: (gs) => gs.player.skills.length >= 5,
    reward: { reputation: 20, money: 1000 },
    icon: '🎓',
    order: 41
  },
  {
    id: 'TEN_SKILLS',
    name: 'Expert',
    description: 'Unlock 10 skills',
    category: 'skills',
    requirement: (gs) => gs.player.skills.length >= 10,
    reward: { reputation: 40, money: 5000, unlocks: ['Master skills'] },
    icon: '🏅',
    order: 42
  },

  // Reputation Milestones
  {
    id: 'REPUTATION_100',
    name: 'Getting Known',
    description: 'Reach 100 reputation',
    category: 'reputation',
    requirement: (gs) => gs.player.reputation >= 100,
    reward: { money: 1000 },
    icon: '⭐',
    order: 50
  },
  {
    id: 'REPUTATION_500',
    name: 'Respected',
    description: 'Reach 500 reputation',
    category: 'reputation',
    requirement: (gs) => gs.player.reputation >= 500,
    reward: { money: 10000, unlocks: ['Elite opportunities'] },
    icon: '🌟',
    order: 51
  },
  {
    id: 'REPUTATION_1000',
    name: 'Famous',
    description: 'Reach 1000 reputation',
    category: 'reputation',
    requirement: (gs) => gs.player.reputation >= 1000,
    reward: { money: 50000, unlocks: ['Legendary status'] },
    icon: '💫',
    order: 52
  },

  // Special Milestones
  {
    id: 'SURVIVOR_50',
    name: 'Survivor',
    description: 'Survive 50 turns',
    category: 'special',
    requirement: (gs) => gs.gameTurn >= 50,
    reward: { reputation: 10, money: 1000 },
    icon: '🎖️',
    order: 60
  },
  {
    id: 'VETERAN_100',
    name: 'Veteran',
    description: 'Survive 100 turns',
    category: 'special',
    requirement: (gs) => gs.gameTurn >= 100,
    reward: { reputation: 25, money: 5000 },
    icon: '🏆',
    order: 61
  },
  {
    id: 'LEGEND_200',
    name: 'Living Legend',
    description: 'Survive 200 turns',
    category: 'special',
    requirement: (gs) => gs.gameTurn >= 200,
    reward: { reputation: 100, money: 25000 },
    icon: '👑',
    order: 62
  }
];

// Helper Functions
export function getReputationTier(reputation: number): ReputationTier {
  return REPUTATION_TIERS.find(
    tier => reputation >= tier.minReputation && reputation <= tier.maxReputation
  ) || REPUTATION_TIERS[0];
}

export function getNextReputationTier(reputation: number): ReputationTier | null {
  const currentIndex = REPUTATION_TIERS.findIndex(
    tier => reputation >= tier.minReputation && reputation <= tier.maxReputation
  );

  if (currentIndex === -1 || currentIndex === REPUTATION_TIERS.length - 1) {
    return null;
  }

  return REPUTATION_TIERS[currentIndex + 1];
}

export function getReputationProgress(reputation: number): number {
  const tier = getReputationTier(reputation);
  const tierRange = tier.maxReputation - tier.minReputation;
  const progressInTier = reputation - tier.minReputation;
  return Math.min(100, (progressInTier / tierRange) * 100);
}

export function getMilestonesByCategory(category: Milestone['category']): Milestone[] {
  return MILESTONES.filter(m => m.category === category).sort((a, b) => a.order - b.order);
}

export function getNextMilestones(gameState: GameState, count: number = 3): Milestone[] {
  const unlocked = gameState.player.progressionData?.unlockedMilestones || [];
  return MILESTONES
    .filter(m => !unlocked.includes(m.id) && !m.requirement(gameState))
    .sort((a, b) => a.order - b.order)
    .slice(0, count);
}

export function checkNewMilestones(gameState: GameState): Milestone[] {
  const unlocked = gameState.player.progressionData?.unlockedMilestones || [];
  return MILESTONES.filter(m => !unlocked.includes(m.id) && m.requirement(gameState));
}
