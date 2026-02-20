import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B1220", // Deep Graphite Navy
                surface: "#0F172A",    // Secondary Background
                primary: {
                    teal: "#14B8A6",
                    blue: "#3B82F6",
                    indigo: "#6366F1",
                },
                risk: {
                    low: "#10B981",    // Emerald
                    medium: "#F59E0B", // Amber
                    high: "#EF4444",   // Red
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "accent-gradient": "linear-gradient(135deg, #14B8A6 0%, #3B82F6 50%, #6366F1 100%)",
                "glass-gradient": "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
            },
            boxShadow: {
                "glass": "0 10px 40px rgba(0, 0, 0, 0.4)",
                "glow-teal": "0 0 30px rgba(20, 184, 166, 0.25)",
                "glow-blue": "0 0 30px rgba(59, 130, 246, 0.25)",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "slide-up": "slideUp 0.5s ease-out forwards",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
