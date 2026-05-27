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

// Bám sát format trả về trong AuthService.js của Backend
export interface AuthResponse {
  status: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // Chứa _id, name, email,...
  access_token: string;
}
