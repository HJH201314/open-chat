/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: { // ease-[]
        'out-expo': 'cubic-bezier(0.19,1,0.22,1)',
      },
      transitionProperty: { // transition-[]
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}

