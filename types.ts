

import React from 'react';

export interface Order {
  id: string;
  commodityId: string;
  type: 'LIMIT_BUY' | 'LIMIT_SELL' | 'STOP_LOSS_SELL';
  price: number;
  quantity: number;
  createdAtTurn: number;
}

export interface Job {
  id: string;
  title: string;
  category: 'white_collar' | 'blue_collar' | 'service' | 'tech' | 'management';
  basePayPerTurn: number;
  requiredSkills: string[];
  description: string;
  miniGameType: 'math_quiz' | 'pattern_match' | 'data_entry' | 'cargo_load' | 'assembly_line' | 'delivery_route' | 'word_scramble' | 'trivia_quiz' | 'negotiation';
  difficulty: 'easy' | 'medium' | 'hard';
  icon?: React.ReactNode;
}

export interface JobPerformance {
  jobId: string;
  gamesPlayed: number;
  gamesWon: number;
  averageScore: number;
  bestScore: number;
  totalEarnings: number;
  streak: number; // consecutive wins
}

export interface MiniGameResult {
  score: number;
  passed: boolean;
  earnings: number;
  performanceRating: 'poor' | 'average' | 'good' | 'excellent';
}

export interface OptionsContract {
  id: string;
  commodityId: string;
  type: 'CALL' | 'PUT';
  strikePrice: number;
  premium: number; // cost to buy the option
  expirationTurn: number;
  quantity: number;
  purchasedAtTurn: number;
}

export interface LeveragedPosition {
  id: string;
  commodityId: string;
  type: 'LONG' | 'SHORT';
  leverage: number; // 2x, 5x, 10x
  entryPrice: number;
  quantity: number;
  margin: number; // initial margin requirement
  currentValue: number;
  liquidationPrice: number;
  openedAtTurn: number;
}

export interface PriceHistory {
  turn: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

// Advanced Trading Mechanics Interfaces

export interface MarketSentiment {
  id: string;
  commodityId: string;
  sentimentLevel: number; // -1.0 to 1.0 (bearish to bullish)
  impact: number; // 0.05 to 0.30 (5-30% price impact)
  duration: number; // turns until sentiment expires
  source: 'news' | 'analyst' | 'technical' | 'fundamental' | 'social';
  description: string; // Why this sentiment exists
  createdAtTurn: number;
}

export interface StockSplit {
  id: string;
  commodityId: string;
  ratio: number; // Split ratio (e.g., 2 for 2:1 split, 3 for 3:1)
  scheduledTurn: number; // When the split will occur
  announced: boolean; // Whether players have been notified
  executed: boolean; // Whether the split has been processed
}

export interface BankruptcyEvent {
  id: string;
  commodityId: string;
  triggerTurn: number; // When bankruptcy occurred
  warningTurns: number; // Turns of warning before bankruptcy
  finalPrice: number; // Price before crash
  playerLosses: number; // Total player holdings lost
}

export interface Player {
  money: number;
  reputation: number;
  commodities: Record<string, { quantity: number; avgBuyPrice: number; purchasedTurn: number }>;
  properties: Record<string, { purchasedTurn: number; currentValue: number }>; // Property ID -> purchase info
  skills: string[]; // IDs of unlocked skills
  orders: Order[];
  currentJob: string | null; // Job ID
  jobPerformance: Record<string, JobPerformance>; // Job ID -> performance stats
  optionsContracts: OptionsContract[];
  leveragedPositions: LeveragedPosition[];
  tradingLevel: number; // Unlocks more leverage options
  achievements: UnlockedAchievement[]; // Unlocked achievements
  statistics: PlayerStatistics; // Lifetime stats
  dailyChallenge: DailyChallenge | null; // Current daily challenge
  prestigeData?: PrestigeData; // Prestige/New Game+ data
  progressionData?: ProgressionData; // Progression & milestones tracking
}

export interface Commodity {
  id: string;
  name: string;
  price: number;
  volatility: number; // For price change simulation (0-1)
  description: string;
  icon?: React.ReactNode;
  category?: 'agricultural' | 'energy' | 'precious_metal' | 'stock' | 'bond' | 'currency' | 'crypto'; // For fee calculation

