/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Define a custom 316-column grid
        316: 'repeat(316, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
