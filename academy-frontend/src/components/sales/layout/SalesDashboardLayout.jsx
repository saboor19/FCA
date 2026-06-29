"use client";

import SalesNavbar from "./SalesNavbar";

export default function SalesDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <SalesNavbar />

      <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
