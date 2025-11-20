import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 解析sourcemap数据
 * @param params
 * @returns
 */
export const parserSourceMap = (params: { url: string; line: number; column: number }) => {
  return request<API.Response<API.parserSourceMapData>['data']>('/sourcemap', {
    method: 'GET',
    params,
  });
};
