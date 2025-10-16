/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vanta-blue-dark': '#06002E',
        'vanta-accent-blue': '#007BFF',
        'vanta-text-light': '#E0E0E0',
        'vanta-blue-medium': '#011B47', // New color added
      },
    },
  },
  plugins: [],
}