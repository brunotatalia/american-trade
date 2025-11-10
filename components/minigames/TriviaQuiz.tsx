import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface TriviaQuizProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

const QUESTIONS = {
  easy: [
    {
      question: "What does CEO stand for?",
      options: ["Chief Executive Officer", "Chief Economic Officer", "Central Executive Officer", "Corporate Executive Officer"],
      correctIndex: 0
    },
    {
      question: "What is the primary goal of a business?",
      options: ["To make friends", "To make profit", "To spend money", "To hire people"],
      correctIndex: 1
    },
    {
      question: "What is a stock?",
      options: ["A type of bond", "Ownership share in a company", "A loan", "A savings account"],
      correctIndex: 1
    },
    {
      question: "What does GDP stand for?",
      options: ["Global Development Plan", "Gross Domestic Product", "General Development Protocol", "Government Debt Payment"],
      correctIndex: 1
    },
    {
      question: "What is inflation?",
      options: ["Falling prices", "Rising prices", "Stable prices", "No prices"],
      correctIndex: 1
    },
    {
      question: "What is a dividend?",
      options: ["A tax payment", "A company expense", "Profit paid to shareholders", "A type of stock"],
      correctIndex: 2
    },
  ],
  medium: [
    {
      question: "What is the S&P 500?",
      options: ["A stock price", "An index of 500 large US companies", "A government bond", "A savings account"],
      correctIndex: 1
    },
    {
      question: "What does ROI stand for?",
      options: ["Rate of Income", "Return on Investment", "Revenue of Interest", "Report on Inflation"],
      correctIndex: 1
    },
    {
      question: "What is a bear market?",
      options: ["Rising prices", "Falling prices", "Stable prices", "High volatility"],
      correctIndex: 1
    },
    {
      question: "What is diversification?",
      options: ["Buying one stock", "Spreading investments across different assets", "Selling everything", "Day trading"],
      correctIndex: 1
    },
    {
      question: "What is compound interest?",
      options: ["Simple interest", "Interest on interest", "No interest", "Negative interest"],
      correctIndex: 1
    },
    {
      question: "What does NASDAQ stand for?",
      options: ["National Association of Securities Dealers Automated Quotations", "North American Stock Data and Quotes", "New York Stock Data And Quotes", "National Asset Securities Data"],
      correctIndex: 0
    },
  ],
  hard: [
    {
      question: "What is a derivative?",
      options: ["A type of stock", "A financial instrument derived from an underlying asset", "A savings bond", "A tax form"],
      correctIndex: 1
    },
    {
      question: "What is arbitrage?",
      options: ["Long-term investing", "Profiting from price differences in different markets", "Day trading", "Dividend investing"],
      correctIndex: 1
    },
    {
      question: "What is the Sharpe Ratio?",
      options: ["A tax calculation", "Risk-adjusted return measure", "Stock price indicator", "Interest rate"],
      correctIndex: 1
    },
    {
      question: "What caused the 2008 financial crisis?",
      options: ["Tech bubble", "Subprime mortgages and derivatives", "Oil shortage", "Government default"],
      correctIndex: 1
    },
    {
      question: "What is short selling?",
      options: ["Buying low, selling high", "Borrowing shares to sell, hoping to buy back cheaper", "Holding stocks briefly", "Quick day trades"],
      correctIndex: 1
    },
    {
      question: "What is quantitative easing?",
      options: ["Raising interest rates", "Central bank creating money to buy assets", "Reducing government spending", "Increasing taxes"],
      correctIndex: 1
    },
  ]
};

export const TriviaQuiz: React.FC<TriviaQuizProps> = ({ difficulty, basePay, onComplete }) => {
  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 6 : 7;
  const timePerRound = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 18 : 15;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerRound);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());

  const getRandomQuestion = (): Question => {
    const questionList = QUESTIONS[difficulty];
    const availableQuestions = questionList.filter(q => !usedQuestions.has(q.question));

    if (availableQuestions.length === 0) {
      setUsedQuestions(new Set());
      return questionList[Math.floor(Math.random() * questionList.length)];
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  };

  useEffect(() => {
    if (round < totalRounds && !feedback) {
      const question = getRandomQuestion();
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setTimeLeft(timePerRound);
    }
  }, [round, feedback]);

  useEffect(() => {
    if (timeLeft > 0 && round < totalRounds && !feedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !feedback && selectedAnswer === null) {
      handleSubmit(true); // Auto-submit on timeout
    }
  }, [timeLeft, feedback]);

  const handleSubmit = (timedOut: boolean = false) => {
    if (!currentQuestion) return;

    const answerIndex = timedOut ? -1 : selectedAnswer;
    const isCorrect = answerIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      const timeBonus = Math.floor((timeLeft / timePerRound) * 100);
      const roundScore = 150 + timeBonus;
      setScore(score + roundScore);
      setFeedback(`✅ Correct! +${roundScore} points`);
      setUsedQuestions(prev => new Set([...prev, currentQuestion.question]));
    } else {
      const correctAnswer = currentQuestion.options[currentQuestion.correctIndex];
      setFeedback(timedOut ? `⏰ Time's up! Correct answer: ${correctAnswer}` : `❌ Wrong! Correct answer: ${correctAnswer}`);
    }

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
    const maxScore = totalRounds * 250;
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
          Question {round + 1} / {totalRounds}
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

      {currentQuestion && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg p-6 border border-blue-700/30">
            <p className="text-lg font-medium text-white">{currentQuestion.question}</p>
          </div>

          {!feedback ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === index
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-600'
                  }`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}

              <Button
                onClick={() => handleSubmit()}
                variant="primary"
                fullWidth
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </Button>
            </div>
          ) : (
            <div className={`text-center p-6 rounded-lg ${
              feedback.includes('✅') ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-red-900/30 border border-red-700 text-red-300'
            } animate-fadeInScale`}>
              <p className="text-xl font-bold mb-2">{feedback}</p>
              {currentQuestion.explanation && (
                <p className="text-sm text-gray-400 mt-2">{currentQuestion.explanation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
