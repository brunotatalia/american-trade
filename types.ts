

import React from 'react';

export interface Order {
  id: string;
  commodityId: string;
  type: 'LIMIT_BUY' | 'LIMIT_SELL' | 'STOP_LOSS_SELL';
  price: number;
  quantity: number;
  createdAtTurn: number;
}

export interface Player {
  money: number;
  reputation: number;
  commodities: Record<string, { quantity: number; avgBuyPrice: number }>;
  properties: string[]; // IDs of owned properties
  skills: string[]; // IDs of unlocked skills
  orders: Order[];
}

export interface Commodity {
  id:string;
  name: string;
  price: number;
  volatility: number; // For price change simulation (0-1)
  description: string;
  icon?: React.ReactNode;
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
}

export type ActiveView = 'MARKET' | 'REAL_ESTATE' | 'SKILLS' | 'NEWS';