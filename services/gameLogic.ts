

import { GameState, Commodity, Player, Property, Skill, LogEntry, GameEvent, Era, Order } from '../types';
import { SKILLS_DATA, INFLUENCE_CHANGES, MAX_INFLUENCE, MIN_INFLUENCE, HIGH_INFLUENCE_THRESHOLD, LOW_INFLUENCE_THRESHOLD } from '../constants';
import { generateGameEventDescription, generateMarketNews } from './geminiService';

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

export const calculatePlayerIncome = (player: Player, properties: Record<string, Property>, skills: Record<string, Skill>): number => {
  let income = 0;
  const hasRealEstateMgmt = player.skills.includes('REAL_ESTATE_MGMT');

  player.properties.forEach(propId => {
    const prop = properties[propId];
    if (prop) {
        let rent = prop.rentPerTurn;
        if(hasRealEstateMgmt) {
            rent *= 1.10; // Real Estate Management skill increases rent by 10%
        }
        income += rent;
    }
  });
  // Future: Add income from side careers, dividends etc.
  return parseFloat(income.toFixed(2));
};

export const createBlueChipOpportunityEvent = (gameState: GameState): GameEvent | null => {
  // Only trigger for high influence
  if (gameState.player.influence < HIGH_INFLUENCE_THRESHOLD) return null;

  // 15% chance per turn when influence is above 50
  if (Math.random() > 0.15) return null;

  const eventId = `bluechip-${Date.now()}`;
  const investmentCost = 500;
  const guaranteedReturn = 750;

  return {
    id: eventId,
    title: "💎 Blue Chip Opportunity",
    description: "Your stellar reputation has opened doors! An exclusive Blue Chip investment opportunity is available only to traders with high influence. This is a nearly guaranteed profit.",
    type: 'opportunity',
    choices: [
      {
        text: `💰 Invest $${investmentCost} (Exclusive Deal)`,
        action: (gs: GameState) => {
          if (gs.player.money >= investmentCost) {
            const profit = guaranteedReturn - investmentCost;
            return {
              player: { ...gs.player, money: gs.player.money + profit },
              gameLog: [...gs.gameLog, createLog(`[BLUE CHIP] High Influence unlocked exclusive opportunity! (+$${profit})`, 'success')]
            };
          } else {
            return { gameLog: [...gs.gameLog, createLog("Not enough money for this investment.", 'warning')] };
          }
        }
      },
      {
        text: "❌ Pass",
        action: () => { /* Do nothing */ }
      }
    ],
    triggeredAtTurn: gameState.gameTurn
  };
};

export const createSECInvestigationEvent = (gameState: GameState): GameEvent | null => {
  // Only trigger for very low influence
  if (gameState.player.influence > LOW_INFLUENCE_THRESHOLD) return null;

  // 20% chance per turn when influence is below -50
  if (Math.random() > 0.2) return null;

  const eventId = `sec-investigation-${Date.now()}`;
  const finePenalty = Math.floor(gameState.player.money * 0.15); // 15% of current money

  return {
    id: eventId,
    title: "⚖️ SEC Investigation",
    description: "The Securities and Exchange Commission has launched an investigation into your trading practices. Your low public standing has made you a target for regulatory scrutiny.",
    type: 'negative',
    choices: [
      {
        text: `💸 Pay settlement ($${finePenalty})`,
        action: (gs: GameState) => {
          return {
            player: { ...gs.player, money: gs.player.money - finePenalty },
            gameLog: [...gs.gameLog, createLog(`[CONSEQUENCE] SEC investigation settled. Low Influence attracts unwanted attention. (-$${finePenalty})`, 'error')]
          };
        }
      },
      {
        text: "🎲 Contest the charges",
        action: (gs: GameState) => {
          const success = Math.random() > 0.7; // 30% chance to win
          if (success) {
            const newInfluence = Math.min(MAX_INFLUENCE, gs.player.influence + 5);
            return {
              player: { ...gs.player, influence: newInfluence },
              gameLog: [...gs.gameLog, createLog("[VICTORY] Successfully contested SEC charges! (+5 Influence)", 'success')]
            };
          } else {
            const doublePenalty = finePenalty * 2;
            const newInfluence = Math.max(MIN_INFLUENCE, gs.player.influence - 5);
            return {
              player: { ...gs.player, money: gs.player.money - doublePenalty, influence: newInfluence },
              gameLog: [...gs.gameLog, createLog(`[DEFEAT] Lost SEC case. Penalties doubled! (-$${doublePenalty}, -5 Influence)`, 'error')]
            };
          }
        }
      }
    ],
    triggeredAtTurn: gameState.gameTurn
  };
};

