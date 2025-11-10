

import React from 'react';

export interface Order {
  id: string;
  commodityId: string;
  type: 'LIMIT_BUY' | 'LIMIT_SELL' | 'STOP_LOSS_SELL';
  price: number;
  quantity: number;
  createdAtTurn: number;
}

export interface TradingStats {
  totalTrades: number;
  profitableTrades: number;
  totalProfit: number;
  totalDividends: number;
}

export interface PlayerProgress {
  currentTier: number; // 0-4 (Beginner, Amateur, Professional, Expert, Master)
  tierProgress: number; // 0-100 percentage to next tier
  completedMilestones: string[]; // IDs of completed milestones
  claimedMilestones: string[]; // IDs of claimed milestones
  achievements: string[]; // IDs of earned achievements
  highestNetWorth: number;
  totalMoneyEarned: number;
}

export interface Player {
  money: number;
  reputation: number;
  commodities: Record<string, { quantity: number; avgBuyPrice: number }>;
  properties: string[]; // IDs of owned properties
  skills: string[]; // IDs of unlocked skills
  orders: Order[];
  tradingStats: TradingStats;
  progress: PlayerProgress;
}

export interface MarketSentiment {
  commodityId: string;
  sentiment: number; // -1.0 to 1.0
  source: 'analyst' | 'news' | 'technical' | 'fundamental' | 'social';
  expiresAtTurn: number;
  description: string;
}

export interface Commodity {
  id:string;
  name: string;
  price: number;
  volatility: number; // For price change simulation (0-1)
  description: string;
  icon?: React.ReactNode;
  category?: 'agriculture' | 'energy' | 'precious_metals' | 'stocks' | 'crypto' | 'bonds';
  dividendYield?: number; // Annual dividend yield as percentage
  lastDividendTurn?: number;
  splitAnnouncement?: { ratio: number; executionTurn: number };
  bankruptcyRisk?: number; // 0-1 probability per turn
  isBankrupt?: boolean;
}

export interface Property {
  id: string;
  name: string;
  cost: number;
  rentPerTurn: number;
  description: string;
  icon?: React.ReactNode;
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

export interface Era {
  id: string;
  name: string;
  description: string;
  startingMoney: number;
  marketVolatilityModifier: number; // e.g., 1.0 for normal, 1.5 for more volatile
  availableCommodities: string[]; // IDs
  availableProperties: string[]; // IDs
  availableSkills: string[]; // IDs
}

export interface LogEntry {
  message: string;
  timestamp: Date;
  type: 'info' | 'action' | 'event' | 'error' | 'success' | 'warning';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  category: 'wealth' | 'property' | 'trading' | 'career' | 'skills' | 'reputation' | 'special';
  tier: number; // Which tier it unlocks at (0-4)
  requirement: (state: GameState) => boolean;
  reward: {
    money?: number;
    reputation?: number;
    unlocks?: string[]; // IDs of things to unlock
  };
  priority?: 'low' | 'medium' | 'high';
}

export interface WinCondition {
  id: string;
  name: string;
  description: string;
  category: 'wealth' | 'property' | 'trading' | 'speed' | 'diversification' | 'special';
  prestigePoints: number;
  checkCompleted: (state: GameState) => boolean;
  icon?: string;
}

export interface GameState {
  player: Player;
  currentEra: Era | null;
  commodities: Record<string, Commodity>;
  properties: Record<string, Property>;
  skills: Record<string, Skill>;
  gameLog: LogEntry[];
  currentEvent: GameEvent | null;
  gameTurn: number;
  gameStarted: boolean;
  isLoadingEvent: boolean;
  marketNews: string[];
  marketSentiments: MarketSentiment[];
  milestones: Record<string, Milestone>;
  winConditions: Record<string, WinCondition>;
  victoryAchieved?: WinCondition;
}

export type ActiveView = 'MARKET' | 'REAL_ESTATE' | 'SKILLS' | 'NEWS' | 'MILESTONES' | 'WIN_CONDITIONS';