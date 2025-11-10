import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animated = true
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gray-700
        ${getVariantClass()}
        ${animated ? 'animate-pulse' : ''}
        ${variant === 'text' ? 'h-4' : ''}
        ${className}
      `}
      style={style}
    />
  );
};

// Preset skeleton components for common use cases
export const CardSkeleton: React.FC = () => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
    <Skeleton width="60%" height={24} />
    <Skeleton width="100%" height={16} />
    <Skeleton width="80%" height={16} />
    <div className="flex gap-2 pt-2">
      <Skeleton width={100} height={32} className="rounded-lg" />
      <Skeleton width={100} height={32} className="rounded-lg" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr className="border-b border-gray-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton width="80%" />
      </td>
    ))}
  </tr>
);

export const ListItemSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-3 border-b border-gray-700">
    <Skeleton variant="circular" width={40} height={40} />
    <div className="flex-1 space-y-2">
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={14} />
    </div>
  </div>
);

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-blue-500 border-t-transparent
        rounded-full
        animate-spin
        ${className}
      `}
    />
  );
};

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      {message && <p className="text-white text-sm">{message}</p>}
    </div>
  </div>
);
