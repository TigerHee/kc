/**
 * Owner: roger@kupotech.com
 */
import { each } from 'lodash';

// 杠杆(切换全仓/逐仓)
export const MARGIN_TABS = [
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
const MARGIN_TABS_MAP = {};
each(MARGIN_TABS, (item) => {
  MARGIN_TABS_MAP[item.value] = item;
});

export { MARGIN_TABS_MAP };
