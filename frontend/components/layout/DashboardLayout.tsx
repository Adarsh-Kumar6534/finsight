"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background text-white selection:bg-primary-teal/30">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-all duration-300 ease-in-out">
                <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
