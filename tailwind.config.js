/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        PlusJakartaSans: ['PlusJakartaSans'],
        PlayfairDisplay: ['PlayfairDisplay'],
        Durk_bold_italic_1000: ['Durk-bold-italic-1000'],
        Durk_bold_italic_500: ['Durk-bold-italic-500'],
        Durk_bold_400: ['Durk-bold-400'],
        PPsans_400: ['PPsans-400'],
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1)',
        neon: '0 0 50px rgba(255, 105, 180, 0.6), 0 5px 10px rgba(126, 34, 206, 0.3)',
      },
      animation: {
        scroll: 'scroll 15s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};
