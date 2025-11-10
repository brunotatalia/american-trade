import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface PatternMatchProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

export const PatternMatch: React.FC<PatternMatchProps> = ({ difficulty, basePay, onComplete }) => {
  const gridSize = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const showTime = difficulty === 'easy' ? 3000 : difficulty === 'medium' ? 2000 : 1500;
  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;

  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [showingPattern, setShowingPattern] = useState(true);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generatePattern = () => {
    const patternSize = Math.min(gridSize * gridSize, Math.floor((round + 1) * 1.5) + 2);
    const newPattern = Array(gridSize * gridSize).fill(false);
    const indices = new Set<number>();

    while (indices.size < patternSize) {
      indices.add(Math.floor(Math.random() * gridSize * gridSize));
    }

    indices.forEach(i => newPattern[i] = true);
    return newPattern;
  };

  useEffect(() => {
    if (round < totalRounds) {
      const newPattern = generatePattern();
      setPattern(newPattern);
      setUserPattern(Array(gridSize * gridSize).fill(false));
      setShowingPattern(true);
      setFeedback(null);
      setTimeLeft(20);

      const timer = setTimeout(() => setShowingPattern(false), showTime);
      return () => clearTimeout(timer);
    }
  }, [round]);

  useEffect(() => {
    if (!showingPattern && timeLeft > 0 && round < totalRounds) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showingPattern) {
      checkPattern();
    }
  }, [timeLeft, showingPattern]);

  const toggleCell = (index: number) => {
    if (showingPattern) return;
    const newUserPattern = [...userPattern];
    newUserPattern[index] = !newUserPattern[index];
    setUserPattern(newUserPattern);
  };

  const checkPattern = () => {
    const correct = pattern.every((cell, i) => cell === userPattern[i]);
    if (correct) {
      setScore(score + 1);
      setFeedback('✓ Perfect Match!');
    } else {
      setFeedback('✗ Pattern Mismatch');
    }

    setTimeout(() => {
      if (round + 1 < totalRounds) {
        setRound(round + 1);
      } else {
        endGame();
      }
    }, 1500);
  };

  const endGame = () => {
    const passingScore = Math.ceil(totalRounds * 0.7);
    const passed = score >= passingScore;
    const scorePercent = (score / totalRounds) * 100;
    const rating = scorePercent >= 90 ? 'excellent' : scorePercent >= 75 ? 'good' : scorePercent >= 60 ? 'average' : 'poor';
    const multiplier = passed ? (rating === 'excellent' ? 1.5 : rating === 'good' ? 1.25 : 1.0) : 0.5;

    onComplete({
      score,
      passed,
      earnings: Math.floor(basePay * multiplier),
      performanceRating: rating
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Round {round + 1} / {totalRounds}
        </div>
        <div className={`text-2xl font-bold ${showingPattern ? 'text-blue-400' : timeLeft < 5 ? 'text-red-400' : 'text-green-400'}`}>
          {showingPattern ? 'MEMORIZE' : `${timeLeft}s`}
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Score: {score} / {totalRounds}</div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div
            className="bg-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(score / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mb-2">
        {showingPattern ? 'Memorize the pattern!' : 'Recreate the pattern!'}
      </div>

      <div
        className="grid gap-2 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          maxWidth: `${gridSize * 60}px`
        }}
      >
        {Array(gridSize * gridSize).fill(0).map((_, i) => (
          <button
            key={i}
            onClick={() => toggleCell(i)}
            disabled={showingPattern || feedback !== null}
            className={`aspect-square rounded-lg border-2 transition-all ${
              showingPattern && pattern[i]
                ? 'bg-blue-500 border-blue-400'
                : !showingPattern && userPattern[i]
                ? 'bg-purple-500 border-purple-400'
                : 'bg-gray-700 border-gray-600'
            } ${!showingPattern && !feedback ? 'hover:bg-gray-600 cursor-pointer' : ''}`}
          />
        ))}
      </div>

      {!showingPattern && !feedback && (
        <Button
          onClick={checkPattern}
          variant="primary"
          className="w-full"
        >
          Submit Pattern
        </Button>
      )}

      {feedback && (
        <div className={`text-center text-lg font-semibold ${feedback.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};
