/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F9F7F2', // Cream lebih hangat (Retro Base)
        surface: '#FFFFFF',
        surfaceHighlight: '#EFECE6', // Cream sedikit lebih gelap untuk hover
        primary: '#264653', // Deep Teal/Charcoal (Warna Profesional Utama)
        secondary: '#2A9D8F', // Muted Teal
        accent: '#E76F51', // Burnt Sienna (Warna Tombol/Aksen Retro)
        text: {
            main: '#2B2D42', // Hampir hitam, tidak pure black
            muted: '#5D6777'  // Abu-abu hangat
        },
        success: '#10B981',
        warning: '#F4A261',
        danger: '#E63946'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(38, 70, 83, 0.1)',
        'retro-hover': '6px 6px 0px 0px rgba(38, 70, 83, 0.15)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}