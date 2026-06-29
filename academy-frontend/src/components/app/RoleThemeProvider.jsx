// components/RoleThemeProvider.jsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const VALID_ROLES = ["STUDENT", "TEACHER", "SALES_TEAM", "ADMIN"];

export default function RoleThemeProvider({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Strip all existing role classes
    document.body.classList.forEach((cls) => {
      if (cls.startsWith("role-")) {
        document.body.classList.remove(cls);
      }
    });
//     // In your AuthContext or RoleThemeProvider
// useEffect(() => {
//   console.log("Auth state:", { user, loading, role: user?.role });
// }, [user, loading]);

    // Normalize role: uppercase from backend -> lowercase for CSS
    const rawRole = user?.role || "SALES_TEAM";
    const role = VALID_ROLES.includes(rawRole) ? rawRole : "SALES_TEAM";
    const cssRole = role.toLowerCase(); // student, teacher, sales_team, admin

    document.body.classList.add(`role-${cssRole}`);

    // Debug
    console.log("[RoleTheme] Applied role class:", `role-${cssRole}`, "User:", user);
  }, [user, loading]);

  // Also handle hydration mismatch by setting initial class ASAP
  useEffect(() => {
    // On mount, if we already have user in context, apply immediately
    if (!loading && user?.role) {
      const cssRole = user.role.toLowerCase();
      if (!document.body.classList.contains(`role-${cssRole}`)) {
        document.body.classList.add(`role-${cssRole}`);
      }
    }
  }, []); // run once on mount

  return <>{children}</>;
}