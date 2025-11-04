

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Player, Commodity, Property, Skill, GameEvent, Era, LogEntry, GameState, ActiveView, Order
} from './types';
import { 
  INITIAL_PLAYER_REPUTATION, GAME_TICK_INTERVAL_MS, MAX_LOG_ENTRIES,
  COMMODITIES_DATA, PROPERTIES_DATA, SKILLS_DATA, API_KEY_WARNING
} from './constants';
import { isGeminiAvailable } from './services/geminiService';
import * as GameLogic from './services/gameLogic';
import { EraSelector } from './components/EraSelector';
import { Dashboard } from './components/Dashboard';
import { MarketView } from './components/MarketView';
import { RealEstateView } from './components/RealEstateView';
import { SkillsView } from './components/SkillsView';
import { EventPopup } from './components/EventPopup';
import { LogView } from './components/LogView';
import { Button } from './components/ui/Button';
import { CommodityIcon, PropertyIcon, SkillIcon, NewsIcon, LoadingSpinnerIcon } from './components/icons';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      money: 0,
      reputation: INITIAL_PLAYER_REPUTATION,
      commodities: {},
      properties: {}, // Changed from array to Record
      skills: [],
      orders: [],
    },
    currentEra: null,
    commodities: COMMODITIES_DATA,
    properties: PROPERTIES_DATA,
    skills: SKILLS_DATA,
    gameLog: [],
    currentEvent: null,
    gameTurn: 0,
    gameStarted: false,
    isLoadingEvent: false,
    marketNews: [],
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
      setGameState(prev => ({ ...prev, isLoadingEvent: true })); // Signal loading for news/event

      const updatedCommodities = GameLogic.updateMarketPrices(gameState.commodities, gameState.currentEra!, gameState.player.skills);
      const income = GameLogic.calculatePlayerIncome(gameState.player, gameState.properties, gameState.skills, updatedCommodities);

      let newPlayerState = { ...gameState.player, money: gameState.player.money + income };
      let newLogs: LogEntry[] = [];

      if (income > 0) {
        newLogs.push(GameLogic.createLog(`Earned $${income.toFixed(2)} from investments.`, 'success'));
      } else if (income < 0) {
        newLogs.push(GameLogic.createLog(`Lost $${Math.abs(income).toFixed(2)} from property maintenance.`, 'warning'));
      }

      // Update property values (appreciation)
      newPlayerState = GameLogic.updatePropertyValues(newPlayerState, gameState.properties, gameState.player.skills);

      // Process pending orders
      const { player: playerAfterOrders, logs: orderLogs } = GameLogic.processPendingOrders(
        newPlayerState,
        updatedCommodities,
        gameState.player.skills,
        gameState.gameTurn
      );
      newPlayerState = playerAfterOrders;
      if (orderLogs.length > 0) {
          newLogs.push(...orderLogs);
      }


      // Fetch market news (50% chance each turn)
      let latestNewsItem: string | null = null;
      if (Math.random() < 0.5) {
        latestNewsItem = await GameLogic.fetchMarketNewsForRandomCommodity(gameState);
        if(latestNewsItem) newLogs.push(GameLogic.createLog(`News: ${latestNewsItem}`, 'info'));
      }

      // Attempt to trigger a random event
      let newEvent: GameEvent | null = null;
      if (!gameState.currentEvent) { // Only trigger new event if no active event
          const tempGameState = {...gameState, player: newPlayerState, commodities: updatedCommodities};
          newEvent = await GameLogic.createRandomGameEvent(tempGameState);
          if (newEvent) {
            newLogs.push(GameLogic.createLog(`Event: ${newEvent.title} - ${newEvent.description}`, 'event'));
          }
      }
      
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          ...newPlayerState,
          money: parseFloat(newPlayerState.money.toFixed(2)),
        },
        commodities: updatedCommodities,
        currentEvent: newEvent || prev.currentEvent, // Keep existing event if new one is null
        gameLog: [...prev.gameLog, ...newLogs].slice(-MAX_LOG_ENTRIES),
        gameTurn: prev.gameTurn + 1,
        isLoadingEvent: false,
        marketNews: latestNewsItem ? [latestNewsItem, ...prev.marketNews].slice(0, 10) : prev.marketNews,
      }));
    };

    const intervalId = setInterval(tick, GAME_TICK_INTERVAL_MS);
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameStarted, gameState.gameTurn]); // Dependencies carefully chosen for game tick logic


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
            <div className="mt-auto"> {/* Pushes dashboard to bottom of nav if desired, or integrate into main view */}
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
    </div>
  );
};

export default App;