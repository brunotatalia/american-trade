import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface AssemblyLineProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

export const AssemblyLine: React.FC<AssemblyLineProps> = ({ difficulty, basePay, onComplete }) => {
  const targetCount = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35;
  const speed = difficulty === 'easy' ? 2000 : difficulty === 'medium' ? 1500 : 1000; // ms per item
  const timingWindow = difficulty === 'easy' ? 300 : difficulty === 'medium' ? 200 : 150; // ms tolerance

  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [itemsProcessed, setItemsProcessed] = useState(0);
  const [feedback, setFeedback] = useState<'perfect' | 'good' | 'miss' | null>(null);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    if (!gameActive) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const newPos = prev + 2;
        if (newPos >= 100) {
          // Item passed without being clicked
          setMisses(m => m + 1);
          setItemsProcessed(p => p + 1);
          setFeedback('miss');
          setTimeout(() => setFeedback(null), 500);
          return 0;
        }
        return newPos;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    if (itemsProcessed >= targetCount) {
      endGame();
    }
  }, [itemsProcessed]);

  const handleClick = () => {
    if (!gameActive) return;

    // Target zone is 45-55% (center of the line)
    const targetZone = 50;
    const distance = Math.abs(position - targetZone);

    if (distance <= timingWindow / 20) { // Convert ms to %
      const isPerfect = distance <= 2;
      setScore(score + (isPerfect ? 2 : 1));
      setFeedback(isPerfect ? 'perfect' : 'good');
    } else {
      setMisses(misses + 1);
      setFeedback('miss');
    }

    setItemsProcessed(itemsProcessed + 1);
    setPosition(0);
    setTimeout(() => setFeedback(null), 500);
  };

  const endGame = () => {
    setGameActive(false);
    const accuracy = ((score / (score + misses || 1)) * 100);
    const passingScore = Math.ceil(targetCount * 0.7);
    const passed = score >= passingScore;

    const rating = accuracy >= 90 && score >= targetCount * 0.9 ? 'excellent'
      : accuracy >= 75 && score >= targetCount * 0.75 ? 'good'
      : accuracy >= 60 && score >= targetCount * 0.6 ? 'average'
      : 'poor';

    const multiplier = passed ? (rating === 'excellent' ? 1.5 : rating === 'good' ? 1.25 : 1.0) : 0.5;

    onComplete({
      score,
      passed,
      earnings: Math.floor(basePay * multiplier),
      performanceRating: rating
    });
  };

  const accuracy = ((score / (itemsProcessed || 1)) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-yellow-300 mb-2">Assembly Line</div>
        <div className="text-sm text-gray-400">Click when the item reaches the center!</div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-400">Progress</div>
          <div className="text-2xl font-bold text-blue-400">{itemsProcessed}/{targetCount}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-2xl font-bold text-green-400">{score}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Accuracy</div>
          <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="w-full bg-gray-600 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(itemsProcessed / targetCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Assembly Line Visualization */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="relative h-32 mb-4">
          {/* Conveyor Belt */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-4 bg-gray-600 rounded-full relative overflow-hidden">
              {/* Moving stripes for belt effect */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-gray-500" />
                ))}
              </div>
            </div>
          </div>

          {/* Target Zone (center) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-24 border-4 border-yellow-400 rounded-lg bg-yellow-400 bg-opacity-10">
            <div className="text-xs text-center text-yellow-400 mt-1">TARGET</div>
          </div>

          {/* Moving Item */}
          {gameActive && (
            <div
              className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-20"
              style={{ left: `${position}%` }}
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg shadow-lg border-2 border-orange-600 flex items-center justify-center">
                <div className="text-xs font-bold">📦</div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleClick}
          variant="primary"
          className="w-full text-2xl py-6"
          disabled={!gameActive}
        >
          PROCESS ITEM
        </Button>

        {feedback && (
          <div className={`text-center mt-4 text-xl font-bold ${
            feedback === 'perfect' ? 'text-green-400' : feedback === 'good' ? 'text-blue-400' : 'text-red-400'
          }`}>
            {feedback === 'perfect' ? '🎯 PERFECT! +2' : feedback === 'good' ? '✓ Good +1' : '✗ MISS'}
          </div>
        )}
      </div>

      <div className="flex justify-between text-sm">
        <div className="text-green-400">Hits: {score}</div>
        <div className="text-red-400">Misses: {misses}</div>
      </div>
    </div>
  );
};
