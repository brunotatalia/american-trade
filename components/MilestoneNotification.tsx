import React, { useEffect, useState } from 'react';
import { Milestone } from '../types';

interface MilestoneNotificationProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export const MilestoneNotification: React.FC<MilestoneNotificationProps> = ({
  milestone,
  onClose
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!milestone) return;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 5000);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 5500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [milestone, onClose]);

  if (!milestone) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-50
        bg-gradient-to-r from-yellow-500 to-orange-500
        border-4 border-yellow-400
        rounded-lg shadow-2xl p-6 max-w-md
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full scale-90' : 'opacity-100 translate-x-0 scale-100'}
        animate-bounce
      `}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white hover:text-gray-200 text-2xl leading-none"
      >
        ×
      </button>

      {/* Content */}
      <div className="text-center">
        <div className="text-6xl mb-3 animate-pulse">{milestone.icon}</div>
        <div className="text-sm font-semibold text-yellow-900 mb-1">MILESTONE ACHIEVED!</div>
        <h3 className="text-2xl font-bold text-white mb-2">{milestone.name}</h3>
        <p className="text-sm text-yellow-100 mb-4">{milestone.description}</p>

        {/* Rewards */}
        {milestone.reward && (
          <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-xs text-yellow-100 mb-2">🎁 Rewards</p>
            <div className="flex justify-center gap-3 text-sm font-semibold">
              {milestone.reward.money && (
                <div className="text-white">
                  +${milestone.reward.money.toLocaleString()}
                </div>
              )}
              {milestone.reward.reputation && (
                <div className="text-white">
                  +{milestone.reward.reputation} Rep
                </div>
              )}
            </div>
            {milestone.reward.unlocks && milestone.reward.unlocks.length > 0 && (
              <div className="mt-2 text-xs text-yellow-100">
                🔓 Unlocked: {milestone.reward.unlocks.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none" />
    </div>
  );
};
