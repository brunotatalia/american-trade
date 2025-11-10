import React, { useMemo, useState } from 'react';
import { GameState, WinCondition } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface WinConditionsViewProps {
  gameState: GameState;
}

type FilterCategory = 'all' | 'wealth' | 'property' | 'trading' | 'speed' | 'diversification' | 'special';

export const WinConditionsView: React.FC<WinConditionsViewProps> = ({ gameState }) => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');

  // Check which win conditions are completed
  const winConditionStates = useMemo(() => {
    return Object.values(gameState.winConditions).map(condition => ({
      condition,
      isCompleted: condition.checkCompleted(gameState),
      progress: calculateProgress(condition, gameState)
    }));
  }, [gameState]);

  // Apply filters
  const filteredConditions = useMemo(() => {
    return winConditionStates
      .filter(wc => filterCategory === 'all' || wc.condition.category === filterCategory)
      .sort((a, b) => b.condition.prestigePoints - a.condition.prestigePoints);
  }, [winConditionStates, filterCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = winConditionStates.length;
    const completed = winConditionStates.filter(wc => wc.isCompleted).length;
    const totalPrestige = winConditionStates
      .filter(wc => wc.isCompleted)
      .reduce((sum, wc) => sum + wc.condition.prestigePoints, 0);

    return { total, completed, totalPrestige };
  }, [winConditionStates]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      wealth: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20',
      property: 'text-green-400 border-green-500/30 bg-green-900/20',
      trading: 'text-blue-400 border-blue-500/30 bg-blue-900/20',
      speed: 'text-red-400 border-red-500/30 bg-red-900/20',
      diversification: 'text-purple-400 border-purple-500/30 bg-purple-900/20',
      special: 'text-pink-400 border-pink-500/30 bg-pink-900/20'
    };
    return colors[category] || 'text-gray-400 border-gray-500/30 bg-gray-900/20';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-500">
          🏆 Victory Conditions
        </h2>
        <p className="text-gray-400">
          Complete any of these conditions to achieve victory! Each grants prestige points for the next run.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-900/20 border-blue-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.completed}/{stats.total}</div>
              <div className="text-sm text-gray-400">Conditions Met</div>
            </div>
          </Card>
          <Card className="bg-purple-900/20 border-purple-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.totalPrestige}</div>
              <div className="text-sm text-gray-400">Total Prestige</div>
            </div>
          </Card>
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {stats.completed > 0 ? '🎉' : '🎯'}
              </div>
              <div className="text-sm text-gray-400">
                {stats.completed > 0 ? 'Victory!' : 'Keep Going!'}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-gray-400">Category:</span>
        {['all', 'wealth', 'property', 'trading', 'speed', 'diversification', 'special'].map(cat => (
          <Button
            key={cat}
            size="sm"
            variant={filterCategory === cat ? 'primary' : 'secondary'}
            onClick={() => setFilterCategory(cat as FilterCategory)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Win Conditions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredConditions.map(({ condition, isCompleted, progress }) => (
          <Card
            key={condition.id}
            className={`
              transition-all duration-300
              ${getCategoryColor(condition.category)}
              ${isCompleted ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20' : ''}
            `}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {condition.icon} {condition.name}
                    {isCompleted && <span className="text-green-400">✅</span>}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{condition.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">
                    {condition.prestigePoints}
                  </div>
                  <div className="text-xs text-gray-500">Prestige</div>
                </div>
              </div>

              {/* Progress bar (if applicable) */}
              {!isCompleted && progress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Category badge */}
              <div className="text-xs uppercase tracking-wider opacity-75">
                {condition.category}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to calculate progress percentage
function calculateProgress(condition: WinCondition, state: GameState): number | null {
  // This is a simplified version. Each condition would need its own progress calculation
  // For now, just return null for most and 0-100 for wealth-based ones
  
  if (condition.id.includes('MILLIONAIRE') || condition.id.includes('TYCOON') || condition.id.includes('BILLIONAIRE')) {
    const netWorth = calculateNetWorth(state);
    if (condition.id === 'MILLIONAIRE_WIN') return (netWorth / 1000000) * 100;
    if (condition.id === 'MULTI_MILLIONAIRE') return (netWorth / 10000000) * 100;
    if (condition.id === 'TYCOON') return (netWorth / 50000000) * 100;
    if (condition.id === 'BILLIONAIRE') return (netWorth / 1000000000) * 100;
  }

  return null;
}

function calculateNetWorth(state: GameState): number {
  let total = state.player.money;
  
  Object.entries(state.player.commodities).forEach(([id, holding]) => {
    const commodity = state.commodities[id];
    if (commodity && !commodity.isBankrupt) {
      total += holding.quantity * commodity.price;
    }
  });
  
  state.player.properties.forEach(propId => {
    const property = state.properties[propId];
    if (property) {
      total += property.cost;
    }
  });
  
  return total;
}
