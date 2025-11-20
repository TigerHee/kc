/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';
import { queryString } from 'Bot/helper';

const templateType = 7;
/**
 * 修改机器人参数
 */
export function updateBotParams(data) {
  return RobotHttp.post(`/v1/task/update/run_param?${queryString(data)}`);
}
/**
 * 获取默认配置参数
 */
export function getParams(symbol) {
  return RobotHttp.get('/v1/martingale/task/page/param', { symbol });
}
/**
 * 获取最小投资额度
 */
export function postMinInvest(data) {
  return RobotHttp.post('/v1/martingale/task/calculate/min-investment', data);
}
/**
 * 修改加仓价
 */
export function postModifyOpenPrice(data) {
  return RobotHttp.post('/v1/martingale/task/add-position/open-price', data);
}
// 获取热门交易对
export const getHotSymbols = () => {
  return RobotHttp.get('/v1/symbol/template/top-symbols', { templateType });
};

// 获取马丁币种列表
export const getAllSymbolTick = () => {
  return RobotHttp.get('/professional/web/tick', { templateType });
};

/**
 * 根据填写的参数，及时获取挂单信息
 */
export function getPlaceInfo(data) {
  // TOAST_NO 不需要弹出错误信息
  return RobotHttp.post('/professional/web/martingale/precompute', {
    ...data,
    TOAST_NO: true,
  });
}

/**
 * 是否已经开单
 */
export function getHasOpen(taskId) {
  return RobotHttp.get('/v1/martingale/task/add-position/before', { taskId });
}

/**
 * 确认追加投资额
 */
export function postAppendInvest(data) {
  return RobotHttp.post('/v1/martingale/task/add-position/confirm', data);
}

/**
 * 是否可以减仓
 */
export function getCanReducePosition(taskId) {
  return RobotHttp.get('/v1/martingale/task/reduce-position/before', {
    taskId,
  });
}

/**
 * 确认减仓
 */
export function postReduceInvest(data) {
  return RobotHttp.post('/v1/martingale/task/reduce-position/confirm', data);
}

/**
 *  追加投资额度情况下获取委托概览
 */
export function getOverviewInAppend(params) {
  return RobotHttp.get('/v1/martingale/task/add-position/precompute', params);
}

/**
 *  创建情况下获取委托概览
 */
export function getOverviewInCreate(data) {
  return RobotHttp.post('/v1/martingale/task/create/precompute', data);
}
