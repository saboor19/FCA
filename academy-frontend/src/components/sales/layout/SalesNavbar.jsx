"use client";

import Link from "next/link";
import SalesTabs from "./SalesTabs";
import ThemeToggle from "@/components/theme-toggle";

export default function SalesNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-card">
            {/* Top utility bar */}
            <div className="border-b border-border bg-background">
                <div className="max-w-7xl mx-auto h-8 px-6 flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
                        CRM Module
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] text-muted-foreground">
                            v2.4.0
                        </span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Main navigation */}
            <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">
                <Link
                    href="/sales/dashboard"
                    className="flex items-center gap-3 text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                        aria-hidden="true"
                    >
                        <rect x="2" y="2" width="9" height="9" stroke="currentColor" strokeWidth="2" />
                        <rect x="13" y="2" width="9" height="9" stroke="currentColor" strokeWidth="2" />
                        <rect x="2" y="13" width="9" height="9" stroke="currentColor" strokeWidth="2" />
                        <rect x="13" y="13" width="9" height="9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    FUSION CRM
                </Link>

                <SalesTabs />
            </div>
        </header>
    );
}