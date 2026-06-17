"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Users,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  Award,
  ArrowRight,
  Inbox,
  Loader2,
  Zap,
  TrendingUp,
  BarChart3
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getMyBatches } from "@/services/student/batchService";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 18 },
  },
};

// Study mode color mapping
const studyModeConfig = {
  "ONLINE": { icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Online" },
  "OFFLINE": { icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Offline" },
  "HYBRID": { icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", label: "Hybrid" },
};

const getStudyModeConfig = (mode) => {
  const key = mode?.toUpperCase();
  return studyModeConfig[key] || studyModeConfig["ONLINE"];
};

// Level badge colors
const levelColors = {
  "BEGINNER": "bg-green-100 text-green-700 border-green-200",
  "INTERMEDIATE": "bg-amber-100 text-amber-700 border-amber-200",
  "ADVANCED": "bg-rose-100 text-rose-700 border-rose-200",
};

const getLevelColor = (level) => {
  const key = level?.toUpperCase();
  return levelColors[key] || "bg-slate-100 text-slate-700 border-slate-200";
};

export default function StudentBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [filterMode, setFilterMode] = useState("ALL"); // "ALL" | "ONLINE" | "OFFLINE" | "HYBRID"

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const data = await getMyBatches();
      setBatches(data.batches || []);
    } catch (error) {
      console.error("Failed to load batches:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesFilter =
      filterMode === "ALL" || batch.studyMode?.toUpperCase() === filterMode;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: batches.length,
    online: batches.filter((b) => b.studyMode?.toUpperCase() === "ONLINE").length,
    offline: batches.filter((b) => b.studyMode?.toUpperCase() === "OFFLINE").length,
    hybrid: batches.filter((b) => b.studyMode?.toUpperCase() === "HYBRID").length,
  };

  const StudyModeBadge = ({ mode }) => {
    const config = getStudyModeConfig(mode);
    const Icon = config.icon;
    return (
      <span
        className={`
          inline-flex items-center gap-1.5
          rounded-full border ${config.border} ${config.bg} ${config.color}
          px-3 py-1.5 text-xs font-semibold
          transition-all duration-200
          hover:shadow-sm
        `}
      >
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout role="STUDENT">
      <div className="min-h-[calc(100vh-4rem)] space-y-6 pb-12">
        {/* Hero Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-3xl border border-border-custom bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-6 sm:p-8 lg:p-10"
        >
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Student Portal
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  My Batches
                </h1>
                <p className="max-w-md text-sm text-muted-foreground sm:text-base">
                  Explore your assigned batches, track progress, and access course materials all in one place.
                </p>
              </div>

              {/* Quick Stats */}
              {!loading && batches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 sm:flex-col sm:gap-2"
                >
                  <div className="flex items-center gap-2 rounded-xl bg-card/80 border border-border-custom px-4 py-2 backdrop-blur-sm">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{stats.total} Active</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center justify-center rounded-3xl border border-border-custom bg-card p-12 sm:p-16"
            >
              <div className="relative">
                <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/10" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                Loading your batches...
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fetching your course assignments
              </p>
            </motion.div>
          ) : batches.length === 0 ? (
            /* Empty State */
            <motion.div
              key="empty"
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center justify-center rounded-3xl border border-border-custom bg-card p-8 sm:p-16"
            >
              <div className="relative">
                <div className="absolute inset-0 h-24 w-24 animate-pulse rounded-full bg-primary/5" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <Inbox className="h-12 w-12 text-primary/60" />
                </div>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                  No Batches Assigned Yet
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground sm:text-base">
                  You haven't been assigned to any batches yet. Check back later or contact your administrator.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={loadBatches}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-all hover:bg-primary-hover hover:shadow-lg active:scale-95"
                >
                  <Loader2 className="h-4 w-4" />
                  Refresh
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-custom bg-card px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-muted active:scale-95">
                  <Sparkles className="h-4 w-4" />
                  Contact Support
                </button>
              </div>

              {/* Suggested Actions */}
              <div className="mt-10 grid w-full max-w-lg gap-4 sm:grid-cols-2">
                <div className="group cursor-pointer rounded-2xl border border-border-custom bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">Browse Courses</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Explore available courses and enroll</p>
                </div>
                <div className="group cursor-pointer rounded-2xl border border-border-custom bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-transform group-hover:scale-110">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-foreground">View Schedule</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Check your upcoming classes</p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Batches Content */
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Stats Bar */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-border-custom bg-card p-4 transition-all hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Batches</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border-custom bg-card p-4 transition-all hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stats.online}</p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border-custom bg-card p-4 transition-all hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stats.offline}</p>
                    <p className="text-xs text-muted-foreground">Offline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border-custom bg-card p-4 transition-all hover:shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <TrendingUp className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stats.hybrid}</p>
                    <p className="text-xs text-muted-foreground">Hybrid</p>
                  </div>
                </div>
              </motion.div>

              {/* Search & Filter Bar */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search batches or courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border-custom bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 rounded-xl border border-border-custom bg-card p-1">
                    {["ALL", "ONLINE", "OFFLINE", "HYBRID"].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setFilterMode(mode)}
                        className={`
                          rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                          ${
                            filterMode === mode
                              ? "bg-primary text-white shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                      >
                        {mode === "ALL" ? "All" : mode.charAt(0) + mode.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center rounded-xl border border-border-custom bg-card p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded-lg p-1.5 transition-all ${
                        viewMode === "grid"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-lg p-1.5 transition-all ${
                        viewMode === "list"
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Results Count */}
              {searchQuery || filterMode !== "ALL" ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-muted-foreground"
                >
                  Showing <span className="font-semibold text-foreground">{filteredBatches.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{batches.length}</span> batches
                </motion.p>
              ) : null}

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredBatches.map((batch, index) => {
                      const modeConfig = getStudyModeConfig(batch.studyMode);
                      return (
                        <motion.div
                          key={batch._id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className="group relative overflow-hidden rounded-3xl border border-border-custom bg-card shadow-sm transition-shadow hover:shadow-xl"
                        >
                          {/* Card Header with accent */}
                          <div className="relative h-2 bg-gradient-to-r from-primary/80 via-primary to-primary/60" />

                          <div className="p-5 sm:p-6">
                            {/* Top Row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h2 className="truncate text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                                  {batch.name}
                                </h2>
                                <p className="mt-1 truncate text-sm text-muted-foreground">
                                  {batch.course?.title}
                                </p>
                              </div>
                              <StudyModeBadge mode={batch.studyMode} />
                            </div>

                            {/* Course Info */}
                            <div className="mt-5 space-y-3">
                              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Award className="h-4 w-4" />
                                  <span className="text-xs font-medium">Level</span>
                                </div>
                                <span
                                  className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${getLevelColor(
                                    batch.course?.level
                                  )}`}
                                >
                                  {batch.course?.level || "N/A"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-xs font-medium">Duration</span>
                                </div>
                                <span className="text-sm font-semibold text-foreground">
                                  {batch.course?.duration || "N/A"}
                                </span>
                              </div>

                              {batch.progress !== undefined && (
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-semibold text-primary">{batch.progress}%</span>
                                  </div>
                                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${batch.progress}%` }}
                                      transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <Link
                              href={`/student/batches/${batch._id}`}
                              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg active:scale-[0.98]"
                            >
                              View Batch
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredBatches.map((batch, index) => {
                      const modeConfig = getStudyModeConfig(batch.studyMode);
                      return (
                        <motion.div
                          key={batch._id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                          whileHover={{ x: 4, transition: { duration: 0.2 } }}
                          className="group flex flex-col gap-4 rounded-2xl border border-border-custom bg-card p-4 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-5"
                        >
                          {/* Left: Icon + Info */}
                          <div className="flex flex-1 items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                              <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-base font-bold text-foreground transition-colors group-hover:text-primary">
                                {batch.name}
                              </h3>
                              <p className="truncate text-sm text-muted-foreground">
                                {batch.course?.title}
                              </p>
                            </div>
                          </div>

                          {/* Middle: Meta */}
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <StudyModeBadge mode={batch.studyMode} />
                            <span
                              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${getLevelColor(
                                batch.course?.level
                              )}`}
                            >
                              {batch.course?.level || "N/A"}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{batch.course?.duration || "N/A"}</span>
                            </div>
                          </div>

                          {/* Right: Action */}
                          <Link
                            href={`/student/batches/${batch._id}`}
                            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-md active:scale-95 sm:justify-start"
                          >
                            View
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}

              {/* No Results from Search/Filter */}
              {filteredBatches.length === 0 && batches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center rounded-3xl border border-border-custom bg-card p-12"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No matches found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterMode("ALL");
                    }}
                    className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}