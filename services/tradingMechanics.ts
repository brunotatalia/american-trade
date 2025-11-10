import { GameState, Commodity, MarketSentiment, LogEntry } from '../types';
import { createLog } from './gameLogic';

/**
 * Advanced Trading Mechanics Service
 * Handles: Market Sentiment, Dividend Payments, Stock Splits, Bankruptcy Risks
 */

// === MARKET SENTIMENT ===

const SENTIMENT_SOURCES = ['analyst', 'news', 'technical', 'fundamental', 'social'] as const;
const SENTIMENT_DESCRIPTIONS = {
  analyst: ['Analyst Upgrade', 'Analyst Downgrade', 'Price Target Raised', 'Price Target Lowered'],
  news: ['Positive Earnings Report', 'Scandal Breaks', 'New Product Launch', 'Supply Chain Issues'],
  technical: ['Bullish Pattern Detected', 'Bearish Divergence', 'Breakout Confirmed', 'Support Level Broken'],
  fundamental: ['Strong Fundamentals', 'Weak Financials', 'Revenue Growth', 'Declining Margins'],
  social: ['Social Media Buzz', 'Negative Sentiment', 'Viral Marketing', 'Trending Negatively']
};

/**
 * Generate random market sentiment for commodities
 */
export function generateMarketSentiment(
  gameState: GameState
): { sentiments: MarketSentiment[]; logs: LogEntry[] } {
  const logs: LogEntry[] = [];
  const newSentiments: MarketSentiment[] = [];

  // 20% chance to generate new sentiment each turn
  if (Math.random() > 0.2) {
    return { sentiments: [], logs: [] };
  }

  // Pick a random commodity
  const commodityIds = Object.keys(gameState.commodities);
  if (commodityIds.length === 0) return { sentiments: [], logs: [] };

  const randomId = commodityIds[Math.floor(Math.random() * commodityIds.length)];
  const commodity = gameState.commodities[randomId];

  // Generate sentiment
  const source = SENTIMENT_SOURCES[Math.floor(Math.random() * SENTIMENT_SOURCES.length)];
  const descriptions = SENTIMENT_DESCRIPTIONS[source];
  const isPositive = Math.random() > 0.5;
  const descriptionIndex = isPositive ? 0 : 1;
  
  const sentiment: MarketSentiment = {
    commodityId: randomId,
    sentiment: isPositive ? (0.5 + Math.random() * 0.5) : (-0.5 - Math.random() * 0.5), // 0.5 to 1.0 or -0.5 to -1.0
    source,
    expiresAtTurn: gameState.gameTurn + (3 + Math.floor(Math.random() * 5)), // 3-7 turns
    description: descriptions[descriptionIndex + (Math.floor(Math.random() * 2) * 2)] || descriptions[0]
  };

  newSentiments.push(sentiment);
  
  const sentimentText = sentiment.sentiment > 0 ? '🔼 BULLISH' : '🔽 BEARISH';
  logs.push(createLog(
    `${sentimentText} ${commodity.name}: ${sentiment.description}`,
    sentiment.sentiment > 0 ? 'success' : 'warning'
  ));

  return { sentiments: newSentiments, logs };
}

/**
 * Apply active market sentiments to commodity prices
 */
export function applyMarketSentiments(
  commodities: Record<string, Commodity>,
  sentiments: MarketSentiment[],
  currentTurn: number
): { commodities: Record<string, Commodity>; expiredSentiments: string[] } {
  const updatedCommodities = { ...commodities };
  const expiredSentiments: string[] = [];

  sentiments.forEach(sentiment => {
    // Check if sentiment expired
    if (currentTurn >= sentiment.expiresAtTurn) {
      expiredSentiments.push(sentiment.commodityId);
      return;
    }

    // Apply sentiment to price
    const commodity = updatedCommodities[sentiment.commodityId];
    if (commodity) {
      // Sentiment affects price by 5-30%
      const priceImpact = sentiment.sentiment * (0.05 + Math.random() * 0.25);
      const newPrice = commodity.price * (1 + priceImpact);
      
      updatedCommodities[sentiment.commodityId] = {
        ...commodity,
        price: Math.max(0.01, parseFloat(newPrice.toFixed(2)))
      };
    }
  });

  return { commodities: updatedCommodities, expiredSentiments };
}

/**
 * Clean up expired sentiments
 */
export function cleanExpiredSentiments(
  sentiments: MarketSentiment[],
  currentTurn: number
): MarketSentiment[] {
  return sentiments.filter(s => s.expiresAtTurn > currentTurn);
}

// === DIVIDEND PAYMENTS ===

