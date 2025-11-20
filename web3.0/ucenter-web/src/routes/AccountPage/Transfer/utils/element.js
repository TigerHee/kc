/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { resetAppHeader } from './app';
import { getValidAppTransferLink } from './url';

export const handleATagClick = (e) => {
  if (!e || !JsBridge.isApp()) {
    return;
  }
  e.preventDefault();
  const url = e?.target?.href || '';
  const link = getValidAppTransferLink(url);
  JsBridge.open(
    {
      type: 'jump',
      params: {
        url: link,
      },
    },
    resetAppHeader,
  );
};

export const getWindowScollTop = () => {
  return window.pageYOffset || document.documentElement?.scrollTop || document.body.scrollTop || 0;
};

/**
 * 获取容器的距顶高度
 * @param {string | Element} value
 * @returns
 */
export const getElementTop = (id) => {
  const containerElement = document.getElementById(id);
  return containerElement?.getBoundingClientRect?.()?.top + getWindowScollTop() || 0;
};
