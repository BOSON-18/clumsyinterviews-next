import axios from "axios";

// Create an axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;