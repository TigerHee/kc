import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取任务列表
 * @param query
 * @returns
 */
export const getJobList = (query: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getJobList>['data']>('/agenda/task', {
    method: 'GET',
    params: query,
  });
};

/**
 * 获取任务日志列表
 * @param query
 * @returns
 */
export const getJobLog = (query: { current?: number; pageSize?: number }) => {
  return request<API.Response<API.getJobLog>['data']>(`/agenda/task/log`, {
    method: 'GET',
    params: query,
  });
};

/**
 * 获取任务定义列表
 * @returns
 */
export const getJobDefine = () => {
  return request<API.Response<API.getJobDefine>['data']>('/agenda/task/defined', {
    method: 'GET',
  });
};

/**
 * 获取看板信息
 * @returns
 */
export const getAgendaDashboardInfo = () => {
  return request<API.Response<API.getAgendaDashboardInfo>['data']>('/agenda', {
    method: 'GET',
  });
};

/**
 * 获取任务的日志列表
 * @param jobId
 * @returns
 */
export const getJobListByJobId = (jobId: string, params = {}) => {
  return request<API.Response<API.getJobListByJobId>['data']>(`/agenda/task/${jobId}/logs`, {
    method: 'GET',
    params,
  });
};

/**
 * 清洗所有任务
 * @returns
 */
export const purgeJob = () => {
  return request<API.Response<{ number: number }>['data']>(`/agenda/task/action/purge`, {
    method: 'DELETE',
  });
};

/**
 * 删除任务
 */
export const deleteJob = (jobId: string) => {
  return request(`/agenda/task/action/remove/${jobId}`, {
    method: 'DELETE',
  });
};

/**
 * 手动完成执行任务
 * @param jobId
 * @returns
 */
export const manualCompleteJob = (jobId: string) => {
  return request(`/agenda/task/action/manual-complete/${jobId}`, {
    method: 'PUT',
  });
};

/**
 * 触发「立即」任务
 * @param data
 * @returns
 */
export const triggerImmediate = (data: { name: string; payload: Record<string, any> }) => {
  return request(`/agenda/task/invoke/immediate`, {
    method: 'POST',
    data,
  });
};

/**
 * 触发「周期」任务
 * @param data
 * @returns
 */
export const triggerInterval = (data: {
  name: string;
  interval: string;
  payload: Record<string, any>;
}) => {
  return request(`/agenda/task/invoke/interval`, {
    method: 'POST',
    data,
  });
};

/**
 * 触发「计划」任务
 * @param data
 * @returns
 */
export const triggerSchedule = (data: {
  name: string;
  cron: string;
  payload: Record<string, any>;
}) => {
  return request(`/agenda/task/invoke/schedule`, {
    method: 'POST',
    data,
  });
};
