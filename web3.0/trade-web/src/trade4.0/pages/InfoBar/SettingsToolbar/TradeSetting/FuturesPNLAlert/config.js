/**
 * Owner: clyne@kupotech.com
 */

export const namespace = 'futuresPnlAlert';

export const defaultState = {
  // pnl告警
  pnlAlertState: false,
  // pnl alert dialog
  pnlAlertDialogVisible: false,
  // pnl alert edit的详情
  pnlAlertInfo: {},
  // pnl alert list
  pnlAlertList: [],
};

export const rates = [
  {
    value: '-40',
    label: '-40%',
  },
  {
    value: '-25',
    label: '-25%',
  },
  {
    value: '50',
    label: '50%',
  },
  {
    value: '100',
    label: '100%',
  },
  {
    value: '150',
    label: '150%',
  },
];
