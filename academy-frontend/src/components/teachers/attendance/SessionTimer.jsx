"use client";

import {useEffect,useState} from "react";

export default function SessionTimer({
  expiresAt
}){

  const [timeLeft,setTimeLeft] =
    useState("");

  useEffect(() => {

    const interval =
      setInterval(() => {

        const diff =
          new Date(expiresAt) -
          new Date();

        if(diff <= 0){

          setTimeLeft(
            "Expired"
          );

          return;
        }

        const minutes =
          Math.floor(
            diff / 1000 / 60
          );

        const seconds =
          Math.floor(
            (diff / 1000) % 60
          );

        setTimeLeft(
          `${minutes}:${seconds
            .toString()
            .padStart(2,"0")}`
        );

      },1000);

    return () =>
      clearInterval(interval);

  },[expiresAt]);

  return (

    <p className="text-sm text-muted-foreground">

      Expires In: {timeLeft}

    </p>

  );

}