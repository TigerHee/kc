/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { floadToPercent } from '@/utils/format';

export const FormContext = React.createContext(null);

export const PROFIT_TYPE = 'profit';
export const LOSS_TYPE = 'loss';

export const UP_TEXT = 'stopClose.climbs';
export const DOWN_TEXT = 'stopClose.drops';

export const priceTypeToLocaleKey = {
  TP: 'contract.index.lastPrice',
  MP: 'refer.markPrice',
  IP: 'trade.order.indexPrice',
};

export const priceTypeToDataKey = {
  TP: 'lastPrice',
  MP: 'markPrice',
  IP: 'indexPrice',
};

export const TOGGLES = [
  {
    value: 'TP',
    label: 'contract.index.lastPrice',
  },
  {
    value: 'MP',
    label: 'refer.markPrice',
  },
  {
    value: 'IP',
    label: 'trade.order.indexPrice',
  },
];

export const PROFIT_RATES = [
  {
    value: 0.25,
    label: floadToPercent(0.25, { isPositive: false }),
  },
  {
    value: 0.5,
    label: floadToPercent(0.5, { isPositive: false }),
  },
  {
    value: 0.75,
    label: floadToPercent(0.75, { isPositive: false }),
  },
  {
    value: 1,
    label: floadToPercent(1, { isPositive: false }),
  },
  {
    value: 1.5,
    label: floadToPercent(1.5, { isPositive: false }),
  },
  {
    value: 2,
    label: floadToPercent(2, { isPositive: false }),
  },
];

export const LOSS_RATES = [
  {
    value: 0.05,
    label: floadToPercent(0.05, { isPositive: false }),
  },
  {
    value: 0.15,
    label: floadToPercent(0.15, { isPositive: false }),
  },
  {
    value: 0.25,
    label: floadToPercent(0.25, { isPositive: false }),
  },
  {
    value: 0.5,
    label: floadToPercent(0.5, { isPositive: false }),
  },
  {
    value: 0.75,
    label: floadToPercent(0.75, { isPositive: false }),
  },
];
