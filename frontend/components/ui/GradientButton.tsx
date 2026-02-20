"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
    isLoading?: boolean;
}

export function GradientButton({
    children,
    className,
    variant = "primary",
    isLoading,
    ...props
}: GradientButtonProps) {
    const baseStyles = "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-[0_0_25px_rgba(20,184,166,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]",
        secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={cn(baseStyles, variants[variant], className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Shine effect overlay */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

            <span className="relative flex items-center justify-center gap-2">
                {isLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {children}
            </span>
        </motion.button>
    );
}
