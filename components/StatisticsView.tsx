import React from 'react';
import { GameState } from '../types';
import { Card } from './ui/Card';

interface StatisticsViewProps {
  gameState: GameState;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ gameState }) => {
  const stats = gameState.player.statistics;
  const netWorth = calculateNetWorth(gameState);
  const winRate = stats.totalTrades > 0
    ? ((stats.profitableTrades / stats.totalTrades) * 100).toFixed(1)
    : '0.0';

  const totalJobEarnings = Object.values(gameState.player.jobPerformance).reduce(
    (sum, perf) => sum + perf.totalEarnings, 0
  );

  const gamblingNetProfit = (stats.totalGamblingWins || 0) - (stats.totalGamblingLosses || 0);

  function calculateNetWorth(gs: GameState): number {
    let total = gs.player.money;

    // Add property values
    Object.keys(gs.player.properties).forEach(propId => {
      const property = gs.properties[propId];
      if (property) {
        total += property.cost;
      }
    });

    // Add commodity values
    Object.keys(gs.player.commodities).forEach(commId => {
      const commodity = gs.commodities[commId];
      const playerComm = gs.player.commodities[commId];
      if (commodity && playerComm) {
        total += commodity.price * playerComm.quantity;
      }
    });

    return total;
  }

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: string;
  }> = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-900/30 to-blue-800/30 border-blue-600/50',
      green: 'from-green-900/30 to-green-800/30 border-green-600/50',
      red: 'from-red-900/30 to-red-800/30 border-red-600/50',
      yellow: 'from-yellow-900/30 to-yellow-800/30 border-yellow-600/50',
      purple: 'from-purple-900/30 to-purple-800/30 border-purple-600/50',
      gray: 'from-gray-900/30 to-gray-800/30 border-gray-600/50'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border-2 rounded-lg p-4`}>
        <div className="flex items-center gap-3">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">{title}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          📊 Statistics
        </h2>
        <p className="text-sm text-gray-400">
          Track your progress and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <Card title="💰 Wealth Overview" className="bg-gradient-to-r from-green-900/20 to-blue-900/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Current Cash"
            value={`$${gameState.player.money.toLocaleString()}`}
            icon="💵"
            color="green"
          />
          <StatCard
            title="Net Worth"
            value={`$${netWorth.toLocaleString()}`}
            subtitle="Cash + Assets"
            icon="💎"
            color="blue"
          />
          <StatCard
            title="Peak Net Worth"
            value={`$${stats.peakNetWorth.toLocaleString()}`}
            icon="📈"
            color="yellow"
          />
        </div>
      </Card>

      {/* Trading Stats */}
      <Card title="📈 Trading Performance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Trades"
            value={stats.totalTrades}
            icon="🔄"
            color="blue"
          />
          <StatCard
            title="Win Rate"
            value={`${winRate}%`}
            subtitle={`${stats.profitableTrades}/${stats.totalTrades} profitable`}
            icon="🎯"
            color={parseFloat(winRate) >= 50 ? 'green' : 'red'}
          />
          <StatCard
            title="Total Profit"
            value={`$${stats.totalProfit.toLocaleString()}`}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Total Loss"
            value={`$${Math.abs(stats.totalLoss).toLocaleString()}`}
            icon="❌"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <StatCard
            title="Biggest Win"
            value={`$${stats.biggestWin.toLocaleString()}`}
            icon="🚀"
            color="green"
          />
          <StatCard
            title="Biggest Loss"
            value={`$${Math.abs(stats.biggestLoss).toLocaleString()}`}
            icon="💥"
            color="red"
          />
        </div>
      </Card>

      {/* Career Stats */}
      <Card title="👔 Career Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Jobs Completed"
            value={stats.jobsCompleted}
            icon="✓"
            color="green"
          />
          <StatCard
            title="Total Job Earnings"
            value={`$${totalJobEarnings.toLocaleString()}`}
            icon="💼"
            color="blue"
          />
          <StatCard
            title="Different Jobs Worked"
            value={Object.keys(gameState.player.jobPerformance).length}
            icon="🔄"
            color="purple"
          />
        </div>
      </Card>

      {/* Assets */}
      <Card title="🏠 Assets & Skills">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Properties Owned"
            value={Object.keys(gameState.player.properties).length}
            subtitle={`${stats.propertiesPurchased} total purchased`}
            icon="🏘️"
            color="yellow"
          />
          <StatCard
            title="Skills Unlocked"
            value={gameState.player.skills.length}
            icon="📚"
            color="purple"
          />
          <StatCard
            title="Reputation"
            value={gameState.player.reputation}
            icon="⭐"
            color="blue"
          />
        </div>
      </Card>

      {/* Gambling Stats */}
      {(stats.totalGamblingWins > 0 || stats.totalGamblingLosses > 0) && (
        <Card title="🎰 Gambling Record">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Winnings"
              value={`$${stats.totalGamblingWins.toLocaleString()}`}
              icon="💰"
              color="green"
            />
            <StatCard
              title="Total Losses"
              value={`$${stats.totalGamblingLosses.toLocaleString()}`}
              icon="💸"
              color="red"
            />
            <StatCard
              title="Net Profit/Loss"
              value={`${gamblingNetProfit >= 0 ? '+' : ''}$${gamblingNetProfit.toLocaleString()}`}
              icon={gamblingNetProfit >= 0 ? '📈' : '📉'}
              color={gamblingNetProfit >= 0 ? 'green' : 'red'}
            />
          </div>
        </Card>
      )}

      {/* Game Progress */}
      <Card title="⏱️ Game Progress">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Turns Played"
            value={gameState.gameTurn}
            icon="🎮"
            color="gray"
          />
          <StatCard
            title="Current Era"
            value={gameState.currentEra?.name || 'N/A'}
            subtitle={`${gameState.currentDate.month}/${gameState.currentDate.year}`}
            icon="📅"
            color="blue"
          />
          <StatCard
            title="Achievements"
            value={`${gameState.player.achievements.length}/${gameState.achievements.filter(a => !a.secret).length}`}
            subtitle={`${((gameState.player.achievements.length / gameState.achievements.filter(a => !a.secret).length) * 100).toFixed(1)}% complete`}
            icon="🏆"
            color="yellow"
          />
        </div>
      </Card>

      {/* Best Investments */}
      <Card title="🌟 Top Performing Jobs">
        <div className="space-y-2">
          {Object.entries(gameState.player.jobPerformance)
            .sort((a, b) => b[1].totalEarnings - a[1].totalEarnings)
            .slice(0, 5)
            .map(([jobId, perf]) => {
              const job = gameState.jobs[jobId];
              if (!job) return null;

              const winRate = perf.gamesPlayed > 0
                ? ((perf.gamesWon / perf.gamesPlayed) * 100).toFixed(1)
                : '0.0';

              return (
                <div
                  key={jobId}
                  className="bg-gray-800 rounded-lg p-3 flex justify-between items-center hover:bg-gray-750 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">{job.title}</div>
                    <div className="text-sm text-gray-400">
                      {perf.gamesPlayed} shifts · {winRate}% success rate
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      ${perf.totalEarnings.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">earned</div>
                  </div>
                </div>
              );
            })}
          {Object.keys(gameState.player.jobPerformance).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No job data yet. Start working to see your top performers!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
