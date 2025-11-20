/**
 * Owner: iron@kupotech.com
 */
import request, { get, post } from '@tools/request';
import '../common/httpInterceptors';
import siteConfig from './siteConfig';

const { KUMEX_GATE_WAY } = siteConfig;

export const getSupportPayTypes = (params) => {
  return get('/otc/dictionary/getData', params);
};

// 查询用户信息
export const getUserInfo = () => get('/ucenter/user-info');

// 退出登录
export const logout = () => {
  return post('/logout');
};

/**
 * 获取用户VIP等级
 */
export const getUserVipInfo = () => {
  return get('/kucoin-web-front/fee/getExchangeLevelAndFee');
};

/**
 * 获取用户合约费率
 */
export const getUserFutureFee = (params) => {
  return get('/kumex-trade/configs/getUserFee', params, {
    baseURL: window._WEB_RELATION_.KUMEX_GATE_WAY,
  });
};

/**
 * 获取kyc状态
 */
export const getKysStatus = () => {
  return get('/kyc/kyc/status');
};

// 获取资金概览数据
export const getAssetDetail = (query) => {
  return get('/kucoin-web-front/asset/overview', query);
};
// 获取资金概览数据
// export const getAssetDetail2 = (query) => {
//   return get('/kucoin-web-front/v2/asset/overview', query);
// };

// 获取资金概览数据
export const getAssetDetail3 = (query) => {
  return get('/kucoin-web-front/v3/asset/overview', query);
};

/**
 * 获取法币汇率
 *
 * @param base    string 法币币种 如：USD
 * @param targets string
 */
export function getRates(base = window._DEFAULT_RATE_CURRENCY_ || 'USD', targets = '') {
  return get('/currency/rates', { base, targets });
}

/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：USD
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export function getPrices(base = window._DEFAULT_RATE_CURRENCY_ || 'USD', targets = '') {
  return get('/currency/prices', { base, targets });
}

// 获取系统可用语言列表
export function getLangList() {
  // return get('/ucenter/languages');
  return get('/kucoin-config/web/international/config-list');
}

// 获取主站域名列表
export function getManifestSiteList(baseURL) {
  if (baseURL) {
    return request('get', { url: '/sites', baseURL });
  }
  return request('get', { url: '/sites' });
}

export function getFeeDeductionConfig() {
  return get('/trade-marketing/config/getFeeDeductionConfig');
}

// 用户是否可以进行kcs抵扣
export async function getUserKcsEnable(param) {
  return get('/trade-marketing/user/kcs/enable', param);
}

/**
 * 获取用户是否开启了KCS 抵扣手续费
 *
 * @return  {[type]}  [return description]
 */
export function checkIsKcsDiscountOn() {
  return get('/ucenter/is-kcs-deduction-open');
}

// 获取导航 Available values : ALL, ONLY_PARENT_USER, ONLY_SUB_USER
export function getNavigation(payload) {
  return get('/kucoin-config/navigation', payload);
}

/**
 *  查询有大量子账户的账户资产
 */
export async function getLargeSubAccountsAsset(params) {
  return get('/kucoin-web-front/asset/overview/sub-over-limit', params);
}

/**
 * 专属服务信息查询
 */
export function queryServiceInfo() {
  return get('/intelligent-service/dedicated/service/user/info');
}

/**
 * 关闭专属服务信息模块
 */
export function closeService() {
  return get('/intelligent-service/dedicated/service/hidden');
}

/**
 * 获取交易所所有启用交易市场 现货
 */
export async function getQuotes() {
  return get('/discover-new/top_nav_bar/spot/menu/web');
}

/**
 * 通过交易市场现货获取所有交易对最新行情
 * @param quote string 交易市场
 */
export async function getMarketSymbolsByQuote(params) {
  return get('/discover-new/top_nav_bar/spot/menu_item', params);
}

/**
 * 通过交易市场现货获取所有交易对最新行情
 */
export async function getMenuItemSearchSpot(params) {
  return get('/discover-new/top_nav_bar/menu_item/search/spot', params);
}

/**
 * 获取交易所所有启用交易市场 杠杆
 */
export async function getLeverageMenu() {
  return get('/discover-new/top_nav_bar/leverage/menu/web');
}

/**
 * 通过交易市场杠杆获取所有交易对最新行情
 */
export async function getLeverageMenuItem(params) {
  return get('/discover-new/top_nav_bar/leverage/menu_item', params);
}

/**
 * 杠杆搜索
 */
export async function getMenuItemSearchLeverage(params) {
  return get('/discover-new/top_nav_bar/menu_item/search/leverage', params);
}

/**
 * 获取所有杠杆配置信息
 */
export async function pullConfigs(params) {
  return get('/margin-config/configs', params);
}

/**
 * 获取所有杠杆配置信息(需要登录)
 */
export async function pullConfigsByUser(params) {
  return get('/margin-config/configs/by-user-id', params);
}

/**
 * 获取支持杠杆的交易对
 * @param symbol
 */
export async function getMarginSymbols(params) {
  return get('/margin-config/margin-symbols', params);
}

/**
 * 获取交易所所有交易对
 *
 * @param base    string 基础币种，如果market不为空，此参数将无效
 * @param market  string 交易区
 */
