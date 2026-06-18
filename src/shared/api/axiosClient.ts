import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('Token hiện tại trong LocalStorage:', token);
    if (token) {
      config.headers = config.headers || {};

      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('[AXIOS - RESPONSE] Bị backend báo lỗi 401 Unauthorized -> Tiến hành xóa token!');
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default axiosClient;
