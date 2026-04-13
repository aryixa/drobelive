/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        accent: {
          DEFAULT: '#f4f4f5',
          foreground: '#18181b',
        },
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        background: '#ffffff',
        foreground: '#000000',
        border: '#e4e4e7',
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
}
