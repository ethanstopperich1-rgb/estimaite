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
        // Roofing Pros USA Brand Colors - LIGHT MODE
        brand: {
          navy: '#141B38',        // Primary dark navy (text/headers)
          'navy-light': '#1E3A8A',
          green: '#199f1a',       // Primary CTA green
          'green-light': '#32d74b',
          'green-dark': '#158a15',
          gray: '#434960',        // Body text
          'gray-light': '#6B7280',
        },
        // Light backgrounds
        surface: {
          DEFAULT: '#ffffff',     // Main background
          secondary: '#f9fafb',   // Slightly off-white
          tertiary: '#f3f4f6',    // Card backgrounds
          border: '#e5e7eb',      // Borders
          'border-light': '#eee', // Subtle borders
        },
        // Primary accent (green for CTAs)
        primary: {
          DEFAULT: '#199f1a',
          light: '#32d74b',
          dark: '#158a15',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#199f1a',
          700: '#158a15',
        },
        // Secondary (navy blue)
        secondary: {
          DEFAULT: '#141B38',
          light: '#1E3A8A',
          dark: '#0f1629',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1E3A8A',
          900: '#141B38',
        },
        // Status colors
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
          bg: '#f0fdf4',
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
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          bg: '#eff6ff',
        },
      },
      boxShadow: {
        // Light mode shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Card shadows
        'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
        // Green glow for CTAs
        'glow-green': '0 0 20px rgba(25, 159, 26, 0.3)',
        'glow-green-lg': '0 0 40px rgba(25, 159, 26, 0.4)',
        // Blue glow
        'glow-blue': '0 0 20px rgba(30, 58, 138, 0.2)',
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
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      borderRadius: {
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'pill': '9999px',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
