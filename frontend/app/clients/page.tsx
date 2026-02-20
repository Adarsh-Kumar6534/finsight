"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { api, APIResponse } from "@/lib/api";
import { Search, Users, Shield, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Client {
    client_id: number;
    name: string;
    region: string;
    risk_rating: string;
    joined_date: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const limit = 20;

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await api.get<APIResponse<Client[]>>(`/clients/?skip=${page * limit}&limit=${limit}&search=${search}`);
            if (response.data.success && response.data.data) {
                setClients(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch clients", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchClients, 500);
        return () => clearTimeout(debounce);
    }, [page, search]);

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-purple">
                        Client Management
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Directory of institutional clients and risk profiles
                    </p>
                </div>
            </div>

            <GlassCard className="p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search clients by name or region..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-teal transition-colors"
                    />
                </div>
            </GlassCard>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4 text-white">Client ID</th>
                                <th className="px-6 py-4 text-white">Name</th>
                                <th className="px-6 py-4">Region</th>
                                <th className="px-6 py-4">Risk Rating</th>
                                <th className="px-6 py-4 text-right">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 w-12 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-white/10 rounded"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-white/10 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No clients found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.client_id} className="hover:bg-white/5 transition-colors group cursor-default">
                                        <td className="px-6 py-4 font-mono text-white">#{client.client_id}</td>
                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-xs">
                                                {client.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-primary-purple" />
                                                {client.region}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs border flex w-fit items-center gap-1 ${client.risk_rating === 'High' ? 'bg-risk-high/10 text-risk-high border-risk-high/20' :
                                                    client.risk_rating === 'Medium' ? 'bg-risk-medium/10 text-risk-medium border-risk-medium/20' :
                                                        'bg-risk-low/10 text-risk-low border-risk-low/20'
                                                }`}>
                                                <Shield size={10} />
                                                {client.risk_rating}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono">
                                            {new Date(client.joined_date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm text-slate-500">Page {page + 1}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={clients.length < limit}
                        className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </GlassCard>
        </DashboardLayout>
    );
}
