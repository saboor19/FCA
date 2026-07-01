"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import button from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SalesTeamTable from "@/components/admin/sales-team/SalesTeamTable";

import {
  deleteSalesTeamMember,
  getSalesTeamMembers,
} from "@/services/admin/salesTeamService";

export default function SalesTeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);

      const response = await getSalesTeamMembers();

      setMembers(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load sales team.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete ${member.userId?.fullName}?`)) return;

    try {
      const response = await deleteSalesTeamMember(member._id);

      toast.success(response.message);

      loadMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete member.");
    }
  };

  return (

    <DashboardLayout role="ADMIN">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales Team</h1>

          <p className="text-sm text-gray-500">
            Manage all sales team members.
          </p>
        </div>

        <Link href="/admin/sales-team/create">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
            Add Member
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-10 text-center">Loading...</div>
      ) : (
        <SalesTeamTable members={members} onDelete={handleDelete} />
      )}
    </div>
    </DashboardLayout>
  );
}
