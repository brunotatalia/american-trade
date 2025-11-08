import React, { useState } from 'react';
import { GameState } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import * as GameLogic from '../services/gameLogic';

interface CasinoViewProps {
  gameState: GameState;
  onBet: (betAmount: number, winnings: number, gameType: string) => void;
}

export const CasinoView: React.FC<CasinoViewProps> = ({ gameState, onBet }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<{ won: boolean; amount: number; message: string } | null>(null);

  // Coin Flip Game
  const [coinChoice, setCoinChoice] = useState<'heads' | 'tails'>('heads');

  // Dice Roll Game
  const [diceGuess, setDiceGuess] = useState<number>(6);

  // Roulette Game
  const [rouletteChoice, setRouletteChoice] = useState<'red' | 'black' | 'green'>('red');

  // Slots
  const [slotResult, setSlotResult] = useState<string[]>([]);

  const canBet = gameState.player.money >= betAmount && betAmount > 0 && !isPlaying;

  const playCoinFlip = () => {
    if (!canBet) return;
    setIsPlaying(true);
    setResult(null);

    setTimeout(() => {
      const flip = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = flip === coinChoice;
      const winnings = won ? betAmount : -betAmount;

      setResult({
        won,
        amount: Math.abs(winnings),
        message: won ? `🎉 It's ${flip}! You won $${Math.abs(winnings)}!` : `😞 It's ${flip}. You lost $${Math.abs(winnings)}.`
      });

      onBet(betAmount, winnings, 'Coin Flip');
      setIsPlaying(false);
    }, 2000);
  };

  const playDiceRoll = () => {
    if (!canBet) return;
    setIsPlaying(true);
    setResult(null);

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const won = roll === diceGuess;
      const winnings = won ? betAmount * 5 : -betAmount; // 5x payout for exact match

      setResult({
        won,
        amount: Math.abs(winnings),
        message: won ? `🎲 Rolled ${roll}! You won $${Math.abs(winnings)}!` : `🎲 Rolled ${roll}. You lost $${Math.abs(winnings)}.`
      });

      onBet(betAmount, winnings, 'Dice Roll');
      setIsPlaying(false);
    }, 2000);
  };

  const playRoulette = () => {
    if (!canBet) return;
    setIsPlaying(true);
    setResult(null);

    setTimeout(() => {
      const rand = Math.random();
      let result: 'red' | 'black' | 'green';

      if (rand < 0.02) result = 'green'; // 2% chance (house edge)
      else if (rand < 0.51) result = 'red'; // 49% chance
      else result = 'black'; // 49% chance

      const won = result === rouletteChoice;
      const isGreen = result === 'green' && rouletteChoice === 'green';
      const winnings = isGreen ? betAmount * 35 : won ? betAmount : -betAmount;

      setResult({
        won: won || isGreen,
        amount: Math.abs(winnings),
        message: (won || isGreen) ? `🎰 ${result.toUpperCase()}! You won $${Math.abs(winnings)}!` : `🎰 ${result.toUpperCase()}. You lost $${Math.abs(winnings)}.`
      });

      onBet(betAmount, winnings, 'Roulette');
      setIsPlaying(false);
    }, 3000);
  };

  const playSlots = () => {
    if (!canBet) return;
    setIsPlaying(true);
    setResult(null);
    setSlotResult([]);

    const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
    const spinDuration = 2000;

    // Animate spinning
    const interval = setInterval(() => {
      setSlotResult([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);

      // Final result
      const final = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ];

      setSlotResult(final);

      // Check win conditions
      let multiplier = 0;
      if (final[0] === final[1] && final[1] === final[2]) {
        // All three match
        if (final[0] === '💎') multiplier = 50;
        else if (final[0] === '7️⃣') multiplier = 25;
        else if (final[0] === '⭐') multiplier = 10;
        else multiplier = 5;
      } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
        // Two match
        multiplier = 2;
      }

      const won = multiplier > 0;
      const winnings = won ? betAmount * multiplier - betAmount : -betAmount;

      setResult({
        won,
        amount: Math.abs(winnings),
        message: won ? `🎰 ${multiplier}x! You won $${Math.abs(winnings)}!` : `🎰 No match. You lost $${Math.abs(winnings)}.`
      });

      onBet(betAmount, winnings, 'Slots');
      setIsPlaying(false);
    }, spinDuration);
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-yellow-400">🎰 Casino & Gambling</h2>
        <p className="text-sm text-gray-400 mb-4">
          Try your luck! High risk, high reward. Gamble responsibly.
        </p>

        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-300">
            ⚠️ Warning: Gambling is risky! You can lose money quickly. Only bet what you can afford to lose.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Bet Amount:</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              min="1"
              max={gameState.player.money}
            />
            <Button onClick={() => setBetAmount(100)} size="sm">$100</Button>
            <Button onClick={() => setBetAmount(500)} size="sm">$500</Button>
            <Button onClick={() => setBetAmount(1000)} size="sm">$1K</Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Your balance: ${gameState.player.money.toLocaleString()}</p>
        </div>

        {result && (
          <div className={`p-4 rounded-lg mb-4 animate-fadeInScale ${
            result.won ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-red-900/30 border border-red-700 text-red-300'
          }`}>
            <p className="text-lg font-bold">{result.message}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coin Flip */}
        <Card title="🪙 Coin Flip" className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20">
          <p className="text-sm text-gray-400 mb-4">50/50 chance. Win 1x your bet.</p>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setCoinChoice('heads')}
              variant={coinChoice === 'heads' ? 'primary' : 'secondary'}
              fullWidth
            >
              Heads
            </Button>
            <Button
              onClick={() => setCoinChoice('tails')}
              variant={coinChoice === 'tails' ? 'primary' : 'secondary'}
              fullWidth
            >
              Tails
            </Button>
          </div>
          <Button onClick={playCoinFlip} variant="success" fullWidth disabled={!canBet}>
            {isPlaying && selectedGame === 'coin' ? 'Flipping...' : `Flip! ($${betAmount})`}
          </Button>
        </Card>

        {/* Dice Roll */}
        <Card title="🎲 Dice Roll" className="bg-gradient-to-br from-red-900/20 to-pink-900/20">
          <p className="text-sm text-gray-400 mb-4">Guess the exact number. Win 5x your bet!</p>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => setDiceGuess(num)}
                className={`p-3 rounded border-2 font-bold ${
                  diceGuess === num ? 'bg-red-600 border-red-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <Button onClick={playDiceRoll} variant="success" fullWidth disabled={!canBet}>
            {isPlaying && selectedGame === 'dice' ? 'Rolling...' : `Roll! ($${betAmount})`}
          </Button>
        </Card>

        {/* Roulette */}
        <Card title="🎰 Roulette" className="bg-gradient-to-br from-green-900/20 to-teal-900/20">
          <p className="text-sm text-gray-400 mb-4">Red/Black: 1x. Green: 35x!</p>
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setRouletteChoice('red')}
              variant={rouletteChoice === 'red' ? 'danger' : 'secondary'}
              fullWidth
              className={rouletteChoice === 'red' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Red
            </Button>
            <Button
              onClick={() => setRouletteChoice('black')}
              variant={rouletteChoice === 'black' ? 'primary' : 'secondary'}
              fullWidth
              className={rouletteChoice === 'black' ? 'bg-black hover:bg-gray-900' : ''}
            >
              Black
            </Button>
            <Button
              onClick={() => setRouletteChoice('green')}
              variant={rouletteChoice === 'green' ? 'success' : 'secondary'}
              fullWidth
            >
              Green
            </Button>
          </div>
          <Button onClick={playRoulette} variant="success" fullWidth disabled={!canBet}>
            {isPlaying && selectedGame === 'roulette' ? 'Spinning...' : `Spin! ($${betAmount})`}
          </Button>
        </Card>

        {/* Slots */}
        <Card title="🎰 Slot Machine" className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20">
          <p className="text-sm text-gray-400 mb-4">Match symbols! 💎=50x, 7️⃣=25x, ⭐=10x</p>
          <div className="bg-gray-900 rounded-lg p-6 mb-4 flex justify-center items-center gap-4">
            {slotResult.length === 0 ? (
              <>
                <span className="text-5xl">?</span>
                <span className="text-5xl">?</span>
                <span className="text-5xl">?</span>
              </>
            ) : (
              slotResult.map((symbol, i) => (
                <span key={i} className="text-5xl animate-fadeInScale">{symbol}</span>
              ))
            )}
          </div>
          <Button onClick={playSlots} variant="success" fullWidth disabled={!canBet}>
            {isPlaying && selectedGame === 'slots' ? 'Spinning...' : `Spin! ($${betAmount})`}
          </Button>
        </Card>
      </div>
    </div>
  );
};
