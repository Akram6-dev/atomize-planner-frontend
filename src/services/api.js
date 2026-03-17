import axios from "axios";

const api = axios.create({
  baseURL: "https://api.atomizeplanner.test/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const customError = {
      message: error.response?.data?.message || "Something went wrong",
      errors: error.response?.data?.errors || null,
      status: error.response?.status,
      original: error,
    };

    return Promise.reject(customError);
  }
);

export default api;