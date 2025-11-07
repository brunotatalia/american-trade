
import { Commodity, Property, Skill, Era, Job } from './types';
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
  // Residential - Entry Level
  STUDIO_APT: {
    id: 'STUDIO_APT',
    name: 'Studio Apartment',
    cost: 60000,
    rentPerTurn: 350,
    description: "Compact studio perfect for single tenants. Low maintenance, steady income.",
    icon: React.createElement(PropertyIcon, {className: "text-green-300"})
  },
  SMALL_APT: {
    id: 'SMALL_APT',
    name: '1-Bedroom Apartment',
    cost: 80000,
    rentPerTurn: 450,
    description: "Modest 1-bedroom apartment. Steady rental income with moderate maintenance.",
    icon: React.createElement(PropertyIcon, {className: "text-green-400"})
  },
  TWO_BED_APT: {
    id: 'TWO_BED_APT',
    name: '2-Bedroom Apartment',
    cost: 120000,
    rentPerTurn: 650,
    description: "Family-friendly apartment. Higher demand in suburban areas.",
    icon: React.createElement(PropertyIcon, {className: "text-green-500"})
  },
  TOWNHOUSE: {
    id: 'TOWNHOUSE',
    name: 'Townhouse',
    cost: 200000,
    rentPerTurn: 1100,
    description: "Multi-level townhouse with garage. Attracts families and young professionals.",
    icon: React.createElement(PropertyIcon, {className: "text-green-600"})
  },

  // Residential - Mid-tier
  MULTI_FAMILY: {
    id: 'MULTI_FAMILY',
    name: 'Multi-family Housing',
    cost: 350000,
    rentPerTurn: 2200,
    description: "4-unit apartment building. Multiple income streams, active management required.",
    icon: React.createElement(PropertyIcon, {className: "text-green-600"})
  },
  SINGLE_FAMILY_HOME: {
    id: 'SINGLE_FAMILY_HOME',
    name: 'Single Family Home',
    cost: 280000,
    rentPerTurn: 1500,
    description: "Detached home in residential neighborhood. Long-term tenants, low turnover.",
    icon: React.createElement(PropertyIcon, {className: "text-green-700"})
  },
  CONDO: {
    id: 'CONDO',
    name: 'Condominium',
    cost: 180000,
    rentPerTurn: 950,
    description: "Modern condo with HOA. Low maintenance, urban location premium.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-400"})
  },
  DUPLEX: {
    id: 'DUPLEX',
    name: 'Duplex',
    cost: 220000,
    rentPerTurn: 1300,
    description: "Two-unit property. Live in one, rent the other or double income.",
    icon: React.createElement(PropertyIcon, {className: "text-green-500"})
  },

  // Residential - Luxury
  LUXURY_CONDO: {
    id: 'LUXURY_CONDO',
    name: 'Luxury Penthouse',
    cost: 800000,
    rentPerTurn: 4200,
    description: "High-end penthouse with skyline views. Executive tenants, premium location.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-600"})
  },
  MANSION: {
    id: 'MANSION',
    name: 'Luxury Mansion',
    cost: 1500000,
    rentPerTurn: 7500,
    description: "Estate home with pool and grounds. Ultra-wealthy tenants, high maintenance.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-700"})
  },
  BEACH_HOUSE: {
    id: 'BEACH_HOUSE',
    name: 'Beach House',
    cost: 950000,
    rentPerTurn: 5200,
    description: "Oceanfront vacation property. Seasonal rentals, tourism-dependent.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-300"})
  },

  // Commercial - Small
  COMMERCIAL_SPACE: {
    id: 'COMMERCIAL_SPACE',
    name: 'Retail Space',
    cost: 250000,
    rentPerTurn: 1800,
    description: "Ground-floor retail space. Income varies with economic conditions.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-400"})
  },
  SMALL_OFFICE: {
    id: 'SMALL_OFFICE',
    name: 'Small Office',
    cost: 180000,
    rentPerTurn: 1200,
    description: "Professional office space. Suitable for startups and small businesses.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-300"})
  },
  RESTAURANT_SPACE: {
    id: 'RESTAURANT_SPACE',
    name: 'Restaurant Space',
    cost: 320000,
    rentPerTurn: 2100,
    description: "Commercial kitchen and dining area. Percentage rent possible with success.",
    icon: React.createElement(PropertyIcon, {className: "text-orange-400"})
  },
  COFFEE_SHOP: {
    id: 'COFFEE_SHOP',
    name: 'Coffee Shop',
    cost: 150000,
    rentPerTurn: 900,
    description: "Corner cafe location. High foot traffic, strong community presence.",
    icon: React.createElement(PropertyIcon, {className: "text-amber-600"})
  },

  // Commercial - Medium
  STRIP_MALL: {
    id: 'STRIP_MALL',
    name: 'Strip Mall',
    cost: 750000,
    rentPerTurn: 4500,
    description: "5-10 unit shopping center. Diversified tenants, stable income.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-600"})
  },
  OFFICE_BUILDING: {
    id: 'OFFICE_BUILDING',
    name: 'Office Building',
    cost: 1200000,
    rentPerTurn: 6800,
    description: "Multi-story office building. Corporate tenants, long-term leases.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-700"})
  },
  GAS_STATION: {
    id: 'GAS_STATION',
    name: 'Gas Station',
    cost: 680000,
    rentPerTurn: 3900,
    description: "Fuel station with convenience store. Franchise income plus rent.",
    icon: React.createElement(PropertyIcon, {className: "text-red-500"})
  },
  CAR_WASH: {
    id: 'CAR_WASH',
    name: 'Car Wash',
    cost: 420000,
    rentPerTurn: 2400,
    description: "Automated car wash facility. High margins, recurring customers.",
    icon: React.createElement(PropertyIcon, {className: "text-cyan-500"})
  },

  // Commercial - Large
  SHOPPING_CENTER: {
    id: 'SHOPPING_CENTER',
    name: 'Shopping Center',
    cost: 2500000,
    rentPerTurn: 13500,
    description: "Major retail center with anchor tenants. High traffic, complex management.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-800"})
  },
  HOTEL: {
    id: 'HOTEL',
    name: 'Boutique Hotel',
    cost: 1800000,
    rentPerTurn: 9200,
    description: "30-room hotel. Hospitality income, tourism-dependent, active management.",
    icon: React.createElement(PropertyIcon, {className: "text-indigo-600"})
  },
  MEDICAL_OFFICE: {
    id: 'MEDICAL_OFFICE',
    name: 'Medical Office Building',
    cost: 1400000,
    rentPerTurn: 7800,
    description: "Healthcare facility. Stable doctor/dentist tenants, specialized improvements.",
    icon: React.createElement(PropertyIcon, {className: "text-red-400"})
  },

  // Industrial
  WAREHOUSE: {
    id: 'WAREHOUSE',
    name: 'Warehouse',
    cost: 200000,
    rentPerTurn: 1400,
    description: "Basic storage facility. Essential for logistics and distribution.",
    icon: React.createElement(PropertyIcon, {className: "text-yellow-600"})
  },
  INDUSTRIAL_BUILDING: {
    id: 'INDUSTRIAL_BUILDING',
    name: 'Manufacturing Plant',
    cost: 900000,
    rentPerTurn: 5200,
    description: "Large industrial facility. Heavy equipment, long-term tenants.",
    icon: React.createElement(PropertyIcon, {className: "text-orange-700"})
  },
  DATA_CENTER: {
    id: 'DATA_CENTER',
    name: 'Data Center',
    cost: 2200000,
    rentPerTurn: 12000,
    description: "High-tech server facility. Premium rent, specialized infrastructure.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-500"})
  },
  DISTRIBUTION_CENTER: {
    id: 'DISTRIBUTION_CENTER',
    name: 'Distribution Center',
    cost: 1600000,
    rentPerTurn: 8800,
    description: "Logistics hub with loading docks. E-commerce boom benefits.",
    icon: React.createElement(PropertyIcon, {className: "text-orange-600"})
  },

  // Specialty Properties
  PARKING_LOT: {
    id: 'PARKING_LOT',
    name: 'Parking Lot',
    cost: 280000,
    rentPerTurn: 1600,
    description: "Downtown parking facility. Low maintenance, steady daily income.",
    icon: React.createElement(PropertyIcon, {className: "text-gray-500"})
  },
  STORAGE_UNITS: {
    id: 'STORAGE_UNITS',
    name: 'Self-Storage Facility',
    cost: 520000,
    rentPerTurn: 3100,
    description: "Climate-controlled storage units. Low overhead, high profit margins.",
    icon: React.createElement(PropertyIcon, {className: "text-yellow-500"})
  },
  MOBILE_HOME_PARK: {
    id: 'MOBILE_HOME_PARK',
    name: 'Mobile Home Park',
    cost: 650000,
    rentPerTurn: 3800,
    description: "Manufactured housing community. Steady lot rents, minimal vacancy.",
    icon: React.createElement(PropertyIcon, {className: "text-green-500"})
  },
  MARINA: {
    id: 'MARINA',
    name: 'Marina',
    cost: 1100000,
    rentPerTurn: 6200,
    description: "Boat slip rental facility. Seasonal income, wealthy clientele.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-500"})
  },

  // Land Development
  VACANT_LAND: {
    id: 'VACANT_LAND',
    name: 'Vacant Lot',
    cost: 50000,
    rentPerTurn: 0,
    description: "Undeveloped urban lot. No income but appreciates, development potential.",
    icon: React.createElement(PropertyIcon, {className: "text-amber-800"})
  },
  FARMLAND: {
    id: 'FARMLAND',
    name: 'Farmland',
    cost: 120000,
    rentPerTurn: 600,
    description: "Agricultural land leased to farmers. Stable long-term investment.",
    icon: React.createElement(PropertyIcon, {className: "text-green-800"})
  },
  TIMBERLAND: {
    id: 'TIMBERLAND',
    name: 'Timberland',
    cost: 300000,
    rentPerTurn: 800,
    description: "Forest land for lumber. Slow appreciation, harvesting cycles.",
    icon: React.createElement(PropertyIcon, {className: "text-green-900"})
  },
  COMMERCIAL_LAND: {
    id: 'COMMERCIAL_LAND',
    name: 'Commercial Lot',
    cost: 150000,
    rentPerTurn: 200,
    description: "Zoned for commercial use. Billboard income, development upside.",
    icon: React.createElement(PropertyIcon, {className: "text-gray-600"})
  },

  // Residential - Luxury
  PENTHOUSE: {
    id: 'PENTHOUSE',
    name: 'Luxury Penthouse',
    cost: 2500000,
    rentPerTurn: 8000,
    description: "Top-floor luxury unit. Premium rents, high appreciation.",
    icon: React.createElement(PropertyIcon, {className: "text-gold-500"})
  },
  WATERFRONT_CONDO: {
    id: 'WATERFRONT_CONDO',
    name: 'Waterfront Condo',
    cost: 1800000,
    rentPerTurn: 6000,
    description: "Ocean or lake view condo. Vacation rental potential.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-500"})
  },
  MOUNTAIN_CABIN: {
    id: 'MOUNTAIN_CABIN',
    name: 'Mountain Cabin',
    cost: 450000,
    rentPerTurn: 1500,
    description: "Vacation rental in the mountains. Seasonal income.",
    icon: React.createElement(PropertyIcon, {className: "text-green-600"})
  },
  GATED_COMMUNITY_HOME: {
    id: 'GATED_COMMUNITY_HOME',
    name: 'Gated Community Home',
    cost: 850000,
    rentPerTurn: 3200,
    description: "Secure neighborhood. Premium tenants, lower turnover.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-500"})
  },
  GOLF_COURSE_VILLA: {
    id: 'GOLF_COURSE_VILLA',
    name: 'Golf Course Villa',
    cost: 1500000,
    rentPerTurn: 5500,
    description: "Luxury home on golf course. Affluent renters.",
    icon: React.createElement(PropertyIcon, {className: "text-green-700"})
  },

  // Commercial - Retail
  CONVENIENCE_STORE: {
    id: 'CONVENIENCE_STORE',
    name: 'Convenience Store',
    cost: 650000,
    rentPerTurn: 3500,
    description: "24/7 retail. Consistent foot traffic, stable returns.",
    icon: React.createElement(PropertyIcon, {className: "text-orange-500"})
  },
  LAUNDROMAT: {
    id: 'LAUNDROMAT',
    name: 'Laundromat',
    cost: 550000,
    rentPerTurn: 2800,
    description: "Coin-operated laundry. Recession-resistant business.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-400"})
  },

  // Commercial - Office
  COWORKING_SPACE: {
    id: 'COWORKING_SPACE',
    name: 'Coworking Space',
    cost: 1200000,
    rentPerTurn: 6500,
    description: "Flexible office space. High demand from startups.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-600"})
  },
  LAW_OFFICE: {
    id: 'LAW_OFFICE',
    name: 'Law Office Complex',
    cost: 2800000,
    rentPerTurn: 13000,
    description: "Professional office space. Prestigious location.",
    icon: React.createElement(PropertyIcon, {className: "text-slate-700"})
  },
  TECH_OFFICE: {
    id: 'TECH_OFFICE',
    name: 'Tech Office Campus',
    cost: 5000000,
    rentPerTurn: 22000,
    description: "Modern tech workspace. High-paying corporate tenants.",
    icon: React.createElement(PropertyIcon, {className: "text-blue-700"})
  },

  // Industrial
  MANUFACTURING_PLANT: {
    id: 'MANUFACTURING_PLANT',
    name: 'Manufacturing Plant',
    cost: 6000000,
    rentPerTurn: 25000,
    description: "Industrial production facility. Long-term leases.",
    icon: React.createElement(PropertyIcon, {className: "text-gray-700"})
  },
  COLD_STORAGE: {
    id: 'COLD_STORAGE',
    name: 'Cold Storage Warehouse',
    cost: 3200000,
    rentPerTurn: 14000,
    description: "Refrigerated storage. Food industry demand.",
    icon: React.createElement(PropertyIcon, {className: "text-cyan-700"})
  },

  // Hospitality
  MOTEL: {
    id: 'MOTEL',
    name: 'Roadside Motel',
    cost: 1100000,
    rentPerTurn: 5000,
    description: "Budget accommodation. Highway traffic, steady income.",
    icon: React.createElement(PropertyIcon, {className: "text-orange-600"})
  },
  BOUTIQUE_HOTEL: {
    id: 'BOUTIQUE_HOTEL',
    name: 'Boutique Hotel',
    cost: 3800000,
    rentPerTurn: 16000,
    description: "Upscale small hotel. Premium rates, loyal customers.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-700"})
  },
  RESORT: {
    id: 'RESORT',
    name: 'Resort Property',
    cost: 12000000,
    rentPerTurn: 50000,
    description: "Full-service resort. High-end tourism destination.",
    icon: React.createElement(PropertyIcon, {className: "text-gold-700"})
  },
  BED_AND_BREAKFAST: {
    id: 'BED_AND_BREAKFAST',
    name: 'Bed & Breakfast',
    cost: 650000,
    rentPerTurn: 2800,
    description: "Charming small inn. Personal touch, repeat guests.",
    icon: React.createElement(PropertyIcon, {className: "text-pink-600"})
  },

  // Specialized
  SELF_STORAGE: {
    id: 'SELF_STORAGE',
    name: 'Self-Storage Facility',
    cost: 1800000,
    rentPerTurn: 9000,
    description: "Storage units. Low maintenance, high occupancy.",
    icon: React.createElement(PropertyIcon, {className: "text-slate-600"})
  },
  RV_PARK: {
    id: 'RV_PARK',
    name: 'RV Park',
    cost: 950000,
    rentPerTurn: 4200,
    description: "RV camping spots. Growing market, minimal overhead.",
    icon: React.createElement(PropertyIcon, {className: "text-green-500"})
  },
  BILLBOARD_SITE: {
    id: 'BILLBOARD_SITE',
    name: 'Billboard Property',
    cost: 200000,
    rentPerTurn: 800,
    description: "High-traffic advertising space. Passive income.",
    icon: React.createElement(PropertyIcon, {className: "text-yellow-500"})
  },
  CELL_TOWER_SITE: {
    id: 'CELL_TOWER_SITE',
    name: 'Cell Tower Lease',
    cost: 400000,
    rentPerTurn: 1800,
    description: "Telecommunications tower. Long-term contracts, reliable income.",
    icon: React.createElement(PropertyIcon, {className: "text-red-400"})
  },

  // Mixed Use
  MIXED_USE_BUILDING: {
    id: 'MIXED_USE_BUILDING',
    name: 'Mixed-Use Building',
    cost: 3500000,
    rentPerTurn: 16000,
    description: "Retail below, residential above. Diversified income.",
    icon: React.createElement(PropertyIcon, {className: "text-violet-600"})
  },
  LIFESTYLE_CENTER: {
    id: 'LIFESTYLE_CENTER',
    name: 'Lifestyle Center',
    cost: 8500000,
    rentPerTurn: 38000,
    description: "Upscale shopping and dining. Entertainment destination.",
    icon: React.createElement(PropertyIcon, {className: "text-pink-700"})
  },

  // Agricultural
  VINEYARD: {
    id: 'VINEYARD',
    name: 'Vineyard',
    cost: 2200000,
    rentPerTurn: 8500,
    description: "Wine grape production. Premium product, growing demand.",
    icon: React.createElement(PropertyIcon, {className: "text-purple-800"})
  },
  ORCHARD: {
    id: 'ORCHARD',
    name: 'Fruit Orchard',
    cost: 800000,
    rentPerTurn: 3500,
    description: "Tree fruit production. Seasonal harvest, stable returns.",
    icon: React.createElement(PropertyIcon, {className: "text-green-600"})
  },
  RANCH: {
    id: 'RANCH',
    name: 'Cattle Ranch',
    cost: 1500000,
    rentPerTurn: 6000,
    description: "Livestock operation. Beef production, grazing leases.",
    icon: React.createElement(PropertyIcon, {className: "text-amber-600"})
  },
  SOLAR_FARM: {
    id: 'SOLAR_FARM',
    name: 'Solar Farm',
    cost: 3000000,
    rentPerTurn: 13000,
    description: "Renewable energy production. Government incentives, long-term contracts.",
    icon: React.createElement(PropertyIcon, {className: "text-yellow-600"})
  },
  WIND_FARM: {
    id: 'WIND_FARM',
    name: 'Wind Farm',
    cost: 4500000,
    rentPerTurn: 18000,
    description: "Wind turbine energy. Green energy demand growing.",
    icon: React.createElement(PropertyIcon, {className: "text-sky-600"})
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
  },
  LEADERSHIP: {
    id: 'LEADERSHIP',
    name: 'Leadership',
    cost: 7000,
    description: "Inspire and lead teams to achieve greater success.",
    effectDescription: "+25% earnings from jobs. Unlocks management positions.",
    icon: React.createElement(SkillIcon, {className: "text-amber-500"})
  },
  TIME_MANAGEMENT: {
    id: 'TIME_MANAGEMENT',
    name: 'Time Management',
    cost: 2500,
    description: "Maximize productivity through efficient time allocation.",
    effectDescription: "+10% faster trading execution. Reduced cooldowns.",
    icon: React.createElement(SkillIcon, {className: "text-teal-400"})
  },

  // Accounting & Finance Skills
  ACCOUNTING_BASICS: {
    id: 'ACCOUNTING_BASICS',
    name: 'Accounting Basics',
    cost: 1800,
    description: "Understand balance sheets and financial statements.",
    effectDescription: "Better visibility into profit/loss. Track performance.",
    icon: React.createElement(SkillIcon, {className: "text-emerald-400"})
  },
  ADVANCED_ACCOUNTING: {
    id: 'ADVANCED_ACCOUNTING',
    name: 'Advanced Accounting',
    cost: 5500,
    description: "Master complex accounting principles and tax strategies.",
    effectDescription: "Additional 20% tax reduction. Better expense tracking.",
    icon: React.createElement(SkillIcon, {className: "text-emerald-600"})
  },
  LEGAL_KNOWLEDGE: {
    id: 'LEGAL_KNOWLEDGE',
    name: 'Legal Knowledge',
    cost: 4500,
    description: "Understand contracts, regulations, and legal frameworks.",
    effectDescription: "Avoid legal penalties. Better contract terms.",
    icon: React.createElement(SkillIcon, {className: "text-slate-400"})
  },

  // Marketing & Sales
  MARKETING_EXPERTISE: {
    id: 'MARKETING_EXPERTISE',
    name: 'Marketing Expertise',
    cost: 3500,
    description: "Promote properties and businesses effectively.",
    effectDescription: "+20% rental income. Faster property sales.",
    icon: React.createElement(SkillIcon, {className: "text-fuchsia-400"})
  },
  PSYCHOLOGY: {
    id: 'PSYCHOLOGY',
    name: 'Psychology',
    cost: 4000,
    description: "Understand human behavior and decision-making.",
    effectDescription: "+10% negotiation bonus. Better event choices.",
    icon: React.createElement(SkillIcon, {className: "text-violet-400"})
  },

  // Tech & Data Skills
  DATA_SCIENCE: {
    id: 'DATA_SCIENCE',
    name: 'Data Science',
    cost: 8500,
    description: "Use big data and algorithms for market predictions.",
    effectDescription: "Predictive analytics. See future price trends.",
    icon: React.createElement(SkillIcon, {className: "text-sky-500"})
  },
  PROGRAMMING: {
    id: 'PROGRAMMING',
    name: 'Programming',
    cost: 3000,
    description: "Build automated trading systems and tools.",
    effectDescription: "Automated trading bots. Faster execution.",
    icon: React.createElement(SkillIcon, {className: "text-lime-500"})
  },
  CYBERSECURITY: {
    id: 'CYBERSECURITY',
    name: 'Cybersecurity',
    cost: 5000,
    description: "Protect assets from digital threats and fraud.",
    effectDescription: "Prevents theft and fraud events. Secure transactions.",
    icon: React.createElement(SkillIcon, {className: "text-red-600"})
  },

  // Advanced Trading Skills
  ENTREPRENEURSHIP: {
    id: 'ENTREPRENEURSHIP',
    name: 'Entrepreneurship',
    cost: 10000,
    description: "Start and grow your own businesses.",
    effectDescription: "Unlocks business ownership. Passive income streams.",
    icon: React.createElement(SkillIcon, {className: "text-yellow-500"})
  },
  INTERNATIONAL_TRADE: {
    id: 'INTERNATIONAL_TRADE',
    name: 'International Trade',
    cost: 12000,
    description: "Access global markets and foreign investments.",
    effectDescription: "Unlocks international assets. Currency arbitrage.",
    icon: React.createElement(SkillIcon, {className: "text-blue-600"})
  },
  CRYPTOCURRENCY_EXPERT: {
    id: 'CRYPTOCURRENCY_EXPERT',
    name: 'Cryptocurrency Expert',
    cost: 6500,
    description: "Master blockchain technology and crypto trading.",
    effectDescription: "Better crypto returns. Lower crypto fees.",
    icon: React.createElement(SkillIcon, {className: "text-orange-500"})
  },
  STOCK_PICKING: {
    id: 'STOCK_PICKING',
    name: 'Stock Picking',
    cost: 5500,
    description: "Identify undervalued stocks for maximum returns.",
    effectDescription: "+15% stock trading profits. Better stock insights.",
    icon: React.createElement(SkillIcon, {className: "text-green-600"})
  },
  OPTIONS_TRADING_MASTERY: {
    id: 'OPTIONS_TRADING_MASTERY',
    name: 'Options Trading Mastery',
    cost: 9000,
    description: "Advanced options strategies and derivatives trading.",
    effectDescription: "-30% options premiums. Better strike price calculations.",
    icon: React.createElement(SkillIcon, {className: "text-purple-600"})
  },
  LEVERAGE_MASTERY: {
    id: 'LEVERAGE_MASTERY',
    name: 'Leverage Mastery',
    cost: 11000,
    description: "Use leverage safely for amplified returns.",
    effectDescription: "Unlocks 20x leverage. Better margin management.",
    icon: React.createElement(SkillIcon, {className: "text-rose-600"})
  },

  // Protection & Planning
  INSURANCE_KNOWLEDGE: {
    id: 'INSURANCE_KNOWLEDGE',
    name: 'Insurance Knowledge',
    cost: 4000,
    description: "Protect investments with appropriate insurance coverage.",
    effectDescription: "Reduces impact of disasters by 75%.",
    icon: React.createElement(SkillIcon, {className: "text-cyan-600"})
  },
  ESTATE_PLANNING: {
    id: 'ESTATE_PLANNING',
    name: 'Estate Planning',
    cost: 15000,
    description: "Preserve and transfer wealth across generations.",
    effectDescription: "Legacy bonuses. Reduced inheritance taxes.",
    icon: React.createElement(SkillIcon, {className: "text-amber-600"})
  },
  FUNDRAISING: {
    id: 'FUNDRAISING',
    name: 'Fundraising',
    cost: 7500,
    description: "Raise capital from investors and lenders.",
    effectDescription: "Access to loans with better interest rates.",
    icon: React.createElement(SkillIcon, {className: "text-indigo-600"})
  },

  // Communication & Soft Skills
  PUBLIC_SPEAKING: {
    id: 'PUBLIC_SPEAKING',
    name: 'Public Speaking',
    cost: 2500,
    description: "Communicate ideas persuasively to large audiences.",
    effectDescription: "+15% reputation gain from positive actions.",
    icon: React.createElement(SkillIcon, {className: "text-pink-500"})
  },
  CRITICAL_THINKING: {
    id: 'CRITICAL_THINKING',
    name: 'Critical Thinking',
    cost: 3500,
    description: "Analyze situations logically and make better decisions.",
    effectDescription: "Avoid bad investments. Better risk assessment.",
    icon: React.createElement(SkillIcon, {className: "text-slate-500"})
  },
  NEGOTIATION_MASTERY: {
    id: 'NEGOTIATION_MASTERY',
    name: 'Negotiation Mastery',
    cost: 8000,
    description: "Elite-level negotiation for the most complex deals.",
    effectDescription: "8% better prices. Unlock exclusive opportunities.",
    icon: React.createElement(SkillIcon, {className: "text-purple-700"})
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
    availableProperties: ['STUDIO_APT', 'SMALL_APT', 'TWO_BED_APT', 'TOWNHOUSE', 'SINGLE_FAMILY_HOME', 'DUPLEX', 'COMMERCIAL_SPACE', 'SMALL_OFFICE', 'WAREHOUSE', 'FARMLAND', 'VACANT_LAND', 'PARKING_LOT', 'FACTORY_BUILDING', 'MOTEL', 'BILLBOARD_SITE', 'MANUFACTURING_PLANT', 'DISTRIBUTION_CENTER', 'RESTAURANT_SPACE', 'GAS_STATION', 'RANCH', 'ORCHARD'],
    availableSkills: ['BASIC_NEGOTIATION', 'MARKET_ANALYSIS', 'REAL_ESTATE_MGMT', 'FINANCIAL_LITERACY', 'ACCOUNTING_BASICS', 'TIME_MANAGEMENT', 'PUBLIC_SPEAKING', 'LEADERSHIP', 'CRITICAL_THINKING', 'INSURANCE_KNOWLEDGE']
  },
  {
    id: 'DOTCOM_BUBBLE',
    name: 'Dot-com Bubble (1990s)',
    description: "The rise of the internet and tech companies. High volatility and opportunity.",
    startingMoney: 25000,
    marketVolatilityModifier: 1.4,
    availableCommodities: ['CORN', 'WHEAT', 'OIL', 'NATURAL_GAS', 'GOLD', 'SILVER', 'TECH_STOCKS', 'TREASURY_BONDS', 'CORPORATE_BONDS', 'INDEX_FUND', 'EUR_USD'],
    availableProperties: ['STUDIO_APT', 'SMALL_APT', 'TWO_BED_APT', 'TOWNHOUSE', 'MULTI_FAMILY', 'SINGLE_FAMILY_HOME', 'CONDO', 'DUPLEX', 'COMMERCIAL_SPACE', 'SMALL_OFFICE', 'RESTAURANT_SPACE', 'COFFEE_SHOP', 'STRIP_MALL', 'OFFICE_BUILDING', 'GAS_STATION', 'WAREHOUSE', 'INDUSTRIAL_BUILDING', 'PARKING_LOT', 'STORAGE_UNITS', 'FARMLAND', 'VACANT_LAND', 'COMMERCIAL_LAND', 'CAR_WASH', 'CONVENIENCE_STORE', 'LAUNDROMAT', 'HOTEL', 'MOTEL', 'SELF_STORAGE', 'RV_PARK', 'COWORKING_SPACE', 'DISTRIBUTION_CENTER', 'MANUFACTURING_PLANT', 'COLD_STORAGE', 'GATED_COMMUNITY_HOME', 'BEACH_HOUSE', 'MOUNTAIN_CABIN', 'BILLBOARD_SITE', 'CELL_TOWER_SITE', 'VINEYARD', 'ORCHARD', 'RANCH'],
    availableSkills: ['BASIC_NEGOTIATION', 'ADVANCED_NEGOTIATION', 'MARKET_ANALYSIS', 'TECHNICAL_ANALYSIS', 'REAL_ESTATE_MGMT', 'RISK_MANAGEMENT', 'NETWORKING', 'FINANCIAL_LITERACY', 'TAX_OPTIMIZATION', 'ACCOUNTING_BASICS', 'ADVANCED_ACCOUNTING', 'TIME_MANAGEMENT', 'LEADERSHIP', 'MARKETING_EXPERTISE', 'PROGRAMMING', 'STOCK_PICKING', 'PSYCHOLOGY', 'PUBLIC_SPEAKING', 'CRITICAL_THINKING', 'LEGAL_KNOWLEDGE', 'INSURANCE_KNOWLEDGE', 'FUNDRAISING']
  },
  {
    id: 'MODERN_ERA',
    name: 'Modern Era (2020s)',
    description: "A complex global economy with rapid technological change and diverse investment opportunities.",
    startingMoney: 50000,
    marketVolatilityModifier: 1.1,
    availableCommodities: ['CORN', 'WHEAT', 'COTTON', 'COFFEE', 'OIL', 'NATURAL_GAS', 'GOLD', 'SILVER', 'TECH_STOCKS', 'TREASURY_BONDS', 'CORPORATE_BONDS', 'INDEX_FUND', 'EUR_USD', 'BITCOIN', 'ETHEREUM'],
    availableProperties: ['STUDIO_APT', 'SMALL_APT', 'TWO_BED_APT', 'TOWNHOUSE', 'MULTI_FAMILY', 'SINGLE_FAMILY_HOME', 'CONDO', 'DUPLEX', 'LUXURY_CONDO', 'MANSION', 'BEACH_HOUSE', 'COMMERCIAL_SPACE', 'SMALL_OFFICE', 'RESTAURANT_SPACE', 'COFFEE_SHOP', 'STRIP_MALL', 'OFFICE_BUILDING', 'GAS_STATION', 'CAR_WASH', 'SHOPPING_CENTER', 'HOTEL', 'MEDICAL_OFFICE', 'WAREHOUSE', 'INDUSTRIAL_BUILDING', 'DATA_CENTER', 'DISTRIBUTION_CENTER', 'PARKING_LOT', 'STORAGE_UNITS', 'MOBILE_HOME_PARK', 'MARINA', 'VACANT_LAND', 'FARMLAND', 'TIMBERLAND', 'COMMERCIAL_LAND', 'PENTHOUSE', 'WATERFRONT_CONDO', 'MOUNTAIN_CABIN', 'GATED_COMMUNITY_HOME', 'GOLF_COURSE_VILLA', 'CONVENIENCE_STORE', 'LAUNDROMAT', 'COWORKING_SPACE', 'LAW_OFFICE', 'TECH_OFFICE', 'MANUFACTURING_PLANT', 'COLD_STORAGE', 'MOTEL', 'BOUTIQUE_HOTEL', 'RESORT', 'BED_AND_BREAKFAST', 'SELF_STORAGE', 'RV_PARK', 'BILLBOARD_SITE', 'CELL_TOWER_SITE', 'MIXED_USE_BUILDING', 'LIFESTYLE_CENTER', 'VINEYARD', 'ORCHARD', 'RANCH', 'SOLAR_FARM', 'WIND_FARM'],
    availableSkills: ['BASIC_NEGOTIATION', 'ADVANCED_NEGOTIATION', 'NEGOTIATION_MASTERY', 'MARKET_ANALYSIS', 'TECHNICAL_ANALYSIS', 'REAL_ESTATE_MGMT', 'PROPERTY_DEVELOPMENT', 'RISK_MANAGEMENT', 'TAX_OPTIMIZATION', 'DIVERSIFICATION', 'NETWORKING', 'FINANCIAL_LITERACY', 'LEADERSHIP', 'TIME_MANAGEMENT', 'ACCOUNTING_BASICS', 'ADVANCED_ACCOUNTING', 'LEGAL_KNOWLEDGE', 'MARKETING_EXPERTISE', 'PSYCHOLOGY', 'DATA_SCIENCE', 'PROGRAMMING', 'CYBERSECURITY', 'ENTREPRENEURSHIP', 'INTERNATIONAL_TRADE', 'CRYPTOCURRENCY_EXPERT', 'STOCK_PICKING', 'OPTIONS_TRADING_MASTERY', 'LEVERAGE_MASTERY', 'INSURANCE_KNOWLEDGE', 'ESTATE_PLANNING', 'FUNDRAISING', 'PUBLIC_SPEAKING', 'CRITICAL_THINKING']
  }
];

