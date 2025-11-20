/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp, RobotAdminHttp } from 'Bot/utils/request';

/**
 * @description: 获取策略匹配的交易对
 * @return {*}
 */
export function getSymbolMatch() {
  return RobotHttp.get('/v1/symbol/template/all');
}
/**
 * 获取机器人列表
 */
export function getMachineLists() {
  return RobotHttp.get('/v1/task/template/query');
}

export function getMachineListsV2() {
  return RobotHttp.get('/v2/task/template/query');
}
/**
 * 获取机器人详情
 */
export function getMachineDetail(id) {
  return RobotHttp.get('/v1/task/template/get', { id });
}

/**
 * 获取banner
 */
export function getBanner() {
  return RobotHttp.get('/v2/banner/query');
}

/**
 * 获取新首页banner
 */
export function getNewBanner() {
  return RobotAdminHttp.get('/v1/new/h5/banner/query');
}

/**
 * 获取7日收益
 */
export function getSevenProfit(templateId) {
  return RobotHttp.get('/v1/profit/template/last-seven-day/top-rates', {
    templateId,
  });
}

/**
 * 获取今日排行榜
 */
export function getTodayProfit(templateId, day, symbol, type) {
  return RobotHttp.get('/v1/profit/template/symbol/top-rates', {
    templateId,
    day,
    symbol,
    type,
  });
}

/**
 * 获取总收益
 */
export function getTotalProfit(templateId) {
  return RobotHttp.get('/v1/profit/template/top-rates', { templateId });
}

/**
 * 运行机器人
 */
export function runMachine(data) {
  return RobotHttp.post('/v1/task/run', data);
}

/**
 * 判断运行弹框验证
 */
export function isFirstRun(type) {
  return RobotHttp.get(`/v1/user/robot/opened?type=${type}`);
}

/**
 * 发送验证码
 */
export function sendNotice(pushChannel) {
  return RobotHttp.post(`/v1/notice/push?pushChannel=${pushChannel}`);
}

/**
 * 触发生成子账号
 */
export const createSubAccount = () => {
  return RobotHttp.post('/v1/sub/user/generate');
};

/**
 * 转入转出记录
 */
export const fundTransfers = (taskId) => {
  return RobotHttp.post('/v1/position/update/list', {
    taskId,
    types: [2, 3, 4],
  });
};

/**
 * 获取排行榜数据
 */
export const getRankingByStraType = (params) => {
  return RobotHttp.get('/v2/profit/running/rank', params);
};

/**
 * 获取排行榜 参数详情数据
 */
export const getRankingParamsByTaskId = (params) => {
  return RobotHttp.get('/v1/task/params', params);
};

/**
 * 判断用户是否创建过合约机器人,templateType=3
 */
export const isNewUser = (params) => {
  return RobotHttp.get('/v1/user/is-new', params);
};
// 主要用里面kycCountryCode字段
export const getBotUserInfo = () => {
  return RobotHttp.get('/v1/user/info');
};
