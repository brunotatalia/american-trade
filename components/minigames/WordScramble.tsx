import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface WordScrambleProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

const WORD_LISTS = {
  easy: [
    { word: 'PROFIT', hint: 'Money earned from business' },
    { word: 'STOCK', hint: 'Share of company ownership' },
    { word: 'TRADE', hint: 'Buying and selling' },
    { word: 'MONEY', hint: 'Medium of exchange' },
    { word: 'SALES', hint: 'Revenue from selling' },
    { word: 'MARKET', hint: 'Place for trading' },
    { word: 'INVEST', hint: 'Put money to work' },
    { word: 'ASSET', hint: 'Valuable possession' },
  ],
  medium: [
    { word: 'REVENUE', hint: 'Total income' },
    { word: 'DIVIDEND', hint: 'Profit distribution to shareholders' },
    { word: 'CAPITAL', hint: 'Financial resources' },
    { word: 'LEVERAGE', hint: 'Using borrowed money' },
    { word: 'PORTFOLIO', hint: 'Collection of investments' },
    { word: 'INTEREST', hint: 'Cost of borrowing money' },
    { word: 'INFLATION', hint: 'Rising prices over time' },
  ],
  hard: [
    { word: 'ARBITRAGE', hint: 'Profit from price differences' },
    { word: 'DEPRECIATION', hint: 'Asset value decline' },
    { word: 'LIQUIDATION', hint: 'Converting assets to cash' },
    { word: 'AMORTIZATION', hint: 'Spreading costs over time' },
    { word: 'COLLATERAL', hint: 'Security for a loan' },
    { word: 'DIVERSIFICATION', hint: 'Spreading risk across investments' },
  ]
};

export const WordScramble: React.FC<WordScrambleProps> = ({ difficulty, basePay, onComplete }) => {
  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
  const timePerRound = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [currentWord, setCurrentWord] = useState<{ word: string; hint: string } | null>(null);
  const [scrambled, setScrambled] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const getRandomWord = () => {
    const wordList = WORD_LISTS[difficulty];
    const availableWords = wordList.filter(w => !usedWords.has(w.word));

    if (availableWords.length === 0) {
      setUsedWords(new Set());
      return wordList[Math.floor(Math.random() * wordList.length)];
    }

    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };

  useEffect(() => {
    if (round < totalRounds && !feedback) {
      const word = getRandomWord();
      setCurrentWord(word);
      setScrambled(scrambleWord(word.word));
      setUserAnswer('');
      setTimeLeft(timePerRound);
    }
  }, [round, feedback]);

  useEffect(() => {
    if (timeLeft > 0 && round < totalRounds && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback) {
      handleSubmit(true); // Auto-submit on timeout
    }
  }, [timeLeft, feedback]);

  const handleSubmit = (timedOut: boolean = false) => {
    if (!currentWord) return;

    const isCorrect = userAnswer.toUpperCase().trim() === currentWord.word;

    if (isCorrect) {
      const timeBonus = Math.floor((timeLeft / timePerRound) * 50);
      const roundScore = 100 + timeBonus;
      setScore(score + roundScore);
      setFeedback(`✅ Correct! +${roundScore} points`);
      setUsedWords(prev => new Set([...prev, currentWord.word]));
    } else {
      setFeedback(timedOut ? `⏰ Time's up! The word was: ${currentWord.word}` : `❌ Wrong! The word was: ${currentWord.word}`);
    }

    setTimeout(() => {
      setFeedback(null);
      if (round + 1 >= totalRounds) {
        finishGame();
      } else {
        setRound(round + 1);
      }
    }, 2000);
  };

  const finishGame = () => {
    const maxScore = totalRounds * 150;
    const percentage = (score / maxScore) * 100;
    const passed = percentage >= 60;

    let performanceRating: MiniGameResult['performanceRating'];
    if (percentage >= 90) performanceRating = 'excellent';
    else if (percentage >= 75) performanceRating = 'good';
    else if (percentage >= 60) performanceRating = 'average';
    else performanceRating = 'poor';

    const earnings = passed ? Math.floor(basePay * (percentage / 100)) : Math.floor(basePay * 0.5);

    onComplete({
      score,
      passed,
      earnings,
      performanceRating
    });
  };

  if (round >= totalRounds) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Round {round + 1} / {totalRounds}
        </div>
        <div className="flex gap-4">
          <div className="text-sm">
            Score: <span className="font-bold text-green-400">{score}</span>
          </div>
          <div className={`text-sm ${timeLeft <= 5 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      {currentWord && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-xs text-gray-400 mb-2">💡 Hint:</p>
            <p className="text-sm text-blue-300 mb-4">{currentWord.hint}</p>
            <p className="text-xs text-gray-500 mb-2">Unscramble this word:</p>
            <div className="text-4xl font-bold tracking-widest text-yellow-400">
              {scrambled}
            </div>
          </div>

          {!feedback ? (
            <div className="space-y-3">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-xl uppercase tracking-wider focus:outline-none focus:border-blue-500"
                autoFocus
                maxLength={currentWord.word.length}
              />
              <Button onClick={() => handleSubmit()} variant="primary" fullWidth>
                Submit Answer
              </Button>
            </div>
          ) : (
            <div className={`text-center p-4 rounded-lg ${
              feedback.includes('✅') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
            } animate-fadeInScale`}>
              <p className="text-lg font-bold">{feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
