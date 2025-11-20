/**
 * Owner: terry@kupotech.com
 */
import { useEffect } from 'react';

const hasPreview = typeof app.param('preview') !== 'undefined';

export interface IPreloadItem {
  /* 预加载资源的url */
  url: string;
  /* link preload as类型 */
  asType: 'image' | 'fetch',
  /* 唯一标识，主要用于不重复插入link */
  key: string;
}

export type PreloadPropsType = IPreloadItem[];

function insertLink(scriptItem: IPreloadItem, target = document.head) {
  const { url, asType, key } = scriptItem;
  const isExist = document.querySelector(`#${key}`);
  if (isExist) return;
  const link = document.createElement('link');
  link.href = url;
  link.as = asType;
  // 使用prefetch，低优先级加载即可
  link.rel='prefetch'
  link.crossOrigin = 'anonymous'
  link.id = key;
  target.appendChild(link);
}

/**
 * 插入preload link，预加载动画json，大的图片等
 */
export function usePreloadResource(preloadList: PreloadPropsType) {
  useEffect(() => {
    // 编辑器编辑模式、预览活动
    if (_IS_EDITOR_ || hasPreview) return;
    if (!app.is(preloadList, 'array') || !preloadList.length) return;
    try {
      preloadList.forEach(item => insertLink(item))
    } catch (e) {
      console.error(e);
    }
  }, [preloadList]); 
}