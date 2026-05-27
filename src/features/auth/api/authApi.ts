import axiosClient from '../../../shared/api/axiosClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/authTypes';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> => {
    return axiosClient.post('/auth/login', data);
  },

  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return axiosClient.post('/auth/register', data);
  },
};
