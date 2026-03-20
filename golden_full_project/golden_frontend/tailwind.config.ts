import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          pale:    '#F5E9C8',
        },
        dark: {
          DEFAULT: '#0A0A0A',
          2:       '#111111',
          3:       '#1A1A1A',
          4:       '#222222',
        },
        golden: {
          text:       '#F0EDE6',
          muted:      '#8A8070',
          dim:        '#3A3530',
          border:     'rgba(201,168,76,0.15)',
          'border-bright': 'rgba(201,168,76,0.35)',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
        syne:  ['Syne', 'sans-serif'],
      },
      animation: {
        'rotate-slow': 'rotate 40s linear infinite',
        'fade-up':     'fadeUp 0.8s ease both',
        'scroll-hint': 'scrollAnim 2s ease-in-out infinite',
      },
      keyframes: {
        rotate: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scrollAnim: {
          '0%, 100%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '50%':      { transform: 'scaleY(0.3)', transformOrigin: 'top' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
