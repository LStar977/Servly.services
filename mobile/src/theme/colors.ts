export const colors = {
  // Primary - Indigo
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Neutral / Gray
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Base
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
} as const;

// Category-specific accent colors for icons and provider card headers
export const categoryColors: Record<string, { bg: string; icon: string }> = {
  cat_1: { bg: '#EDE9FE', icon: '#7C3AED' },  // Home Cleaning - Violet
  cat_2: { bg: '#DBEAFE', icon: '#2563EB' },  // Plumbing - Blue
  cat_3: { bg: '#FEF3C7', icon: '#D97706' },  // Electrical - Amber
  cat_4: { bg: '#D1FAE5', icon: '#059669' },  // Lawn Care - Emerald
  cat_5: { bg: '#FFE4E6', icon: '#E11D48' },  // Moving - Rose
  cat_6: { bg: '#E0E7FF', icon: '#4338CA' },  // Auto Detailing - Indigo
  cat_7: { bg: '#FCE7F3', icon: '#DB2777' },  // Pet Services - Pink
  cat_8: { bg: '#E0F2FE', icon: '#0284C7' },  // Snow Removal - Sky
};

export const defaultCategoryColor = { bg: '#F3F4F6', icon: '#6B7280' };
