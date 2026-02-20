"use client";

import { useState, useEffect, useCallback } from "react";
import { APIResponse, api } from "@/lib/api";

type AnalyticsData = {
    kpis: {
        total_volume: number;
        total_transactions: number;
        high_risk_count: number;
        sla_breach_rate: number;
    };
    trend: Array<{
        day: string;
        volume: number;
        count: number;
        rolling_7d_avg: number;
    }>;
    risk_distribution: Array<{
        client_id: number;
        name: string;
        risk_rating: string;
        region: string;
        total_exposure: number;
        region_rank: number;
        exposure_quartile: number;
    }>;
};

export function useAnalytics(pollIntervalMs = 30000) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        try {
            // setIsLoading(true); // Don't set loading on poll to avoid flicker
            const response = await api.get<APIResponse<AnalyticsData>>('/analytics/dashboard');

            if (response.data.success) {
                setData(response.data.data);
                setLastUpdated(new Date());
                setError(null);
            } else {
                setError(response.data.error || "Failed to fetch data");
            }
        } catch (err) {
            console.error("Analytics fetch error:", err);
            setError("Connection error. Is the backend running?");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        if (pollIntervalMs > 0) {
            const interval = setInterval(fetchData, pollIntervalMs);
            return () => clearInterval(interval);
        }
    }, [fetchData, pollIntervalMs]);

    return { data, isLoading, error, lastUpdated, refetch: fetchData };
}
