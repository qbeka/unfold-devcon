import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono]
      },
      colors: {
        ink: "#0a0a0a",
        muted: "#737373",
        paper: "#fafafa"
      },
      letterSpacing: {
        tighter2: "-0.035em"
      },
      boxShadow: {
        soft: "0 14px 40px -16px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
