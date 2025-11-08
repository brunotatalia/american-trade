import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { CelebrationEffect, FireworksEffect } from './effects/CelebrationEffect';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);

      // Trigger celebration based on rarity
      if (achievement.rarity === 'legendary' || achievement.rarity === 'epic') {
        setShowFireworks(true);
      } else {
        setShowCelebration(true);
      }

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'from-gray-600 to-gray-800';
      case 'rare': return 'from-blue-600 to-blue-800';
      case 'epic': return 'from-purple-600 to-purple-800';
      case 'legendary': return 'from-yellow-600 to-yellow-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getRarityGlow = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/50';
      case 'rare': return 'shadow-blue-500/50';
      case 'epic': return 'shadow-purple-500/50';
      case 'legendary': return 'shadow-yellow-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  return (
    <>
      {/* Celebration Effects */}
      <CelebrationEffect
        trigger={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
      <FireworksEffect
        trigger={showFireworks}
        onComplete={() => setShowFireworks(false)}
      />

      <div
        className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
      <div
        className={`bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-2 border-yellow-400 rounded-lg shadow-2xl ${getRarityGlow(achievement.rarity)} p-4 max-w-sm cursor-pointer hover:scale-105 transition-transform`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          animation: 'bounce 0.5s ease-in-out'
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-2xl">🏆</div>
          <div className="text-yellow-300 font-bold text-lg uppercase tracking-wider">
            Achievement Unlocked!
          </div>
        </div>

        {/* Content */}
        <div className="bg-black/30 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-5xl drop-shadow-lg">{achievement.icon}</div>
            <div className="flex-1">
              <div className="text-white font-bold text-xl mb-1">
                {achievement.name}
              </div>
              <div className="text-xs text-gray-300 uppercase font-semibold">
                {achievement.rarity}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-200">{achievement.description}</p>
        </div>

        {/* Rewards */}
        {achievement.reward && (
          <div className="bg-black/20 rounded p-2 text-sm">
            <div className="font-semibold text-yellow-300 mb-1">Rewards:</div>
            <div className="flex gap-3">
              {achievement.reward.money && (
                <span className="text-green-300">
                  💰 +${achievement.reward.money.toLocaleString()}
                </span>
              )}
              {achievement.reward.reputation && (
                <span className="text-blue-300">
                  ⭐ +{achievement.reward.reputation} Rep
                </span>
              )}
            </div>
          </div>
        )}

        {/* Click to dismiss hint */}
        <div className="text-center mt-2 text-xs text-gray-400">
          Click to dismiss
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
      `}</style>
    </div>
    </>
  );
};
