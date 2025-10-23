/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // --- START: MODIFIED BLOCK ---
    fontFamily: {
        // By defining the 'sans' key here, you override Tailwind's default sans-serif font.
        // The entire app will now use 'Outfit' by default unless another font-* class is applied.
        sans: ['Outfit', ...fontFamily.sans], 
        outfit: ['Outfit', ...fontFamily.sans], // Keep 'font-outfit' utility for consistency
    },
    // --- END: MODIFIED BLOCK ---
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'vanta-blue-dark': '#06002E',
        'vanta-accent-blue': '#007BFF',
        'vanta-text-light': '#E0E0E0',
        'vanta-blue-medium': '#011B47',
        'vanta-accent-dark-blue': '#014568',
        'vanta-neon-blue': '#00eeee',
        'vanta-purple': '#9A3FFE',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Note: Removed the redundant `fontFamily` definition from here
      // as it is now in the main `theme` block.
    },
  },
  plugins: [],