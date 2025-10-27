import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "oklch(0.90 0 0)",
        input: "oklch(0.90 0 0)",
        ring: "oklch(0.45 0.15 290)",
        background: "oklch(0.98 0 0)",
        foreground: "oklch(0.20 0 0)",
        primary: {
          DEFAULT: "oklch(0.45 0.15 290)",
          foreground: "oklch(1 0 0)",
        },
        secondary: {
          DEFAULT: "oklch(0.65 0.12 200)",
          foreground: "oklch(1 0 0)",
        },
        accent: {
          DEFAULT: "oklch(0.70 0.15 30)",
          foreground: "oklch(1 0 0)",
        },
        amber: {
          DEFAULT: "oklch(0.75 0.15 80)",
          foreground: "oklch(0.20 0 0)",
        },
        muted: {
          DEFAULT: "oklch(0.95 0.02 290)",
          foreground: "oklch(0.45 0 0)",
        },
        destructive: {
          DEFAULT: "oklch(0.55 0.20 25)",
          foreground: "oklch(1 0 0)",
        },
        card: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.20 0 0)",
        },
        popover: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.20 0 0)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}

export default config
