import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, WarningIcon, InfoIcon, XCircleIcon } from './icons';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastIcon: React.FC<{ type: Toast['type'] }> = ({ type }) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${iconClass} text-green-400`} />;
    case 'error':
      return <XCircleIcon className={`${iconClass} text-red-400`} />;
    case 'warning':
      return <WarningIcon className={`${iconClass} text-yellow-400`} />;
    case 'info':
      return <InfoIcon className={`${iconClass} text-blue-400`} />;
  }
};

const getToastStyles = (type: Toast['type']) => {
  const baseStyles = "border shadow-lg backdrop-blur-sm";
  switch (type) {
    case 'success':
      return `${baseStyles} bg-green-900/90 border-green-700 text-green-100`;
    case 'error':
      return `${baseStyles} bg-red-900/90 border-red-700 text-red-100`;
    case 'warning':
      return `${baseStyles} bg-yellow-900/90 border-yellow-700 text-yellow-100`;
    case 'info':
      return `${baseStyles} bg-blue-900/90 border-blue-700 text-blue-100`;
  }
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 300); // Wait for exit animation
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.duration, onDismiss]);

  return (
    <div
      className={`${getToastStyles(toast.type)} rounded-lg p-4 flex items-center gap-3 transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      style={{ animation: isExiting ? 'none' : 'slideInRight 0.3s ease-out' }}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(onDismiss, 300);
        }}
        className="text-gray-300 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

// Custom CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
