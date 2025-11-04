/**
 * Era-based Theme System
 * Defines distinct visual identities for each era
 */

export interface EraTheme {
  id: string;
  eraId: string;
  name: string;
  displayName: string;
  colors: {
    // Primary brand colors
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;
    accentHover: string;

    // Backgrounds
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;

    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;

    // Semantic colors
    success: string;
    successBg: string;
    danger: string;
    dangerBg: string;
    warning: string;
    info: string;
  };
  fonts: {
    body: string;
    display: string;
    mono: string;
  };
  styles: {
    buttonRadius: string;
    cardRadius: string;
    shadow: string;
    shadowLg: string;
  };
}

/**
 * 1950s Post-War Boom Theme
 * Aesthetic: Bright, optimistic, retro
 * Colors: Creamy off-white backgrounds, muted teal and red accents
 * Vibe: Friendly, rounded, classic Americana
 */
export const POST_WAR_THEME: EraTheme = {
  id: 'post_war_theme',
  eraId: 'POST_WAR_BOOM',
  name: '1950s Classic',
  displayName: 'Post-War Boom',
  colors: {
    // Warm, friendly primary colors
    primary: 'rgb(45, 106, 106)',      // Muted teal
    primaryHover: 'rgb(35, 86, 86)',
    secondary: 'rgb(156, 76, 76)',     // Muted red
    secondaryHover: 'rgb(136, 56, 56)',
    accent: 'rgb(218, 165, 32)',       // Goldenrod
    accentHover: 'rgb(198, 145, 12)',

    // Creamy, warm backgrounds
    background: 'rgb(245, 242, 235)',  // Cream
    surface: 'rgb(255, 250, 240)',     // Warm white
    surfaceHover: 'rgb(240, 235, 225)',
    border: 'rgb(209, 196, 175)',      // Warm beige

    // Warm text colors
    text: 'rgb(51, 44, 37)',           // Dark brown
    textSecondary: 'rgb(89, 79, 68)',
    textMuted: 'rgb(135, 122, 105)',

    // Semantic colors with vintage feel
    success: 'rgb(76, 132, 76)',
    successBg: 'rgb(220, 240, 220)',
    danger: 'rgb(176, 66, 66)',
    dangerBg: 'rgb(250, 220, 220)',
    warning: 'rgb(198, 145, 12)',
    info: 'rgb(65, 115, 145)',
  },
  fonts: {
    body: "'Georgia', 'Times New Roman', serif",
    display: "'Courier New', 'Courier', monospace",
    mono: "'Courier New', monospace",
  },
  styles: {
    buttonRadius: '12px',  // Rounded, friendly
    cardRadius: '16px',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 8px 24px rgba(0, 0, 0, 0.15)',
  },
};

/**
 * 1990s Dot-com Bubble Theme
 * Aesthetic: Dark, techy, cyberpunk
 * Colors: Dark base with neon blue and purple accents
 * Vibe: Early internet, Y2K, digital frontier
 */
export const DOTCOM_THEME: EraTheme = {
  id: 'dotcom_theme',
  eraId: 'DOTCOM_BUBBLE',
  name: 'Y2K Neon',
  displayName: 'Dot-com Era',
  colors: {
    // Neon cyberpunk colors
    primary: 'rgb(99, 102, 241)',      // Bright indigo
    primaryHover: 'rgb(79, 82, 221)',
    secondary: 'rgb(168, 85, 247)',    // Purple
    secondaryHover: 'rgb(148, 65, 227)',
    accent: 'rgb(34, 211, 238)',       // Cyan
    accentHover: 'rgb(14, 191, 218)',

    // Dark, moody backgrounds
    background: 'rgb(15, 23, 42)',     // Slate 900
    surface: 'rgb(30, 41, 59)',        // Slate 800
    surfaceHover: 'rgb(51, 65, 85)',   // Slate 700
    border: 'rgb(71, 85, 105)',        // Slate 600

    // Bright text on dark
    text: 'rgb(248, 250, 252)',        // Slate 50
    textSecondary: 'rgb(203, 213, 225)', // Slate 300
    textMuted: 'rgb(148, 163, 184)',   // Slate 400

    // Neon semantic colors
    success: 'rgb(34, 197, 94)',
    successBg: 'rgba(34, 197, 94, 0.1)',
    danger: 'rgb(239, 68, 68)',
    dangerBg: 'rgba(239, 68, 68, 0.1)',
    warning: 'rgb(234, 179, 8)',
    info: 'rgb(59, 130, 246)',
  },
  fonts: {
    body: "'Courier New', 'Courier', monospace",
    display: "'Orbitron', 'Impact', sans-serif",
    mono: "'Courier New', monospace",
  },
  styles: {
    buttonRadius: '4px',   // Sharp, digital
    cardRadius: '8px',
    shadow: '0 0 16px rgba(99, 102, 241, 0.3)',  // Neon glow
    shadowLg: '0 0 32px rgba(99, 102, 241, 0.4)',
  },
};

