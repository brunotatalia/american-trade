

import { GameState, Commodity, Player, Property, Skill, LogEntry, GameEvent, Era, Order, GameDate, WorldNewsEvent } from '../types';
import {
  SKILLS_DATA,
  COMMODITY_TRANSACTION_FEE,
  STOCK_TRANSACTION_FEE,
  CAPITAL_GAINS_TAX_SHORT,
  PROPERTY_TRANSACTION_FEE,
  PROPERTY_MAINTENANCE_RATE,
  TURNS_PER_YEAR,
  PROPERTY_APPRECIATION_RATE,
  BOND_YIELD_TREASURY,
  BOND_YIELD_CORPORATE,
  MARKET_DEPTH_IMPACT_THRESHOLD,
  MAX_SLIPPAGE_PERCENT,
  ERAS_DATA
} from '../constants';
import { generateGameEventDescription, generateMarketNews, isGeminiAvailable } from './geminiService';
import { getHistoricalPrice, advanceMonth, getNewsForDate, compareDates } from './historicalData';

export const updateMarketPrices = (
    commodities: Record<string, Commodity>,
    era: Era,
    playerSkills: string[]
): Record<string, Commodity> => {
  const updatedCommodities = { ...commodities };
  const hasMarketAnalysis = playerSkills.includes('MARKET_ANALYSIS');

  for (const id in updatedCommodities) {
    const commodity = updatedCommodities[id];
    let volatility = commodity.volatility * era.marketVolatilityModifier;
    if (hasMarketAnalysis) {
        volatility *= 0.8; // Market Analysis skill reduces volatility impact by 20%
    }

    const priceChangePercentage = (Math.random() - 0.5) * 2 * volatility; // -volatility to +volatility
    let newPrice = commodity.price * (1 + priceChangePercentage);
    newPrice = Math.max(0.01, newPrice); // Price cannot be negative or zero
    updatedCommodities[id] = { ...commodity, price: parseFloat(newPrice.toFixed(2)) };
  }
  return updatedCommodities;
};

/**
 * Update market prices based on historical data
 * Uses real historical prices when available, adds small random variation
 */
export const updateMarketPricesHistorical = (
  commodities: Record<string, Commodity>,
  currentDate: GameDate,
  era: Era
): Record<string, Commodity> => {
  const updatedCommodities = { ...commodities };

  for (const id in updatedCommodities) {
    const commodity = updatedCommodities[id];
    const historicalPrice = getHistoricalPrice(id, currentDate);

    if (historicalPrice !== null) {
      // Use historical price with small random variation to simulate intraday volatility
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const newPrice = historicalPrice * (1 + variation);
      updatedCommodities[id] = { ...commodity, price: parseFloat(newPrice.toFixed(2)) };
    } else {
      // Fall back to random price changes if no historical data available
      let volatility = commodity.volatility * era.marketVolatilityModifier;
      const priceChangePercentage = (Math.random() - 0.5) * 2 * volatility;
      let newPrice = commodity.price * (1 + priceChangePercentage);
      newPrice = Math.max(0.01, newPrice);
      updatedCommodities[id] = { ...commodity, price: parseFloat(newPrice.toFixed(2)) };
    }
  }

  return updatedCommodities;
};

/**
 * Advance the game date by one month
 * Check if era transition is needed
 */
export const advanceGameDate = (currentDate: GameDate, currentEra: Era): { newDate: GameDate; newEra: Era | null } => {
  const newDate = advanceMonth(currentDate);

  // Check if we need to transition to a new era
  if (compareDates(newDate, currentEra.endDate) > 0) {
    // Find the next era
    const currentEraIndex = ERAS_DATA.findIndex(e => e.id === currentEra.id);
    if (currentEraIndex >= 0 && currentEraIndex < ERAS_DATA.length - 1) {
      const nextEra = ERAS_DATA[currentEraIndex + 1];
      return { newDate, newEra: nextEra };
    }
  }

  return { newDate, newEra: null };
};

/**
 * Check for world news events for the current date
 */
export const checkForWorldNews = (date: GameDate): WorldNewsEvent[] => {
  return getNewsForDate(date);
};

