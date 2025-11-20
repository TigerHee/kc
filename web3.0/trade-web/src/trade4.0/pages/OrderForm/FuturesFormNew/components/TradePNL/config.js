/**
 * Owner: garuda@kupotech.com
 */
import { floadToPercent, _t } from '../../builtinCommon';

export const LONG_TYPE = 'pnlLong';
export const SHORT_TYPE = 'pnlShort';

export const PROFIT_TYPE = 'profit';
export const LOSS_TYPE = 'loss';

export const priceTypeToLocaleKey = {
  TP: 'contract.index.lastPrice',
  MP: 'refer.markPrice',
  IP: 'trade.order.indexPrice',
};

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
    value: 0.3,
    label: floadToPercent(0.3, { isPositive: false }),
  },
  {
    value: 0.5,
    label: floadToPercent(0.5, { isPositive: false }),
  },
];

export const SELECT_OPTIONS = [
  {
    value: 'TP',
    label: () => _t('trade.order.lastPrice'),
    menuLabel: () => _t('trade.input.last'),
  },
  {
    value: 'MP',
    label: () => _t('refer.markPrice'),
    menuLabel: () => _t('pnl.switchType.mark'),
  },
];
