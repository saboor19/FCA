"use client";

import { useEffect, useState } from "react";
import {
  IndianRupee,
  Wallet,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Minus,
  XCircle,
  Receipt,
  CalendarDays,
  BookOpen,
  Users,
  TrendingUp,
  TrendingDown,
  Loader2,
  FileX,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { getMyFees } from "@/services/student/feeService";

/* ── helpers ── */
const statusMeta = {
  PAID: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    darkColor: "dark:text-emerald-400",
    darkBg: "dark:bg-emerald-500/10",
    darkBorder: "dark:border-emerald-500/20",
    label: "Paid",
  },
  PARTIAL: {
    icon: Minus,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    darkColor: "dark:text-amber-400",
    darkBg: "dark:bg-amber-500/10",
    darkBorder: "dark:border-amber-500/20",
    label: "Partial",
  },
  OVERDUE: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    darkColor: "dark:text-red-400",
    darkBg: "dark:bg-red-500/10",
    darkBorder: "dark:border-red-500/20",
    label: "Overdue",
  },
  PENDING: {
    icon: Clock,
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    dot: "bg-sky-500",
    darkColor: "dark:text-sky-400",
    darkBg: "dark:bg-sky-500/10",
    darkBorder: "dark:border-sky-500/20",
    label: "Pending",
  },
};

const getStatusMeta = (status) =>
  statusMeta[status] || {
    icon: XCircle,
    color: "text-[color:var(--muted-foreground)]",
    bg: "bg-[color:var(--muted)]",
    border: "border-[color:var(--border-custom)]",
    dot: "bg-[color:var(--muted-foreground)]",
    darkColor: "",
    darkBg: "",
    darkBorder: "",
    label: status || "Unknown",
  };

const formatCurrency = (amount) =>
  `₹${(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ── component ── */
export default function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const data = await getMyFees();
        setFees(data.fees || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const totalFee = fees.reduce((sum, fee) => sum + (fee.finalFee || 0), 0);
  const totalPaid = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const totalDue = fees.reduce((sum, fee) => sum + (fee.dueAmount || 0), 0);
  const paidPercentage = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;

  return (
    <DashboardLayout role="STUDENT">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
              Finance
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Fee Management
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
              View your fee records and payment details
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
            <Receipt className="h-4 w-4" />
            <span>{fees.length} record{fees.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Fee */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Total Fee
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {formatCurrency(totalFee)}
                </p>
              </div>
              <div className="rounded-xl bg-[color:var(--primary)]/10 p-2.5 text-[color:var(--primary)]">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)]">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>All courses combined</span>
            </div>
          </div>

          {/* Total Paid */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Total Paid
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{paidPercentage}% cleared</span>
            </div>
          </div>

          {/* Total Due */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Total Due
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {formatCurrency(totalDue)}
                </p>
              </div>
              <div className="rounded-xl bg-red-500/10 p-2.5 text-red-600 dark:text-red-400">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{totalDue > 0 ? "Payment required" : "All clear"}</span>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Payment Progress
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {paidPercentage}%
                </p>
              </div>
              <div className="rounded-xl bg-[color:var(--accent)]/10 p-2.5 text-[color:var(--accent)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
              <div
                className="h-full rounded-full bg-[color:var(--accent)] transition-all duration-1000"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] py-16 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[color:var(--primary)]" />
            <p className="mt-4 text-sm font-medium text-[color:var(--muted-foreground)]">
              Loading fee records...
            </p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && fees.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] py-16 shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--muted)]">
              <FileX className="h-7 w-7 text-[color:var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold">No fee records found</h3>
            <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
              Your fee records will appear here once they are added.
            </p>
          </div>
        )}

        {/* ── Fee Cards ── */}
        {!loading && fees.length > 0 && (
          <div className="space-y-4">
            {fees.map((fee) => {
              const meta = getStatusMeta(fee.status);
              const StatusIcon = meta.icon;
              const progress = fee.finalFee > 0
                ? Math.round(((fee.finalFee - fee.dueAmount) / fee.finalFee) * 100)
                : 0;

              return (
                <div
                  key={fee._id}
                  className="overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm transition-all hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex flex-col gap-4 border-b border-[color:var(--border-custom)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{fee.course?.title || "Untitled Course"}</h3>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[color:var(--muted-foreground)]">
                          <Users className="h-3 w-3" />
                          <span>{fee.batch?.name || "No batch"}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${meta.bg} ${meta.color} ${meta.border} ${meta.darkBg} ${meta.darkColor} ${meta.darkBorder} w-fit`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {meta.label}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 py-5">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="rounded-xl bg-[color:var(--muted)] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)]">
                          <Receipt className="h-3.5 w-3.5" />
                          Final Fee
                        </div>
                        <p className="mt-1 text-lg font-bold">
                          {formatCurrency(fee.finalFee)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[color:var(--muted)] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)]">
                          <Wallet className="h-3.5 w-3.5" />
                          Paid
                        </div>
                        <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(fee.paidAmount)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[color:var(--muted)] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Due
                        </div>
                        <p className="mt-1 text-lg font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(fee.dueAmount)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[color:var(--muted)] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)]">
                          <CreditCard className="h-3.5 w-3.5" />
                          Payment Type
                        </div>
                        <p className="mt-1 text-lg font-bold">
                          {fee.paymentType || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-[color:var(--muted-foreground)]">
                          Payment Progress
                        </span>
                        <span className="font-bold text-[color:var(--primary)]">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--muted)]">
                        <div
                          className="h-full rounded-full bg-[color:var(--primary)] transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Next Due Date */}
                    {fee.nextDueDate && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[color:var(--border-custom)] bg-[color:var(--muted)] px-4 py-3">
                        <CalendarDays className="h-4 w-4 text-[color:var(--muted-foreground)]" />
                        <div>
                          <p className="text-xs font-medium text-[color:var(--muted-foreground)]">
                            Next Due Date
                          </p>
                          <p className="text-sm font-semibold">
                            {formatDate(fee.nextDueDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}