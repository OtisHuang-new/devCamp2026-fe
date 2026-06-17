export interface UserInformation {
  job: string;
  level: number;
}

export interface RegisterRequest {
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
