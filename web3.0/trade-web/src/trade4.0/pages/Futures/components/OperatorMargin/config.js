/**
 * Owner: garuda@kupotech.com
 */
export const APPEND_TABS = 'append'; // 追加
export const REDUCER_TABS = 'reducer'; // 减少

export const OUT_MAX = 'o_max';
export const OUT_MIN = 'o_min';

export const REDUCER_MARGIN_BLOCK = '200013'; // 提取保证金，存在挂单
export const REDUCER_MARK_ERROR = '200012'; // 提取超过额度
export const WITHDRAW_MARGIN_BLOCK = '200015'; // 没有提取保证金的权限
export const INSUFFICIENT_BALANCE = '200005'; // 余额不足

// 不走 error 逻辑
export const MARGIN_ERROR = [
  REDUCER_MARGIN_BLOCK,
  REDUCER_MARK_ERROR,
  WITHDRAW_MARGIN_BLOCK,
  INSUFFICIENT_BALANCE,
];

const COMMON_MESSAGE = {
  [REDUCER_MARK_ERROR]: 'reducer.margin.error',
  [INSUFFICIENT_BALANCE]: 'append.margin.input.max',
};

// 追加 - 减少保证金 format
export const FORMAT_MESSAGE = {
  [REDUCER_MARGIN_BLOCK]: 'reducer.margin.block',
  ...COMMON_MESSAGE,
};

export const FORMAT_MESSAGE_LEVERAGE = {
  [REDUCER_MARGIN_BLOCK]: 'leverage.risk.block',
  ...COMMON_MESSAGE,
};
