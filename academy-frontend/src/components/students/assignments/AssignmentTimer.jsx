"use client";

import {useEffect,useState,useRef}
from "react";



export default function AssignmentTimer({

  startedAt,
  timeLimit,onTimeUp

}){

  const [timeLeft,setTimeLeft] =
  useState(0);

const hasTriggered =
useRef(false);




  useEffect(()=>{

    if(!startedAt || !timeLimit){

      return;

    }



    const calculateTimeLeft = ()=>{

      const startTime =
      new Date(startedAt).getTime();



      const endTime =
      startTime +
      (timeLimit * 60 * 1000);



      const remaining =
      endTime - Date.now();



   if(remaining <= 0){ setTimeLeft(0); 
    if( !hasTriggered.current ){ 
        hasTriggered.current = true; 
        if(onTimeUp){ 
            onTimeUp(); 
        } }
     } else{ 
        setTimeLeft(remaining); }
    };



    calculateTimeLeft();



    const interval =
    setInterval(
      calculateTimeLeft,
      1000
    );



    return()=>clearInterval(
      interval
    );

  },[
    startedAt,
    timeLimit
  ]);



  // ---------------- FORMAT ----------------

  const hours =
  Math.floor(
    timeLeft / (1000 * 60 * 60)
  );



  const minutes =
  Math.floor(
    (
      timeLeft %
      (1000 * 60 * 60)
    ) /
    (1000 * 60)
  );



  const seconds =
  Math.floor(
    (
      timeLeft %
      (1000 * 60)
    ) / 1000
  );



  const isDanger =
    timeLeft <=
    5 * 60 * 1000;



  return(

    <div
      className={`
        sticky
        top-0
        z-40
        mb-6
        flex
        items-center
        justify-between
        rounded-2xl
        border
        p-4
        backdrop-blur
        ${
          isDanger
          ? `
            border-red-200
            bg-red-50/90
            text-red-700
          `
          : `
            border-slate-200
            bg-white/90
            text-slate-900
            dark:border-slate-800
            dark:bg-slate-900/90
            dark:text-white
          `
        }
      `}
    >

      <div>

        <h2
          className="
            text-sm
            font-medium
          "
        >
          Time Remaining
        </h2>

      </div>



      <div
        className="
          text-lg
          font-bold
          tabular-nums
        "
      >

        {
          String(hours)
          .padStart(2,"0")
        }

        :

        {
          String(minutes)
          .padStart(2,"0")
        }

        :

        {
          String(seconds)
          .padStart(2,"0")
        }

      </div>

    </div>

  );

}
