import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface NegotiationProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

interface Scenario {
  situation: string;
  clientMood: 'neutral' | 'happy' | 'angry' | 'suspicious';
  options: {
    text: string;
    points: number;
    response: string;
  }[];
}

const SCENARIOS: Record<string, Scenario[]> = {
  easy: [
    {
      situation: "A client wants a 20% discount on a large order.",
      clientMood: 'neutral',
      options: [
        { text: "I can offer 5% for this volume.", points: 80, response: "Fair enough, let's proceed." },
        { text: "No discounts, sorry.", points: 30, response: "That's disappointing..." },
        { text: "I'll give you 20%!", points: 40, response: "Great! But you lost profit." },
        { text: "How about 10% plus free shipping?", points: 100, response: "Perfect! That works for us." }
      ]
    },
    {
      situation: "Your supplier increased prices by 15%. A client complains about your new rates.",
      clientMood: 'angry',
      options: [
        { text: "Take it or leave it.", points: 20, response: "We'll find another supplier!" },
        { text: "I understand. Our costs increased, but I'll absorb some of it.", points: 90, response: "I appreciate that." },
        { text: "Everyone's prices are going up.", points: 50, response: "I guess..." },
        { text: "Let me match your old price this time.", points: 60, response: "Okay, but this isn't sustainable." }
      ]
    },
  ],
  medium: [
    {
      situation: "A potential investor questions your business model.",
      clientMood: 'suspicious',
      options: [
        { text: "Our numbers speak for themselves.", points: 60, response: "Show me the data." },
        { text: "Trust me, it works!", points: 30, response: "I need more than trust." },
        { text: "Let me walk you through our 5-year projections and market analysis.", points: 100, response: "Now we're talking!" },
        { text: "We're doing fine without investors.", points: 20, response: "Then why am I here?" }
      ]
    },
    {
      situation: "A competitor is poaching your clients with lower prices.",
      clientMood: 'neutral',
      options: [
        { text: "We can match their price.", points: 50, response: "Okay, but what's special about you?" },
        { text: "They can't match our quality and service.", points: 80, response: "Tell me more..." },
        { text: "Fine, go to them then.", points: 20, response: "Goodbye." },
        { text: "I'll beat their price AND add premium support.", points: 90, response: "Now that's an offer!" }
      ]
    },
  ],
  hard: [
    {
      situation: "A major client threatens to leave unless you give them exclusive rights.",
      clientMood: 'angry',
      options: [
        { text: "We don't do exclusive deals.", points: 40, response: "Then we're done." },
        { text: "Exclusive rights for 2x the current contract value.", points: 85, response: "That's steep... but fair." },
        { text: "How about priority service instead?", points: 70, response: "Not good enough." },
        { text: "Limited exclusivity in your region for 50% premium.", points: 95, response: "Smart compromise. Deal." }
      ]
    },
    {
      situation: "You're negotiating a merger. The other CEO wants control.",
      clientMood: 'suspicious',
      options: [
        { text: "I keep control or no deal.", points: 30, response: "Then no deal." },
        { text: "50-50 partnership with rotating CEO role.", points: 90, response: "Interesting approach..." },
        { text: "You can be CEO, I'll be chairman.", points: 85, response: "Let's discuss terms." },
        { text: "Whatever you want!", points: 20, response: "You're too eager. Something's wrong." }
      ]
    },
  ]
};

export const Negotiation: React.FC<NegotiationProps> = ({ difficulty, basePay, onComplete }) => {
  const totalRounds = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6;
  const timePerRound = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 25 : 20;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ response: string; points: number } | null>(null);
  const [usedScenarios, setUsedScenarios] = useState<Set<string>>(new Set());

  const getRandomScenario = (): Scenario => {
    const scenarios = SCENARIOS[difficulty];
    const available = scenarios.filter(s => !usedScenarios.has(s.situation));

    if (available.length === 0) {
      setUsedScenarios(new Set());
      return scenarios[Math.floor(Math.random() * scenarios.length)];
    }

    return available[Math.floor(Math.random() * available.length)];
  };

  useEffect(() => {
    if (round < totalRounds && !feedback) {
      const scenario = getRandomScenario();
      setCurrentScenario(scenario);
      setSelectedOption(null);
      setTimeLeft(timePerRound);
    }
  }, [round, feedback]);

  useEffect(() => {
    if (timeLeft > 0 && round < totalRounds && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback && selectedOption === null) {
      handleChooseOption(0); // Auto-select first option on timeout
    }
  }, [timeLeft, feedback]);

  const handleChooseOption = (index: number) => {
    if (!currentScenario || feedback) return;

    const option = currentScenario.options[index];
    const timeBonus = Math.floor((timeLeft / timePerRound) * 20);
    const totalPoints = option.points + timeBonus;

    setScore(score + totalPoints);
    setFeedback({ response: option.response, points: totalPoints });
    setUsedScenarios(prev => new Set([...prev, currentScenario.situation]));

    setTimeout(() => {
      setFeedback(null);
      if (round + 1 >= totalRounds) {
        finishGame();
      } else {
        setRound(round + 1);
      }
    }, 3000);
  };

  const finishGame = () => {
    const maxScore = totalRounds * 120;
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

  const getMoodColor = (mood: Scenario['clientMood']) => {
    switch (mood) {
      case 'happy': return 'text-green-400';
      case 'angry': return 'text-red-400';
      case 'suspicious': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getMoodEmoji = (mood: Scenario['clientMood']) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'angry': return '😠';
      case 'suspicious': return '🤨';
      default: return '😐';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Negotiation {round + 1} / {totalRounds}
        </div>
        <div className="flex gap-4">
          <div className="text-sm">
            Score: <span className="font-bold text-green-400">{score}</span>
          </div>
          <div className={`text-sm ${timeLeft <= 5 ? 'text-red-400 font-bold animate-pulse' : 'text-gray-400'}`}>
            ⏱️ {timeLeft}s
          </div>
        </div>
      </div>

      {currentScenario && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg p-6 border border-purple-700/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{getMoodEmoji(currentScenario.clientMood)}</span>
              <span className={`text-sm font-semibold ${getMoodColor(currentScenario.clientMood)}`}>
                Client is {currentScenario.clientMood}
              </span>
            </div>
            <p className="text-lg text-white">{currentScenario.situation}</p>
            <p className="text-sm text-gray-400 mt-2">Choose your response wisely...</p>
          </div>

          {!feedback ? (
            <div className="space-y-3">
              {currentScenario.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleChooseOption(index)}
                  className="w-full p-4 rounded-lg bg-gray-800 border-2 border-gray-700 text-left hover:border-purple-600 hover:bg-gray-750 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400 font-bold text-lg">{index + 1}.</span>
                    <span className="text-gray-300">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={`p-6 rounded-lg border ${
              feedback.points >= 80
                ? 'bg-green-900/30 border-green-700 text-green-300'
                : feedback.points >= 50
                ? 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
                : 'bg-red-900/30 border-red-700 text-red-300'
            } animate-fadeInScale`}>
              <p className="text-lg font-bold mb-2">💬 "{feedback.response}"</p>
              <p className="text-sm">
                Points earned: <span className="font-bold">+{feedback.points}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
