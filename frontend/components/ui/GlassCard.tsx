"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function GlassCard({ children, className, delay = 0 }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(
                "relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(20,184,166,0.25)] hover:border-teal-400/30",
                className
            )}
        >
            {/* Subtle inner gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-6 h-full">
                {children}
            </div>
        </motion.div>
    );
}
