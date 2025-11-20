import { request } from '@umijs/max';
import { API } from 'types';
import { ComplianceAPI } from 'types/compliance';

/**
 * 获取合规需求列表
 * @param params
 * @returns
 */
export const getComplianceDemandList = (params: any) => {
  return request<API.ListDataResponse<ComplianceAPI.ComplianceDemandItem>>('/compliance/demand', {
    method: 'GET',
    params,
  });
};

/**
 * 创建合规需求
 * @param data
 * @returns
 */
export const createComplianceDemand = (data: any) => {
  return request('/compliance/demand', {
    method: 'POST',
    data,
  });
};

/**
 * 删除合规需求
 * @param id
 * @returns
 */
export const deleteComplianceDemand = (id: string) => {
  return request('/compliance/demand/' + id, {
    method: 'DELETE',
  });
};

/**
 * 获取合规需求详情
 * @param id
 * @returns
 */
export const getComplianceDemandDetail = (id: string) => {
  return request<ComplianceAPI.ComplianceDemandItem>('/compliance/demand/detail/' + id, {
    method: 'GET',
  });
};

/**
 * 更新合规信息主字段
 * @param id
 * @param data
 * @returns
 */
export const updateComplianceDemand = (id: string, data: ComplianceAPI.ComplianceDemandItem) => {
  return request('/compliance/demand/' + id, {
    method: 'PUT',
    data,
  });
};

/**
 * 更新合规需求 代码扫描字段
 * @param id
 * @param data
 * @returns
 */
export const updateComplianceDemandCodeScan = (id: string, data: string[]) => {
  return request('/compliance/demand/' + id + '/code-scan', {
    method: 'PUT',
    data: {
      codeScan: data,
    },
  });
};

/**
 * 获取合规原子列表
 * @param params
 * @returns
 */
export const getComplianceAtomicList = (params: any) => {
  return request<API.ListDataResponse<ComplianceAPI.ComplianceAtomicItem>>('/compliance/atomic', {
    method: 'GET',
    params,
  });
};

/**
 * 更新合规原子
 * @param id
 * @param data
 * @returns
 */
export const updateComplianceAtomic = (id: string, data: ComplianceAPI.ComplianceAtomicItem) => {
  return request('/compliance/atomic/' + id, {
    method: 'PUT',
    data,
  });
};

/**
 * 获取合规原子选项
 * @param params
 * @returns
 */
export const getComplianceAtomicOptions = () => {
  return request<ComplianceAPI.ComplianceAtomicItem[]>('/compliance/atomic/options', {
    method: 'GET',
  });
};

/**
 * 获取原子扫描报告列表
 * @param params
 * @returns
 */
export const getComplianceReportList = (params: any) => {
  return request<API.ListDataResponse<ComplianceAPI.ComplianceAtomicReportItem>>(
    '/compliance/report',
    {
      method: 'GET',
      params,
    },
  );
};

/**
 * 更新合规原子 跳过字段
 * @param ids
 * @param isSkip
 * @returns
 */
export const updateComplianceAtomicIsSkip = (ids: string[], isSkip: boolean) => {
  return request('/compliance/atomic/skip', {
    method: 'PUT',
    data: {
      ids: ids,
      isSkip,
    },
  });
};

/**
 * 更新合规原子 跳过字段
 * @param ids
 * @param isSkip
 * @returns
 */
export const deleteComplianceAtomic = (ids: string[]) => {
  return request('/compliance/atomic/delete', {
    method: 'PUT',
    data: {
      ids: ids,
    },
  });
};

/**
 * 获取原子扫描报告详情
 * @param params
 * @returns
 */
export const getComplianceReportDetail = (id: string) => {
  return request<ComplianceAPI.ComplianceAtomicReportItem>('/compliance/report/detail/' + id, {
    method: 'GET',
  });
};
