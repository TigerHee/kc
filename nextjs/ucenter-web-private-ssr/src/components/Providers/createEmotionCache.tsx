/**
 * 公共的 Emotion Cache 创建函数
 */
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
// 没有 insertionPoint 也能 SSR；需要顺序可切换为 prepend: true 或插入点
const rtlCache = createCache({ key: 'rtlcss', stylisPlugins: [rtlPlugin], prepend: true });
const ltrCache = createCache({ key: 'lrtcss', prepend: true });

export default function createEmotionCache(isRTL: boolean) {
  return isRTL ? rtlCache : ltrCache;
}
