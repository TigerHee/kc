/**
 * Owner: harry.lai@kupotech.com
 */
import { _t } from 'src/utils/lang';

export const directions = [
  { text: () => _t('orders.dirc.all'), value: '', title: () => _t('rYjf48JUnnePSCKaeNZmni') },
  { text: () => _t('orders.dirc.sell'), value: 'sell' },
  { text: () => _t('orders.dirc.buy'), value: 'buy' },
];

export const types = [
  { text: () => _t('orders.type.all'), value: '', title: () => _t('orders.col.type') },
  {
    text: () => _t('orders.type.limit'),
    value: 'limit',
  },
  {
    text: () => _t('orders.type.market'),
    value: 'market',
  },
  {
    text: () => _t('orders.type.market.stop'),
    value: 'market_stop',
  },
  {
    text: () => _t('orders.type.limit.stop'),
    value: 'limit_stop',
  },
  {
    text: () => _t('orders.type.limit.oco'),
    value: 'limit_oco',
  },
  {
    text: () => _t('trd.form.tso.title'),
    value: 'limit_tso', // 跟踪委托
  },
  {
    text: () => _t('trd.form.tso.title'),
    value: 'tso', // 跟踪委托
    show: false,
  },
];

export const current_types = [
  {
    text: () => _t('orders.type.all'),
    value: '',
    title: () => _t('orders.col.type'),
  },
  {
    text: () => _t('orders.type.limit'),
    value: 'limit',
  },
  {
    text: () => _t('orders.type.market'),
    value: 'market', // 当前委托的现价止损
  },
  {
    text: () => _t('orders.type.limit.stop'),
    value: 'limit_stop',
  },
  {
    text: () => _t('orders.type.market.stop'),
    value: 'market_stop',
  },
  {
    text: () => _t('orders.type.limit.oco'),
    value: 'limit_oco', // oco
  },
  {
    text: () => _t('trd.form.tso.title'),
    value: 'limit_tso', // 跟踪委托
  },
];

export const stop_types = [
  {
    text: () => _t('orders.type.all'),
    value: '',
    title: () => _t('orders.col.type'),
  },
  {
    text: () => _t('orders.type.market.stop'),
    value: 'market',
  },
  {
    text: () => _t('orders.type.limit.stop'),
    value: 'limit',
  },
  {
    text: () => _t('orders.type.limit.oco'),
    value: 'limit_oco', // oco
  },
  {
    text: () => _t('trd.form.tso.title'),
    value: 'limit_tso', // 跟踪委托
  },
];

export const statusList = [
  { text: () => _t('orders.status.all'), value: '', title: () => _t('orders.c.status') },
  { text: () => _t('orders.status.done'), value: 'false' },
  { text: () => _t('orders.c.status.cancel'), value: 'true' },
];

export const stopMark = {
  entry: '≥',
  loss: '≤',
  e_oco: '-|≥',
  l_oco: '-|≤',
  e_s_o: '-|≥',
  l_s_o: '-|≤',
};

// TWAP挂单距离类型
export const DISTANCE_TYPE_MAP = {
  // 固定金额)
  FIXED: 'FIXED',
  // 比例,
  PERCENT: 'PERCENT',
};

// TWAP状态
export const TWAP_PROCESS_STATUS = {
  PENDING: 'PENDING', // 委托中
  PAUSED: 'PAUSED', // 已暂停
  COMPLETED: 'COMPLETED', // 已完成
  CANCELLED: 'CANCELLED', // 已取消
};

// TWAP状态
export const TWAP_PROCESS_STATUS_TEXT_MAP = {
  [TWAP_PROCESS_STATUS.COMPLETED]: _t('orders.status.done'),
  [TWAP_PROCESS_STATUS.CANCELLED]: _t('orders.c.status.cancel'),
};

// TWAP状态SelectOptions
export const TWAP_ALL_STATUS_SELECT_OPTIONS = [
  { text: () => _t('orders.status.all'), value: '', title: () => _t('orders.c.status') },
  { text: () => _t('orders.status.done'), value: TWAP_PROCESS_STATUS.COMPLETED },
  { text: () => _t('orders.c.status.cancel'), value: TWAP_PROCESS_STATUS.CANCELLED },
];
