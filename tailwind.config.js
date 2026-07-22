/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: '#101010',
        card: '#171717',
        primary: '#3B82F6',
        accent: '#00D9FF',
        success: '#22C55E',
        danger: '#FF4D67',
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
