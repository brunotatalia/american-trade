import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface DeliveryRouteProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

interface Location {
  id: number;
  x: number;
  y: number;
  visited: boolean;
}

export const DeliveryRoute: React.FC<DeliveryRouteProps> = ({ difficulty, basePay, onComplete }) => {
  const gridSize = 6;
  const locationCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const totalRounds = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
  const timePerRound = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20;

  const [locations, setLocations] = useState<Location[]>([]);
  const [route, setRoute] = useState<number[]>([]);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [distance, setDistance] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateLocations = (): Location[] => {
    const locs: Location[] = [];
    const used = new Set<string>();

    while (locs.length < locationCount) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      const key = `${x},${y}`;

      if (!used.has(key) && (x !== 0 || y !== 0)) { // Don't place at start
        used.add(key);
        locs.push({ id: locs.length, x, y, visited: false });
      }
    }

    return locs;
  };

  useEffect(() => {
    if (round < totalRounds) {
      setLocations(generateLocations());
      setRoute([]);
      setCurrentPos({ x: 0, y: 0 });
      setDistance(0);
      setFeedback(null);
      setTimeLeft(timePerRound);
    }
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && round < totalRounds && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback) {
      finishRound();
    }
  }, [timeLeft, feedback]);

  const calculateDistance = (from: { x: number; y: number }, to: { x: number; y: number }): number => {
    return Math.abs(to.x - from.x) + Math.abs(to.y - from.y); // Manhattan distance
  };

  const visitLocation = (loc: Location) => {
    if (loc.visited || feedback) return;

    const dist = calculateDistance(currentPos, loc);
    setDistance(distance + dist);
    setCurrentPos({ x: loc.x, y: loc.y });
    setRoute([...route, loc.id]);

    const newLocations = locations.map(l =>
      l.id === loc.id ? { ...l, visited: true } : l
    );
    setLocations(newLocations);

    if (newLocations.every(l => l.visited)) {
      // All locations visited
      const returnDist = calculateDistance(loc, { x: 0, y: 0 });
      setDistance(distance + dist + returnDist);
      setTimeout(() => finishRound(), 500);
    }
  };

  const finishRound = () => {
    const allVisited = locations.every(l => l.visited);
    const optimalDistance = calculateOptimalDistance();
    const efficiency = optimalDistance > 0 ? (optimalDistance / (distance || 1)) : 0;

    if (allVisited && efficiency >= 0.7) { // At least 70% efficient
      setScore(score + 1);
      setFeedback(`✓ Complete! Distance: ${distance} (${(efficiency * 100).toFixed(0)}% efficient)`);
    } else if (allVisited) {
      setFeedback(`⚠ Route too long: ${distance} units`);
    } else {
      setFeedback(`✗ Incomplete! ${locations.filter(l => !l.visited).length} locations missed`);
    }

    setTimeout(() => {
      if (round + 1 < totalRounds) {
        setRound(round + 1);
      } else {
        endGame();
      }
    }, 2000);
  };

  const calculateOptimalDistance = (): number => {
    // Simple greedy approximation of optimal route
    let total = 0;
    let current = { x: 0, y: 0 };
    const remaining = [...locations];

    while (remaining.length > 0) {
      // Find nearest unvisited location
      let nearest = 0;
      let minDist = Infinity;

      remaining.forEach((loc, idx) => {
        const dist = calculateDistance(current, loc);
        if (dist < minDist) {
          minDist = dist;
          nearest = idx;
        }
      });

      total += minDist;
      current = remaining[nearest];
      remaining.splice(nearest, 1);
    }

    total += calculateDistance(current, { x: 0, y: 0 }); // Return to start
    return total;
  };

  const endGame = () => {
    const passingScore = Math.ceil(totalRounds * 0.6);
    const passed = score >= passingScore;
    const scorePercent = (score / totalRounds) * 100;
    const rating = scorePercent >= 85 ? 'excellent' : scorePercent >= 70 ? 'good' : scorePercent >= 50 ? 'average' : 'poor';
    const multiplier = passed ? (rating === 'excellent' ? 1.5 : rating === 'good' ? 1.25 : 1.0) : 0.5;

    onComplete({
      score,
      passed,
      earnings: Math.floor(basePay * multiplier),
      performanceRating: rating
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Round {round + 1} / {totalRounds}
        </div>
        <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-green-400'}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">
          Rounds Won: {score} / {totalRounds} | Distance: {distance} units
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div
            className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(score / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        Visit all locations efficiently! Start and end at warehouse (top-left).
      </div>

      {/* Grid Map */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <div
          className="grid gap-1 mx-auto bg-gray-700 p-2 rounded"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: `${gridSize * 60}px`
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            const isStart = x === 0 && y === 0;
            const isCurrent = currentPos.x === x && currentPos.y === y && !isStart;
            const location = locations.find(l => l.x === x && l.y === y);

            return (
              <button
                key={idx}
                onClick={() => location && visitLocation(location)}
                disabled={!location || location.visited || !!feedback}
                className={`aspect-square rounded border-2 transition-all text-xs font-bold flex items-center justify-center ${
                  isStart
                    ? 'bg-blue-600 border-blue-400'
                    : isCurrent
                    ? 'bg-green-600 border-green-400'
                    : location
                    ? location.visited
                      ? 'bg-gray-600 border-gray-500'
                      : 'bg-orange-500 border-orange-400 hover:bg-orange-600 cursor-pointer'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                {isStart ? '🏢' : isCurrent ? '🚚' : location ? (location.visited ? '✓' : '📍') : ''}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <div>🏢 Warehouse (Start/End) | 🚚 Current Position | 📍 Delivery Location</div>
          <div className="mt-2">Locations Left: {locations.filter(l => !l.visited).length}/{locationCount}</div>
        </div>
      </div>

      {feedback && (
        <div className={`text-center text-lg font-semibold ${
          feedback.includes('✓') ? 'text-green-400' : feedback.includes('⚠') ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {feedback}
        </div>
      )}
    </div>
  );
};
