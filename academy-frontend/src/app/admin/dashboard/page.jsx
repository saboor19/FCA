"use client"

import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Users,
  BookOpen,
  GraduationCap,
  Wallet,
  Calendar,
  Bell,
  IndianRupee ,
  TrendingUp,
  UserPlus,
  Clock,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

// Import all required services
import { getStudents } from "@/services/admin/studentService";
import { getCourses } from "@/services/admin/courseService";
import { getBatches } from "@/services/admin/batchService";
import { getTeachers } from "@/services/admin/teacherService";
import { getEnrollments } from "@/services/admin/enrollmentService";
import { getNotices } from "@/services/admin/noticeService";
import { getFinanceOverview } from "@/services/admin/financeService";
import { getAllFees } from "@/services/admin/feeService";

const AdminDashboard = () => {
  // State for all dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBatches: 0,
    totalCourses: 0,
    monthlyRevenue: 0,
    pendingFees: 0,
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [upcomingDueFees, setUpcomingDueFees] = useState([]);
  const [batchStats, setBatchStats] = useState([]);
  const [financeOverview, setFinanceOverview] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Main data fetching function
  const fetchDashboardData = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Fetch all required data in parallel
      const [
        studentsRes,
        teachersRes,
        batchesRes,
        coursesRes,
        enrollmentsRes,
        noticesRes,
        financeRes,
        feesRes,
      ] = await Promise.allSettled([
        getStudents(),
        getTeachers(),
        getBatches(),
        getCourses(),
        getEnrollments(),
        getNotices(),
        getFinanceOverview(),
        getAllFees(),
      ]);

      // Process students
      let totalStudents = 0;
      if (studentsRes.status === "fulfilled" && studentsRes.value?.data) {
        totalStudents = Array.isArray(studentsRes.value.data)
          ? studentsRes.value.data.length
          : studentsRes.value.data?.students?.length || 0;
      }

      // Process teachers
      let totalTeachers = 0;
      if (teachersRes.status === "fulfilled" && teachersRes.value?.data) {
        totalTeachers = Array.isArray(teachersRes.value.data)
          ? teachersRes.value.data.length
          : teachersRes.value.data?.teachers?.length || 0;
      }

      // Process batches
      let batches = [];
      let totalBatches = 0;
      if (batchesRes.status === "fulfilled" && batchesRes.value?.data) {
        batches = Array.isArray(batchesRes.value.data)
          ? batchesRes.value.data
          : batchesRes.value.data?.batches || [];
        totalBatches = batches.length;
      }

      // Process courses
      let totalCourses = 0;
      let activeCourses = 0;
      if (coursesRes.status === "fulfilled" && coursesRes.value?.data) {
        const courses = Array.isArray(coursesRes.value.data)
          ? coursesRes.value.data
          : coursesRes.value.data?.courses || [];
        totalCourses = courses.length;
        activeCourses = courses.filter((c) => c.isPublished !== false).length;
        totalCourses = activeCourses; // Show only active/published courses
      }

      // Process enrollments for recent activity
      let enrollments = [];
      if (enrollmentsRes.status === "fulfilled" && enrollmentsRes.value?.data) {
        enrollments = Array.isArray(enrollmentsRes.value.data)
          ? enrollmentsRes.value.data
          : enrollmentsRes.value.data?.enrollments || [];
        // Sort by createdAt descending and take first 5
        const sorted = [...enrollments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentEnrollments(sorted.slice(0, 5));
      } else {
        setRecentEnrollments([]);
      }

      // Process notices
      let notices = [];
      if (noticesRes.status === "fulfilled" && noticesRes.value?.data) {
        notices = Array.isArray(noticesRes.value.data)
          ? noticesRes.value.data
          : noticesRes.value.data?.notices || [];
        const sortedNotices = [...notices].sort(
          (a, b) => new Date(b.publishDate || b.createdAt) - new Date(a.publishDate || a.createdAt)
        );
        setRecentNotices(sortedNotices.slice(0, 5));
      } else {
        setRecentNotices([]);
      }

      // Process finance overview
      let monthlyRevenue = 0;
      let pendingFees = 0;
      if (financeRes.status === "fulfilled" && financeRes.value?.data) {
        const financeData = financeRes.value.data;
        setFinanceOverview(financeData);
        monthlyRevenue = financeData.totalRevenueThisMonth || financeData.monthlyRevenue || 0;
        pendingFees = financeData.totalPendingFees || 0;
      }

      // Process fees for upcoming due (if finance overview doesn't provide)
      let upcomingFees = [];
      if (feesRes.status === "fulfilled" && feesRes.value?.data) {
        let allFees = Array.isArray(feesRes.value.data)
          ? feesRes.value.data
          : feesRes.value.data?.fees || [];
        // Filter for pending or partial payment status with due amount > 0
        const pendingFeesList = allFees.filter(
          (fee) =>
            (fee.status === "PENDING" || fee.status === "PARTIAL") &&
            fee.dueAmount > 0
        );
        // Sort by nextDueDate or dueAmount
        const sortedDue = [...pendingFeesList].sort((a, b) => {
          if (a.nextDueDate && b.nextDueDate) {
            return new Date(a.nextDueDate) - new Date(b.nextDueDate);
          }
          return b.dueAmount - a.dueAmount;
        });
        upcomingFees = sortedDue.slice(0, 5);
        setUpcomingDueFees(upcomingFees);

        // If finance overview didn't provide pending fees, calculate from fees data
        if (!pendingFees) {
          pendingFees = pendingFeesList.reduce((sum, fee) => sum + (fee.dueAmount || 0), 0);
        }
      } else {
        setUpcomingDueFees([]);
      }

      // Process batch statistics (students count per batch)
      const batchStatsData = batches.map((batch) => ({
        id: batch._id,
        name: batch.name,
        studentCount: batch.students?.length || 0,
        isActive: batch.isActive,
        startDate: batch.startDate,
        endDate: batch.endDate,
        studyMode: batch.studyMode,
      }));
      // Sort by student count descending and take top 5
      const sortedBatches = [...batchStatsData].sort(
        (a, b) => b.studentCount - a.studentCount
      );
      setBatchStats(sortedBatches.slice(0, 5));

      // Update stats
      setStats({
        totalStudents,
        totalTeachers,
        totalBatches,
        totalCourses,
        monthlyRevenue,
        pendingFees,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please refresh the page.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Loading skeleton
  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Loading academy performance data...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card p-6 rounded-2xl border border-border-custom animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border-custom h-64 animate-pulse"></div>
          <div className="bg-card p-6 rounded-2xl border border-border-custom h-64 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Stats cards configuration
  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: <Users className="text-blue-600 dark:text-blue-400" size={24} />,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      trend: "+active",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers.toLocaleString(),
      icon: <GraduationCap className="text-emerald-600 dark:text-emerald-400" size={24} />,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      trend: "+faculty",
    },
    {
      title: "Total Batches",
      value: stats.totalBatches.toLocaleString(),
      icon: <Calendar className="text-purple-600 dark:text-purple-400" size={24} />,
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Active Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: <BookOpen className="text-orange-600 dark:text-orange-400" size={24} />,
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(stats.monthlyRevenue),
      icon: <TrendingUp className="text-green-600 dark:text-green-400" size={24} />,
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Pending Fees",
      value: formatCurrency(stats.pendingFees),
      icon: <IndianRupee  className="text-rose-600 dark:text-rose-400" size={24} />,
      bgColor: "bg-rose-100 dark:bg-rose-900/20",
    },
  ];

  return (
    <DashboardLayout role="ADMIN">
      {/* Header Section with Refresh */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time overview of academy performance and financial metrics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-card p-5 rounded-2xl border border-border-custom shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>{stat.icon}</div>
              {stat.trend && (
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              )}
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area - 2 Column Layout */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Recent Enrollments */}
          <div className="bg-card rounded-2xl border border-border-custom overflow-hidden">
            <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-blue-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Enrollments
                </h2>
              </div>
              <span className="text-xs text-slate-400">Last 5 enrollments</span>
            </div>
            <div className="divide-y divide-border-custom">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment, idx) => (
                  <div key={idx} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {enrollment.student?.userId?.fullName ||
                            enrollment.student?.name ||
                            `Student ${enrollment.student?._id?.slice(-6) || "N/A"}`}
                        </p>
                        <p className="text-sm text-slate-500">
                          Batch: {enrollment.batch?.name || "N/A"} •{" "}
                          {formatDate(enrollment.createdAt)}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  No recent enrollments found
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Due Fees */}
          <div className="bg-card rounded-2xl border border-border-custom overflow-hidden">
            <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee  size={20} className="text-rose-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Upcoming Due Fees
                </h2>
              </div>
              <span className="text-xs text-slate-400">Pending payments</span>
            </div>
            <div className="divide-y divide-border-custom">
              {upcomingDueFees.length > 0 ? (
                upcomingDueFees.map((fee, idx) => (
                  <div key={idx} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">
                          {fee.student?.userId?.fullName ||
                            fee.student?.name ||
                            `Student ${fee.student?._id?.slice(-6) || "N/A"}`}
                        </p>
                        <p className="text-sm text-slate-500">
                          Due: {formatCurrency(fee.dueAmount)} •{" "}
                          {fee.nextDueDate
                            ? `Due by ${formatDate(fee.nextDueDate)}`
                            : "No due date"}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          fee.status === "PARTIAL"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  No pending fees found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Notices */}
          <div className="bg-card rounded-2xl border border-border-custom overflow-hidden">
            <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Recent Notices
                </h2>
              </div>
              <span className="text-xs text-slate-400">Latest announcements</span>
            </div>
            <div className="divide-y divide-border-custom">
              {recentNotices.length > 0 ? (
                recentNotices.map((notice, idx) => (
                  <div key={idx} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-foreground">{notice.title}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              notice.priority === "HIGH"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : notice.priority === "MEDIUM"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {notice.priority || "MEDIUM"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                          {notice.description?.substring(0, 80)}
                          {notice.description?.length > 80 ? "..." : ""}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(notice.publishDate || notice.createdAt)} •{" "}
                          {notice.type || "GENERAL"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  No recent notices found
                </div>
              )}
            </div>
          </div>

          {/* Top Batches by Student Count */}
          <div className="bg-card rounded-2xl border border-border-custom overflow-hidden">
            <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={20} className="text-emerald-500" />
                <h2 className="text-lg font-semibold text-foreground">
                  Top Batches by Enrollment
                </h2>
              </div>
              <span className="text-xs text-slate-400">Student count</span>
            </div>
            <div className="divide-y divide-border-custom">
              {batchStats.length > 0 ? (
                batchStats.map((batch, idx) => (
                  <div key={idx} className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{batch.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              batch.studyMode === "ONLINE"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30"
                                : batch.studyMode === "OFFLINE"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30"
                            }`}
                          >
                            {batch.studyMode || "OFFLINE"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              batch.isActive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800"
                            }`}
                          >
                            {batch.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">
                          {batch.studentCount}
                        </p>
                        <p className="text-xs text-slate-500">students</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-slate-500">
                  No batch data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats Row */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-blue-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              System Status
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">Operational</p>
          <p className="text-xs text-slate-500">All services running</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Avg. Batch Size
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {stats.totalStudents && stats.totalBatches
              ? Math.round(stats.totalStudents / stats.totalBatches)
              : 0}{" "}
            students/batch
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-purple-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Course Completion
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">—</p>
          <p className="text-xs text-slate-500">Coming soon</p>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-rose-100 dark:border-rose-800">
          <div className="flex items-center gap-2">
            <Wallet size={18} className="text-rose-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Collection Rate
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground mt-1">
            {stats.monthlyRevenue && stats.pendingFees
              ? Math.round(
                  (stats.monthlyRevenue / (stats.monthlyRevenue + stats.pendingFees)) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;