
import { Commodity, Property, Skill, Era } from './types';
import { CommodityIcon, PropertyIcon, SkillIcon, MoneyIcon, ReputationIcon, TrendUpIcon, TrendDownIcon, InfoIcon, NewsIcon } from './components/icons';
import React from 'react';

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
export const API_KEY_WARNING = "process.env.API_KEY is not set. Gemini API features will be disabled.";

export const INITIAL_PLAYER_REPUTATION = 10;
export const GAME_TICK_INTERVAL_MS = 10000; // 10 seconds per turn
export const MAX_LOG_ENTRIES = 50;

// Transaction Fees & Taxes (realistic percentages)
export const COMMODITY_TRANSACTION_FEE = 0.001; // 0.1% broker fee
export const STOCK_TRANSACTION_FEE = 0.002; // 0.2% broker fee for stocks
export const CAPITAL_GAINS_TAX_SHORT = 0.15; // 15% tax on profits
export const CAPITAL_GAINS_TAX_LONG = 0.10; // 10% tax on long-term holdings (future use)
export const PROPERTY_TRANSACTION_FEE = 0.06; // 6% real estate agent commission
export const PROPERTY_MAINTENANCE_RATE = 0.01; // 1% of property value per year (divided by turns)

// Real-life game mechanics
export const ANNUAL_INFLATION_RATE = 0.03; // 3% annual inflation
export const TURNS_PER_YEAR = 52; // Assuming each turn is ~1 week
export const PROPERTY_APPRECIATION_RATE = 0.04; // 4% annual appreciation
export const BOND_YIELD_TREASURY = 0.04; // 4% annual yield on treasury bonds
export const BOND_YIELD_CORPORATE = 0.06; // 6% annual yield on corporate bonds

// Market mechanics
export const MARKET_DEPTH_IMPACT_THRESHOLD = 100; // Orders above this size impact price
export const MAX_SLIPPAGE_PERCENT = 0.05; // Maximum 5% slippage on large orders


