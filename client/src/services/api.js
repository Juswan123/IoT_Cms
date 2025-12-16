import axios from 'axios';

// Buat instance axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Sesuaikan port backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Otomatis pasang Token sebelum request dikirim
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle jika Token Expired (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Opsional: Redirect ke login atau hapus storage jika token basi
      // localStorage.clear();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;