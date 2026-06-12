"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import { Search, Eye, Filter } from "lucide-react";
import { getAllFees } from "@/services/admin/feeService";

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [batchFilter, setBatchFilter] = useState("ALL");

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await getAllFees();
        // Assuming response structure is { data: [...] }
        setFees(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch fees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  // Calculate unique batches from data
  const batches = useMemo(() => {
    const uniqueBatches = new Set(fees.map((f) => f.batch?.name).filter(Boolean));
    return Array.from(uniqueBatches);
  }, [fees]);

  // Filtered Logic (Derived State)
  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesSearch = fee.student?.userId?.fullName?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || fee.status === statusFilter;
      const matchesBatch = batchFilter === "ALL" || fee.batch?.name === batchFilter;
      return matchesSearch && matchesStatus && matchesBatch;
    });
  }, [search, statusFilter, batchFilter, fees]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-700 border-green-200";
      case "PARTIAL": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-red-100 text-red-700 border-red-200";
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Fee Records..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
          <p className="text-slate-500 mt-1">Manage student fees and payments.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 p-4 bg-card border border-border-custom rounded-xl">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search student..."
              className="w-full pl-10 pr-4 py-2 border border-border-custom rounded-lg bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 border border-border-custom rounded-lg bg-background"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          <select 
            className="px-4 py-2 border border-border-custom rounded-lg bg-background"
            onChange={(e) => setBatchFilter(e.target.value)}
          >
            <option value="ALL">All Batches</option>
            {batches.map((batch) => <option key={batch} value={batch}>{batch}</option>)}
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-border-custom rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr className="text-left text-sm font-semibold">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Final Fee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map((fee) => (
                <tr key={fee._id} className="border-t border-border-custom">
                  <td className="px-6 py-4">
                    <p className="font-medium">{fee.student?.userId?.fullName}</p>
                    <p className="text-xs text-slate-500">{fee.student?.userId?.email}</p>
                  </td>
                  <td className="px-6 py-4">{fee.batch?.name}</td>
                  <td className="px-6 py-4">{fee.course?.title}</td>
                  <td className="px-6 py-4 font-medium">₹{fee.finalFee}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(fee.status)}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/fees/${fee._id}`} className="text-indigo-600 flex items-center gap-2 hover:underline">
                      <Eye size={16} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFees.length === 0 && (
            <div className="p-10 text-center text-slate-500">No records found.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}