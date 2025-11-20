import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取功能更新公告列表
 * @returns
 */
export const getFeatureAnnouncementList = (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getFeatureAnnouncementList>['data']>(
    '/announcement/feature-upgrade',
    {
      method: 'GET',
      params,
    },
  );
};

/**
 * 删除功能更新公告
 */
export const deleteFeatureAnnouncement = (id: string) => {
  return request<API.Response<API.getFeatureAnnouncementList>['data']>(
    '/announcement/feature-upgrade/' + id,
    {
      method: 'DELETE',
    },
  );
};

/**
 * 发布功能更新公告
 * @param data
 * @returns
 */
export const createFeatureAnnouncement = (data: API.FeatureAnnouncementItem) => {
  return request<API.Response<API.FeatureAnnouncementItem>['data']>(
    '/announcement/feature-upgrade',
    {
      method: 'POST',
      data,
    },
  );
};

/**
 * 获取系统停机公告列表
 * @returns
 */
export const getSystemBreakdownAnnouncementList = (params: {
  current?: number;
  pageSize?: number;
}) => {
  return request<API.Response<API.getSystemBreakdownAnnouncementList>['data']>(
    '/announcement/system-breakdown',
    {
      method: 'GET',
      params,
    },
  );
};

/**
 * 发布系统停机公告
 * @param data
 * @returns
 */
export const createSystemBreakdownAnnouncement = (data: API.SystemBreakdownAnnouncementItem) => {
  return request<API.Response<API.SystemBreakdownAnnouncementItem>['data']>(
    '/announcement/system-breakdown',
    {
      method: 'POST',
      data,
    },
  );
};