// Price history tracking for charts
export const updatePriceHistory = (
  priceHistory: Record<string, import('../types').PriceHistory[]>,
  commodities: Record<string, Commodity>,
  previousCommodities: Record<string, Commodity>,
  currentTurn: number,
  maxHistoryLength: number = 100
): Record<string, import('../types').PriceHistory[]> => {
  const updatedHistory = { ...priceHistory };

  for (const id in commodities) {
    const currentPrice = commodities[id].price;
    const previousPrice = previousCommodities[id]?.price || currentPrice;

    if (!updatedHistory[id]) {
      updatedHistory[id] = [];
    }

    // Create candlestick data
    // For simplicity, we'll use the previous close as open, and add some variation for high/low
    const open = previousPrice;
    const close = currentPrice;
    const priceRange = Math.abs(currentPrice - previousPrice);
    const high = Math.max(open, close) + (priceRange * Math.random() * 0.3);
    const low = Math.min(open, close) - (priceRange * Math.random() * 0.3);

    const candlestick: import('../types').PriceHistory = {
      turn: currentTurn,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 1000 // Simulated volume
    };

    updatedHistory[id] = [...updatedHistory[id], candlestick].slice(-maxHistoryLength);
  }

  return updatedHistory;
};

export const calculatePlayerIncome = (
  player: Player,
  properties: Record<string, Property>,
  skills: Record<string, Skill>,
  commodities: Record<string, Commodity>
): number => {
  let income = 0;

  // Real estate income
  const hasRealEstateMgmt = player.skills.includes('REAL_ESTATE_MGMT');
  Object.keys(player.properties).forEach(propId => {
    const prop = properties[propId];
    if (prop) {
      let rent = prop.rentPerTurn;
      if (hasRealEstateMgmt) {
        rent *= 1.15; // Real Estate Management skill increases rent by 15%
      }

      // Calculate maintenance costs (per turn, based on annual rate)
      const propertyValue = player.properties[propId].currentValue;
      const maintenancePerTurn = (propertyValue * PROPERTY_MAINTENANCE_RATE) / TURNS_PER_YEAR;

      income += rent - maintenancePerTurn;
    }
  });

  // Bond yields (passive income from treasury and corporate bonds)
  const treasuryBonds = player.commodities['TREASURY_BONDS'];
  if (treasuryBonds) {
    const yieldPerTurn = (treasuryBonds.quantity * treasuryBonds.avgBuyPrice * BOND_YIELD_TREASURY) / TURNS_PER_YEAR;
    income += yieldPerTurn;
  }

  const corporateBonds = player.commodities['CORPORATE_BONDS'];
  if (corporateBonds) {
    const yieldPerTurn = (corporateBonds.quantity * corporateBonds.avgBuyPrice * BOND_YIELD_CORPORATE) / TURNS_PER_YEAR;
    income += yieldPerTurn;
  }

  return parseFloat(income.toFixed(2));
};

// New function to update property values based on appreciation
export const updatePropertyValues = (
  player: Player,
  properties: Record<string, Property>,
  skills: string[]
): Player => {
  const hasPropertyDevelopment = skills.includes('PROPERTY_DEVELOPMENT');
  const appreciationModifier = hasPropertyDevelopment ? 1.5 : 1.0; // 50% faster appreciation

  const updatedProperties = { ...player.properties };

  Object.keys(updatedProperties).forEach(propId => {
    const prop = properties[propId];
    if (prop) {
      const currentValue = updatedProperties[propId].currentValue;
      const appreciationRate = (prop.appreciationRate || PROPERTY_APPRECIATION_RATE) * appreciationModifier;
      const appreciationPerTurn = (currentValue * appreciationRate) / TURNS_PER_YEAR;

      updatedProperties[propId] = {
        ...updatedProperties[propId],
        currentValue: parseFloat((currentValue + appreciationPerTurn).toFixed(2))
      };
    }
  });

  return { ...player, properties: updatedProperties };
};

