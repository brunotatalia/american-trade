
import React, { CSSProperties } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {},
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = "font-semibold focus:outline-none transition-all duration-200 ease-in-out inline-flex items-center justify-center";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";

  // Get themed inline styles
  const getVariantStyles = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      borderRadius: 'var(--radius-button)',
      fontFamily: 'var(--font-body)',
    };

    if (disabled) {
      return { ...baseStyle, opacity: 0.5, cursor: 'not-allowed' };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-primary)',
          color: '#ffffff',
          border: 'none',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-secondary)',
          color: '#ffffff',
          border: 'none',
        };
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-accent)',
          color: '#ffffff',
          border: 'none',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: 'var(--color-danger)',
          color: '#ffffff',
          border: 'none',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--color-text)',
          border: `1px solid var(--color-border)`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      style={{ ...getVariantStyles(), ...style }}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 -mr-1 h-5 w-5">{rightIcon}</span>}
    </button>
  );
};
