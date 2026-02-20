"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { api, APIResponse } from "@/lib/api";
import { ArrowLeft, ArrowRight, Search, FileText, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

type Transaction = {
    transaction_id: string;
    client_id: string;
    amount: number;
    currency: string;
    status: string;
    transaction_date: string;
    risk_rating: string;
    sla_breach_flag: boolean;
};

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const LIMIT = 20;

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get<APIResponse<Transaction[]>>(`/transactions?skip=${page * LIMIT}&limit=${LIMIT}`);
            if (response.data.success && response.data.data) {
                setTransactions(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string, slaBreach: boolean) => {
        if (slaBreach) return <span className="px-2 py-1 rounded bg-risk-high/10 text-risk-high border border-risk-high/20 text-xs flex items-center gap-1"><AlertTriangle size={12} /> SLA Breach</span>;
        if (status === 'Failed') return <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/20 text-xs flex items-center gap-1"><XCircle size={12} /> Failed</span>;
        return <span className="px-2 py-1 rounded bg-teal-500/10 text-teal-500 border border-teal-500/20 text-xs flex items-center gap-1"><CheckCircle size={12} /> Success</span>;
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-6 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Transaction History
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Audit trail of all processed financial operations
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-400" />
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowRight size={20} className="text-slate-400" />
                    </button>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden min-h-[600px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 uppercase font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4 text-white">Transaction ID</th>
                                <th className="px-6 py-4 text-white">Client ID</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                // Skeleton Rows
                                [...Array(10)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20 ml-auto"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                                    </tr>
                                ))
                            ) : (
                                transactions.map((txn) => (
                                    <tr key={txn.transaction_id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-white flex items-center gap-2">
                                            <FileText size={14} className="text-slate-500 group-hover:text-primary-cyan transition-colors" />
                                            {txn.transaction_id}
                                        </td>
                                        <td className="px-6 py-4">{txn.client_id}</td>
                                        <td className="px-6 py-4 text-right font-mono text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: txn.currency }).format(txn.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {txn.transaction_date ? format(new Date(txn.transaction_date), 'MMM dd, HH:mm:ss') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(txn.status, txn.sla_breach_flag)}
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
