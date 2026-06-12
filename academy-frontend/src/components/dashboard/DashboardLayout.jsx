"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import {useAuth} from "@/context/AuthContext";

const DashboardLayout = ({children,role}) => {

  const router = useRouter();

  const {user,loading} = useAuth();

  useEffect(() => {

    if(!loading){

      // console.log("USER IS     :" ,user)

      if(!user){
        router.push("/login");
      }

      if(user?.role !== role){
        router.push("/login");
      }
    }

  },[user,loading,role,router]);

  if(loading){
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      <Sidebar role={role} />

      <div className="flex-1">

        <Navbar />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;