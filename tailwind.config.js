/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    // Matro's tokens land here (and in src/theme/colors.ts) on the first feat/ branch.
    extend: {},
  },
  plugins: [],
};
