/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B3543', // Dark blue
          50: '#F0F4F6',
          100: '#E1E9ED',
          200: '#C3D3DB',
          300: '#A5BDC9',
          400: '#87A7B7',
          500: '#6991A5',
          600: '#507B93',
          700: '#3D5E71',
          800: '#2A414E',
          900: '#17242C',
        },
        teal: {
          DEFAULT: '#3D8B8B', // Teal accent
          50: '#F0F6F6',
          100: '#E1EDED',
          200: '#C3DBDB',
          300: '#A5C9C9',
          400: '#87B7B7',
          500: '#69A5A5',
          600: '#4B9393',
          700: '#3D7676',
          800: '#2F5959',
          900: '#213C3C',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [],
};