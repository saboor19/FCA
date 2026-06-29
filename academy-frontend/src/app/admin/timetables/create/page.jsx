"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2, CalendarPlus } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { createTimetable } from "@/services/admin/timetableService";

import { getTeachers } from "@/services/admin/teacherService";

import { getBatches } from "@/services/admin/batchService";

import { getCourses } from "@/services/admin/courseService";

export default function CreateTimetablePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const [teachers, setTeachers] = useState([]);

  const [batches, setBatches] = useState([]);

  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    batch: "",
    course: "",
    teacher: "",
    subject: "",
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    roomNumber: "",
    meetingLink: "",
    mode: "OFFLINE",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);

      const [teachersResponse, batchesResponse, coursesResponse] =
        await Promise.all([getTeachers(), getBatches(), getCourses()]);

      setTeachers(teachersResponse.data || []);

      setBatches(batchesResponse.data || []);

      setCourses(coursesResponse.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createTimetable(formData);

      router.push("/admin/timetables");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex justify-center py-20">
          <Loader2
            className="
              w-8
              h-8
              animate-spin
            "
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CalendarPlus className="w-8 h-8" />
            Create Timetable Slot
          </h1>

          <p className="text-muted-foreground mt-2">
            Schedule classes for batches and teachers.
          </p>
        </div>

        {/* FORM */}

        <div
          className="
            bg-card
            border
            rounded-3xl
            p-8
            shadow-sm
          "
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BATCH */}

              <div>
                <label className="block mb-2 font-medium">Batch</label>

                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                >
                  <option value="">Select Batch</option>

                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* COURSE */}

              <div>
                <label className="block mb-2 font-medium">Course</label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                >
                  <option value="">Select Course</option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* TEACHER */}

              <div>
                <label className="block mb-2 font-medium">Teacher</label>

                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                >
                  <option value="">Select Teacher</option>

                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.userId?.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBJECT */}

              <div>
                <label className="block mb-2 font-medium">Subject</label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="React Fundamentals"
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                />
              </div>

              {/* DAY */}

              <div>
                <label className="block mb-2 font-medium">Day</label>

                <select
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                >
                  {[
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* MODE */}

              <div>
                <label className="block mb-2 font-medium">Mode</label>

                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                >
                  <option value="OFFLINE">OFFLINE</option>

                  <option value="ONLINE">ONLINE</option>

                  <option value="HYBRID">HYBRID</option>
                </select>
              </div>

              {/* START TIME */}

              <div>
                <label className="block mb-2 font-medium">Start Time</label>

                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                />
              </div>

              {/* END TIME */}

              <div>
                <label className="block mb-2 font-medium">End Time</label>

                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                />
              </div>

              {/* ROOM */}

              <div>
                <label className="block mb-2 font-medium">Room Number</label>

                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                />
              </div>

              {/* MEETING */}

              <div>
                <label className="block mb-2 font-medium">Meeting Link</label>

                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                />
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-black
                text-white
                py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {loading ? (
                <>
                  <Loader2
                    className="
                        w-5
                        h-5
                        animate-spin
                      "
                  />
                  Creating...
                </>
              ) : (
                "Create Timetable Slot"
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
