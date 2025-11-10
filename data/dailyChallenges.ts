import { DailyChallenge, GameState } from '../types';

// Daily Challenge Templates
// These are templates that will be randomly selected and customized each day

export interface ChallengeTemplate {
  id: string;
  type: 'trading' | 'wealth' | 'jobs' | 'property' | 'gambling' | 'reputation';
  description: string;
  goal: (gameState: GameState, startTurn: number) => boolean;
  reward: { money: number; reputation: number };
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}

export const DAILY_CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // TRADING CHALLENGES
  {
    id: 'PROFITABLE_TRADES',
    type: 'trading',
    description: 'Complete 3 profitable trades today',
    goal: (gs: GameState, startTurn: number) => {
      // Count profitable trades since challenge started
      // This is simplified - in real implementation we'd track trades per challenge
      return (gs.player.statistics?.profitableTrades || 0) >= 3;
    },
    reward: { money: 2000, reputation: 10 },
    difficulty: 'easy',
    icon: '📈'
  },
  {
    id: 'BIG_PROFIT',
    type: 'trading',
    description: 'Make a single trade with $5,000+ profit',
    goal: (gs: GameState, startTurn: number) => {
      return (gs.player.statistics?.biggestWin || 0) >= 5000;
    },
    reward: { money: 3000, reputation: 15 },
    difficulty: 'medium',
    icon: '💰'
  },
  {
    id: 'TRADE_VOLUME',
    type: 'trading',
    description: 'Complete 5 trades of any type today',
    goal: (gs: GameState, startTurn: number) => {
      return (gs.player.statistics?.totalTrades || 0) >= 5;
    },
    reward: { money: 1500, reputation: 10 },
    difficulty: 'easy',
    icon: '🔄'
  },
  {
    id: 'DIVERSE_PORTFOLIO',
    type: 'trading',
    description: 'Own at least 3 different commodities',
    goal: (gs: GameState, startTurn: number) => {
      return Object.keys(gs.player.commodities).length >= 3;
    },
    reward: { money: 2500, reputation: 15 },
    difficulty: 'medium',
    icon: '📊'
  },

  // WEALTH CHALLENGES
  {
    id: 'SAVE_MONEY',
    type: 'wealth',
    description: 'Reach $10,000 in cash',
    goal: (gs: GameState, startTurn: number) => {
      return gs.player.money >= 10000;
    },
    reward: { money: 1000, reputation: 10 },
    difficulty: 'easy',
    icon: '💵'
  },
  {
    id: 'NET_WORTH_GOAL',
    type: 'wealth',
    description: 'Reach $50,000 in total net worth',
    goal: (gs: GameState, startTurn: number) => {
      const netWorth = gs.player.money +
        Object.keys(gs.player.commodities).reduce((sum, commId) => {
          const comm = gs.commodities[commId];
          const playerComm = gs.player.commodities[commId];
          return sum + (comm ? comm.price * playerComm.quantity : 0);
        }, 0) +
        Object.keys(gs.player.properties).reduce((sum, propId) => {
          return sum + gs.player.properties[propId].currentValue;
        }, 0);
      return netWorth >= 50000;
    },
    reward: { money: 5000, reputation: 20 },
    difficulty: 'hard',
    icon: '🏆'
  },
  {
    id: 'CASH_RESERVE',
    type: 'wealth',
    description: 'Maintain $20,000+ cash without spending',
    goal: (gs: GameState, startTurn: number) => {
      return gs.player.money >= 20000;
    },
    reward: { money: 2000, reputation: 15 },
    difficulty: 'medium',
    icon: '💎'
  },

  // JOB CHALLENGES
  {
    id: 'WORK_SHIFT',
    type: 'jobs',
    description: 'Complete 3 successful work shifts',
    goal: (gs: GameState, startTurn: number) => {
      return (gs.player.statistics?.jobsCompleted || 0) >= 3;
    },
    reward: { money: 1500, reputation: 10 },
    difficulty: 'easy',
    icon: '💼'
  },
  {
    id: 'JOB_EARNINGS',
    type: 'jobs',
    description: 'Earn $5,000 from jobs today',
    goal: (gs: GameState, startTurn: number) => {
      // Simplified check - in reality we'd track daily earnings
      return Object.values(gs.player.jobPerformance).reduce((sum, perf) => sum + perf.totalEarnings, 0) >= 5000;
    },
    reward: { money: 2000, reputation: 15 },
    difficulty: 'medium',
    icon: '💰'
  },
  {
    id: 'PERFECT_PERFORMANCE',
    type: 'jobs',
    description: 'Complete a work shift with "excellent" rating',
    goal: (gs: GameState, startTurn: number) => {
      // Check if any job has been performed excellently
      return Object.values(gs.player.jobPerformance).some(perf => perf.gamesWon > 0);
    },
    reward: { money: 3000, reputation: 20 },
    difficulty: 'hard',
    icon: '⭐'
  },

  // PROPERTY CHALLENGES
  {
    id: 'BUY_PROPERTY',
    type: 'property',
    description: 'Purchase any property',
    goal: (gs: GameState, startTurn: number) => {
      return Object.keys(gs.player.properties).length > 0;
    },
    reward: { money: 3000, reputation: 15 },
    difficulty: 'medium',
    icon: '🏠'
  },
  {
    id: 'PROPERTY_PORTFOLIO',
    type: 'property',
    description: 'Own 3 or more properties',
    goal: (gs: GameState, startTurn: number) => {
      return Object.keys(gs.player.properties).length >= 3;
    },
    reward: { money: 5000, reputation: 25 },
    difficulty: 'hard',
    icon: '🏘️'
  },

  // GAMBLING CHALLENGES
  {
    id: 'CASINO_WINS',
    type: 'gambling',
    description: 'Win 2 casino games',
    goal: (gs: GameState, startTurn: number) => {
      return (gs.player.statistics?.totalGamblingWins || 0) >= 2;
    },
    reward: { money: 2000, reputation: 10 },
    difficulty: 'medium',
    icon: '🎰'
  },
  {
    id: 'GAMBLING_PROFIT',
    type: 'gambling',
    description: 'Win $3,000+ from gambling',
    goal: (gs: GameState, startTurn: number) => {
      const stats = gs.player.statistics;
      if (!stats) return false;
      const netGambling = (stats.totalGamblingWins || 0) - (stats.totalGamblingLosses || 0);
      return netGambling >= 3000;
    },
    reward: { money: 1500, reputation: 10 },
    difficulty: 'hard',
    icon: '💸'
  },

  // REPUTATION CHALLENGES
  {
    id: 'BUILD_REPUTATION',
    type: 'reputation',
    description: 'Reach 100 reputation points',
    goal: (gs: GameState, startTurn: number) => {
      return gs.player.reputation >= 100;
    },
    reward: { money: 2000, reputation: 20 },
    difficulty: 'easy',
    icon: '⭐'
  },
  {
    id: 'HIGH_REPUTATION',
    type: 'reputation',
    description: 'Reach 250 reputation points',
    goal: (gs: GameState, startTurn: number) => {
      return gs.player.reputation >= 250;
    },
    reward: { money: 4000, reputation: 30 },
    difficulty: 'hard',
    icon: '🌟'
  },
  {
    id: 'UNLOCK_SKILL',
    type: 'reputation',
    description: 'Unlock a new skill',
    goal: (gs: GameState, startTurn: number) => {
      return gs.player.skills.length > 0;
    },
    reward: { money: 2500, reputation: 15 },
    difficulty: 'medium',
    icon: '📚'
  },

  // MIXED CHALLENGES
  {
    id: 'BALANCED_GROWTH',
    type: 'wealth',
    description: 'Have $5,000 cash, 1 property, and 1 commodity',
    goal: (gs: GameState, startTurn: number) => {
      return gs.player.money >= 5000 &&
             Object.keys(gs.player.properties).length >= 1 &&
             Object.keys(gs.player.commodities).length >= 1;
    },
    reward: { money: 3000, reputation: 20 },
    difficulty: 'hard',
    icon: '⚖️'
  },
  {
    id: 'ENTREPRENEUR',
    type: 'wealth',
    description: 'Complete a job AND make a profitable trade',
    goal: (gs: GameState, startTurn: number) => {
      return (gs.player.statistics?.jobsCompleted || 0) > 0 &&
             (gs.player.statistics?.profitableTrades || 0) > 0;
    },
    reward: { money: 2500, reputation: 15 },
    difficulty: 'medium',
    icon: '🚀'
  }
];

// Function to generate a random daily challenge
export function generateDailyChallenge(currentTurn: number, difficulty?: 'easy' | 'medium' | 'hard'): DailyChallenge {
  let templates = DAILY_CHALLENGE_TEMPLATES;

  // Filter by difficulty if specified
  if (difficulty) {
    templates = templates.filter(t => t.difficulty === difficulty);
  }

  // Select a random template
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    id: `${template.id}_${currentTurn}`,
    description: `${template.icon} ${template.description}`,
    goal: (gs: GameState) => template.goal(gs, currentTurn),
    reward: template.reward,
    expiresAtTurn: currentTurn + 10 // Expires after 10 turns (1 "day")
  };
}

// Function to check if a challenge should be generated (daily basis)
export function shouldGenerateNewChallenge(player: any, currentTurn: number): boolean {
  // No challenge yet
  if (!player.dailyChallenge) return true;

  // Challenge expired
  if (currentTurn >= player.dailyChallenge.expiresAtTurn) return true;

  // Challenge completed (goal met)
  // This would need to be tracked separately

  return false;
}
