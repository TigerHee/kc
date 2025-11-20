import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取告警列表
 * @param query
 * @returns
 */
export const getAlarmList = (query: any) => {
  return request<API.Response<API.getAlarmList>['data']>('/notification/alarm', {
    method: 'GET',
    params: query,
  });
};

/**
 * 获取告警列表 for admin
 * @param query
 * @returns
 */
export const getAlarmListForAdmin = (query: any) => {
  return request<API.Response<API.getAlarmList>['data']>('/notification/alarm/admin', {
    method: 'GET',
    params: query,
  });
};

/**
 * 获取系统消息列表
 * @param query
 * @returns
 */
export const getSystemMessageList = (query: any) => {
  return request<API.Response<API.getSystemMessageList>['data']>('/notification/system', {
    method: 'GET',
    params: query,
  });
};

/**
 * 设置消息已读
 */
export const setSystemReadAction = (id: string) => {
  return request(`/notification/system/${id}/read`, {
    method: 'PUT',
  });
};

/**
 * 获取消息未读数量
 */
export const getUnreadMessageCount = () => {
  return request<number>('/notification/system/unread', {
    method: 'GET',
  });
};

/**
 * 设置告警已读
 */
export const setAlarmReadAction = (id: string) => {
  return request(`/notification/alarm/${id}/read`, {
    method: 'PUT',
  });
};

/**
 * 获取告警未读数量
 */
export const getUnreadAlarmCount = () => {
  return request<number>('/notification/alarm/unread', {
    method: 'GET',
  });
};
