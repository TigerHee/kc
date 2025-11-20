/**
 * Owner: willen@kupotech.com
 */

import history from '@kucoin-base/history';
import { INDEPENDENT_ARTICLE_PATHS } from 'config/base';
import pathToRegexp from 'path-to-regexp';
import { getLocaleBasename } from 'tools/i18n';

export function matchReg(str) {
  const reg = /<\/?.+?\/?>/g;
  if (!str) str = '';
  return str.replace(reg, '');
}

const localeBase = getLocaleBasename();

// export const isNewsArticle = (pathname) => {
//   const pathRe = pathToRegexp('/news/:id/(.*)?');
//   const execResult = pathRe.exec(pathname);
//   if (
//     execResult &&
//     execResult[1] &&
//     pathname.indexOf(`/news/categories`) === -1 &&
//     !/^\d+$/.test(execResult[1])
//   ) {
//     return true;
//   }
//   return false;
// };
// export const isAnnouncementCategory = (pathname) => {
//   return [...ANNOUNCEMENT_CATEGORY_PATHS, '/announcement/history'].some((path) => {
//     const pathRe = pathToRegexp(path);
//     return pathRe.test(pathname);
//   });
// };
// export const isAnnouncementArticle = (pathname) => {
//   const pathRe = pathToRegexp('/announcement/:id');
//   if (pathname.indexOf('/page/') !== -1 || isAnnouncementCategory(pathname)) {
//     return false;
//   }
//   return pathRe.test(pathname);
// };
// 独立文章
export const isIdpArticle = (pathname) => {
  return INDEPENDENT_ARTICLE_PATHS.some((path) => {
    const pathRe = pathToRegexp(path);
    return pathRe.test(pathname);
  });
};

// export const isSupportArticle = (pathname) => {
//   const supportRe = pathToRegexp('/support/:id');
//   const supportResult = supportRe.exec(pathname);
//   if (supportResult && supportResult[1] && /^\d+/.test(supportResult[1])) {
//     return true;
//   }
//   return false;
// };

export const isArticlePage = () => {
  let pathname = window.location.pathname;
  if (localeBase) {
    pathname = pathname.replace(`/${localeBase}`, '');
  }
  // if (pathname.indexOf('/news') !== -1) {
  //   return isNewsArticle(pathname);
  // } else if (pathname.indexOf('/announcement') !== -1) {
  //   return isAnnouncementArticle(pathname);
  // } else if (pathname.indexOf('/support') !== -1) {
  //   return isSupportArticle(pathname);
  // }
  if (isIdpArticle(pathname)) return true;
  return false;
};

// export const canUseLangLink = () => {
//   let canUseLang = true;
//   canUseLang = !isArticlePage();
//   // const pathname = history?.location?.pathname;
//   // support 页面支持
//   // if (pathname?.startsWith('/support') && pathname.length > '/support/'.length) {
//   //   canUseLang = false;
//   // }
//   return canUseLang;
// };

// html dom
export function getTextFromdom(node) {
  if (!node) {
    return '';
  }
  // 文本节点
  if (node.nodeName === '#text') {
    return node.nodeValue;
  } else {
    if (node.childNodes && node.childNodes.length) {
      let resultContent = '';
      node.childNodes.forEach((child) => {
        resultContent = resultContent + getTextFromdom(child);
      });
      return resultContent;
    }
  }
  return '';
}

export function isHtmlDom(html) {
  if (typeof html === 'object') {
    if (typeof HTMLElement === 'object') {
      return html instanceof HTMLElement;
    } else if (html.nodeType && html.nodeName) {
      return true;
    }
  }
  return false;
}

// 获取一段html中的文本部分
export function getTextFromHtml(html) {
  if (typeof html === 'string') {
    const htmlDom = document.createElement('div');
    htmlDom.innerHTML = html;
    let textContent = '';
    if (htmlDom.childNodes && htmlDom.childNodes.length) {
      htmlDom.childNodes.forEach((node) => {
        textContent = textContent + getTextFromdom(node);
      });
    }
    return textContent;
  }
  if (isHtmlDom(html)) {
    return getTextFromdom(html);
  }
  return html;
}
