import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取API Key列表
 * @returns
 */
export const getApiKeyList = () => {
  return request<API.Response<API.getApiKeyList>['data']>('/apikeys', {
    method: 'GET',
  });
};

/**
 * 创建API Key
 * @param data
 * @returns
 */
export const createApiKey = (data: API.createApiKey) => {
  return request<API.Response<API.createApiKey>['data']>('/apikeys', {
    method: 'POST',
    data,
  });
};
