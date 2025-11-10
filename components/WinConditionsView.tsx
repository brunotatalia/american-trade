import React from 'react';
import { GameState } from '../types';
import { getAllWinConditionProgress } from '../data/winConditions';
import { Button } from './ui/Button';

interface WinConditionsViewProps {
  gameState: GameState;
}

export const WinConditionsView: React.FC<WinConditionsViewProps> = ({ gameState }) => {
  const winConditionData = getAllWinConditionProgress(gameState);

  // Group by difficulty
  const grouped = winConditionData.reduce((acc, data) => {
    const difficulty = data.condition.difficulty;
    if (!acc[difficulty]) acc[difficulty] = [];
    acc[difficulty].push(data);
    return acc;
  }, {} as Record<string, typeof winConditionData>);

  const difficultyOrder: Array<'easy' | 'medium' | 'hard' | 'legendary'> = ['easy', 'medium', 'hard', 'legendary'];
  const difficultyColors = {
    easy: 'text-green-400 border-green-600',
    medium: 'text-yellow-400 border-yellow-600',
    hard: 'text-orange-400 border-orange-600',
    legendary: 'text-purple-400 border-purple-600'
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🏆 Win Conditions</h1>
        <p className="text-gray-300 text-sm">
          Achieve any of these conditions to win the game! Each victory grants Prestige Points for New Game+.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-400 text-xs mb-1">Total Conditions</p>
          <p className="text-2xl font-bold text-white">{winConditionData.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-green-700">
          <p className="text-gray-400 text-xs mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-400">
            {winConditionData.filter(d => d.completed).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-yellow-700">
          <p className="text-gray-400 text-xs mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-400">
            {winConditionData.filter(d => !d.completed && d.percentage > 25).length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-purple-700">
          <p className="text-gray-400 text-xs mb-1">Prestige Points Available</p>
          <p className="text-2xl font-bold text-purple-400">
            {winConditionData.reduce((sum, d) => sum + (d.condition.reward?.prestigePoints || 0), 0)}
          </p>
        </div>
      </div>

      {/* Win Conditions by Difficulty */}
      {difficultyOrder.map(difficulty => {
        const conditions = grouped[difficulty] || [];
        if (conditions.length === 0) return null;

        return (
          <div key={difficulty} className="mb-6">
            <h2 className={`text-xl font-bold mb-3 ${difficultyColors[difficulty].split(' ')[0]} uppercase`}>
              {difficulty} ({conditions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conditions.map(({ condition, progress, completed, percentage }) => (
                <div
                  key={condition.id}
                  className={`bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                    completed
                      ? 'border-green-500 bg-green-900 bg-opacity-20'
                      : difficultyColors[difficulty].split(' ')[1]
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{condition.icon}</span>
                        <h3 className="text-lg font-bold text-white">{condition.name}</h3>
                        {completed && <span className="text-green-400 text-xl">✓</span>}
                      </div>
                      <p className="text-sm text-gray-300">{condition.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs font-mono text-gray-300">
                        {progress.unit === '$' ? '$' : ''}
                        {progress.current.toLocaleString()}
                        {progress.unit !== '$' ? ` ${progress.unit}` : ''} / {progress.unit === '$' ? '$' : ''}
                        {progress.target.toLocaleString()}
                        {progress.unit !== '$' ? ` ${progress.unit}` : ''}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          completed ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-xs font-mono text-gray-400">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Rewards */}
                  {condition.reward && (
                    <div className="pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Rewards:</p>
                      <div className="flex flex-wrap gap-2">
                        {condition.reward.prestigePoints && (
                          <span className="px-2 py-1 bg-purple-900 bg-opacity-30 border border-purple-600 rounded text-xs text-purple-300">
                            +{condition.reward.prestigePoints} Prestige
                          </span>
                        )}
                        {condition.reward.title && (
                          <span className="px-2 py-1 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded text-xs text-yellow-300">
                            Title: "{condition.reward.title}"
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg">
        <p className="text-sm text-blue-200">
          <strong>💡 Tip:</strong> You can achieve multiple win conditions in a single playthrough! Each victory grants Prestige Points that carry over to New Game+.
        </p>
      </div>
    </div>
  );
};
