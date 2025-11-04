import React, { createContext, useContext, useEffect, useState } from 'react';
import { EraTheme, getThemeForEra, themeToCSS, MODERN_THEME } from '../themes/eraThemes';

interface ThemeContextType {
  theme: EraTheme;
  setTheme: (eraId: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialEraId?: string | null;
}

/**
 * ThemeProvider - Manages era-based theming for the entire app
 */
export function ThemeProvider({ children, initialEraId = null }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<EraTheme>(() => getThemeForEra(initialEraId));

  const setTheme = (eraId: string | null) => {
    const newTheme = getThemeForEra(eraId);
    setThemeState(newTheme);
  };

  // Apply theme CSS variables to document root
  useEffect(() => {
    const root = document.documentElement;
    const cssVars = themeToCSS(theme);

    // Apply each CSS variable
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply font families to body
    document.body.style.fontFamily = theme.fonts.body;

    // Add transition for smooth theme changes
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

    return () => {
      // Cleanup transitions on unmount
      document.body.style.transition = '';
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme hook - Access theme in any component
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get inline styles for themed elements
 */
export function useThemedStyles() {
  const { theme } = useTheme();

  return {
    background: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    surface: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: '#ffffff',
    },
    accent: {
      backgroundColor: theme.colors.accent,
      color: '#ffffff',
    },
  };
}
