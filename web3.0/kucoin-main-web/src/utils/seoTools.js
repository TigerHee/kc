/**
 * Owner: willen@kupotech.com
 */
import pathToRegexp from 'path-to-regexp';
import { getLocaleBasename, addLangToPath } from 'tools/i18n';
import { matchPath } from 'react-router-dom';
import urlparser from 'urlparser';

// export const DEFAULT_SEO_SUFFIX = 'KuCoin';
// export function matchReg(str) {
//   const reg = /<\/?.+?\/?>/g;
//   if (!str) str = '';
//   return str.replace(reg, '');
// }

export const isArticlePage = () => {
  const localBase = getLocaleBasename();
  const currentUrl = localBase ? `/${localBase}/blog` : '/blog';
  const pathRe = pathToRegexp(`${currentUrl}/:id/(.*)?`);
  const execResult = pathRe.exec(window.location.pathname);
  let isArticlePage = false;
  // 文章详情页不需要多语言link
  // 分页链接 或者 分类链接
  if (
    execResult &&
    execResult[1] &&
    !/^\d+$/.test(execResult[1]) &&
    execResult[1] !== 'categories'
  ) {
    isArticlePage = true;
  }
  // seo新手学院 article
  const [, pathnameWithoutLang] = window.location.pathname.split('/learn');
  const learnMatch = matchPath(`/learn${pathnameWithoutLang}`, { path: '/learn/:category/:title' });
  if (learnMatch?.params?.title) {
    isArticlePage = true;
  }
  return isArticlePage;
};

// export const appendFAQ = (data) => {
//   const node = document.createElement('script');
//   node.type = 'application/ld+json';
//   node.text = JSON.stringify(data);
//   document.head.appendChild(node);
// };

// export const appendCanonical = (href) => {
//   const node = document.createElement('link');
//   node.rel = 'canonical';
//   node.href = href;
//   document.head.appendChild(node);
// };

// react node
export function getNodeContent(node) {
  if (typeof node === 'string') {
    return node;
  }
  let text = '';
  const child = node?.props?.children;
  if (!child) {
    if (node?.props?.label || node?.props?.value) {
      return `${node?.props?.label}${node?.props?.value}`;
    }
    return text;
  }
  if (Array.isArray(child)) {
    child.forEach((item) => {
      text = `${text}${getNodeContent(item)}`;
    });
  }
  if (child && typeof child === 'string') {
    text = `${text}${child}`;
  } else {
    if (Array.isArray(child?.props?.children)) {
      text = `${text}${getNodeContent(child)}`;
    } else {
      text = `${text}${getNodeContent(child?.props?.children)}`;
    }
  }
  return text;
}

// html dom
function getTextFromdom(node) {
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

function isHtmlDom(html) {
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
  if (typeof html === 'object') {
    return getNodeContent(html);
  }
  return html;
}

// export const getUrlWithOutQuery = (url) => {
//   if (!url) {
//     return url;
//   }
//   const urlObj = urlparser.parse(url);
//   if (urlObj.query) {
//     delete urlObj.query;
//   }
//   let urlStr = urlObj.toString();
//   if (urlStr.endsWith('/')) {
//     urlStr = urlStr.substring(0, urlStr.length - 1);
//   }
//   return urlStr;
// };

// 防止url链接中出现undefined,不是完整的链接<a>不展示href属性
export const getCompleteUrl = (judgeCondition, url, needLangPath) => {
  const hrefProp = {};
  if (judgeCondition && url) {
    let _href = url;
    if (needLangPath) {
      _href = addLangToPath(_href);
    }
    hrefProp.href = _href;
  }
  return hrefProp;
};

const RTL_Langs = ['ar_AE', 'ur_PK'];
// RTL替换代替语种
export function DateTimeFormat({ lang = 'en_US', date, options = {} }) {
  try {
    const datestring = new Date(date).valueOf();
    const _lang = (RTL_Langs.includes(lang) ? 'ar_AE' : lang).replace('_', '-');
    const dateTimeFormat = new Intl.DateTimeFormat(_lang, options);
    const _datestring = dateTimeFormat.format(datestring);
    if (lang === 'en_US' || RTL_Langs.includes(lang)) {
      return _datestring.replace(',', '');
    }
    return _datestring;
  } catch (e) {
    return date;
  }
}
