import { request } from '@umijs/max';
import { API } from 'types';

// 告警列表
export const getAlertList = async (params: {
  current?: number;
  pageSize?: number;
  alarmGroup?: string;
  status?: string;
  message?: string;
  appKey?: string;
  relationUser?: string;
}) => {
  return request<API.Response<API.GetAlertList>['data']>('/alert/list', {
    method: 'GET',
    params,
  });
};

// 获取告警详情
export const getAlertDetail = async (params: {
  alarmGroup: string;
  url: string;
  message: string;
  _id?: string;
}) => {
  return request<API.Response<API.AlertItem>['data']>('/alert/detail', {
    method: 'GET',
    params,
  });
};

// 状态列表
export const getConfigStatus = async () => {
  return request<API.Response<API.AlertStatusList>['data']>('/alert/config/status', {
    method: 'GET',
  });
};

// 修改状态
export const changeStatus = async (data: { remark: string; status: string; _id: string }) => {
  return request<API.Response<{ success: boolean }>['data']>('/alert/change/status', {
    method: 'POST',
    data,
  });
};

// 修改结果相关数据
export const changeAlertData = async (data: {
  type: 'view' | 'finish';
  _id: string;
  isReset?: boolean;
}) => {
  return request<API.Response<{ success: boolean }>['data']>('/alert/change/alert-data', {
    method: 'POST',
    data,
  });
};

// 告警分析
export const getAlertAnalyze = async (params: { startTime: number; endTime: number }) => {
  return request<API.Response<API.GetAlertAnalyzeList>['data']>('/alert/analyze', {
    method: 'GET',
    params,
  });
};

// 同步最新数据
export const handleAlertScan = async () => {
  return request<API.Response<API.AlertAlarmGroupList>['data']>('/alert/scan', {
    method: 'POST',
  });
};

// 获取告警组
export const getAlertGroupList = async () => {
  return request<API.Response<API.GetAlertGroupList>['data']>('/alert-group/list', {
    method: 'GET',
  });
};

// 保存告警组
export const saveAlertGroup = async (data: { _id?: string; name: string }) => {
  return request<API.Response<API.AlertGroupItem>['data']>('/alert-group/save', {
    method: 'POST',
    data,
  });
};

// 删除告警组
export const delAlertGroup = async (data: { _id: string }) => {
  return request<API.Response<API.AlertGroupItem>['data']>('/alert-group/delete', {
    method: 'POST',
    data,
  });
};
