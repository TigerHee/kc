/*
 * @owner: borden@kupotech.com
 */
import { _t } from 'utils/lang';
import { DEFAULT_VOLUME, SETTING_CATEGORIES } from '@/utils/voice/config';
import { AUTO_CLOSE_KEY, LIQUIDATION_KEY } from '../futuresConfig';

export const SOUND_SETTINGS = [
  {
    key: 'order',
    label: () => _t('hukv1STRw5YYU3WtnwLHve'),
    children: [
      SETTING_CATEGORIES.ORDERS_PARTIALLY_COMPLETED,
      SETTING_CATEGORIES.ORDERS_FULLY_COMPLETED,
      SETTING_CATEGORIES.BANKRUPTCY,
      SETTING_CATEGORIES.TRIGGER_ADVANCED_ORDERS,
      SETTING_CATEGORIES.SUBMIT_ORDER,
    ],
  },
  {
    key: 'market',
    label: () => _t('rqchbX81NKKRmoSPmzs3bt'),
    children: [
      SETTING_CATEGORIES.ORDER_BOOK_CHANGE,
      SETTING_CATEGORIES.RECENT_TRADE,
      SETTING_CATEGORIES.MARKET_UP,
      SETTING_CATEGORIES.MARKET_DOWN,
    ],
  },
  {
    key: 'action',
    label: () => _t('5Z1cRhuUnwKFSdQZzyXawk'),
    children: [SETTING_CATEGORIES.NOMAL_ACTION],
  },
];

export const { SOUND_CONFIG, DEFAULT_SOUND_SETTING } = SOUND_SETTINGS.reduce(
  (a, b) => {
    b.children.forEach((v) => {
      a.SOUND_CONFIG[v.key] = v;
      if (v.initialValue !== undefined) {
        a.DEFAULT_SOUND_SETTING[v.key] = v.initialValue;
      }
    });
    return a;
  },
  { SOUND_CONFIG: {}, DEFAULT_SOUND_SETTING: { muted: false, volume: DEFAULT_VOLUME } },
);

// 声音配置存储的key
export const SOUND_STORAGE_KEY = 'soundReminderConfig';

// 合约可能出现disable的key
export const FUTURES_DISABLED_KEY = [SETTING_CATEGORIES.BANKRUPTCY.key];

export const FUTURES_NOTICE_CHECK_KEYS = [LIQUIDATION_KEY, AUTO_CLOSE_KEY];
