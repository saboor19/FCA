"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
    { label: "Dashboard", href: "/sales/dashboard" },
    { label: "Leads", href: "/sales/leads" },
    { label: "Follow-ups", href: "/sales/followups" },
    { label: "Tasks", href: "/sales/tasks" },
    { label: "Reports", href: "/sales/reports" },
];

export default function SalesTabs() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center h-full">
            {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={clsx(
                            "relative flex items-center h-full px-5 text-[13px] font-semibold tracking-wide uppercase transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                            isActive
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {tab.label}
                        {isActive && (
                            <span
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary"
                                aria-hidden="true"
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}