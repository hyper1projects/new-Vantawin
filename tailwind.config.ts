/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', ...fontFamily.sans],
      },
      colors: {
        'vanta-blue-dark': '#06002E',
        'vanta-accent-blue': '#007BFF',
        'vanta-text-light': '#E0E0E0',
        'vanta-blue-medium': '#011B47',
        'vanta-accent-dark-blue': '#014568', // New color for active tab background
        'vanta-neon-blue': '#00eeee',       // New color for vertical accent bar
      },
    },
  },
  plugins: [],
}