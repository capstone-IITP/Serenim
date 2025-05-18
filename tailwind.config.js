/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 25px rgba(168, 85, 247, 0.4), 0 0 10px rgba(168, 85, 247, 0.1)',
        'button': '0 4px 14px rgba(168, 85, 247, 0.3)',
      },
    },
  },
  plugins: [],
} 