/**
 * 2020s Modern Era Theme
 * Aesthetic: Clean, minimalist, fintech
 * Colors: Subtle gradients, professional blues and grays
 * Vibe: Sophisticated, data-centric, modern SaaS
 */
export const MODERN_THEME: EraTheme = {
  id: 'modern_theme',
  eraId: 'MODERN_ERA',
  name: 'Modern Fintech',
  displayName: 'Modern Era',
  colors: {
    // Professional, clean colors
    primary: 'rgb(59, 130, 246)',      // Blue 500
    primaryHover: 'rgb(37, 99, 235)',  // Blue 600
    secondary: 'rgb(107, 114, 128)',   // Gray 500
    secondaryHover: 'rgb(75, 85, 99)',
    accent: 'rgb(16, 185, 129)',       // Emerald
    accentHover: 'rgb(5, 150, 105)',

    // Clean, modern backgrounds
    background: 'rgb(249, 250, 251)',  // Gray 50
    surface: 'rgb(255, 255, 255)',     // Pure white
    surfaceHover: 'rgb(243, 244, 246)', // Gray 100
    border: 'rgb(229, 231, 235)',      // Gray 200

    // Professional text
    text: 'rgb(17, 24, 39)',           // Gray 900
    textSecondary: 'rgb(55, 65, 81)',  // Gray 700
    textMuted: 'rgb(107, 114, 128)',   // Gray 500

    // Clean semantic colors
    success: 'rgb(16, 185, 129)',
    successBg: 'rgb(209, 250, 229)',
    danger: 'rgb(239, 68, 68)',
    dangerBg: 'rgb(254, 226, 226)',
    warning: 'rgb(245, 158, 11)',
    info: 'rgb(59, 130, 246)',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  styles: {
    buttonRadius: '8px',   // Modern, balanced
    cardRadius: '12px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
};

/**
 * Theme registry - maps era IDs to themes
 */
export const ERA_THEMES: Record<string, EraTheme> = {
  POST_WAR_BOOM: POST_WAR_THEME,
  DOTCOM_BUBBLE: DOTCOM_THEME,
  MODERN_ERA: MODERN_THEME,
};

/**
 * Get theme for a given era ID
 */
export function getThemeForEra(eraId: string | null): EraTheme {
  if (!eraId || !ERA_THEMES[eraId]) {
    return MODERN_THEME; // Default fallback
  }
  return ERA_THEMES[eraId];
}

/**
 * Helper to convert theme colors to CSS variables
 */
export function themeToCSS(theme: EraTheme): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-secondary': theme.colors.secondary,
    '--color-secondary-hover': theme.colors.secondaryHover,
    '--color-accent': theme.colors.accent,
    '--color-accent-hover': theme.colors.accentHover,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.surface,
    '--color-surface-hover': theme.colors.surfaceHover,
    '--color-border': theme.colors.border,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-text-muted': theme.colors.textMuted,
    '--color-success': theme.colors.success,
    '--color-success-bg': theme.colors.successBg,
    '--color-danger': theme.colors.danger,
    '--color-danger-bg': theme.colors.dangerBg,
    '--color-warning': theme.colors.warning,
    '--color-info': theme.colors.info,
    '--font-body': theme.fonts.body,
    '--font-display': theme.fonts.display,
    '--font-mono': theme.fonts.mono,
    '--radius-button': theme.styles.buttonRadius,
    '--radius-card': theme.styles.cardRadius,
    '--shadow': theme.styles.shadow,
    '--shadow-lg': theme.styles.shadowLg,
  };
}
