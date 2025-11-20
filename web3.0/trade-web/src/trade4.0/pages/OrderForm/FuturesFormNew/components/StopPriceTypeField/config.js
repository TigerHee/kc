/**
 * Owner: garuda@kupotech.com
 */

import { _t } from '../../builtinCommon';

// 条件单价格触发类型
export const SELECT_OPTIONS = [
  {
    label: () => _t('trade.order.lastPrice'),
    value: 'TP',
  },
  {
    label: () => _t('refer.markPrice'),
    value: 'MP',
  },
  {
    label: () => _t('trade.order.indexPrice'),
    value: 'IP',
  },
];

export const DEFAULT_VALUE = 'TP';
