import React, { useEffect, useState } from 'react';
import { Milestone } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface MilestoneNotificationProps {
  milestone: Milestone | null;
  onClaim: () => void;
  onClose: () => void;
}

export const MilestoneNotification: React.FC<MilestoneNotificationProps> = ({
  milestone,
  onClaim,
  onClose
}) => {
  const [shimmer, setShimmer] = useState(true);

  useEffect(() => {
    if (milestone) {
      setShimmer(true);
      const timer = setTimeout(() => setShimmer(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [milestone]);

  if (!milestone) return null;

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
    return icons[category] || '🎉';
  };

  return (
    <Modal isOpen={!!milestone} onClose={onClose} size="md">
      <div className="relative overflow-hidden">
        {/* Shimmer effect */}
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}

        <div className="text-center space-y-6 p-6">
          {/* Celebration icon */}
          <div className="text-6xl animate-bounce">
            🎉 {getCategoryIcon(milestone.category)} 🎉
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
              Milestone Achieved!
            </h2>
            <h3 className="text-2xl font-bold text-white">
              {milestone.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-300">
            {milestone.description}
          </p>

          {/* Rewards */}
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Rewards
            </h4>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              {milestone.reward.money && (
                <div className="flex items-center gap-2 bg-green-900/30 px-4 py-2 rounded-full border border-green-500/30">
                  <span className="text-2xl">💰</span>
                  <span className="text-green-400 font-bold">
                    +${milestone.reward.money.toLocaleString()}
                  </span>
                </div>
              )}
              {milestone.reward.reputation && (
                <div className="flex items-center gap-2 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
                  <span className="text-2xl">⭐</span>
                  <span className="text-purple-400 font-bold">
                    +{milestone.reward.reputation} Rep
                  </span>
                </div>
              )}
              {milestone.reward.unlocks && milestone.reward.unlocks.length > 0 && (
                <div className="flex items-center gap-2 bg-blue-900/30 px-4 py-2 rounded-full border border-blue-500/30">
                  <span className="text-2xl">🔓</span>
                  <span className="text-blue-400 font-bold">
                    {milestone.reward.unlocks.length} New Unlocks
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onClaim}
              className="animate-pulse"
            >
              🎁 Claim Rewards
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onClose}
            >
              Close
            </Button>
          </div>

          {/* Category badge */}
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            {milestone.category} milestone
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Modal>
  );
};
