import React, { useState, useMemo } from 'react';
import { GameState, Milestone } from '../types';
import { TIER_NAMES } from '../constants';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface MilestonesViewProps {
  gameState: GameState;
  onClaimMilestone: (milestoneId: string) => void;
}

type FilterCategory = 'all' | 'wealth' | 'property' | 'trading' | 'career' | 'skills' | 'reputation' | 'special';
type FilterStatus = 'all' | 'completed' | 'claimable' | 'locked';

export const MilestonesView: React.FC<MilestonesViewProps> = ({ gameState, onClaimMilestone }) => {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);

  // Calculate milestone states
  const milestoneStates = useMemo(() => {
    return Object.values(gameState.milestones).map(milestone => {
      const isCompleted = milestone.requirement(gameState);
      const isClaimed = gameState.player.progress.claimedMilestones.includes(milestone.id);
      
      let status: 'completed' | 'claimable' | 'locked';
      if (isClaimed) {
        status = 'completed';
      } else if (isCompleted) {
        status = 'claimable';
      } else {
        status = 'locked';
      }

      return {
        milestone,
        status,
        isCompleted,
        isClaimed
      };
    });
  }, [gameState]);

  // Apply filters
  const filteredMilestones = useMemo(() => {
    return milestoneStates.filter(ms => {
      // Category filter
      if (filterCategory !== 'all' && ms.milestone.category !== filterCategory) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'all' && ms.status !== filterStatus) {
        return false;
      }

      // Priority filter
      if (showPriorityOnly && ms.milestone.priority !== 'high') {
        return false;
      }

      return true;
    });
  }, [milestoneStates, filterCategory, filterStatus, showPriorityOnly]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = milestoneStates.length;
    const completed = milestoneStates.filter(ms => ms.isClaimed).length;
    const claimable = milestoneStates.filter(ms => ms.status === 'claimable').length;
    const locked = milestoneStates.filter(ms => ms.status === 'locked').length;

    return { total, completed, claimable, locked };
  }, [milestoneStates]);

  // Tier progress calculation
  const tierProgress = useMemo(() => {
    const currentTier = gameState.player.progress.currentTier;
    const completedCount = stats.completed;
    
    return {
      currentTier,
      tierName: TIER_NAMES[currentTier],
      progress: gameState.player.progress.tierProgress
    };
  }, [gameState.player.progress, stats.completed]);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      wealth: '💰',
      property: '🏢',
      trading: '📈',
      career: '💼',
      skills: '🎓',
      reputation: '⭐',
      special: '🎯'
    };
    return icons[category] || '📌';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'claimable': return '⚡';
      case 'locked': return '🔒';
      default: return '❓';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Tier Progress */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Milestones & Progression
        </h2>

        {/* Tier Progress Bar */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-300">
                  Current Tier: {tierProgress.tierName}
                </h3>
                <p className="text-sm text-gray-400">
                  Progress to next tier: {tierProgress.progress.toFixed(0)}%
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">
                  Tier {tierProgress.currentTier + 1}/5
                </div>
                <div className="text-sm text-gray-400">
                  {stats.completed}/{stats.total} Milestones
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 flex items-center justify-center text-xs font-bold"
                style={{ width: `${tierProgress.progress}%` }}
              >
                {tierProgress.progress > 10 && `${tierProgress.progress.toFixed(0)}%`}
              </div>
            </div>

            {/* Tier Labels */}
            <div className="flex justify-between text-xs">
              {TIER_NAMES.map((name, idx) => (
                <div
                  key={name}
                  className={`${
                    idx <= tierProgress.currentTier ? 'text-purple-400 font-bold' : 'text-gray-500'
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-green-900/20 border-green-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
          </Card>
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.claimable}</div>
              <div className="text-sm text-gray-400">Claimable</div>
            </div>
          </Card>
          <Card className="bg-gray-900/20 border-gray-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-400">{stats.locked}</div>
              <div className="text-sm text-gray-400">Locked</div>
            </div>
          </Card>
          <Card className="bg-blue-900/20 border-blue-500/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-400">Category:</span>
          {['all', 'wealth', 'property', 'trading', 'career', 'skills', 'reputation', 'special'].map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={filterCategory === cat ? 'primary' : 'secondary'}
              onClick={() => setFilterCategory(cat as FilterCategory)}
            >
              {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-400">Status:</span>
          {['all', 'claimable', 'completed', 'locked'].map(status => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? 'primary' : 'secondary'}
              onClick={() => setFilterStatus(status as FilterStatus)}
            >
              {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="priority-filter"
            checked={showPriorityOnly}
            onChange={(e) => setShowPriorityOnly(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="priority-filter" className="text-sm text-gray-400">
            Show High Priority Only
          </label>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filteredMilestones.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No milestones match your filters</p>
          </Card>
        ) : (
          filteredMilestones.map(({ milestone, status, isCompleted, isClaimed }) => (
            <Card
              key={milestone.id}
              className={`
                transition-all duration-300
                ${status === 'claimable' ? 'border-yellow-500 bg-yellow-900/20 animate-pulse' : ''}
                ${status === 'completed' ? 'border-green-500/30 bg-green-900/10' : ''}
                ${status === 'locked' ? 'border-gray-700 bg-gray-900/30 opacity-75' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(milestone.category)}</span>
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        {milestone.name}
                        <span className={`text-xs ${getPriorityColor(milestone.priority)}`}>
                          {milestone.priority === 'high' && '⭐'}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-400">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-4 text-sm ml-11">
                    {milestone.reward.money && (
                      <span className="text-green-400">
                        💰 +${milestone.reward.money.toLocaleString()}
                      </span>
                    )}
                    {milestone.reward.reputation && (
                      <span className="text-purple-400">
                        ⭐ +{milestone.reward.reputation} Rep
                      </span>
                    )}
                    {milestone.reward.unlocks && milestone.reward.unlocks.length > 0 && (
                      <span className="text-blue-400">
                        🔓 Unlocks: {milestone.reward.unlocks.length} items
                      </span>
                    )}
                  </div>

                  {/* Tier info */}
                  <div className="text-xs text-gray-500 ml-11">
                    Tier: {TIER_NAMES[milestone.tier]}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    {getStatusIcon(status)}
                  </div>
                  {status === 'claimable' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onClaimMilestone(milestone.id)}
                      className="animate-pulse"
                    >
                      Claim Reward
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
