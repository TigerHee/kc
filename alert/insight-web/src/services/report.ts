import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取 one trust 扫描报告
 * @param params
 * @returns
 */
export const getOneTrustReport = async (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getOneTrustReport>['data']>('/onetrust/report/cookies-scan', {
    method: 'GET',
    params,
  });
};

/**
 * 获取 safe browsing 扫描报告
 * @param params
 * @returns
 */
export const getSafebrowsingReport = async (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getSafebrowsingReport>['data']>('/safebrowsing/report/domains', {
    method: 'GET',
    params,
  });
};

/**
 * 获取 virustotal 扫描报告
 * @param params
 * @returns
 */
export const getVirustotalReport = async (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getVirustotalReport>['data']>('/virustotal/report/domains', {
    method: 'GET',
    params,
  });
};

/**
 * 获取 package.json 扫描报告
 * @param params
 * @returns
 */
export const getPackageJsReport = async (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getPackageJsReport>['data']>(
    '/bitbucket/scan/package.json/list',
    {
      method: 'GET',
      params,
    },
  );
};

/**
 * 获取 jscrambler 扫描报告
 * @param params
 * @returns
 */
export const getJscramblerReport = async (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getJscramblerReport>['data']>(
    '/bitbucket/scan/jscrambler.config.json/list',
    {
      method: 'GET',
      params,
    },
  );
};

/**
 * 获取离线配置文件
 * @param params
 * @returns
 */
export const getOffConfigReport = async (params: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getOffConfigReport>['data']>(
    '/bitbucket/scan/offconfig.js/list',
    {
      method: 'GET',
      params,
    },
  );
};
