/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        navy: "#1B3A6B",
        "navy-dark": "#0D2144",
        "navy-mid": "#2A5298",
        "sky-soft": "#DBEAFE",
        "sky-mid": "#BFDBFE",
        "sky-accent": "#93C5FD",
        "warm-gray": "#E8E0D5",
        "warm-border": "#D4C9BC",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
