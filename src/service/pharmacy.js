import axios from "axios";

// Use relative base URL; Vite proxy will forward to backend
const baseUrl = "http://localhost:8000/api";

const getAuthHeaders = (isFormData = false) => {
  const authToken = localStorage.getItem("auth_token");
  
  // For FormData: DO NOT set Content-Type; browser sets boundary automatically
  if (isFormData) {
    return {
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    };
  }
  
  // For JSON requests
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

export const fetchProducts = () => {
  return axios.get(`${baseUrl}/products`, {
    headers: getAuthHeaders(),
  });
};

export const fetchSuppliers = () => {
  return axios.get(`${baseUrl}/suppliers`, {
    headers: getAuthHeaders(),
  });
};

export const createProduct = (productData) => {
  const authToken = localStorage.getItem("auth_token");
  console.log("Auth token:", authToken ? "Present" : "Missing");
  console.log("Request headers:", getAuthHeaders(true));
  
  return axios.post(`${baseUrl}/products`, productData, {
    headers: getAuthHeaders(true), // true indicates FormData
  });
};

export const updateProduct = (productId, productData) => {
  return axios.put(`${baseUrl}/products/${productId}`, productData, {
    headers: getAuthHeaders(true), // true indicates FormData
  });
};
export const deleteProduct = (productId) => {
  return axios.delete(`${baseUrl}/products/${productId}`, {
    headers: getAuthHeaders(),
  });
};