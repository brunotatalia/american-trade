
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon, footer }) => {
  return (
    <div className={`bg-gray-800 shadow-lg rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-gray-700 flex items-center space-x-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};
