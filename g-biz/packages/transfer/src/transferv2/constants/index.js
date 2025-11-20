/**
 * Owner: solar@kupotech.com
 */

export const MODEL_NAMESPACE = 'gbiz_account_transferV2';

export const DEFAULT_CURRENCY = 'USDT';

// 批量划转最大划转币种个数
export const MAX_SELECTION = 20;

// 这里新用户currency返回null，这里设置一个默认计价法币（目前前端不会使用这个法币计价，只保证接口不报错即可）
export const DEFAULT_FIAT = window._DEFAULT_RATE_CURRENCY_ || 'USD';

// 默认的划转方向
// export const INIT_DIRECTION = [['MAIN'], ['TRADE']];

export const getInitDirection = (isUnifiedMode) => {
  if (isUnifiedMode) return [['MAIN'], ['UNIFIED']];
  return [['MAIN'], ['TRADE']];
};
