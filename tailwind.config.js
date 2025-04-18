module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // <-- Add this
  ],
  darkMode: "class", // Ensure dark mode is enabled via class
};
