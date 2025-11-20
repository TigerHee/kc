/**
 * Owner: willen@kupotech.com
 */
import history from '@kucoin-base/history';
import { addLangToPath } from 'tools/i18n';
import urlparser from 'urlparser';

export const canUseLangLink = () => {
  let canUseLang = true;
  if (history?.location?.pathname?.startsWith('/support')) {
    canUseLang = false;
  }
  return canUseLang;
};

export const getUrlWithOutQuery = (url) => {
  if (!url) {
    return url;
  }
  const urlObj = urlparser.parse(url);
  if (urlObj.query) {
    delete urlObj.query;
  }
  let urlStr = urlObj.toString();
  if (urlStr.endsWith('/')) {
    urlStr = urlStr.substring(0, urlStr.length - 1);
  }
  return urlStr;
};

// 防止url链接中出现undefined,不是完整的链接<a>不展示href属性
// shoudRemoveQuery： <a> href链接不展示参数，onclick跳转链接带上参数
export const getCompleteUrl = (judgeCondition, url, needLangPath, shoudRemoveQuery) => {
  const hrefProp = {};
  if (judgeCondition && url) {
    let _href = url;
    if (needLangPath) {
      _href = addLangToPath(_href);
    }
    if (shoudRemoveQuery) {
      _href = getUrlWithOutQuery(_href);
    }
    hrefProp.href = _href;
  }
  return hrefProp;
};
