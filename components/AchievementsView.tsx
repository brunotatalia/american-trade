import React, { useState } from 'react';
import { GameState, Achievement } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface AchievementsViewProps {
  gameState: GameState;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ gameState }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'wealth', name: 'Wealth', icon: '💰' },
    { id: 'trading', name: 'Trading', icon: '📈' },
    { id: 'property', name: 'Property', icon: '🏠' },
    { id: 'skills', name: 'Skills', icon: '📚' },
    { id: 'jobs', name: 'Jobs', icon: '👔' },
    { id: 'gambling', name: 'Gambling', icon: '🎰' },
    { id: 'special', name: 'Special', icon: '⭐' }
  ];

  const isUnlocked = (achievement: Achievement): boolean => {
    return gameState.player.achievements.some(a => a.achievementId === achievement.id);
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600';
      case 'rare': return 'text-blue-400 border-blue-600';
      case 'epic': return 'text-purple-400 border-purple-600';
      case 'legendary': return 'text-yellow-400 border-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-900';
      case 'rare': return 'bg-blue-900/30';
      case 'epic': return 'bg-purple-900/30';
      case 'legendary': return 'bg-yellow-900/30';
      default: return 'bg-gray-900';
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? gameState.achievements
    : gameState.achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = gameState.player.achievements.length;
  const totalCount = gameState.achievements.filter(a => !a.secret).length;
  const secretUnlocked = gameState.achievements.filter(a =>
    a.secret && isUnlocked(a)
  ).length;

  const completionPercentage = (unlockedCount / totalCount * 100).toFixed(1);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
          🏆 Achievements
        </h2>
        <p className="text-sm text-gray-400">
          Unlock achievements to earn rewards and prove your trading prowess!
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Overall Progress</div>
              <div className="text-3xl font-bold text-white">
                {unlockedCount} / {totalCount}
              </div>
              <div className="text-sm text-purple-400">
                {completionPercentage}% Complete
              </div>
            </div>
            {secretUnlocked > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Secret Achievements</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {secretUnlocked} 🎁
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 flex items-center justify-center text-xs font-bold"
              style={{ width: `${completionPercentage}%` }}
            >
              {parseFloat(completionPercentage) > 10 && `${completionPercentage}%`}
            </div>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const categoryAchievements = cat.id === 'all'
            ? gameState.achievements
            : gameState.achievements.filter(a => a.category === cat.id);
          const unlockedInCategory = categoryAchievements.filter(a => isUnlocked(a)).length;

          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(cat.id)}
              size="sm"
              className="flex items-center gap-1"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-xs opacity-70">
                ({unlockedInCategory}/{categoryAchievements.length})
              </span>
            </Button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => {
          const unlocked = isUnlocked(achievement);
          const unlockData = gameState.player.achievements.find(a => a.achievementId === achievement.id);

          // Hide secret achievements until unlocked
          if (achievement.secret && !unlocked) {
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 border-dashed border-gray-700 bg-gray-900/50 opacity-50`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-4xl">❓</div>
                  <div>
                    <div className="font-bold text-gray-500">Secret Achievement</div>
                    <div className="text-xs text-gray-600 uppercase">???</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">
                  Hidden until unlocked...
                </p>
              </div>
            );
          }

          return (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} ${getRarityBg(achievement.rarity)} ${
                unlocked ? 'animate-fadeInScale' : 'opacity-60'
              } transition-all hover:scale-105`}
            >
              {/* Unlocked Badge */}
              {unlocked && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  ✓ UNLOCKED
                </div>
              )}

              {/* Rarity Badge */}
              <div className={`absolute top-2 left-2 ${getRarityColor(achievement.rarity)} text-xs px-2 py-1 rounded-full font-bold uppercase border`}>
                {achievement.rarity}
              </div>

              <div className="flex items-center gap-3 mb-2 mt-6">
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <div className="font-bold text-white">{achievement.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{achievement.category}</div>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3">
                {achievement.description}
              </p>

              {/* Reward Info */}
              {achievement.reward && (
                <div className="bg-gray-800/50 rounded p-2 text-xs space-y-1">
                  <div className="text-gray-400 font-semibold">Rewards:</div>
                  <div className="flex gap-3">
                    {achievement.reward.money && (
                      <span className="text-green-400">💰 ${achievement.reward.money.toLocaleString()}</span>
                    )}
                    {achievement.reward.reputation && (
                      <span className="text-blue-400">⭐ +{achievement.reward.reputation} Rep</span>
                    )}
                  </div>
                </div>
              )}

              {/* Unlock Date */}
              {unlocked && unlockData && (
                <div className="mt-2 text-xs text-gray-500">
                  Unlocked: Turn {unlockData.unlockedAtTurn}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🏆</div>
          <div>No achievements in this category</div>
        </div>
      )}
    </div>
  );
};
