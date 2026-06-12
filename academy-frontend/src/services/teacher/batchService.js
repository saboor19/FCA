import api from "@/lib/api";


// GET ASSIGNED BATCHES

export const getAssignedBatches =
async() => {

  const response =
    await api.get(
      "/teacher/batches"
    );

  return response.data;

};

// GET SINGLE BATCH

export const getBatchDetails =
async(id) => {

  const response =
    await api.get(
      `/teacher/batches/${id}`
    );

  return response.data;

};