export const createRandomGameEvent = async (gameState: GameState): Promise<GameEvent | null> => {
  if (!gameState.currentEra) return null;

  // Don't create events if Gemini is not available
  if (!isGeminiAvailable()) return null;

  // Simple chance to trigger an event
  if (Math.random() > 0.3) { // 30% chance per turn to trigger an event
    return null;
  }

  const playerStatusHint = `Money: ${gameState.player.money}, Reputation: ${gameState.player.reputation}`;
  const { title, description, type } = await generateGameEventDescription(gameState.currentEra.name, playerStatusHint);
  
  const eventId = `event-${Date.now()}`;
  let choices;

  // Example dynamic choices based on event type or content
  if (type === 'opportunity') {
    choices = [
      { text: "Invest $100", action: (gs: GameState) => {
          if (gs.player.money >= 100) {
            const outcomeRoll = Math.random();
            if (outcomeRoll > 0.5) { // Success
                return { player: {...gs.player, money: gs.player.money + 150 /* Profit */}, gameLog: [...gs.gameLog, createLog("Investment paid off!", 'success')] };
            } else { // Failure
                return { player: {...gs.player, money: gs.player.money - 100}, gameLog: [...gs.gameLog, createLog("Investment failed.", 'warning')] };
            }
          } else {
            return { gameLog: [...gs.gameLog, createLog("Not enough money to invest.", 'warning')] };
          }
        }
      },
      { text: "Ignore", action: () => { /* Do nothing */ } }
    ];
  } else if (type === 'negative' && Math.random() < 0.5) {
     choices = [
        { text: "Pay fine ($50)", action: (gs: GameState) => {
            return { player: {...gs.player, money: gs.player.money - 50}, gameLog: [...gs.gameLog, createLog("Paid a fine.", 'warning')] };
        }},
        { text: "Try to talk your way out", action: (gs: GameState) => {
            const success = Math.random() * (gs.player.reputation / 100) > 0.3; // Higher rep helps
            if (success) {
                 return { player: {...gs.player, reputation: gs.player.reputation + 5 }, gameLog: [...gs.gameLog, createLog("Successfully navigated the situation!", 'success')] };
            } else {
                 return { player: {...gs.player, reputation: gs.player.reputation - 10, money: gs.player.money - 75 }, gameLog: [...gs.gameLog, createLog("Failed to talk your way out, situation worsened.", 'error')] };
            }
        }}
     ];
  }


  return {
    id: eventId,
    title,
    description,
    type,
    choices: choices || [{ text: "Okay", action: () => {} }], // Default choice if none specific
    triggeredAtTurn: gameState.gameTurn,
  };
};

export const createLog = (message: string, type: LogEntry['type']): LogEntry => {
  return { message, type, timestamp: new Date() };
};

// Helper function to get transaction fee based on commodity type
const getTransactionFee = (commodity: Commodity): number => {
  const category = commodity.category;
  if (category === 'stock' || category === 'crypto') {
    return STOCK_TRANSACTION_FEE;
  }
  return COMMODITY_TRANSACTION_FEE;
};

// Helper function to calculate slippage for large orders
const calculateSlippage = (quantity: number, basePrice: number): number => {
  if (quantity <= MARKET_DEPTH_IMPACT_THRESHOLD) {
    return 0;
  }
  const excessQuantity = quantity - MARKET_DEPTH_IMPACT_THRESHOLD;
  const slippagePercent = Math.min(
    (excessQuantity / MARKET_DEPTH_IMPACT_THRESHOLD) * 0.01,
    MAX_SLIPPAGE_PERCENT
  );
  return basePrice * slippagePercent;
};


export const attemptBuyCommodity = (
    player: Player,
    commodity: Commodity,
    quantity: number,
    skills: string[],
    currentTurn: number = 0
): { player?: Player, log?: LogEntry, success: boolean } => {

    if (quantity <= 0) {
        return { log: createLog(`Invalid quantity.`, 'error'), success: false };
    }

    // Calculate slippage for large orders
    const slippage = calculateSlippage(quantity, commodity.price);
    const effectivePrice = commodity.price + slippage;

    // Apply negotiation skill discount
    let priceMultiplier = 1;
    if (skills.includes(SKILLS_DATA.ADVANCED_NEGOTIATION.id)) {
        priceMultiplier = 0.96; // 4% discount with Advanced Negotiation
    } else if (skills.includes(SKILLS_DATA.BASIC_NEGOTIATION.id)) {
        priceMultiplier = 0.98; // 2% discount with Basic Negotiation
    }

    // Calculate transaction fee
    let transactionFeeRate = getTransactionFee(commodity);
    if (skills.includes(SKILLS_DATA.ADVANCED_NEGOTIATION.id)) {
        transactionFeeRate *= 0.75; // 25% reduction in fees
    }

    const subtotal = effectivePrice * quantity * priceMultiplier;
    const transactionFee = subtotal * transactionFeeRate;
    const totalCost = subtotal + transactionFee;

    if (player.money < totalCost) {
        return { log: createLog(`Not enough money to buy ${quantity} ${commodity.name}. Need $${totalCost.toFixed(2)} (includes ${(transactionFeeRate * 100).toFixed(2)}% fee).`, 'error'), success: false };
    }

    const newPlayerState = { ...player };
    newPlayerState.money -= totalCost;

    const existingAmount = newPlayerState.commodities[commodity.id]?.quantity || 0;
    const existingAvgPrice = newPlayerState.commodities[commodity.id]?.avgBuyPrice || 0;

    const newTotalQuantity = existingAmount + quantity;
    const newAvgBuyPrice = ((existingAvgPrice * existingAmount) + (effectivePrice * priceMultiplier * quantity)) / newTotalQuantity;

    newPlayerState.commodities = {
        ...newPlayerState.commodities,
        [commodity.id]: {
            quantity: newTotalQuantity,
            avgBuyPrice: parseFloat(newAvgBuyPrice.toFixed(2)),
            purchasedTurn: currentTurn
        }
    };

    let message = `Bought ${quantity} ${commodity.name} for $${totalCost.toFixed(2)}`;
    if (slippage > 0) {
        message += ` (incl. ${slippage.toFixed(2)} slippage)`;
    }
    message += `. Fee: $${transactionFee.toFixed(2)}`;

    return {
        player: newPlayerState,
        log: createLog(message, 'success'),
        success: true
    };
};

