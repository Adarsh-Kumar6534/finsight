"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from "recharts";
import { GlassCard } from "../ui/GlassCard";
import { useGlobalSettings } from "@/providers/SettingsProvider";

interface SimpleBarChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[];
    xKey: string;
    yKey: string;
    color?: string;
    height?: number;
    title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value?.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export function SimpleBarChart({
    data,
    xKey,
    yKey,
    color = "#14B8A6",
    height = 300,
    title
}: SimpleBarChartProps) {
    const { settings } = useGlobalSettings();
    const animDuration = settings.dashboard.chartAnimations ? 1500 : 0;

    // Apply the accent color directly from settings, unless the prop explicitly passed is
    // intended to be secondary (like risk/green) to avoid overriding semantic colors
    const isPrimaryColor = color === "#3B82F6" || color === "#14B8A6" || color === "#6366F1";
    let effectiveColor = color;

    if (isPrimaryColor) {
        effectiveColor = settings.theme.accentColor === "teal" ? "#14B8A6" :
            settings.theme.accentColor === "indigo" ? "#6366F1" : "#3B82F6";
    }

    return (
        <GlassCard className="p-0 flex flex-col min-h-[380px]">
            {title && (
                <div className="px-6 pt-6">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
            )}
            <div className="flex-1 w-full p-6 pb-12">
                <div style={{ width: '100%', height: height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`colorBar${yKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={effectiveColor} stopOpacity={1} />
                                    <stop offset="100%" stopColor={effectiveColor} stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey={xKey}
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#64748B"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                            <Bar
                                dataKey={yKey}
                                fill={`url(#colorBar${yKey})`}
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                animationDuration={animDuration}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </GlassCard>
    );
}
