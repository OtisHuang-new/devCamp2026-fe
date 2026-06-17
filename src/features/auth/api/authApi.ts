// Vị trí: src/features/auth/api/authApi.ts
import axiosClient from '../../../shared/api/axiosClient';
// 1. SỬA IMPORT: Bổ sung LogoutResponse
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  LogoutResponse,
} from '../types/authTypes';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => {
    return axiosClient.post('/auth/login', data);
  },

  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return axiosClient.post('/auth/register', data);
  },

  // 2. THÊM HÀM LOGOUT MỚI
  logout: (): Promise<LogoutResponse> => {
    return axiosClient.post<LogoutResponse, LogoutResponse>('/auth/logout');
  },
};
