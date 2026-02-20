"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/kpi/KpiCard";
import { SimpleAreaChart } from "@/components/charts/SimpleAreaChart";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { RefreshCcw, AlertTriangle, Shield, Activity, DollarSign } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { useGlobalSettings } from "@/providers/SettingsProvider";

export default function Dashboard() {
  const { data, isLoading, error, lastUpdated, refetch } = useAnalytics();
  const { settings } = useGlobalSettings();

  const isCompact = settings.dashboard.compactMode;

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <AlertTriangle size={48} className="text-risk-high mb-4" />
          <h2 className="text-2xl font-bold">System Connection Failed</h2>
          <p className="text-slate-400">{error}</p>
          <GradientButton onClick={refetch}>Retry Connection</GradientButton>
        </div>
      </DashboardLayout>
    );
  }

  // Loading Skeleton
  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Risk Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time exposure analysis & SLA monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500 font-mono">
            UPDATED: {lastUpdated?.toLocaleTimeString()}
          </div>
          <button
            onClick={refetch}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${isCompact ? 'gap-4' : 'gap-6'}`}>
        <KpiCard
          title="Total Volume (7d)"
          value={data.kpis.total_volume}
          prefix={settings.data.currency === "USD" ? "$" : settings.data.currency === "EUR" ? "€" : "£"}
          trend={12.5}
          delay={0}
        />
        <KpiCard
          title="Transaction Count"
          value={data.kpis.total_transactions}
          trend={-2.4}
          delay={0.1}
        />
        <KpiCard
          title="High Risk Clients"
          value={data.kpis.high_risk_count}
          trend={5.0}
          trendLabel="vs yesterday"
          delay={0.2}
        />
        <KpiCard
          title="SLA Breach Rate"
          value={data.kpis.sla_breach_rate ? data.kpis.sla_breach_rate.toFixed(2) : "0.00"}
          suffix="%"
          trend={-0.5}
          trendLabel="improvement"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 ${isCompact ? 'gap-4 mb-6' : 'gap-8 mb-12'}`}>
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 animate-slide-up relative z-0" style={{ animationDelay: '0.4s' }}>
          <SimpleAreaChart
            title="Transaction Volume Trend"
            data={data.trend}
            xKey="day"
            yKey="volume"
            height={340}
            color="#3B82F6"
          />
        </div>

        {/* Risk Distribution / Secondary Chart */}
        <div className="animate-slide-up relative z-0" style={{ animationDelay: '0.5s' }}>
          <SimpleBarChart
            title="Volume Count"
            data={data.trend}
            xKey="day"
            yKey="count"
            height={340}
            color="#14B8A6"
          />
        </div>
      </div>

      {/* High Risk Exposure Table */}
      <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <GlassCard className="p-0">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield size={20} className="text-risk-high" />
              Highest Risk Exposure
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-risk-high/10 text-risk-high border border-risk-high/20">
              Top 50 Segments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-white/5 uppercase font-medium text-xs">
                <tr>
                  <th className="px-6 py-3 text-white">Client Rank</th>
                  <th className="px-6 py-3 text-white">Client Name</th>
                  <th className="px-6 py-3">Region</th>
                  <th className="px-6 py-3">Risk Rating</th>
                  <th className="px-6 py-3 text-right">Total Exposure</th>
                  <th className="px-6 py-3 text-right">Quartile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.risk_distribution.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No high risk clients detected.
                    </td>
                  </tr>
                ) : (
                  data.risk_distribution.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/5 transition-colors group cursor-default"
                    >
                      <td className="px-6 py-4 font-mono text-white">#{item.region_rank}</td>
                      <td className="px-6 py-4 font-medium text-white group-hover:text-primary-teal transition-colors">
                        {item.name}
                      </td>
                      <td className="px-6 py-4">{item.region}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs border ${item.risk_rating === 'High' ? 'bg-risk-high/10 text-risk-high border-risk-high/20' :
                          item.risk_rating === 'Medium' ? 'bg-risk-medium/10 text-risk-medium border-risk-medium/20' :
                            'bg-risk-low/10 text-risk-low border-risk-low/20'
                          }`}>
                          {item.risk_rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-white font-mono">
                        ${item.total_exposure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right">Q{item.exposure_quartile}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
