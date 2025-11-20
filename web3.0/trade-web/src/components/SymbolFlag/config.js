/**
 * Owner: borden@kupotech.com
 */
import { each } from 'lodash';
import { _t } from 'utils/lang';
import { TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';
// 杠杆代币的类型
export const BUY_TYPE = {
  L: 'L', // 做多
  S: 'S', // 做空
};
// 杠杆代币交易对标识
export const getMarginFundFlag = (multiple, buyType) => {
  if (!multiple) return '';
  if (buyType === BUY_TYPE.L) {
    return _t('etf.long.symbol.flag', { multiple });
  }
  return _t('etf.short.symbol.flag', { multiple });
};
// 杠杆(切换全仓/逐仓)
export const MARGIN_TABS = [
  {
    value: 'ALL',
    label: () => _t('all'),
    getMaxLeverage: ({ marginMaxLeverage, isolatedMaxLeverage }) =>
      Math.max(marginMaxLeverage || 0, isolatedMaxLeverage || 0),
  },
  {
    value: TRADE_TYPES_CONFIG.MARGIN_TRADE.key,
    label: TRADE_TYPES_CONFIG.MARGIN_TRADE.label1,
    getMaxLeverage: ({ marginMaxLeverage }) => marginMaxLeverage,
  },
  {
    value: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key,
    label: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.label1,
    getMaxLeverage: ({ isolatedMaxLeverage }) => isolatedMaxLeverage,
  },
];
const MARGIN_TABS_MAP = {};
each(MARGIN_TABS, (item) => {
  MARGIN_TABS_MAP[item.value] = item;
});

export { MARGIN_TABS_MAP };
