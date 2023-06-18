/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Sans", "sans-serif"],
        mono: ["Fira Mono", "monospace"],
      },
      colors: {
        app: "#A8DADC",
        board: "#E9E9E9",
        block: "#F1FAEE",
        info: "#1D3557",
        interact: "#E63946",
        line: "#457B9D",
      },
    },
  },
  plugins: [],
};
