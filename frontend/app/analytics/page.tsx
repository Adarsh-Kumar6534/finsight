"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { api, APIResponse } from "@/lib/api";
import { SimpleAreaChart } from "@/components/charts/SimpleAreaChart";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrendingUp, BarChart2, PieChart as PieIcon, Calendar } from "lucide-react";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Reusing the dashboard analytics endpoint as it provides rich trend data
                const response = await api.get<APIResponse<any>>('/analytics/dashboard');
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-48 bg-white/10 rounded"></div>
                    <div className="h-96 bg-white/10 rounded-2xl"></div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="h-80 bg-white/10 rounded-2xl"></div>
                        <div className="h-80 bg-white/10 rounded-2xl"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Calculated metrics
    const totalVolume = data.kpis.total_volume;
    const avgTransactionSize = totalVolume / data.kpis.total_transactions;
    const successRate = ((1 - data.kpis.sla_breach_rate) * 100).toFixed(1);

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Deep Dive Analytics
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Advanced metrics and historical trend analysis
                    </p>
                </div>
                <div className="flex gap-4">
                    <GlassCard className="px-4 py-2 flex items-center gap-2">
                        <Calendar size={16} className="text-primary-teal" />
                        <span className="text-sm font-mono text-slate-300">Last 30 Days</span>
                    </GlassCard>
                </div>
            </div>

            {/* Main Volume Trend */}
            <div className="mb-8 animate-slide-up">
                <SimpleAreaChart
                    title="Global Transaction Volume"
                    data={data.trend}
                    xKey="day"
                    yKey="volume"
                    height={450}
                    color="#8B5CF6"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Transaction Count Bar Chart */}
                <div className="animate-slide-up [animation-delay:0.1s]">
                    <SimpleBarChart
                        title="Daily Transaction Count"
                        data={data.trend}
                        xKey="day"
                        yKey="count"
                        height={350}
                        color="#EC4899"
                    />
                </div>

                {/* Performance Metrics & Distribution */}
                <GlassCard className="flex flex-col animate-slide-up [animation-delay:0.2s]">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <PieIcon size={20} className="text-primary-cyan" />
                        Performance Distribution
                    </h3>
                    <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Successful', value: parseFloat(successRate) },
                                        { name: 'Failed/SLA Breach', value: 100 - parseFloat(successRate) }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#EF4444" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">{successRate}%</span>
                            <span className="text-xs text-slate-400">Success</span>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up [animation-delay:0.3s]">
                <GlassCard className="p-6">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Avg Transaction Size</p>
                    <p className="text-2xl font-bold text-white font-mono">
                        ${avgTransactionSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                        <TrendingUp size={12} />
                        <span>+4.2% vs last month</span>
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Peak Day Volume</p>
                    <p className="text-2xl font-bold text-white font-mono">
                        $2.4M
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                        recorded on May 12
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Active Regions</p>
                    <p className="text-2xl font-bold text-white font-mono">
                        4
                    </p>
                    <div className="mt-2 text-xs text-slate-500">
                        NA, EU, APAC, LATAM
                    </div>
                </GlassCard>
            </div>
        </DashboardLayout>
    );
}
