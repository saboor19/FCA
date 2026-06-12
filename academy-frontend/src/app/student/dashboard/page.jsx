"use client";

import {useEffect,useState} from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import {
  getStudentDashboard
} from "@/services/studentService";

export default function StudentDashboard(){

  const [dashboard,setDashboard] =
    useState(null);

  useEffect(() => {

    const fetchDashboard =
      async() => {

      try{

        const data =
          await getStudentDashboard();

        setDashboard(data.data);

      }catch(error){
        console.log(error);
      }
    };

    fetchDashboard();

  },[]);

  return (
    <DashboardLayout role="STUDENT">

      <h1 className="mb-6 text-3xl font-bold">
        Welcome Back
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="rounded-xl border p-6">
          <h3>Courses</h3>

          <p className="text-3xl font-bold">
            {dashboard?.enrolledCourses || 0}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3>Attendance</h3>

          <p className="text-3xl font-bold">
            {dashboard?.attendance || 0}%
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3>Assignments</h3>

          <p className="text-3xl font-bold">
            {dashboard?.pendingAssignments || 0}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3>Fee Status</h3>

          <p className="text-3xl font-bold">
            {dashboard?.feeStatus}
          </p>
        </div>

      </div>

    </DashboardLayout>
  );
}