export async function pullSymbols({ base, market }) {
  return get('/currency/site/symbols', { base, market });
}

/**
 * 获取多个交易对最新行情
 * @param symbols string 交易对--多个交易对通过逗号分割,如（QSP-BTC,RDN-BTC）
 */
export async function getSymbolTick({ params }) {
  return get(`/trade-front/market/getSymbolTick?symbols=${params}`);
}

// kucoin future 获取合约列表
export async function pullFuturesSymbols() {
  return get(
    `/kumex-contract/contracts/active`,
    { preview: false },
    {
      baseURL: KUMEX_GATE_WAY,
    },
  );
}

// 获取合约交易区列表
export function pullFuturesAreaList(params) {
  return get(`/kumex-contract/contracts/tradeArea/getAvailableV2`, params, {
    baseURL: KUMEX_GATE_WAY,
  });
}

// 获取所有合约的涨跌幅和最新成交价接口
export async function getFuturesMarketList(params) {
  return get(`/kumex-trade/market/list`, params, {
    baseURL: KUMEX_GATE_WAY,
  });
}

/**
 * 获取所有币种
 *
 * @returns {Object} currencyType:1法币  2所有 0数字货币
 */
export async function getCoinsCategory(status) {
  return get('/currency/site/transfer-currencies', { status, flat: 1, currencyType: 2 });
}

/**
 * 获取用户自选交易对列表
 */
export async function getUserFavSymbols() {
  return get('/ucenter/user/collect-symbols');
}

/**
 * 全局搜索
 */
export async function search(params) {
  return get('/pathfinder/search', params);
}

/**
 * 现货推荐
 */
export async function recommendSpot(params) {
  return get('/pathfinder/recommend/spot', params);
}

/**
 * 理财现货合约推荐聚合
 */
export async function recommendAggregated(params) {
  return get('/pathfinder/recommend/aggregated', params);
}

/**
 * 是否是合伙人
 */
export async function isPartner() {
  return get('/growth-affiliate/v3/affiliate/status');
}

// 查询封禁信息
// 入参支持多个bizType，以英文逗号分隔，如：IP_DIALOG, IP_TOP_MESSAGE, REGISTER
// const mockUrl = '/user-dismiss/ip-dismiss/notice?bizType=CLEARANCE_MESSAGE';
// const mockUrl = '/user-dismiss/ip-dismiss/notice?bizType=FORCE_KYC_MESSAGE';
// const mockUrl = '/user-dismiss/ip-dismiss/notice?bizType=IP_TOP_MESSAGE';
// const baseURL = 'http://10.40.0.133:10001/mock/85';
// export const queryIpDismiss = () => get(mockUrl, {}, { baseURL });
export const queryIpDismiss = (params) => get('/user-dismiss/ip-dismiss/notice', params);

/**
 * 查询用户最近一次迁移状态
 *
 * @returns Promise<{
    "success": true,
    "code": "200",
    "msg": "success",
    "retry": false,
    "data": {
        "transferStatus": "FINISH",
        "originalSiteType": "global",
        "targetSiteType": "australia",
        "status": "SUCCESS",
        "alreadyDisplayed": true
    }
  }> 
 */
export const queryUserTransferStatus = () =>
  post('/user-dismiss-front/web/siteTransfer/queryTransferStatus');

/**
 * 提交写顶飘逻辑
 * @returns Promise<{
 *  data: false | true
 * }>
 */
export const writeDisplayed = () => {
  return post(`/user-dismiss-front/web/siteTransfer/writeDisplayed`, {});
};

// 查询英国地区封禁信息
export const queryEnglandDismiss = (params) =>
  get('/user-dismiss/ip-dismiss/notice/web/gb', params);

// 查询kyc状态文案
export async function getKycStatusDisplayInfo(params) {
  return get('/user-dismiss/dismiss/kyc/status', params);
  // return get('/kyc/getKycDisplayInfo', {}, { baseURL: 'http://10.40.0.133:10001/mock/85' });
}

// 判断当前登录用户是否入过金
export async function getIsDeposit() {
  return get('/asset-front/assets/is-deposit');
}

// 获取浏览器插件列表是否存在恶意/可疑插件
export async function checkPluginList(data) {
  return request({
    method: 'post',
    url: '/ucenter/user/security/malware-plugin-check',
    data,
  });
}

// 判断用户是否开启了期权账户
export async function checkOptions(params) {
  return get('/margin-option/outer/option/user/agreement/check', params);
}

// 用于设置主题 cookie
// 暂时用get，后面迁移到api接口时用post
export async function setThemeCookie(data) {
  return request({
    baseURL: window.location.origin,
    method: 'get',
    url: `/_api_theme/setTheme?theme=${data.theme}`,
  });
}

// WTF! 开发环境可用，还未上线！！ 用于设置主题 cookie
export const setCookies = (data) => post('/setCookies', data);

export const pullKCSRights = () => {
  return get('/ucenter/user-vip-info');
};
/**
 * @description: 获取机器人策略列表
 * @return {*}
 */
export const getBotLists = () => {
  return get(
    '/v1/task/template/query',
    {},
    {
      baseURL: '/_api_robot/cloudx-scheduler',
    },
  );
};
