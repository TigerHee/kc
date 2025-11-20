/**
 * Owner: clyne@kupotech.com
 */

import { useShowAbnormal } from '@/components/AbnormalBack/hooks';
import { CROSS } from '../NewPosition/config';
import {
  ABC_CROSS_LEVERAGE,
  ABC_TYPE_SETTING,
  ABC_TYPE_CROSS,
} from '@/components/AbnormalBack/constant';

export const POS_LIQUID_PRICE = 'LIQUID_PRICE';
export const POS_RISK_RATE = 'RISK_RATE';
export const POS_ROE = 'ROE';
export const POS_MARGIN = 'POS_MARGIN';
export const POS_LEVERAGE = 'POS_LEVERAGE';
export const ORDER_LEVERAGE = 'ORDER_LEVERAGE';

const ALL = ABC_TYPE_SETTING[ABC_TYPE_CROSS];

const requiredKeysMap = {
  // 强平价格
  [POS_LIQUID_PRICE]: ALL,
  // 风险率
  [POS_RISK_RATE]: ALL,
  // ROE
  [POS_ROE]: ALL,
  // 仓位保证金
  [POS_MARGIN]: ALL.filter((v) => v !== ABC_CROSS_LEVERAGE),
  // 仓位杠杆
  [POS_LEVERAGE]: [ABC_CROSS_LEVERAGE],
  // 订单杠杆
  [ORDER_LEVERAGE]: [ABC_CROSS_LEVERAGE],
};

export const useShowFallback = ({ value, marginMode, type }) => {
  const requiredKeys = requiredKeysMap[type] || [];
  const showAbnormal = useShowAbnormal();
  const abnormalResult = showAbnormal({ requiredKeys });
  if (marginMode !== CROSS) {
    return value;
  }
  return abnormalResult || value;
};
