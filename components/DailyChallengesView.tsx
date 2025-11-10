import React from 'react';
import { GameState } from '../types';
import { generateDailyChallenge } from '../data/dailyChallenges';

interface DailyChallengesViewProps {
  gameState: GameState;
  onGenerateChallenge: () => void;
  onCompleteChallenge: () => void;
}

export const DailyChallengesView: React.FC<DailyChallengesViewProps> = ({
  gameState,
  onGenerateChallenge,
  onCompleteChallenge
}) => {
  const challenge = gameState.player.dailyChallenge;
  const hasChallenge = challenge !== null;
  const isExpired = hasChallenge && gameState.gameTurn >= challenge.expiresAtTurn;
  const isCompleted = hasChallenge && challenge.goal(gameState);

  const turnsRemaining = hasChallenge ? Math.max(0, challenge.expiresAtTurn - gameState.gameTurn) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Daily Challenges
        </h2>
        <p className="text-gray-400 mt-2">Complete daily objectives for bonus rewards!</p>
      </div>

      {/* Challenge Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border-2 border-gray-700 shadow-xl">
        {!hasChallenge && (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-xl font-bold text-gray-300">No Active Challenge</h3>
            <p className="text-gray-400">Generate your daily challenge to get started!</p>
            <button
              onClick={onGenerateChallenge}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Generate Daily Challenge
            </button>
          </div>
        )}

        {hasChallenge && isExpired && !isCompleted && (
          <div className="text-center space-y-4">
            <div className="text-6xl">⏰</div>
            <h3 className="text-xl font-bold text-red-400">Challenge Expired</h3>
            <p className="text-gray-400">You didn't complete this challenge in time.</p>
            <div className="p-4 bg-gray-700 rounded-lg">
              <p className="text-gray-300">{challenge.description}</p>
            </div>
            <button
              onClick={onGenerateChallenge}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get New Challenge
            </button>
          </div>
        )}

        {hasChallenge && !isExpired && !isCompleted && (
          <div className="space-y-4">
            {/* Challenge Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-yellow-400">Today's Challenge</h3>
              <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-gray-400 text-sm">Expires in</span>
                <span className="text-white font-bold">{turnsRemaining}</span>
                <span className="text-gray-400 text-sm">turns</span>
              </div>
            </div>

            {/* Challenge Description */}
            <div className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-700">
              <p className="text-xl text-gray-100">{challenge.description}</p>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-gray-300">
                  {isCompleted ? '✓ Complete!' : 'In Progress...'}
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-600 w-1/2'
                  }`}
                />
              </div>
            </div>

            {/* Rewards */}
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">REWARDS</h4>
              <div className="flex space-x-4">
                {challenge.reward.money > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💰</span>
                    <div>
                      <p className="text-sm text-gray-400">Money</p>
                      <p className="text-lg font-bold text-green-400">${challenge.reward.money}</p>
                    </div>
                  </div>
                )}
                {challenge.reward.reputation > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-sm text-gray-400">Reputation</p>
                      <p className="text-lg font-bold text-yellow-400">+{challenge.reward.reputation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Completion Button (only visible when completed) */}
            {isCompleted && (
              <div className="text-center space-y-3">
                <div className="text-4xl animate-bounce">🎉</div>
                <p className="text-xl font-bold text-green-400">Challenge Complete!</p>
                <button
                  onClick={onCompleteChallenge}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Claim Rewards
                </button>
              </div>
            )}
          </div>
        )}

        {hasChallenge && isCompleted && isExpired && (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h3 className="text-xl font-bold text-green-400">Challenge Completed!</h3>
            <p className="text-gray-400">Great job! Here are your rewards:</p>
            <div className="p-4 bg-gray-700 rounded-lg space-y-2">
              <p className="text-green-400 font-bold">+${challenge.reward.money}</p>
              <p className="text-yellow-400 font-bold">+{challenge.reward.reputation} Reputation</p>
            </div>
            <button
              onClick={onGenerateChallenge}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get New Challenge
            </button>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-lg font-bold text-gray-300 mb-2">💡 About Daily Challenges</h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>• Daily challenges refresh and provide unique objectives</li>
          <li>• Complete challenges before they expire for bonus rewards</li>
          <li>• Challenges typically expire after 10 turns</li>
          <li>• Earn extra money and reputation by completing challenges</li>
          <li>• Challenge difficulty varies - some are easier than others!</li>
        </ul>
      </div>

      {/* Challenge Types */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-3xl mb-2">📈</div>
          <h5 className="font-bold text-gray-300">Trading</h5>
          <p className="text-xs text-gray-400">Buy, sell, and profit from markets</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-3xl mb-2">💼</div>
          <h5 className="font-bold text-gray-300">Jobs</h5>
          <p className="text-xs text-gray-400">Complete work shifts successfully</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-3xl mb-2">🏠</div>
          <h5 className="font-bold text-gray-300">Property</h5>
          <p className="text-xs text-gray-400">Build your real estate empire</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-3xl mb-2">💰</div>
          <h5 className="font-bold text-gray-300">Wealth</h5>
          <p className="text-xs text-gray-400">Accumulate money and assets</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-3xl mb-2">🎰</div>
          <h5 className="font-bold text-gray-300">Gambling</h5>
          <p className="text-xs text-gray-400">Test your luck at the casino</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="text-3xl mb-2">⭐</div>
          <h5 className="font-bold text-gray-300">Reputation</h5>
          <p className="text-xs text-gray-400">Build your social standing</p>
        </div>
      </div>
    </div>
  );
};
