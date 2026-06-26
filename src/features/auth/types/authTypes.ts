export interface UserInformation {
  job: string;
  level: number;
}

export interface RegisterRequest {
  name: string; // 1. MỚI: Thêm name vào Payload
  email: string;
  password: string;
  information: UserInformation;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  access_token: string;
}

export interface LogoutResponse {
  message: string;
}
// 1. THÊM MỚI: Các type dành cho Forgot & Reset Password
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
}
