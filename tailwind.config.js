/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0c2878',
      },
      fontFamily: {
        sans: ['"Baloo Chettan 2"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
