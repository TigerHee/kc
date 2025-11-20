import { request } from '@umijs/max';
import { API } from 'types';
import { Common } from 'types/common';

/**
 * 获取工作流列表
 * @param params
 * @returns
 */
export const getWorkflowList = async (params: any) => {
  return request<API.Response<API.getWorkflowList>['data']>('/workflow', {
    method: 'GET',
    params: params,
  });
};

/**
 * 获取工作流选项
 * @returns
 */
export const getWorkflowOptions = async () => {
  return request<API.Response<Common.WorkflowOptionItem[]>['data']>('/workflow/options', {
    method: 'GET',
  });
};

/**
 * 更新工作流
 * @param data
 * @returns
 */
export const updateWorkflow = async (id: string, data: Partial<API.WorkflowItem>) => {
  return request(`/workflow/${id}`, {
    method: 'PUT',
    data,
  });
};

/**
 * 新建工作流
 * @param data
 * @returns
 */
export const createWorkflow = async (data: Partial<API.WorkflowItem>) => {
  return request('/workflow', {
    method: 'POST',
    data,
  });
};

/**
 * 删除工作流
 * @param id
 * @returns
 */
export const deleteWorkflow = async (id: string) => {
  return request(`/workflow/${id}`, {
    method: 'DELETE',
  });
};