export const JOBS_DATA: Record<string, Job> = {
  // White Collar - Entry Level
  DATA_ENTRY_CLERK: {
    id: 'DATA_ENTRY_CLERK',
    title: 'Data Entry Clerk',
    category: 'white_collar',
    basePayPerTurn: 150,
    requiredSkills: [],
    description: "Enter data quickly and accurately. Speed and precision matter.",
    miniGameType: 'data_entry',
    difficulty: 'easy',
    icon: React.createElement(SkillIcon, {className: "text-gray-400"})
  },
  CUSTOMER_SERVICE_REP: {
    id: 'CUSTOMER_SERVICE_REP',
    title: 'Customer Service Representative',
    category: 'service',
    basePayPerTurn: 180,
    requiredSkills: [],
    description: "Handle customer inquiries and resolve issues. Pattern recognition required.",
    miniGameType: 'pattern_match',
    difficulty: 'easy',
    icon: React.createElement(SkillIcon, {className: "text-blue-300"})
  },

  // White Collar - Mid Level
  ACCOUNTANT: {
    id: 'ACCOUNTANT',
    title: 'Junior Accountant',
    category: 'white_collar',
    basePayPerTurn: 350,
    requiredSkills: ['FINANCIAL_LITERACY'],
    description: "Balance accounts and perform financial calculations. Math skills essential.",
    miniGameType: 'math_quiz',
    difficulty: 'medium',
    icon: React.createElement(MoneyIcon, {className: "text-green-500"})
  },
  FINANCIAL_ANALYST: {
    id: 'FINANCIAL_ANALYST',
    title: 'Financial Analyst',
    category: 'white_collar',
    basePayPerTurn: 500,
    requiredSkills: ['FINANCIAL_LITERACY', 'MARKET_ANALYSIS'],
    description: "Analyze market data and make recommendations. Advanced pattern recognition.",
    miniGameType: 'pattern_match',
    difficulty: 'hard',
    icon: React.createElement(TrendUpIcon, {className: "text-cyan-500"})
  },
  BUSINESS_CONSULTANT: {
    id: 'BUSINESS_CONSULTANT',
    title: 'Business Consultant',
    category: 'management',
    basePayPerTurn: 650,
    requiredSkills: ['ADVANCED_NEGOTIATION', 'NETWORKING'],
    description: "Solve complex business problems. Strategic thinking required.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-purple-500"})
  },

  // Tech Jobs
  IT_SUPPORT: {
    id: 'IT_SUPPORT',
    title: 'IT Support Specialist',
    category: 'tech',
    basePayPerTurn: 280,
    requiredSkills: [],
    description: "Troubleshoot technical issues. Pattern matching and problem solving.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-indigo-400"})
  },
  SOFTWARE_DEVELOPER: {
    id: 'SOFTWARE_DEVELOPER',
    title: 'Software Developer',
    category: 'tech',
    basePayPerTurn: 550,
    requiredSkills: ['TECHNICAL_ANALYSIS'],
    description: "Write code and debug programs. Logic puzzles and pattern recognition.",
    miniGameType: 'pattern_match',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-blue-600"})
  },
  DATA_SCIENTIST: {
    id: 'DATA_SCIENTIST',
    title: 'Data Scientist',
    category: 'tech',
    basePayPerTurn: 750,
    requiredSkills: ['TECHNICAL_ANALYSIS', 'MARKET_ANALYSIS'],
    description: "Analyze complex datasets. Advanced math and pattern recognition.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(TrendUpIcon, {className: "text-purple-600"})
  },

  // Blue Collar - Entry Level
  WAREHOUSE_WORKER: {
    id: 'WAREHOUSE_WORKER',
    title: 'Warehouse Worker',
    category: 'blue_collar',
    basePayPerTurn: 200,
    requiredSkills: [],
    description: "Load and organize cargo efficiently. Spatial awareness required.",
    miniGameType: 'cargo_load',
    difficulty: 'easy',
    icon: React.createElement(PropertyIcon, {className: "text-orange-400"})
  },
  DELIVERY_DRIVER: {
    id: 'DELIVERY_DRIVER',
    title: 'Delivery Driver',
    category: 'blue_collar',
    basePayPerTurn: 220,
    requiredSkills: [],
    description: "Plan efficient delivery routes. Time management critical.",
    miniGameType: 'delivery_route',
    difficulty: 'medium',
    icon: React.createElement(PropertyIcon, {className: "text-yellow-500"})
  },
  FACTORY_WORKER: {
    id: 'FACTORY_WORKER',
    title: 'Assembly Line Worker',
    category: 'blue_collar',
    basePayPerTurn: 240,
    requiredSkills: [],
    description: "Maintain production pace on assembly line. Timing is everything.",
    miniGameType: 'assembly_line',
    difficulty: 'medium',
    icon: React.createElement(PropertyIcon, {className: "text-gray-500"})
  },

  // Blue Collar - Skilled
  FORKLIFT_OPERATOR: {
    id: 'FORKLIFT_OPERATOR',
    title: 'Forklift Operator',
    category: 'blue_collar',
    basePayPerTurn: 320,
    requiredSkills: ['REAL_ESTATE_MGMT'], // represents management/organization skills
    description: "Operate heavy machinery to move cargo. Precision and speed required.",
    miniGameType: 'cargo_load',
    difficulty: 'hard',
    icon: React.createElement(PropertyIcon, {className: "text-orange-600"})
  },
  LOGISTICS_COORDINATOR: {
    id: 'LOGISTICS_COORDINATOR',
    title: 'Logistics Coordinator',
    category: 'blue_collar',
    basePayPerTurn: 400,
    requiredSkills: ['DIVERSIFICATION'], // represents multi-tasking
    description: "Coordinate complex delivery schedules. Multi-tasking essential.",
    miniGameType: 'delivery_route',
    difficulty: 'hard',
    icon: React.createElement(PropertyIcon, {className: "text-yellow-700"})
  },

  // Management
  OPERATIONS_MANAGER: {
    id: 'OPERATIONS_MANAGER',
    title: 'Operations Manager',
    category: 'management',
    basePayPerTurn: 600,
    requiredSkills: ['ADVANCED_NEGOTIATION', 'REAL_ESTATE_MGMT'],
    description: "Oversee production operations. Strategic planning and execution.",
    miniGameType: 'assembly_line',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-purple-600"})
  },
  SENIOR_MANAGER: {
    id: 'SENIOR_MANAGER',
    title: 'Senior Manager',
    category: 'management',
    basePayPerTurn: 850,
    requiredSkills: ['ADVANCED_NEGOTIATION', 'NETWORKING', 'DIVERSIFICATION'],
    description: "Lead teams and make critical decisions. All skills tested.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-gold-600"})
  },

  // Service Industry
  RESTAURANT_SERVER: {
    id: 'RESTAURANT_SERVER',
    title: 'Restaurant Server',
    category: 'service',
    basePayPerTurn: 160,
    requiredSkills: [],
    description: "Take orders and serve customers quickly. Speed and accuracy.",
    miniGameType: 'data_entry',
    difficulty: 'easy',
    icon: React.createElement(PropertyIcon, {className: "text-red-400"})
  },
  RETAIL_MANAGER: {
    id: 'RETAIL_MANAGER',
    title: 'Retail Store Manager',
    category: 'management',
    basePayPerTurn: 420,
    requiredSkills: ['NETWORKING'],
    description: "Manage store operations and staff. People skills required.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-blue-500"})
  },

  // Additional White Collar Jobs
  LOAN_OFFICER: {
    id: 'LOAN_OFFICER',
    title: 'Loan Officer',
    category: 'white_collar',
    basePayPerTurn: 450,
    requiredSkills: ['FINANCIAL_LITERACY', 'ACCOUNTING_BASICS'],
    description: "Evaluate loan applications and assess risk. Math and analysis required.",
    miniGameType: 'math_quiz',
    difficulty: 'medium',
    icon: React.createElement(MoneyIcon, {className: "text-emerald-500"})
  },
  INVESTMENT_BANKER: {
    id: 'INVESTMENT_BANKER',
    title: 'Investment Banker',
    category: 'white_collar',
    basePayPerTurn: 950,
    requiredSkills: ['ADVANCED_NEGOTIATION', 'MARKET_ANALYSIS', 'FINANCIAL_LITERACY'],
    description: "Structure complex financial deals. Elite math and negotiation.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(TrendUpIcon, {className: "text-gold-600"})
  },
  INSURANCE_AGENT: {
    id: 'INSURANCE_AGENT',
    title: 'Insurance Agent',
    category: 'white_collar',
    basePayPerTurn: 320,
    requiredSkills: ['BASIC_NEGOTIATION'],
    description: "Sell insurance policies and assess coverage needs. Pattern matching.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-cyan-500"})
  },
  STOCK_BROKER: {
    id: 'STOCK_BROKER',
    title: 'Stock Broker',
    category: 'white_collar',
    basePayPerTurn: 650,
    requiredSkills: ['MARKET_ANALYSIS', 'ADVANCED_NEGOTIATION'],
    description: "Execute trades for clients. Fast decision making required.",
    miniGameType: 'data_entry',
    difficulty: 'hard',
    icon: React.createElement(TrendUpIcon, {className: "text-green-600"})
  },
  BUSINESS_ANALYST: {
    id: 'BUSINESS_ANALYST',
    title: 'Business Analyst',
    category: 'white_collar',
    basePayPerTurn: 480,
    requiredSkills: ['FINANCIAL_LITERACY', 'CRITICAL_THINKING'],
    description: "Analyze business processes and recommend improvements.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-indigo-500"})
  },
  MARKETING_MANAGER: {
    id: 'MARKETING_MANAGER',
    title: 'Marketing Manager',
    category: 'management',
    basePayPerTurn: 580,
    requiredSkills: ['MARKETING_EXPERTISE', 'NETWORKING'],
    description: "Plan and execute marketing campaigns. Creative thinking.",
    miniGameType: 'pattern_match',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-fuchsia-600"})
  },
  HR_MANAGER: {
    id: 'HR_MANAGER',
    title: 'Human Resources Manager',
    category: 'management',
    basePayPerTurn: 520,
    requiredSkills: ['LEADERSHIP', 'PSYCHOLOGY'],
    description: "Manage hiring and employee relations. People skills essential.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-pink-600"})
  },
  SALES_EXECUTIVE: {
    id: 'SALES_EXECUTIVE',
    title: 'Sales Executive',
    category: 'white_collar',
    basePayPerTurn: 550,
    requiredSkills: ['ADVANCED_NEGOTIATION', 'PUBLIC_SPEAKING'],
    description: "Close high-value deals. Master negotiation required.",
    miniGameType: 'pattern_match',
    difficulty: 'hard',
    icon: React.createElement(MoneyIcon, {className: "text-amber-600"})
  },
  TAX_CONSULTANT: {
    id: 'TAX_CONSULTANT',
    title: 'Tax Consultant',
    category: 'white_collar',
    basePayPerTurn: 620,
    requiredSkills: ['ADVANCED_ACCOUNTING', 'TAX_OPTIMIZATION'],
    description: "Optimize tax strategies for clients. Complex calculations.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-green-700"})
  },

  // Additional Blue Collar Jobs
  ELECTRICIAN: {
    id: 'ELECTRICIAN',
    title: 'Electrician',
    category: 'blue_collar',
    basePayPerTurn: 380,
    requiredSkills: [],
    description: "Wire buildings and troubleshoot electrical systems. Pattern recognition.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-yellow-500"})
  },
  PLUMBER: {
    id: 'PLUMBER',
    title: 'Plumber',
    category: 'blue_collar',
    basePayPerTurn: 360,
    requiredSkills: [],
    description: "Install and repair plumbing systems. Spatial awareness needed.",
    miniGameType: 'cargo_load',
    difficulty: 'medium',
    icon: React.createElement(PropertyIcon, {className: "text-blue-600"})
  },
  HVAC_TECHNICIAN: {
    id: 'HVAC_TECHNICIAN',
    title: 'HVAC Technician',
    category: 'blue_collar',
    basePayPerTurn: 400,
    requiredSkills: [],
    description: "Maintain heating and cooling systems. Technical skills required.",
    miniGameType: 'assembly_line',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-sky-600"})
  },
  AUTO_MECHANIC: {
    id: 'AUTO_MECHANIC',
    title: 'Auto Mechanic',
    category: 'blue_collar',
    basePayPerTurn: 340,
    requiredSkills: [],
    description: "Diagnose and repair vehicles. Pattern matching essential.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-gray-600"})
  },
  FACTORY_OPERATOR: {
    id: 'FACTORY_OPERATOR',
    title: 'Factory Operator',
    category: 'blue_collar',
    basePayPerTurn: 240,
    requiredSkills: [],
    description: "Operate manufacturing equipment. Timing and precision.",
    miniGameType: 'assembly_line',
    difficulty: 'easy',
    icon: React.createElement(SkillIcon, {className: "text-slate-500"})
  },
  PAINTER: {
    id: 'PAINTER',
    title: 'Professional Painter',
    category: 'blue_collar',
    basePayPerTurn: 300,
    requiredSkills: [],
    description: "Paint buildings and structures. Steady hands required.",
    miniGameType: 'pattern_match',
    difficulty: 'easy',
    icon: React.createElement(SkillIcon, {className: "text-indigo-400"})
  },
  WELDER: {
    id: 'WELDER',
    title: 'Certified Welder',
    category: 'blue_collar',
    basePayPerTurn: 420,
    requiredSkills: [],
    description: "Join metal parts with precision. Focus and timing critical.",
    miniGameType: 'assembly_line',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-orange-600"})
  },
  HEAVY_EQUIPMENT_OPERATOR: {
    id: 'HEAVY_EQUIPMENT_OPERATOR',
    title: 'Heavy Equipment Operator',
    category: 'blue_collar',
    basePayPerTurn: 460,
    requiredSkills: [],
    description: "Operate bulldozers and excavators. Spatial planning required.",
    miniGameType: 'cargo_load',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-yellow-700"})
  },

  // Additional Service Jobs
  HOTEL_MANAGER: {
    id: 'HOTEL_MANAGER',
    title: 'Hotel Manager',
    category: 'service',
    basePayPerTurn: 480,
    requiredSkills: ['NETWORKING', 'MARKETING_EXPERTISE'],
    description: "Oversee hotel operations and guest services. Multi-tasking essential.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(PropertyIcon, {className: "text-purple-500"})
  },
  EVENT_PLANNER: {
    id: 'EVENT_PLANNER',
    title: 'Event Planner',
    category: 'service',
    basePayPerTurn: 400,
    requiredSkills: ['NETWORKING', 'TIME_MANAGEMENT'],
    description: "Coordinate events and manage logistics. Organization key.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-pink-500"})
  },
  REAL_ESTATE_AGENT: {
    id: 'REAL_ESTATE_AGENT',
    title: 'Real Estate Agent',
    category: 'service',
    basePayPerTurn: 520,
    requiredSkills: ['BASIC_NEGOTIATION', 'REAL_ESTATE_MGMT'],
    description: "Buy and sell properties for clients. Sales and market knowledge.",
    miniGameType: 'math_quiz',
    difficulty: 'medium',
    icon: React.createElement(PropertyIcon, {className: "text-orange-600"})
  },
  TRAVEL_AGENT: {
    id: 'TRAVEL_AGENT',
    title: 'Travel Agent',
    category: 'service',
    basePayPerTurn: 280,
    requiredSkills: [],
    description: "Plan trips and book travel arrangements. Organization required.",
    miniGameType: 'data_entry',
    difficulty: 'easy',
    icon: React.createElement(SkillIcon, {className: "text-sky-500"})
  },

  // Additional Tech Jobs
  NETWORK_ADMINISTRATOR: {
    id: 'NETWORK_ADMINISTRATOR',
    title: 'Network Administrator',
    category: 'tech',
    basePayPerTurn: 500,
    requiredSkills: ['PROGRAMMING'],
    description: "Maintain and secure computer networks. Technical problem solving.",
    miniGameType: 'pattern_match',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-indigo-600"})
  },
  CYBERSECURITY_ANALYST: {
    id: 'CYBERSECURITY_ANALYST',
    title: 'Cybersecurity Analyst',
    category: 'tech',
    basePayPerTurn: 720,
    requiredSkills: ['PROGRAMMING', 'CYBERSECURITY'],
    description: "Protect systems from cyber threats. Advanced pattern recognition.",
    miniGameType: 'pattern_match',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-red-700"})
  },
  UX_DESIGNER: {
    id: 'UX_DESIGNER',
    title: 'UX/UI Designer',
    category: 'tech',
    basePayPerTurn: 580,
    requiredSkills: ['PSYCHOLOGY'],
    description: "Design user interfaces and experiences. Creative problem solving.",
    miniGameType: 'pattern_match',
    difficulty: 'medium',
    icon: React.createElement(SkillIcon, {className: "text-violet-600"})
  },
  DEVOPS_ENGINEER: {
    id: 'DEVOPS_ENGINEER',
    title: 'DevOps Engineer',
    category: 'tech',
    basePayPerTurn: 780,
    requiredSkills: ['PROGRAMMING', 'TECHNICAL_ANALYSIS'],
    description: "Automate deployment pipelines. Advanced technical skills.",
    miniGameType: 'assembly_line',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-lime-700"})
  },
  AI_ENGINEER: {
    id: 'AI_ENGINEER',
    title: 'AI/ML Engineer',
    category: 'tech',
    basePayPerTurn: 920,
    requiredSkills: ['DATA_SCIENCE', 'PROGRAMMING'],
    description: "Build machine learning models. Elite technical and math skills.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-purple-700"})
  },

  // Additional Management Jobs
  PROJECT_MANAGER: {
    id: 'PROJECT_MANAGER',
    title: 'Project Manager',
    category: 'management',
    basePayPerTurn: 680,
    requiredSkills: ['LEADERSHIP', 'TIME_MANAGEMENT'],
    description: "Lead projects from start to finish. Organization and delegation.",
    miniGameType: 'delivery_route',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-blue-700"})
  },
  VP_SALES: {
    id: 'VP_SALES',
    title: 'VP of Sales',
    category: 'management',
    basePayPerTurn: 1100,
    requiredSkills: ['LEADERSHIP', 'ADVANCED_NEGOTIATION', 'PUBLIC_SPEAKING'],
    description: "Drive company-wide sales strategy. Executive leadership.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(MoneyIcon, {className: "text-gold-700"})
  },
  COO: {
    id: 'COO',
    title: 'Chief Operating Officer',
    category: 'management',
    basePayPerTurn: 1500,
    requiredSkills: ['LEADERSHIP', 'ENTREPRENEURSHIP', 'ADVANCED_ACCOUNTING'],
    description: "Oversee all business operations. C-suite executive role.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(SkillIcon, {className: "text-amber-800"})
  },
  CFO: {
    id: 'CFO',
    title: 'Chief Financial Officer',
    category: 'management',
    basePayPerTurn: 1600,
    requiredSkills: ['ADVANCED_ACCOUNTING', 'FINANCIAL_LITERACY', 'LEADERSHIP'],
    description: "Lead financial strategy and planning. Elite financial expertise.",
    miniGameType: 'math_quiz',
    difficulty: 'hard',
    icon: React.createElement(MoneyIcon, {className: "text-green-800"})
  }
};