export const COMMODITIES_DATA: Record<string, Commodity> = {
  // Agricultural Commodities
  CORN: {
    id: 'CORN',
    name: 'Corn',
    price: 4.50,
    volatility: 0.15,
    description: "A staple crop. Prices affected by weather, global demand, and biofuel production.",
    icon: React.createElement(CommodityIcon, {className: "text-yellow-400"}),
    category: 'agricultural' as const
  },
  WHEAT: {
    id: 'WHEAT',
    name: 'Wheat',
    price: 6.20,
    volatility: 0.18,
    description: "Essential grain for bread and food products. Influenced by weather and international trade.",
    icon: React.createElement(CommodityIcon, {className: "text-amber-600"}),
    category: 'agricultural' as const
  },
  COTTON: {
    id: 'COTTON',
    name: 'Cotton',
    price: 0.75,
    volatility: 0.22,
    description: "Textile fiber commodity. Demand driven by fashion industry and manufacturing.",
    icon: React.createElement(CommodityIcon, {className: "text-gray-100"}),
    category: 'agricultural' as const
  },
  COFFEE: {
    id: 'COFFEE',
    name: 'Coffee',
    price: 1.80,
    volatility: 0.25,
    description: "Global beverage commodity. Highly sensitive to weather in Brazil and Colombia.",
    icon: React.createElement(CommodityIcon, {className: "text-amber-800"}),
    category: 'agricultural' as const
  },

  // Energy Commodities
  OIL: {
    id: 'OIL',
    name: 'Crude Oil',
    price: 75,
    volatility: 0.35,
    description: "Black gold. Highly volatile, influenced by geopolitical events and industrial demand.",
    icon: React.createElement(CommodityIcon, {className: "text-gray-400"}),
    category: 'energy' as const
  },
  NATURAL_GAS: {
    id: 'NATURAL_GAS',
    name: 'Natural Gas',
    price: 3.50,
    volatility: 0.40,
    description: "Clean-burning fuel for heating and electricity. Seasonal demand patterns.",
    icon: React.createElement(CommodityIcon, {className: "text-blue-300"}),
    category: 'energy' as const
  },

  // Precious Metals
  GOLD: {
    id: 'GOLD',
    name: 'Gold',
    price: 2000,
    volatility: 0.08,
    description: "A safe haven asset. Tends to rise in times of uncertainty and inflation.",
    icon: React.createElement(CommodityIcon, {className: "text-yellow-500"}),
    category: 'precious_metal' as const
  },
  SILVER: {
    id: 'SILVER',
    name: 'Silver',
    price: 24,
    volatility: 0.15,
    description: "Industrial and precious metal. Used in electronics, solar panels, and jewelry.",
    icon: React.createElement(CommodityIcon, {className: "text-gray-300"}),
    category: 'precious_metal' as const
  },

  // Stocks & Securities
  TECH_STOCKS: {
    id: 'TECH_STOCKS',
    name: 'Tech Stocks',
    price: 150,
    volatility: 0.50,
    description: "Shares in innovative technology companies. High risk, high reward.",
    icon: React.createElement(TrendUpIcon, {className: "text-blue-400"}),
    category: 'stock' as const
  },
  TREASURY_BONDS: {
    id: 'TREASURY_BONDS',
    name: 'Treasury Bonds',
    price: 1000,
    volatility: 0.05,
    description: "US Government bonds. Very safe, low returns. Generates 4% annual yield.",
    icon: React.createElement(TrendDownIcon, {className: "text-green-600"}),
    category: 'bond' as const
  },
  CORPORATE_BONDS: {
    id: 'CORPORATE_BONDS',
    name: 'Corporate Bonds',
    price: 950,
    volatility: 0.10,
    description: "Bonds issued by corporations. Higher risk than government bonds. Generates 6% annual yield.",
    icon: React.createElement(TrendDownIcon, {className: "text-blue-600"}),
    category: 'bond' as const
  },
  INDEX_FUND: {
    id: 'INDEX_FUND',
    name: 'S&P 500 Index',
    price: 450,
    volatility: 0.20,
    description: "Diversified portfolio tracking 500 large US companies. Balanced risk/reward.",
    icon: React.createElement(TrendUpIcon, {className: "text-purple-500"}),
    category: 'stock' as const
  },

  // Currency
  EUR_USD: {
    id: 'EUR_USD',
    name: 'EUR/USD',
    price: 1.08,
    volatility: 0.12,
    description: "Euro to US Dollar exchange rate. Influenced by central bank policies and trade.",
    icon: React.createElement(MoneyIcon, {className: "text-blue-500"}),
    category: 'currency' as const
  },

  // Cryptocurrency (Modern Era Only)
  BITCOIN: {
    id: 'BITCOIN',
    name: 'Bitcoin',
    price: 45000,
    volatility: 0.65,
    description: 'Decentralized digital currency. Extremely volatile, influenced by adoption and regulation.',
    icon: React.createElement(TrendUpIcon, {className: "text-orange-400"}),
    category: 'crypto' as const
  },
  ETHEREUM: {
    id: 'ETHEREUM',
    name: 'Ethereum',
    price: 2500,
    volatility: 0.70,
    description: 'Smart contract platform and cryptocurrency. High volatility with strong tech fundamentals.',
    icon: React.createElement(TrendUpIcon, {className: "text-purple-400"}),
    category: 'crypto' as const
  }
};

export const PROPERTIES_DATA: Record<string, Property> = {
  // Residential Properties
  SMALL_APT: {
    id: 'SMALL_APT',
    name: 'Small Apartment',
    cost: 80000,
    rentPerTurn: 450,
    description: "A modest 1-bedroom apartment. Steady rental income with moderate maintenance.",
    icon: React.createElement(PropertyIcon, {className: "text-green-400"})
  },
  MULTI_FAMILY: {
    id: 'MULTI_FAMILY',
    name: 'Multi-family Housing',
    cost: 350000,
    rentPerTurn: 2200,
    description: "4-unit apartment building. Higher income but requires active management.",
    icon: React.createElement(PropertyIcon, {className: "text-green-600"})
  },
  LUXURY_CONDO: {
    id: 'LUXURY_CONDO',
    name: 'Luxury Condo',
    cost: 500000,
    rentPerTurn: 2800,
    description: "High-end condominium in prime location. Attracts premium tenants.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-500"})
  },

  // Commercial Properties
  COMMERCIAL_SPACE: {
    id: 'COMMERCIAL_SPACE',
    name: 'Commercial Space',
    cost: 250000,
    rentPerTurn: 1800,
    description: "Retail or office space. Income varies with economic conditions.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-400"})
  },
  STRIP_MALL: {
    id: 'STRIP_MALL',
    name: 'Strip Mall',
    cost: 750000,
    rentPerTurn: 4500,
    description: "Small shopping center with multiple tenants. Diversified commercial income.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-600"})
  },

  // Industrial Properties
  WAREHOUSE: {
    id: 'WAREHOUSE',
    name: 'Warehouse',
    cost: 200000,
    rentPerTurn: 1400,
    description: "Industrial storage facility. Essential for logistics and distribution.",
    icon: React.createElement(PropertyIcon, {className: "text-yellow-600"})
  },
  INDUSTRIAL_BUILDING: {
    id: 'INDUSTRIAL_BUILDING',
    name: 'Industrial Building',
    cost: 600000,
    rentPerTurn: 3800,
    description: "Large manufacturing or distribution facility. Long-term stable tenants.",
    icon: React.createElement(PropertyIcon, {className: "text-orange-600"})
  },

  // Land
  VACANT_LAND: {
    id: 'VACANT_LAND',
    name: 'Vacant Land',
    cost: 50000,
    rentPerTurn: 0,
    description: "Undeveloped land. No immediate income but appreciates over time.",
    icon: React.createElement(PropertyIcon, {className: "text-amber-800"})
  },
  FARMLAND: {
    id: 'FARMLAND',
    name: 'Farmland',
    cost: 120000,
    rentPerTurn: 600,
    description: "Agricultural land leased to farmers. Stable long-term investment.",
    icon: React.createElement(PropertyIcon, {className: "text-green-800"})
  }
};

