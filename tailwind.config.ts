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
        background: "#0a0a0b",
        foreground: "#f8f9fa",
        card: {
          DEFAULT: "#131314",
          foreground: "#f8f9fa",
        },
        popover: {
          DEFAULT: "#131314",
          foreground: "#f8f9fa",
        },
        primary: {
          DEFAULT: "#ff6b35",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#ff4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1a1b",
          foreground: "#a8a8a9",
        },
        accent: {
          DEFAULT: "#1e1e1f",
          foreground: "#f8f9fa",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#f8f9fa",
        },
        border: "#2a2a2b",
        input: "#2a2a2b",
        ring: "#ff6b35",
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/line-clamp'),
  ],
};
export default config;
