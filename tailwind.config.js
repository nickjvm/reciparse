/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-opensans)'],
        display: ['var(--font-yesevaone)'],
      },
      screens: {
        'print': {'raw': 'print'},
      },
      maxWidth: {
        '3xl': '56em',
      },
      colors: {
        'brand': '#b22066',
        'brand-alt': '#7b3366',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};