export const attemptSellCommodity = (
    player: Player,
    commodity: Commodity,
    quantity: number,
    skills: string[]
): { player?: Player, log?: LogEntry, success: boolean } => {

    const currentOwned = player.commodities[commodity.id]?.quantity || 0;
    if (quantity <= 0) {
        return { log: createLog(`Invalid quantity.`, 'error'), success: false };
    }
    if (currentOwned < quantity) {
        return { log: createLog(`Not enough ${commodity.name} to sell. Owned: ${currentOwned}.`, 'error'), success: false };
    }

    // Calculate slippage for large sell orders (negative impact on sell price)
    const slippage = calculateSlippage(quantity, commodity.price);
    const effectivePrice = commodity.price - slippage;

    // Apply negotiation skill bonus
    let priceMultiplier = 1;
    if (skills.includes(SKILLS_DATA.ADVANCED_NEGOTIATION.id)) {
        priceMultiplier = 1.04; // 4% bonus with Advanced Negotiation
    } else if (skills.includes(SKILLS_DATA.BASIC_NEGOTIATION.id)) {
        priceMultiplier = 1.02; // 2% bonus with Basic Negotiation
    }

    // Calculate transaction fee
    let transactionFeeRate = getTransactionFee(commodity);
    if (skills.includes(SKILLS_DATA.ADVANCED_NEGOTIATION.id)) {
        transactionFeeRate *= 0.75; // 25% reduction in fees
    }

    const grossRevenue = effectivePrice * quantity * priceMultiplier;
    const transactionFee = grossRevenue * transactionFeeRate;

    const avgBuyPrice = player.commodities[commodity.id].avgBuyPrice;
    const costOfGoodsSold = avgBuyPrice * quantity;
    const grossProfit = grossRevenue - costOfGoodsSold;

    // Calculate capital gains tax (only on profits)
    let capitalGainsTax = 0;
    if (grossProfit > 0) {
        let taxRate = CAPITAL_GAINS_TAX_SHORT;
        if (skills.includes(SKILLS_DATA.TAX_OPTIMIZATION.id)) {
            taxRate *= 0.6; // 40% reduction in taxes
        }
        capitalGainsTax = grossProfit * taxRate;
    }

    const netRevenue = grossRevenue - transactionFee - capitalGainsTax;
    const netProfit = netRevenue - costOfGoodsSold;

    const newPlayerState = { ...player };
    newPlayerState.money += netRevenue;

    const remainingQuantity = currentOwned - quantity;
    if (remainingQuantity === 0) {
        const { [commodity.id]: removed, ...remainingCommodities } = newPlayerState.commodities;
        newPlayerState.commodities = remainingCommodities;
    } else {
        newPlayerState.commodities = {
            ...newPlayerState.commodities,
            [commodity.id]: {
                ...newPlayerState.commodities[commodity.id],
                quantity: remainingQuantity
            }
        };
    }

    let message = `Sold ${quantity} ${commodity.name} for $${netRevenue.toFixed(2)}`;
    if (slippage > 0) {
        message += ` (${slippage.toFixed(2)} slippage)`;
    }
    message += `. Fee: $${transactionFee.toFixed(2)}`;
    if (capitalGainsTax > 0) {
        message += `, Tax: $${capitalGainsTax.toFixed(2)}`;
    }
    const profitLossMsg = netProfit >= 0 ? `Net Profit: $${netProfit.toFixed(2)}` : `Net Loss: $${Math.abs(netProfit).toFixed(2)}`;
    message += `. ${profitLossMsg}`;

    return {
        player: newPlayerState,
        log: createLog(message, 'success'),
        success: true
    };
};

export const attemptBuyProperty = (
    player: Player,
    property: Property,
    currentTurn: number = 0
): { player?: Player, log?: LogEntry, success: boolean } => {
    // Calculate transaction fee (realtor commission)
    const transactionFee = property.cost * PROPERTY_TRANSACTION_FEE;
    const totalCost = property.cost + transactionFee;

    if (player.money < totalCost) {
        return { log: createLog(`Not enough money to buy ${property.name}. Need $${totalCost.toFixed(2)} (includes ${(PROPERTY_TRANSACTION_FEE * 100).toFixed(1)}% commission).`, 'error'), success: false };
    }
    if (player.properties[property.id]) {
        return { log: createLog(`You already own ${property.name}.`, 'warning'), success: false };
    }

    const newPlayerState = { ...player };
    newPlayerState.money -= totalCost;
    newPlayerState.properties = {
        ...newPlayerState.properties,
        [property.id]: {
            purchasedTurn: currentTurn,
            currentValue: property.cost
        }
    };

    return {
        player: newPlayerState,
        log: createLog(`Bought ${property.name} for $${totalCost.toFixed(2)} (includes $${transactionFee.toFixed(2)} commission).`, 'success'),
        success: true
    };
};

