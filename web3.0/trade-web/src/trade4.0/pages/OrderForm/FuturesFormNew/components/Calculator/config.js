/**
 * Owner: garuda@kupotech.com
 */
import { floadToPercent } from '../../builtinCommon';
import { TABS_CLOSE, TABS_LIQUIDATION, TABS_PROFIT } from '../../config';

// roe 最小 step
export const ROE_STEP = 0.01;

export const ROE_RATES = [
  {
    value: 25,
    label: floadToPercent(0.25, { isPositive: false }),
  },
  {
    value: 50,
    label: floadToPercent(0.5, { isPositive: false }),
  },
  {
    value: 75,
    label: floadToPercent(0.75, { isPositive: false }),
  },
  {
    value: 100,
    label: floadToPercent(1, { isPositive: false }),
  },
];

export const SIZE_RATES = [
  {
    value: 10,
    label: 10,
  },
  {
    value: 100,
    label: 100,
  },
  {
    value: 1000,
    label: 1000,
  },
  {
    value: 10000,
    label: 10000,
  },
];

export const EVENT_NAME = 'futures_calculator';

// 计算器结果配置
export const RESULT_CONFIG = {
  [TABS_PROFIT]: [
    {
      name: 'trade.order.cost',
      unitKey: 'settleCurrency',
      valueKey: 'cost',
    },
    {
      name: 'calc.income',
      unitKey: 'settleCurrency',
      valueKey: 'profit',
    },
    {
      name: 'calc.roe',
      unit: '%',
      valueKey: 'profitRate',
      colorSpec: true,
    },
  ],
  [TABS_CLOSE]: [
    {
      name: 'calc.tab.closePrise',
      unitKey: 'quoteCurrency',
      valueKey: 'closePrice',
    },
  ],
  [TABS_LIQUIDATION]: [
    {
      name: 'trade.positionsOrders.liquidationPrice',
      unitKey: 'quoteCurrency',
      valueKey: 'liquidationPrice',
    },
  ],
};
