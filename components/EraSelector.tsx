
import React, { CSSProperties } from 'react';
import { Era } from '../types';
import { ERAS_DATA } from '../constants';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ERA_THEMES, getThemeForEra } from '../themes/eraThemes';

interface EraSelectorProps {
  onSelectEra: (era: Era) => void;
}

/**
 * EraCard - Shows a themed preview of what the era will look like
 */
const EraCard: React.FC<{ era: Era; onSelect: () => void }> = ({ era, onSelect }) => {
  const theme = getThemeForEra(era.id);

  const cardStyle: CSSProperties = {
    backgroundColor: theme.colors.surface,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.styles.cardRadius,
    boxShadow: theme.styles.shadowLg,
    padding: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const titleStyle: CSSProperties = {
    color: theme.colors.primary,
    fontFamily: theme.fonts.display,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const descriptionStyle: CSSProperties = {
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
    fontSize: '0.875rem',
    marginBottom: '1rem',
  };

  const detailStyle: CSSProperties = {
    color: theme.colors.textSecondary,
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  };

  const labelStyle: CSSProperties = {
    color: theme.colors.accent,
    fontWeight: 600,
  };

  const previewBadgeStyle: CSSProperties = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: theme.styles.buttonRadius,
    backgroundColor: theme.colors.accent,
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  };

  const buttonStyle: CSSProperties = {
    width: '100%',
    marginTop: '1rem',
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    borderRadius: theme.styles.buttonRadius,
    padding: '0.75rem',
    fontWeight: 'bold',
    fontFamily: theme.fonts.body,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div
      style={cardStyle}
      className="hover:scale-[1.02] transition-transform"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 24px ${theme.colors.primary}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.styles.shadowLg;
      }}
    >
      <div style={previewBadgeStyle}>{theme.displayName}</div>
      <h3 style={titleStyle}>{era.name}</h3>
      <p style={descriptionStyle}>{era.description}</p>

      <div className="space-y-1">
        <p style={detailStyle}>
          <span style={labelStyle}>Starting Capital:</span> ${era.startingMoney.toLocaleString()}
        </p>
        <p style={detailStyle}>
          <span style={labelStyle}>Market Volatility:</span> {era.marketVolatilityModifier}x
        </p>
        <p style={detailStyle}>
          <span style={labelStyle}>Theme:</span> {theme.name}
        </p>
      </div>

      <button
        onClick={onSelect}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.primary;
        }}
      >
        Start in {era.name}
      </button>
    </div>
  );
};

export const EraSelector: React.FC<EraSelectorProps> = ({ onSelectEra }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
          American Dream Trader
        </h1>
        <p className="text-xl text-gray-300">Embark on your journey to build an empire.</p>
        <p className="text-sm text-gray-400 mt-2">Each era has its own unique visual theme and economic conditions</p>
      </div>

      <div className="w-full max-w-5xl mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">Choose Your Starting Era</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {ERAS_DATA.map((era) => (
            <EraCard key={era.id} era={era} onSelect={() => onSelectEra(era)} />
          ))}
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>&copy; {new Date().getFullYear()} ADT Simulations. All rights reserved.</p>
        <p className="text-gray-600 mt-1">Inspired by classics, powered by your decisions.</p>
      </footer>
    </div>
  );
};
