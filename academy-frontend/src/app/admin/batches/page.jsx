"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import BatchCard from "@/components/BatchCard"; // Adjust import path as needed

import { getBatches } from "@/services/admin/batchService";

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getBatches();
        setBatches(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Batches..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Batches
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage academy batches, assignments, and capacities.
          </p>
        </div>

        <Link
          href="/admin/batches/create"
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm shrink-0"
        >
          <Plus size={18} />
          Create Batch
        </Link>
      </div>

      {/* BATCHES GRID */}
      {batches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <BatchCard key={batch._id} batch={batch} />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border-custom border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-5 text-purple-400 border border-purple-100 dark:border-purple-500/20">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">No Batches Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 max-w-md leading-relaxed">
            You haven't created any batches yet. Organize your students and courses by creating your first batch.
          </p>
          <Link
            href="/admin/batches/create"
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl transition-colors text-sm font-medium shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200"
          >
            <Plus size={18} />
            Create First Batch
          </Link>
        </div>
      )}

    </DashboardLayout>
  );
}