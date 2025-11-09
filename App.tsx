

import React, { useState, useEffect, useCallback } from 'react';
import {
  Player, Commodity, Property, Skill, GameEvent, Era, LogEntry, GameState, ActiveView, Order, Job
} from './types';
import {
  INITIAL_PLAYER_REPUTATION, GAME_TICK_INTERVAL_MS, MAX_LOG_ENTRIES,
  COMMODITIES_DATA, PROPERTIES_DATA, SKILLS_DATA, JOBS_DATA, API_KEY_WARNING,
  INITIAL_PLAYER_STATISTICS, INITIAL_PRESTIGE_DATA, INITIAL_PROGRESSION_DATA
} from './constants';
import { isGeminiAvailable } from './services/geminiService';
import * as GameLogic from './services/gameLogic';
import * as AchievementService from './services/achievementChecker';
import { ACHIEVEMENTS } from './data/achievements';
import { generateDailyChallenge } from './data/dailyChallenges';
import { PRESTIGE_BONUSES, calculatePrestigePoints } from './data/prestigeBonuses';
import { checkNewMilestones, getReputationTier } from './data/progression';
import { WIN_CONDITIONS, checkWinConditions } from './data/winConditions';
import { EraSelector } from './components/EraSelector';
import { Dashboard } from './components/Dashboard';
import { MarketView } from './components/MarketView';
import { RealEstateView } from './components/RealEstateView';
import { SkillsView } from './components/SkillsView';
import { JobsView } from './components/JobsView';
import { TradingView } from './components/TradingView';
import { CasinoView } from './components/CasinoView';
import { AchievementsView } from './components/AchievementsView';
import { StatisticsView } from './components/StatisticsView';
import { DailyChallengesView } from './components/DailyChallengesView';
import { PrestigeView } from './components/PrestigeView';
import { MilestonesView } from './components/MilestonesView';
import { MilestoneNotification } from './components/MilestoneNotification';
import { WinConditionsView } from './components/WinConditionsView';
import { VictoryModal } from './components/VictoryModal';
import { MiniGameModal } from './components/MiniGameModal';
import { EventPopup } from './components/EventPopup';
import { AchievementNotification } from './components/AchievementNotification';
import { LogView } from './components/LogView';
import { WorldNewsModal } from './components/WorldNewsModal';
import { Button } from './components/ui/Button';
import { ToastContainer } from './components/ui/Toast';
import { Tutorial, createTutorialSteps } from './components/Tutorial';
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp';
import { useKeyboardShortcuts, KeyboardShortcut } from './hooks/useKeyboardShortcuts';
import { CommodityIcon, PropertyIcon, SkillIcon, MoneyIcon, TrendUpIcon, NewsIcon, LoadingSpinnerIcon, CasinoIcon, AchievementsIcon, StatisticsIcon, DailyChallengesIcon, PrestigeIcon, MilestonesIcon } from './components/icons';
import { formatDate } from './services/historicalData';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      money: 0,
      reputation: INITIAL_PLAYER_REPUTATION,
      commodities: {},
      properties: {},
      skills: [],
      orders: [],
      currentJob: null,
      jobPerformance: {},
      optionsContracts: [],
      leveragedPositions: [],
      tradingLevel: 1,
      achievements: [],
      statistics: INITIAL_PLAYER_STATISTICS,
      dailyChallenge: null,
      prestigeData: INITIAL_PRESTIGE_DATA,
      progressionData: INITIAL_PROGRESSION_DATA,
    },
    currentEra: null,
    commodities: COMMODITIES_DATA,
    properties: PROPERTIES_DATA,
    skills: SKILLS_DATA,
    jobs: JOBS_DATA,
    gameLog: [],
    currentEvent: null,
    gameTurn: 0,
    gameStarted: false,
    isLoadingEvent: false,
    marketNews: [],
    priceHistory: {},
    activeMiniGame: null,
    currentDate: { month: 1, year: 1950 },
    worldNewsHistory: [],
    showWorldNews: false,
    achievements: ACHIEVEMENTS,
    newAchievementUnlocked: null,
    prestige: INITIAL_PRESTIGE_DATA,

    // Advanced Trading Mechanics
    marketSentiments: [],
    upcomingStockSplits: [],
    bankruptcyHistory: [],

    // Win Conditions
    winConditions: WIN_CONDITIONS,
    winConditionProgress: [],
    gameWon: false,
    winningCondition: null,
  });

  const [activeView, setActiveView] = useState<ActiveView>('MARKET');
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(!isGeminiAvailable());

  // UI/UX state
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: LogEntry['type'] }>>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [newMilestoneUnlocked, setNewMilestoneUnlocked] = useState<import('./types').Milestone | null>(null);

  const addLogEntry = useCallback((message: string, type: LogEntry['type']) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog.slice(-MAX_LOG_ENTRIES + 1), GameLogic.createLog(message, type)],
    }));

    // Also show toast notification
    const toastId = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id: toastId, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSelectEra = useCallback((era: Era) => {
    // Initialize commodities with historical prices for the starting date
    const initialCommodities = GameLogic.updateMarketPricesHistorical(
      COMMODITIES_DATA,
      era.startDate,
      era
    );

    setGameState(prev => {
      // Apply prestige bonuses to starting money and reputation
      const prestigeData = prev.player.prestigeData || INITIAL_PRESTIGE_DATA;
      const startingCapitalBonus = (prestigeData.bonuses['STARTING_CAPITAL'] || 0) * 1000;
      const startingReputationBonus = (prestigeData.bonuses['FAMOUS_START'] || 0) * 25;

      return {
        ...prev,
        player: {
          ...prev.player,
          money: era.startingMoney + startingCapitalBonus,
          reputation: INITIAL_PLAYER_REPUTATION + startingReputationBonus,
        },
        currentEra: era,
        currentDate: era.startDate,
        commodities: initialCommodities,
        gameTurn: 1,
        gameStarted: true,
        worldNewsHistory: [],
        showWorldNews: false,
        gameLog: [GameLogic.createLog(`Welcome to the ${era.name} era! Your journey begins in ${era.startDate.year}.`, 'event')],
      };
    });
    setActiveView('MARKET');
  }, []);

  // Game Tick Effect
  useEffect(() => {
    if (!gameState.gameStarted || !gameState.currentEra) return;

    const tick = async () => {
      setGameState(prev => {
        // Use prev state instead of stale gameState closure
        const previousCommodities = { ...prev.commodities };

        // Advance the date by one month
        const { newDate, newEra } = GameLogic.advanceGameDate(prev.currentDate, prev.currentEra!);

        // Check for world news events for this date
        const newsEvents = GameLogic.checkForWorldNews(newDate);
        const hasNews = newsEvents.length > 0;

        // Update commodities with historical prices
        let updatedCommodities = GameLogic.updateMarketPricesHistorical(prev.commodities, newDate, newEra || prev.currentEra!);

        // Advanced Trading: Generate random market sentiment
        const newSentiments = [...prev.marketSentiments];
        for (const commodityId of Object.keys(updatedCommodities)) {
          const sentiment = GameLogic.generateMarketSentiment(commodityId, updatedCommodities, prev.gameTurn + 1);
          if (sentiment) {
            newSentiments.push(sentiment);
          }
        }

        // Advanced Trading: Update and apply market sentiments
        const activeSentiments = GameLogic.updateMarketSentiments(newSentiments);
        updatedCommodities = GameLogic.applyMarketSentiment(updatedCommodities, activeSentiments);

        const income = GameLogic.calculatePlayerIncome(prev.player, prev.properties, prev.skills, updatedCommodities);

        let newPlayerState = { ...prev.player, money: prev.player.money + income };
        let newLogs: LogEntry[] = [];

        if (income > 0) {
          newLogs.push(GameLogic.createLog(`Earned $${income.toFixed(2)} from investments.`, 'success'));
        } else if (income < 0) {
          newLogs.push(GameLogic.createLog(`Lost $${Math.abs(income).toFixed(2)} from property maintenance.`, 'warning'));
        }

        // Update property values (appreciation)
        newPlayerState = GameLogic.updatePropertyValues(newPlayerState, prev.properties, prev.player.skills);

        // Advanced Trading: Process dividend payments
        const {
          player: playerAfterDividends,
          commodities: commoditiesAfterDividends,
          logs: dividendLogs
        } = GameLogic.processDividendPayments(
          newPlayerState,
          updatedCommodities,
          prev.gameTurn + 1
        );
        newPlayerState = playerAfterDividends;
        updatedCommodities = commoditiesAfterDividends;
        if (dividendLogs.length > 0) {
          newLogs.push(...dividendLogs);
        }

        // Advanced Trading: Process stock splits
        const {
          player: playerAfterSplits,
          commodities: commoditiesAfterSplits,
          logs: splitLogs,
          updatedSplits
        } = GameLogic.processStockSplits(
          newPlayerState,
          updatedCommodities,
          prev.upcomingStockSplits,
          prev.gameTurn + 1
        );
        newPlayerState = playerAfterSplits;
        updatedCommodities = commoditiesAfterSplits;
        if (splitLogs.length > 0) {
          newLogs.push(...splitLogs);
        }

        // Advanced Trading: Check for new stock splits (5% chance per eligible commodity)
        const newSplits = [...updatedSplits];
        for (const commodityId of Object.keys(updatedCommodities)) {
          if (Math.random() < 0.05) {
            const split = GameLogic.scheduleStockSplit(commodityId, updatedCommodities, prev.gameTurn + 1);
            if (split) {
              newSplits.push(split);
            }
          }
        }

        // Process pending orders
        const { player: playerAfterOrders, logs: orderLogs } = GameLogic.processPendingOrders(
          newPlayerState,
          updatedCommodities,
          prev.player.skills,
          prev.gameTurn
        );
        newPlayerState = playerAfterOrders;
        if (orderLogs.length > 0) {
            newLogs.push(...orderLogs);
        }

        // Process expired options
        const { player: playerAfterOptions, logs: optionLogs } = GameLogic.processExpiredOptions(
          newPlayerState,
          prev.gameTurn + 1
        );
        newPlayerState = playerAfterOptions;
        if (optionLogs.length > 0) {
          newLogs.push(...optionLogs);
        }

        // Update leverage positions
        newPlayerState = GameLogic.updateLeveragePositions(newPlayerState, updatedCommodities);

        // Process liquidations
        const { player: playerAfterLiquidations, logs: liquidationLogs } = GameLogic.processLiquidations(
          newPlayerState,
          updatedCommodities
        );
        newPlayerState = playerAfterLiquidations;
        if (liquidationLogs.length > 0) {
          newLogs.push(...liquidationLogs);
        }

        // Advanced Trading: Check for bankruptcies
        const {
          player: playerAfterBankruptcy,
          commodities: commoditiesAfterBankruptcy,
          logs: bankruptcyLogs,
          bankruptcyEvents
        } = GameLogic.processBankruptcyChecks(
          newPlayerState,
          updatedCommodities,
          prev.gameTurn + 1
        );
        newPlayerState = playerAfterBankruptcy;
        updatedCommodities = commoditiesAfterBankruptcy;
        if (bankruptcyLogs.length > 0) {
          newLogs.push(...bankruptcyLogs);
        }

        // Update price history for charts
        const updatedPriceHistory = GameLogic.updatePriceHistory(
          prev.priceHistory,
          updatedCommodities,
          previousCommodities,
          prev.gameTurn + 1
        );

        // Prepare new logs for era transition
        if (newEra) {
          newLogs.push(GameLogic.createLog(`🎉 Era transition! Welcome to the ${newEra.name}!`, 'event'));
        }

        // Add news events to history
        const updatedNewsHistory = [...prev.worldNewsHistory, ...newsEvents];
        const updatedBankruptcyHistory = [...prev.bankruptcyHistory, ...bankruptcyEvents];

        return {
          ...prev,
          player: {
            ...newPlayerState,
            money: parseFloat(newPlayerState.money.toFixed(2)),
          },
          currentDate: newDate,
          currentEra: newEra || prev.currentEra,
          commodities: updatedCommodities,
          priceHistory: updatedPriceHistory,
          gameLog: [...prev.gameLog, ...newLogs].slice(-MAX_LOG_ENTRIES),
          gameTurn: prev.gameTurn + 1,
          isLoadingEvent: false,
          worldNewsHistory: updatedNewsHistory,
          showWorldNews: hasNews,

          // Advanced Trading Mechanics state updates
          marketSentiments: activeSentiments,
          upcomingStockSplits: newSplits,
          bankruptcyHistory: updatedBankruptcyHistory,
        };
      });

      // Fetch market news async (50% chance each turn)
      if (Math.random() < 0.5) {
        const latestNewsItem = await GameLogic.fetchMarketNewsForRandomCommodity(gameState);
        if(latestNewsItem) {
          setGameState(prev => ({
            ...prev,
            gameLog: [...prev.gameLog, GameLogic.createLog(`News: ${latestNewsItem}`, 'info')].slice(-MAX_LOG_ENTRIES),
            marketNews: [latestNewsItem, ...prev.marketNews].slice(0, 10)
          }));
        }
      }

      // Attempt to trigger a random event
      if (!gameState.currentEvent) {
        const newEvent = await GameLogic.createRandomGameEvent(gameState);
        if (newEvent) {
          setGameState(prev => ({
            ...prev,
            currentEvent: newEvent,
            gameLog: [...prev.gameLog, GameLogic.createLog(`Event: ${newEvent.title}`, 'event')].slice(-MAX_LOG_ENTRIES)
          }));
        }
      }
    };

    const intervalId = setInterval(tick, GAME_TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameStarted]); // Only depend on gameStarted, not gameTurn

  // Achievement Checking Effect - runs when game state changes
  useEffect(() => {
    if (!gameState.gameStarted) return;

    // Check for newly unlocked achievements
    const newlyUnlocked = AchievementService.checkAchievements(gameState);

    if (newlyUnlocked.length > 0) {
      // Award achievements one at a time (to avoid spam)
      const achievement = newlyUnlocked[0];
      setGameState(prev => AchievementService.awardAchievement(prev, achievement));
    }

    // Update peak net worth
    const currentNetWorth = AchievementService.calculateNetWorth(gameState);
    setGameState(prev => AchievementService.updatePeakNetWorth(prev, currentNetWorth));
  }, [gameState.gameTurn, gameState.player.money, gameState.player.properties, gameState.player.skills]);

  // Milestone Checking Effect - runs when game state changes
  useEffect(() => {
    if (!gameState.gameStarted) return;

    // Check for newly completed milestones
    const newMilestones = checkNewMilestones(gameState);

    if (newMilestones.length > 0) {
      // Award milestones one at a time (to avoid spam)
      const milestone = newMilestones[0];

      // Award rewards
      setGameState(prev => {
        const updated = { ...prev };
        if (milestone.reward) {
          if (milestone.reward.money) {
            updated.player = { ...prev.player, money: prev.player.money + milestone.reward.money };
          }
          if (milestone.reward.reputation) {
            updated.player = { ...updated.player, reputation: updated.player.reputation + milestone.reward.reputation };
          }
        }

        // Mark milestone as unlocked
        const unlockedMilestones = prev.player.progressionData?.unlockedMilestones || [];
        updated.player = {
          ...updated.player,
          progressionData: {
            ...INITIAL_PROGRESSION_DATA,
            ...prev.player.progressionData,
            unlockedMilestones: [...unlockedMilestones, milestone.id],
            currentReputationTier: getReputationTier(updated.player.reputation).id
          }
        };

        return updated;
      });

      // Show milestone notification
      setNewMilestoneUnlocked(milestone);

      // Log milestone achievement
      addLogEntry(`🏆 Milestone: ${milestone.name}!`, 'success');
    }

    // Update reputation tier
    const currentTier = getReputationTier(gameState.player.reputation);
    const savedTier = gameState.player.progressionData?.currentReputationTier;
    if (currentTier.id !== savedTier) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          progressionData: {
            ...INITIAL_PROGRESSION_DATA,
            ...prev.player.progressionData,
            currentReputationTier: currentTier.id
          }
        }
      }));
      addLogEntry(`⭐ Reputation Tier Up: ${currentTier.name}!`, 'event');
    }
  }, [gameState.gameTurn, gameState.player.money, gameState.player.reputation, gameState.player.properties, gameState.player.skills, addLogEntry]);

  // Win Condition Checking Effect - runs when game state changes
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameWon) return;

    // Check for win conditions
    const wonCondition = checkWinConditions(gameState);

    if (wonCondition) {
      // Mark win condition as completed
      setGameState(prev => {
        const existingProgress = prev.winConditionProgress.find(p => p.conditionId === wonCondition.id);
        if (existingProgress?.completed) return prev; // Already completed

        const newProgress = {
          conditionId: wonCondition.id,
          completed: true,
          completedAtTurn: prev.gameTurn,
          completedDate: prev.currentDate,
          timeToComplete: prev.gameTurn
        };

        // Award prestige points if this is the first win
        let updatedPrestige = prev.prestige;
        if (!prev.gameWon && wonCondition.reward?.prestigePoints) {
          updatedPrestige = {
            ...prev.prestige,
            totalPrestigePoints: prev.prestige.totalPrestigePoints + wonCondition.reward.prestigePoints,
            availablePrestigePoints: prev.prestige.availablePrestigePoints + wonCondition.reward.prestigePoints
          };
        }

        return {
          ...prev,
          winConditionProgress: [...prev.winConditionProgress.filter(p => p.conditionId !== wonCondition.id), newProgress],
          gameWon: true,
          winningCondition: wonCondition,
          prestige: updatedPrestige
        };
      });

      addLogEntry(`🎉 VICTORY! You've achieved: ${wonCondition.name}!`, 'success');
    }
  }, [gameState.gameTurn, gameState.player.money, gameState.player.reputation, gameState.player.properties, gameState.player.skills, gameState.player.statistics, gameState.player.achievements, gameState.gameStarted, gameState.gameWon, addLogEntry]);

  const handleBuyCommodity = useCallback((commodityId: string, quantity: number) => {
    const commodity = gameState.commodities[commodityId];
    if (!commodity) return;
    const result = GameLogic.attemptBuyCommodity(gameState.player, commodity, quantity, gameState.player.skills, gameState.gameTurn);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, gameState.player.skills, gameState.gameTurn, addLogEntry]);

  const handleSellCommodity = useCallback((commodityId: string, quantity: number) => {
    const commodity = gameState.commodities[commodityId];
    if (!commodity) return;
    const result = GameLogic.attemptSellCommodity(gameState.player, commodity, quantity, gameState.player.skills);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, gameState.player.skills, addLogEntry]);

  const handleBuyProperty = useCallback((propertyId: string) => {
    const property = gameState.properties[propertyId];
    if (!property) return;
    const result = GameLogic.attemptBuyProperty(gameState.player, property, gameState.gameTurn);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.properties, gameState.gameTurn, addLogEntry]);

  const handleUnlockSkill = useCallback((skillId: string) => {
    const skill = gameState.skills[skillId];
    if (!skill) return;
    const result = GameLogic.attemptUnlockSkill(gameState.player, skill);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.skills, addLogEntry]);

  const handlePlaceOrder = useCallback((order: Omit<Order, 'id' | 'createdAtTurn'>) => {
    const result = GameLogic.attemptPlaceOrder(gameState.player, gameState.commodities, order, gameState.gameTurn);
    if (result.success && result.player) {
        setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, gameState.gameTurn, addLogEntry]);

  const handleCancelOrder = useCallback((orderId: string) => {
    const result = GameLogic.attemptCancelOrder(gameState.player, orderId);
    if (result.success && result.player) {
        setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, addLogEntry]);

  const handleEventChoice = useCallback((choiceAction: (gs: GameState) => Partial<GameState> | void) => {
    const stateChanges = choiceAction(gameState);
    if (stateChanges) {
        setGameState(prev => ({
            ...prev,
            ...stateChanges,
            player: stateChanges.player ? { ...prev.player, ...stateChanges.player } : prev.player,
            gameLog: stateChanges.gameLog ? stateChanges.gameLog.slice(-MAX_LOG_ENTRIES) : prev.gameLog,
        }));
    }
    setGameState(prev => ({ ...prev, currentEvent: null })); // Clear event after choice
  }, [gameState]);

  const handleSelectJob = useCallback((jobId: string) => {
    const result = GameLogic.selectJob(gameState.player, jobId);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, addLogEntry]);

  const handleWorkShift = useCallback((jobId: string) => {
    const job = gameState.jobs[jobId];
    if (!job) return;

    // Open the mini-game modal
    setGameState(prev => ({
      ...prev,
      activeMiniGame: { jobId, type: job.miniGameType }
    }));
  }, [gameState.jobs]);

  const handleMiniGameComplete = useCallback((result: import('./types').MiniGameResult) => {
    if (!gameState.activeMiniGame) return;

    const jobId = gameState.activeMiniGame.jobId;
    const { player: updatedPlayer, log } = GameLogic.processJobResult(gameState.player, jobId, result);

    setGameState(prev => ({
      ...prev,
      player: updatedPlayer,
      activeMiniGame: null,
      gameLog: [...prev.gameLog, log].slice(-MAX_LOG_ENTRIES)
    }));
  }, [gameState.activeMiniGame, gameState.player]);

  const handleBuyOption = useCallback((commodityId: string, type: 'CALL' | 'PUT', strikePrice: number, premium: number, quantity: number, expirationTurns: number) => {
    const result = GameLogic.buyOption(gameState.player, commodityId, type, strikePrice, premium, quantity, expirationTurns, gameState.gameTurn);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.gameTurn, addLogEntry]);

  const handleExerciseOption = useCallback((optionId: string) => {
    const result = GameLogic.exerciseOption(gameState.player, optionId, gameState.commodities);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, addLogEntry]);

  const handleSellOption = useCallback((optionId: string) => {
    const result = GameLogic.sellOption(gameState.player, optionId, gameState.commodities);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, addLogEntry]);

  const handleOpenLeveragePosition = useCallback((commodityId: string, type: 'LONG' | 'SHORT', leverage: number, quantity: number) => {
    const commodity = gameState.commodities[commodityId];
    if (!commodity) return;
    const result = GameLogic.openLeveragePosition(gameState.player, commodityId, type, leverage, quantity, commodity.price, gameState.gameTurn);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, gameState.gameTurn, addLogEntry]);

  const handleCloseLeveragePosition = useCallback((positionId: string) => {
    const position = gameState.player.leveragedPositions.find(p => p.id === positionId);
    if (!position) return;
    const commodity = gameState.commodities[position.commodityId];
    if (!commodity) return;
    const result = GameLogic.closeLeveragePosition(gameState.player, positionId, commodity.price);
    if (result.success && result.player) {
      setGameState(prev => ({ ...prev, player: result.player! }));
    }
    if (result.log) addLogEntry(result.log.message, result.log.type);
  }, [gameState.player, gameState.commodities, addLogEntry]);

  const handleCasinoBet = useCallback((betAmount: number, winnings: number, gameType: string) => {
    setGameState(prev => {
      // Track gambling statistics
      let updatedState = AchievementService.recordGambling(prev, winnings);

      // Update money
      updatedState = {
        ...updatedState,
        player: {
          ...updatedState.player,
          money: updatedState.player.money + winnings
        }
      };

      // Check for achievements
      const newlyUnlocked = AchievementService.checkAchievements(updatedState);
      if (newlyUnlocked.length > 0) {
        // Award first new achievement (show one at a time)
        updatedState = AchievementService.awardAchievement(updatedState, newlyUnlocked[0]);
      }

      return updatedState;
    });

    const message = winnings >= 0
      ? `Won $${winnings} playing ${gameType}!`
      : `Lost $${Math.abs(winnings)} playing ${gameType}.`;
    addLogEntry(message, winnings >= 0 ? 'success' : 'warning');
  }, [addLogEntry]);

  const handleGenerateDailyChallenge = useCallback(() => {
    const newChallenge = generateDailyChallenge(gameState.gameTurn);
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        dailyChallenge: newChallenge
      }
    }));
    addLogEntry(`New daily challenge: ${newChallenge.description}`, 'info');
  }, [gameState.gameTurn, addLogEntry]);

  const handleCompleteDailyChallenge = useCallback(() => {
    const challenge = gameState.player.dailyChallenge;
    if (!challenge) return;

    // Award rewards
    setGameState(prev => {
      let updatedState = {
        ...prev,
        player: {
          ...prev.player,
          money: prev.player.money + challenge.reward.money,
          reputation: prev.player.reputation + challenge.reward.reputation,
          dailyChallenge: null // Clear the challenge
        }
      };

      // Check for achievements after reward
      const newlyUnlocked = AchievementService.checkAchievements(updatedState);
      if (newlyUnlocked.length > 0) {
        updatedState = AchievementService.awardAchievement(updatedState, newlyUnlocked[0]);
      }

      return updatedState;
    });

    addLogEntry(
      `Challenge completed! Earned $${challenge.reward.money} and ${challenge.reward.reputation} reputation!`,
      'success'
    );
  }, [gameState.player.dailyChallenge, addLogEntry]);

  const handlePrestige = useCallback(() => {
    const currentNetWorth = AchievementService.calculateNetWorth(gameState);
    const achievementsCount = gameState.player.achievements.length;
    const turnsPlayed = gameState.gameTurn;

    // Calculate prestige points
    const earnedPoints = calculatePrestigePoints(currentNetWorth, achievementsCount, turnsPlayed);

    if (earnedPoints === 0) {
      addLogEntry('You need at least $10,000 net worth to prestige!', 'warning');
      return;
    }

    // Update lifetime stats
    const prestigeData = gameState.player.prestigeData || INITIAL_PRESTIGE_DATA;
    const updatedPrestigeData = {
      ...prestigeData,
      totalPrestigePoints: prestigeData.totalPrestigePoints + earnedPoints,
      availablePrestigePoints: prestigeData.availablePrestigePoints + earnedPoints,
      prestigeLevel: prestigeData.prestigeLevel + 1,
      lifetimeStats: {
        totalRuns: prestigeData.lifetimeStats.totalRuns + 1,
        highestNetWorth: Math.max(prestigeData.lifetimeStats.highestNetWorth, currentNetWorth),
        totalMoneyEarned: prestigeData.lifetimeStats.totalMoneyEarned + gameState.player.statistics.totalProfit,
        totalAchievements: prestigeData.lifetimeStats.totalAchievements + achievementsCount,
        totalTurnsPlayed: prestigeData.lifetimeStats.totalTurnsPlayed + turnsPlayed,
        fastestMillionaire: currentNetWorth >= 1000000 && (prestigeData.lifetimeStats.fastestMillionaire === 0 || turnsPlayed < prestigeData.lifetimeStats.fastestMillionaire)
          ? turnsPlayed
          : prestigeData.lifetimeStats.fastestMillionaire,
        mostPropertiesOwned: Math.max(prestigeData.lifetimeStats.mostPropertiesOwned, Object.keys(gameState.player.properties).length),
        highestReputation: Math.max(prestigeData.lifetimeStats.highestReputation, gameState.player.reputation)
      }
    };

    // Apply starting bonuses from prestige upgrades
    const startingMoney = gameState.currentEra?.startingMoney || 10000;
    const startingCapitalBonus = (prestigeData.bonuses['STARTING_CAPITAL'] || 0) * 1000;
    const startingReputationBonus = (prestigeData.bonuses['FAMOUS_START'] || 0) * 25;

    // Reset game state but keep prestige data
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        money: startingMoney + startingCapitalBonus,
        reputation: INITIAL_PLAYER_REPUTATION + startingReputationBonus,
        commodities: {},
        properties: {},
        skills: [],
        orders: [],
        currentJob: null,
        jobPerformance: {},
        optionsContracts: [],
        leveragedPositions: [],
        tradingLevel: 1,
        achievements: [],
        statistics: INITIAL_PLAYER_STATISTICS,
        dailyChallenge: null,
        prestigeData: updatedPrestigeData
      },
      gameTurn: 1,
      gameLog: [GameLogic.createLog(`🌟 Prestige Level ${updatedPrestigeData.prestigeLevel}! Earned ${earnedPoints} prestige points!`, 'event')],
      currentEvent: null,
      currentDate: prev.currentEra!.startDate,
      worldNewsHistory: [],
      marketNews: [],
      priceHistory: {}
    }));

    addLogEntry(`Prestiged to level ${updatedPrestigeData.prestigeLevel}! Starting fresh with ${earnedPoints} new prestige points.`, 'success');
  }, [gameState, addLogEntry]);

  // Victory Modal handlers
  const handleContinuePlaying = useCallback(() => {
    // Clear the game won state but keep the win condition progress
    setGameState(prev => ({
      ...prev,
      gameWon: false,
      winningCondition: null
    }));
    addLogEntry('Continuing to pursue additional victories!', 'success');
  }, [addLogEntry]);

  const handleVictoryPrestige = useCallback(() => {
    // Same as handlePrestige but designed for post-victory
    handlePrestige();
  }, [handlePrestige]);

  const handleUpgradeBonus = useCallback((bonusId: string) => {
    const bonus = PRESTIGE_BONUSES.find(b => b.id === bonusId);
    if (!bonus) return;

    const prestigeData = gameState.player.prestigeData || INITIAL_PRESTIGE_DATA;
    const currentLevel = prestigeData.bonuses[bonusId] || 0;

    if (currentLevel >= bonus.maxLevel) {
      addLogEntry(`${bonus.name} is already at maximum level!`, 'warning');
      return;
    }

    const cost = bonus.cost * (currentLevel + 1);

    if (prestigeData.availablePrestigePoints < cost) {
      addLogEntry(`Not enough prestige points! Need ${cost}, have ${prestigeData.availablePrestigePoints}.`, 'warning');
      return;
    }

    // Upgrade the bonus
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        prestigeData: {
          ...prestigeData,
          availablePrestigePoints: prestigeData.availablePrestigePoints - cost,
          bonuses: {
            ...prestigeData.bonuses,
            [bonusId]: currentLevel + 1
          }
        }
      }
    }));

    addLogEntry(`Upgraded ${bonus.name} to level ${currentLevel + 1}!`, 'success');
  }, [gameState.player.prestigeData, addLogEntry]);

  // Keyboard shortcuts
  const keyboardShortcuts: KeyboardShortcut[] = [
    {
      key: '?',
      action: () => setShowKeyboardHelp(!showKeyboardHelp),
      description: 'Toggle keyboard shortcuts help',
      category: 'General'
    },
    {
      key: 't',
      action: () => setShowTutorial(!showTutorial),
      description: 'Toggle tutorial',
      category: 'General'
    },
    {
      key: '1',
      action: () => setActiveView('MARKET'),
      description: 'Go to Market',
      category: 'Navigation'
    },
    {
      key: '2',
      action: () => setActiveView('REAL_ESTATE'),
      description: 'Go to Real Estate',
      category: 'Navigation'
    },
    {
      key: '3',
      action: () => setActiveView('SKILLS'),
      description: 'Go to Skills',
      category: 'Navigation'
    },
    {
      key: '4',
      action: () => setActiveView('JOBS'),
      description: 'Go to Jobs',
      category: 'Navigation'
    },
    {
      key: '5',
      action: () => setActiveView('TRADING'),
      description: 'Go to Trading',
      category: 'Navigation'
    },
    {
      key: '6',
      action: () => setActiveView('CASINO'),
      description: 'Go to Casino',
      category: 'Navigation'
    },
    {
      key: 'a',
      action: () => setActiveView('ACHIEVEMENTS'),
      description: 'Go to Achievements',
      category: 'Navigation'
    },
    {
      key: 's',
      action: () => setActiveView('STATISTICS'),
      description: 'Go to Statistics',
      category: 'Navigation'
    },
    {
      key: 'c',
      action: () => setActiveView('DAILY_CHALLENGES'),
      description: 'Go to Daily Challenges',
      category: 'Navigation'
    },
    {
      key: 'p',
      action: () => setActiveView('PRESTIGE'),
      description: 'Go to Prestige',
      category: 'Navigation'
    },
    {
      key: 'm',
      action: () => setActiveView('MILESTONES'),
      description: 'Go to Milestones',
      category: 'Navigation'
    },
    {
      key: 'n',
      action: () => setGameState(prev => ({ ...prev, showWorldNews: true })),
      description: 'Show world news',
      category: 'Actions'
    }
  ];

  useKeyboardShortcuts(keyboardShortcuts, gameState.gameStarted);

  if (!gameState.gameStarted || !gameState.currentEra) {
    return <EraSelector onSelectEra={handleSelectEra} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'MARKET':
        return <MarketView
                    gameState={gameState}
                    onBuyCommodity={handleBuyCommodity}
                    onSellCommodity={handleSellCommodity}
                    onPlaceOrder={handlePlaceOrder}
                    onCancelOrder={handleCancelOrder}
                />;
      case 'REAL_ESTATE':
        return <RealEstateView gameState={gameState} onBuyProperty={handleBuyProperty} />;
      case 'SKILLS':
        return <SkillsView gameState={gameState} onUnlockSkill={handleUnlockSkill} />;
      case 'JOBS':
        return <JobsView
                    gameState={gameState}
                    onSelectJob={handleSelectJob}
                    onWorkShift={handleWorkShift}
                />;
      case 'TRADING':
        return <TradingView
                    gameState={gameState}
                    onBuyOption={handleBuyOption}
                    onExerciseOption={handleExerciseOption}
                    onSellOption={handleSellOption}
                    onOpenLeveragePosition={handleOpenLeveragePosition}
                    onCloseLeveragePosition={handleCloseLeveragePosition}
                />;
      case 'CASINO':
        return <CasinoView
                    gameState={gameState}
                    onBet={handleCasinoBet}
                />;
      case 'ACHIEVEMENTS':
        return <AchievementsView gameState={gameState} />;
      case 'STATISTICS':
        return <StatisticsView gameState={gameState} />;
      case 'DAILY_CHALLENGES':
        return <DailyChallengesView
          gameState={gameState}
          onGenerateChallenge={handleGenerateDailyChallenge}
          onCompleteChallenge={handleCompleteDailyChallenge}
        />;
      case 'PRESTIGE':
        return <PrestigeView
          gameState={gameState}
          onPrestige={handlePrestige}
          onUpgradeBonus={handleUpgradeBonus}
        />;
      case 'MILESTONES':
        return <MilestonesView gameState={gameState} />;
      case 'WIN_CONDITIONS':
        return <WinConditionsView gameState={gameState} />;
      default:
        return <MarketView
                    gameState={gameState}
                    onBuyCommodity={handleBuyCommodity}
                    onSellCommodity={handleSellCommodity}
                    onPlaceOrder={handlePlaceOrder}
                    onCancelOrder={handleCancelOrder}
                />;
    }
  };
  
  const NavButton: React.FC<{view: ActiveView, label: string, icon: React.ReactNode}> = ({view, label, icon}) => (
    <Button 
        variant={activeView === view ? 'primary' : 'secondary'}
        onClick={() => setActiveView(view)}
        className="flex-1 justify-start text-left"
        leftIcon={icon}
    >
        {label}
    </Button>
  );

  return (
    <div className="flex flex-col h-screen max-w-full">
      {showApiKeyWarning && (
        <div className="bg-yellow-500 text-black px-3 py-1.5 text-center text-xs">
          {API_KEY_WARNING}
          <Button size="sm" variant="ghost" onClick={() => setShowApiKeyWarning(false)} className="ml-2 !text-black !border-black !text-xs !py-0.5">Dismiss</Button>
        </div>
      )}
      <header className="px-4 py-2 bg-gray-800 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              American Dream Trader
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setGameState(prev => ({ ...prev, showWorldNews: true }))}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              📰 News
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="text-green-400 hover:text-green-300 underline"
            >
              📚 Tutorial
            </button>
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              ⌨️ Shortcuts
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 bg-gray-800 px-2 py-3 space-y-1.5 border-r border-gray-700 flex flex-col">
            <NavButton view="MARKET" label="Market" icon={<CommodityIcon/>}/>
            <NavButton view="REAL_ESTATE" label="Real Estate" icon={<PropertyIcon/>}/>
            <NavButton view="SKILLS" label="Skills" icon={<SkillIcon/>}/>
            <NavButton view="JOBS" label="Jobs" icon={<MoneyIcon/>}/>
            <NavButton view="TRADING" label="Trading" icon={<TrendUpIcon/>}/>
            <NavButton view="CASINO" label="Casino" icon={<CasinoIcon/>}/>
            <div className="mt-auto pt-2 border-t border-gray-700 space-y-1.5">
                 <NavButton view="DAILY_CHALLENGES" label="Challenges" icon={<DailyChallengesIcon/>}/>
                 <NavButton view="MILESTONES" label="Milestones" icon={<MilestonesIcon/>}/>
                 <NavButton view="WIN_CONDITIONS" label="Win Conditions" icon={<span>🏆</span>}/>
                 <NavButton view="PRESTIGE" label="Prestige" icon={<PrestigeIcon/>}/>
                 <NavButton view="ACHIEVEMENTS" label="Achievements" icon={<AchievementsIcon/>}/>
                 <NavButton view="STATISTICS" label="Statistics" icon={<StatisticsIcon/>}/>
            </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-850 border-b border-gray-700">
                 <Dashboard gameState={gameState} />
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-900">
                 {gameState.isLoadingEvent && activeView === 'MARKET' && (
                    <div className="p-3 text-center text-yellow-400 text-sm">
                        <LoadingSpinnerIcon className="inline-block mr-2"/> Processing turn...
                    </div>
                )}
                {renderActiveView()}
            </div>
            <LogView logs={gameState.gameLog} />
        </main>
      </div>

      <EventPopup
        event={gameState.currentEvent}
        onClose={() => setGameState(prev => ({ ...prev, currentEvent: null }))}
        onChoice={handleEventChoice}
        gameState={gameState}
      />

      {gameState.activeMiniGame && (
        <MiniGameModal
          job={gameState.jobs[gameState.activeMiniGame.jobId]}
          onClose={() => setGameState(prev => ({ ...prev, activeMiniGame: null }))}
          onComplete={handleMiniGameComplete}
        />
      )}

      {gameState.showWorldNews && (
        <WorldNewsModal
          newsEvents={gameState.worldNewsHistory.slice(-5)} // Show last 5 news events
          currentDate={gameState.currentDate}
          onClose={() => setGameState(prev => ({ ...prev, showWorldNews: false }))}
        />
      )}

      <AchievementNotification
        achievement={gameState.newAchievementUnlocked}
        onClose={() => setGameState(prev => ({ ...prev, newAchievementUnlocked: null }))}
      />

      {/* Milestone Notification */}
      <MilestoneNotification
        milestone={newMilestoneUnlocked}
        onClose={() => setNewMilestoneUnlocked(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Victory Modal */}
      {gameState.gameWon && gameState.winningCondition && (
        <VictoryModal
          winCondition={gameState.winningCondition}
          completedAtTurn={gameState.winConditionProgress.find(p => p.conditionId === gameState.winningCondition?.id)?.completedAtTurn || gameState.gameTurn}
          completedDate={gameState.winConditionProgress.find(p => p.conditionId === gameState.winningCondition?.id)?.completedDate || gameState.currentDate}
          onContinuePlaying={handleContinuePlaying}
          onPrestige={handleVictoryPrestige}
        />
      )}

      {/* Tutorial System */}
      <Tutorial
        steps={createTutorialSteps('beginner')}
        isActive={showTutorial}
        onComplete={() => setShowTutorial(false)}
        onSkip={() => setShowTutorial(false)}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
        shortcuts={keyboardShortcuts}
      />
    </div>
  );
};

export default App;