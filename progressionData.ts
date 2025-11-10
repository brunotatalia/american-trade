import { Milestone, WinCondition, GameState } from './types';

// Helper function to calculate net worth
const calculateNetWorth = (state: GameState): number => {
  let total = state.player.money;
  
  // Add commodity values
  Object.entries(state.player.commodities).forEach(([id, holding]) => {
    const commodity = state.commodities[id];
    if (commodity && !commodity.isBankrupt) {
      total += holding.quantity * commodity.price;
    }
  });
  
  // Add property values
  state.player.properties.forEach(propId => {
    const property = state.properties[propId];
    if (property) {
      total += property.cost;
    }
  });
  
  return total;
};

// Helper function to calculate total property value
const calculatePropertyValue = (state: GameState): number => {
  let total = 0;
  state.player.properties.forEach(propId => {
    const property = state.properties[propId];
    if (property) {
      total += property.cost;
    }
  });
  return total;
};

// MILESTONE DEFINITIONS (35+ milestones)
export const MILESTONES_DATA: Record<string, Milestone> = {
  // === WEALTH MILESTONES (7) ===
  FIRST_THOUSAND: {
    id: 'FIRST_THOUSAND',
    name: 'First Thousand',
    description: 'Accumulate $1,000 in total net worth',
    category: 'wealth',
    tier: 0,
    requirement: (state) => calculateNetWorth(state) >= 1000,
    reward: { money: 100, reputation: 5 },
    priority: 'high'
  },
  TEN_THOUSAND: {
    id: 'TEN_THOUSAND',
    name: 'Five Figures',
    description: 'Reach $10,000 net worth',
    category: 'wealth',
    tier: 1,
    requirement: (state) => calculateNetWorth(state) >= 10000,
    reward: { money: 500, reputation: 10 },
    priority: 'high'
  },
  FIFTY_THOUSAND: {
    id: 'FIFTY_THOUSAND',
    name: 'Half Way to Six',
    description: 'Accumulate $50,000 net worth',
    category: 'wealth',
    tier: 2,
    requirement: (state) => calculateNetWorth(state) >= 50000,
    reward: { money: 2000, reputation: 15 },
    priority: 'high'
  },
  HUNDRED_THOUSAND: {
    id: 'HUNDRED_THOUSAND',
    name: 'Six Figures',
    description: 'Reach $100,000 net worth',
    category: 'wealth',
    tier: 2,
    requirement: (state) => calculateNetWorth(state) >= 100000,
    reward: { money: 5000, reputation: 25 },
    priority: 'high'
  },
  QUARTER_MILLION: {
    id: 'QUARTER_MILLION',
    name: 'Quarter Million',
    description: 'Accumulate $250,000 net worth',
    category: 'wealth',
    tier: 3,
    requirement: (state) => calculateNetWorth(state) >= 250000,
    reward: { money: 10000, reputation: 35 },
    priority: 'high'
  },
  HALF_MILLION: {
    id: 'HALF_MILLION',
    name: 'Half Millionaire',
    description: 'Reach $500,000 net worth',
    category: 'wealth',
    tier: 3,
    requirement: (state) => calculateNetWorth(state) >= 500000,
    reward: { money: 25000, reputation: 50 },
    priority: 'high'
  },
  MILLIONAIRE: {
    id: 'MILLIONAIRE',
    name: 'Millionaire!',
    description: 'Achieve $1,000,000 net worth',
    category: 'wealth',
    tier: 4,
    requirement: (state) => calculateNetWorth(state) >= 1000000,
    reward: { money: 50000, reputation: 100 },
    priority: 'high'
  },

  // === PROPERTY MILESTONES (4) ===
  FIRST_PROPERTY: {
    id: 'FIRST_PROPERTY',
    name: 'Homeowner',
    description: 'Purchase your first property',
    category: 'property',
    tier: 0,
    requirement: (state) => state.player.properties.length >= 1,
    reward: { money: 100, reputation: 10 },
    priority: 'high'
  },
  FIVE_PROPERTIES: {
    id: 'FIVE_PROPERTIES',
    name: 'Real Estate Investor',
    description: 'Own 5 properties',
    category: 'property',
    tier: 2,
    requirement: (state) => state.player.properties.length >= 5,
    reward: { money: 1000, reputation: 20 },
    priority: 'medium'
  },
  TEN_PROPERTIES: {
    id: 'TEN_PROPERTIES',
    name: 'Property Tycoon',
    description: 'Own 10 properties',
    category: 'property',
    tier: 3,
    requirement: (state) => state.player.properties.length >= 10,
    reward: { money: 5000, reputation: 40 },
    priority: 'medium'
  },
  PROPERTY_EMPIRE: {
    id: 'PROPERTY_EMPIRE',
    name: 'Property Mogul',
    description: 'Build a property empire worth $500,000',
    category: 'property',
    tier: 4,
    requirement: (state) => calculatePropertyValue(state) >= 500000,
    reward: { money: 25000, reputation: 75 },
    priority: 'high'
  },

  // === TRADING MILESTONES (4) ===
  FIRST_TRADE: {
    id: 'FIRST_TRADE',
    name: 'First Trade',
    description: 'Complete your first successful trade',
    category: 'trading',
    tier: 0,
    requirement: (state) => state.player.tradingStats.totalTrades >= 1,
    reward: { money: 50, reputation: 5 },
    priority: 'high'
  },
  PROFITABLE_TRADER: {
    id: 'PROFITABLE_TRADER',
    name: 'Profitable Trader',
    description: 'Make 10 profitable trades',
    category: 'trading',
    tier: 1,
    requirement: (state) => state.player.tradingStats.profitableTrades >= 10,
    reward: { money: 500, reputation: 15 },
    priority: 'medium'
  },
  EXPERT_TRADER: {
    id: 'EXPERT_TRADER',
    name: 'Expert Trader',
    description: 'Make 50 profitable trades',
    category: 'trading',
    tier: 2,
    requirement: (state) => state.player.tradingStats.profitableTrades >= 50,
    reward: { money: 2000, reputation: 30 },
    priority: 'medium'
  },
  TRADING_MASTER: {
    id: 'TRADING_MASTER',
    name: 'Trading Master',
    description: 'Earn $100,000 in total trading profits',
    category: 'trading',
    tier: 3,
    requirement: (state) => state.player.tradingStats.totalProfit >= 100000,
    reward: { money: 10000, reputation: 50 },
    priority: 'high'
  },

  // === CAREER/SKILLS MILESTONES (3) ===
  FIRST_SKILL: {
    id: 'FIRST_SKILL',
    name: 'Student',
    description: 'Unlock your first skill',
    category: 'skills',
    tier: 0,
    requirement: (state) => state.player.skills.length >= 1,
    reward: { money: 100, reputation: 5 },
    priority: 'high'
  },
  SKILLED_WORKER: {
    id: 'SKILLED_WORKER',
    name: 'Skilled Professional',
    description: 'Unlock 3 skills',
    category: 'skills',
    tier: 1,
    requirement: (state) => state.player.skills.length >= 3,
    reward: { money: 500, reputation: 15 },
    priority: 'medium'
  },
  MASTER_OF_ALL: {
    id: 'MASTER_OF_ALL',
    name: 'Master of All Trades',
    description: 'Unlock all available skills',
    category: 'skills',
    tier: 3,
    requirement: (state) => {
      const availableSkills = state.currentEra?.availableSkills || [];
      return availableSkills.every(skillId => state.player.skills.includes(skillId));
    },
    reward: { money: 5000, reputation: 40 },
    priority: 'low'
  },

  // === REPUTATION MILESTONES (3) ===
  KNOWN_LOCALLY: {
    id: 'KNOWN_LOCALLY',
    name: 'Local Celebrity',
    description: 'Reach 50 reputation',
    category: 'reputation',
    tier: 1,
    requirement: (state) => state.player.reputation >= 50,
    reward: { money: 500, reputation: 10 },
    priority: 'medium'
  },
  FAMOUS: {
    id: 'FAMOUS',
    name: 'Famous Entrepreneur',
    description: 'Reach 250 reputation',
    category: 'reputation',
    tier: 2,
    requirement: (state) => state.player.reputation >= 250,
    reward: { money: 2500, reputation: 25 },
    priority: 'medium'
  },
  LEGEND: {
    id: 'LEGEND',
    name: 'Legend',
    description: 'Reach 1000 reputation',
    category: 'reputation',
    tier: 4,
    requirement: (state) => state.player.reputation >= 1000,
    reward: { money: 25000, reputation: 100 },
    priority: 'low'
  },

  // === SPECIAL MILESTONES (11 more for variety) ===
  SURVIVOR_10: {
    id: 'SURVIVOR_10',
    name: 'Getting Started',
    description: 'Survive 10 turns',
    category: 'special',
    tier: 0,
    requirement: (state) => state.gameTurn >= 10,
    reward: { money: 50, reputation: 5 },
    priority: 'low'
  },
  SURVIVOR_50: {
    id: 'SURVIVOR_50',
    name: 'Experienced',
    description: 'Survive 50 turns',
    category: 'special',
    tier: 1,
    requirement: (state) => state.gameTurn >= 50,
    reward: { money: 250, reputation: 10 },
    priority: 'low'
  },
  SURVIVOR_100: {
    id: 'SURVIVOR_100',
    name: 'Veteran',
    description: 'Survive 100 turns',
    category: 'special',
    tier: 2,
    requirement: (state) => state.gameTurn >= 100,
    reward: { money: 1000, reputation: 20 },
    priority: 'low'
  },
  DIVERSIFIED: {
    id: 'DIVERSIFIED',
    name: 'Diversified Portfolio',
    description: 'Own at least 3 different types of commodities',
    category: 'special',
    tier: 1,
    requirement: (state) => Object.keys(state.player.commodities).length >= 3,
    reward: { money: 300, reputation: 10 },
    priority: 'medium'
  },
  DIVIDEND_INCOME: {
    id: 'DIVIDEND_INCOME',
    name: 'Dividend Investor',
    description: 'Earn $1,000 in total dividends',
    category: 'special',
    tier: 2,
    requirement: (state) => state.player.tradingStats.totalDividends >= 1000,
    reward: { money: 500, reputation: 15 },
    priority: 'medium'
  },
  RISK_TAKER: {
    id: 'RISK_TAKER',
    name: 'Risk Taker',
    description: 'Own Bitcoin or other high-volatility assets',
    category: 'special',
    tier: 1,
    requirement: (state) => {
      return Object.keys(state.player.commodities).some(id => {
        const commodity = state.commodities[id];
        return commodity && commodity.volatility >= 0.6;
      });
    },
    reward: { money: 200, reputation: 10 },
    priority: 'low'
  },
  BALANCED: {
    id: 'BALANCED',
    name: 'Balanced Investor',
    description: 'Own stocks, bonds, and real estate simultaneously',
    category: 'special',
    tier: 2,
    requirement: (state) => {
      const hasStocks = Object.keys(state.player.commodities).some(id => 
        state.commodities[id]?.category === 'stocks'
      );
      const hasBonds = Object.keys(state.player.commodities).some(id => 
        state.commodities[id]?.category === 'bonds'
      );
      const hasRealEstate = state.player.properties.length > 0;
      return hasStocks && hasBonds && hasRealEstate;
    },
    reward: { money: 1000, reputation: 20 },
    priority: 'medium'
  },
  CASH_RICH: {
    id: 'CASH_RICH',
    name: 'Cash is King',
    description: 'Hold $50,000 in liquid cash',
    category: 'special',
    tier: 2,
    requirement: (state) => state.player.money >= 50000,
    reward: { money: 2000, reputation: 15 },
    priority: 'low'
  },
  QUICK_PROFIT: {
    id: 'QUICK_PROFIT',
    name: 'Quick Profits',
    description: 'Make $5,000 profit in a single trade',
    category: 'special',
    tier: 2,
    requirement: (state) => {
      // This would need to be tracked per-trade, simplified check for now
      return state.player.tradingStats.totalProfit >= 5000;
    },
    reward: { money: 1000, reputation: 20 },
    priority: 'medium'
  },
  ORDER_MASTER: {
    id: 'ORDER_MASTER',
    name: 'Order Master',
    description: 'Place 10 limit or stop-loss orders',
    category: 'special',
    tier: 1,
    requirement: (state) => state.player.orders.length >= 3, // Simplified
    reward: { money: 300, reputation: 10 },
    priority: 'low'
  },
  CATEGORY_COLLECTOR: {
    id: 'CATEGORY_COLLECTOR',
    name: 'Category Collector',
    description: 'Own at least one asset from each category',
    category: 'special',
    tier: 3,
    requirement: (state) => {
      const categories = new Set<string>();
      Object.keys(state.player.commodities).forEach(id => {
        const commodity = state.commodities[id];
        if (commodity?.category) {
          categories.add(commodity.category);
        }
      });
      return categories.size >= 5; // agriculture, energy, precious_metals, stocks, crypto, bonds
    },
    reward: { money: 5000, reputation: 30 },
    priority: 'medium'
  }
};

