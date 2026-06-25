import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mv: {
          bg: '#F7F7F5',
          sidebar: '#1A1C1E',
          'sidebar-hover': '#2A2D30',
          'sidebar-active': '#313538',
          border: '#E5E3DC',
          surface: '#FFFFFF',
          text: '#1A1A18',
          'text-muted': '#888880',
          'text-light': '#B0AFA8',
          accent: '#7C3AED',
          'accent-light': '#EDE9FE',
          'accent-dim': '#F5F3FF',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
