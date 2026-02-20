"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { api, APIResponse } from "@/lib/api";
import { Brain, AlertTriangle, Activity } from "lucide-react";
import { motion } from "framer-motion";

type PredictionForm = {
    amount: number;
    hour_of_day: number;
    transaction_type: string;
    region: string;
};

type PredictionResult = {
    prediction: number;
    probability: number;
    model_version: string;
};

export default function AIAnalysis() {
    const { register, handleSubmit, formState: { errors } } = useForm<PredictionForm>();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: PredictionForm) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Feature Engineering Mapping (Frontend -> Backend Vector)
            // This MUST match the training data feature order:
            // [amount, hour, transaction_type_encoded, region_encoded, ...]
            // For this MVP, we'll verify the backend expectation or just send raw values 
            // if the backend handles preprocessing. 
            // Looking at train_models.py (from memory), it likely expects preprocessed features.
            // Ideally, the backend should expose a 'predict-raw' endpoint that handles encoding.
            // For now, let's assume a simplified feature vector: [amount, hour] + dummy encoding

            // Send structured data matching PredictionRequest in ml_router.py
            const payload = {
                amount: Number(data.amount),
                risk_rating: "Medium", // Derived or default
                region: data.region,
                hour_of_day: Number(data.hour_of_day),
                transaction_type: data.transaction_type
            };

            const response = await api.post<APIResponse<PredictionResult>>('/ml/predict-sla', payload);

            if (response.data.success && response.data.data) {
                setResult(response.data.data);
            } else {
                setError(response.data.error || "Prediction failed");
            }

        } catch (err) {
            console.error(err);
            setError("Failed to connect to AI Service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan to-primary-purple">
                        AI Predictive Analysis
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Real-time SLA Breach & Fraud Probability Engine
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-1">
                    <GlassCard className="h-full">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-primary-teal" />
                            Transaction Parameters
                        </h3>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Amount (USD)</label>
                                <input
                                    type="number"
                                    {...register("amount", { required: true, min: 0 })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-teal transition-colors"
                                    placeholder="e.g. 50000"
                                />
                                {errors.amount && <span className="text-risk-high text-xs">Amount is required</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Hour of Day (0-23)</label>
                                <input
                                    type="number"
                                    {...register("hour_of_day", { required: true, min: 0, max: 23 })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-teal transition-colors"
                                    placeholder="e.g. 14"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Region</label>
                                <select
                                    {...register("region")}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-teal transition-colors [&>option]:bg-slate-900"
                                >
                                    <option value="North America">North America</option>
                                    <option value="Europe">Europe</option>
                                    <option value="APAC">APAC</option>
                                    <option value="LATAM">LATAM</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                                <select
                                    {...register("transaction_type")}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-teal transition-colors [&>option]:bg-slate-900"
                                >
                                    <option value="Transfer">Wire Transfer</option>
                                    <option value="Payment">Payment</option>
                                    <option value="withdrawal">Withdrawal</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <GradientButton
                                    type="submit"
                                    className="w-full justify-center"
                                    isLoading={loading}
                                >
                                    Run Prediction Model
                                </GradientButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-radial from-primary-purple/10 to-transparent opacity-50 pointer-events-none" />

                        {!result && !loading && !error && (
                            <div className="text-center space-y-4 opacity-50">
                                <Brain size={64} className="mx-auto text-slate-500" />
                                <p className="text-lg text-slate-400">Enter parameters to generate AI insight</p>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-primary-cyan animate-pulse">Running Isolation Forest Model...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center space-y-2 text-risk-high animate-fade-in">
                                <AlertTriangle size={48} className="mx-auto" />
                                <p>{error}</p>
                            </div>
                        )}

                        {result && (
                            <div className="w-full max-w-lg space-y-8 animate-slide-up relative z-10">
                                {/* Main Gauge */}
                                <div className="text-center">
                                    <h2 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">SLA Breach Probability</h2>
                                    <div className="relative inline-flex items-center justify-center">
                                        <svg className="w-48 h-48 transform -rotate-90">
                                            <circle cx="96" cy="96" r="88" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                                            <circle
                                                cx="96" cy="96" r="88"
                                                stroke={result.probability > 0.5 ? "#EF4444" : "#14B8A6"}
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={2 * Math.PI * 88}
                                                strokeDashoffset={2 * Math.PI * 88 * (1 - result.probability)}
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-bold text-white">{(result.probability * 100).toFixed(1)}%</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 ${result.prediction === 1 ? "bg-risk-high/20 text-risk-high" : "bg-risk-low/20 text-risk-low"
                                                }`}>
                                                {result.prediction === 1 ? "HIGH RISK" : "SAFE"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Analysis Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                        <p className="text-xs text-slate-400">Model Used</p>
                                        <p className="text-white font-mono mt-1">{result.model_version}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                        <p className="text-xs text-slate-400">Confidence Score</p>
                                        <p className="text-white font-mono mt-1">{(Math.abs(result.probability - 0.5) * 200).toFixed(0)}/100</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </DashboardLayout>
    );
}
