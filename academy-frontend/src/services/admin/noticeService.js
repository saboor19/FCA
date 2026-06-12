import api from "@/lib/api";


// =============================
// CREATE NOTICE
// =============================

export const createNotice =
async(data) => {

  const response =
    await api.post(
      "/admin/notices",
      data
    );

  return response.data;

};


// =============================
// GET ALL NOTICES
// =============================

export const getNotices =
async() => {

  const response =
    await api.get(
      "/admin/notices"
    );

  return response.data;

};


// =============================
// GET SINGLE NOTICE
// =============================

export const getNotice =
async(id) => {

  const response =
    await api.get(
      `/admin/notices/${id}`
    );

  return response.data;

};


// =============================
// UPDATE NOTICE
// =============================

export const updateNotice =
async(id,data) => {

  const response =
    await api.put(
      `/admin/notices/${id}`,
      data
    );

  return response.data;

};


// =============================
// DELETE NOTICE
// =============================

export const deleteNotice =
async(id) => {

  const response =
    await api.delete(
      `/admin/notices/${id}`
    );

  return response.data;

};


// =============================
// MARK NOTICE AS READ
// =============================

export const markNoticeAsRead =
async(id) => {

  const response =
    await api.put(
      `/admin/notices/${id}/read`
    );

  return response.data;

};