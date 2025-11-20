/**
 * Owner: iron@kupotech.com
 */
import { post, get } from '@tools/request';

// 初级kyc认证
export const primarySubmit = (params) => post('/kyc/web/kyc/primary/submit', params);

// 更新初级kyc认证
export const primaryUpdate = (params) => post('/kyc/web/kyc/primary/update', params);

// 更新初级kyc认证 - 打回
export const primaryUpdateForClear = (params) => post('/kyc/kyc/clear/primary/update', params);

// 获取kyc认证状态
export const getKycInfo = (params) => get(`/kyc/web/kyc/result/personal`, params);

// KYC获取国家接口
export const kycGetCountries = (params) => get('/kyc/kyc/regions/v2', params);

// 获取国家证件类型
export const getIdentityTypes = (params) => get('/kyc/web/kyc/identity-type/config', params);

// 查询kyc打回状态
export const getKycClearInfo = (params) => {
  return get('/kyc/kyc/clear/info', params);
};

// 打回kyc
export const clearInfo = (params) => {
  return post('/kyc/kyc/clear?clearType=0', params);
};

// 通用获取kyc前端展示文案接口
export const getKycFrontText = (params) => {
  return post('/kyc/kyc/front/text/v2', params);
};

// 获取州省列表
export const getKycState = (params) => get(`/kyc/web/kyc/state/list`, params);

// TR 获取所有职业
export const getTrOccupation = (params) => get('/kyc/kyc/allOccupation', params);
