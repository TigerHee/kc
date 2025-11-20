/**
 * Owner: lena@kupotech.com
 */
import { get } from '@tools/request';

// 获取kyc认证状态
export const getKycInfo = (params) => get(`/kyc/web/kyc/result/personal`, params);

// 机构认证状态
export const getKybInfo = (params) => {
  return get('/kyc/kyc/info', params);
};
