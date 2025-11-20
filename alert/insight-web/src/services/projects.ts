import { request } from '@umijs/max';
import { API } from 'types';
import { Common } from 'types/common';

/**
 * 获取项目列表
 * @param params
 * @returns
 */
export const getProjectsList = async (params: any) => {
  return request<API.Response<API.getProjectsList>['data']>('/projects/list', {
    method: 'GET',
    params,
  });
};

/**
 * 创建项目
 * @param data
 * @returns
 */
export const createProject = async (data: { repos: string; name: string; owner: string }) => {
  return request<API.ProjectsItem>('/projects', {
    method: 'POST',
    data,
  });
};

/**
 * 删除项目
 * @param id
 * @returns
 */
export const deleteProject = async (id: string) => {
  return request<API.ProjectsItem>(`/projects/${id}`, {
    method: 'DELETE',
  });
};

/**
 * 更新项目
 * @param id
 * @param data
 * @returns
 */
export const updateProject = async (id: string, data: any) => {
  return request<API.ProjectsItem>(`/projects/${id}`, {
    method: 'PUT',
    data,
  });
};

/**
 * 获取项目配置列表
 * @returns
 */
export const getProjectsOptions = async () => {
  return request<Common.SelectOptionItem[]>('/projects/options', {
    method: 'GET',
  });
};

/**
 * 获取项目汇总路由
 * @returns
 */
export const getProjectGatherRoute = async (params: any) => {
  return request<API.Response<API.getProjectGatherRoute>['data']>('/projects/gather-route', {
    method: 'GET',
    params,
  });
};

/**
 * 刷新项目的路由
 */
export const reloadProjectRoutes = async (id: string) => {
  return request<API.Response<API.getProjectGatherRoute>['data']>('/projects/reload-routes/' + id, {
    method: 'PUT',
  });
};

/**
 * 获取项目详情
 * @param name
 * @returns
 */
export const getProjectDetailByName = async (name: string) => {
  return request<API.ProjectsItemDetail>('/projects/' + name, {
    method: 'GET',
  });
};

/**
 * 获取项目详情的路由
 * @param name
 * @returns
 */
export const getProjectDetailByNameRoutes = async (name: string) => {
  return request<API.RouteItem[]>('/projects/' + name + '/routes', {
    method: 'GET',
  });
};

/**
 * 获取项目详情 - 依赖
 */
export const getProjectDetailByNameDeps = async (name: string) => {
  return request<API.ProjectDetailDepsInfo>('/projects/' + name + '/deps', {
    method: 'GET',
  });
};

/**
 * 获取项目详情 - 离线包
 */
export const getProjectDetailByNameOffline = async (name: string) => {
  return request<API.ProjectDetailOfflineInfo>('/projects/' + name + '/offline', {
    method: 'GET',
  });
};

/**
 * 获取项目详情 - 路由加固
 */
export const getProjectDetailByNameJscrambler = async (name: string) => {
  return request<API.ProjectDetailJscramblerInfo>('/projects/' + name + '/jscrambler', {
    method: 'GET',
  });
};

/**
 * 获取项目详情的工作流
 * @param id
 * @returns
 */
export const getProjectDetailWorkflows = async (id: string) => {
  return request<API.ProjectWorkflowScheduleItem[]>('/projects/' + id + '/workflows', {
    method: 'GET',
  });
};

/**
 * 获取项目详情的记录
 * @param id
 * @returns
 */
export const getProjectDetailRecords = async (id: string, params: any = {}) => {
  type Res = {
    list: API.ProjectWorkflowRecordItem[];
    total: number;
  };
  return request<Res>('/projects/' + id + '/records', {
    method: 'GET',
    params,
  });
};

/**
 * 获取项目详情的调度的日志
 * @param id
 * @returns
 */
export const getProjectDetailLogs = async (id: string, params: any = {}) => {
  type Res = {
    list: API.LogItem[];
    total: number;
  };
  return request<Res>('/projects/' + id + '/logs', {
    method: 'GET',
    params,
  });
};
