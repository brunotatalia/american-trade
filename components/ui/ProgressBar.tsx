import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glow?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = 'green',
  size = 'md',
  animated = true,
  glow = false
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  };

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600'
  };

  const glowClasses = glow ? {
    green: 'shadow-lg shadow-green-500/50',
    blue: 'shadow-lg shadow-blue-500/50',
    yellow: 'shadow-lg shadow-yellow-500/50',
    red: 'shadow-lg shadow-red-500/50',
    purple: 'shadow-lg shadow-purple-500/50',
    gradient: 'shadow-lg shadow-purple-500/50'
  }[color] : '';

  return (
    <div className="space-y-1">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-gray-300 font-medium">{label}</span>}
          {showPercentage && <span className="text-gray-400">{clampedProgress.toFixed(0)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} ${glowClasses} rounded-full ${
            animated ? 'transition-all duration-500 ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div
              className="h-full w-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                backgroundSize: '200% 100%'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Circular progress bar for achievements
interface CircularProgressProps {
  progress: number; // 0-100
  size?: number; // diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color = '#10B981',
  backgroundColor = '#374151',
  showPercentage = true,
  children
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (showPercentage && (
          <span className="text-xl font-bold text-white">{clampedProgress.toFixed(0)}%</span>
        ))}
      </div>
    </div>
  );
};

// Skill tree style progress indicator
interface SkillProgressProps {
  current: number;
  max: number;
  label: string;
  icon?: string;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({ current, max, label, icon }) => {
  const progress = (current / max) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center space-x-3 mb-3">
        {icon && <span className="text-3xl">{icon}</span>}
        <div className="flex-1">
          <h4 className="font-bold text-gray-200">{label}</h4>
          <p className="text-sm text-gray-400">{current} / {max}</p>
        </div>
      </div>
      <ProgressBar progress={progress} showPercentage={false} color="gradient" glow animated />
    </div>
  );
};