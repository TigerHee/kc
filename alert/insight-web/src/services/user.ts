import { request } from '@umijs/max';
import { API } from 'types';
import { Common } from 'types/common';

/**
 * 登录
 * @returns
 */
export const login = (redirect?: string) => {
  return request('/auth/getAuthUrl', {
    method: 'GET',
    params: {
      redirect,
    },
  });
};

/**
 * 登出
 */
export const logout = () => {
  return request('/auth/logout', {
    method: 'GET',
  });
};

/**
 * 获取用户信息
 * @returns
 */
export const getUserInfo = () => {
  return request<API.Response<API.getUserInfo>['data']>('/user/info', {});
};

/**
 * 获取用户列表
 * @param params
 * @returns
 */
export const getUserList = (params: any) => {
  return request<API.Response<API.getUserList>['data']>('/user', {
    params,
  });
};

/**
 * 获取指定用户
 * @param id
 * @returns
 */
export const getSpecificUser = (id: string) => {
  return request<API.Response<API.UserItem>['data']>(`/user/${id}`, {
    method: 'GET',
  });
};

/**
 * 更新用户信息
 */
export const updateUserInfo = (id: string, data: any) => {
  return request(`/user/${id}`, {
    method: 'PUT',
    data,
  });
};

/**
 * 创建用户
 * @param data
 * @returns
 */
export const createUserApi = (data: any) => {
  return request(`/user`, {
    method: 'POST',
    data,
  });
};

/**
 * 更新自己的用户信息
 * @param data
 * @returns
 */
export const updateSelfUserInfo = (data: any) => {
  return request(`/user`, {
    method: 'PUT',
    data,
  });
};
/**
 * 获取用户下拉选项列表
 * @returns
 */
export const getUserListOptions = () => {
  return request<Common.UserSelectOptionItem[]>('/user/options', {
    method: 'GET',
  });
};

/**
 * 删除用户
 */
export const deleteUser = (id: string) => {
  return request(`/user/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 获取PR拒绝记录
 */
export const getPrRejectRecordList = (params: any) => {
  return request<API.Response<API.getPrRejectRecordList>['data']>('/user/prRejectRecord', {
    params,
  });
};

/**
 * 获取操作日志
 * @param id
 * @returns
 */
export const getUserActionLogs = (id: string) => {
  return request<API.UserActionLogItem[]>(`/user/${id}/action-logs`, {
    method: 'GET',
  });
};
