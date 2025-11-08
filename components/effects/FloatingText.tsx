import React, { useEffect, useState } from 'react';

export interface FloatingTextItem {
  id: string;
  text: string;
  type: 'money-gain' | 'money-loss' | 'reputation-gain' | 'reputation-loss' | 'info';
  x?: number; // Position on screen (percentage)
  y?: number;
}

interface FloatingTextProps {
  items: FloatingTextItem[];
  onRemove: (id: string) => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({ items, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {items.map((item) => (
        <FloatingTextItem key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface FloatingTextItemProps {
  item: FloatingTextItem;
  onRemove: (id: string) => void;
}

const FloatingTextItem: React.FC<FloatingTextItemProps> = ({ item, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-remove after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(item.id), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [item.id, onRemove]);

  const getStyles = () => {
    switch (item.type) {
      case 'money-gain':
        return 'text-green-400 font-bold text-2xl';
      case 'money-loss':
        return 'text-red-400 font-bold text-2xl';
      case 'reputation-gain':
        return 'text-yellow-400 font-bold text-xl';
      case 'reputation-loss':
        return 'text-orange-400 font-bold text-xl';
      case 'info':
        return 'text-blue-400 font-semibold text-lg';
      default:
        return 'text-white font-semibold text-lg';
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case 'money-gain':
        return '💰';
      case 'money-loss':
        return '💸';
      case 'reputation-gain':
        return '⭐';
      case 'reputation-loss':
        return '📉';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  const x = item.x || 50;
  const y = item.y || 50;

  return (
    <div
      className={`absolute transition-all duration-300 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        animation: 'float-up 2s ease-out'
      }}
    >
      <div className={`flex items-center space-x-2 ${getStyles()} drop-shadow-lg`}>
        <span className="text-3xl">{getIcon()}</span>
        <span>{item.text}</span>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-100px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Pulse effect for big money gains
interface MoneyPulseEffectProps {
  trigger: boolean;
  amount: number;
  onComplete?: () => void;
}

export const MoneyPulseEffect: React.FC<MoneyPulseEffectProps> = ({ trigger, amount, onComplete }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 1000);
    }
  }, [trigger, isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-pulse-big text-8xl font-bold text-green-400 drop-shadow-2xl">
        +${amount.toLocaleString()}
      </div>

      <style>{`
        @keyframes pulse-big {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .animate-pulse-big {
          animation: pulse-big 1s ease-out;
        }
      `}</style>
    </div>
  );
};

// Screen flash effect for critical events
interface ScreenFlashProps {
  trigger: boolean;
  color?: 'green' | 'red' | 'yellow' | 'blue';
  onComplete?: () => void;
}

export const ScreenFlash: React.FC<ScreenFlashProps> = ({ trigger, color = 'green', onComplete }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 500);
    }
  }, [trigger, isActive, onComplete]);

  if (!isActive) return null;

  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500'
  };

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-30 ${colorClasses[color]}`}
      style={{
        animation: 'flash 0.5s ease-out'
      }}
    >
      <style>{`
        @keyframes flash {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
