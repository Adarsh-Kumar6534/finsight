"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { api, APIResponse } from "@/lib/api";
import { Activity, Server, Clock, CheckCircle, AlertOctagon, RefreshCw } from "lucide-react";

interface Operation {
    operation_id: string;
    region: string;
    status: string;
    last_updated: string;
    details: string;
}

export default function OperationsPage() {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchOperations = async () => {
        try {
            const response = await api.get<APIResponse<Operation[]>>('/operations/?limit=50');
            if (response.data.success && response.data.data) {
                setOperations(response.data.data);
                setLastRefreshed(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch operations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOperations();
        intervalRef.current = setInterval(fetchOperations, 5000); // Poll every 5 seconds
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Operational': return <CheckCircle size={16} className="text-primary-teal" />;
            case 'Intervention Required': return <AlertOctagon size={16} className="text-risk-high" />;
            case 'SLA Breach': return <Clock size={16} className="text-risk-medium" />;
            default: return <Activity size={16} className="text-slate-400" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-teal to-primary-cyan">
                        System Operations
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Live operational status and event logs
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-mono">
                    <RefreshCw size={14} className="animate-spin-slow" />
                    Live: {lastRefreshed.toLocaleTimeString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <GlassCard className="flex items-center gap-4 p-6">
                    <div className="p-3 rounded-full bg-primary-teal/10 text-primary-teal">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider">System Status</p>
                        <p className="text-xl font-bold text-white">Operational</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4 p-6">
                    <div className="p-3 rounded-full bg-primary-purple/10 text-primary-purple">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Events (24h)</p>
                        <p className="text-xl font-bold text-white">24,592</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-4 p-6">
                    <div className="p-3 rounded-full bg-risk-medium/10 text-risk-medium">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Avg Latency</p>
                        <p className="text-xl font-bold text-white">42ms</p>
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h3 className="text-lg font-semibold text-white">Live Event Log</h3>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 uppercase font-medium text-xs sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="px-6 py-4 text-white">Ref ID</th>
                                <th className="px-6 py-4 text-white">Region</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && operations.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-48 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-white/10 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : (
                                operations.map((op) => (
                                    <tr key={op.operation_id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-white text-xs">{op.operation_id}</td>
                                        <td className="px-6 py-4">{op.region}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(op.status)}
                                                <span className={
                                                    op.status === 'Operational' ? 'text-primary-teal' :
                                                        op.status === 'SLA Breach' ? 'text-risk-medium' :
                                                            'text-risk-high'
                                                }>{op.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{op.details}</td>
                                        <td className="px-6 py-4 text-right font-mono text-xs">
                                            {new Date(op.last_updated).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </DashboardLayout>
    );
}
