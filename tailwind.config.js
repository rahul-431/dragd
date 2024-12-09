/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgMain: "#0D1117",
        bgColumn: "#161C22",
      },
    },
  },
  plugins: [],
};
