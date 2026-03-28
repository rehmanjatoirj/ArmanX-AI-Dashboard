import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0D1530',
          teal: '#1D9E75',
          cyan: '#00D4FF',
          ink: '#121A34',
          mist: '#E8F2FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(3, 10, 30, 0.25)',
      },
      backgroundImage: {
        'brand-grid':
          'radial-gradient(circle at top right, rgba(0, 212, 255, 0.12), transparent 30%), radial-gradient(circle at bottom left, rgba(29, 158, 117, 0.14), transparent 32%)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.92)' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('light', 'html.light &');
    }),
  ],
};
