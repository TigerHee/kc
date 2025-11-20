import { request } from '@umijs/max';
import { API } from 'types';

/**
 * 获取任务列表
 * @param params
 * @returns
 */
export const getTaskList = (params: any) => {
  return request<{
    allTotal: number;
    selfTotal: number;
    total: number;
    list: API.TaskItem[];
  }>('/tasks/list', {
    method: 'GET',
    params,
  });
};

/**
 * 获取任务详情
 * @param id
 * @returns
 */
export const getTaskDetail = (id: string) => {
  return request<API.TaskItem>(`/tasks/${id}`, {
    method: 'GET',
  });
};

/**
 * 创建任务
 * @param params
 * @returns
 */
export const createTask = (params: API.TaskItem) => {
  return request<API.Response<API.TaskItem>['data']>('/tasks', {
    method: 'POST',
    data: params,
  });
};

/**
 * 更新任务
 * @param id
 * @param params
 * @returns
 */
export const updateTask = (id: string, params: Partial<API.TaskItem>) => {
  return request<API.Response<API.TaskItem>['data']>(`/tasks/${id}`, {
    method: 'PUT',
    data: params,
  });
};

/**
 * 删除任务
 */
export const deleteTask = (id: string) => {
  return request<API.Response<API.TaskItem>['data']>(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 刷新任务
 * @param id
 * @returns
 */
export const refreshTask = (id: string) => {
  return request<API.Response<API.TaskItem>['data']>(`/tasks/${id}/refresh`, {
    method: 'POST',
  });
};

/**
 * 获取「万能任务」看板信息
 */
export const getBlackHoleInfo = () => {
  return request<API.BlackHoleInfo>('/black-hole-task', {
    method: 'GET',
  });
};

/**
 * 获取「万能任务」提交记录
 * @param params
 * @returns
 */
export const getBlackHoleCommitList = (params: any) => {
  return request<API.getBlackHoleCommitList>('/black-hole-task/commits', {
    method: 'GET',
    params,
  });
};

/**
 * 更新「万能任务」提交记录的已读状态
 */
export const updateBlackHoleCommitReadStatus = (id: string) => {
  return request(`/black-hole-task/commits/read-status/${id}`, {
    method: 'PUT',
    data: {
      readStatus: true,
    },
  });
};
