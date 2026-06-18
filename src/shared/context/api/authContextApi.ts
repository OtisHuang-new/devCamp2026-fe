import axiosClient from '../../api/axiosClient';
import type { UserInfo } from '../types/contextTypes';

let pendingMeRequest: Promise<UserInfo> | null;

export function fetchMeDeduped(): Promise<UserInfo> {
  if (pendingMeRequest) return pendingMeRequest;

  pendingMeRequest = axiosClient.get<unknown, UserInfo>('auth/me').finally(() => {
    pendingMeRequest = null;
  });

  return pendingMeRequest;
}
