
import React, { CSSProperties } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style = {}, title, icon, footer }) => {
  const cardStyle: CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden',
    ...style,
  };

  const headerStyle: CSSProperties = {
    borderBottom: `1px solid var(--color-border)`,
  };

  const titleStyle: CSSProperties = {
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
  };

  const iconStyle: CSSProperties = {
    color: 'var(--color-text-secondary)',
  };

  const footerStyle: CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    borderTop: `1px solid var(--color-border)`,
  };

  return (
    <div className={className} style={cardStyle}>
      {title && (
        <div className="p-4 flex items-center space-x-2" style={headerStyle}>
          {icon && <span style={iconStyle}>{icon}</span>}
          <h3 className="text-lg font-semibold" style={titleStyle}>{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="p-4" style={footerStyle}>
          {footer}
        </div>
      )}
    </div>
  );
};
