export const accentureTheme = {
  colors: {
    primary: {
      purple: '#A100FF',
      purpleHover: '#8A00D9',
      purpleLight: '#E6CCFF',
      purpleUltraLight: '#F5E6FF',
      purpleDark: '#7A00BF',
    },
    secondary: {
      blue: '#5856D6',
      blueHover: '#4745B8',
      blueLight: '#8B89F5',
      blueGradientStart: '#7B3FF2',
      blueGradientEnd: '#5856D6',
    },
    status: {
      success: '#22C55E',
      successLight: '#86EFAC',
      successBg: '#F0FDF4',
      warning: '#F59E0B',
      warningLight: '#FDE047',
      warningBg: '#FFFBEB',
      error: '#EF4444',
      errorLight: '#FCA5A5',
      errorBg: '#FEF2F2',
      info: '#3B82F6',
      infoLight: '#93C5FD',
      infoBg: '#EFF6FF',
      pending: '#F97316',
      pendingBg: '#FFF7ED',
      completed: '#10B981',
      completedBg: '#ECFDF5',
      inProgress: '#A100FF',
      inProgressBg: '#F5E6FF',
    },
    neutrals: {
      black: '#000000',
      gray900: '#111827',
      gray800: '#1F2937',
      gray700: '#374151',
      gray600: '#4B5563',
      gray500: '#6B7280',
      gray400: '#9CA3AF',
      gray300: '#D1D5DB',
      gray200: '#E5E7EB',
      gray100: '#F3F4F6',
      gray50: '#F9FAFB',
      white: '#FFFFFF',
    },
    background: {
      light: {
        primary: '#FFFFFF',
        secondary: '#F9FAFB',
        tertiary: '#F3F4F6',
        card: '#FFFFFF',
        hover: '#F9FAFB',
      },
      dark: {
        primary: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
        card: '#1E293B',
        hover: '#334155',
      },
    },
    gradients: {
      purpleBlue: 'linear-gradient(135deg, #A100FF 0%, #5856D6 100%)',
      purplePink: 'linear-gradient(135deg, #A100FF 0%, #EC4899 100%)',
      bluePurple: 'linear-gradient(135deg, #5856D6 0%, #A100FF 100%)',
      lightPurple: 'linear-gradient(135deg, #F5E6FF 0%, #E6CCFF 100%)',
    },
  },
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      heading: '"Graphik", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    purple: '0 10px 30px -5px rgba(161, 0, 255, 0.3)',
    blue: '0 10px 30px -5px rgba(88, 86, 214, 0.3)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const accentureComponents = {
  button: {
    primary: `
      bg-gradient-to-r from-purple-600 to-blue-600
      hover:from-purple-700 hover:to-blue-700
      text-white font-semibold
      px-6 py-3 rounded-lg
      transition-all duration-300
      shadow-lg hover:shadow-xl
      hover:scale-105
      active:scale-95
    `,
    secondary: `
      bg-white border-2 border-purple-600
      hover:bg-purple-50
      text-purple-600 font-semibold
      px-6 py-3 rounded-lg
      transition-all duration-300
      hover:shadow-md
    `,
    ghost: `
      bg-transparent hover:bg-purple-50
      text-purple-600 font-semibold
      px-6 py-3 rounded-lg
      transition-all duration-300
    `,
  },
  card: {
    default: `
      bg-white rounded-xl shadow-md
      border border-gray-200
      hover:shadow-lg
      transition-all duration-300
    `,
    interactive: `
      bg-white rounded-xl shadow-md
      border border-gray-200
      hover:shadow-xl hover:border-purple-300
      transition-all duration-300
      cursor-pointer
      hover:scale-[1.02]
    `,
    purple: `
      bg-gradient-to-br from-purple-50 to-purple-100
      rounded-xl shadow-md
      border-2 border-purple-200
      hover:shadow-lg
      transition-all duration-300
    `,
  },
  badge: {
    completed: `
      inline-flex items-center px-3 py-1
      rounded-full text-xs font-semibold
      bg-green-100 text-green-800
      border border-green-200
    `,
    inProgress: `
      inline-flex items-center px-3 py-1
      rounded-full text-xs font-semibold
      bg-purple-100 text-purple-800
      border border-purple-200
    `,
    pending: `
      inline-flex items-center px-3 py-1
      rounded-full text-xs font-semibold
      bg-gray-100 text-gray-800
      border border-gray-200
    `,
  },
  input: {
    default: `
      w-full px-4 py-2.5
      border-2 border-gray-300
      rounded-lg
      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
      transition-all duration-300
      text-gray-900 placeholder-gray-400
    `,
  },
};

export default accentureTheme;
