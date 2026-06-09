export interface UserInfo {
  _id: string;
  role: string;
  name: string;
  email: string;
  information: {
    job: string;
    level: number;
  };
  current_lesson_id: string | null;
  current_streak: number;
  score_avg: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginState: (token: string, user: UserInfo) => void;
  logoutState: () => void;
  updateUser: (data: Partial<UserInfo>) => void;
}