export const createRandomGameEvent = async (gameState: GameState): Promise<GameEvent | null> => {
  if (!gameState.currentEra) return null;

  // Adjust event chance based on influence
  let eventChance = 0.3; // Base 30% chance
  if (gameState.player.influence >= HIGH_INFLUENCE_THRESHOLD) {
    eventChance = 0.4; // 40% chance for high influence (more opportunities)
  } else if (gameState.player.influence <= LOW_INFLUENCE_THRESHOLD) {
    eventChance = 0.4; // 40% chance for low influence (more problems)
  }

  if (Math.random() > eventChance) {
    return null;
  }

  const playerStatusHint = `Money: ${gameState.player.money}, Influence: ${gameState.player.influence}`;
  const { title, description, type } = await generateGameEventDescription(gameState.currentEra.name, playerStatusHint);
  
  const eventId = `event-${Date.now()}`;
  let choices;

  // Example dynamic choices based on event type or content
  if (type === 'opportunity') {
    // Opportunity events now have benevolent vs ruthless choices
    const randomChoice = Math.random();
    if (randomChoice > 0.5) {
      // Community investment opportunity
      choices = [
        { text: "💰 Take maximum profit ($200, Ruthless)", action: (gs: GameState) => {
            if (gs.player.money >= 100) {
              const newInfluence = Math.max(MIN_INFLUENCE, gs.player.influence + INFLUENCE_CHANGES.RUTHLESS_EVENT_CHOICE);
              return {
                player: {...gs.player, money: gs.player.money + 100, influence: newInfluence},
                gameLog: [...gs.gameLog, createLog(`[ACTION] Ruthless profit-taking damaged your public image. (${INFLUENCE_CHANGES.RUTHLESS_EVENT_CHOICE} Influence)`, 'warning')]
              };
            } else {
              return { gameLog: [...gs.gameLog, createLog("Not enough money to invest.", 'warning')] };
            }
          }
        },
        { text: "🤝 Share profits with community ($75, Benevolent)", action: (gs: GameState) => {
            if (gs.player.money >= 100) {
              const newInfluence = Math.min(MAX_INFLUENCE, gs.player.influence + INFLUENCE_CHANGES.BENEVOLENT_EVENT_CHOICE);
              return {
                player: {...gs.player, money: gs.player.money - 25, influence: newInfluence},
                gameLog: [...gs.gameLog, createLog(`[ACTION] Your generosity improved your reputation! (+${INFLUENCE_CHANGES.BENEVOLENT_EVENT_CHOICE} Influence)`, 'success')]
              };
            } else {
              return { gameLog: [...gs.gameLog, createLog("Not enough money to invest.", 'warning')] };
            }
          }
        },
        { text: "❌ Decline", action: () => { /* Do nothing */ } }
      ];
    } else {
      // Standard investment opportunity
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
    }
  } else if (type === 'negative' && Math.random() < 0.5) {
     choices = [
        { text: "Pay fine ($50)", action: (gs: GameState) => {
            return { player: {...gs.player, money: gs.player.money - 50}, gameLog: [...gs.gameLog, createLog("Paid a fine.", 'warning')] };
        }},
        { text: "Try to talk your way out", action: (gs: GameState) => {
            const success = Math.random() * (gs.player.influence / 100) > 0.3; // Higher influence helps
            if (success) {
                 const newInfluence = Math.min(MAX_INFLUENCE, gs.player.influence + INFLUENCE_CHANGES.EVENT_TALK_SUCCESS);
                 return { player: {...gs.player, influence: newInfluence }, gameLog: [...gs.gameLog, createLog(`Successfully navigated the situation! (+${INFLUENCE_CHANGES.EVENT_TALK_SUCCESS} Influence)`, 'success')] };
            } else {
                 const newInfluence = Math.max(MIN_INFLUENCE, gs.player.influence + INFLUENCE_CHANGES.EVENT_TALK_FAILURE);
                 return { player: {...gs.player, influence: newInfluence, money: gs.player.money - 75 }, gameLog: [...gs.gameLog, createLog(`Failed to talk your way out, situation worsened. (${INFLUENCE_CHANGES.EVENT_TALK_FAILURE} Influence)`, 'error')] };
            }
        }}
     ];
  } else if (type === 'positive') {
    // Positive events can offer benevolent choices to gain even more influence
    choices = [
      { text: "🎁 Donate to charity ($50)", action: (gs: GameState) => {
          if (gs.player.money >= 50) {
            const newInfluence = Math.min(MAX_INFLUENCE, gs.player.influence + INFLUENCE_CHANGES.BENEVOLENT_EVENT_CHOICE);
            return {
              player: {...gs.player, money: gs.player.money - 50, influence: newInfluence},
              gameLog: [...gs.gameLog, createLog(`[ACTION] Your charitable donation was well-received! (+${INFLUENCE_CHANGES.BENEVOLENT_EVENT_CHOICE} Influence)`, 'success')]
            };
          } else {
            return { gameLog: [...gs.gameLog, createLog("Not enough money to donate.", 'warning')] };
          }
        }
      },
      { text: "💼 Keep the gains", action: () => { /* Do nothing */ } }
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


export const attemptBuyCommodity = (
    player: Player,
    commodity: Commodity,
    quantity: number,
    skills: string[]
): { player?: Player, log?: LogEntry, success: boolean } => {

    let priceMultiplier = 1;
    if (skills.includes(SKILLS_DATA.BASIC_NEGOTIATION.id)) {
        priceMultiplier = 0.98; // 2% discount with Basic Negotiation
    }

    // High influence grants better prices
    if (player.influence >= 50) {
        priceMultiplier *= 0.97; // Additional 3% discount for high influence
    }
    // Low influence results in worse prices
    if (player.influence <= -50) {
        priceMultiplier *= 1.05; // 5% markup for low influence (higher spreads)
    }

    const totalCost = commodity.price * quantity * priceMultiplier;

    if (player.money < totalCost) {
        return { log: createLog(`Not enough money to buy ${quantity} ${commodity.name}. Need $${totalCost.toFixed(2)}.`, 'error'), success: false };
    }
    if (quantity <= 0) {
        return { log: createLog(`Invalid quantity.`, 'error'), success: false };
    }

    const newPlayerState = { ...player };
    newPlayerState.money -= totalCost;

    const existingAmount = newPlayerState.commodities[commodity.id]?.quantity || 0;
    const existingAvgPrice = newPlayerState.commodities[commodity.id]?.avgBuyPrice || 0;
    
    const newTotalQuantity = existingAmount + quantity;
    const newAvgBuyPrice = ((existingAvgPrice * existingAmount) + (commodity.price * priceMultiplier * quantity)) / newTotalQuantity;

    newPlayerState.commodities = {
        ...newPlayerState.commodities,
        [commodity.id]: { quantity: newTotalQuantity, avgBuyPrice: parseFloat(newAvgBuyPrice.toFixed(2)) }
    };
    
    return { 
        player: newPlayerState, 
        log: createLog(`Bought ${quantity} ${commodity.name} for $${totalCost.toFixed(2)}. New avg price: $${newAvgBuyPrice.toFixed(2)}`, 'success'),
        success: true
    };
};

export const attemptSellCommodity = (
    player: Player,
    commodity: Commodity,
    quantity: number,
    skills: string[],
    isStopLoss: boolean = false
): { player?: Player, log?: LogEntry, success: boolean, influenceChange?: number } => {

    const currentOwned = player.commodities[commodity.id]?.quantity || 0;
    if (quantity <= 0) {
        return { log: createLog(`Invalid quantity.`, 'error'), success: false };
    }
    if (currentOwned < quantity) {
        return { log: createLog(`Not enough ${commodity.name} to sell. Owned: ${currentOwned}.`, 'error'), success: false };
    }

    let priceMultiplier = 1;
    if (skills.includes(SKILLS_DATA.BASIC_NEGOTIATION.id)) {
        priceMultiplier = 1.02; // 2% bonus with Basic Negotiation
    }

    // High influence grants better selling prices
    if (player.influence >= 50) {
        priceMultiplier *= 1.03; // Additional 3% bonus for high influence
    }
    // Low influence results in worse selling prices
    if (player.influence <= -50) {
        priceMultiplier *= 0.95; // 5% penalty for low influence (higher spreads)
    }

    const totalRevenue = commodity.price * quantity * priceMultiplier;
    const avgBuyPrice = player.commodities[commodity.id].avgBuyPrice;
    const costOfGoodsSold = avgBuyPrice * quantity;
    const profit = totalRevenue - costOfGoodsSold;
    const profitPercentage = (profit / costOfGoodsSold) * 100;

    const newPlayerState = { ...player };
    newPlayerState.money += totalRevenue;

    // Calculate influence change
    let influenceChange = 0;
    let influenceMsg = '';

    if (isStopLoss) {
        // Successfully using stop loss is seen as savvy risk management
        influenceChange = INFLUENCE_CHANGES.SUCCESSFUL_STOP_LOSS;
        influenceMsg = ` [Savvy risk management: +${influenceChange} Influence]`;
    } else if (profit > 0 && profitPercentage > 20) {
        // Large quick profit seen as greedy
        influenceChange = INFLUENCE_CHANGES.LARGE_PROFIT_QUICK_TRADE;
        influenceMsg = ` [Quick profit seen as greedy: ${influenceChange} Influence]`;
    }

    if (influenceChange !== 0) {
        newPlayerState.influence = Math.max(MIN_INFLUENCE, Math.min(MAX_INFLUENCE, player.influence + influenceChange));
    }

    newPlayerState.commodities = {
        ...newPlayerState.commodities,
        [commodity.id]: { ...newPlayerState.commodities[commodity.id], quantity: currentOwned - quantity }
    };

    if (newPlayerState.commodities[commodity.id].quantity === 0) {
        delete newPlayerState.commodities[commodity.id]; // Clean up if zero quantity
    }

    const profitLossMsg = profit >= 0 ? `Profit: $${profit.toFixed(2)}` : `Loss: $${Math.abs(profit).toFixed(2)}`;
    return {
        player: newPlayerState,
        log: createLog(`Sold ${quantity} ${commodity.name} for $${totalRevenue.toFixed(2)}. ${profitLossMsg}${influenceMsg}`, 'success'),
        success: true,
        influenceChange
    };
};

export const attemptBuyProperty = (
    player: Player, 
    property: Property
): { player?: Player, log?: LogEntry, success: boolean } => {
    if (player.money < property.cost) {
        return { log: createLog(`Not enough money to buy ${property.name}. Need $${property.cost.toFixed(2)}.`, 'error'), success: false };
    }
    if (player.properties.includes(property.id)) {
        return { log: createLog(`You already own ${property.name}.`, 'warning'), success: false };
    }

    const newPlayerState = { ...player };
    newPlayerState.money -= property.cost;
    newPlayerState.properties = [...newPlayerState.properties, property.id];
    
    return { 
        player: newPlayerState, 
        log: createLog(`Bought ${property.name} for $${property.cost.toFixed(2)}.`, 'success'),
        success: true
    };
};

export const attemptUnlockSkill = (
    player: Player,
    skill: Skill
): { player?: Player, log?: LogEntry, success: boolean } => {
    // High influence grants skill discounts
    let costMultiplier = 1;
    let discountMsg = '';
    if (player.influence >= 50) {
        costMultiplier = 0.85; // 15% discount for high influence
        discountMsg = ' (15% High Influence discount applied!)';
    }

    const actualCost = skill.cost * costMultiplier;

    if (player.money < actualCost) {
        return { log: createLog(`Not enough money to learn ${skill.name}. Need $${actualCost.toFixed(2)}.`, 'error'), success: false };
    }
    if (player.skills.includes(skill.id)) {
        return { log: createLog(`You already know ${skill.name}.`, 'warning'), success: false };
    }

    const newPlayerState = { ...player };
    newPlayerState.money -= actualCost;
    newPlayerState.skills = [...newPlayerState.skills, skill.id];

    return {
        player: newPlayerState,
        log: createLog(`Unlocked skill: ${skill.name} for $${actualCost.toFixed(2)}${discountMsg}.`, 'success'),
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
  skills: string[]
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
        result = attemptBuyCommodity(tempPlayer, commodity, order.quantity, skills);
      } else {
        // Pass isStopLoss flag to track savvy risk management
        const isStopLoss = order.type === 'STOP_LOSS_SELL';
        result = attemptSellCommodity(tempPlayer, commodity, order.quantity, skills, isStopLoss);
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