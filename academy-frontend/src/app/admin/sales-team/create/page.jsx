"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import SalesTeamForm from "@/components/admin/sales-team/SalesTeamForm";

import {
  createSalesTeamMember,
  getSalesTeamMembers,
} from "@/services/admin/salesTeamService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function CreateSalesTeamPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      const response = await getSalesTeamMembers();

      setManagers(response.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load managers."
      );
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const response =
        await createSalesTeamMember(formData);

      toast.success(response.message);

      router.push("/admin/sales-team");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create sales team member."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
    <div className="space-y-6">


      <SalesTeamForm
        managers={managers}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
    </DashboardLayout>
  );
}