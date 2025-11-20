/**
 * Owner: harry.lai@kupotech.com
 */

import { _t } from 'utils/lang';
import { commonSensorsFunc } from '@/meta/sensors';
import {
  currentRowPercentage,
  dealRowPercentage,
  formatOrderMoreUrl,
  historyRowPercentage,
  stopRowPercentage,
} from '../utils';
import {
  currentCreator,
  twapOrderCreator,
  dealCreator,
  historyCreator,
  stopCreator,
  twapHistoryOrderCreator,
} from '../listCreators';

// 币币
export const openOrderDict = [
  {
    key: 'current',
    type: 'limit',
    label: () => _t('orders.c.order.cur'),
    namespace: 'orderCurrent',
    creator: currentCreator,
    moreUrl: (tradeType) => formatOrderMoreUrl(tradeType),
    rowPercentage: currentRowPercentage,
    // 以下为埋点方法
    subTabClick: () => commonSensorsFunc(['openOrders', 3, 'click']), // 当前委托子tab
  },
  {
    key: 'stop',
    type: 'stop',
    label: () => _t('orders.c.order.advanced'),
    namespace: 'orderStop',
    creator: stopCreator,
    moreUrl: (tradeType) => formatOrderMoreUrl(tradeType, '/stopLoss'),
    rowPercentage: stopRowPercentage,
    // 以下为埋点方法
    subTabClick: () => commonSensorsFunc(['openOrders', 4, 'click']), // 高级委托子tab
  },
];

export const dealDetailOrderDict = [
  {
    key: 'dealDetail',
    label: () => _t('orders.c.order.detail'),
    namespace: 'orderDealDetail',
    creator: dealCreator,
    moreUrl: (tradeType) => formatOrderMoreUrl(tradeType, '/detail'),
    rowPercentage: dealRowPercentage,
  },
];

// twap委托 (以下内容如需改动，需保证相加为1)
const twapOrderRowPercentage = ({ screen }) => {
  if (['sm', 'md', 'lg'].includes(screen)) {
    return [];
  }
  if (screen === 'lg1') {
    return [0.09, 0.15, 0.2, 0.18, 0.18, 0.2];
  }
  if (screen === 'lg2') {
    return [0.07, 0.1, 0.06, 0.21, 0.14, 0.13, 0.14, 0.15];
  }
  return [0.1256, 0.08, 0.065, 0.2044, 0.1403, 0.1172, 0.084, 0.0463, 0.1];
};

// twap历史 (以下内容如需改动，需保证相加为1)
const historyTWAPOrderRowPercentage = ({ screen }) => {
  if (['sm', 'md', 'lg'].includes(screen)) {
    return [];
  }
  if (screen === 'lg1') {
    return [0.10, 0.14, 0.1, 0.29, 0.25, 0.12];
  }
  if (screen === 'lg2') {
    return [0.08, 0.13, 0.08, 0.25, 0.16, 0.2, 0.1];
  }
  // lg3
  return [0.12, 0.08, 0.06, 0.2, 0.15, 0.15, 0.14, 0.1];
};

export const openOrderTWAPTabDict = {
  key: 'twap',
  type: 'twap',
  label: () => _t('9vZMJ91Rea72iuDjqm7zrD'),
  namespace: 'orderTwap',
  creator: twapOrderCreator,
  moreUrl: (tradeType) => formatOrderMoreUrl(tradeType, '/twap'),
  rowPercentage: twapOrderRowPercentage,
  // 以下为埋点方法
  subTabClick: () => commonSensorsFunc(['openOrders', 5, 'click']), // 当前委托子tab orderTwap
};

export const historyOrderTWAPTabDict = {
  key: 'orderTwapHistory',
  type: 'orderTwapHistory',
  label: () => _t('1biZ2ooPPPxhjiui3pJwd5'),
  namespace: 'orderTwapHistory',
  creator: twapHistoryOrderCreator,
  moreUrl: (tradeType) => formatOrderMoreUrl(tradeType, '/history'),
  rowPercentage: historyTWAPOrderRowPercentage,
};

export const historyOrderDict = [
  {
    key: 'history',
    label: () => _t('orders.c.order.history'),
    namespace: 'orderHistory',
    creator: historyCreator,
    moreUrl: (tradeType) => formatOrderMoreUrl(tradeType, '/history'),
    rowPercentage: historyRowPercentage,
  },
  historyOrderTWAPTabDict,
];
