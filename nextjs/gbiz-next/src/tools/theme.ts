import storage from 'tools/storage';
import { IS_SSR_MODE, IS_SERVER_ENV } from 'kc-next/env';
import queryString from 'query-string';
import { getPlatform } from 'tools/platform';

const themes = ['light', 'dark'];

// 专注于从 storage 中获取主题
export function getStorageTheme() {
  const theme = storage.getItem('kc_theme', { isPublic: true });
  return theme;
}

// 专注用于获取 cookie 中的主题
export function getCookieTheme(cookie: string) {
  const cookies = cookie || '';
  const themeMatch = cookies.match(/kc_theme=([^;]+)/);
  const cookieTheme = themeMatch ? themeMatch[1] : '';
  return themes.includes(cookieTheme) ? cookieTheme : null;
}

// 从 url 获取 night 参数，判断有值时才处理
export function getNightFromUrl(url: string) {
  try {
    const parsed = queryString.parseUrl(url);
    const night = parsed.query.night;
    
    if (night === undefined) {
      return null;
    }
    
    return night === 'true' ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to parse URL:', error);
    return null;
  }
}

// 判断SSG环境
export const isSSG = typeof navigator !== 'undefined' && navigator.userAgent.indexOf("SSG_ENV") > -1;

// 根据当前环境来获取初始主题
// 这里的 ctx 是 next 中的 ctx
export function getInitialTheme({ defaultTheme = 'light', ctx }: { defaultTheme: string, ctx?: any }): string {
  try {
    // SSG 环境，主题从 storage 同步
    if (isSSG) {
      // 坑！SSG 环境中，设置 kc_theme 不是 stringify 的，所以不能用统一的 storage 来获取
      return localStorage.getItem('kc_theme') || defaultTheme;
    }
    // 先处理 night 参数, PC 跳过
    const platform = getPlatform(ctx);
    if (platform.isApp) {
      const urlTheme = getNightFromUrl(
        IS_SERVER_ENV ? ctx?.req?.url : window.location.href
      );
      if (urlTheme) {
        return urlTheme;
      }
    }

    // SSR 模式，主题从 cookie 同步
    if (IS_SSR_MODE) {
      const cookieTheme = getCookieTheme(ctx?.req?.headers?.cookie);
      return cookieTheme || ctx?.req?.headers?.['x-app-theme'] || defaultTheme;
    }
    // SPA 模式，主题从 storage 同步
    return getStorageTheme() || defaultTheme;  
  } catch (error) {
    console.warn('Failed to get initial theme:', error);
    return defaultTheme;
  }
}

export function setGlobalTheme(theme: string) {
  try {
    storage.setItem('kc_theme', theme, { isPublic: true });
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    console.error('Error setting storage:', e);
  }
}