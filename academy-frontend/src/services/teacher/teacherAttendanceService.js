import api from "@/lib/api";

// GET BATCH ATTENDANCE

export const getBatchAttendance =
async(batchId,date) => {

  const response =
    await api.get(
      `/teacher/attendance/batch/${batchId}`,
      {
        params:{ date }
      }
    );

  return response.data;

};

// MARK ATTENDANCE

export const markStudentAttendance =
async(data) => {

  const response =
    await api.post(
      "/teacher/attendance",
      data
    );

  return response.data;

};