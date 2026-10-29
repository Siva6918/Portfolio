/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: 'rgb(var(--color-textMain) / <alpha-value>)',
        black: 'rgb(var(--color-bg) / <alpha-value>)',
        // User Theme Colors
        iceSilver: {
          light: '#f1f5f9',
          DEFAULT: '#e2e8f0',
          dark: '#94a3b8',
        },
        marigold: {
          light: '#fde68a',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          glow: 'rgba(245, 158, 11, 0.45)',
        },
        neonRose: {
          light: '#fb7185',
          DEFAULT: '#f43f5e',
          dark: '#e11d48',
          glow: 'rgba(244, 63, 94, 0.45)',
        },
        themeBlack: {
          DEFAULT: '#08080a',
          surface: '#101016',
          card: '#14141c',
          border: '#242834',
        },
        editorial: {
          bg: 'rgb(var(--color-bg) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          textMain: 'rgb(var(--color-textMain) / <alpha-value>)',
          textMuted: 'rgb(var(--color-textMuted) / <alpha-value>)',
          accent: 'rgb(var(--color-accent) / <alpha-value>)',
          accentHover: 'rgb(var(--color-accentHover) / <alpha-value>)',
          rose: 'rgb(var(--color-rose) / <alpha-value>)',
          marigold: 'rgb(var(--color-marigold) / <alpha-value>)',
          silver: 'rgb(var(--color-silver) / <alpha-value>)',
        }
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
