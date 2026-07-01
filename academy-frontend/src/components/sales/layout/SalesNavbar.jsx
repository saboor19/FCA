"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SalesTabs from "./SalesTabs";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";
import ThemeToggle from "@/components/theme-toggle";
import { LogOut } from "lucide-react";
export default function SalesNavbar() {

  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      {/* Top utility bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto h-8 px-6 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">
            CRM Module
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-muted-foreground">v2.4.0</span>
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
            <rect
              x="2"
              y="2"
              width="9"
              height="9"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="13"
              y="2"
              width="9"
              height="9"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="2"
              y="13"
              width="9"
              height="9"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="13"
              y="13"
              width="9"
              height="9"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          FUSION CRM
        </Link>

        <SalesTabs />
        <button
          onClick={handleLogout}
          className=" px-6 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-900 flex items-center gap-3 text-sm font-medium"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </header>
  );
}