const DIVIDEND_SCHEDULES: Record<string, { frequency: number; yield: number }> = {
  TREASURY_BONDS: { frequency: 4, yield: 4.0 }, // Quarterly, 4% annual yield
  CORPORATE_BONDS: { frequency: 4, yield: 6.0 }, // Quarterly, 6% annual yield
  TECH_STOCKS: { frequency: 4, yield: 1.5 }, // Quarterly, 1.5% annual yield
  INDEX_FUND: { frequency: 4, yield: 2.5 }, // Quarterly, 2.5% annual yield
};

/**
 * Process dividend payments for eligible holdings
 */
export function processDividendPayments(
  gameState: GameState
): { payment: number; logs: LogEntry[]; updatedCommodities: Record<string, Commodity> } {
  const logs: LogEntry[] = [];
  let totalPayment = 0;
  const updatedCommodities = { ...gameState.commodities };

  Object.entries(gameState.player.commodities).forEach(([commodityId, holding]) => {
    const schedule = DIVIDEND_SCHEDULES[commodityId];
    if (!schedule) return; // No dividends for this commodity

    const commodity = gameState.commodities[commodityId];
    if (!commodity || commodity.isBankrupt) return;

    // Check if dividend is due
    const lastPayment = commodity.lastDividendTurn || 0;
    const turnsSinceLastPayment = gameState.gameTurn - lastPayment;
    const turnsPerPayment = Math.floor(40 / schedule.frequency); // Assuming ~40 turns per year

    if (turnsSinceLastPayment >= turnsPerPayment) {
      // Calculate dividend per share (annual yield / frequency)
      const dividendPerShare = (commodity.price * schedule.yield / 100) / schedule.frequency;
      const payment = dividendPerShare * holding.quantity;
      
      totalPayment += payment;
      
      // Update last dividend turn
      updatedCommodities[commodityId] = {
        ...commodity,
        lastDividendTurn: gameState.gameTurn
      };

      logs.push(createLog(
        `💵 Dividend: ${commodity.name} paid $${payment.toFixed(2)} (${holding.quantity} shares × $${dividendPerShare.toFixed(2)})`,
        'success'
      ));
    }
  });

  return { payment: totalPayment, logs, updatedCommodities };
}

// === STOCK SPLITS ===

/**
 * Check and announce stock splits
 */
export function checkStockSplits(
  commodities: Record<string, Commodity>,
  currentTurn: number
): { commodities: Record<string, Commodity>; logs: LogEntry[] } {
  const logs: LogEntry[] = [];
  const updatedCommodities = { ...commodities };

  Object.entries(commodities).forEach(([id, commodity]) => {
    // Only stocks and funds can split
    if (commodity.category !== 'stocks') return;
    if (commodity.isBankrupt) return;

    // Check if there's a pending split announcement
    if (commodity.splitAnnouncement) {
      // Execute the split if it's time
      if (currentTurn >= commodity.splitAnnouncement.executionTurn) {
        const ratio = commodity.splitAnnouncement.ratio;
        const newPrice = commodity.price / ratio;
        
        updatedCommodities[id] = {
          ...commodity,
          price: parseFloat(newPrice.toFixed(2)),
          splitAnnouncement: undefined
        };

        logs.push(createLog(
          `📊 STOCK SPLIT: ${commodity.name} executed ${ratio}:1 split. New price: $${newPrice.toFixed(2)}`,
          'info'
        ));
      }
    } else {
      // Announce new splits for high-priced stocks
      if (commodity.price > 300 && Math.random() < 0.05) { // 5% chance if price > $300
        const ratio = Math.random() > 0.5 ? 2 : 3; // 2:1 or 3:1 split
        const executionTurn = currentTurn + 3; // Execute in 3 turns

        updatedCommodities[id] = {
          ...commodity,
          splitAnnouncement: { ratio, executionTurn }
        };

        logs.push(createLog(
          `📢 ANNOUNCEMENT: ${commodity.name} will execute a ${ratio}:1 stock split in 3 turns`,
          'info'
        ));
      }
    }
  });

  return { commodities: updatedCommodities, logs };
}

/**
 * Apply stock split to player holdings
 */
export function applyStockSplitToHoldings(
  gameState: GameState,
  commodityId: string,
  ratio: number
): Partial<GameState> {
  const holding = gameState.player.commodities[commodityId];
  if (!holding) return {};

  const newQuantity = holding.quantity * ratio;
  const newAvgPrice = holding.avgBuyPrice / ratio;

  return {
    player: {
      ...gameState.player,
      commodities: {
        ...gameState.player.commodities,
        [commodityId]: {
          quantity: newQuantity,
          avgBuyPrice: parseFloat(newAvgPrice.toFixed(2))
        }
      }
    }
  };
}

// === BANKRUPTCY RISKS ===

/**
 * Check for bankruptcy events
 */
