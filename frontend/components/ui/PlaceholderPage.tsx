"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Hammer } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary-teal/20 blur-xl rounded-full" />
                    <Hammer size={64} className="relative text-primary-teal" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {title}
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        This module is currently under development.
                    </p>
                </div>
                <GlassCard className="max-w-md p-6 mt-8">
                    <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
                    <p className="text-sm text-slate-400">
                        We are actively building the {title} interface. Check back shortly for updates on Phase 6.
                    </p>
                </GlassCard>
            </div>
        </DashboardLayout>
    );
}
