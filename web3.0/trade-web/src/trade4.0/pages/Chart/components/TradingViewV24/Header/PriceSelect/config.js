/**
 * Owner: garuda@kupotech.com
 */
import { isString } from 'lodash';
import { KLINE_INDEX, KLINE_LAST, KLINE_MARK } from '@/meta/chart';
import { _t } from 'utils/lang';

// 本地存储 key
export const KLINE_LOCAL_PRICE_TYPE = 'kline_priceType';

// K线指标
export const KLINE_PRICE_OPTIONS = [
  {
    value: KLINE_INDEX,
    label: () => _t('trade.order.indexPrice'),
  },
  {
    value: KLINE_LAST,
    label: () => _t('trade.order.lastPrice'),
  },
  {
    value: KLINE_MARK,
    label: () => _t('refer.markPrice'),
  },
];

// 显示为正确的indexSymbol
export function getReplaceIndexSymbol(indexSymbol, isReverse = false) {
  if (isString(indexSymbol)) {
    if (isReverse) {
      return indexSymbol === '.KXBT' ? '.BXBT' : indexSymbol;
    }
    return indexSymbol === '.BXBT' ? '.KXBT' : indexSymbol;
  }
  return indexSymbol;
}
