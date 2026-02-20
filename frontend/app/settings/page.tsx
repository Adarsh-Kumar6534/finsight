"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { useGlobalSettings } from "@/providers/SettingsProvider";
import { Settings as SettingsIcon, Monitor, BarChart2, Database, User, Shield, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { settings, updateSettings, isLoaded } = useGlobalSettings();

    if (!isLoaded) return null;

    const sections = [
        {
            id: "theme",
            title: "Theme & Appearance",
            icon: Monitor,
            description: "Customize the visual experience of the terminal.",
            fields: [
                {
                    key: "glow",
                    label: "Enhanced Glow Effects",
                    type: "toggle",
                    section: "theme",
                },
                {
                    key: "reduceMotion",
                    label: "Reduce Motion",
                    type: "toggle",
                    section: "theme",
                },
                {
                    key: "accentColor",
                    label: "Accent Color",
                    type: "select",
                    options: ["teal", "blue", "indigo"],
                    section: "theme",
                },
            ],
        },
        {
            id: "dashboard",
            title: "Dashboard Preferences",
            icon: BarChart2,
            description: "Manage how data is presented on the main board.",
            fields: [
                {
                    key: "animatedCounters",
                    label: "Animated Counters",
                    type: "toggle",
                    section: "dashboard",
                },
                {
                    key: "compactMode",
                    label: "Compact Mode",
                    type: "toggle",
                    section: "dashboard",
                },
                {
                    key: "blurIntensity",
                    label: "Glass Blur Intensity",
                    type: "select",
                    options: ["low", "medium", "high"],
                    section: "dashboard",
                },
            ],
        },
        {
            id: "data",
            title: "Data Configuration",
            icon: Database,
            description: "Set default filters and regional preferences.",
            fields: [
                {
                    key: "timeRange",
                    label: "Default Time Range",
                    type: "select",
                    options: ["24h", "7d", "30d", "90d"],
                    section: "data",
                },
                {
                    key: "currency",
                    label: "Display Currency",
                    type: "select",
                    options: ["USD", "EUR", "GBP"],
                    section: "data",
                },
            ],
        },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-lg">
                        <SettingsIcon size={32} className="text-primary-teal" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">System Settings</h1>
                        <p className="text-slate-400">Configure your FinSight terminal preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {sections.map((section) => (
                            <GlassCard key={section.id} className="p-0 overflow-hidden">
                                <div className="p-6 border-b border-white/5 flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                                        <section.icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                                        <p className="text-sm text-slate-400">{section.description}</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {section.fields.map((field: any) => (
                                        <div key={field.key} className="flex items-center justify-between">
                                            <label className="text-slate-300 font-medium">
                                                {field.label}
                                            </label>

                                            {field.type === "toggle" && (
                                                <button
                                                    onClick={() => updateSettings(field.section as keyof typeof settings, field.key, !(settings as any)[field.section][field.key])}
                                                    className={cn(
                                                        "w-12 h-7 rounded-full transition-colors duration-300 relative",
                                                        (settings as any)[field.section][field.key]
                                                            ? "bg-primary-teal"
                                                            : "bg-slate-700"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300",
                                                            (settings as any)[field.section][field.key]
                                                                ? "translate-x-5"
                                                                : "translate-x-0"
                                                        )}
                                                    />
                                                </button>
                                            )}

                                            {field.type === "select" && (
                                                <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                                                    {field.options.map((option: string) => (
                                                        <button
                                                            key={option}
                                                            onClick={() => updateSettings(field.section as keyof typeof settings, field.key, option)}
                                                            className={cn(
                                                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all uppercase",
                                                                (settings as any)[field.section][field.key] === option
                                                                    ? "bg-white/10 text-white shadow-sm"
                                                                    : "text-slate-500 hover:text-slate-300"
                                                            )}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Sidebar / Profile Info */}
                    <div className="space-y-6">
                        <GlassCard>
                            <div className="flex flex-col items-center text-center pb-6 border-b border-white/5">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 p-[2px] mb-4 shadow-glow-blue">
                                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <User size={32} className="text-slate-400" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white">Admin User</h3>
                                <p className="text-slate-400 text-sm">admin@finsight.com</p>
                                <span className="mt-3 px-3 py-1 rounded-full bg-primary-teal/10 text-primary-teal text-xs font-medium border border-primary-teal/20 flex items-center gap-1">
                                    <Shield size={12} /> Root Administrator
                                </span>
                            </div>
                            <div className="pt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Last Login</span>
                                    <span className="text-white font-mono">Today, 10:42 AM</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Session ID</span>
                                    <span className="text-white font-mono">#A7-2993</span>
                                </div>
                                <div className="pt-4">
                                    <GradientButton className="w-full" variant="secondary">
                                        Manage Profile
                                    </GradientButton>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Info size={16} className="text-primary-blue" />
                                System Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-slate-300">API Gateway</span>
                                    </div>
                                    <span className="text-green-500 font-medium">Operational</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <span className="text-slate-300">Database</span>
                                    </div>
                                    <span className="text-green-500 font-medium">Connected</span>
                                </div>
                                <div className="text-xs text-center text-slate-500 pt-2">
                                    FinSight v2.0.4-beta • Build 2293
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
