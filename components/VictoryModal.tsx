import React from 'react';
import { WinCondition, GameDate } from '../types';
import { Button } from './ui/Button';

interface VictoryModalProps {
  winCondition: WinCondition;
  completedAtTurn: number;
  completedDate: GameDate;
  onContinuePlaying: () => void;
  onPrestige: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winCondition,
  completedAtTurn,
  completedDate,
  onContinuePlaying,
  onPrestige
}) => {
  const difficultyColors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-orange-400',
    legendary: 'text-purple-400'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
      <div className="bg-gradient-to-b from-yellow-900 to-gray-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 border-4 border-yellow-500 animate-scaleIn">
        {/* Celebration Header */}
        <div className="px-8 py-6 text-center border-b border-yellow-700">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-yellow-300 mb-2">VICTORY!</h1>
          <p className="text-xl text-gray-200">You've achieved a win condition!</p>
        </div>

        {/* Win Condition Details */}
        <div className="px-8 py-6">
          {/* Condition Info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6 border-2 border-yellow-600">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{winCondition.icon}</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{winCondition.name}</h2>
                <p className="text-gray-300">{winCondition.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div>
                <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                <p className={`text-lg font-bold uppercase ${difficultyColors[winCondition.difficulty]}`}>
                  {winCondition.difficulty}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Completed In</p>
                <p className="text-lg font-bold text-white">{completedAtTurn} turns</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p className="text-lg font-bold text-white">
                  {completedDate.month}/{completedDate.year}
                </p>
              </div>
            </div>
          </div>

          {/* Rewards */}
          {winCondition.reward && (
            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-6 mb-6 border-2 border-purple-600">
              <h3 className="text-xl font-bold text-purple-300 mb-4">🎁 Rewards Earned</h3>
              <div className="space-y-3">
                {winCondition.reward.prestigePoints && (
                  <div className="flex items-center justify-between bg-gray-800 rounded p-3">
                    <span className="text-gray-200">Prestige Points</span>
                    <span className="text-2xl font-bold text-purple-400">
                      +{winCondition.reward.prestigePoints}
                    </span>
                  </div>
                )}
                {winCondition.reward.title && (
                  <div className="flex items-center justify-between bg-gray-800 rounded p-3">
                    <span className="text-gray-200">Title Unlocked</span>
                    <span className="text-xl font-bold text-yellow-400">
                      "{winCondition.reward.title}"
                    </span>
                  </div>
                )}
                {winCondition.reward.unlocks && winCondition.reward.unlocks.length > 0 && (
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-200 mb-2">Unlocks:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {winCondition.reward.unlocks.map((unlock, i) => (
                        <li key={i} className="text-sm text-gray-300">{unlock}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-200">
              <strong>🎯 Multiple Victories:</strong> You can continue playing to achieve other win conditions and earn more Prestige Points!
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="primary"
              onClick={onContinuePlaying}
              className="flex-1"
            >
              Continue Playing
            </Button>
            <Button
              variant="secondary"
              onClick={onPrestige}
              className="flex-1 bg-purple-700 hover:bg-purple-600"
            >
              Prestige & Start New Game+
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
