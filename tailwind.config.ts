import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0f',
          card: '#111118',
          border: '#1e1e2e',
          accent: '#6c63ff',
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}

export default config
