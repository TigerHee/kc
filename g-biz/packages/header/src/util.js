/**
 * Owner: andy.wu@kupotech.com
 */
export const FUTURES_TRADE_PATH = '/futures/trade';
export const TRADE_FUTURES_PATH = '/trade/futures';
// 交易大厅融合灰度用户
const IS_INTEGRATE_TRADE_USER = 'futures.isIntegrateTradeUser';

export const isFuturesNewEntryEnabled = () => {
  const preferredVersion = window.localStorage.getItem('future:preferredVersion');
  const isIntegrateTradeUser = window.localStorage.getItem(IS_INTEGRATE_TRADE_USER);

  if (preferredVersion === 'legacy_v2' && isIntegrateTradeUser === 'true') {
    // 如果用户选择了返回旧版，且为灰度名单用户，则不启用新版入口
    return false;
  }

  return true;
};
