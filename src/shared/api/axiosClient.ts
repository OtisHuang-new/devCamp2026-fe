import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm token
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage ngay tại thời điểm gọi API
    const token = localStorage.getItem('access_token');
    console.log('Token hiện tại trong LocalStorage:', token);
    if (token) {
      // Đảm bảo object headers tồn tại
      config.headers = config.headers || {};

      // THAY ĐỔI TẠI ĐÂY: Sử dụng phương thức .set() an toàn cho Axios v1.x+
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        // Fallback cho các bản Axios cũ hơn
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Xử lý lỗi global
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa token nếu bị 401 Unauthorized
      console.log('[AXIOS - RESPONSE] Bị backend báo lỗi 401 Unauthorized -> Tiến hành xóa token!');
      localStorage.removeItem('access_token');
      // Tùy chọn: Ép trình duyệt tải lại hoặc chuyển về trang login
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default axiosClient;
