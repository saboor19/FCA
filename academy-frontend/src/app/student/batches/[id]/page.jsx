"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  MapPin,
  Phone,
  Mail,
  Award,
  X,
  ChevronRight,
  Loader2,
  AlertCircle,
  Layers,
  User,
  Briefcase,
  Sparkles,
  ArrowLeft,
  FileText,
  Hash,
  CalendarDays,
  Star,
  Target,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Link from "next/link";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getMyBatch } from "@/services/student/batchService";

// ─── ANIMATION VARIANTS ───────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

// ─── HELPERS ──────────────────────────────────────────────────────
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateFull = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getLevelColor = (level) => {
  const map = {
    BEGINNER: "bg-emerald-100 text-emerald-700 border-emerald-200",
    INTERMEDIATE: "bg-amber-100 text-amber-700 border-amber-200",
    ADVANCED: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[level?.toUpperCase()] || "bg-slate-100 text-slate-700 border-slate-200";
};

const getStudyModeConfig = (mode) => {
  const map = {
    ONLINE: { icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    OFFLINE: { icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    HYBRID: { icon: Layers, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  };
  return map[mode?.toUpperCase()] || map.ONLINE;
};

// ─── TEACHER MODAL ──────────────────────────────────────────────
function TeacherModal({ teacher, onClose }) {
  if (!teacher) return null;

  const initials = teacher.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "T";

  return (
    <motion.div
      variants={modalOverlay}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border-custom bg-card shadow-2xl"
      >
        {/* Modal Header */}
        <div className="relative">
          <div className="h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            {teacher.profileImage?.fileId ? (
              <img
                src={`/api/files/${teacher.profileImage.fileId}`}
                alt={teacher.fullName}
                className="h-20 w-20 rounded-2xl border-4 border-card object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-primary text-xl font-bold text-white shadow-lg">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="pt-12 pb-6 px-6">
          <h2 className="text-xl font-bold text-foreground">{teacher.fullName}</h2>
          {teacher.qualification && (
            <p className="mt-0.5 text-sm text-muted-foreground">{teacher.qualification}</p>
          )}
          {teacher.specialization && (
            <p className="mt-1 text-xs font-medium text-primary">{teacher.specialization}</p>
          )}

          {/* Quick Info Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {teacher.experience > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-semibold">{teacher.experience} yrs</p>
                </div>
              </div>
            )}
            {teacher.joiningDate && (
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="text-sm font-semibold">{formatDate(teacher.joiningDate)}</p>
                </div>
              </div>
            )}
            {teacher.employeeId && (
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Employee ID</p>
                  <p className="text-sm font-semibold">{teacher.employeeId}</p>
                </div>
              </div>
            )}
            {teacher.gender && (
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-semibold capitalize">{teacher.gender}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact */}
          {(teacher.phone || teacher.address) && (
            <div className="mt-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact
              </h3>
              {teacher.phone && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {teacher.phone}
                </div>
              )}
              {teacher.address && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {teacher.address}
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {teacher.bio && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                About
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">{teacher.bio}</p>
            </div>
          )}

          {/* Modules */}
          {teacher.modules?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Teaching Modules
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {teacher.modules.map((mod) => (
                  <span
                    key={mod._id}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    <Star className="h-3 w-3" />
                    {mod.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────
export default function StudentBatchDetailsPage() {
  const params = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    if (params?.id) loadBatch();
  }, [params?.id]);

  const loadBatch = async () => {
    try {
      const data = await getMyBatch(params.id);
      setBatch(data.batch);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ─── LOADING STATE ────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 h-14 w-14 animate-ping rounded-full bg-primary/10" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-foreground">Loading batch details...</h3>
          <p className="mt-1 text-sm text-muted-foreground">Fetching your course information</p>
        </div>
      </DashboardLayout>
    );
  }

  // ─── NOT FOUND STATE ──────────────────────────────────────────
  if (!batch) {
    return (
      <DashboardLayout role="STUDENT">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[60vh] flex-col items-center justify-center rounded-3xl border border-border-custom bg-card p-8"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-foreground">Batch Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">The batch you're looking for doesn't exist or you don't have access.</p>
          <Link
            href="/student/batches"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Batches
          </Link>
        </motion.div>
      </DashboardLayout>
    );
  }

  const modeConfig = getStudyModeConfig(batch.studyMode);
  const ModeIcon = modeConfig.icon;

  // ─── BATCH CONTENT ──────────────────────────────────────────────
  return (
    <DashboardLayout role="STUDENT">
      <div className="min-h-[calc(100vh-4rem)] space-y-6 pb-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link href="/student/batches" className="transition-colors hover:text-primary">
            My Batches
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{batch.name}</span>
        </motion.div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative overflow-hidden rounded-3xl border border-border-custom bg-card shadow-sm"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border ${modeConfig.border} ${modeConfig.bg} ${modeConfig.color} px-3 py-1 text-xs font-semibold`}>
                    <ModeIcon className="h-3.5 w-3.5" />
                    {batch.studyMode}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getLevelColor(batch.course?.level)}`}>
                    {batch.course?.level || "N/A"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  {batch.name}
                </h1>
                <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                  {batch.course?.title}
                </p>
              </div>

              {/* Date Badge */}
              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border-custom bg-muted/30 p-3 sm:p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-3 rounded-xl border border-border-custom bg-muted/30 px-4 py-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-semibold">{batch.course?.duration || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border-custom bg-muted/30 px-4 py-3">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Modules</p>
                  <p className="text-sm font-semibold">{batch.course?.modules?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border-custom bg-muted/30 px-4 py-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Teachers</p>
                  <p className="text-sm font-semibold">{batch.teachers?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border-custom bg-muted/30 px-4 py-3">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-sm font-semibold">{batch.course?.level || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Description */}
        {batch.course?.description && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="rounded-3xl border border-border-custom bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">About This Course</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {batch.course.description}
            </p>
          </motion.div>
        )}

        {/* Modules Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Course Modules</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {batch.course?.modules?.length || 0} Modules
            </span>
          </div>

          {batch.course?.modules?.length === 0 ? (
            <div className="rounded-2xl border border-border-custom bg-card p-8 text-center text-muted-foreground">
              No modules available for this course yet.
            </div>
          ) : (
            <div className="space-y-3">
              {batch.course?.modules?.map((module, index) => {
                const isExpanded = activeModule === module._id;
                return (
                  <motion.div
                    key={module._id}
                    variants={fadeInUp}
                    layout
                    className={`group cursor-pointer rounded-2xl border transition-all ${
                      isExpanded
                        ? "border-primary/30 bg-card shadow-md"
                        : "border-border-custom bg-card hover:border-primary/20 hover:shadow-sm"
                    }`}
                    onClick={() => setActiveModule(isExpanded ? null : module._id)}
                  >
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      {/* Module Number */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                        isExpanded
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-sm font-semibold sm:text-base ${isExpanded ? "text-primary" : "text-foreground"}`}>
                          {module.title}
                        </h3>
                        {module.description && (
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-sm leading-relaxed text-muted-foreground"
                              >
                                {module.description}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        )}
                      </div>

                      {/* Status / Expand */}
                      <div className="shrink-0">
                        {isExpanded ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Teachers Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Assigned Teachers</h2>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {batch.teachers?.length || 0} Teachers
            </span>
          </div>

          {batch.teachers?.length === 0 ? (
            <div className="rounded-2xl border border-border-custom bg-card p-8 text-center text-muted-foreground">
              No teachers assigned to this batch yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {batch.teachers?.map((teacher) => {
                const initials = teacher.fullName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "T";

                return (
                  <motion.div
                    key={teacher._id}
                    // variants={itemVariants}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    onClick={() => setSelectedTeacher(teacher)}
                    className="group cursor-pointer rounded-2xl border border-border-custom bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      {teacher.profileImage?.fileId ? (
                        <img
                          src={`/api/files/${teacher.profileImage.fileId}`}
                          alt={teacher.fullName}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-border-custom transition-all group-hover:ring-primary/30"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white">
                          {initials}
                        </div>
                      )}

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                          {teacher.fullName}
                        </h3>
                        {teacher.qualification && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{teacher.qualification}</p>
                        )}
                        {teacher.specialization && (
                          <p className="mt-1 text-xs font-medium text-primary">{teacher.specialization}</p>
                        )}

                        {/* Module Tags (max 2 visible) */}
                        {teacher.modules?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {teacher.modules.slice(0, 2).map((mod) => (
                              <span
                                key={mod._id}
                                className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                              >
                                {mod.title}
                              </span>
                            ))}
                            {teacher.modules.length > 2 && (
                              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                +{teacher.modules.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover hint */}
                    <div className="mt-3 flex items-center justify-end text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Click for details
                      <ChevronRight className="ml-1 h-3 w-3" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Teacher Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}