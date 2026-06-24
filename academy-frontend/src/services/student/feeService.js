import api from "@/lib/api";

// ----------------------------------
// GET ALL FEES
// ----------------------------------

export const getMyFees =
async()=>{

  const response =
  await api.get(
    "/student/fees"
  );

  return response.data;

};

// ----------------------------------
// GET SINGLE FEE
// ----------------------------------

export const getMyFee =
async(id)=>{

  const response =
  await api.get(
    `/student/fees/${id}`
  );

  return response.data;

};