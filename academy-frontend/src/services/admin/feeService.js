
import api from "@/lib/api";

// ---------------------------------------------------
// GET ALL FEES
// ---------------------------------------------------

export const getAllFees =
async () => {

  const response =
    await api.get(
      "/admin/fees"
    );

  return response.data;

};

// ---------------------------------------------------
// GET SINGLE FEE
// ---------------------------------------------------

export const getFee =
async(id) => {

  const response =
    await api.get(
      `/admin/fees/${id}`
    );

  return response.data;

};

//-----------UPDATE SINGLE FEE-----------------
export const updateFee = async(id,payload)=>{ 
  const {data} = await api.put( `/admin/fees/${id}`, payload );
   return data; };

// ---------------------------------------------------
// ADD PAYMENT
// ---------------------------------------------------

export const addPayment =
async(id,data) => {

  const response =
    await api.post(

      `/admin/fees/${id}/payment`,

      data

    );

  return response.data;

};

// ---------------------------------------------------
// GET PENDING FEES
// ---------------------------------------------------

export const getPendingFees =
async() => {

  const response =
    await api.get(
      "/admin/fees/pending/all"
    );

  return response.data;

};