  // Advanced Trading Mechanics
  dividendYield?: number; // Annual yield percentage (e.g., 0.03 = 3%)
  dividendFrequency?: 'quarterly' | 'annual'; // How often dividends are paid
  lastDividendTurn?: number; // Last turn dividend was paid
  bankruptcyRisk?: number; // 0-1 probability of bankruptcy per year
  canSplit?: boolean; // Whether this commodity can undergo stock splits
}

export interface Property {
  id: string;
  name: string;
  cost: number;
  rentPerTurn: number;
  description: string;
  icon?: React.ReactNode;
  maintenancePerTurn?: number; // Calculated based on property value
  appreciationRate?: number; // Annual appreciation rate (defaults to global rate)
}

export interface Skill {
  id: string;
  name: string;
  cost: number;
  description: string;
  effectDescription: string;
  icon?: React.ReactNode;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'opportunity';
  choices?: { text: string; action: (game: GameState) => Partial<GameState> | void }[]; // Action can modify game state
  duration?: number; // For timed events
  triggeredAtTurn?: number;
}

export interface GameDate {
  month: number; // 1-12
  year: number;
}

export interface WorldNewsEvent {
  id: string;
  date: GameDate;
  title: string;
  description: string;
  impact?: {
    commodityId?: string;
    priceChange?: number; // percentage
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'wealth' | 'trading' | 'property' | 'skills' | 'jobs' | 'special' | 'gambling';
  icon: string; // Emoji or icon identifier
  requirement: (gameState: GameState) => boolean;
  reward?: { money?: number; reputation?: number; };
  secret?: boolean; // Hidden until unlocked
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAtTurn: number;
  unlockedDate: GameDate;
}

export interface DailyChallenge {
  id: string;
  description: string;
  goal: (gameState: GameState) => boolean;
  reward: { money: number; reputation: number; };
  expiresAtTurn: number;
}

export interface PlayerStatistics {
  totalTrades: number;
  profitableTrades: number;
  totalProfit: number;
  totalLoss: number;
  biggestWin: number;
  biggestLoss: number;
  totalGamblingWins: number;
  totalGamblingLosses: number;
  propertiesPurchased: number;
  skillsUnlocked: number;
  jobsCompleted: number;
  achievementsUnlocked: number;
  peakNetWorth: number;
  turnsPlayed: number;
  startDate: Date;

  // Advanced Trading Statistics
  totalDividendsEarned: number;
  stockSplitsExperienced: number;
  bankruptciesExperienced: number;
}

export interface Era {
  id: string;
  name: string;
  description: string;
  startingMoney: number;
  marketVolatilityModifier: number; // e.g., 1.0 for normal, 1.5 for more volatile
  availableCommodities: string[]; // IDs
  availableProperties: string[]; // IDs
  availableSkills: string[]; // IDs
  startDate: GameDate; // When this era begins
  endDate: GameDate; // When this era ends
}

export interface LogEntry {
  message: string;
  timestamp: Date;
  type: 'info' | 'action' | 'event' | 'error' | 'success' | 'warning';
}

export interface GameState {
  player: Player;
  currentEra: Era | null;
  commodities: Record<string, Commodity>;
  properties: Record<string, Property>;
  skills: Record<string, Skill>;
  jobs: Record<string, Job>;
  gameLog: LogEntry[];
  currentEvent: GameEvent | null;
  gameTurn: number;
  gameStarted: boolean;
  isLoadingEvent: boolean;
  marketNews: string[];
  priceHistory: Record<string, PriceHistory[]>; // Commodity ID -> price history
  activeMiniGame: { jobId: string; type: string } | null;
  currentDate: GameDate; // Current in-game date
  worldNewsHistory: WorldNewsEvent[]; // Historical news events
  showWorldNews: boolean; // Flag to display monthly news
  achievements: Achievement[]; // All available achievements
  newAchievementUnlocked: Achievement | null; // For showing notification
  prestige: PrestigeData; // Prestige system data (persists across runs)

