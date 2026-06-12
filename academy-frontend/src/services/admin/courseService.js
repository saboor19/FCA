import api from "@/lib/api";

// ---------------- GET ALL COURSES ----------------

export const getCourses = async() => {

  const response =
    await api.get("/admin/courses");

  return response.data;

};

// ---------------- GET SINGLE COURSE ----------------

export const getCourse = async(id) => {

  const response =
    await api.get(
      `/admin/courses/${id}`
    );

  return response.data;

};

// ---------------- CREATE COURSE ----------------

export const createCourse = async(data) => {

  const response =
    await api.post(
      "/admin/courses",
      data
    );

  return response.data;

};

// ---------------- UPDATE COURSE ----------------

export const updateCourse = async(id,data) => {

  const response =
    await api.put(
      `/admin/courses/${id}`,
      data
    );

  return response.data;

};

// ---------------- DELETE COURSE ----------------

export const deleteCourse = async(id) => {

  const response =
    await api.delete(
      `/admin/courses/${id}`
    );

  return response.data;

};