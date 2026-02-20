"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { api, APIResponse } from "@/lib/api";
import { Shield, AlertTriangle, Globe } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export default function RiskMonitor() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<APIResponse<any>>('/risk/overview');
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch risk metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const COLORS = ['#14B8A6', '#F59E0B', '#EF4444']; // Low, Medium, High

    if (loading || !data) {
        return (
            <DashboardLayout>
                <div className="animate-pulse space-y-8">
                    <div className="h-8 w-64 bg-white/10 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-80 bg-white/10 rounded-2xl"></div>
                        <div className="h-80 bg-white/10 rounded-2xl"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-risk-high to-primary-purple">
                        Risk Monitor
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Global exposure analysis and threat detection
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Regional Risk Bar Chart */}
                <GlassCard className="min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Globe size={20} className="text-primary-cyan" />
                        Regional Exposure
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.regional_risk} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" stroke="#64748B" fontSize={12} tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} />
                                <YAxis dataKey="region" type="category" stroke="#fff" fontSize={12} width={100} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                                    formatter={(val: any) => `$${Number(val).toLocaleString()}`}
                                />
                                <Bar dataKey="exposure" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Risk Distribution Pie Chart */}
                <GlassCard className="min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <Shield size={20} className="text-risk-high" />
                        Client Risk Distribution
                    </h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.risk_distribution}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="rating"
                                >
                                    {data.risk_distribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={
                                            entry.rating === 'High' ? '#EF4444' :
                                                entry.rating === 'Medium' ? '#F59E0B' : '#14B8A6'
                                        } />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>

            {/* Flagged Transactions Table */}
            <GlassCard className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle size={20} className="text-risk-high" />
                        Recent Flagged Transactions
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4 text-white">ID</th>
                                <th className="px-6 py-4 text-white">Client</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Region</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.flagged_transactions.map((txn: any) => (
                                <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-white">#{txn.id}</td>
                                    <td className="px-6 py-4">{txn.client}</td>
                                    <td className="px-6 py-4 text-white font-mono">${txn.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">{txn.region}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs border ${txn.status === 'Failed' ? 'bg-risk-high/10 text-risk-high border-risk-high/20' : 'bg-white/10 text-white'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">
                                        {new Date(txn.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </DashboardLayout>
    );
}
