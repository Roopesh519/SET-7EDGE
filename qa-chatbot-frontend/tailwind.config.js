/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        animation: {
          shimmer: 'shimmer 3s infinite',
        },
        keyframes: {
          shimmer: {
            '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
            '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
          }
        }
      },
    },
    plugins: [],
  };
  