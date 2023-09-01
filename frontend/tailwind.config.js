// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        100: "30rem",
        105: "34rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
