/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vanta-blue-dark': '#0A1128',
        'vanta-blue-medium': '#121A33',
        'vanta-blue-light': '#1A243F',
        'vanta-accent-blue': '#007BFF',
        'vanta-grey-dark': '#2C3E50',
        'vanta-grey-medium': '#7F8C8D',
        'vanta-grey-light': '#BDC3C7',
        'vanta-off-white': '#F8F8F8', // Added new off-white color
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}