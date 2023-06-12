import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EE6352",
        secondary: "#08B2E3",
        light: "#EFE9F4",
        jade: "#57A773",
        dark: "#484D6D",
      },
    },
  },
  plugins: [],
} satisfies Config;
