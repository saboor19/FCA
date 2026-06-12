
"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import FeeStats from "@/components/fees/FeeStats";
import ManageFeeModal from "@/components/fees/ManageFeeModal";
import PaymentHistory from "@/components/fees/PaymentHistory";
import PaymentModal from "@/components/fees/PaymentModal";

import AcademyLoader from "@/components/ui/AcademyLoader";

import {
  IndianRupee,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus
} from "lucide-react";

import {
  getFee
} from "@/services/admin/feeService";

export default function FeeDetailsPage(){

  const params = useParams();

  const feeId = params.id;

  const [fee,setFee] = useState(null);

  const [loading,setLoading] = useState(true);

  const [openModal,setOpenModal] = useState(false);

  const [openManage,setOpenManage] = useState(false);

  // ---------------------------------------------------

  const fetchFee =
  async()=>{

    try{

      const data =
        await getFee(feeId);

      setFee(data.data);

    }catch(error){

      console.error(error);

    }finally{

      setLoading(false);

    }

  };

  // ---------------------------------------------------

  useEffect(()=>{

    if(feeId){

      fetchFee();

    }

  },[feeId]);

  // ---------------------------------------------------

  const getStatusStyle =
  (status)=>{

    switch(status){

      case "PAID":

        return `
          bg-green-100
          text-green-700
          border-green-200
        `;

      case "PARTIAL":

        return `
          bg-amber-100
          text-amber-700
          border-amber-200
        `;

      default:

        return `
          bg-red-100
          text-red-700
          border-red-200
        `;

    }

  };

  // ---------------------------------------------------

  if(loading){

    return(

      <DashboardLayout role="ADMIN">

        <AcademyLoader
          text="Loading Fee Details..."
        />

      </DashboardLayout>

    );

  }

  return(

    <DashboardLayout role="ADMIN">

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-3xl font-bold text-foreground">

              Fee Account

            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-1">

              Manage payments,
              dues and financial history.

            </p>

          </div>

 
<button

  onClick={()=>
    setOpenModal(true)
  }

  className="
    inline-flex
    items-center
    gap-2
    bg-slate-900
    text-white
    px-5
    py-3
    rounded-xl
    hover:bg-slate-800
    transition-colors ">

  <Plus size={18} />

  Add Payment

</button>

<button onClick={()=> setOpenManage(true) } className=" inline-flex items-center gap-2 border border-border-custom px-5 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 " > Manage Fee </button>



        </div>

        {/* STUDENT INFO */}

        <div
          className="
            bg-card
            border
            border-border-custom
            rounded-2xl
            p-6
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">

                {
                  fee.student?.userId
                  ?.fullName
                }

              </h2>

              <p className="text-slate-500 text-sm mt-1">

                {
                  fee.student?.userId
                  ?.email
                }

              </p>

            </div>

            <span
              className={`
                inline-flex
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                border
                ${getStatusStyle(
                  fee.status
                )}
              `}
            >

              {fee.status}

            </span>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
              mt-6
            "
          >

            <div>

              <p className="text-xs uppercase text-slate-400">

                Batch

              </p>

              <p className="font-medium mt-1">

                {fee.batch?.name}

              </p>

            </div>

            <div>

              <p className="text-xs uppercase text-slate-400">

                Course

              </p>

              <p className="font-medium mt-1">

                {fee.course?.title}

              </p>

            </div>

          </div>

        </div>

        {/* SUMMARY CARDS */}

    
        <FeeStats fee={fee} />



        {/* PAYMENT HISTORY */}

       
        <PaymentHistory payments={fee?.payments}/>



      </div>

<PaymentModal open={openModal} onClose={()=> setOpenModal(false) } feeId={fee._id} refreshFee={fetchFee} />
<ManageFeeModal open={openManage} onClose={()=> setOpenManage(false) } fee={fee} refreshFee={fetchFee} />



    </DashboardLayout>

  );

}

