/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        PlusJakartaSans: ['PlusJakartaSans'],
        PlusJakartaSans1000: ['PlusJakartaSans-1000'],
        PlayfairDisplay: ['PlayfairDisplay'],
        Durk_bold_italic_1000: ['Durk-bold-italic-1000'],
        Durk_bold_italic_500: ['Durk-bold-italic-500'],
        Durk_bold_400: ['Durk-bold-400'],
        PPsans_400: ['PPsans-400'],
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1)',
        neon: '0 0 50px rgba(255, 105, 180, 0.6), 0 5px 10px rgba(126, 34, 206, 0.3)',
        custom_shadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'

      },
      animation: {
        scroll: 'scroll 15s linear infinite',
      },
      fontWeight: {
        'custom-light': 300,
        'custom-normal': 450,
        'custom-heavy': 1000,
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'input[type="date"]::-webkit-clear-button': {
          display: 'none',
        },
        'input[type="date"]::-ms-clear': {
          display: 'none',
        },
        'input[type="date"]::-webkit-calendar-picker-indicator': {
          display: 'none',
        },
      });
    },
  ],
};
