/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Roofing Pros USA Brand Colors - FROM LOGO
        brand: {
          blue: '#1F4DA1',        // Primary blue from logo
          'blue-light': '#3B6BC4',
          'blue-dark': '#163A7A',
          green: '#00A651',       // Secondary green from logo
          'green-light': '#00C462',
          'green-dark': '#008541',
        },
        // Primary = Blue (headers, accents, professional)
        primary: {
          DEFAULT: '#1F4DA1',
          light: '#3B6BC4',
          dark: '#163A7A',
          50: '#EBF0F9',
          100: '#D6E1F3',
          200: '#ADC3E7',
          300: '#85A5DB',
          400: '#5C87CF',
          500: '#1F4DA1',
          600: '#1A4189',
          700: '#163A7A',
          800: '#112D5E',
          900: '#0D2142',
        },
        // Secondary = Green (CTAs, buttons, actions)
        secondary: {
          DEFAULT: '#00A651',
          light: '#00C462',
          dark: '#008541',
          50: '#E6F9EF',
          100: '#CCF3DF',
          200: '#99E7BF',
          300: '#66DB9F',
          400: '#33CF7F',
          500: '#00A651',
          600: '#008F46',
          700: '#00783B',
          800: '#006130',
          900: '#004A25',
        },
        // Surface colors for light theme
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
          border: '#e5e7eb',
        },
        // Status colors
        success: {
          DEFAULT: '#00A651',
          light: '#00C462',
          dark: '#008541',
          bg: '#E6F9EF',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
          bg: '#fffbeb',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
          bg: '#fef2f2',
        },
        info: {
          DEFAULT: '#1F4DA1',
          light: '#3B6BC4',
          dark: '#163A7A',
          bg: '#EBF0F9',
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        // Brand color glows
        'glow-blue': '0 0 20px rgba(31, 77, 161, 0.3)',
        'glow-green': '0 0 20px rgba(0, 166, 81, 0.3)',
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      borderRadius: {
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