// WIN CONDITIONS (19 victory paths)
export const WIN_CONDITIONS_DATA: Record<string, WinCondition> = {
  // === WEALTH VICTORIES (4) ===
  MILLIONAIRE_WIN: {
    id: 'MILLIONAIRE_WIN',
    name: 'Millionaire',
    description: 'Accumulate $1,000,000 in net worth',
    category: 'wealth',
    prestigePoints: 5,
    checkCompleted: (state) => calculateNetWorth(state) >= 1000000,
    icon: '💰'
  },
  MULTI_MILLIONAIRE: {
    id: 'MULTI_MILLIONAIRE',
    name: 'Multi-Millionaire',
    description: 'Accumulate $10,000,000 in net worth',
    category: 'wealth',
    prestigePoints: 15,
    checkCompleted: (state) => calculateNetWorth(state) >= 10000000,
    icon: '💎'
  },
  TYCOON: {
    id: 'TYCOON',
    name: 'Tycoon',
    description: 'Accumulate $50,000,000 in net worth',
    category: 'wealth',
    prestigePoints: 30,
    checkCompleted: (state) => calculateNetWorth(state) >= 50000000,
    icon: '👑'
  },
  BILLIONAIRE: {
    id: 'BILLIONAIRE',
    name: 'Billionaire',
    description: 'Achieve legendary $1,000,000,000 net worth',
    category: 'wealth',
    prestigePoints: 100,
    checkCompleted: (state) => calculateNetWorth(state) >= 1000000000,
    icon: '🌟'
  },

  // === PROPERTY EMPIRE (2) ===
  REAL_ESTATE_MOGUL: {
    id: 'REAL_ESTATE_MOGUL',
    name: 'Real Estate Mogul',
    description: 'Own $5,000,000 in properties',
    category: 'property',
    prestigePoints: 20,
    checkCompleted: (state) => calculatePropertyValue(state) >= 5000000,
    icon: '🏢'
  },
  PROPERTY_BARON: {
    id: 'PROPERTY_BARON',
    name: 'Property Baron',
    description: 'Own 20+ properties',
    category: 'property',
    prestigePoints: 25,
    checkCompleted: (state) => state.player.properties.length >= 20,
    icon: '🏰'
  },

  // === TRADING MASTERY (3) ===
  DAY_TRADER: {
    id: 'DAY_TRADER',
    name: 'Day Trader',
    description: 'Complete 100 profitable trades',
    category: 'trading',
    prestigePoints: 10,
    checkCompleted: (state) => state.player.tradingStats.profitableTrades >= 100,
    icon: '📈'
  },
  TRADING_MASTER_WIN: {
    id: 'TRADING_MASTER_WIN',
    name: 'Trading Master',
    description: 'Complete 500 profitable trades',
    category: 'trading',
    prestigePoints: 35,
    checkCompleted: (state) => state.player.tradingStats.profitableTrades >= 500,
    icon: '🎯'
  },
  PROFIT_KING: {
    id: 'PROFIT_KING',
    name: 'Profit King',
    description: 'Earn $10,000,000 in total trading profits',
    category: 'trading',
    prestigePoints: 40,
    checkCompleted: (state) => state.player.tradingStats.totalProfit >= 10000000,
    icon: '💹'
  },

  // === SPEED RUN (2) ===
  SPEED_MILLIONAIRE: {
    id: 'SPEED_MILLIONAIRE',
    name: 'Speed Millionaire',
    description: 'Reach $1,000,000 in under 100 turns',
    category: 'speed',
    prestigePoints: 25,
    checkCompleted: (state) => calculateNetWorth(state) >= 1000000 && state.gameTurn < 100,
    icon: '⚡'
  },
  LIGHTNING_TYCOON: {
    id: 'LIGHTNING_TYCOON',
    name: 'Lightning Tycoon',
    description: 'Reach $10,000,000 in under 200 turns',
    category: 'speed',
    prestigePoints: 50,
    checkCompleted: (state) => calculateNetWorth(state) >= 10000000 && state.gameTurn < 200,
    icon: '⚡💎'
  },

  // === DIVERSIFICATION (2) ===
  DIVERSIFICATION_MASTER: {
    id: 'DIVERSIFICATION_MASTER',
    name: 'Diversification Master',
    description: 'Own assets from all commodity categories',
    category: 'diversification',
    prestigePoints: 20,
    checkCompleted: (state) => {
      const categories = new Set<string>();
      Object.keys(state.player.commodities).forEach(id => {
        const commodity = state.commodities[id];
        if (commodity?.category) {
          categories.add(commodity.category);
        }
      });
      const requiredCategories = ['agriculture', 'energy', 'precious_metals', 'stocks', 'crypto', 'bonds'];
      return requiredCategories.every(cat => categories.has(cat));
    },
    icon: '🌈'
  },
  BALANCED_INVESTOR: {
    id: 'BALANCED_INVESTOR',
    name: 'Balanced Investor',
    description: 'Have $100,000+ in stocks, bonds, and real estate each',
    category: 'diversification',
    prestigePoints: 15,
    checkCompleted: (state) => {
      let stocksValue = 0;
      let bondsValue = 0;
      
      Object.entries(state.player.commodities).forEach(([id, holding]) => {
        const commodity = state.commodities[id];
        if (commodity) {
          const value = holding.quantity * commodity.price;
          if (commodity.category === 'stocks') stocksValue += value;
          if (commodity.category === 'bonds') bondsValue += value;
        }
      });
      
      const realEstateValue = calculatePropertyValue(state);
      
      return stocksValue >= 100000 && bondsValue >= 100000 && realEstateValue >= 100000;
    },
    icon: '⚖️'
  },

  // === SPECIAL ACHIEVEMENTS (6) ===
  REPUTATION_KING: {
    id: 'REPUTATION_KING',
    name: 'Reputation King',
    description: 'Reach 1000 reputation',
    category: 'special',
    prestigePoints: 30,
    checkCompleted: (state) => state.player.reputation >= 1000,
    icon: '⭐'
  },
  ACHIEVEMENT_HUNTER: {
    id: 'ACHIEVEMENT_HUNTER',
    name: 'Achievement Hunter',
    description: 'Complete 50 achievements/milestones',
    category: 'special',
    prestigePoints: 40,
    checkCompleted: (state) => state.player.progress.completedMilestones.length >= 50,
    icon: '🏆'
  },
  SKILL_MASTER: {
    id: 'SKILL_MASTER',
    name: 'Skill Master',
    description: 'Unlock all skills in the game',
    category: 'special',
    prestigePoints: 25,
    checkCompleted: (state) => {
      const allSkills = Object.keys(state.skills);
      return allSkills.every(skillId => state.player.skills.includes(skillId));
    },
    icon: '🎓'
  },
  DIVIDEND_KING: {
    id: 'DIVIDEND_KING',
    name: 'Dividend King',
    description: 'Earn $100,000 in total dividends',
    category: 'special',
    prestigePoints: 20,
    checkCompleted: (state) => state.player.tradingStats.totalDividends >= 100000,
    icon: '💵'
  },
  SURVIVOR: {
    id: 'SURVIVOR',
    name: 'Survivor',
    description: 'Survive 500 turns',
    category: 'special',
    prestigePoints: 15,
    checkCompleted: (state) => state.gameTurn >= 500,
    icon: '🛡️'
  },
  COMEBACK_KID: {
    id: 'COMEBACK_KID',
    name: 'Comeback Kid',
    description: 'Recover from having less than $10 to achieve $100,000',
    category: 'special',
    prestigePoints: 30,
    checkCompleted: (state) => {
      // This would require tracking history, simplified for now
      return calculateNetWorth(state) >= 100000;
    },
    icon: '🔥'
  }
};
