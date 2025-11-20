/*
 * @owner: borden@kupotech.com
 */
import { getIsolatedAppoint } from 'src/services/isolated';
import { getUserMarginPostionDetail } from 'src/services/margin';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import {
  computeCrossBorrowAmount,
  computeCrossRealLeaverage,
  computeIsolatedBorrowAmount,
  computeIsolatedRealLeaverage,
} from '@/utils/stateGetter';

// 杠杆倍数精度
export const LEVERAGE_PRECISION = 1;
export const STEP = Math.pow(10, -LEVERAGE_PRECISION);
// 最小杠杆倍数
export const MIN_LEVERAGE = 1;

export const INIT_BORROW_AMOUNT_INFO = {
  a: '-',
  b: '-',
  c: '-',
  d: '-',
};

// 账户类型
export const ACCOUNT_TYPE = [
  {
    value: TRADE_TYPES_CONFIG.MARGIN_TRADE.key,
    pullPostion: () => getUserMarginPostionDetail(),
    computeBorrowAmount: computeCrossBorrowAmount,
    computeRealLeaverage: computeCrossRealLeaverage,
    updateUserLeverageEffect: TRADE_TYPES_CONFIG.MARGIN_TRADE.updateUserLeverageEffect,
    updateUserLeverageReducer: TRADE_TYPES_CONFIG.MARGIN_TRADE.updateUserLeverageReducer,
  },
  {
    value: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key,
    pullPostion: ({ tag }) => getIsolatedAppoint({ tag }),
    computeBorrowAmount: computeIsolatedBorrowAmount,
    computeRealLeaverage: computeIsolatedRealLeaverage,
    updateUserLeverageEffect: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.updateUserLeverageEffect,
    updateUserLeverageReducer: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.updateUserLeverageReducer,
  },
];

// 账户类型map
export const ACCOUNT_TYPE_MAP = ACCOUNT_TYPE.reduce((a, b) => {
  a[b.value] = b;
  return a;
}, {});
