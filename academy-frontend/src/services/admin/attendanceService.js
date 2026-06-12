import api from "@/lib/api";



// ==================STUDENT ATTENDANCE


// --------------MARK STUDENT ATTENDANCE

export const markStudentAttendance = async(data) => {

  const response =
    await api.post(
      "/admin/attendance/students",
      data
    );

  return response.data;

};
// GET SINGLE STUDENT ATTENDANCE

export const getStudentAttendance = async(studentId) => {

  const response =
    await api.get(
      `/admin/attendance/students/student/${studentId}`
    );

  return response.data;

};


// GET BATCH ATTENDANCE

export const getBatchAttendance = async(batchId,date) => {

  const response =
    await api.get(
      `/admin/attendance/students/batch/${batchId}`,
      {
        params:{date}
      }
    );

  return response.data;

};


// UPDATE SINGLE ATTENDANCE

export const updateStudentAttendance = async(id,data) => {

  const response =
    await api.put(
      `/admin/attendance/students/${id}`,
      data
    );

  return response.data;

};


// =============================
// TEACHER ATTENDANCE
// =============================

// MARK TEACHER ATTENDANCE

export const markTeacherAttendance =
async(data) => {

  const response =
    await api.post(
      "/admin/attendance/teachers",
      data
    );

  return response.data;

};


// GET TEACHER ATTENDANCE

export const getTeacherAttendance =
async(date) => {

  const response =
    await api.get(
      "/admin/attendance/teachers",
      {
        params:{date}
      }
    );

  return response.data;

};


// Backward-compatible alias for older mark pages.
export const markAttendance =
async(data) => {

  const response =
    await api.post(
      "/admin/attendance/students",
      data
    );

  return response.data;

};
