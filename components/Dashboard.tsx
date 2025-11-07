
import React, { useMemo } from 'react';
import { GameState } from '../types';
import { MoneyIcon, TrendUpIcon, TrendDownIcon, PropertyIcon, CommodityIcon, SkillIcon } from './icons';
import { formatDate } from '../services/historicalData';

interface DashboardProps {
  gameState: GameState;
}

export const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const { player, commodities, properties, currentDate, currentEra, worldNewsHistory } = gameState;

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

  // Calculate era progress (percentage through current era)
  const eraProgress = useMemo(() => {
    if (!currentEra) return 0;
    const startYear = currentEra.startDate.year;
    const endYear = currentEra.endDate.year;
    const currentYear = currentDate.year;
    const totalYears = endYear - startYear;
    const elapsedYears = currentYear - startYear;
    return Math.min(100, Math.max(0, (elapsedYears / totalYears) * 100));
  }, [currentDate, currentEra]);

  // Get recent news
  const recentNews = worldNewsHistory.slice(-3);

  const isPositive = totalProfitLoss >= 0;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-850 p-4">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Portfolio Value */}
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/30 rounded-lg p-4 hover:border-green-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-300 font-medium mb-1">NET WORTH</p>
              <p className="text-2xl font-bold text-white">${portfolioValue.toLocaleString()}</p>
            </div>
            <MoneyIcon className="w-10 h-10 text-green-400 opacity-50" />
          </div>
        </div>

        {/* Cash */}
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-700/30 rounded-lg p-4 hover:border-blue-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-300 font-medium mb-1">CASH</p>
              <p className="text-2xl font-bold text-white">${player.money.toLocaleString()}</p>
            </div>
            <MoneyIcon className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </div>

        {/* Profit/Loss */}
        <div className={`bg-gradient-to-br ${isPositive ? 'from-green-900/40 to-emerald-900/40 border-green-700/30' : 'from-red-900/40 to-rose-900/40 border-red-700/30'} border rounded-lg p-4 hover:border-opacity-70 transition-all`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 font-medium mb-1">PROFIT/LOSS</p>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}${totalProfitLoss.toLocaleString()}
              </p>
            </div>
            {isPositive ? (
              <TrendUpIcon className="w-10 h-10 text-green-400 opacity-50" />
            ) : (
              <TrendDownIcon className="w-10 h-10 text-red-400 opacity-50" />
            )}
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/30 rounded-lg p-4 hover:border-purple-600/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-300 font-medium mb-1">HOLDINGS</p>
              <p className="text-2xl font-bold text-white">
                {Object.keys(player.commodities).length + Object.keys(player.properties).length}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {Object.keys(player.commodities).length} stocks • {Object.keys(player.properties).length} properties
              </p>
            </div>
            <CommodityIcon className="w-10 h-10 text-purple-400 opacity-50" />
          </div>
        </div>
      </div>

      {/* Timeline and Quick Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Timeline</h3>
              <p className="text-xs text-gray-400">{currentEra?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">{formatDate(currentDate)}</p>
              <p className="text-xs text-gray-400">{Math.round(eraProgress)}% through era</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
              style={{ width: `${eraProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Era Milestones */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{currentEra?.startDate.year}</span>
            <span className="text-white font-medium">{currentDate.year}</span>
            <span>{currentEra?.endDate.year}</span>
          </div>
        </div>

        {/* Skills Summary */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-200">Skills</h3>
            <SkillIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-400">{player.skills.length}</p>
            <p className="text-xs text-gray-400 mt-1">Unlocked Skills</p>
          </div>
          {player.skills.length > 0 && (
            <div className="mt-3 space-y-1">
              {player.skills.slice(0, 3).map((skillId, idx) => (
                <div key={skillId} className="text-xs text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                  • {gameState.skills[skillId]?.name}
                </div>
              ))}
              {player.skills.length > 3 && (
                <p className="text-xs text-gray-500 text-center mt-1">+{player.skills.length - 3} more</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent News Ticker */}
      {recentNews.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-lg p-3 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase">Recent News</span>
            <span className="flex-1 h-px bg-blue-700/30"></span>
          </div>
          <div className="space-y-2">
            {recentNews.map((news, idx) => (
              <div key={news.id} className="text-xs text-gray-300 flex items-start gap-2 animate-fadeInScale" style={{ animationDelay: `${idx * 100}ms` }}>
                <span className="text-yellow-400 flex-shrink-0">📰</span>
                <span className="flex-1">{news.title}</span>
                <span className="text-gray-500 flex-shrink-0">{formatDate(news.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
