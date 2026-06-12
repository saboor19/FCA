"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, UserCircle, Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../theme-toggle";

const Navbar = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userInitials = user?.name 
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-border-custom bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm transition-all duration-300">
      
      {/* Left Section - Greeting + Brand Touch */}
      <div className="flex items-center gap-4">
 

        <div className="ml-8 pl-8 ">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Good morning,</p>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {user?.name || "Valued Innovator"}
              </h2>
            </div>
            <div className="text-4xl">👋</div>
          </div>
        </div>
      </div>

      {/* Center - Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search projects, courses, or resources..."
            className="w-full bg-background/80 border border-border-custom pl-11 py-3 rounded-2xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
            className="p-3 hover:bg-accent rounded-2xl text-muted-foreground hover:text-foreground transition-all relative group"
            title="Notifications"
          >
            <Bell size={22} />
            
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-card animate-pulse" />
          </button>
          

          {/* Notification Dropdown (Demo) */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-card border border-border-custom rounded-3xl shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-border-custom">
                <p className="font-semibold">Notifications</p>
              </div>
              <div className="max-h-96 overflow-auto text-sm">
                <div className="px-4 py-3 hover:bg-accent/50 cursor-pointer">New project feedback available</div>
                <div className="px-4 py-3 hover:bg-accent/50 cursor-pointer">Course milestone unlocked</div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 pl-4 pr-3 py-2 hover:bg-accent rounded-3xl transition-all group"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-white dark:ring-slate-900">
                {userInitials}
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-foreground leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium tracking-wide">
                  {user?.role || "MEMBER"}
                </p>
              </div>
            </div>

            <ChevronDown 
              size={18} 
              className={`text-muted-foreground transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Profile Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-64 bg-card border border-border-custom rounded-3xl shadow-2xl py-2 z-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-border-custom flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {userInitials}
                </div>
                <div>
                  <p className="font-semibold text-lg">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-1 px-3 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                    {user?.role || "MEMBER"}
                  </span>
                </div>
              </div>



              <div className="py-2">
                <button className="w-full px-6 py-3 text-left hover:bg-accent flex items-center gap-3 text-sm">
                  <UserCircle size={18} /> Profile Settings
                </button>
                <button className="w-full px-6 py-3 text-left hover:bg-accent flex items-center gap-3 text-sm">
                  Billing &amp; Plans
                </button>
              </div>

                                      {/* Theme Toggle */}
                        <div className="pl-4 border-l border-slate-200 dark:border-white/10">
                          <ThemeToggle />
                        </div>

              <div className="border-t border-border-custom pt-2 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-3 text-sm font-medium"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;