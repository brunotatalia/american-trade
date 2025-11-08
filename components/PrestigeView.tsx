import React, { useState } from 'react';
import { GameState } from '../types';
import { PRESTIGE_BONUSES, calculatePrestigePoints, getLevelUpCost, getEffectiveBonus } from '../data/prestigeBonuses';
import { ProgressBar, CircularProgress } from './ui/ProgressBar';

interface PrestigeViewProps {
  gameState: GameState;
  onPrestige: () => void;
  onUpgradeBonus: (bonusId: string) => void;
}

export const PrestigeView: React.FC<PrestigeViewProps> = ({
  gameState,
  onPrestige,
  onUpgradeBonus
}) => {
  const [showConfirmPrestige, setShowConfirmPrestige] = useState(false);

  const prestige = gameState.prestige;
  const potentialPoints = calculatePrestigePoints(
    gameState.player.money,
    gameState.player.achievements.length,
    gameState.gameTurn
  );

  // Check if player meets minimum requirements to prestige
  const canPrestige = gameState.player.money >= 100000 || gameState.player.achievements.length >= 10 || gameState.gameTurn >= 100;

  const getBonusLevel = (bonusId: string): number => {
    return prestige.bonuses[bonusId] || 0;
  };

  const getNextLevelCost = (bonusId: string): number => {
    const bonus = PRESTIGE_BONUSES.find(b => b.id === bonusId);
    if (!bonus) return 0;
    const currentLevel = getBonusLevel(bonusId);
    if (currentLevel >= bonus.maxLevel) return 0;
    return getLevelUpCost(bonus, currentLevel, currentLevel + 1);
  };

  const canAffordUpgrade = (bonusId: string): boolean => {
    const cost = getNextLevelCost(bonusId);
    return cost > 0 && prestige.availablePrestigePoints >= cost;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Prestige System
        </h2>
        <p className="text-gray-400 mt-2">Restart your journey with permanent bonuses!</p>
      </div>

      {/* Prestige Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-4 border-2 border-purple-600 shadow-lg">
          <div className="text-center">
            <div className="text-5xl mb-2">🏆</div>
            <p className="text-sm text-gray-300">Prestige Level</p>
            <p className="text-3xl font-bold text-purple-300">{prestige.prestigeLevel}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-4 border-2 border-yellow-600 shadow-lg">
          <div className="text-center">
            <div className="text-5xl mb-2">⭐</div>
            <p className="text-sm text-gray-300">Available Points</p>
            <p className="text-3xl font-bold text-yellow-300">{prestige.availablePrestigePoints}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-4 border-2 border-blue-600 shadow-lg">
          <div className="text-center">
            <div className="text-5xl mb-2">💎</div>
            <p className="text-sm text-gray-300">Total Points Earned</p>
            <p className="text-3xl font-bold text-blue-300">{prestige.totalPrestigePoints}</p>
          </div>
        </div>
      </div>

      {/* Current Run Preview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4">📊 Current Run</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Money</p>
            <p className="text-green-400 font-bold text-xl">${gameState.player.money.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Achievements</p>
            <p className="text-yellow-400 font-bold text-xl">{gameState.player.achievements.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Turns</p>
            <p className="text-blue-400 font-bold text-xl">{gameState.gameTurn}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Potential Points</p>
            <p className="text-purple-400 font-bold text-xl">+{potentialPoints}</p>
          </div>
        </div>

        {/* Prestige Button */}
        <div className="mt-6 text-center">
          {!canPrestige ? (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
              <p className="text-red-400">
                Requirements to Prestige: $100,000 OR 10 Achievements OR 100 Turns
              </p>
            </div>
          ) : !showConfirmPrestige ? (
            <button
              onClick={() => setShowConfirmPrestige(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Prestige & Restart (+{potentialPoints} Points)
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-300 font-bold mb-2">⚠️ Confirm Prestige</p>
                <p className="text-gray-300 text-sm">
                  This will restart your game, but you'll keep all achievements and earn +{potentialPoints} prestige points!
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onPrestige}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  ✅ Confirm Prestige
                </button>
                <button
                  onClick={() => setShowConfirmPrestige(false)}
                  className="px-6 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-all"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prestige Bonuses */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">💎 Permanent Bonuses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESTIGE_BONUSES.map((bonus) => {
            const currentLevel = getBonusLevel(bonus.id);
            const nextLevelCost = getNextLevelCost(bonus.id);
            const canAfford = canAffordUpgrade(bonus.id);
            const isMaxed = currentLevel >= bonus.maxLevel;
            const effectiveValue = getEffectiveBonus(bonus, currentLevel);

            return (
              <div
                key={bonus.id}
                className={`bg-gray-800 rounded-lg p-5 border-2 transition-all ${
                  canAfford ? 'border-green-500 shadow-lg shadow-green-500/30' : 'border-gray-700'
                } ${isMaxed ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-800/20' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{bonus.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-lg">{bonus.name}</h4>
                      <p className="text-sm text-gray-400">{bonus.description}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <ProgressBar
                    progress={(currentLevel / bonus.maxLevel) * 100}
                    label={`Level ${currentLevel}/${bonus.maxLevel}`}
                    color={isMaxed ? 'yellow' : 'purple'}
                    showPercentage={false}
                  />
                </div>

                {/* Current Effect */}
                <div className="bg-gray-900/50 rounded p-3 mb-3">
                  <p className="text-sm text-gray-400">Current Effect:</p>
                  <p className="text-green-400 font-bold">
                    {bonus.effect.type === 'starting_money' && `+$${effectiveValue.toLocaleString()} starting money`}
                    {bonus.effect.type === 'starting_reputation' && `+${effectiveValue} starting reputation`}
                    {bonus.effect.type === 'skill_discount' && `-${effectiveValue}% skill costs`}
                    {bonus.effect.type === 'property_discount' && `-${effectiveValue}% property costs`}
                    {bonus.effect.type === 'job_earnings' && `+${effectiveValue}% job earnings`}
                    {bonus.effect.type === 'trade_bonus' && `+${effectiveValue}% trading profits`}
                    {bonus.effect.type === 'unlock_speed' && `${effectiveValue}% faster unlocks`}
                    {bonus.effect.type === 'event_frequency' && `+${effectiveValue}% event rate`}
                  </p>
                </div>

                {/* Upgrade Button */}
                {!isMaxed ? (
                  <button
                    onClick={() => canAfford && onUpgradeBonus(bonus.id)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg font-bold transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? `Upgrade (${nextLevelCost} Points)` : `Needs ${nextLevelCost} Points`}
                  </button>
                ) : (
                  <div className="w-full py-2 bg-yellow-900/30 border border-yellow-700 rounded-lg text-center">
                    <span className="text-yellow-400 font-bold">✨ MAX LEVEL</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lifetime Stats */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4">📈 Lifetime Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Money Earned</p>
            <p className="text-green-400 font-bold text-xl">
              ${prestige.lifetimeStats.totalMoneyEarned.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Trades</p>
            <p className="text-blue-400 font-bold text-xl">
              {prestige.lifetimeStats.totalTradesCompleted.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Achievements</p>
            <p className="text-yellow-400 font-bold text-xl">
              {prestige.lifetimeStats.totalAchievementsUnlocked}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Turns</p>
            <p className="text-purple-400 font-bold text-xl">
              {prestige.lifetimeStats.totalTurnsPlayed.toLocaleString()}
            </p>
          </div>
        </div>

        {prestige.lifetimeStats.bestRun.money > 0 && (
          <div className="mt-4 bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-lg font-bold text-yellow-400 mb-2">🏆 Best Run</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Money</p>
                <p className="text-green-400 font-bold">
                  ${prestige.lifetimeStats.bestRun.money.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Turn</p>
                <p className="text-blue-400 font-bold">{prestige.lifetimeStats.bestRun.turn}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Achievements</p>
                <p className="text-yellow-400 font-bold">{prestige.lifetimeStats.bestRun.achievements}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <h4 className="text-lg font-bold text-blue-400 mb-2">💡 About Prestige</h4>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Prestiging restarts the game but grants permanent bonuses</li>
          <li>• Earn prestige points from money ($1 per $10k), achievements (2 each), and survival (1 per 50 turns)</li>
          <li>• All achievements carry over to new runs</li>
          <li>• Use prestige points to unlock permanent bonuses</li>
          <li>• Each bonus level costs progressively more points</li>
          <li>• Stack multiple bonuses to create powerful synergies!</li>
        </ul>
      </div>
    </div>
  );
};
