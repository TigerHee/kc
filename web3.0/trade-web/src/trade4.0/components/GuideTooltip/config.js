/*
 * @owner: borden@kupotech.com
 */
// import { isFuturesNew } from '@/meta/const';
// import { TRADEMODE_META } from '@/meta/tradeTypes';
// import { getStateFromStore } from '@/utils/stateGetter';
// import { getTradeType } from '@/hooks/common/useTradeType';
// import { getTradeMode } from '@/hooks/common/useTradeMode';
// // TRADEMODE_META.keys.MANUAL

// 新手引导模块配置
export const CONFIG = [
  // -------下方是教学视频区-------
  {
    code: 'videoTutorial',
  },
  {
    code: 'marginVideo',
  },
  // -------上方是教学视频区-------
  {
    code: 'soundReminder',
  },
  {
    code: 'futuresPnlAlert',
  },
  {
    code: 'futuresTraing',
    oldStoragekey: 'futures_order_guide',
  },
  {
    code: 'spotAdvancedLimit',
    oldStoragekey: 'advancedLimitGuideHidden',
  },
  {
    code: 'botUpgrade',
  },
]
  .map((v, i) => ({
    ...v,
    sequence: v.sequence !== undefined ? v.sequence : i,
  }))
  .sort((a, b) => a.sequence - b.sequence);

// 新手引导模块配置MAP
export const CONFIG_MAP = CONFIG.reduce((a, b) => {
  a[b.code] = b;
  return a;
}, {});

// 缓存的key
export const STORAGE_KEY = 'guide-history';
