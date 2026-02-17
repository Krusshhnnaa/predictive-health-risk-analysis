// Design System Constants

export const COLORS = {
  // Primary Colors
  primary: '#5DD3C7',
  primaryDark: '#4ECDC4',
  secondary: '#7B68EE',
  secondaryLight: '#9B8FF5',
  
  // Accent Colors
  peach: '#FFB088',
  peachDark: '#FF9B6A',
  pink: '#FFB6D9',
  pinkLight: '#FFD4E8',
  yellow: '#FFD97D',
  yellowLight: '#FFE8A3',
  blue: '#A8D8FF',
  blueLight: '#C8E6FF',
  purple: '#D8B4FE',
  purpleLight: '#E9D5FF',
  
  // Neutral Colors
  white: '#FFFFFF',
  background: '#F8F9FE',
  backgroundLight: '#FAFBFF',
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  shadow: '#000000',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const GRADIENTS = {
  primary: ['#5DD3C7', '#4ECDC4'],
  secondary: ['#7B68EE', '#9B8FF5'],
  peach: ['#FFB088', '#FF9B6A'],
  pink: ['#FFB6D9', '#FFD4E8'],
  yellow: ['#FFD97D', '#FFE8A3'],
  blue: ['#A8D8FF', '#C8E6FF'],
  purple: ['#D8B4FE', '#E9D5FF'],
  background: ['#F8F9FE', '#FAFBFF'],
};

export const TYPOGRAPHY = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  
  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Health Data Constants
export const SLEEP_RECOMMENDATIONS: Record<string, number> = {
  '0-2': 14,   // 0-2 months: 14-17 hours
  '3-11': 13,  // 3-11 months: 12-15 hours  
  '1-2': 12,   // 1-2 years: 11-14 hours
  '3-5': 11,   // 3-5 years: 10-13 hours
  '6-13': 10,  // 6-13 years: 9-11 hours
  '14-17': 9,  // 14-17 years: 8-10 hours
  '18-64': 8,  // 18-64 years: 7-9 hours
  '65+': 7,    // 65+ years: 7-8 hours
};

export const WATER_GOAL = 8; // 8 glasses per day
export const STEP_GOAL = 10000; // 10,000 steps per day

// BMI Categories
export const BMI_CATEGORIES = {
  underweight: { max: 18.5, label: 'Underweight', color: COLORS.info },
  normal: { min: 18.5, max: 24.9, label: 'Normal', color: COLORS.success },
  overweight: { min: 25, max: 29.9, label: 'Overweight', color: COLORS.warning },
  obese: { min: 30, label: 'Obese', color: COLORS.error },
};
