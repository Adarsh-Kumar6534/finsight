"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

import { useGlobalSettings } from "@/providers/SettingsProvider";

interface KpiCardProps {
    title: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
    prefix?: string;
    suffix?: string;
    delay?: number;
}

export function KpiCard({
    title,
    value,
    trend,
    trendLabel = "vs last week",
    prefix = "",
    suffix = "",
    delay = 0,
}: KpiCardProps) {
    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;
    const isNeutral = !trend || trend === 0;

    const { settings } = useGlobalSettings();
    const isAnimatedUrl = settings.dashboard.animatedCounters;

    return (
        <div className="relative group rounded-2xl p-[1px] overflow-hidden">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <GlassCard delay={delay} className="min-h-[160px] flex flex-col justify-between relative bg-[#0F172A]/80 h-full">
                <div className="flex justify-between items-start">
                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                        {title}
                    </h3>
                    <div
                        className={cn(
                            "p-2 rounded-full bg-white/5 border border-white/5 transition-colors duration-300",
                            isPositive ? "group-hover:bg-risk-low/10 group-hover:border-risk-low/20" : "",
                            isNegative ? "group-hover:bg-risk-high/10 group-hover:border-risk-high/20" : ""
                        )}
                    >
                        {/* Icon based on trend */}
                        {isPositive && <ArrowUpRight size={16} className="text-risk-low" />}
                        {isNegative && <ArrowDownRight size={16} className="text-risk-high" />}
                        {isNeutral && <Minus size={16} className="text-slate-400" />}
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <div className="text-4xl font-bold text-white tracking-tight">
                        <span className="text-slate-500 text-2xl mr-1">{prefix}</span>
                        {/* Future fix: Add true animation library here if required, currently static with setting check */}
                        <span className={isAnimatedUrl ? "animate-pulse-slow" : ""}>
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                        <span className="text-slate-500 text-xl ml-1">{suffix}</span>
                    </div>

                    {trend !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                            <span
                                className={cn(
                                    "font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/5",
                                    isPositive ? "text-risk-low bg-risk-low/10 border-risk-low/10" : "",
                                    isNegative ? "text-risk-high bg-risk-high/10 border-risk-high/10" : ""
                                )}
                            >
                                {isPositive ? "+" : ""}{trend}%
                            </span>
                            <span className="text-slate-500">{trendLabel}</span>
                        </div>
                    )}
                </div>

                {/* Decorative background glow on hover */}
                <div
                    className={cn(
                        "absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                        isPositive ? "bg-risk-low" : isNegative ? "bg-risk-high" : "bg-primary-blue"
                    )}
                />
            </GlassCard>
        </div>
    );
}
