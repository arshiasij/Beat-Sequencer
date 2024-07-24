import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  safelist: [
    "bg-[#ffeb3b]",
    "bg-[#f44336]",
    "bg-[#e91e63]",
    "bg-[#9c27b0]",
    "bg-[#673ab7]",
    "bg-[#3f51b5]",
    "bg-[#2196f3]",
    "bg-[#03a9f4]",
    "bg-[#00bcd4]",
    "bg-[#009688]",
    "bg-[#4caf50]",
    "bg-[#8bc34a]",
    "bg-[#cddc39]",
    "bg-[#ffc107]",
    "bg-[#ff9800]",
    "bg-[#ff5722]",
    "bg-[#795548]",
    "bg-[#607d8b]",
  ],
  plugins: [],
};
export default config;