  // Advanced Trading Mechanics
  marketSentiments: MarketSentiment[]; // Active market sentiments
  upcomingStockSplits: StockSplit[]; // Scheduled and pending stock splits
  bankruptcyHistory: BankruptcyEvent[]; // Historical bankruptcies

  // Win Conditions
  winConditions: WinCondition[]; // All available win conditions
  winConditionProgress: WinConditionProgress[]; // Player progress on win conditions
  gameWon: boolean; // Whether player has achieved a win condition
  winningCondition: WinCondition | null; // The win condition that was achieved
}

export type ActiveView = 'MARKET' | 'REAL_ESTATE' | 'SKILLS' | 'JOBS' | 'TRADING' | 'CASINO' | 'NEWS' | 'ACHIEVEMENTS' | 'STATISTICS' | 'DAILY_CHALLENGES' | 'PRESTIGE' | 'MILESTONES' | 'WIN_CONDITIONS';

// Prestige / New Game+ System
export interface PrestigeBonus {
  id: string;
  name: string;
  description: string;
  cost: number; // Prestige points required per level
  icon: string;
  effect: {
    type: 'starting_money' | 'starting_reputation' | 'skill_discount' | 'property_discount' | 'job_earnings' | 'trade_bonus' | 'unlock_speed' | 'event_frequency';
    value: number; // Percentage or flat bonus per level
  };
  maxLevel: number;
}

export interface PrestigeData {
  totalPrestigePoints: number; // Earned from all previous runs
  availablePrestigePoints: number; // Unspent points
  prestigeLevel: number; // Number of times prestiged
  bonuses: Record<string, number>; // Bonus ID -> current level
  lifetimeStats: {
    totalMoneyEarned: number;
    totalTradesCompleted: number;
    totalAchievementsUnlocked: number;
    totalTurnsPlayed: number;
    bestRun: {
      money: number;
      turn: number;
      achievements: number;
    };
  };
}

// Progression & Milestones System
export interface ReputationTier {
  id: string;
  name: string;
  minReputation: number;
  maxReputation: number;
  description: string;
  icon: string;
  color: string; // Tailwind color class
  unlocks: string[]; // Description of what unlocks
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  category: 'wealth' | 'property' | 'trading' | 'career' | 'skills' | 'reputation' | 'special';
  requirement: (gameState: GameState) => boolean;
  reward?: { money?: number; reputation?: number; unlocks?: string[] };
  icon: string;
  order: number; // Display order in milestone tree
}

export interface UnlockRequirement {
  type: 'reputation' | 'networth' | 'achievement' | 'milestone' | 'era' | 'skill' | 'property';
  value: number | string; // Numeric threshold or ID
  description: string;
}

export interface ProgressionData {
  currentReputationTier: string;
  unlockedMilestones: string[];
  unlockedContent: {
    properties: string[];
    jobs: string[];
    skills: string[];
    eras: string[];
  };
  milestonesToShow: string[]; // Next milestones to display
}

// Win Conditions System
export interface WinCondition {
  id: string;
  name: string;
  description: string;
  category: 'wealth' | 'property' | 'trading' | 'speed' | 'diversification' | 'era' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  requirement: (gameState: GameState) => boolean;
  progress: (gameState: GameState) => { current: number; target: number; unit: string };
  icon: string;
  reward?: {
    prestigePoints?: number;
    title?: string;
    unlocks?: string[];
  };
}

export interface WinConditionProgress {
  conditionId: string;
  completed: boolean;
  completedAtTurn?: number;
  completedDate?: GameDate;
  timeToComplete?: number; // turns taken
}