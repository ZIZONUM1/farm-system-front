
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Only show success message for non-GET requests
    if (response.data?.message && response.config.method?.toLowerCase() !== 'get') {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Only show error message for non-GET requests
    if (error.config.method?.toLowerCase() !== 'get') {
      const message = error.response?.data?.message || 'حدث خطأ ما';
      toast.error(message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }

    return Promise.reject(error);
  }
);

export default api;
