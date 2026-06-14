import axiosClient from '../../../shared/api/axiosClient';
import type { UpdateProfileRequest, UpdateProfileResponse } from '../types/apiTypes';

export async function updateProfileApi(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  //dùng axiosClient.patch

  const respond = await axiosClient.patch<UpdateProfileResponse, UpdateProfileResponse>(
    '/auth/me',
    data,
  );

  return respond;
}
