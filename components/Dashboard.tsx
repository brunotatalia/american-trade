
import React, { useMemo, useState } from 'react';
import { GameState } from '../types';
import { MoneyIcon, TrendUpIcon, TrendDownIcon, PropertyIcon, CommodityIcon, SkillIcon } from './icons';
import { formatDate } from '../services/historicalData';

interface DashboardProps {
  gameState: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const { player, commodities, properties, currentDate, currentEra, worldNewsHistory } = gameState;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Calculate portfolio value
  const portfolioValue = useMemo(() => {
    let total = player.money;

    // Add commodity values
    Object.keys(player.commodities).forEach(id => {
      const data = player.commodities[id];
      const marketPrice = commodities[id]?.price || 0;
      total += data.quantity * marketPrice;
    });

    // Add property values
    Object.keys(player.properties).forEach(id => {
      total += player.properties[id].currentValue;
    });

    // Add leveraged positions
    player.leveragedPositions?.forEach(pos => {
      total += pos.currentValue;
    });

    return total;
  }, [player, commodities]);

  // Calculate total profit/loss
  const totalProfitLoss = useMemo(() => {
    let pl = 0;
    Object.keys(player.commodities).forEach(id => {
      const data = player.commodities[id];
      const marketPrice = commodities[id]?.price || 0;
      const totalValue = data.quantity * marketPrice;
      pl += totalValue - (data.avgBuyPrice * data.quantity);
    });
    return pl;
  }, [player.commodities, commodities]);

  const isPositive = totalProfitLoss >= 0;

  if (isCollapsed) {
    return (
      <div className="bg-gradient-to-r from-gray-800 to-gray-850 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">💰</span>
            <span className="text-white font-bold">${player.money.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📊</span>
            <span className="text-green-400 font-bold">${portfolioValue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📅</span>
            <span className="text-gray-300">{formatDate(currentDate)}</span>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
        >
          ▼ Expand
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-850 px-3 py-2">
      {/* Compact Header with Toggle */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-300 font-medium">{currentEra?.name}</span>
          <span className="text-gray-500">•</span>
          <span className="text-white">{formatDate(currentDate)}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Turn {gameState.gameTurn}</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors"
        >
          ▲ Collapse
        </button>
      </div>

      {/* Compact Main Stats */}
      <div className="grid grid-cols-4 gap-2 mb-2">
        {/* Net Worth */}
        <div className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1.5 hover:border-green-600/50 transition-colors">
          <p className="text-[10px] text-green-400 font-medium mb-0.5">NET WORTH</p>
          <p className="text-lg font-bold text-white">${(portfolioValue / 1000).toFixed(1)}k</p>
        </div>

        {/* Cash */}
        <div className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1.5 hover:border-blue-600/50 transition-colors">
          <p className="text-[10px] text-blue-400 font-medium mb-0.5">CASH</p>
          <p className="text-lg font-bold text-white">${(player.money / 1000).toFixed(1)}k</p>
        </div>

        {/* P/L */}
        <div className={`bg-gray-900/50 border ${isPositive ? 'border-green-700/50' : 'border-red-700/50'} rounded px-2 py-1.5`}>
          <p className="text-[10px] text-gray-400 font-medium mb-0.5">P/L</p>
          <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}${(totalProfitLoss / 1000).toFixed(1)}k
          </p>
        </div>

        {/* Holdings */}
        <div className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1.5 hover:border-purple-600/50 transition-colors">
          <p className="text-[10px] text-purple-400 font-medium mb-0.5">HOLDINGS</p>
          <p className="text-lg font-bold text-white">
            {Object.keys(player.commodities).length + Object.keys(player.properties).length}
          </p>
        </div>
      </div>

      {/* Compact Secondary Info */}
      <div className="grid grid-cols-3 gap-2">
        {/* Skills */}
        <div className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">SKILLS</span>
            <span className="text-sm font-bold text-purple-400">{player.skills.length}</span>
          </div>
        </div>

        {/* Reputation */}
        <div className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">REPUTATION</span>
            <span className="text-sm font-bold text-yellow-400">{player.reputation}</span>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">ACHIEVEMENTS</span>
            <span className="text-sm font-bold text-green-400">{player.achievements.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
