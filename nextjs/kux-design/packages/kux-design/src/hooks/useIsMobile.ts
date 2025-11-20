import { createSingletonListener } from '@/common';

const MOBILE_SCREEN_WIDTH = 768;

let cachedMediaQuery: MediaQueryList | null = null;

function getMediaQuery(): MediaQueryList | null {
  if (cachedMediaQuery) {
    return cachedMediaQuery;
  }
  if (app.global.matchMedia) {
    cachedMediaQuery = app.global.matchMedia(`(max-width: ${MOBILE_SCREEN_WIDTH}px)`);
  }
  return cachedMediaQuery;
}

// const mediaQuery = app.global.matchMedia ? app.global.matchMedia(`(max-width: ${MOBILE_SCREEN_WIDTH})`) : {} as MediaQueryList;
function getIsMobile(): boolean {
  const mediaQuery = getMediaQuery();
  if (!mediaQuery) return false;
  // 在 ios 14.1 上matchMedia无法正常判断，这里用innerWidth做下兼容
  return mediaQuery.matches || app.global.innerWidth <= MOBILE_SCREEN_WIDTH;
}

const subscribeIsMobile = (onUpdate: () => void) => {
  // 兼容旧浏览器在 dom 未加载完成时 viewport 为 980 的情况
  setTimeout(() => {
    onUpdate();
  }, 100);

  const mediaQuery = getMediaQuery();
  if (!mediaQuery) {
    console.warn('[useIsMobile] matchMedia not supported');
    return () => {};
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', onUpdate);
    return () => {
      mediaQuery.removeEventListener('change', onUpdate);
    }
  }
  // 兼容旧浏览器
  if (mediaQuery.addListener) {
    mediaQuery.addListener(onUpdate);
    return () => {
      mediaQuery.removeListener(onUpdate);
    }
  }
  return () => {};
};


const isMobileListener = createSingletonListener(subscribeIsMobile, getIsMobile);

export const useIsMobile = isMobileListener.useValue;