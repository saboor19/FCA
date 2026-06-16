import api from "@/lib/api";



export const getMyBatches =
async()=>{

  const response =
  await api.get(
    "/student/batches"
  );

  return response.data;

};



export const getMyBatch =
async(batchId)=>{

  const response =
  await api.get(
    `/student/batches/${batchId}`
  );

  return response.data;

};