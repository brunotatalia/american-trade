

import React, { useState, useEffect, useCallback } from 'react';
import {
  Player, Commodity, Property, Skill, GameEvent, Era, LogEntry, GameState, ActiveView, Order, Job
} from './types';
import {
  INITIAL_PLAYER_REPUTATION, GAME_TICK_INTERVAL_MS, MAX_LOG_ENTRIES,
  COMMODITIES_DATA, PROPERTIES_DATA, SKILLS_DATA, JOBS_DATA, API_KEY_WARNING
} from './constants';
import { isGeminiAvailable } from './services/geminiService';
import * as GameLogic from './services/gameLogic';
import { EraSelector } from './components/EraSelector';
import { Dashboard } from './components/Dashboard';
import { MarketView } from './components/MarketView';
import { RealEstateView } from './components/RealEstateView';
import { SkillsView } from './components/SkillsView';
import { JobsView } from './components/JobsView';
import { TradingView } from './components/TradingView';
import { MiniGameModal } from './components/MiniGameModal';
import { EventPopup } from './components/EventPopup';
import { LogView } from './components/LogView';
import { Button } from './components/ui/Button';
import { CommodityIcon, PropertyIcon, SkillIcon, MoneyIcon, TrendUpIcon, NewsIcon, LoadingSpinnerIcon } from './components/icons';

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
  });

  const [activeView, setActiveView] = useState<ActiveView>('MARKET');
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(!isGeminiAvailable());

  const addLogEntry = useCallback((message: string, type: LogEntry['type']) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog.slice(-MAX_LOG_ENTRIES + 1), GameLogic.createLog(message, type)],
    }));
  }, []);

  const handleSelectEra = useCallback((era: Era) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        money: era.startingMoney,
      },
      currentEra: era,
      gameTurn: 1,
      gameStarted: true,
      gameLog: [GameLogic.createLog(`Welcome to the ${era.name} era! Your journey begins.`, 'event')],
    }));
    setActiveView('MARKET');
  }, []);

  // Game Tick Effect
  useEffect(() => {
    if (!gameState.gameStarted || !gameState.currentEra) return;

    const tick = async () => {
      setGameState(prev => {
        // Use prev state instead of stale gameState closure
        const previousCommodities = { ...prev.commodities };
        const updatedCommodities = GameLogic.updateMarketPrices(prev.commodities, prev.currentEra!, prev.player.skills);
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

        // Update price history for charts
        const updatedPriceHistory = GameLogic.updatePriceHistory(
          prev.priceHistory,
          updatedCommodities,
          previousCommodities,
          prev.gameTurn + 1
        );

        return {
          ...prev,
          player: {
            ...newPlayerState,
            money: parseFloat(newPlayerState.money.toFixed(2)),
          },
          commodities: updatedCommodities,
          priceHistory: updatedPriceHistory,
          gameLog: [...prev.gameLog, ...newLogs].slice(-MAX_LOG_ENTRIES),
          gameTurn: prev.gameTurn + 1,
          isLoadingEvent: false,
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
    <div className="flex flex-col h-screen max-w-7xl mx-auto">
      {showApiKeyWarning && (
        <div className="bg-yellow-500 text-black p-2 text-center text-sm">
          {API_KEY_WARNING} Some features like dynamic events and news might be limited or use placeholders.
          <Button size="sm" variant="ghost" onClick={() => setShowApiKeyWarning(false)} className="ml-4 !text-black !border-black">Dismiss</Button>
        </div>
      )}
      <header className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          American Dream Trader
        </h1>
        <p className="text-sm text-gray-400">Era: {gameState.currentEra.name} | Turn: {gameState.gameTurn}</p>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-800 p-4 space-y-4 border-r border-gray-700 flex flex-col">
            <NavButton view="MARKET" label="Market" icon={<CommodityIcon/>}/>
            <NavButton view="REAL_ESTATE" label="Real Estate" icon={<PropertyIcon/>}/>
            <NavButton view="SKILLS" label="Skills" icon={<SkillIcon/>}/>
            <NavButton view="JOBS" label="Jobs" icon={<MoneyIcon/>}/>
            <NavButton view="TRADING" label="Trading Platform" icon={<TrendUpIcon/>}/>
            <div className="mt-auto">
                 {/* Can add quick stats here or a mini-log preview */}
            </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-gray-850 p-1 border-b border-gray-700"> {/* Slightly different shade for dashboard */}
                 <Dashboard gameState={gameState} />
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-900">
                 {gameState.isLoadingEvent && activeView === 'MARKET' && ( // Show loading only if relevant view active
                    <div className="p-4 text-center text-yellow-400">
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
    </div>
  );
};

export default App;