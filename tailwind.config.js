/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: colors.white,
      slate: colors.slate,
      black: colors.black,
      red: colors.red,
      transparent: colors.transparent,
      primary: colors.blue,
      secondary: {
        100: '#e9f3ff',
        200: '#d3e7ff',
        300: '#bcdaff',
        400: '#a6ceff',
        500: '#90c2ff',
        600: '#739bcc',
        700: '#567499',
        800: '#3a4e66',
        900: '#1d2733',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
      },
      info: {
        main: '#0288d1',
        light: '#03A9F4',
        dark: '#01579B',
      },
      success: {
        main: '#2E7D32',
        light: '#4CAF50',
        dark: '#1B5E20',
      },
      neutral: colors.gray,
    },
    fontFamily: {
      sans: ['Poppins', 'Roboto', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