export function checkBankruptcies(
  commodities: Record<string, Commodity>
): { commodities: Record<string, Commodity>; bankruptcies: string[]; logs: LogEntry[] } {
  const logs: LogEntry[] = [];
  const updatedCommodities = { ...commodities };
  const bankruptcies: string[] = [];

  Object.entries(commodities).forEach(([id, commodity]) => {
    if (commodity.isBankrupt) return; // Already bankrupt
    if (!commodity.bankruptcyRisk || commodity.bankruptcyRisk === 0) return;

    // Check if bankruptcy occurs
    if (Math.random() < commodity.bankruptcyRisk) {
      updatedCommodities[id] = {
        ...commodity,
        price: 0.01, // Crash to near zero
        isBankrupt: true
      };

      bankruptcies.push(id);
      
      logs.push(createLog(
        `💥 BANKRUPTCY: ${commodity.name} has filed for bankruptcy! Price crashed to $0.01`,
        'error'
      ));
    }
  });

  return { commodities: updatedCommodities, bankruptcies, logs };
}

/**
 * Calculate loss from bankruptcies in player holdings
 */
export function calculateBankruptcyLoss(
  gameState: GameState,
  bankruptcyIds: string[]
): { loss: number; logs: LogEntry[] } {
  let totalLoss = 0;
  const logs: LogEntry[] = [];

  bankruptcyIds.forEach(id => {
    const holding = gameState.player.commodities[id];
    if (holding) {
      const loss = holding.avgBuyPrice * holding.quantity;
      totalLoss += loss;
      
      logs.push(createLog(
        `💸 You lost $${loss.toFixed(2)} from ${gameState.commodities[id]?.name || id} bankruptcy`,
        'error'
      ));
    }
  });

  return { loss: totalLoss, logs };
}

/**
 * Main function to process all advanced trading mechanics
 */
export function processAdvancedTradingMechanics(
  gameState: GameState
): {
  gameState: Partial<GameState>;
  logs: LogEntry[];
} {
  const allLogs: LogEntry[] = [];
  let updatedCommodities = { ...gameState.commodities };
  let updatedSentiments = [...gameState.marketSentiments];
  let updatedPlayer = { ...gameState.player };

  // 1. Generate new market sentiments
  const { sentiments: newSentiments, logs: sentimentLogs } = generateMarketSentiment(gameState);
  updatedSentiments = [...updatedSentiments, ...newSentiments];
  allLogs.push(...sentimentLogs);

  // 2. Apply active sentiments to prices
  const { commodities: sentimentCommodities, expiredSentiments } = applyMarketSentiments(
    updatedCommodities,
    updatedSentiments,
    gameState.gameTurn
  );
  updatedCommodities = sentimentCommodities;
  updatedSentiments = cleanExpiredSentiments(updatedSentiments, gameState.gameTurn);

  // 3. Process dividend payments
  const {
    payment: dividendPayment,
    logs: dividendLogs,
    updatedCommodities: dividendCommodities
  } = processDividendPayments({ ...gameState, commodities: updatedCommodities });
  
  if (dividendPayment > 0) {
    updatedPlayer.money += dividendPayment;
    updatedPlayer.tradingStats = {
      ...updatedPlayer.tradingStats,
      totalDividends: updatedPlayer.tradingStats.totalDividends + dividendPayment
    };
    allLogs.push(...dividendLogs);
  }
  updatedCommodities = dividendCommodities;

  // 4. Check and process stock splits
  const { commodities: splitCommodities, logs: splitLogs } = checkStockSplits(
    updatedCommodities,
    gameState.gameTurn
  );
  updatedCommodities = splitCommodities;
  allLogs.push(...splitLogs);

  // Apply splits to player holdings
  Object.entries(splitCommodities).forEach(([id, commodity]) => {
    if (commodity.splitAnnouncement && gameState.gameTurn >= commodity.splitAnnouncement.executionTurn) {
      const splitUpdate = applyStockSplitToHoldings(
        { ...gameState, player: updatedPlayer },
        id,
        commodity.splitAnnouncement.ratio
      );
      if (splitUpdate.player) {
        updatedPlayer = splitUpdate.player;
      }
    }
  });

  // 5. Check for bankruptcies
  const {
    commodities: bankruptcyCommodities,
    bankruptcies,
    logs: bankruptcyLogs
  } = checkBankruptcies(updatedCommodities);
  updatedCommodities = bankruptcyCommodities;
  allLogs.push(...bankruptcyLogs);

  // Calculate player losses from bankruptcies
  if (bankruptcies.length > 0) {
    const { loss, logs: lossLogs } = calculateBankruptcyLoss(
      { ...gameState, player: updatedPlayer },
      bankruptcies
    );
    allLogs.push(...lossLogs);
  }

  return {
    gameState: {
      commodities: updatedCommodities,
      marketSentiments: updatedSentiments,
      player: updatedPlayer
    },
    logs: allLogs
  };
}
