/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';
import { siteCfg } from 'config';

const isDebug = true;

const CMS = siteCfg['API_HOST.CMS'];

/**
 * 获取全站汇总数据
 *
 * @returns {Object}
 */
export async function getSummary(currency) {
  return pull(`/promotion/campaign/last24HourIncome/${currency}`);
}

/**
 * 获取新闻列表
 *
 * @returns {Object}
 */
export async function getNews(params = {}) {
  return pull(`${CMS}/cms/articles`, params);
}
/**
 * 文章详情
 * @param path 文章路由
 */
export async function pullArticleDetail(path) {
  return pull(`${CMS}/cms/articles/${path}`);
}

/**
 * 杠杆答题 答题json
 */
export async function pullMarginTradeExamContent() {
  return pull('/margin-config/inner/configs/margin-trading-exam');
}

/**
 * 杠杆ETF答题 答题json
 */
export async function pullEtfExamContent() {
  return pull('/margin-fund/agreement/trading-exam');
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
export async function getCountryCodes(params) {
  return pull('/ucenter/country-codes');
}

/**
 * 获取用户手续费
 */
export async function getUserTradeFee() {
  return pull('/trade-front/level/getUserLevel');
}

/**
 * 获取用户VIP等级
 */
export async function getUserVipInfo(symbol) {
  // return pull('/ucenter/user-vip-info');
  const op = {};
  if (symbol) {
    op.symbol = symbol;
  }
  return pull('/kucoin-web-front/fee/getExchangeLevelAndFee', op);
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
// 获取otc支持的语言列表
export const getLanguageTypes = (params) => {
  return pull('/otc/dictionary/getData', params);
};
