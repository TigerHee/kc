import { post } from 'tools/request';
import { AxiosResponse } from 'axios';

export const logout = () => {
  return post('/logout') as Promise<{ code: string; msg: string; data: any; retry?: boolean; success?: boolean }>;
}

