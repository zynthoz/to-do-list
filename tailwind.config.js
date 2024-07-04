/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {
      colors: {
        darkGit: {
          '100': '#161b22',
          '200': '#0d1117',
          '300': '#010409',
        },
        greenGit: {
          '100': '#3C8A4B',
          '200': '#238636',
        },
      },
    },
  },
  plugins: [
  ],
}

