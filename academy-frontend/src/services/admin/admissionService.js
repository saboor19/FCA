import api from "@/lib/api";

// GET ALL
export const getAdmissions =
async(status = "PENDING") => {

  const response =
    await api.get(
      `/admin/admissions?status=${status}`
    );

  return response.data;
};

// GET SINGLE
export const getAdmission =
async(id) => {

  const response =
    await api.get(
      `/admin/admissions/${id}`
    );

  return response.data;
};

// APPROVE
export const approveAdmission =
async(id,batchId) => {

  const response =
    await api.post(
      `/admin/admissions/${id}/approve`,
      { batchId }
    );

  return response.data;
};

// REJECT
export const rejectAdmission =
async(id,reason) => {

  const response =
    await api.post(
      `/admin/admissions/${id}/reject`,
      { reason }
    );

  return response.data;
};