export const SKILLS_DATA: Record<string, Skill> = {
  // Trading Skills
  BASIC_NEGOTIATION: {
    id: 'BASIC_NEGOTIATION',
    name: 'Basic Negotiation',
    cost: 500,
    description: "Learn the fundamentals of striking a good deal.",
    effectDescription: "2% better buy/sell prices for commodities.",
    icon: React.createElement(SkillIcon, {className: "text-purple-400"})
  },
  ADVANCED_NEGOTIATION: {
    id: 'ADVANCED_NEGOTIATION',
    name: 'Advanced Negotiation',
    cost: 2500,
    description: "Master the art of deal-making and price negotiation.",
    effectDescription: "4% better buy/sell prices. Reduces transaction fees by 25%.",
    icon: React.createElement(SkillIcon, {className: "text-purple-600"})
  },
  MARKET_ANALYSIS: {
    id: 'MARKET_ANALYSIS',
    name: 'Market Analysis',
    cost: 1500,
    description: "Understand market trends and predict price movements.",
    effectDescription: "Reduces commodity price volatility by 20%.",
    icon: React.createElement(SkillIcon, {className: "text-cyan-400"})
  },
  TECHNICAL_ANALYSIS: {
    id: 'TECHNICAL_ANALYSIS',
    name: 'Technical Analysis',
    cost: 3500,
    description: "Advanced charting and pattern recognition for trading.",
    effectDescription: "Further reduces volatility by 15%. See price trends.",
    icon: React.createElement(SkillIcon, {className: "text-cyan-600"})
  },
  RISK_MANAGEMENT: {
    id: 'RISK_MANAGEMENT',
    name: 'Risk Management',
    cost: 4000,
    description: "Learn to protect your portfolio from major losses.",
    effectDescription: "Reduces impact of negative events by 50%.",
    icon: React.createElement(SkillIcon, {className: "text-red-500"})
  },

  // Real Estate Skills
  REAL_ESTATE_MGMT: {
    id: 'REAL_ESTATE_MGMT',
    name: 'Real Estate Management',
    cost: 3000,
    description: "Efficiently manage properties to maximize rental income.",
    effectDescription: "Increases rental income from properties by 15%.",
    icon: React.createElement(SkillIcon, {className: "text-orange-400"})
  },
  PROPERTY_DEVELOPMENT: {
    id: 'PROPERTY_DEVELOPMENT',
    name: 'Property Development',
    cost: 8000,
    description: "Develop and improve properties for higher returns.",
    effectDescription: "Properties appreciate 50% faster. Unlock renovation options.",
    icon: React.createElement(SkillIcon, {className: "text-orange-600"})
  },

  // Financial Skills
  TAX_OPTIMIZATION: {
    id: 'TAX_OPTIMIZATION',
    name: 'Tax Optimization',
    cost: 5000,
    description: "Learn legal strategies to minimize tax burden.",
    effectDescription: "Reduces taxes on all transactions by 40%.",
    icon: React.createElement(SkillIcon, {className: "text-green-500"})
  },
  DIVERSIFICATION: {
    id: 'DIVERSIFICATION',
    name: 'Portfolio Diversification',
    cost: 6000,
    description: "Spread risk across multiple asset classes.",
    effectDescription: "Unlocks ability to hold more positions. Reduces overall portfolio risk.",
    icon: React.createElement(SkillIcon, {className: "text-indigo-500"})
  },

  // Business Skills
  NETWORKING: {
    id: 'NETWORKING',
    name: 'Business Networking',
    cost: 2000,
    description: "Build connections for better opportunities.",
    effectDescription: "Increases chance of positive events. Better event outcomes.",
    icon: React.createElement(SkillIcon, {className: "text-pink-400"})
  },
  FINANCIAL_LITERACY: {
    id: 'FINANCIAL_LITERACY',
    name: 'Financial Literacy',
    cost: 1000,
    description: "Deep understanding of financial markets and instruments.",
    effectDescription: "Unlocks detailed market information and analytics.",
    icon: React.createElement(SkillIcon, {className: "text-blue-500"})
  }
};

