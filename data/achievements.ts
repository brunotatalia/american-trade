import { Achievement, GameState } from '../types';

// Helper functions for achievement requirements
const getNetWorth = (gs: GameState): number => {
  let netWorth = gs.player.money;

  // Add property values
  Object.keys(gs.player.properties).forEach(propId => {
    const property = gs.properties[propId];
    if (property) {
      netWorth += property.cost;
    }
  });

  // Add commodity values
  Object.keys(gs.player.commodities).forEach(commId => {
    const commodity = gs.commodities[commId];
    const playerComm = gs.player.commodities[commId];
    if (commodity && playerComm) {
      netWorth += commodity.price * playerComm.quantity;
    }
  });

  return netWorth;
};

export const ACHIEVEMENTS: Achievement[] = [
  // WEALTH ACHIEVEMENTS
  {
    id: 'FIRST_THOUSAND',
    name: 'First Thousand',
    description: 'Accumulate $1,000 in cash',
    category: 'wealth',
    icon: '💵',
    rarity: 'common',
    requirement: (gs) => gs.player.money >= 1000,
    reward: { reputation: 5 }
  },
  {
    id: 'TEN_GRAND',
    name: 'Ten Grand',
    description: 'Reach $10,000 in cash',
    category: 'wealth',
    icon: '💰',
    rarity: 'common',
    requirement: (gs) => gs.player.money >= 10000,
    reward: { reputation: 10 }
  },
  {
    id: 'SIX_FIGURES',
    name: 'Six Figures',
    description: 'Accumulate $100,000 in cash',
    category: 'wealth',
    icon: '💎',
    rarity: 'rare',
    requirement: (gs) => gs.player.money >= 100000,
    reward: { money: 5000, reputation: 25 }
  },
  {
    id: 'MILLIONAIRE',
    name: 'Millionaire',
    description: 'Become a millionaire! Reach $1,000,000',
    category: 'wealth',
    icon: '🏆',
    rarity: 'epic',
    requirement: (gs) => gs.player.money >= 1000000,
    reward: { money: 50000, reputation: 100 }
  },
  {
    id: 'MULTI_MILLIONAIRE',
    name: 'Multi-Millionaire',
    description: 'Accumulate $10,000,000',
    category: 'wealth',
    icon: '👑',
    rarity: 'legendary',
    requirement: (gs) => gs.player.money >= 10000000,
    reward: { money: 100000, reputation: 500 }
  },
  {
    id: 'NET_WORTH_KING',
    name: 'Net Worth King',
    description: 'Reach $5,000,000 total net worth',
    category: 'wealth',
    icon: '🌟',
    rarity: 'epic',
    requirement: (gs) => getNetWorth(gs) >= 5000000,
    reward: { money: 25000, reputation: 150 }
  },

  // TRADING ACHIEVEMENTS
  {
    id: 'FIRST_TRADE',
    name: 'First Trade',
    description: 'Complete your first buy transaction',
    category: 'trading',
    icon: '📈',
    rarity: 'common',
    requirement: (gs) => (gs.player.statistics?.totalTrades || 0) >= 1,
    reward: { reputation: 5 }
  },
  {
    id: 'DAY_TRADER',
    name: 'Day Trader',
    description: 'Complete 50 trades',
    category: 'trading',
    icon: '📊',
    rarity: 'common',
    requirement: (gs) => (gs.player.statistics?.totalTrades || 0) >= 50,
    reward: { money: 1000, reputation: 15 }
  },
  {
    id: 'WALL_STREET_WOLF',
    name: 'Wall Street Wolf',
    description: 'Complete 500 trades',
    category: 'trading',
    icon: '🐺',
    rarity: 'epic',
    requirement: (gs) => (gs.player.statistics?.totalTrades || 0) >= 500,
    reward: { money: 10000, reputation: 50 }
  },
  {
    id: 'BULL_RUN',
    name: 'Bull Run',
    description: 'Make 10 profitable trades in a row',
    category: 'trading',
    icon: '🐂',
    rarity: 'rare',
    requirement: (gs) => false, // Will be tracked separately with streak logic
    reward: { money: 5000, reputation: 30 }
  },
  {
    id: 'BIG_WIN',
    name: 'Big Win',
    description: 'Make $50,000 profit in a single trade',
    category: 'trading',
    icon: '💥',
    rarity: 'rare',
    requirement: (gs) => (gs.player.statistics?.biggestWin || 0) >= 50000,
    reward: { money: 5000, reputation: 25 }
  },
  {
    id: 'CRASH_SURVIVOR',
    name: 'Market Crash Survivor',
    description: 'Lose $10,000 in a single trade but recover to profit',
    category: 'trading',
    icon: '🛡️',
    rarity: 'rare',
    secret: true,
    requirement: (gs) => (gs.player.statistics?.biggestLoss || 0) <= -10000 && (gs.player.statistics?.totalProfit || 0) > 0,
    reward: { money: 3000, reputation: 40 }
  },
  {
    id: 'PROFIT_MASTER',
    name: 'Profit Master',
    description: 'Have a 75% win rate over 100 trades',
    category: 'trading',
    icon: '🎯',
    rarity: 'epic',
    requirement: (gs) => {
      const stats = gs.player.statistics;
      if (!stats || stats.totalTrades < 100) return false;
      return (stats.profitableTrades / stats.totalTrades) >= 0.75;
    },
    reward: { money: 15000, reputation: 75 }
  },

  // PROPERTY ACHIEVEMENTS
  {
    id: 'HOMEOWNER',
    name: 'Homeowner',
    description: 'Purchase your first property',
    category: 'property',
    icon: '🏠',
    rarity: 'common',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 1,
    reward: { reputation: 10 }
  },
  {
    id: 'LANDLORD',
    name: 'Landlord',
    description: 'Own 5 properties',
    category: 'property',
    icon: '🏘️',
    rarity: 'rare',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 5,
    reward: { money: 5000, reputation: 25 }
  },
  {
    id: 'REAL_ESTATE_MOGUL',
    name: 'Real Estate Mogul',
    description: 'Own 10 properties',
    category: 'property',
    icon: '🏙️',
    rarity: 'epic',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 10,
    reward: { money: 20000, reputation: 75 }
  },
  {
    id: 'PROPERTY_EMPIRE',
    name: 'Property Empire',
    description: 'Own 20 properties',
    category: 'property',
    icon: '🌆',
    rarity: 'legendary',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 20,
    reward: { money: 50000, reputation: 200 }
  },

  // SKILLS ACHIEVEMENTS
  {
    id: 'FIRST_SKILL',
    name: 'Self Improvement',
    description: 'Unlock your first skill',
    category: 'skills',
    icon: '📚',
    rarity: 'common',
    requirement: (gs) => gs.player.skills.length >= 1,
    reward: { reputation: 10 }
  },
  {
    id: 'JACK_OF_ALL_TRADES',
    name: 'Jack of All Trades',
    description: 'Unlock 10 skills',
    category: 'skills',
    icon: '🎓',
    rarity: 'rare',
    requirement: (gs) => gs.player.skills.length >= 10,
    reward: { money: 5000, reputation: 30 }
  },
  {
    id: 'MASTER_OF_ALL',
    name: 'Master of All',
    description: 'Unlock 20 skills',
    category: 'skills',
    icon: '🧠',
    rarity: 'epic',
    requirement: (gs) => gs.player.skills.length >= 20,
    reward: { money: 15000, reputation: 100 }
  },
  {
    id: 'RENAISSANCE_PERSON',
    name: 'Renaissance Person',
    description: 'Unlock all available skills',
    category: 'skills',
    icon: '🌟',
    rarity: 'legendary',
    requirement: (gs) => {
      const availableSkills = gs.currentEra?.availableSkills || [];
      return gs.player.skills.length >= availableSkills.length && availableSkills.length > 0;
    },
    reward: { money: 50000, reputation: 250 }
  },

  // JOB ACHIEVEMENTS
  {
    id: 'FIRST_JOB',
    name: 'Employment',
    description: 'Complete your first job shift',
    category: 'jobs',
    icon: '👔',
    rarity: 'common',
    requirement: (gs) => (gs.player.statistics?.jobsCompleted || 0) >= 1,
    reward: { reputation: 5 }
  },
  {
    id: 'HARD_WORKER',
    name: 'Hard Worker',
    description: 'Complete 50 job shifts',
    category: 'jobs',
    icon: '💪',
    rarity: 'common',
    requirement: (gs) => (gs.player.statistics?.jobsCompleted || 0) >= 50,
    reward: { money: 2000, reputation: 20 }
  },
  {
    id: 'WORKAHOLIC',
    name: 'Workaholic',
    description: 'Complete 200 job shifts',
    category: 'jobs',
    icon: '⚡',
    rarity: 'rare',
    requirement: (gs) => (gs.player.statistics?.jobsCompleted || 0) >= 200,
    reward: { money: 10000, reputation: 50 }
  },
  {
    id: 'JOB_HOPPER',
    name: 'Job Hopper',
    description: 'Work 10 different jobs',
    category: 'jobs',
    icon: '🔄',
    rarity: 'rare',
    requirement: (gs) => Object.keys(gs.player.jobPerformance).length >= 10,
    reward: { money: 5000, reputation: 35 }
  },
  {
    id: 'CAREER_CLIMBER',
    name: 'Career Climber',
    description: 'Earn $100,000 total from jobs',
    category: 'jobs',
    icon: '📈',
    rarity: 'epic',
    requirement: (gs) => {
      const totalJobEarnings = Object.values(gs.player.jobPerformance).reduce(
        (sum, perf) => sum + perf.totalEarnings, 0
      );
      return totalJobEarnings >= 100000;
    },
    reward: { money: 10000, reputation: 60 }
  },

  // GAMBLING ACHIEVEMENTS
  {
    id: 'FIRST_BET',
    name: 'Lucky Start',
    description: 'Win your first gambling game',
    category: 'gambling',
    icon: '🎰',
    rarity: 'common',
    requirement: (gs) => (gs.player.statistics?.totalGamblingWins || 0) >= 1,
    reward: { money: 100, reputation: 5 }
  },
  {
    id: 'HIGH_ROLLER',
    name: 'High Roller',
    description: 'Win $10,000 from gambling',
    category: 'gambling',
    icon: '🎲',
    rarity: 'rare',
    requirement: (gs) => (gs.player.statistics?.totalGamblingWins || 0) >= 10000,
    reward: { money: 5000, reputation: 20 }
  },
  {
    id: 'CASINO_KING',
    name: 'Casino King',
    description: 'Win $100,000 from gambling',
    category: 'gambling',
    icon: '👑',
    rarity: 'legendary',
    requirement: (gs) => (gs.player.statistics?.totalGamblingWins || 0) >= 100000,
    reward: { money: 25000, reputation: 100 }
  },
  {
    id: 'GAMBLING_PROBLEM',
    name: 'Gambling Problem',
    description: 'Lose $50,000 from gambling',
    category: 'gambling',
    icon: '😰',
    rarity: 'rare',
    secret: true,
    requirement: (gs) => (gs.player.statistics?.totalGamblingLosses || 0) >= 50000,
    reward: { reputation: 10 }
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: 'RAGS_TO_RICHES',
    name: 'Rags to Riches',
    description: 'Go from less than $100 to over $1,000,000',
    category: 'special',
    icon: '⭐',
    rarity: 'epic',
    secret: true,
    requirement: (gs) => {
      // This would need special tracking - simplified for now
      return gs.player.money >= 1000000;
    },
    reward: { money: 50000, reputation: 150 }
  },
  {
    id: 'SPEED_RUNNER',
    name: 'Speed Runner',
    description: 'Reach $1,000,000 in under 200 turns',
    category: 'special',
    icon: '⚡',
    rarity: 'legendary',
    secret: true,
    requirement: (gs) => gs.player.money >= 1000000 && gs.gameTurn < 200,
    reward: { money: 100000, reputation: 300 }
  },
  {
    id: 'SURVIVOR',
    name: 'Survivor',
    description: 'Survive 1000 turns',
    category: 'special',
    icon: '🎖️',
    rarity: 'epic',
    requirement: (gs) => gs.gameTurn >= 1000,
    reward: { money: 25000, reputation: 100 }
  },
  {
    id: 'REPUTATION_STAR',
    name: 'Reputation Star',
    description: 'Reach 500 reputation',
    category: 'special',
    icon: '⭐',
    rarity: 'epic',
    requirement: (gs) => gs.player.reputation >= 500,
    reward: { money: 20000 }
  },
  {
    id: 'PERFECT_TIMING',
    name: 'Perfect Timing',
    description: 'Buy low and sell high for $25,000+ profit in a single commodity',
    category: 'special',
    icon: '🎯',
    rarity: 'epic',
    secret: true,
    requirement: (gs) => (gs.player.statistics?.biggestWin || 0) >= 25000,
    reward: { money: 10000, reputation: 50 }
  },
  {
    id: 'DIVERSIFIED',
    name: 'Diversified Portfolio',
    description: 'Own at least 5 different commodities, 3 properties, and 5 skills',
    category: 'special',
    icon: '🎨',
    rarity: 'rare',
    requirement: (gs) => {
      const commoditiesOwned = Object.keys(gs.player.commodities).filter(
        id => gs.player.commodities[id].quantity > 0
      ).length;
      const propertiesOwned = Object.keys(gs.player.properties).length;
      const skillsOwned = gs.player.skills.length;
      return commoditiesOwned >= 5 && propertiesOwned >= 3 && skillsOwned >= 5;
    },
    reward: { money: 10000, reputation: 40 }
  },
  {
    id: 'ACHIEVEMENT_HUNTER',
    name: 'Achievement Hunter',
    description: 'Unlock 15 achievements',
    category: 'special',
    icon: '🏅',
    rarity: 'epic',
    requirement: (gs) => gs.player.achievements.length >= 15,
    reward: { money: 15000, reputation: 75 }
  },
  {
    id: 'COMPLETIONIST',
    name: 'Completionist',
    description: 'Unlock all non-secret achievements',
    category: 'special',
    icon: '💯',
    rarity: 'legendary',
    requirement: (gs) => {
      const nonSecretAchievements = gs.achievements.filter(a => !a.secret);
      return gs.player.achievements.length >= nonSecretAchievements.length;
    },
    reward: { money: 100000, reputation: 500 }
  },

  // ADDITIONAL TRADING ACHIEVEMENTS
  {
    id: 'SPEED_TRADER',
    name: 'Speed Trader',
    description: 'Complete 20 trades in a single turn',
    category: 'trading',
    icon: '⚡',
    rarity: 'rare',
    requirement: (gs) => (gs.player.statistics?.totalTrades || 0) >= 20,
    reward: { money: 5000, reputation: 25 }
  },
  {
    id: 'CONSISTENT_TRADER',
    name: 'Consistent Trader',
    description: 'Make 50 profitable trades with zero losses',
    category: 'trading',
    icon: '📊',
    rarity: 'epic',
    secret: true,
    requirement: (gs) => {
      const stats = gs.player.statistics;
      if (!stats) return false;
      return stats.profitableTrades >= 50 && stats.totalTrades === stats.profitableTrades;
    },
    reward: { money: 20000, reputation: 100 }
  },
  {
    id: 'RECOVERY_MASTER',
    name: 'Recovery Master',
    description: 'Recover from a $10,000 loss to make a profit',
    category: 'trading',
    icon: '🔄',
    rarity: 'rare',
    requirement: (gs) => (gs.player.statistics?.biggestLoss || 0) >= 10000 && (gs.player.statistics?.totalProfit || 0) > 0,
    reward: { money: 7500, reputation: 40 }
  },

  // ADDITIONAL WEALTH ACHIEVEMENTS
  {
    id: 'HUNDRED_GRAND',
    name: 'Six Figures',
    description: 'Accumulate $100,000 in cash',
    category: 'wealth',
    icon: '💵',
    rarity: 'epic',
    requirement: (gs) => gs.player.money >= 100000,
    reward: { money: 10000, reputation: 50 }
  },
  {
    id: 'HALF_MILLION',
    name: 'Half Millionaire',
    description: 'Accumulate $500,000 in cash',
    category: 'wealth',
    icon: '💎',
    rarity: 'epic',
    requirement: (gs) => gs.player.money >= 500000,
    reward: { money: 25000, reputation: 100 }
  },
  {
    id: 'BANKRUPTCY_SURVIVOR',
    name: 'Bankruptcy Survivor',
    description: 'Reach $0 and recover to $50,000',
    category: 'wealth',
    icon: '🦅',
    rarity: 'rare',
    secret: true,
    requirement: (gs) => {
      // This would need tracking of historical minimum money
      return gs.player.money >= 50000;
    },
    reward: { money: 15000, reputation: 75 }
  },

  // REPUTATION ACHIEVEMENTS
  {
    id: 'RESPECTED',
    name: 'Respected',
    description: 'Reach 500 reputation',
    category: 'special',
    icon: '⭐',
    rarity: 'rare',
    requirement: (gs) => gs.player.reputation >= 500,
    reward: { money: 10000, reputation: 50 }
  },
  {
    id: 'RENOWNED',
    name: 'Renowned',
    description: 'Reach 1000 reputation',
    category: 'special',
    icon: '🌟',
    rarity: 'epic',
    requirement: (gs) => gs.player.reputation >= 1000,
    reward: { money: 25000, reputation: 100 }
  },
  {
    id: 'LEGENDARY_STATUS',
    name: 'Legendary Status',
    description: 'Reach 2500 reputation',
    category: 'special',
    icon: '👑',
    rarity: 'legendary',
    requirement: (gs) => gs.player.reputation >= 2500,
    reward: { money: 100000, reputation: 250 }
  },

  // PROPERTY ACHIEVEMENTS
  {
    id: 'REAL_ESTATE_BARON',
    name: 'Real Estate Baron',
    description: 'Own 10 properties',
    category: 'property',
    icon: '🏰',
    rarity: 'epic',
    requirement: (gs) => Object.keys(gs.player.properties).length >= 10,
    reward: { money: 50000, reputation: 100 }
  },

  // SKILL ACHIEVEMENTS
  {
    id: 'MASTER_OF_ALL',
    name: 'Master of All',
    description: 'Unlock all available skills',
    category: 'skills',
    icon: '🎓',
    rarity: 'legendary',
    requirement: (gs) => gs.player.skills.length >= Object.keys(gs.skills).length,
    reward: { money: 50000, reputation: 200 }
  },

  // JOBS ACHIEVEMENTS
  {
    id: 'WORKAHOLIC',
    name: 'Workaholic',
    description: 'Complete 100 work shifts',
    category: 'jobs',
    icon: '💼',
    rarity: 'epic',
    requirement: (gs) => (gs.player.statistics?.jobsCompleted || 0) >= 100,
    reward: { money: 10000, reputation: 50 }
  },
  {
    id: 'JOB_MASTER',
    name: 'Job Master',
    description: 'Work at least 5 different jobs',
    category: 'jobs',
    icon: '🎯',
    rarity: 'rare',
    requirement: (gs) => Object.keys(gs.player.jobPerformance).length >= 5,
    reward: { money: 7500, reputation: 40 }
  },

  // GAMBLING ACHIEVEMENTS
  {
    id: 'HIGH_ROLLER',
    name: 'High Roller',
    description: 'Win $50,000+ from gambling',
    category: 'gambling',
    icon: '🎰',
    rarity: 'epic',
    secret: true,
    requirement: (gs) => {
      const stats = gs.player.statistics;
      if (!stats) return false;
      const netGambling = (stats.totalGamblingWins || 0) - (stats.totalGamblingLosses || 0);
      return netGambling >= 50000;
    },
    reward: { money: 25000, reputation: 100 }
  },
  {
    id: 'GAMBLER_REFORMED',
    name: 'Reformed Gambler',
    description: 'Lose $20,000 gambling then quit while ahead',
    category: 'gambling',
    icon: '🚫',
    rarity: 'rare',
    secret: true,
    requirement: (gs) => (gs.player.statistics?.totalGamblingLosses || 0) >= 20000,
    reward: { money: 10000, reputation: 50 }
  },

  // COMBO & SPECIAL ACHIEVEMENTS
  {
    id: 'TRIPLE_THREAT',
    name: 'Triple Threat',
    description: 'Own $50k cash, 5 properties, and 50k in commodities',
    category: 'special',
    icon: '🔱',
    rarity: 'epic',
    requirement: (gs) => {
      const commodityValue = Object.keys(gs.player.commodities).reduce((sum, commId) => {
        const comm = gs.commodities[commId];
        const playerComm = gs.player.commodities[commId];
        return sum + (comm ? comm.price * playerComm.quantity : 0);
      }, 0);
      return gs.player.money >= 50000 &&
             Object.keys(gs.player.properties).length >= 5 &&
             commodityValue >= 50000;
    },
    reward: { money: 30000, reputation: 150 }
  },
  {
    id: 'EARLY_BIRD',
    name: 'Early Bird',
    description: 'Reach $100,000 before turn 50',
    category: 'special',
    icon: '🐦',
    rarity: 'epic',
    secret: true,
    requirement: (gs) => gs.player.money >= 100000 && gs.gameTurn <= 50,
    reward: { money: 25000, reputation: 100 }
  },
  {
    id: 'MARATHON_RUNNER',
    name: 'Marathon Runner',
    description: 'Play for 500 turns',
    category: 'special',
    icon: '🏃',
    rarity: 'rare',
    requirement: (gs) => gs.gameTurn >= 500,
    reward: { money: 50000, reputation: 100 }
  },
  {
    id: 'IRON_WILL',
    name: 'Iron Will',
    description: 'Never drop below $1,000 after reaching $100,000',
    category: 'wealth',
    icon: '🛡️',
    rarity: 'legendary',
    secret: true,
    requirement: (gs) => {
      // This would need tracking of minimum money after peak
      return (gs.player.statistics?.peakNetWorth || 0) >= 100000 && gs.player.money >= 1000;
    },
    reward: { money: 50000, reputation: 200 }
  }
];
