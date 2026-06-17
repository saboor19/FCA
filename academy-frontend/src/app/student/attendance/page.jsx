"use client";

import {useEffect,useState} from "react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import AttendanceStats
from "@/components/students/attendance/AttendanceStats";

import LeaveSummary
from "@/components/students/attendance/LeaveSummary";

import AttendanceHistory
from "@/components/students/attendance/AttendanceHistory";

import AttendanceActions
from "@/components/students/attendance/AttendanceActions";

import {
  getAttendanceOverview,
  getAttendance
}
from "@/services/student/attendanceService";

export default function AttendancePage(){

  const [overview,setOverview] =
    useState(null);

  const [attendance,setAttendance] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  useEffect(() => {

    loadData();

  },[]);

  const loadData =
  async() => {

    try{

      const [
        overviewResponse,
        attendanceResponse
      ] = await Promise.all([

        getAttendanceOverview(),
        getAttendance()

      ]);

      setOverview(
        overviewResponse.overview
      );

      setAttendance(
        attendanceResponse.attendance || []
      );

    }

    catch(error){

      console.error(error);

    }

    finally{

      setLoading(false);

    }

  };

  if(loading){

    return (

      <DashboardLayout role="STUDENT">

        <div className="p-6">
          Loading attendance...
        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout role="STUDENT">

      <div className="space-y-6">

        <AttendanceStats
          stats={
            overview?.attendance
          }
        />

        <LeaveSummary
          leaveRequests={
            overview?.leaveRequests
          }
        />

        <AttendanceActions />

        <AttendanceHistory
          attendance={attendance}
        />

      </div>

    </DashboardLayout>

  );

}