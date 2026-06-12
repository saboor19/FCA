import api from "@/lib/api";


// CREATE TIMETABLE

export const createTimetable =
async(data) => {

  const response =
    await api.post(
      "/admin/timetables",
      data
    );

  return response.data;

};


// GET ALL TIMETABLES

export const getTimetables =
async() => {

  const response =
    await api.get(
      "/admin/timetables"
    );

  return response.data;

};
// BULK CREATE TIMETABLE

export const createBulkTimetable =
async(data) => {

  const response =
    await api.post(
      "/admin/timetables/bulk",
      data
    );

  return response.data;

};


// GET SINGLE TIMETABLE

export const getTimetable =
async(id) => {

  const response =
    await api.get(
      `/admin/timetables/${id}`
    );

  return response.data;

};


// UPDATE TIMETABLE

export const updateTimetable =
async(id,data) => {

  const response =
    await api.put(
      `/admin/timetables/${id}`,
      data
    );

  return response.data;

};


// DELETE TIMETABLE

export const deleteTimetable =
async(id) => {

  const response =
    await api.delete(
      `/admin/timetables/${id}`
    );

  return response.data;

};