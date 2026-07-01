"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SalesTeamDetails from "@/components/admin/sales-team/SalesTeamDetails";

import {
  getSalesTeamMember,
  deleteSalesTeamMember,
} from "@/services/admin/salesTeamService";

export default function SalesTeamMemberPage() {
  const { id } = useParams();
  const router = useRouter();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const response = await getSalesTeamMember(id);
      setMember(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load member.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this member? This action cannot be undone.")) return;
    try {
      const response = await deleteSalesTeamMember(id);
      toast.success(response.message);
      router.push("/admin/sales-team");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete member.");
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <button
            onClick={() => router.push("/admin/sales-team")}
            className="hover:text-[var(--foreground)] transition-colors font-medium"
          >
            Sales Team
          </button>
          <span>/</span>
          <span className="text-[var(--foreground)] font-medium">Member Details</span>
        </div>

        {loading ? (
          <div className="border border-[var(--border)] bg-[var(--card)] p-16 text-center">
            <div className="flex flex-col items-center gap-3 text-[var(--muted-foreground)]">
              <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
              <span className="text-sm font-medium">Loading member details...</span>
            </div>
          </div>
        ) : (
          <SalesTeamDetails member={member} onDelete={handleDelete} />
        )}
      </div>
    </DashboardLayout>
  );
}