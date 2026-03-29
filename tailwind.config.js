import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A0F1E',
          teal: '#0A66C2',
          cyan: '#F5C518',
          ink: '#111827',
          mist: '#E8EEF7',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'brand-grid':
          'radial-gradient(circle at top right, rgba(10, 102, 194, 0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(245, 197, 24, 0.14), transparent 32%)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
      },
      animation: {
        pulse: 'pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('light', 'html.light &');
    }),
  ],
};
