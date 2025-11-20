import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取bitbucket repos列表
 * @param projectKey
 * @returns
 */
export const getReposByProjectKeyFromBitbucket = async (projectKey: string) => {
  return request<API.Response<API.ReposItem[]>['data']>(
    '/bitbucket/searchByProjectKey/' + projectKey,
  );
};
