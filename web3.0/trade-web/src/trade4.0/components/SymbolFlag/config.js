/**
 * Owner: borden@kupotech.com
 */
import { each } from 'lodash';
import { _t } from 'utils/lang';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
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
