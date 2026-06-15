"use client";

import {useEffect,useState} from "react";

import {
  getMyProfile
} from "@/services/teacher/profileService";

import TeacherProfileCard
from "@/components/teachers/profile/TeacherProfileCard";

import TeacherProfileInfo
from "@/components/teachers/profile/TeacherProfileInfo";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function TeacherProfilePage(){

  const [teacher,setTeacher] =
    useState(null);

  const [loading,setLoading] =
    useState(true);



  useEffect(() => {

    fetchProfile();

  },[]);



  const fetchProfile = async() => {

    try{

      const data =
        await getMyProfile();

      setTeacher(data.teacher);

    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }

  };



  if(loading){

    return (
      <div>
        Loading...
      </div>
    );

  }



  return (
    <DashboardLayout role="TEACHER">


    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <TeacherProfileCard
        teacher={teacher}
      />

      <div className="lg:col-span-2">

        <TeacherProfileInfo
          teacher={teacher}
        />

      </div>

    </div>
    </DashboardLayout>

  );

}