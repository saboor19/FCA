"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/public/navbar";

const dashboardPrefixes = [
  "/admin",
  "/student",
  "/teacher",
  "/staff"
];

export default function AppNavbar() {
  const pathname =
    usePathname();

  const isDashboardRoute =
    dashboardPrefixes.some((prefix) =>
      pathname?.startsWith(prefix)
    );

  if(isDashboardRoute){
    return null;
  }

  return <Navbar />;
}
