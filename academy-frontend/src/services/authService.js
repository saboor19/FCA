
import api from "@/lib/api";


// ---------------- REGISTER USER ----------------

export const registerUser = async(userData) => {

  try{

    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;

  }catch(error){

    throw (
      error.response?.data ||
      {
        message:"Registration failed"
      }
    );
  }
};


// ---------------- LOGIN USER ----------------

export const loginUser = async(formData) => {

  try{

    const response = await api.post(
      "/auth/login",
      formData
    );
    console.log(response);

    return response.data;

  }catch(error){

    throw (
      error.response?.data ||
      {
        message:`Login failed ${error.response}`,
        
      }
    );
  }
};


// ---------------- GET CURRENT USER ----------------

export const getCurrentUser = async() => {

  try{

    const response = await api.get(
      "/auth/me"
    );

    return response.data;

  }catch(error){

    throw (
      error.response?.data ||
      {
        message:"Failed to fetch user"
      }
    );
  }
};


// ---------------- LOGOUT USER ----------------

export const logoutUser = async() => {

  try{

    const response = await api.post(
      "/auth/logout"
    );

    return response.data;

  }catch(error){

    throw (
      error.response?.data ||
      {
        message:"Logout failed"
      }
    );
  }
};
