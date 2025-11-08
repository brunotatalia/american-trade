import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) clearTimeout(showTimeout);
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent';
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 ${getPositionClasses()}
            px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg
            max-w-xs whitespace-normal
            animate-fadeIn
            pointer-events-none
          `}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
          />
        </div>
      )}
    </div>
  );
};

// Helper component for info icon with tooltip
export const InfoTooltip: React.FC<{ content: string | React.ReactNode }> = ({ content }) => {
  return (
    <Tooltip content={content}>
      <span className="inline-flex items-center justify-center w-4 h-4 text-xs bg-blue-500 text-white rounded-full cursor-help ml-1">
        ?
      </span>
    </Tooltip>
  );
};
