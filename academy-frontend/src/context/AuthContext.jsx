"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  const fetchUser = async() => {
    try{

      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          credentials:"include"
        }
      );
      // console.log("ME STATUS", response.status);


      const data = await response.json();
        
      // console.log("ME DATA", data);
      
      if(response.ok){
        setUser(data.user);
      }else{
        setUser(null);
      }

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
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);