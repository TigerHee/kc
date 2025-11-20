/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';
import config from 'config';

const { siteCfg } = config;
const host = siteCfg['API_HOST.ROBOT'];
const prefix = `${host}/cloudx-scheduler`;
const robotStop = `${host}/cloudx-admin`;

const templateType = 1;
// 获取网格配置的交易对信息
export const getGridSymbols = () => {
  return pull(`${prefix}/v1/symbol/tick`, { templateType });
};
// 获取配置的ai 参数
export const getAIParams = (symbolCode) => {
  return pull(`${prefix}/v1/grid/task/ai/params`, { symbol: symbolCode });
};
// 获取网格手续费
export const getSymbolInfo = (symbolCode) => {
  return pull(`${prefix}/v1/grid/task/symbol/info`, {
    type: templateType,
    symbol: symbolCode,
  });
};
// 获取网格交易对信息 里面有minimumOrderValue字段
export const getSymbolTick = (symbolCode) => {
  return pull(`${prefix}/v1/symbol/symbol-ticks`, { symbols: symbolCode });
};
// 提交运行
export const postRun = (data) => {
  // PC标记
  data.channel = 'WEB';
  return post(`${prefix}/v1/task/run`, data, false, 'isJson');
};

// 获取追加投资额的最小值
export const getAppendMinInvestment = (symbolCode) => {
  return pull(`${prefix}/v1/grid/task/min/append/investment`, {
    symbol: symbolCode,
  });
};

// 追加投资额
export const appendInvestment = (data) => {
  return post(
    `${prefix}/v1/grid/task/append/investment`,
    data,
    false,
    'isJson',
  );
};

// 获取机器人持仓数量

export function getStoreAmount(taskId) {
  return pull(`${prefix}/v1/task/user/currency?taskId=${taskId}`);
}

/**
 * 获取运行中机器人列表 （当前订单）
 */
export function getRunningList(params) {
  return pull(`${prefix}/v1/task/user/query`, params);
}

/**
 * 获取机器人历史信息 （历史订单）
 */
export function getHistoryList(params) {
  return pull(`${prefix}/v1/profit/own/web-page`, params);
}

/**
 * 获取机器人历史信息 （历史订单）
 */
export function stopMachine({ taskId, sellAllBase, buyBase }) {
  return post(
    `${prefix}/v1/task/cancel?taskId=${taskId}&sellAllBase=${sellAllBase}&buyBase=${buyBase}`,
  );
}

/**
 * 获取机器人资产
 */
export function getBotsAssets() {
  return pull(`${prefix}/v1/account/overview?templateType=1`);
}

/**
 *  获取通知
 */
export function getNotice() {
  return pull(`${robotStop}/v1/admin/maintenance-status`);
}

/**
 * @description: 被动获取kyc 配置的标题 内容
 * @return {*}
 */
export const getKYCInfo = () => {
  return pull('/_api/user-dismiss/dismiss/notice/passive', {
    status: 'KYC_LIMIT',
  });
};
