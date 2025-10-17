/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', ...defaultTheme.fontFamily.sans], // Define 'Outfit' as a custom font family
      },
      colors: {
        'vanta-blue-medium': '#1A202C',
        'vanta-text-light': '#E2E8F0',
      }
    },
  },
  plugins: [],
};