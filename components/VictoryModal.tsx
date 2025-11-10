import React, { useEffect, useState } from 'react';
import { WinCondition, GameState } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface VictoryModalProps {
  winCondition: WinCondition | null;
  gameState: GameState;
  onContinue: () => void;
  onPrestige?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winCondition,
  gameState,
  onContinue,
  onPrestige
}) => {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    if (winCondition) {
      setConfetti(true);
      const timer = setTimeout(() => setConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [winCondition]);

  if (!winCondition) return null;

  const calculateNetWorth = () => {
    let total = gameState.player.money;
    
    Object.entries(gameState.player.commodities).forEach(([id, holding]) => {
      const commodity = gameState.commodities[id];
      if (commodity && !commodity.isBankrupt) {
        total += holding.quantity * commodity.price;
      }
    });
    
    gameState.player.properties.forEach(propId => {
      const property = gameState.properties[propId];
      if (property) {
        total += property.cost;
      }
    });
    
    return total;
  };

  return (
    <Modal isOpen={!!winCondition} onClose={onContinue} size="lg">
      <div className="relative overflow-hidden">
        {/* Confetti effect */}
        {confetti && (
          <>
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-[fall_3s_ease-out_infinite] opacity-80"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i % 5],
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </>
        )}

        <div className="text-center space-y-8 p-8 relative z-10">
          {/* Victory banner */}
          <div className="space-y-4">
            <div className="text-8xl animate-bounce">
              🎊 {winCondition.icon} 🎊
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              VICTORY!
            </h1>
            <h2 className="text-3xl font-bold text-white">
              {winCondition.name}
            </h2>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {winCondition.description}
          </p>

          {/* Stats */}
          <div className="bg-gray-800/50 rounded-xl p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-400 uppercase tracking-wide">
              Your Achievement
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400">
                  ${calculateNetWorth().toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Final Net Worth</div>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-400">
                  {winCondition.prestigePoints}
                </div>
                <div className="text-sm text-gray-400">Prestige Points</div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">
                  {gameState.gameTurn}
                </div>
                <div className="text-sm text-gray-400">Turns Survived</div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-400">
                  {gameState.player.progress.completedMilestones.length}
                </div>
                <div className="text-sm text-gray-400">Milestones</div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-pink-400">
                  {gameState.player.properties.length}
                </div>
                <div className="text-sm text-gray-400">Properties Owned</div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-400">
                  {gameState.player.tradingStats.profitableTrades}
                </div>
                <div className="text-sm text-gray-400">Profitable Trades</div>
              </div>
            </div>
          </div>

          {/* Prestige info */}
          {onPrestige && (
            <div className="bg-purple-900/30 border-2 border-purple-500/50 rounded-xl p-6 space-y-3">
              <h3 className="text-xl font-bold text-purple-300 flex items-center justify-center gap-2">
                <span>✨</span> Prestige System <span>✨</span>
              </h3>
              <p className="text-sm text-gray-300">
                You've earned <span className="font-bold text-purple-400">{winCondition.prestigePoints} Prestige Points</span>!
                Use them to unlock permanent bonuses for your next run.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onContinue}
              className="px-8"
            >
              Continue Playing
            </Button>
            {onPrestige && (
              <Button
                variant="secondary"
                size="lg"
                onClick={onPrestige}
                className="px-8 bg-purple-600 hover:bg-purple-700 border-purple-500"
              >
                ✨ Prestige & Restart
              </Button>
            )}
          </div>

          {/* Category badge */}
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            {winCondition.category} victory • Era: {gameState.currentEra?.name}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </Modal>
  );
};
