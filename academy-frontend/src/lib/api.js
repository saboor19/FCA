import axios from "axios";

const baseURL = process.env.NODE_ENV === 'development' 
  ? ''   // use Next.js rewrites in dev
  : process.env.NEXT_PUBLIC_API_URL; // use real backend URL in production

const api = axios.create({
  baseURL,
  withCredentials: true
});

export default api;