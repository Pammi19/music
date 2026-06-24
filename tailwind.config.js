/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e3',
          300: '#aeb6c6',
          400: '#818ca5',
          500: '#62708c',
          600: '#4d5973',
          700: '#404960',
          800: '#373f51',
          900: '#0f1115',
          950: '#07080b',
        },
        brand: {
          50:  '#eefcf6',
          100: '#d6f7e9',
          200: '#b0eed4',
          300: '#7adeba',
          400: '#42c69b',
          500: '#1fab7f',
          600: '#128a67',
          700: '#0f6e54',
          800: '#105844',
          900: '#0e4838',
        },
        accent: {
          400: '#f5a524',
          500: '#ef8e0b',
          600: '#db7a06',
        },
      },
      boxShadow: {
        glow:    '0 0 40px -10px rgba(31,171,127,0.45)',
        'glow-lg': '0 0 60px -8px rgba(31,171,127,0.55)',
        card:    '0 10px 30px -12px rgba(0,0,0,0.6)',
        'card-lg': '0 20px 50px -15px rgba(0,0,0,0.7)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bar: {
          '0%,100%': { transform: 'scaleY(0.35)' },
          '50%':     { transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-ring': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(31,171,127,0.4)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(31,171,127,0)' },
        },
      },
      animation: {
        'fade-in':        'fade-in 0.4s ease-out',
        'slide-up':       'slide-up 0.45s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':       'scale-in 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slide-in-right 0.35s ease-out',
        bar:              'bar 0.8s ease-in-out infinite',
        shimmer:          'shimmer 2s linear infinite',
        'spin-slow':      'spin-slow 8s linear infinite',
        'pulse-ring':     'pulse-ring 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
