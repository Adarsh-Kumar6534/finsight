"use client";

import { useState, useEffect } from "react";

interface Settings {
    theme: {
        mode: "dark" | "light"; // For future use, currently enforced dark
        glow: boolean;
        reduceMotion: boolean;
        accentColor: "teal" | "blue" | "indigo";
    };
    dashboard: {
        animatedCounters: boolean;
        chartAnimations: boolean;
        compactMode: boolean;
        blurIntensity: "low" | "medium" | "high";
    };
    data: {
        timeRange: "24h" | "7d" | "30d" | "90d";
        region: "all" | "na" | "eu" | "apac";
        currency: "USD" | "EUR" | "GBP";
    };
}

const defaultSettings: Settings = {
    theme: {
        mode: "dark",
        glow: true,
        reduceMotion: false,
        accentColor: "teal",
    },
    dashboard: {
        animatedCounters: true,
        chartAnimations: true,
        compactMode: false,
        blurIntensity: "high",
    },
    data: {
        timeRange: "7d",
        region: "all",
        currency: "USD",
    },
};

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("finsight_settings");
        if (stored) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        setIsLoaded(true);
    }, []);

    const updateSettings = (section: keyof Settings, key: string, value: any) => {
        const newSettings = {
            ...settings,
            [section]: {
                ...settings[section],
                [key]: value,
            },
        };
        setSettings(newSettings);
        localStorage.setItem("finsight_settings", JSON.stringify(newSettings));

        // Apply immediate side effects (e.g., reduce motion class)
        if (section === "theme" && key === "reduceMotion") {
            if (value) document.documentElement.classList.add("reduce-motion");
            else document.documentElement.classList.remove("reduce-motion");
        }
    };

    return { settings, updateSettings, isLoaded };
}
