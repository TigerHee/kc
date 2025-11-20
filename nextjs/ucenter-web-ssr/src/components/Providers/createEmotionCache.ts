// src/createEmotionCache.ts
import createCache from '@emotion/cache';

export default function createEmotionCache() {
  // 没有 insertionPoint 也能 SSR；需要顺序可切换为 prepend: true 或插入点
  const cache = createCache({ key: 'css', prepend: true });
  cache.compat = true;
  return cache;
}
