import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取路由列表
 * @param params
 * @returns
 */
export const getRouteList = (params: any) => {
  return request<API.Response<API.getRouteList>['data']>('/routes', {
    method: 'GET',
    params,
  });
};

/**
 * 创建路由
 */
export const createRoute = (params: Partial<API.RouteItem>) => {
  return request<API.Response<API.RouteItem>['data']>('/routes', {
    method: 'POST',
    data: params,
  });
};

/**
 * 更新路由
 * @param id
 * @param params
 * @returns
 */
export const updateRoute = (id: string, params: Partial<API.RouteItem>) => {
  return request<API.Response<API.RouteItem>['data']>(`/routes/${id}`, {
    method: 'PUT',
    data: params,
  });
};
