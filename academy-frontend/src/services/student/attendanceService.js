import api from "@/lib/api";

export const getAttendanceOverview =
async() => {

  const response =
    await api.get(
      "/student/attendance/overview"
    );

  return response.data;

};

export const getAttendance =
async() => {

  const response =
    await api.get(
      "/student/attendance"
    );

  return response.data;

};
export const getAttendanceStats =
async() => {

  const response =
    await api.get(
      "/student/attendance/stats"
    );

  return response.data;

};

export const submitLeaveRequest =
async(data) => {

  const response =
    await api.post(
      "/student/attendance/leaves",
      data
    );

  return response.data;

};

export const markOfflineAttendance =
async(data) => {

  const response =
    await api.post(
      "/student/attendance/offline",
      data
    );

  return response.data;

};

export const markOnlineAttendance =
async(data) => {

  const response =
    await api.post(
      "/student/attendance/online",
      data
    );

  return response.data;

};
export const getLeaveRequests =
async() => {

  const response =
    await api.get(
      "/student/attendance/leaves"
    );

  return response.data;

};

export const getCurrentBatch =
async() => {

  const response =
    await api.get(
      "/student/attendance/batch"
    );

  return response.data;

};