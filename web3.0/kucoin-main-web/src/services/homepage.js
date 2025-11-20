/**
 * Owner: willen@kupotech.com
 */
import { pull, post } from 'tools/request';
import config from 'config';
import { pullWrapper } from 'utils/pullCache';

const {
  v2ApiHosts: { CMS },
} = config;
/**
 * 获取全站汇总数据
 *
 * @returns {Object}
 */
export async function getSummary(currency) {
  const _pull = pullWrapper(pull);
  return _pull(`/promotion/campaign/last24HourIncome/${currency}`);
}

/**
 * 获取全站24H交易量统计(包含合约交易量)
 * @param {*} currency
 * @returns
 */
export function getContractSummary(currency = 'USDT') {
  return pull(`/kucoin-web-front/statistics/last24HourIncome?currency=${currency}`);
}

/**
 * 获取新闻列表
 *
 * @returns {Object}
 */
export async function getNews({ pageSize }) {
  return pull(`${CMS}/cms/articles`, { pageSize });
}

/**
 * 获取活动列表
 *
 * @returns {Object}
 */
export async function getActivity({ pageSize }) {
  return pull(`${CMS}/cms/activity`, { pageSize });
}

/**
 * 获取广告列表
 *
 * @returns {Object}
 */
export async function getAds(payload) {
  return pull(`${CMS}/cms/ads`, payload);
}

/**
 * 获取资讯列表
 *
 * @returns {Object}
 */
export async function getTradeNews(payload) {
  return pull(`${CMS}/cms/news`, payload);
}

/**
 * 获取登录记录
 * @returns {Promise<*>}
 */
export async function getLoginLogs({ page = 1, pageSize = 6 }) {
  const _pull = pullWrapper(pull);

  return _pull('/ucenter/user-overview/ip-records', {
    page,
    pageSize,
  });
}

export async function getDeviceList() {
  return pull('/ucenter/user-overview/device/list');
}

/**
 * 获取用户安全等级
 */
export async function getSecurityLevel() {
  return pull('/ucenter/user/security-level');
}

/**
 * 移除用户信任设备
 * @param {*} deviceId
 */
export async function removeTrust(deviceId) {
  return post('/ucenter/user-overview/device/cancel-trust', { deviceId });
}

/**
 * 获取用户账号概览基本信息
 */
export async function getUserOverviewInfo() {
  return pull('/ucenter/user-overview/user-info');
}

/**
 * 获取用户安全记录
 */
export async function getUserOperationLog({ page, pageSize }) {
  return pull('/ucenter/user-overview/user-operation', { page, size: pageSize });
}

/**
 * 获取国家codes
 * @param {} params
 */
export async function getCountryCodes() {
  return pull('/ucenter/country-codes');
}

/**
 * 获取用户区号
 * @param {} params
 */
export async function getUserArea(param) {
  return pull('/universal-core/ip/country', param);
}

/**
 * 获取用户手续费
 */
export async function getUserTradeFee() {
  return pull('/trade-front/level/getUserLevel');
}

export async function getFeeDeductionConfig() {
  return pull('/trade-marketing/config/getFeeDeductionConfig');
}

/**
 * 获取用户是否开启了KCS 抵扣手续费
 *
 * @return  {[type]}  [return description]
 */
export async function checkIsKcsDiscountOn() {
  return pull('/ucenter/is-kcs-deduction-open');
}

/**
 * 用户设置KCS 抵扣手续费
 *
 * @param   {[type]}  enabled  [enabled description]
 *
 * @return  {[type]}           [return description]
 */
export async function updateKcsDiscount(enabled) {
  return post('/ucenter/update-kcs-deduction-config', {
    enabled,
  });
}
