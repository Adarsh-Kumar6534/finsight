"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

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

interface SettingsContextType {
    settings: Settings;
    updateSettings: (section: keyof Settings, key: string, value: any) => void;
    isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
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
    };

    // Apply global CSS transformations based on settings
    useEffect(() => {
        if (!isLoaded) return;

        // Handle Reduce Motion
        if (settings.theme.reduceMotion) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }

        // Handle Glow (add/remove from body cleanly)
        if (settings.theme.glow) {
            document.body.classList.add('theme-glow-enabled');
        } else {
            document.body.classList.remove('theme-glow-enabled');
        }

        // Handle Blur Intensity cleanly
        document.body.classList.remove('blur-intensity-low', 'blur-intensity-medium', 'blur-intensity-high');
        document.body.classList.add(`blur-intensity-${settings.dashboard.blurIntensity}`);

    }, [settings, isLoaded]);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoaded }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useGlobalSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useGlobalSettings must be used within a SettingsProvider");
    }
    return context;
}
