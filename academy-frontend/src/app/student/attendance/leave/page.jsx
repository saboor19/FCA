"use client";

import {useEffect,useState} from "react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import {
  submitLeaveRequest,
  getLeaveRequests
}
from "@/services/student/attendanceService";

export default function LeavePage(){

  const [form,setForm] =
    useState({
      fromDate:"",
      toDate:"",
      reason:""
    });

  const [requests,setRequests] =
    useState([]);

  const [loading,setLoading] =
    useState(false);

  useEffect(() => {

    loadRequests();

  },[]);

  const loadRequests =
  async() => {

    try{

      const response =
        await getLeaveRequests();

      setRequests(
        response.requests || []
      );

    }

    catch(error){

      console.error(error);

    }

  };

  const handleChange =
  (e) => {

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  };

  const handleSubmit =
  async(e) => {

    e.preventDefault();

    try{

      setLoading(true);

      await submitLeaveRequest(
        form
      );

      setForm({
        fromDate:"",
        toDate:"",
        reason:""
      });

      loadRequests();

    }

    catch(error){

      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Failed to submit leave"
      );

    }

    finally{

      setLoading(false);

    }

  };

  return (

    <DashboardLayout role="STUDENT">
 
      <div className="space-y-6">

        <div className="rounded-xl border p-6">

          <h1 className="text-xl font-semibold mb-6">
            Request Leave
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <label>
                From Date
              </label>

              <input
                type="date"
                name="fromDate"
                value={form.fromDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-1"
              />

            </div>

            <div>

              <label>
                To Date
              </label>

              <input
                type="date"
                name="toDate"
                value={form.toDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-1"
              />

            </div>

            <div>

              <label>
                Reason
              </label>

              <textarea
                rows={4}
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 mt-1"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-black text-white"
            >

              {
                loading
                ? "Submitting..."
                : "Submit Leave Request"
              }

            </button>

          </form>

        </div>

        <div className="rounded-xl border p-6">

          <h2 className="text-lg font-semibold mb-4">
            My Leave Requests
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    From
                  </th>

                  <th className="text-left py-3">
                    To
                  </th>

                  <th className="text-left py-3">
                    Teacher
                  </th>

                  <th className="text-left py-3">
                    Admin
                  </th>

                </tr>

              </thead>

              <tbody>

                {requests.map(
                  request => (

                  <tr
                    key={request._id}
                    className="border-b"
                  >

                    <td className="py-3">
                      {
                        new Date(
                          request.fromDate
                        ).toLocaleDateString()
                      }
                    </td>

                    <td className="py-3">
                      {
                        new Date(
                          request.toDate
                        ).toLocaleDateString()
                      }
                    </td>

                    <td className="py-3">
                      {
                        request.teacherStatus
                      }
                    </td>

                    <td className="py-3">
                      {
                        request.adminStatus
                      }
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}