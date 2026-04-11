import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#122023",
        mist: "#f3f7f6",
        signal: "#0f766e",
        accent: "#f59e0b",
      },
      fontFamily: {
        sans: ["Hiragino Sans", "Noto Sans JP", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px rgba(18, 32, 35, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
