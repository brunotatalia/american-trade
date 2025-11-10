import React, { useEffect, useState } from 'react';
import { LogEntry } from '../../types';

interface ToastProps {
  message: string;
  type: LogEntry['type'];
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600 text-black';
      case 'info':
        return 'bg-blue-500 border-blue-600';
      case 'event':
        return 'bg-purple-500 border-purple-600';
      default:
        return 'bg-gray-700 border-gray-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'event':
        return '★';
      default:
        return '•';
    }
  };

  return (
    <div
      className={`
        ${getTypeStyles()}
        border-l-4 rounded shadow-lg p-4 mb-2 min-w-[300px] max-w-[400px]
        flex items-start gap-3
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        animate-slideInRight
      `}
    >
      <span className="text-xl font-bold flex-shrink-0">{getIcon()}</span>
      <p className="text-sm flex-1 text-white">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }}
        className="text-white hover:text-gray-300 transition-colors flex-shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: LogEntry['type'] }>;
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};
