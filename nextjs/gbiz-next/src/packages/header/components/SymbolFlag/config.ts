/**
 * Owner: roger@kupotech.com
 */
import { each } from 'lodash-es';

interface MarginTab {
  value: string;
  getMaxLeverage: (params: { marginMaxLeverage: number; isolatedMaxLeverage: number }) => number;
}

// 杠杆(切换全仓/逐仓)
export const MARGIN_TABS: MarginTab[] = [
  {
    value: 'ALL',
    getMaxLeverage: ({ marginMaxLeverage, isolatedMaxLeverage }) =>
      Math.max(marginMaxLeverage || 0, isolatedMaxLeverage || 0),
  },
  {
    value: 'MARGIN_TRADE',
    getMaxLeverage: ({ marginMaxLeverage }) => marginMaxLeverage,
  },
  {
    value: 'MARGIN_ISOLATED_TRADE',
    getMaxLeverage: ({ isolatedMaxLeverage }) => isolatedMaxLeverage,
  },
];

// @ts-ignore
const MARGIN_TABS_MAP: { [key: string]: MarginTab } = {};
each(MARGIN_TABS, item => {
  MARGIN_TABS_MAP[item.value] = item;
});

export { MARGIN_TABS_MAP };
