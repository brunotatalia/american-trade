import React, { useState } from 'react';
import { GameState, Commodity } from '../types';
import { Button } from './ui/Button';
import { TrendUpIcon, TrendDownIcon } from './icons';
import * as GameLogic from '../services/gameLogic';

interface QuickTradePanelProps {
  gameState: GameState;
  onTrade: (updatedState: Partial<GameState>) => void;
}

export const QuickTradePanel: React.FC<QuickTradePanelProps> = ({ gameState, onTrade }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null);

  // Get top traded commodities (available in current era)
  const topCommodities = gameState.currentEra?.availableCommodities
    .slice(0, 6)
    .map(id => ({ id, ...gameState.commodities[id] })) || [];

  const getQuantity = (id: string) => quantities[id] || 1;

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, value) }));
  };

  const quickBuy = (commodityId: string) => {
    const commodity = gameState.commodities[commodityId];
    const quantity = getQuantity(commodityId);
    const { success, player: updatedPlayer, log } = GameLogic.attemptBuyCommodity(
      gameState.player,
      commodity,
      quantity,
      gameState.player.skills
    );

    if (success) {
      onTrade({
        player: updatedPlayer,
        gameLog: [...gameState.gameLog, log]
      });
      setFeedback({ id: commodityId, message: `Bought ${quantity}x ${commodity.name}`, type: 'success' });
      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({ id: commodityId, message: log.message, type: 'error' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const quickSell = (commodityId: string) => {
    const commodity = gameState.commodities[commodityId];
    const quantity = getQuantity(commodityId);
    const { success, player: updatedPlayer, log } = GameLogic.attemptSellCommodity(
      gameState.player,
      commodity,
      quantity,
      gameState.player.skills,
      gameState.gameTurn
    );

    if (success) {
      onTrade({
        player: updatedPlayer,
        gameLog: [...gameState.gameLog, log]
      });
      setFeedback({ id: commodityId, message: `Sold ${quantity}x ${commodity.name}`, type: 'success' });
      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({ id: commodityId, message: log.message, type: 'error' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  // Get price history for price change indicator
  const getPriceChange = (id: string) => {
    const history = gameState.priceHistory[id];
    if (!history || history.length < 2) return 0;
    const current = history[history.length - 1].close;
    const previous = history[history.length - 2].close;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Quick Trade</h3>
        <span className="text-xs text-gray-400">Fast market access</span>
      </div>

      <div className="space-y-3">
        {topCommodities.map((commodity) => {
          const priceChange = getPriceChange(commodity.id);
          const owned = gameState.player.commodities[commodity.id]?.quantity || 0;
          const isPositiveChange = priceChange >= 0;

          return (
            <div
              key={commodity.id}
              className="bg-gray-750 border border-gray-600 rounded-lg p-3 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{commodity.name}</span>
                    {owned > 0 && (
                      <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                        {owned} owned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-green-400">
                      ${commodity.price.toFixed(2)}
                    </span>
                    <span className={`text-xs flex items-center ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositiveChange ? <TrendUpIcon className="w-3 h-3" /> : <TrendDownIcon className="w-3 h-3" />}
                      {isPositiveChange ? '+' : ''}{priceChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={getQuantity(commodity.id)}
                  onChange={(e) => handleQuantityChange(commodity.id, parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => quickBuy(commodity.id)}
                  className="flex-1"
                >
                  Buy
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => quickSell(commodity.id)}
                  className="flex-1"
                  disabled={owned === 0}
                >
                  Sell
                </Button>
              </div>

              {feedback && feedback.id === commodity.id && (
                <div className={`mt-2 text-xs p-2 rounded ${feedback.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'} animate-fadeInScale`}>
                  {feedback.message}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
