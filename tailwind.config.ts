import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Identite de marque Delta Surveys : bleu fonce, rouge, blanc
        // Bleu royal aligné sur le logo Delta Surveys
        navy: {
          50: "#eef2ff",
          100: "#dfe6ff",
          200: "#c1ccfe",
          300: "#99a9fb",
          400: "#6b81f4",
          500: "#435ee6",
          600: "#2c40cf",
          700: "#2333a6",
          800: "#1d2a80",
          900: "#151d5e",
          950: "#0b1140",
        },
        brand: {
          red: "#ed1c24",
          "red-dark": "#c41219",
          blue: "#1c2f9c",
          "blue-dark": "#141f70",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(15, 31, 69, 0.08), 0 4px 24px -8px rgba(15, 31, 69, 0.08)",
        card: "0 1px 3px rgba(15, 31, 69, 0.06), 0 8px 30px -12px rgba(15, 31, 69, 0.14)",
        "card-hover": "0 20px 50px -20px rgba(15, 31, 69, 0.28)",
        glow: "0 10px 40px -12px rgba(225, 19, 36, 0.35)",
      },
      backgroundImage: {
        "grid-navy":
          "linear-gradient(to right, rgba(15,31,69,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,31,69,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
