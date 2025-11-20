/*
 * @owner: borden@kupotech.com
 */
import { forOwn } from 'lodash';
import { _t } from 'utils/lang';

// 播放器。不同的播放器播放声音互不打扰
export const PLAYER = [
  'COMMON',
  'MARKET1',
  'MARKET2',
  'ACTION',
  'AUDIOMETRIC',
].reduce((a, b) => {
  a[b] = b;
  return a;
}, {});

// 声音设置的类别枚举
const SETTING_CATEGORIES_ENUM = {
  MARKET_UP: 'marketUp',
  BANKRUPTCY: 'bankruptcy',
  MARKET_DOWN: 'marketDown',
  RECENT_TRADE: 'recentTrade',
  SUBMIT_ORDER: 'submitOrder',
  NOMAL_ACTION: 'nomalAction',
  ORDER_BOOK_CHANGE: 'orderBookChange',
  ORDERS_FULLY_COMPLETED: 'ordersFullyCompleted',
  TRIGGER_ADVANCED_ORDERS: 'triggerAdvancedOrders',
  ORDERS_PARTIALLY_COMPLETED: 'ordersPartiallyCompleted',
};

// 声音类型。数组顺序代表排序
const VIOCE_TYPE = [
  // 成交类提示
  {
    key: 'order',
    addFn: (item, arr) => [...arr, item],
  },
  // 用户操作反馈
  {
    key: 'market1',
    player: PLAYER.MARKET1,
  },
  // 系统行情类提示
  {
    key: 'market2',
    player: PLAYER.MARKET2,
  },
  {
    key: 'action',
    player: PLAYER.ACTION,
  },
];

// 声音类型Map & 相关初始化数据
export const { VIOCE_TYPE_MAP, INIT_QUEUE, INIT_PLAYING } = VIOCE_TYPE.reduce(
  (a, b) => {
    b.player = b.player || PLAYER.COMMON;
    b.addFn = typeof b.addFn === 'function' ? b.addFn : (item) => [item];
    a.VIOCE_TYPE_MAP[b.key] = {
      sequence: a.count[b.player] === undefined ? 0 : a.count[b.player] + 1,
      ...b,
    };
    a.count[b.player] = a.VIOCE_TYPE_MAP[b.key].sequence;
    if (a.INIT_QUEUE[b.player] === undefined) {
      a.INIT_QUEUE[b.player] = [[]];
    } else {
      a.INIT_QUEUE[b.player].push([]);
    }
    if (a.INIT_PLAYING[b.player] === undefined) {
      a.INIT_PLAYING[b.player] = null;
    }
    return a;
  },
  { VIOCE_TYPE_MAP: {}, INIT_QUEUE: {}, INIT_PLAYING: {}, count: {} },
);

// 声音字典数据
export const VOICE = {
  // 被强平或系统强制减仓
  bankruptcy: {
    type: 'order',
    preload: ({ isLogin }) => isLogin,
    url: `${_PUBLIC_PATH_}voice/bankruptcy.mp3`,
    category: SETTING_CATEGORIES_ENUM.BANKRUPTCY,
  },
  // 完全成交
  orders_fully_completed: {
    type: 'order',
    preload: ({ isLogin }) => isLogin,
    url: `${_PUBLIC_PATH_}voice/orders_fully_completed.mp3`,
    category: SETTING_CATEGORIES_ENUM.ORDERS_FULLY_COMPLETED,
  },
  // 部分成交
  orders_partially_completed: {
    type: 'order',
    preload: ({ isLogin }) => isLogin,
    url: `${_PUBLIC_PATH_}voice/orders_partially_completed.mp3`,
    category: SETTING_CATEGORIES_ENUM.ORDERS_PARTIALLY_COMPLETED,
  },
  // 条件单被触发
  trigger_advanced_orders: {
    type: 'order',
    preload: ({ isLogin }) => isLogin,
    url: `${_PUBLIC_PATH_}voice/trigger_advanced_orders.mp3`,
    category: SETTING_CATEGORIES_ENUM.TRIGGER_ADVANCED_ORDERS,
  },
  // 下单成功
  order_success: {
    type: 'order',
    url: `${_PUBLIC_PATH_}voice/order_success.mp3`,
    category: SETTING_CATEGORIES_ENUM.SUBMIT_ORDER,
  },
  // 下单失败
  order_fail: {
    type: 'order',
    url: `${_PUBLIC_PATH_}voice/order_fail.mp3`,
    category: SETTING_CATEGORIES_ENUM.SUBMIT_ORDER,
  },
  // 行情剧烈波动-下跌
  market_down: {
    type: 'market1',
    url: `${_PUBLIC_PATH_}voice/market_down.mp3`,
    category: SETTING_CATEGORIES_ENUM.MARKET_DOWN,
  },
  // 行情剧烈波动-上涨
  market_up: {
    type: 'market1',
    url: `${_PUBLIC_PATH_}voice/market_up.mp3`,
    category: SETTING_CATEGORIES_ENUM.MARKET_UP,
  },
  // 买卖盘中有新的挂单、撤单
  order_book_change: {
    type: 'market2',
    url: `${_PUBLIC_PATH_}voice/order_book_change.mp3`,
    category: SETTING_CATEGORIES_ENUM.ORDER_BOOK_CHANGE,
  },
  // 实时成交有更新
  recent_trade: {
    type: 'market2',
    url: `${_PUBLIC_PATH_}voice/recent_trade.mp3`,
    category: SETTING_CATEGORIES_ENUM.RECENT_TRADE,
  },
  // 输入
  keyboard_input: {
    type: 'action',
    url: `${_PUBLIC_PATH_}voice/keyboard_input.mp3`,
    category: SETTING_CATEGORIES_ENUM.NOMAL_ACTION,
  },
  // 删除输入
  keyboard_delete: {
    type: 'action',
    url: `${_PUBLIC_PATH_}voice/keyboard_delete.mp3`,
    category: SETTING_CATEGORIES_ENUM.NOMAL_ACTION,
  },
  // 用户点击操作反馈
  click_event: {
    type: 'action',
    url: `${_PUBLIC_PATH_}voice/click_event.mp3`,
    category: SETTING_CATEGORIES_ENUM.NOMAL_ACTION,
  },
  // 点击买卖盘，填入价格
  order_book_click: {
    type: 'action',
    url: `${_PUBLIC_PATH_}voice/order_book_click.mp3`,
    category: SETTING_CATEGORIES_ENUM.NOMAL_ACTION,
  },
  // 用户表单提交未通过校验报错或其他指定报错
  error_boundary: {
    type: 'action',
    url: `${_PUBLIC_PATH_}voice/error_boundary.mp3`,
    category: SETTING_CATEGORIES_ENUM.NOMAL_ACTION,
  },
};

