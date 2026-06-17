"use client";

import {useEffect,useState} from "react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import AttendanceModeCard
from "@/components/students/attendance/AttendanceModeCard";

import OnlineAttendanceForm
from "@/components/students/attendance/OnlineAttendanceForm";

import OfflineAttendanceCard
from "@/components/students/attendance/OfflineAttendanceCard";

import AttendanceSuccess
from "@/components/students/attendance/AttendanceSuccess";

import {
  getCurrentBatch,
  markOnlineAttendance,
  markOfflineAttendance
}
from "@/services/student/attendanceService";

export default function MarkAttendancePage(){

  const [batch,setBatch] =
    useState(null);

  const [success,setSuccess] =
    useState(false);

  useEffect(() => {

    loadBatch();

  },[]);

  const loadBatch =
  async() => {

    try{

      const response =
        await getCurrentBatch();

      setBatch(
        response.batch
      );

    }

    catch(error){

      console.error(error);

    }

  };

  const handleOnlineAttendance =
  async(code) => {

    try{

      await markOnlineAttendance({
        code
      });

      setSuccess(true);

    }

    catch(error){

      alert(
        error?.response?.data?.message
      );

    }

  };

  const handleOfflineAttendance =
  async() => {

    navigator.geolocation.getCurrentPosition(

      async(position) => {

        try{

          await markOfflineAttendance({

            latitude:
            position.coords.latitude,

            longitude:
            position.coords.longitude

          });

          setSuccess(true);

        }

        catch(error){

          alert(
            error?.response?.data?.message
          );

        }

      }

    );

  };

  return (

    <DashboardLayout role="STUDENT">

      <div className="space-y-6">

        {batch && (

          <AttendanceModeCard
            batch={batch}
          />

        )}

        {!success &&
         batch?.studyMode === "ONLINE" && (

          <OnlineAttendanceForm
            onSubmit={
              handleOnlineAttendance
            }
          />

        )}


        {!success &&
         batch?.studyMode === "OFFLINE" && (

          <OfflineAttendanceCard
            onMarkAttendance={
              handleOfflineAttendance
            }
            
          />

        )}

        {!success &&
 batch?.studyMode === "HYBRID" && (

  <div className="grid gap-6 lg:grid-cols-2">

    <OfflineAttendanceCard
      onMarkAttendance={
        handleOfflineAttendance
      }
    />

    <OnlineAttendanceForm
      onSubmit={
        handleOnlineAttendance
      }
    />

  </div>

)}

        {success && (

          <AttendanceSuccess />

        )}

      </div>

    </DashboardLayout>

  );

}