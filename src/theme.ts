import { Platform } from 'react-native';

export const COLORS = {
  // Base
  black: '#000000',
  nearBlack: '#0a0a0a',
  deepGreenBlack: '#0a120a',
  darkGreen: '#0d1f0d',
  darkPanel: '#111611',
  panelBorder: '#1a2e1a',

  // Primary
  cyan: '#00e5ff',
  cyanDim: '#005f6b',
  cyanGlow: 'rgba(0, 229, 255, 0.15)',

  // Energy / Profit
  green: '#76ff03',
  greenDim: '#2e7d00',
  greenGlow: 'rgba(118, 255, 3, 0.12)',

  // Terminal
  terminalGreen: '#00ff41',
  terminalGreenDim: '#004d14',

  // Heat / Danger
  red: '#ff1744',
  redDim: '#7f0000',
  redGlow: 'rgba(255, 23, 68, 0.15)',

  // Warning / Opportunity
  amber: '#ffab00',
  amberDim: '#7f5500',

  // Archivist / Special
  violet: '#7c4dff',
  violetDim: '#311b92',

  // Text
  textPrimary: '#e0e8e0',
  textSecondary: '#8fa498',
  textDim: '#4a5e4a',
  textMuted: '#3a4a3a',

  // Misc
  white: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.85)',
  scanline: 'rgba(0, 255, 65, 0.03)',
} as const;

export const FONTS = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: 'Consolas, "Courier New", monospace',
    default: 'monospace',
  }) as string,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  title: 36,
} as const;

export const BORDERS = {
  thin: 1,
  medium: 2,
  panel: {
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 4,
  },
} as const;
