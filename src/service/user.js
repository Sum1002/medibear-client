import axios from "axios";
const baseUrl = "http://localhost:8000/api";



export const registerUser = (userData) => {
  return axios.post(`${baseUrl}/register`, userData);
};
