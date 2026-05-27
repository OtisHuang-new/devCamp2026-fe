import axios from 'axios';

// Thay đổi URL này cho đúng với cổng chạy Backend của bạn
const BASE_URL = 'http://localhost:3000/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm token vào header trước khi gửi request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Xử lý tập trung các lỗi global (ví dụ: Token hết hạn - 401)
axiosClient.interceptors.response.use(
  (response) => response.data, // Chỉ trả về phần data để bên ngoài code ngắn gọn hơn
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý khi token hết hạn: Xóa token và reload hoặc đẩy về trang login
      localStorage.removeItem('access_token');
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default axiosClient;
