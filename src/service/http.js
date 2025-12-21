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

export const createSupplier = (payload) => {
  return axios.post(`${baseUrl}/suppliers`, payload, {
    headers: getAuthHeaders(),
  });
};

export const updateSupplier = (id, payload) => {
  // Backend expects POST to /api/suppliers/{id} for update
  return axios.post(`${baseUrl}/suppliers/${id}`, payload, {
    headers: getAuthHeaders(),
  });
};

export const deleteSupplier = (id) => {
  return axios.delete(`${baseUrl}/suppliers/${id}`, {
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

export const getPopularProducts = () => {
  return axios.get(`${baseUrl}/products/popular`, {
    headers: {
      "Content-Type": "application/json",
    }
  });
};

export const getPopularProductsWithPagination = (
  offset = 0,
  limit = 20,
  pharmacyId,
) => {
  return axios.get(`${baseUrl}/products/popular`, {
    params: {
      offset,
      limit,
      ...(pharmacyId ? { pharmacy_id: pharmacyId } : {}),
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getPharmaciesWithPagination = (offset = 0, limit = 20) => {
  return axios.get(`${baseUrl}/pharmacies`, {
    params: { offset, limit },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const createOrder = (payload) => {
  return axios.post(`${baseUrl}/orders`, payload, {
    headers: getAuthHeaders(),
  });
};

export const getOrdersByUser = () => {
  return axios.get(`${baseUrl}/orders-by-user`, {
    headers: getAuthHeaders(),
  });
};

export const getOrdersByPharmacy = () => {
  return axios.get(`${baseUrl}/orders-by-pharmacy`, {
    headers: getAuthHeaders(),
  });
};

export const updateOrderStatus = (orderId, status) => {
  return axios.post(
    `${baseUrl}/orders/${orderId}/status`,
    { status },
    {
      headers: getAuthHeaders(),
    },
  );
};