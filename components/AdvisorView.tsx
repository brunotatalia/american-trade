import React, { useState } from 'react';
import { GameState } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinnerIcon } from './icons';
import { generateAdvisorResponse } from '../services/geminiService';

interface AdvisorViewProps {
  gameState: GameState;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({ gameState }) => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const ownedAssets = [
        ...Object.keys(gameState.player.commodities).map(id => gameState.commodities[id]?.name || id),
        ...gameState.player.properties.map(id => gameState.properties[id]?.name || id)
      ];

      const advisorResponse = await generateAdvisorResponse(
        question,
        gameState.player.money,
        gameState.player.reputation,
        gameState.currentEra?.name || 'Unknown Era',
        ownedAssets
      );

      setResponse(advisorResponse);
    } catch (error) {
      setResponse('I apologize, but I\'m having trouble processing your question right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Should I invest in real estate?",
    "What's the best commodity to buy right now?",
    "How can I improve my reputation?",
    "Is it a good time to sell my holdings?"
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-2 text-blue-300">Financial Advisor</h2>
      <p className="text-sm text-gray-400 mb-4">Ask your AI-powered advisor for personalized investment advice.</p>

      <Card className="mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
              Ask a Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Should I invest in tech stocks now?"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              rows={3}
            />
          </div>

          <Button
            onClick={handleAskQuestion}
            disabled={!question.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoadingSpinnerIcon className="mr-2" />
                Consulting Advisor...
              </>
            ) : (
              'Get Advice'
            )}
          </Button>

          {response && (
            <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 border border-blue-600 rounded-md">
              <h3 className="text-sm font-semibold text-blue-300 mb-2">Advisor's Response:</h3>
              <p className="text-sm text-gray-200">{response}</p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Quick Questions" className="mb-4">
        <p className="text-xs text-gray-400 mb-3">Try asking one of these common questions:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickQuestions.map((q, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              onClick={() => setQuestion(q)}
              className="text-left justify-start"
            >
              {q}
            </Button>
          ))}
        </div>
      </Card>

      <Card title="Your Current Situation">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Money</p>
            <p className="font-semibold text-green-400">${gameState.player.money.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400">Reputation</p>
            <p className="font-semibold text-blue-400">{gameState.player.reputation}</p>
          </div>
          <div>
            <p className="text-gray-400">Commodities Owned</p>
            <p className="font-semibold">{Object.keys(gameState.player.commodities).length}</p>
          </div>
          <div>
            <p className="text-gray-400">Properties Owned</p>
            <p className="font-semibold">{gameState.player.properties.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
