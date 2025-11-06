import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface CargoLoadProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

interface CargoItem {
  id: number;
  width: number;
  height: number;
  color: string;
}

export const CargoLoad: React.FC<CargoLoadProps> = ({ difficulty, basePay, onComplete }) => {
  const gridWidth = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
  const gridHeight = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const totalRounds = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
  const timePerRound = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20;

  const [grid, setGrid] = useState<number[][]>(Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0)));
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [selectedCargo, setSelectedCargo] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [feedback, setFeedback] = useState<string | null>(null);

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const generateCargo = (): CargoItem[] => {
    const itemCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const items: CargoItem[] = [];

    for (let i = 0; i < itemCount; i++) {
      const maxSize = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 3;
      items.push({
        id: i + 1,
        width: Math.floor(Math.random() * maxSize) + 1,
        height: Math.floor(Math.random() * maxSize) + 1,
        color: colors[i % colors.length]
      });
    }

    return items;
  };

  useEffect(() => {
    if (round < totalRounds) {
      setGrid(Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0)));
      setCargoItems(generateCargo());
      setSelectedCargo(null);
      setFeedback(null);
      setTimeLeft(timePerRound);
    }
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && round < totalRounds && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback) {
      checkCompletion();
    }
  }, [timeLeft, feedback]);

  const canPlaceCargo = (row: number, col: number, cargo: CargoItem): boolean => {
    if (row + cargo.height > gridHeight || col + cargo.width > gridWidth) return false;

    for (let r = row; r < row + cargo.height; r++) {
      for (let c = col; c < col + cargo.width; c++) {
        if (grid[r][c] !== 0) return false;
      }
    }
    return true;
  };

  const placeCargo = (row: number, col: number) => {
    if (selectedCargo === null) return;

    const cargo = cargoItems.find(c => c.id === selectedCargo);
    if (!cargo) return;

    if (canPlaceCargo(row, col, cargo)) {
      const newGrid = grid.map(r => [...r]);
      for (let r = row; r < row + cargo.height; r++) {
        for (let c = col; c < col + cargo.width; c++) {
          newGrid[r][c] = cargo.id;
        }
      }

      setGrid(newGrid);
      setCargoItems(cargoItems.filter(c => c.id !== selectedCargo));
      setSelectedCargo(null);

      if (cargoItems.length === 1) { // This was the last item
        setTimeout(checkCompletion, 500);
      }
    }
  };

  const checkCompletion = () => {
    const efficiency = calculateEfficiency();
    const passed = cargoItems.length === 0;

    if (passed) {
      setScore(score + 1);
      setFeedback(`✓ Completed! Efficiency: ${efficiency}%`);
    } else {
      setFeedback(`✗ Time's up! ${cargoItems.length} items left`);
    }

    setTimeout(() => {
      if (round + 1 < totalRounds) {
        setRound(round + 1);
      } else {
        endGame();
      }
    }, 2000);
  };

  const calculateEfficiency = (): number => {
    const usedCells = grid.flat().filter(c => c !== 0).length;
    const totalCells = gridWidth * gridHeight;
    return Math.round((usedCells / totalCells) * 100);
  };

  const endGame = () => {
    const passingScore = Math.ceil(totalRounds * 0.6);
    const passed = score >= passingScore;
    const scorePercent = (score / totalRounds) * 100;
    const rating = scorePercent >= 90 ? 'excellent' : scorePercent >= 70 ? 'good' : scorePercent >= 50 ? 'average' : 'poor';
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
          Rounds Won: {score} / {totalRounds} | Efficiency: {calculateEfficiency()}%
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(score / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center text-sm text-gray-400">
        Click cargo, then click grid to place. Fill the truck efficiently!
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="text-sm font-semibold mb-2">Available Cargo ({cargoItems.length})</div>
          <div className="grid grid-cols-2 gap-2">
            {cargoItems.map(cargo => (
              <div
                key={cargo.id}
                onClick={() => setSelectedCargo(cargo.id)}
                className={`p-2 rounded cursor-pointer border-2 ${
                  selectedCargo === cargo.id ? 'border-yellow-400' : 'border-gray-600'
                } hover:border-yellow-300 transition-colors`}
              >
                <div className={`${cargo.color} rounded mx-auto`} style={{
                  width: `${cargo.width * 20}px`,
                  height: `${cargo.height * 20}px`
                }} />
                <div className="text-xs text-center mt-1">{cargo.width}x{cargo.height}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-sm font-semibold mb-2">Truck Bed</div>
          <div className="border-2 border-gray-600 rounded-lg p-2 bg-gray-800">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridWidth}, 1fr)` }}>
              {grid.map((row, rowIdx) =>
                row.map((cell, colIdx) => {
                  const cargo = cargoItems.find(c => c.id === cell) || { id: cell, color: 'bg-gray-700' };
                  return (
                    <button
                      key={`${rowIdx}-${colIdx}`}
                      onClick={() => placeCargo(rowIdx, colIdx)}
                      className={`aspect-square ${cell === 0 ? 'bg-gray-700 hover:bg-gray-600' : cargo.color} rounded border border-gray-600 transition-colors`}
                      disabled={feedback !== null}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`text-center text-lg font-semibold ${feedback.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};
