"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import Navbar from "./navbar";




const LoginForm = () => {
  const router = useRouter();

  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });
  };
  const {setUser} = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();

    try{
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
          body:JSON.stringify(formData)
        }
      );

      const data = await response.json();

      
console.log(data.user);
if (!response.ok) {
  throw new Error(data.message || "Login failed");
}

setUser(data.user);

if (data.user.role === "STUDENT") {
  router.push("/student/dashboard");
}
if( data.user.role=== "TEACHER") {
  router.push("/teacher/dashboard");
}
if( data.user.role=== "ADMIN") {
  router.push("/admin/dashboard");
}else{
  setError(" Not authorized")
}
    }catch(error){
      setError(error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
  
   
    <div className="w-full max-w-md  border-8 border-b-cyan-700 border-r-fuchsia-700 bg-background p-6 shadow-cyan-400">
       
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Login to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full  border-4 bg-background px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full  border-4 bg-background px-4 py-3 outline-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blur px-4 py-3 text-white transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

      </form>
    </div>
    
  );
};

export default LoginForm;