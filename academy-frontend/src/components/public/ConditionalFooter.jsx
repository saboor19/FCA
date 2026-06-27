// components/layout/ConditionalFooter.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/public/Footer";

export default function ConditionalFooter() {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return <Footer />;
}