export const attemptUnlockSkill = (
    player: Player, 
    skill: Skill
): { player?: Player, log?: LogEntry, success: boolean } => {
    if (player.money < skill.cost) {
        return { log: createLog(`Not enough money to learn ${skill.name}. Need $${skill.cost.toFixed(2)}.`, 'error'), success: false };
    }
    if (player.skills.includes(skill.id)) {
        return { log: createLog(`You already know ${skill.name}.`, 'warning'), success: false };
    }

    const newPlayerState = { ...player };
    newPlayerState.money -= skill.cost;
    newPlayerState.skills = [...newPlayerState.skills, skill.id];
    
    return { 
        player: newPlayerState, 
        log: createLog(`Unlocked skill: ${skill.name} for $${skill.cost.toFixed(2)}.`, 'success'),
        success: true
    };
};

export const fetchMarketNewsForRandomCommodity = async (gameState: GameState): Promise<string | null> => {
    if (!gameState.currentEra) return null;
    const availableCommodities = gameState.currentEra.availableCommodities;
    if (availableCommodities.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableCommodities.length);
    const commodityId = availableCommodities[randomIndex];
    const commodity = gameState.commodities[commodityId];

    if (commodity) {
        return generateMarketNews(commodity.name, gameState.currentEra.name);
    }
    return null;
};

