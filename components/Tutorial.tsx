import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

export interface TutorialStep {
  id: string;
  title: string;
  content: string | React.ReactNode;
  target?: string; // CSS selector for highlighting element
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

interface TutorialProps {
  steps: TutorialStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (!isActive || !step?.target) {
      setHighlightRect(null);
      return;
    }

    const element = document.querySelector(step.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);
    }
  }, [currentStep, isActive, step]);

  const handleNext = () => {
    if (step.action) {
      step.action();
    }

    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive) return null;

  const getTooltipPosition = (): React.CSSProperties => {
    if (!highlightRect || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }

    const tooltipStyle: React.CSSProperties = {};
    const padding = 20;

    switch (step.position) {
      case 'top':
        tooltipStyle.bottom = `${window.innerHeight - highlightRect.top + padding}px`;
        tooltipStyle.left = `${highlightRect.left + highlightRect.width / 2}px`;
        tooltipStyle.transform = 'translateX(-50%)';
        break;
      case 'bottom':
        tooltipStyle.top = `${highlightRect.bottom + padding}px`;
        tooltipStyle.left = `${highlightRect.left + highlightRect.width / 2}px`;
        tooltipStyle.transform = 'translateX(-50%)';
        break;
      case 'left':
        tooltipStyle.right = `${window.innerWidth - highlightRect.left + padding}px`;
        tooltipStyle.top = `${highlightRect.top + highlightRect.height / 2}px`;
        tooltipStyle.transform = 'translateY(-50%)';
        break;
      case 'right':
        tooltipStyle.left = `${highlightRect.right + padding}px`;
        tooltipStyle.top = `${highlightRect.top + highlightRect.height / 2}px`;
        tooltipStyle.transform = 'translateY(-50%)';
        break;
      default:
        tooltipStyle.top = '50%';
        tooltipStyle.left = '50%';
        tooltipStyle.transform = 'translate(-50%, -50%)';
    }

    return tooltipStyle;
  };

  return (
    <>
      {/* Overlay with spotlight */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-75 animate-fadeIn" />

        {/* Spotlight on target element */}
        {highlightRect && (
          <div
            className="absolute border-4 border-blue-500 rounded-lg shadow-2xl animate-pulse"
            style={{
              top: highlightRect.top - 4,
              left: highlightRect.left - 4,
              width: highlightRect.width + 8,
              height: highlightRect.height + 8,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
            }}
          />
        )}
      </div>

      {/* Tutorial tooltip */}
      <div
        className="fixed z-50 pointer-events-auto animate-scaleIn"
        style={getTooltipPosition()}
      >
        <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md border border-blue-500">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <button
                onClick={onSkip}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Skip Tutorial
              </button>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    index === currentStep
                      ? 'bg-blue-500'
                      : index < currentStep
                      ? 'bg-blue-700'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="text-gray-300 text-sm leading-relaxed">
              {step.content}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-850 rounded-b-lg flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="secondary" size="sm" onClick={handlePrevious}>
                  Back
                </Button>
              )}
              <Button variant="primary" size="sm" onClick={handleNext}>
                {isLastStep ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Tutorial step builder helper
export const createTutorialSteps = (gameMode: 'beginner' | 'advanced'): TutorialStep[] => {
  const beginnerSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to American Dream Trader!',
      content: (
        <div className="space-y-2">
          <p>Welcome! You're about to embark on a journey through American economic history.</p>
          <p>This tutorial will teach you the basics of trading, investing, and building wealth.</p>
        </div>
      ),
      position: 'center'
    },
    {
      id: 'dashboard',
      title: 'Your Dashboard',
      content: 'This dashboard shows your key stats: Net Worth, Cash, Profit/Loss, and Holdings. Keep an eye on these as you play!',
      position: 'bottom'
    },
    {
      id: 'market',
      title: 'The Market',
      content: 'Here you can buy and sell commodities. Prices change every turn, so watch for good deals!',
      position: 'right'
    },
    {
      id: 'real-estate',
      title: 'Real Estate',
      content: 'Properties generate passive income every turn. They\'re a great way to build steady wealth!',
      position: 'right'
    },
    {
      id: 'skills',
      title: 'Skills',
      content: 'Unlock skills to boost your trading abilities, reduce fees, and increase earnings!',
      position: 'right'
    },
    {
      id: 'achievements',
      title: 'Achievements',
      content: 'Complete achievements to earn rewards and track your progress!',
      position: 'right'
    },
    {
      id: 'ready',
      title: 'You\'re Ready!',
      content: (
        <div className="space-y-2">
          <p>You now know the basics! Remember:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Buy low, sell high</li>
            <li>Diversify your investments</li>
            <li>Unlock skills to improve your performance</li>
            <li>Watch for special events</li>
          </ul>
          <p className="mt-3 font-semibold">Press <kbd className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-xs">?</kbd> anytime to see keyboard shortcuts!</p>
        </div>
      ),
      position: 'center'
    }
  ];

  return beginnerSteps;
};
