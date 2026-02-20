"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    PieChart,
    Activity,
    Settings,
    LogOut,
    ShieldAlert,
    FileText,
    Brain,
    Users
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: FileText },
    { name: "AI Analysis", href: "/ai-analysis", icon: Brain },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Risk Monitor", href: "/risk", icon: ShieldAlert },
    { name: "Analytics", href: "/analytics", icon: PieChart },
    { name: "Operations", href: "/operations", icon: Activity },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-background/50 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 pb-6 z-50">
            {/* Animated Logo System */}
            <div className="px-6 mb-10 flex items-center gap-3 group translate-x-2">
                {/* Glowing F Emblem */}
                <motion.div
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-[0_0_25px_rgba(20,184,166,0.6)] group-hover:shadow-[0_0_35px_rgba(59,130,246,0.8)] transition-all duration-300 z-10"
                >
                    <div className="absolute inset-[1px] rounded-[11px] bg-[#0B1220]/80 backdrop-blur-sm z-0" />
                    <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-200 font-extrabold text-lg z-10"
                    >
                        F
                    </motion.span>
                </motion.div>

                {/* Staggered Glowing Text */}
                <div className="flex items-baseline space-x-[1px] tracking-wide ml-1">
                    {["i", "n", "S", "i", "g", "h", "t"].map((letter, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                            className={cn(
                                "text-2xl font-bold bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(20,184,166,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300",
                                i < 3 ? "bg-gradient-to-r from-teal-400 to-cyan-300" : "bg-gradient-to-r from-blue-400 to-indigo-400"
                            )}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group overflow-hidden",
                                isActive
                                    ? "text-white bg-gradient-to-r from-teal-500/10 to-blue-500/10 border-l-2 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gradient rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                            )}

                            <Icon
                                size={20}
                                className={cn(
                                    "transition-colors duration-300",
                                    isActive ? "text-primary-teal" : "group-hover:text-white"
                                )}
                            />
                            <span>{item.name}</span>

                            {isActive && (
                                <div className="absolute inset-0 bg-accent-gradient opacity-[0.03]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Settings */}
            <div className="px-4 mt-auto space-y-2">
                <Link href="/settings">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-sm font-medium">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </Link>
                <div className="pt-4 border-t border-white/5 px-2">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
                            {/* Avatar placeholder */}
                            <div className="w-full h-full bg-gradient-to-tr from-slate-600 to-slate-500" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">Admin User</p>
                            <p className="text-xs text-slate-400 truncate">admin@finsight.com</p>
                        </div>
                        <LogOut size={16} className="text-slate-500 hover:text-white cursor-pointer" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
