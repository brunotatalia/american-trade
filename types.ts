

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
}

export interface Commodity {
  id: string;
  name: string;
  price: number;
  volatility: number; // For price change simulation (0-1)
  description: string;
  icon?: React.ReactNode;
  category?: 'agricultural' | 'energy' | 'precious_metal' | 'stock' | 'bond' | 'currency' | 'crypto'; // For fee calculation
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
}

export type ActiveView = 'MARKET' | 'REAL_ESTATE' | 'SKILLS' | 'JOBS' | 'TRADING' | 'CASINO' | 'NEWS';