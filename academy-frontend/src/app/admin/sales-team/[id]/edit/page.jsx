"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import SalesTeamForm from "@/components/admin/sales-team/SalesTeamForm";

import {
  getSalesTeamMember,
  getSalesTeamMembers,
  updateSalesTeamMember,
} from "@/services/admin/salesTeamService";
  import DashboardLayout from "@/components/dashboard/DashboardLayout";
export default function EditSalesTeamMemberPage() {
  const { id } = useParams();

  const router = useRouter();

  const [member, setMember] = useState(null);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);


  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setPageLoading(true);

      const [memberRes, managersRes] = await Promise.all([
        getSalesTeamMember(id),
        getSalesTeamMembers(),
      ]);

      setMember(memberRes.data);

      // Prevent selecting self as manager
      setManagers(
        (managersRes.data || []).filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load member."
      );
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const payload = { ...formData };

      // Password isn't updated from this page
      delete payload.password;

      const response = await updateSalesTeamMember(
        id,
        payload
      );

      toast.success(response.message);

      router.push(`/admin/sales-team/${id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update member."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="rounded-lg bg-white p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Edit Sales Team Member
        </h1>

        <p className="text-sm text-gray-500">
          Update sales team member information.
        </p>
      </div>

      <SalesTeamForm
        initialData={member}
        managers={managers}
        loading={loading}
        isEdit
        onSubmit={handleSubmit}
      />
    </div>
    </DashboardLayout>
  );
}