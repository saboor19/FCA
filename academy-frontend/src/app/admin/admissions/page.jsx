"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { getAdmissions } from "@/services/admin/admissionService";

import AdmissionTable from "@/components/admin/admissions/AdmissionTable";

export default function AdmissionsPage() {
  const [status, setStatus] = useState("PENDING");

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissions();
  }, [status]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);

      const response = await getAdmissions(status);

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admissions</h1>

          <p className="text-slate-500">Manage student applications</p>
        </div>

        {/* FILTERS */}

        <div className="flex gap-3">
          {["PENDING", "APPROVED", "REJECTED"].map((item) => (
            <button
              key={item}
              onClick={() => setStatus(item)}
              className={`px-4 py-2 rounded-xl border ${
                status === item
                  ? "bg-yellow-500 text-black"
                  : "bg-white dark:bg-slate-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <AdmissionTable
          requests={requests}
          loading={loading}
          refresh={fetchAdmissions}
        />
      </div>
    </DashboardLayout>
  );
}
