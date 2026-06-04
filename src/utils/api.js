import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://backend-hotel-three.vercel.app/api',
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
