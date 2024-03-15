/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './stories/*'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
  variants: {
    scrollbar: ['rounded'],
  },
};
