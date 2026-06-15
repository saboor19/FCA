"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getCurrentUser
} from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({
  children
}) => {

  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  const fetchUser = async() => {

    try{

      const data = await getCurrentUser();

      setUser(data.user);

    }catch(error){

      setUser(null);

    }finally{

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchUser();
  },[]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);