export const ERAS_DATA: Era[] = [
  {
    id: 'POST_WAR_BOOM',
    name: 'Post-War Boom (1950s)',
    description: "A period of economic prosperity and growth in America. Manufacturing is king.",
    startingMoney: 10000,
    marketVolatilityModifier: 0.7,
    availableCommodities: ['CORN', 'WHEAT', 'COTTON', 'OIL', 'GOLD', 'SILVER', 'TREASURY_BONDS'],
    availableProperties: ['SMALL_APT', 'COMMERCIAL_SPACE', 'WAREHOUSE', 'FARMLAND', 'VACANT_LAND'],
    availableSkills: ['BASIC_NEGOTIATION', 'MARKET_ANALYSIS', 'REAL_ESTATE_MGMT', 'FINANCIAL_LITERACY']
  },
  {
    id: 'DOTCOM_BUBBLE',
    name: 'Dot-com Bubble (1990s)',
    description: "The rise of the internet and tech companies. High volatility and opportunity.",
    startingMoney: 25000,
    marketVolatilityModifier: 1.4,
    availableCommodities: ['CORN', 'WHEAT', 'OIL', 'NATURAL_GAS', 'GOLD', 'SILVER', 'TECH_STOCKS', 'TREASURY_BONDS', 'CORPORATE_BONDS', 'INDEX_FUND', 'EUR_USD'],
    availableProperties: ['SMALL_APT', 'MULTI_FAMILY', 'COMMERCIAL_SPACE', 'STRIP_MALL', 'WAREHOUSE', 'INDUSTRIAL_BUILDING', 'VACANT_LAND'],
    availableSkills: ['BASIC_NEGOTIATION', 'ADVANCED_NEGOTIATION', 'MARKET_ANALYSIS', 'TECHNICAL_ANALYSIS', 'REAL_ESTATE_MGMT', 'RISK_MANAGEMENT', 'NETWORKING', 'FINANCIAL_LITERACY', 'TAX_OPTIMIZATION']
  },
  {
    id: 'MODERN_ERA',
    name: 'Modern Era (2020s)',
    description: "A complex global economy with rapid technological change and diverse investment opportunities.",
    startingMoney: 50000,
    marketVolatilityModifier: 1.1,
    availableCommodities: ['CORN', 'WHEAT', 'COTTON', 'COFFEE', 'OIL', 'NATURAL_GAS', 'GOLD', 'SILVER', 'TECH_STOCKS', 'TREASURY_BONDS', 'CORPORATE_BONDS', 'INDEX_FUND', 'EUR_USD', 'BITCOIN', 'ETHEREUM'],
    availableProperties: ['SMALL_APT', 'MULTI_FAMILY', 'LUXURY_CONDO', 'COMMERCIAL_SPACE', 'STRIP_MALL', 'WAREHOUSE', 'INDUSTRIAL_BUILDING', 'VACANT_LAND', 'FARMLAND'],
    availableSkills: ['BASIC_NEGOTIATION', 'ADVANCED_NEGOTIATION', 'MARKET_ANALYSIS', 'TECHNICAL_ANALYSIS', 'REAL_ESTATE_MGMT', 'PROPERTY_DEVELOPMENT', 'RISK_MANAGEMENT', 'TAX_OPTIMIZATION', 'DIVERSIFICATION', 'NETWORKING', 'FINANCIAL_LITERACY']
  }
];
