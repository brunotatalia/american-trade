import React from 'react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

interface QuickActionButton {
  label: string;
  icon?: string;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  tooltip?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickActionButton[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  layout = 'horizontal',
  className = ''
}) => {
  const getLayoutClass = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-2';
      case 'vertical':
        return 'flex flex-col gap-2';
      case 'grid':
        return 'grid grid-cols-2 gap-2';
      default:
        return 'flex gap-2';
    }
  };

  return (
    <div className={`${getLayoutClass()} ${className}`}>
      {actions.map((action, index) => {
        const button = (
          <Button
            key={index}
            variant={action.variant || 'secondary'}
            size="sm"
            onClick={action.action}
            disabled={action.disabled}
            className="flex items-center gap-1"
          >
            {action.icon && <span>{action.icon}</span>}
            {action.label}
          </Button>
        );

        return action.tooltip ? (
          <Tooltip key={index} content={action.tooltip}>
            {button}
          </Tooltip>
        ) : (
          button
        );
      })}
    </div>
  );
};

// Preset quick action sets
export const getTradingQuickActions = (
  onBuyMax: () => void,
  onSellAll: () => void,
  canBuy: boolean,
  canSell: boolean
): QuickActionButton[] => [
  {
    label: 'Buy Max',
    icon: '📈',
    action: onBuyMax,
    variant: 'primary',
    tooltip: 'Buy the maximum amount you can afford',
    disabled: !canBuy
  },
  {
    label: 'Sell All',
    icon: '📉',
    action: onSellAll,
    variant: 'danger',
    tooltip: 'Sell all your holdings of this commodity',
    disabled: !canSell
  }
];

export const getAmountPresets = (
  currentValue: number,
  onSelect: (amount: number) => void
): QuickActionButton[] => {
  const presets = [10, 25, 50, 100];

  return presets.map((amount) => ({
    label: `${amount}`,
    action: () => onSelect(amount),
    variant: 'secondary' as const,
    tooltip: `Set amount to ${amount}`,
    disabled: amount > currentValue
  }));
};

export const getPercentagePresets = (
  totalValue: number,
  onSelect: (amount: number) => void
): QuickActionButton[] => {
  const percentages = [25, 50, 75, 100];

  return percentages.map((pct) => {
    const amount = Math.floor((totalValue * pct) / 100);
    return {
      label: `${pct}%`,
      action: () => onSelect(amount),
      variant: 'secondary' as const,
      tooltip: `${pct}% of your total (${amount} units)`,
      disabled: amount === 0
    };
  });
};
