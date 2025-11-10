import React, { useState } from 'react';
import { GameState, Milestone } from '../types';
import {
  REPUTATION_TIERS,
  MILESTONES,
  getReputationTier,
  getNextReputationTier,
  getReputationProgress,
  getMilestonesByCategory,
  getNextMilestones
} from '../data/progression';
import { ProgressBar } from './ui/ProgressBar';
import { Tooltip } from './ui/Tooltip';
import { Button } from './ui/Button';

interface MilestonesViewProps {
  gameState: GameState;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({ gameState }) => {
  const [selectedCategory, setSelectedCategory] = useState<Milestone['category'] | 'all'>('all');

  const currentTier = getReputationTier(gameState.player.reputation);
  const nextTier = getNextReputationTier(gameState.player.reputation);
  const tierProgress = getReputationProgress(gameState.player.reputation);
  const unlockedMilestones = gameState.player.progressionData?.unlockedMilestones || [];

  const allMilestones = selectedCategory === 'all'
    ? MILESTONES
    : getMilestonesByCategory(selectedCategory);

  const completed = allMilestones.filter(m => unlockedMilestones.includes(m.id));
  const available = allMilestones.filter(m => !unlockedMilestones.includes(m.id) && m.requirement(gameState));
  const locked = allMilestones.filter(m => !unlockedMilestones.includes(m.id) && !m.requirement(gameState));

  const nextMilestones = getNextMilestones(gameState, 5);

  const categories: Array<{ id: Milestone['category'] | 'all', label: string, icon: string }> = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'wealth', label: 'Wealth', icon: '💰' },
    { id: 'property', label: 'Property', icon: '🏠' },
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'career', label: 'Career', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '📚' },
    { id: 'reputation', label: 'Reputation', icon: '⭐' },
    { id: 'special', label: 'Special', icon: '🎖️' }
  ];

  const renderMilestone = (milestone: Milestone, status: 'completed' | 'available' | 'locked') => {
    const isCompleted = status === 'completed';
    const isAvailable = status === 'available';

    return (
      <div
        key={milestone.id}
        className={`
          border rounded-lg p-4 transition-all
          ${isCompleted ? 'bg-green-900/30 border-green-600' : ''}
          ${isAvailable ? 'bg-yellow-900/30 border-yellow-600 animate-pulse' : ''}
          ${status === 'locked' ? 'bg-gray-800 border-gray-700 opacity-60' : ''}
        `}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{milestone.icon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-white">{milestone.name}</h4>
              {isCompleted && <span className="text-green-400 text-sm">✓ Completed</span>}
              {isAvailable && <span className="text-yellow-400 text-sm animate-bounce">⚡ Claimable!</span>}
              {status === 'locked' && <span className="text-gray-500 text-sm">🔒 Locked</span>}
            </div>
            <p className="text-sm text-gray-400 mb-2">{milestone.description}</p>

            {milestone.reward && (
              <div className="flex flex-wrap gap-2 text-xs">
                {milestone.reward.money && (
                  <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded">
                    +${milestone.reward.money.toLocaleString()}
                  </span>
                )}
                {milestone.reward.reputation && (
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded">
                    +{milestone.reward.reputation} Rep
                  </span>
                )}
                {milestone.reward.unlocks && milestone.reward.unlocks.length > 0 && (
                  <Tooltip content={milestone.reward.unlocks.join(', ')}>
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded cursor-help">
                      🔓 Unlocks ({milestone.reward.unlocks.length})
                    </span>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
          Progression & Milestones
        </h1>
        <p className="text-gray-400">Track your journey to becoming a business legend</p>
      </div>

      {/* Reputation Tier Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-850 border border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{currentTier.icon}</span>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${currentTier.color}`}>{currentTier.name}</h2>
            <p className="text-sm text-gray-400">{currentTier.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{gameState.player.reputation}</p>
            <p className="text-xs text-gray-400">Reputation</p>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to {nextTier.name}</span>
              <span className="text-white font-semibold">
                {gameState.player.reputation} / {nextTier.minReputation}
              </span>
            </div>
            <ProgressBar
              progress={tierProgress}
              color="gradient"
              animated
              glow
              showPercentage
            />
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Next tier unlocks:</p>
              <div className="flex flex-wrap gap-2">
                {nextTier.unlocks.map((unlock, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded">
                    {unlock}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {!nextTier && (
          <div className="text-center py-3 bg-gold-900/20 rounded border border-gold-600">
            <p className="text-gold-400 font-semibold">🎉 Maximum reputation tier achieved!</p>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{completed.length}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{available.length}</p>
          <p className="text-xs text-gray-400">Available</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-gray-400">{locked.length}</p>
          <p className="text-xs text-gray-400">Locked</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">
            {Math.round((completed.length / MILESTONES.length) * 100)}%
          </p>
          <p className="text-xs text-gray-400">Progress</p>
        </div>
      </div>

      {/* Next Milestones - Priority View */}
      {nextMilestones.length > 0 && (
        <div className="mb-6 bg-blue-900/20 border border-blue-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
            🎯 Next Milestones to Complete
          </h3>
          <div className="space-y-3">
            {nextMilestones.map(milestone => renderMilestone(milestone, 'locked'))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </Button>
        ))}
      </div>

      {/* Milestones List */}
      <div className="space-y-6">
        {/* Available Milestones */}
        {available.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-yellow-400 mb-3 flex items-center gap-2">
              ⚡ Claimable Now ({available.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {available.map(m => renderMilestone(m, 'available'))}
            </div>
          </div>
        )}

        {/* Completed Milestones */}
        {completed.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-3 flex items-center gap-2">
              ✓ Completed ({completed.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {completed.map(m => renderMilestone(m, 'completed'))}
            </div>
          </div>
        )}

        {/* Locked Milestones */}
        {locked.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-400 mb-3 flex items-center gap-2">
              🔒 Locked ({locked.length})
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {locked.map(m => renderMilestone(m, 'locked'))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
