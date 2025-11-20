import { createSingletonListener } from '@/common';

/**
 * 内置主题列表
 * - dark: 暗黑主题
 * - light: 浅色主题
 */
export const BUILTIN_THEMES = ['dark', 'light'] as const;

/**
 * 内置主题类型
 * - dark: 暗黑主题
 * - light: 浅色主题
 */
export type IBuiltinTheme = (typeof BUILTIN_THEMES)[number];

const themeAttributeName = 'data-theme';

const getCurrentTheme = () => {
  return document.documentElement.getAttribute(themeAttributeName) || '';
}

const subscribeTheme = (onUpdate: () => void) => {
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mut) => mut.attributeName === themeAttributeName)) {
      onUpdate();
    }
  });

  observer.observe(document.documentElement, { attributes: true, attributeFilter: [themeAttributeName] });
  return () => observer.disconnect();
};

export const themeListener = createSingletonListener(subscribeTheme, getCurrentTheme);

/**
 * 获取当前主题(监听根元素的 data-theme 属性变化)
 * * 当前支持用户自定义主题, 不限于 'dark' 或 'light'
 */
export const useTheme = themeListener.useValue;

/**
 * 获取当前主题是否为暗色(监听根元素的 data-theme 属性变化)
 */
export const useIsDark = () => {
  const theme = useTheme();
  return theme === 'dark';
}

/**
 * 设置 kux-design 主题
 * @param theme 主题, dark | light | 自定义主题名称
 * @param rootElement 根结点元素, 默认为 document.documentElement
 */
export function setTheme(theme: IBuiltinTheme | string, rootElement: HTMLElement = document.documentElement) {
  rootElement.setAttribute(themeAttributeName, theme);
}
