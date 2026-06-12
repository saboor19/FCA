
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  UserSquare2,
  BookOpen
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import api from "@/lib/api";

import { createBatch }
from "@/services/admin/batchService";

export default function CreateBatchPage() {

  const router = useRouter();

  const [courses,setCourses] =
    useState([]);

  const [teachers,setTeachers] =
    useState([]);

  const [selectedCourse,
    setSelectedCourse] =
      useState(null);

  const [loading,setLoading] =
    useState(false);

  const [formData,setFormData] =
    useState({

      name:"",

      course:"",

      teacherAssignments:[],

      studyMode:"OFFLINE",

      roomNumber:"",

      meetingLink:"",

      startDate:"",

      endDate:"",

      capacity:30

    });

  // ---------------- FETCH DATA ----------------

  useEffect(() => {

    const fetchData = async() => {

      try{

        const [
          coursesRes,
          teachersRes
        ] = await Promise.all([

          api.get("/admin/courses"),

          api.get("/teachers")

        ]);

        setCourses(
          coursesRes.data.data
        );

        setTeachers(
          teachersRes.data.data
        );

      }catch(error){

        console.error(error);

      }

    };

    fetchData();

  },[]);

  // ---------------- HANDLE CHANGE ----------------

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  // ---------------- COURSE CHANGE ----------------

  const handleCourseChange = (e) => {

    handleChange(e);

    const selected =
      courses.find(
        (course) =>
          course._id ===
          e.target.value
      );

    setSelectedCourse(
      selected
    );

    // reset assignments
    setFormData((prev)=>({

      ...prev,

      course:e.target.value,

      teacherAssignments:[]

    }));

  };

  // ---------------- ADD ASSIGNMENT ----------------

  const addTeacherAssignment =
  () => {

    setFormData({

      ...formData,

      teacherAssignments:[

        ...formData
        .teacherAssignments,

        {
          teacher:"",
          modules:[]
        }

      ]

    });

  };

  // ---------------- REMOVE ASSIGNMENT ----------------

  const removeTeacherAssignment =
  (index) => {

    const updatedAssignments =
      formData.teacherAssignments
      .filter(
        (_,i)=>i !== index
      );

    setFormData({

      ...formData,

      teacherAssignments:
        updatedAssignments

    });

  };

  // ---------------- TEACHER CHANGE ----------------

  const handleTeacherAssignmentChange =
  (
    index,
    field,
    value
  ) => {

    const updatedAssignments =
      [...formData.teacherAssignments];

    updatedAssignments[index][field]
      = value;

    setFormData({

      ...formData,

      teacherAssignments:
        updatedAssignments

    });

  };

  // ---------------- MODULE SELECTION ----------------

  const handleModuleSelection =
  (
    index,
    moduleId
  ) => {

    const updatedAssignments =
      [...formData.teacherAssignments];

    const currentModules =
      updatedAssignments[index]
      .modules;

    const exists =
      currentModules.includes(
        moduleId
      );

    updatedAssignments[index]
      .modules = exists

      ? currentModules.filter(
          (id)=>id !== moduleId
        )

      : [
          ...currentModules,
          moduleId
        ];

    setFormData({

      ...formData,

      teacherAssignments:
        updatedAssignments

    });

  };

  // ---------------- SUBMIT ----------------

  const handleSubmit = async(e) => {

    e.preventDefault();

    try{

      setLoading(true);

      const cleanedAssignments =
        formData.teacherAssignments
        .filter(

          (assignment)=>

            assignment.teacher &&
            assignment.modules.length > 0

        );

      await createBatch({

        ...formData,

        teacherAssignments:
          cleanedAssignments

      });

      router.push(
        "/admin/batches"
      );

    }catch(error){

      console.error(error);

      alert(

        error.response?.data
          ?.message ||

        "Something went wrong"

      );

    }finally{

      setLoading(false);

    }

  };

  // ---------------- STYLES ----------------

  const inputStyle =

    "w-full px-4 py-2.5 rounded-lg border border-border-custom bg-transparent text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow";

  const labelStyle =

    "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  return (

    <DashboardLayout role="ADMIN">

      <div className="max-w-4xl">

        {/* HEADER */}

        <button
          onClick={() =>
            router.back()
          }
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 text-sm font-medium transition-colors"
        >

          <ArrowLeft size={16} />

          Back to Batches

        </button>

        <div className="mb-8">

          <h1 className="text-2xl font-bold text-foreground">
            Create New Batch
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Create and configure
            a new academic batch.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-card p-8 rounded-2xl border border-border-custom shadow-sm space-y-6"
        >

          {/* BATCH NAME */}

          <div>

            <label className={labelStyle}>
              Batch Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
              placeholder="e.g. AI Morning Batch"
              required
            />

          </div>

          {/* COURSE */}

          <div>

            <label className={labelStyle}>
              Course
            </label>

            <select
              name="course"
              value={formData.course}
              onChange={handleCourseChange}
              className={`${inputStyle} appearance-none`}
              required
            >

              <option value="">
                Select Course
              </option>

              {
                courses.map((course)=>(

                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.title}
                  </option>

                ))
              }

            </select>

          </div>

          {/* TEACHER ASSIGNMENTS */}

          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-foreground">
                  Teacher Assignments
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Assign teachers
                  with modules.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  addTeacherAssignment
                }
                disabled={!selectedCourse}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-custom hover:bg-muted transition-colors text-sm disabled:opacity-50"
              >

                <Plus size={16} />

                Add Assignment

              </button>

            </div>

            {
              formData
              .teacherAssignments
              .map(
                (
                  assignment,
                  index
                ) => (

                <div
                  key={index}
                  className="border border-border-custom rounded-xl p-5 space-y-5"
                >

                  {/* HEADER */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <UserSquare2
                        size={18}
                      />

                      <h3 className="font-medium">
                        Assignment {index + 1}
                      </h3>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeTeacherAssignment(
                          index
                        )
                      }
                      className="text-red-500 hover:text-red-600"
                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                  {/* TEACHER */}

                  <div>

                    <label className={labelStyle}>
                      Teacher
                    </label>

                    <select
                      value={
                        assignment.teacher
                      }
                      onChange={(e)=>

                        handleTeacherAssignmentChange(

                          index,

                          "teacher",

                          e.target.value

                        )

                      }
                      className={inputStyle}
                    >

                      <option value="">
                        Select Teacher
                      </option>

                      {
                        teachers.map(
                          (teacher)=>(

                          <option
                            key={teacher._id}
                            value={teacher._id}
                          >

                            {
                              teacher.userId
                                ?.fullName
                            }

                          </option>

                        ))
                      }

                    </select>

                  </div>

                  {/* MODULES */}

                  <div>

                    <label className={labelStyle}>
                      Modules
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                      {
                        selectedCourse
                        ?.modules
                        ?.map((module)=>(

                          <label
                            key={module._id}
                            className="flex items-center gap-2 border border-border-custom rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                          >

                            <input
                              type="checkbox"

                              checked={
                                assignment
                                .modules
                                .includes(
                                  module._id
                                )
                              }

                              onChange={() =>

                                handleModuleSelection(

                                  index,

                                  module._id

                                )

                              }
                            />

                            <div className="flex items-center gap-1">

                              <BookOpen
                                size={14}
                              />

                              <span className="text-sm">
                                {module.title}
                              </span>

                            </div>

                          </label>

                        ))
                      }

                    </div>

                  </div>

                </div>

              ))
            }

          </div>

          {/* STUDY MODE */}

          <div>

            <label className={labelStyle}>
              Study Mode
            </label>

            <select
              name="studyMode"
              value={formData.studyMode}
              onChange={handleChange}
              className={inputStyle}
            >

              <option value="OFFLINE">
                Offline
              </option>

              <option value="ONLINE">
                Online
              </option>

              <option value="HYBRID">
                Hybrid
              </option>

            </select>

          </div>

          {/* ROOM */}

          {
            formData.studyMode !==
            "ONLINE" && (

              <div>

                <label className={labelStyle}>
                  Room Number
                </label>

                <input
                  type="text"
                  name="roomNumber"
                  value={
                    formData.roomNumber
                  }
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="Room A-101"
                />

              </div>

            )
          }

          {/* MEETING */}

          {
            formData.studyMode !==
            "OFFLINE" && (

              <div>

                <label className={labelStyle}>
                  Meeting Link
                </label>

                <input
                  type="text"
                  name="meetingLink"
                  value={
                    formData.meetingLink
                  }
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="https://meet.google.com/..."
                />

              </div>

            )
          }

          {/* DATES */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className={labelStyle}>
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={
                  formData.startDate
                }
                onChange={handleChange}
                className={inputStyle}
                required
              />

            </div>

            <div>

              <label className={labelStyle}>
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                value={
                  formData.endDate
                }
                onChange={handleChange}
                className={inputStyle}
                required
              />

            </div>

          </div>

          {/* CAPACITY */}

          <div>

            <label className={labelStyle}>
              Capacity
            </label>

            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={inputStyle}
              min="1"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >

            {
              loading

              ? (
                <Loader2
                  className="animate-spin"
                  size={20}
                />
              )

              : (
                <Save size={20} />
              )
            }

            {
              loading

              ? "Creating Batch..."

              : "Create Batch"
            }

          </button>

        </form>

      </div>

    </DashboardLayout>

  );

}

