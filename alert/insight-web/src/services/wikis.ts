import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取必读wiki列表
 * @param query
 * @returns
 */
export const getMustReadWikisList = (params: any) => {
  return request<API.Response<API.getMustReadWikisList>['data']>('/wiki/must-read', {
    params,
  });
};

/**
 * 获取用户必读wiki的状态列表
 * @param id
 * @returns
 */
export const getUserMustReadWikisStatusList = (id: string) => {
  return request<API.MustReadWikisUserStatusItem[]>('/wiki/must-read/user/' + id);
};

/**
 * 新增必读wiki
 * @param data
 * @returns
 */
export const createMustReadWiki = (data: { pageId: number }) => {
  return request('/wiki/must-read', {
    method: 'POST',
    data,
  });
};

/**
 * 刷新必读wiki列表
 * @returns
 */
export const refreshMustReadWikiList = () => {
  return request('/wiki/must-read/refresh', {
    method: 'PUT',
  });
};

/**
 * 刷新单个必读wiki
 * @param pageId
 * @returns
 */
export const refreshMustReadWikiSingle = (pageId: string) => {
  return request('/wiki/must-read/refresh/' + pageId, {
    method: 'PUT',
  });
};

/**
 * 删除必读wiki
 * @param pageId
 * @returns
 */
export const deleteMustReadWiki = (pageId: string) => {
  return request('/wiki/must-read/' + pageId, {
    method: 'DELETE',
  });
};
