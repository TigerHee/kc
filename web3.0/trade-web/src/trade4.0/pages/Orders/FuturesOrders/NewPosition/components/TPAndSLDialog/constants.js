/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';

export const FormContext = React.createContext(null);

export const PROFIT_TYPE = 'profit';
export const LOSS_TYPE = 'loss';

export const UP_TEXT = 'stopClose.climbs';
export const DOWN_TEXT = 'stopClose.drops';

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
    label: '25%',
  },
  {
    value: 0.5,
    label: '50%',
  },
  {
    value: 0.75,
    label: '75%',
  },
  {
    value: 1,
    label: '100%',
  },
  {
    value: 1.5,
    label: '150%',
  },
  {
    value: 2,
    label: '200%',
  },
];

export const LOSS_RATES = [
  {
    value: 0.05,
    label: '5%',
  },
  {
    value: 0.15,
    label: '15%',
  },
  {
    value: 0.25,
    label: '25%',
  },
  {
    value: 0.5,
    label: '50%',
  },
  {
    value: 0.75,
    label: '75%',
  },
];