export const attemptPlaceOrder = (
  player: Player,
  commodities: Record<string, Commodity>,
  order: Omit<Order, 'id' | 'createdAtTurn'>,
  currentTurn: number
): { player?: Player; log?: LogEntry; success: boolean } => {
  const { commodityId, type, quantity, price } = order;
  const commodity = commodities[commodityId];

  if (!commodity || quantity <= 0 || price <= 0) {
    return { log: createLog('Invalid order parameters.', 'error'), success: false };
  }

  // Calculate committed assets
  const committedMoney = player.orders
    .filter(o => o.type === 'LIMIT_BUY')
    .reduce((sum, o) => sum + o.price * o.quantity, 0);
  
  const committedCommodities: Record<string, number> = {};
  player.orders
    .filter(o => o.type === 'LIMIT_SELL' || o.type === 'STOP_LOSS_SELL')
    .forEach(o => {
      committedCommodities[o.commodityId] = (committedCommodities[o.commodityId] || 0) + o.quantity;
    });

  if (type === 'LIMIT_BUY') {
    const totalCost = price * quantity;
    const availableMoney = player.money - committedMoney;
    if (availableMoney < totalCost) {
      return { log: createLog(`Not enough available money to place buy order. Available: $${availableMoney.toFixed(2)}`, 'error'), success: false };
    }
  } else { // LIMIT_SELL or STOP_LOSS_SELL
    const owned = player.commodities[commodityId]?.quantity || 0;
    const committed = committedCommodities[commodityId] || 0;
    const available = owned - committed;
    if (available < quantity) {
      return { log: createLog(`Not enough available ${commodity.name} to place sell order. Available: ${available}`, 'error'), success: false };
    }
  }

  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}-${Math.random()}`,
    createdAtTurn: currentTurn,
  };

  const newPlayerState = { ...player, orders: [...player.orders, newOrder] };

  return {
    player: newPlayerState,
    log: createLog(`Placed new order: ${type.replace('_', ' ')} ${quantity} ${commodity.name} at $${price.toFixed(2)}.`, 'action'),
    success: true
  };
};

export const attemptCancelOrder = (
    player: Player,
    orderId: string
): { player?: Player; log?: LogEntry; success: boolean } => {
    const orderToCancel = player.orders.find(o => o.id === orderId);
    if (!orderToCancel) {
        return { log: createLog('Order not found.', 'error'), success: false };
    }

    const newPlayerState = {
        ...player,
        orders: player.orders.filter(o => o.id !== orderId)
    };

    return {
        player: newPlayerState,
        log: createLog(`Cancelled order for ${orderToCancel.quantity} of ${orderToCancel.commodityId}.`, 'action'),
        success: true
    }
};

export const processPendingOrders = (
  player: Player,
  commodities: Record<string, Commodity>,
  skills: string[],
  currentTurn: number = 0
): {
  player: Player;
  logs: LogEntry[];
} => {
  let tempPlayer = { ...player };
  const tempLogs: LogEntry[] = [];
  const remainingOrders: Order[] = [];

  for (const order of player.orders) {
    const commodity = commodities[order.commodityId];
    if (!commodity) {
      remainingOrders.push(order); // Keep order if commodity not found (edge case)
      continue;
    }

    let orderTriggered = false;
    if (order.type === 'LIMIT_BUY' && commodity.price <= order.price) {
      orderTriggered = true;
    } else if (order.type === 'LIMIT_SELL' && commodity.price >= order.price) {
      orderTriggered = true;
    } else if (order.type === 'STOP_LOSS_SELL' && commodity.price <= order.price) {
      orderTriggered = true;
    }

    if (orderTriggered) {
      let result;
      // For buys, we use the current market price, which is at or better (lower) than the limit.
      // For sells, we use the current market price, which is at or better (higher) than the limit, or triggered by stop-loss.
      if (order.type === 'LIMIT_BUY') {
        result = attemptBuyCommodity(tempPlayer, commodity, order.quantity, skills, currentTurn);
      } else {
        result = attemptSellCommodity(tempPlayer, commodity, order.quantity, skills);
      }

      if (result.success && result.player) {
        tempPlayer = result.player;
        tempLogs.push(createLog(`Order executed: ${order.type.replace('_', ' ')} ${order.quantity} ${commodity.name} at $${commodity.price.toFixed(2)}.`, 'success'));
        if (result.log) tempLogs.push(result.log);
      } else {
        // Order failed (e.g., not enough money/stock if something changed)
        tempLogs.push(createLog(`Order failed to execute: ${order.type.replace('_', ' ')} ${order.quantity} ${commodity.name}. Reason: ${result.log?.message || 'Unknown'}. Order cancelled.`, 'error'));
        // Don't re-add failed order. It's cancelled.
      }
    } else {
      remainingOrders.push(order); // Keep untriggered order
    }
  }

  tempPlayer.orders = remainingOrders;
  return { player: tempPlayer, logs: tempLogs };
};

// Job system functions
export const selectJob = (
  player: Player,
  jobId: string
): { player?: Player; log?: LogEntry; success: boolean } => {
  const newPlayerState = { ...player };
  newPlayerState.currentJob = jobId;

  return {
    player: newPlayerState,
    log: createLog(`Selected new job. Ready to work!`, 'action'),
    success: true
  };
};

export const processJobResult = (
  player: Player,
  jobId: string,
  result: import('../types').MiniGameResult
): { player: Player; log: LogEntry } => {
  const newPlayerState = { ...player };

  // Initialize job performance if it doesn't exist
  if (!newPlayerState.jobPerformance[jobId]) {
    newPlayerState.jobPerformance[jobId] = {
      jobId,
      gamesPlayed: 0,
      gamesWon: 0,
      averageScore: 0,
      bestScore: 0,
      totalEarnings: 0,
      streak: 0
    };
  }

  const perf = { ...newPlayerState.jobPerformance[jobId] };

  // Update stats
  perf.gamesPlayed += 1;
  if (result.passed) {
    perf.gamesWon += 1;
    perf.streak += 1;
  } else {
    perf.streak = 0; // Reset streak on failure
  }

  // Update scores
  perf.averageScore = ((perf.averageScore * (perf.gamesPlayed - 1)) + result.score) / perf.gamesPlayed;
  if (result.score > perf.bestScore) {
    perf.bestScore = result.score;
  }

  // Calculate earnings with streak bonus
  let finalEarnings = result.earnings;
  if (perf.streak >= 10) {
    finalEarnings *= 2.0; // 100% bonus at 10+ streak
  } else if (perf.streak >= 5) {
    finalEarnings *= 1.5; // 50% bonus at 5-9 streak
  }

  perf.totalEarnings += finalEarnings;

  // Update player
  newPlayerState.money += finalEarnings;
  newPlayerState.jobPerformance[jobId] = perf;

  // Create log message
  let message = `Work shift complete! Earned $${finalEarnings.toFixed(2)} (${result.performanceRating})`;
  if (perf.streak >= 5) {
    message += ` 🔥 ${perf.streak} streak bonus!`;
  }

  return {
    player: newPlayerState,
    log: createLog(message, result.passed ? 'success' : 'warning')
  };
};

// Options trading functions
export const buyOption = (
  player: Player,
  commodityId: string,
  type: 'CALL' | 'PUT',
  strikePrice: number,
  premium: number,
  quantity: number,
  expirationTurns: number,
  currentTurn: number
): { player?: Player; log?: LogEntry; success: boolean } => {
  const totalCost = premium * quantity;

  if (player.money < totalCost) {
    return { log: createLog(`Not enough money to buy option. Need $${totalCost.toFixed(2)}.`, 'error'), success: false };
  }

  const newPlayerState = { ...player };
  newPlayerState.money -= totalCost;

  const newOption: import('../types').OptionsContract = {
    id: `option-${Date.now()}-${Math.random()}`,
    commodityId,
    type,
    strikePrice: parseFloat(strikePrice.toFixed(2)),
    premium,
    expirationTurn: currentTurn + expirationTurns,
    quantity,
    purchasedAtTurn: currentTurn
  };

  newPlayerState.optionsContracts = [...newPlayerState.optionsContracts, newOption];

  return {
    player: newPlayerState,
    log: createLog(`Bought ${quantity} ${type} option(s) for $${totalCost.toFixed(2)}.`, 'action'),
    success: true
  };
};

export const exerciseOption = (
  player: Player,
  optionId: string,
  commodities: Record<string, Commodity>
): { player?: Player; log?: LogEntry; success: boolean } => {
  const option = player.optionsContracts.find(o => o.id === optionId);
  if (!option) {
    return { log: createLog('Option not found.', 'error'), success: false };
  }

  const commodity = commodities[option.commodityId];
  if (!commodity) {
    return { log: createLog('Commodity not found.', 'error'), success: false };
  }

  // Calculate intrinsic value
  const intrinsicValue = option.type === 'CALL'
    ? Math.max(0, commodity.price - option.strikePrice)
    : Math.max(0, option.strikePrice - commodity.price);

  if (intrinsicValue <= 0) {
    return { log: createLog('Option is not in the money. Cannot exercise.', 'warning'), success: false };
  }

  const totalProfit = intrinsicValue * option.quantity;
  const totalCost = option.premium * option.quantity;
  const netProfit = totalProfit - totalCost;

  const newPlayerState = { ...player };
  newPlayerState.money += totalProfit;
  newPlayerState.optionsContracts = newPlayerState.optionsContracts.filter(o => o.id !== optionId);

  return {
    player: newPlayerState,
    log: createLog(`Exercised ${option.type} option. Profit: $${totalProfit.toFixed(2)}. Net: $${netProfit.toFixed(2)}`, netProfit >= 0 ? 'success' : 'warning'),
    success: true
  };
};

export const sellOption = (
  player: Player,
  optionId: string,
  commodities: Record<string, Commodity>
): { player?: Player; log?: LogEntry; success: boolean } => {
  const option = player.optionsContracts.find(o => o.id === optionId);
  if (!option) {
    return { log: createLog('Option not found.', 'error'), success: false };
  }

  const commodity = commodities[option.commodityId];
  if (!commodity) {
    return { log: createLog('Commodity not found.', 'error'), success: false };
  }

  // Calculate current value (simplified - just intrinsic value)
  const intrinsicValue = option.type === 'CALL'
    ? Math.max(0, commodity.price - option.strikePrice)
    : Math.max(0, option.strikePrice - commodity.price);

  const sellPrice = intrinsicValue * option.quantity * 0.9; // 10% haircut for early sale
  const totalCost = option.premium * option.quantity;
  const netProfit = sellPrice - totalCost;

  const newPlayerState = { ...player };
  newPlayerState.money += sellPrice;
  newPlayerState.optionsContracts = newPlayerState.optionsContracts.filter(o => o.id !== optionId);

  return {
    player: newPlayerState,
    log: createLog(`Sold ${option.type} option for $${sellPrice.toFixed(2)}. Net: $${netProfit.toFixed(2)}`, netProfit >= 0 ? 'success' : 'warning'),
    success: true
  };
};

// Process expired options
export const processExpiredOptions = (
  player: Player,
  currentTurn: number
): { player: Player; logs: LogEntry[] } => {
  const newPlayerState = { ...player };
  const logs: LogEntry[] = [];

  const expiredOptions = player.optionsContracts.filter(o => o.expirationTurn <= currentTurn);
  const activeOptions = player.optionsContracts.filter(o => o.expirationTurn > currentTurn);

  if (expiredOptions.length > 0) {
    expiredOptions.forEach(option => {
      const totalCost = option.premium * option.quantity;
      logs.push(createLog(`${option.type} option expired worthless. Lost $${totalCost.toFixed(2)}.`, 'warning'));
    });
    newPlayerState.optionsContracts = activeOptions;
  }

  return { player: newPlayerState, logs };
};

// Leverage trading functions
export const openLeveragePosition = (
  player: Player,
  commodityId: string,
  type: 'LONG' | 'SHORT',
  leverage: number,
  quantity: number,
  currentPrice: number,
  currentTurn: number
): { player?: Player; log?: LogEntry; success: boolean } => {
  // Calculate margin requirement
  const positionSize = currentPrice * quantity;
  const marginRequired = positionSize / leverage;

  if (player.money < marginRequired) {
    return { log: createLog(`Not enough money for margin. Need $${marginRequired.toFixed(2)}.`, 'error'), success: false };
  }

  // Check trading level for leverage
  if (player.tradingLevel < leverage) {
    return { log: createLog(`Trading level ${leverage} required for ${leverage}x leverage.`, 'error'), success: false };
  }

  // Calculate liquidation price
  const liquidationPercent = 1 / leverage;
  const liquidationPrice = type === 'LONG'
    ? currentPrice * (1 - liquidationPercent)
    : currentPrice * (1 + liquidationPercent);

  const newPlayerState = { ...player };
  newPlayerState.money -= marginRequired;

  const newPosition: import('../types').LeveragedPosition = {
    id: `leverage-${Date.now()}-${Math.random()}`,
    commodityId,
    type,
    leverage,
    entryPrice: currentPrice,
    quantity,
    margin: parseFloat(marginRequired.toFixed(2)),
    currentValue: positionSize,
    liquidationPrice: parseFloat(liquidationPrice.toFixed(2)),
    openedAtTurn: currentTurn
  };

  newPlayerState.leveragedPositions = [...newPlayerState.leveragedPositions, newPosition];

  return {
    player: newPlayerState,
    log: createLog(`Opened ${type} position with ${leverage}x leverage. Margin: $${marginRequired.toFixed(2)}`, 'action'),
    success: true
  };
};

export const closeLeveragePosition = (
  player: Player,
  positionId: string,
  currentPrice: number
): { player?: Player; log?: LogEntry; success: boolean } => {
  const position = player.leveragedPositions.find(p => p.id === positionId);
  if (!position) {
    return { log: createLog('Position not found.', 'error'), success: false };
  }

  // Calculate P&L
  const priceChange = currentPrice - position.entryPrice;
  const pnl = position.type === 'LONG'
    ? priceChange * position.quantity * position.leverage
    : -priceChange * position.quantity * position.leverage;

  const finalValue = position.margin + pnl;

  const newPlayerState = { ...player };
  newPlayerState.money += finalValue;
  newPlayerState.leveragedPositions = newPlayerState.leveragedPositions.filter(p => p.id !== positionId);

  // Increase trading level if profitable trade
  if (pnl > 0 && position.leverage >= newPlayerState.tradingLevel) {
    const levelUpThreshold = 10; // Need 10 profitable trades at current level
    // This is simplified - could track successful trades per level
    if (Math.random() < 0.1) { // 10% chance to level up on profitable trade
      newPlayerState.tradingLevel = Math.min(10, newPlayerState.tradingLevel + 1);
    }
  }

  return {
    player: newPlayerState,
    log: createLog(
      `Closed ${position.type} position. P&L: $${pnl.toFixed(2)} (${((pnl/position.margin)*100).toFixed(2)}%)`,
      pnl >= 0 ? 'success' : 'error'
    ),
    success: true
  };
};

export const updateLeveragePositions = (
  player: Player,
  commodities: Record<string, Commodity>
): Player => {
  const updatedPositions = player.leveragedPositions.map(position => {
    const commodity = commodities[position.commodityId];
    if (!commodity) return position;

    const currentValue = commodity.price * position.quantity;
    return { ...position, currentValue: parseFloat(currentValue.toFixed(2)) };
  });

  return { ...player, leveragedPositions: updatedPositions };
};

export const processLiquidations = (
  player: Player,
  commodities: Record<string, Commodity>
): { player: Player; logs: LogEntry[] } => {
  const newPlayerState = { ...player };
  const logs: LogEntry[] = [];
  const activePositions: import('../types').LeveragedPosition[] = [];

  for (const position of player.leveragedPositions) {
    const commodity = commodities[position.commodityId];
    if (!commodity) {
      activePositions.push(position);
      continue;
    }

    const isLiquidated = position.type === 'LONG'
      ? commodity.price <= position.liquidationPrice
      : commodity.price >= position.liquidationPrice;

    if (isLiquidated) {
      // Position is liquidated - lose the margin
      logs.push(createLog(
        `⚠️ ${position.type} position LIQUIDATED! Lost $${position.margin.toFixed(2)} margin.`,
        'error'
      ));
      // Margin is already deducted, so no money change
    } else {
      activePositions.push(position);
    }
  }

  newPlayerState.leveragedPositions = activePositions;
  return { player: newPlayerState, logs };
};