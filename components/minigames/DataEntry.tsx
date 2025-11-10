import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface DataEntryProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

export const DataEntry: React.FC<DataEntryProps> = ({ difficulty, basePay, onComplete }) => {
  const entryCount = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
  const timeLimit = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 50 : 40;

  const [entries, setEntries] = useState<string[]>([]);
  const [currentEntry, setCurrentEntry] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [wpm, setWpm] = useState(0);
  const [started, setStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateEntry = (): string => {
    if (difficulty === 'easy') {
      // Simple 5-digit numbers
      return String(Math.floor(10000 + Math.random() * 90000));
    } else if (difficulty === 'medium') {
      // Mix of numbers and letters
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } else {
      // Complex alphanumeric with special chars
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
      return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
  };

  useEffect(() => {
    const newEntries = Array.from({ length: entryCount }, generateEntry);
    setEntries(newEntries);
  }, []);

  useEffect(() => {
    if (started && timeLeft > 0 && currentEntry < entryCount) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (started && (timeLeft === 0 || currentEntry >= entryCount)) {
      endGame();
    }
  }, [timeLeft, started, currentEntry]);

  useEffect(() => {
    if (started && currentEntry < entryCount) {
      inputRef.current?.focus();
    }
  }, [currentEntry, started]);

  const handleSubmit = () => {
    const correct = input === entries[currentEntry];

    if (correct) {
      setScore(score + 1);
      const elapsedTime = timeLimit - timeLeft;
      const words = (score + 1);
      const minutes = elapsedTime / 60;
      setWpm(Math.round(words / minutes));
    } else {
      setErrors(errors + 1);
    }

    setInput('');

    if (currentEntry + 1 < entryCount) {
      setCurrentEntry(currentEntry + 1);
    } else {
      setTimeout(endGame, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startGame = () => {
    setStarted(true);
    inputRef.current?.focus();
  };

  const endGame = () => {
    const accuracy = ((score / (score + errors)) * 100) || 0;
    const passingScore = Math.ceil(entryCount * 0.75);
    const passed = score >= passingScore && accuracy >= 70;

    const rating = accuracy >= 95 && wpm >= 40 ? 'excellent'
      : accuracy >= 85 && wpm >= 30 ? 'good'
      : accuracy >= 70 && wpm >= 20 ? 'average'
      : 'poor';

    const multiplier = passed ? (rating === 'excellent' ? 1.6 : rating === 'good' ? 1.3 : 1.0) : 0.4;

    onComplete({
      score,
      passed,
      earnings: Math.floor(basePay * multiplier),
      performanceRating: rating
    });
  };

  if (!started) {
    return (
      <div className="p-6 space-y-6 text-center">
        <div className="text-2xl font-bold text-blue-300">Data Entry Challenge</div>
        <div className="text-gray-400">
          <p>Type each code exactly as shown.</p>
          <p>Press Enter to submit each entry.</p>
          <p className="mt-4 text-sm">Entries: {entryCount} | Time: {timeLimit}s</p>
          <p className="text-sm">Difficulty: {difficulty.toUpperCase()}</p>
        </div>
        <Button onClick={startGame} variant="primary" className="mt-6">
          Start Data Entry
        </Button>
      </div>
    );
  }

  if (entries.length === 0) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const accuracy = ((score / (score + errors || 1)) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-400">Time</div>
          <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-green-400'}`}>
            {timeLeft}s
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Progress</div>
          <div className="text-2xl font-bold text-blue-400">{currentEntry}/{entryCount}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Accuracy</div>
          <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Speed</div>
          <div className="text-2xl font-bold text-yellow-400">{wpm} WPM</div>
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div
            className="bg-cyan-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(currentEntry / entryCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg">
        <div className="text-sm text-gray-400 mb-2 text-center">Type this code:</div>
        <div className="text-4xl font-mono font-bold text-center tracking-wider text-blue-300 mb-6">
          {entries[currentEntry]}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-2xl font-mono text-center focus:border-blue-500 focus:outline-none"
          placeholder="Type here..."
          autoComplete="off"
          spellCheck={false}
        />

        <div className="text-center mt-4">
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={!input}
            className="px-8"
          >
            Submit (Enter)
          </Button>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="text-green-400">Correct: {score}</div>
        <div className="text-red-400">Errors: {errors}</div>
      </div>
    </div>
  );
};
