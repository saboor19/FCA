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
export const getPendingLeaves =
async() => {

  const response =
    await api.get(
      "/teacher/attendance/leaves/pending"
    );

  return response.data;

};

export const approveLeave =
async(leaveId) => {

  const response =
    await api.put(
      `/teacher/attendance/leaves/${leaveId}/approve`
    );

  return response.data;

};

export const rejectLeave =
async(
  leaveId,
  remarks
) => {

  const response =
    await api.put(
      `/teacher/attendance/leaves/${leaveId}/reject`,
      {remarks}
    );

  return response.data;

};

export const createAttendanceSession =
async(batchId) => {

  const response =
    await api.post(
      "/teacher/attendance/session",
      {batchId}
    );

  return response.data;

};

export const getActiveAttendanceSession =
async(batchId) => {

  const response =
    await api.get(
      `/teacher/attendance/session/${batchId}`
    );

  return response.data;

};

export const closeAttendanceSession =
async(sessionId) => {

  const response =
    await api.put(
      `/teacher/attendance/session/${sessionId}/close`
    );

  return response.data;

};