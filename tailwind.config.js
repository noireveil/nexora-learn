/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Darker cleaner background
        surface: '#151B2B',
        surfaceHighlight: '#1E2738',
        primary: '#6366F1', // Indigo
        primaryGlow: 'rgba(99, 102, 241, 0.4)',
        secondary: '#10B981', // Emerald
        accent: '#F43F5E', // Rose
        text: {
            main: '#F1F5F9',
            muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #1a1f35 0deg, #0B0F19 180deg, #1a1f35 360deg)',
      }
    },
  },
  plugins: [],
}
