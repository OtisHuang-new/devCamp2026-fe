import axiosClient from '../../../shared/api/axiosClient';
import type { UpdateProfileRequest, UpdateProfileResponse } from '../types/apiTypes';

export async function updateProfileApi(data: UpdateProfileRequest) {
  //dùng axiosClient.patch

  const respond: UpdateProfileResponse = await axiosClient.patch('/auth/update-profile', data);

  return respond;
}
