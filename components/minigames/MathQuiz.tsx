import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MiniGameResult } from '../../types';

interface MathQuizProps {
  difficulty: 'easy' | 'medium' | 'hard';
  basePay: number;
  onComplete: (result: MiniGameResult) => void;
}

interface Question {
  question: string;
  answer: number;
  options: number[];
}

export const MathQuiz: React.FC<MathQuizProps> = ({ difficulty, basePay, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const questionCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;
  const passingScore = Math.ceil(questionCount * 0.7); // 70% to pass

  const generateQuestion = (): Question => {
    let num1, num2, operator, answer;

    if (difficulty === 'easy') {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      operator = Math.random() > 0.5 ? '+' : '-';
      answer = operator === '+' ? num1 + num2 : Math.abs(num1 - num2);
    } else if (difficulty === 'medium') {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      const ops = ['+', '-', '*'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      answer = operator === '+' ? num1 + num2 : operator === '-' ? Math.abs(num1 - num2) : num1 * num2;
    } else {
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 15) + 2;
      const ops = ['+', '-', '*', '/'];
      operator = ops[Math.floor(Math.random() * ops.length)];
      if (operator === '/') {
        num1 = num1 * num2; // ensure clean division
        answer = num1 / num2;
      } else {
        answer = operator === '+' ? num1 + num2 : operator === '-' ? Math.abs(num1 - num2) : num1 * num2;
      }
    }

    const question = `${num1} ${operator} ${num2}`;
    const wrongOptions = Array.from({ length: 3 }, () => {
      const offset = Math.floor(Math.random() * 20) - 10;
      return Math.max(0, answer + offset);
    }).filter(opt => opt !== answer);

    const options = [answer, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);

    return { question, answer, options };
  };

  useEffect(() => {
    const qs = Array.from({ length: questionCount }, generateQuestion);
    setQuestions(qs);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && currentQuestion < questionCount) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, currentQuestion]);

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].answer;
    setFeedback(correct ? 'correct' : 'wrong');

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questionCount) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setFeedback(null);
        setTimeLeft(30);
      } else {
        endGame();
      }
    }, 1000);
  };

  const endGame = () => {
    const passed = score >= passingScore;
    const scorePercent = (score / questionCount) * 100;
    const rating = scorePercent >= 90 ? 'excellent' : scorePercent >= 75 ? 'good' : scorePercent >= 60 ? 'average' : 'poor';
    const multiplier = passed ? (rating === 'excellent' ? 1.5 : rating === 'good' ? 1.25 : 1.0) : 0.5;

    onComplete({
      score,
      passed,
      earnings: Math.floor(basePay * multiplier),
      performanceRating: rating
    });
  };

  if (questions.length === 0) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Question {currentQuestion + 1} / {questionCount}
        </div>
        <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-green-400'}`}>
          {timeLeft}s
        </div>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Score: {score} / {questionCount}</div>
        <div className="w-full bg-gray-600 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(score / questionCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <div className="text-4xl font-bold mb-6 text-blue-300">
          {questions[currentQuestion].question} = ?
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {questions[currentQuestion].options.map((option, idx) => (
          <Button
            key={idx}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            variant={
              selectedAnswer === option
                ? feedback === 'correct'
                  ? 'primary'
                  : 'secondary'
                : 'secondary'
            }
            className={`text-2xl py-6 ${
              selectedAnswer === option && feedback === 'correct' ? 'bg-green-600' : ''
            } ${
              selectedAnswer === option && feedback === 'wrong' ? 'bg-red-600' : ''
            } ${
              selectedAnswer !== null && option === questions[currentQuestion].answer ? 'ring-2 ring-green-400' : ''
            }`}
          >
            {option}
          </Button>
        ))}
      </div>

      {feedback && (
        <div className={`text-center text-lg font-semibold ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
          {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
        </div>
      )}
    </div>
  );
};
