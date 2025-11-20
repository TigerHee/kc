import { request } from '@umijs/max';
import { API } from 'types';
import { Common } from 'types/common';

/**
 * 获取仓库列表
 * @param params
 * @returns
 */
export const getReposList = (params: any) => {
  return request<API.Response<API.getReposList>['data']>('/repos', {
    method: 'get',
    params,
  });
};

/**
 * 创建仓库
 * @param params
 * @returns
 */
export const createRepo = (params: API.ReposItem) => {
  return request<API.Response<API.ReposItem>['data']>('/repos', {
    method: 'post',
    data: params,
  });
};

/**
 * 删除仓库
 * @param id
 * @returns
 */
export const deleteRepo = (id: string) => {
  return request<API.Response>('/repos/' + id, {
    method: 'delete',
  });
};

/**
 * 更新仓库
 * @param id
 * @param params
 * @returns
 */
export const updateRepo = (id: string, params: Partial<API.ReposItem>) => {
  return request<API.Response<API.ReposItem>['data']>(`/repos/${id}`, {
    method: 'put',
    data: params,
  });
};

/**
 * 获取仓库分组
 * @returns
 */
export const getReposGroup = () => {
  return request<Common.SelectOptionItem[]>('/repos/group', {
    method: 'get',
  });
};

/**
 * 获取仓库配置列表
 * @returns
 */
export const getReposOptions = () => {
  return request<Common.ReposOptionItem[]>('/repos/options', {
    method: 'get',
  });
};
