"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Pencil,
  Save,
  UserCheck,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import {
  getBatchAttendance,
  getTeacherAttendance,
  markStudentAttendance,
  markTeacherAttendance,
} from "@/services/admin/attendanceService";

import { getBatches } from "@/services/admin/batchService";

const STATUSES = ["PRESENT", "ABSENT", "LATE", "LEAVE"];

const statusConfig = {
  PRESENT: {
    label: "Present",
    icon: CheckCircle2,
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  },
  ABSENT: {
    label: "Absent",
    icon: XCircle,
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300",
  },
  LATE: {
    label: "Late",
    icon: Clock3,
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  },
  LEAVE: {
    label: "Leave",
    icon: UserCheck,
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-300",
  },
  NOT_MARKED: {
    label: "Not marked",
    icon: Clock3,
    className:
      "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

const today = () => new Date().toISOString().split("T")[0];

const getStats = (records) => {
  return records.reduce(
    (stats, record) => {
      const status = record.status || "NOT_MARKED";

      stats[status] = (stats[status] || 0) + 1;

      return stats;
    },
    {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      LEAVE: 0,
      NOT_MARKED: 0,
    },
  );
};

const getSaveStatus = (status) =>
  status === "NOT_MARKED" ? "PRESENT" : status;

const StatCard = ({ status, value }) => {
  const config = statusConfig[status];

  const Icon = config.icon;

  return (
    <div
      className={`
      rounded-lg
      border
      p-4
      ${config.className}
    `}
    >
      <div
        className="
        mb-3
        flex
        items-center
        justify-between
      "
      >
        <span className="text-sm font-medium">{config.label}</span>
        <Icon size={18} />
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const safeStatus = statusConfig[status] ? status : "NOT_MARKED";

  const config = statusConfig[safeStatus];

  const Icon = config.icon;

  return (
    <span
      className={`
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      px-3
      py-1.5
      text-xs
      font-semibold
      ${config.className}
    `}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

const PersonCard = ({
  mode,
  person,
  onRemarksChange,
  onStatusChange,
  subtitle,
}) => {
  return (
    <article
      className="
      rounded-lg
      border
      border-border-custom
      bg-card
      p-4
      shadow-sm
    "
    >
      <div
        className="
        flex
        items-start
        justify-between
        gap-3
      "
      >
        <div
          className="
          flex
          min-w-0
          items-start
          gap-3
        "
        >
          <div
            className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-slate-900
            text-white
            dark:bg-slate-100
            dark:text-slate-900
          "
          >
            <UserRound size={18} />
          </div>
          <div className="min-w-0">
            <h3
              className="
              truncate
              text-sm
              font-semibold
              text-foreground
            "
            >
              {person.fullName}
            </h3>
            <p
              className="
              mt-1
              truncate
              text-xs
              text-slate-500
              dark:text-slate-400
            "
            >
              {subtitle}
            </p>
          </div>
        </div>

        {mode === "read" ? (
          <StatusBadge status={person.status} />
        ) : (
          <select
            value={getSaveStatus(person.status)}
            onChange={(event) => onStatusChange(person.id, event.target.value)}
            className="
              shrink-0
              rounded-lg
              border
              border-border-custom
              bg-background
              px-3
              py-2
              text-xs
              font-medium
              outline-none
              focus:ring-2
              focus:ring-slate-900
              dark:focus:ring-slate-100
            "
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </select>
        )}
      </div>

      {mode === "mark" && (
        <input
          type="text"
          value={person.remarks || ""}
          onChange={(event) => onRemarksChange(person.id, event.target.value)}
          placeholder="Remarks"
          className="
            mt-4
            w-full
            rounded-lg
            border
            border-border-custom
            bg-background
            px-3
            py-2
            text-sm
            outline-none
            placeholder:text-slate-400
            focus:ring-2
            focus:ring-slate-900
            dark:focus:ring-slate-100
          "
        />
      )}
    </article>
  );
};

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("students");

  const [mode, setMode] = useState("read");

  const [date, setDate] = useState(today);

  const [batches, setBatches] = useState([]);

  const [selectedBatch, setSelectedBatch] = useState("");

  const [students, setStudents] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const loadBatches = useCallback(async () => {
    try {
      const response = await getBatches();

      const batchList = response.data || [];

      setBatches(batchList);

      if (!selectedBatch && batchList.length > 0) {
        setSelectedBatch(batchList[0]._id);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load batches");
    }
  }, [selectedBatch]);

  const loadStudentAttendance = useCallback(
    async (batchId = selectedBatch) => {
      if (!batchId) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getBatchAttendance(batchId, date);

        setStudents(
          (response.data || []).map((student) => ({
            ...student,
            id: student.enrollmentId,
          })),
        );
      } catch (error) {
        console.error(error);
        setError("Failed to load student attendance");
      } finally {
        setLoading(false);
      }
    },
    [date, selectedBatch],
  );

  const loadTeacherAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTeacherAttendance(date);

      setTeachers(
        (response.data || []).map((teacher) => ({
          ...teacher,
          id: teacher.teacherId,
        })),
      );
    } catch (error) {
      console.error(error);
      setError("Failed to load teacher attendance");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  useEffect(() => {
    if (activeTab === "students") {
      loadStudentAttendance();
    }

    if (activeTab === "teachers") {
      loadTeacherAttendance();
    }
  }, [activeTab, loadStudentAttendance, loadTeacherAttendance]);

  const visibleRecords = activeTab === "students" ? students : teachers;

  const stats = useMemo(() => getStats(visibleRecords), [visibleRecords]);

  const selectedBatchName =
    batches.find((batch) => batch._id === selectedBatch)?.name || "";

  const updateRecord = (collectionSetter, id, changes) => {
    collectionSetter((records) =>
      records.map((record) =>
        record.id === id
          ? {
              ...record,
              ...changes,
            }
          : record,
      ),
    );
  };

  const handleStatusChange = (id, status) => {
    const setter = activeTab === "students" ? setStudents : setTeachers;

    updateRecord(setter, id, { status });
  };

  const handleRemarksChange = (id, remarks) => {
    const setter = activeTab === "students" ? setStudents : setTeachers;

    updateRecord(setter, id, { remarks });
  };

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
    setMode("read");
    loadStudentAttendance(batchId);
  };

  const startMarking = () => {
    setMode("mark");

    if (activeTab === "students") {
      setStudents((records) =>
        records.map((record) => ({
          ...record,
          status: getSaveStatus(record.status),
        })),
      );
    }

    if (activeTab === "teachers") {
      setTeachers((records) =>
        records.map((record) => ({
          ...record,
          status: getSaveStatus(record.status),
        })),
      );
    }
  };

  const cancelMarking = () => {
    setMode("read");

    if (activeTab === "students") {
      loadStudentAttendance();
    }

    if (activeTab === "teachers") {
      loadTeacherAttendance();
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      if (activeTab === "students") {
        await markStudentAttendance({
          batchId: selectedBatch,
          date,
          attendance: students.map((student) => ({
            enrollmentId: student.enrollmentId,
            status: getSaveStatus(student.status),
            remarks: student.remarks || "",
          })),
        });

        await loadStudentAttendance();
      }

      if (activeTab === "teachers") {
        await markTeacherAttendance({
          date,
          attendance: teachers.map((teacher) => ({
            teacherId: teacher.teacherId,
            status: getSaveStatus(teacher.status),
            remarks: teacher.remarks || "",
          })),
        });

        await loadTeacherAttendance();
      }

      setMode("read");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div
        className="
        mb-6
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
      >
        <div>
          <h1
            className="
            text-2xl
            font-bold
            text-foreground
          "
          >
            Attendance
          </h1>
          <p
            className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
          >
            {activeTab === "students"
              ? selectedBatchName || "Student report"
              : "Teacher and staff report"}
          </p>
        </div>

        <div
          className="
          flex
          flex-wrap
          items-center
          gap-3
        "
        >
          <div className="relative">
            <CalendarDays
              size={18}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setMode("read");
              }}
              className="
                h-10
                rounded-lg
                border
                border-border-custom
                bg-background
                pl-10
                pr-3
                text-sm
                outline-none
                focus:ring-2
                focus:ring-slate-900
                dark:focus:ring-slate-100
              "
            />
          </div>

          {mode === "read" ? (
            <button
              type="button"
              onClick={startMarking}
              disabled={visibleRecords.length === 0}
              className="
                inline-flex
                h-10
                items-center
                gap-2
                rounded-lg
                bg-slate-900
                px-4
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-slate-100
                dark:text-slate-900
                dark:hover:bg-slate-200
              "
            >
              <Pencil size={16} />
              Mark
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={cancelMarking}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-border-custom
                  px-4
                  text-sm
                  font-semibold
                  transition
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="
                  inline-flex
                  h-10
                  items-center
                  gap-2
                  rounded-lg
                  bg-emerald-600
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-emerald-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className="
        mb-6
        inline-flex
        rounded-lg
        border
        border-border-custom
        bg-card
        p-1
      "
      >
        {[
          {
            id: "students",
            label: "Students",
            icon: Users,
          },
          {
            id: "teachers",
            label: "Teacher/Staff",
            icon: UserCheck,
          },
        ].map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setMode("read");
              }}
              className={`
                inline-flex
                items-center
                gap-2
                rounded-md
                px-4
                py-2
                text-sm
                font-semibold
                transition
                ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "text-slate-500 hover:text-foreground"
                }
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        className="
        mb-6
        grid
        grid-cols-2
        gap-3
        lg:grid-cols-5
      "
      >
        {["PRESENT", "ABSENT", "LATE", "LEAVE", "NOT_MARKED"].map((status) => (
          <StatCard key={status} status={status} value={stats[status] || 0} />
        ))}
      </div>

      {error && (
        <div
          className="
          mb-6
          rounded-lg
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          font-medium
          text-red-700
        "
        >
          {error}
        </div>
      )}

      {activeTab === "students" && (
        <section className="mb-6">
          <div
            className="
            mb-3
            flex
            items-center
            justify-between
          "
          >
            <h2
              className="
              text-sm
              font-semibold
              uppercase
              text-slate-500
              dark:text-slate-400
            "
            >
              Batches
            </h2>
          </div>

          <div
            className="
            grid
            grid-cols-2
            gap-3
            md:grid-cols-3
            xl:grid-cols-5
          "
          >
            {batches.map((batch) => (
              <button
                key={batch._id}
                type="button"
                onClick={() => handleBatchSelect(batch._id)}
                className={`
                  aspect-square
                  rounded-lg
                  border
                  p-4
                  text-left
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                  ${
                    selectedBatch === batch._id
                      ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                      : "border-border-custom bg-card"
                  }
                `}
              >
                <div
                  className="
                  mb-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-white/15
                "
                >
                  <BookOpen size={20} />
                </div>
                <p
                  className="
                  line-clamp-2
                  text-sm
                  font-bold
                "
                >
                  {batch.name}
                </p>
                <p
                  className="
                  mt-2
                  line-clamp-1
                  text-xs
                  opacity-75
                "
                >
                  {batch.course?.title || "Batch"}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <div
          className="
          mb-3
          flex
          items-center
          justify-between
        "
        >
          <h2
            className="
            text-sm
            font-semibold
            uppercase
            text-slate-500
            dark:text-slate-400
          "
          >
            {activeTab === "students" ? "Students" : "Teachers and staff"}
          </h2>

          {mode === "mark" && (
            <span
              className="
              rounded-full
              bg-emerald-50
              px-3
              py-1
              text-xs
              font-semibold
              text-emerald-700
              dark:bg-emerald-400/10
              dark:text-emerald-300
            "
            >
              Mark mode
            </span>
          )}
        </div>

        {loading ? (
          <div
            className="
            flex
            min-h-52
            items-center
            justify-center
            rounded-lg
            border
            border-border-custom
            bg-card
          "
          >
            <Loader2
              size={28}
              className="
                animate-spin
                text-slate-400
              "
            />
          </div>
        ) : visibleRecords.length === 0 ? (
          <div
            className="
            rounded-lg
            border
            border-border-custom
            bg-card
            p-10
            text-center
            text-sm
            text-slate-500
            dark:text-slate-400
          "
          >
            No records found.
          </div>
        ) : (
          <div
            className="
            grid
            grid-cols-1
            gap-3
            md:grid-cols-2
            xl:grid-cols-3
          "
          >
            {visibleRecords.map((record) => (
              <PersonCard
                key={record.id}
                mode={mode}
                person={record}
                onStatusChange={handleStatusChange}
                onRemarksChange={handleRemarksChange}
                subtitle={
                  activeTab === "students"
                    ? `${record.enrollmentNo || "No enrollment"} - ${record.email || "No email"}`
                    : `${record.employeeId || "No employee ID"} - ${record.specialization || record.email || "Staff"}`
                }
              />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