function findVoiceCodeByCategory(category) {
  const result = [];
  forOwn(VOICE, (value, key) => {
    if (value.category === category) {
      result.push(key);
    }
  });
  return result;
}
// 声音设置的类别
export const SETTING_CATEGORIES = [
  {
    key: 'MARKET_UP',
    label: () => _t('bpc3T8Hvadnw7f5tdSFJV7'),
    describe: () => _t('8ignjKgG8BikmKBKrSFuQ7', { a: 1, b: 2 }),
  },
  {
    key: 'BANKRUPTCY',
    label: () => _t('tQxjayRuWcLB4rmJt3iUnm'),
    describe: () => _t('91iH5j649o8hw7c35ZqCYR'),
    initialValue: true,
  },
  {
    key: 'MARKET_DOWN',
    label: () => _t('172rDxdAqGugx7tJqD9FsU'),
    describe: () => _t('8ignjKgG8BikmKBKrSFuQ7', { a: 1, b: 2 }),
  },
  {
    key: 'RECENT_TRADE',
    label: () => _t('realtime.deal'),
    describe: () => _t('xh8b6Z86yN5J32vedygxNU'),
  },
  {
    key: 'SUBMIT_ORDER',
    label: () => _t('hECN1L7qyzkeWjwnL28Uct'),
    describe: () => _t('eEGikTwy1QJe2pSsGVmBCk'),
    initialValue: true,
  },
  {
    key: 'NOMAL_ACTION',
    label: () => _t('aAuhYJEaXJTR49rp42hq3Q'),
    describe: () => _t('eThcM64qttnWBxWcDGSLuU'),
    initialValue: true,
  },
  {
    key: 'ORDER_BOOK_CHANGE',
    label: () => _t('l2.title'),
    describe: () => _t('kuioffnw6cVJG3L6b5soQp'),
  },
  {
    key: 'ORDERS_FULLY_COMPLETED',
    label: () => _t('dcAMnhzn7qbxJApf6eiWA5'),
    describe: () => _t('nC9DTfhvtd85n8oNQzA3m6'),
    initialValue: true,
  },
  {
    key: 'TRIGGER_ADVANCED_ORDERS',
    label: () => _t('5PxcPdAadWnLyNjcDk5NYj'),
    describe: () => _t('qt9UpDoMmVUgvsA1PeE6uE'),
    initialValue: true,
  },
  {
    key: 'ORDERS_PARTIALLY_COMPLETED',
    label: () => _t('giH9f1LMGRs9134K12EjA2'),
    describe: () => _t('3JudxUBTapnTnLCZ2nk82V'),
    initialValue: true,
  },
].reduce((a, b) => {
  a[b.key] = {
    ...b,
    key: SETTING_CATEGORIES_ENUM[b.key],
    voiceCodes: findVoiceCodeByCategory(SETTING_CATEGORIES_ENUM[b.key]),
  };
  return a;
}, {});

// 根据声音code获取声音类型配置
export const getTypeConfigByVoice = (voice) => {
  const { type } = VOICE[voice] || {};
  return VIOCE_TYPE_MAP[type] || {};
};

// 默认音量
export const DEFAULT_VOLUME = 50;
