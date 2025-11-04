
import { Commodity, Property, Skill, Era } from './types';
import { CommodityIcon, PropertyIcon, SkillIcon, MoneyIcon, ReputationIcon, TrendUpIcon, TrendDownIcon, InfoIcon, NewsIcon } from './components/icons';
import React from 'react';

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const API_KEY_WARNING = "process.env.API_KEY is not set. Gemini API features will be disabled.";

// Influence System Constants
export const INITIAL_PLAYER_INFLUENCE = 0; // Start neutral
export const MAX_INFLUENCE = 100; // Iconic
export const MIN_INFLUENCE = -100; // Notorious
export const HIGH_INFLUENCE_THRESHOLD = 50; // Unlocks Blue Chip opportunities
export const LOW_INFLUENCE_THRESHOLD = -50; // Triggers SEC investigations

// Influence level labels
export const INFLUENCE_LEVELS = {
  ICONIC: { min: 75, label: 'Iconic', color: 'text-amber-400' },
  RESPECTED: { min: 50, label: 'Respected', color: 'text-green-400' },
  FAVORABLE: { min: 25, label: 'Favorable', color: 'text-blue-400' },
  NEUTRAL: { min: -24, label: 'Neutral', color: 'text-gray-400' },
  QUESTIONABLE: { min: -49, label: 'Questionable', color: 'text-orange-400' },
  NOTORIOUS: { min: -100, label: 'Notorious', color: 'text-red-400' }
};

// Influence change amounts
export const INFLUENCE_CHANGES = {
  LARGE_PROFIT_QUICK_TRADE: -2, // Seen as greedy
  SUCCESSFUL_STOP_LOSS: 1, // Seen as savvy
  BENEVOLENT_EVENT_CHOICE: 10,
  RUTHLESS_EVENT_CHOICE: -15,
  EVENT_TALK_SUCCESS: 5,
  EVENT_TALK_FAILURE: -10
};

export const GAME_TICK_INTERVAL_MS = 10000; // 10 seconds per turn
export const MAX_LOG_ENTRIES = 50;


export const COMMODITIES_DATA: Record<string, Commodity> = {
  CORN: { 
    id: 'CORN', 
    name: 'Corn', 
    price: 2, 
    volatility: 0.2, 
    description: "A staple crop. Prices can be affected by weather and global demand.",
    icon: React.createElement(CommodityIcon, {className: "text-yellow-400"})
  },
  OIL: { 
    id: 'OIL', 
    name: 'Crude Oil', 
    price: 50, 
    volatility: 0.4, 
    description: "Black gold. Highly volatile, influenced by geopolitical events and industrial demand.",
    icon: React.createElement(CommodityIcon, {className: "text-gray-400"})
  },
  GOLD: { 
    id: 'GOLD', 
    name: 'Gold', 
    price: 1800, 
    volatility: 0.1, 
    description: "A safe haven asset. Tends to rise in times of uncertainty.",
    icon: React.createElement(CommodityIcon, {className: "text-yellow-500"})
  },
  TECH_STOCKS: {
    id: 'TECH_STOCKS',
    name: 'Tech Stocks',
    price: 100,
    volatility: 0.6,
    description: "Shares in innovative technology companies. High risk, high reward.",
    icon: React.createElement(TrendUpIcon, {className: "text-blue-400"})
  },
  BITCOIN: {
    id: 'BITCOIN',
    name: 'Bitcoin',
    price: 30000,
    volatility: 0.7,
    description: 'A decentralized digital currency. Extremely volatile and influenced by adoption rates and regulation.',
    icon: React.createElement(TrendUpIcon, {className: "text-orange-400"})
  }
};

export const PROPERTIES_DATA: Record<string, Property> = {
  SMALL_APT: { 
    id: 'SMALL_APT', 
    name: 'Small Apartment', 
    cost: 5000, 
    rentPerTurn: 50, 
    description: "A modest apartment providing steady rental income.",
    icon: React.createElement(PropertyIcon, {className: "text-green-400"}) 
  },
  COMMERCIAL_SPACE: { 
    id: 'COMMERCIAL_SPACE', 
    name: 'Commercial Space', 
    cost: 25000, 
    rentPerTurn: 300, 
    description: "Retail or office space. Higher income potential, but also higher upkeep.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-400"})
  },
  WAREHOUSE: {
    id: 'WAREHOUSE',
    name: 'Warehouse',
    cost: 15000,
    rentPerTurn: 150,
    description: "Storage facility, essential for large scale commodity trading.",
    icon: React.createElement(PropertyIcon, {className: "text-yellow-600"})
  }
};

export const SKILLS_DATA: Record<string, Skill> = {
  BASIC_NEGOTIATION: { 
    id: 'BASIC_NEGOTIATION', 
    name: 'Basic Negotiation', 
    cost: 200, 
    description: "Learn the fundamentals of striking a good deal.", 
    effectDescription: "Slightly better buy/sell prices for commodities (approx 1-2%).",
    icon: React.createElement(SkillIcon, {className: "text-purple-400"})
  },
  MARKET_ANALYSIS: { 
    id: 'MARKET_ANALYSIS', 
    name: 'Market Analysis', 
    cost: 1000, 
    description: "Understand market trends and predict price movements.", 
    effectDescription: "Reduces commodity price volatility impact slightly, provides better market insights.",
    icon: React.createElement(SkillIcon, {className: "text-cyan-400"})
  },
  REAL_ESTATE_MGMT: {
    id: 'REAL_ESTATE_MGMT',
    name: 'Real Estate Management',
    cost: 5000,
    description: "Efficiently manage properties to maximize rental income.",
    effectDescription: "Increases rental income from properties by 10%.",
    icon: React.createElement(SkillIcon, {className: "text-orange-400"})
  }
};

export const ERAS_DATA: Era[] = [
  {
    id: 'POST_WAR_BOOM',
    name: 'Post-War Boom (1950s)',
    description: "A period of economic prosperity and growth in America. Manufacturing is king.",
    startingMoney: 100,
    marketVolatilityModifier: 0.8,
    availableCommodities: ['CORN', 'OIL'],
    availableProperties: ['SMALL_APT'],
    availableSkills: ['BASIC_NEGOTIATION']
  },
  {
    id: 'DOTCOM_BUBBLE',
    name: 'Dot-com Bubble (1990s)',
    description: "The rise of the internet and tech companies. High volatility and opportunity.",
    startingMoney: 50,
    marketVolatilityModifier: 1.5,
    availableCommodities: ['OIL', 'TECH_STOCKS', 'GOLD'],
    availableProperties: ['SMALL_APT', 'COMMERCIAL_SPACE'],
    availableSkills: ['BASIC_NEGOTIATION', 'MARKET_ANALYSIS']
  },
  {
    id: 'MODERN_ERA',
    name: 'Modern Era (2020s)',
    description: "A complex global economy with rapid technological change and diverse investment opportunities.",
    startingMoney: 75,
    marketVolatilityModifier: 1.2,
    availableCommodities: ['CORN', 'OIL', 'GOLD', 'TECH_STOCKS', 'BITCOIN'],
    availableProperties: ['SMALL_APT', 'COMMERCIAL_SPACE', 'WAREHOUSE'],
    availableSkills: ['BASIC_NEGOTIATION', 'MARKET_ANALYSIS', 'REAL_ESTATE_MGMT']
  }
];
