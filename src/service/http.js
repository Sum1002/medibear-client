import axios from "axios";

// Use relative base URL; Vite proxy will forward to backend
const baseUrl = "http://localhost:8000/api";

// Global response interceptor: if any request returns 401/403, log out and redirect to login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("logged_in_user");
      } catch (e) {
        // ignore
      }
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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
  return axios.post(`${baseUrl}/products/${productId}`, productData, {
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
  const isFormData = payload instanceof FormData;
  return axios.post(`${baseUrl}/orders`, payload, {
    headers: getAuthHeaders(isFormData),
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

// Complaints APIs
export const getOrderComplaints = (orderId) => {
  return axios.get(`${baseUrl}/orders/${orderId}/complaints`, {
    headers: getAuthHeaders(),
  });
};

export const createOrderComplaint = (orderId, message) => {
  return axios.post(
    `${baseUrl}/orders/${orderId}/complaints`,
    { message },
    {
      headers: getAuthHeaders(),
    },
  );
};

// Pharmacy summary
export const getPharmacySummary = () => {
  return axios.get(`${baseUrl}/pharmacy/summary`, {
    headers: getAuthHeaders(),
  });
};

// User Profile APIs
export const getUserDetails = () => {
  return axios.get(`${baseUrl}/user/details`, {
    headers: getAuthHeaders(),
  });
};

export const updateUserProfile = (formData) => {
  return axios.post(`${baseUrl}/user/update-profile`, formData, {
    headers: getAuthHeaders(true), // true for FormData
  });
};

// Address APIs
export const createAddress = (addressData) => {
  return axios.post(`${baseUrl}/addresses`, addressData, {
    headers: getAuthHeaders(),
  });
};

export const updateAddress = (id, addressData) => {
  return axios.post(`${baseUrl}/addresses/${id}`, addressData, {
    headers: getAuthHeaders(),
  });
};

export const deleteAddress = (id) => {
  return axios.delete(`${baseUrl}/addresses/${id}`, {
    headers: getAuthHeaders(),
  });
};

// Favorite Pharmacy APIs
export const addFavoritePharmacy = (pharmacyId) => {
  return axios.post(
    `${baseUrl}/favorites`,
    { pharmacy_id: pharmacyId },
    {
      headers: getAuthHeaders(),
    },
  );
};

export const removeFavoritePharmacy = (pharmacyId) => {
  return axios.delete(`${baseUrl}/favorites/${pharmacyId}`, {
    headers: getAuthHeaders(),
  });
};

// Pharmacy Profile APIs
export const getPharmacyProfile = () => {
  return axios.get(`${baseUrl}/pharmacy/profile`, {
    headers: getAuthHeaders(),
  });
};

export const updatePharmacyProfile = (formData) => {
  return axios.post(`${baseUrl}/pharmacy/update-profile`, formData, {
    headers: getAuthHeaders(true), // true for FormData
  });
};

// Admin APIs
export const getPendingPharmacies = () => {
  return axios.get(`${baseUrl}/admin/pharmacies/pending`, {
    headers: getAuthHeaders(),
  });
};

export const approvePharmacy = (pharmacyId) => {
  return axios.post(`${baseUrl}/admin/pharmacies/${pharmacyId}/approve`, {}, {
    headers: getAuthHeaders(),
  });
};

export const rejectPharmacy = (pharmacyId) => {
  return axios.post(`${baseUrl}/admin/pharmacies/${pharmacyId}/reject`, {}, {
    headers: getAuthHeaders(),
  });
};

export const getAllOrders = () => {
  return axios.get(`${baseUrl}/admin/orders`, {
    headers: getAuthHeaders(),
  });
};

export const getUserComplaints = () => {
  return axios.get(`${baseUrl}/admin/user-complaints`, {
    headers: getAuthHeaders(),
  });
};

// User complaint (public)
export const postUserComplaint = (payload) => {
  return axios.post(`${baseUrl}/user-complaints`, payload, {
    headers: getAuthHeaders(),
  });
};

export const getMyComplaints = () => {
  return axios.get(`${baseUrl}/user-complaints`, {
    headers: getAuthHeaders(),
  });
};

export const respondToComplaint = (complaintId, payload) => {
  // payload should be an object like { status, admin_response }
  return axios.post(
    `${baseUrl}/admin/user-complaints/${complaintId}/respond`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );
};

export const updateUserStatus = (userId, status) => {
  return axios.post(
    `${baseUrl}/admin/users/${userId}/status`,
    { status },
    {
      headers: getAuthHeaders(),
    }
  );
};

export const getAllUsers = (params = {}) => {
  return axios.get(`${baseUrl}/admin/users`, {
    params,
    headers: getAuthHeaders(),
  });
};