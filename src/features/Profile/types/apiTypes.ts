export interface UpdateProfileRequest {
  _id: string;
  name: string;
  information: {
    job: string;
    level: number;
    background: string;
  };
}

export interface UpdateProfileResponse {
  name: string;
  information: {
    job: string;
    level: number;
    background: string;
  };
  updatedAt: string;
}
