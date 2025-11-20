/**
 * Owner: willen@kupotech.com
 */
import { allLanguages, zElanguages } from 'config/base';
import { reduce, split } from 'lodash';
import { getLocaleFromLocaleMap } from 'tools/i18n';
import HOST from 'utils/siteConfig';

const getLangPathFromZendeskLang = (zendeskLang) => {
  const zendesk = {};
  Object.entries(zElanguages).forEach(([key, val]) => {
    zendesk[val] = key;
  });
  const lang = zendesk[zendeskLang];
  const langPath = getLocaleFromLocaleMap(lang);
  return langPath === 'en' ? '' : langPath;
};

// 将https://support.kucoin.plus/hc/语言/(articles|categories|sections)/id
// 将https://kucoin.zendesk.com/hc/语言/(articles|categories|sections)/id
// 替换为https://www.kucoin.com/support/对应链接
const helpCenter = HOST.KUCOIN_HOST;
export const replaceHelpCenterUrl = (text) => {
  if (!text) {
    return text;
  }
  // TODO:
  const reg =
    /href="https:\/\/(support\.kucoin\.plus|kucoin\.zendesk\.com)\/hc\/([a-z-]+)("|\/(articles|categories|sections)\/(\d+[^"]*))/g;
  let result = reg.exec(text);
  while (result) {
    const replacedUrl = result[0];
    const zendeskLang = result[2];
    const type = result[4];
    const id = result[5];
    const langPath = getLangPathFromZendeskLang(zendeskLang);
    const path = type ? `${type === 'articles' ? '' : `/${type}`}${id ? `/${id}` : ''}` : '"';
    const url = `href="${helpCenter}/${langPath ? `${langPath}/` : ''}support${path}`;
    text = text.replace(replacedUrl, url);
    result = reg.exec(text);
  }
  return text;
};

// 对内容中的链接做处理，以便当域名发生改变后能正常跳转
export const resolveArticalLinks = (content) => {
  // 如果是ssr， 那么不处理
  if (!window || !content) {
    return content;
  }
  let { hostname } = window.location;
  // 如果是开发状态，那么就以测试环境的域名为准，主要取顶级域名 net
  if (hostname.match('localhost')) {
    hostname = 'v2.kucoin.net';
  }
  const topDomain = hostname.split('.').reverse()[0];
  //域名替换
  return content.replace(
    /(https?:\/\/[^.]+\.kucoin\.)([^./"'<]+)([^'"]*)/g,
    (match, p1, p2, p3) => {
      if (topDomain === 'net') {
        return `${window.location.origin}${p3}`;
      }
      return `${p1}${topDomain}${p3}`;
    },
  );
};

const languages = [...allLanguages, 'zh_CN'];
const localeMap = reduce(
  allLanguages,
  (acc, lang) => {
    const value = window.__KC_LANGUAGES_BASE_MAP__.langToBase[lang] || window._DEFAULT_LOCALE_;
    acc[lang] = value;
    return acc;
  },
  {},
);

const isLangPath = (path) => {
  const langPaths = [];
  languages.forEach((item) => {
    const langPath = localeMap[item];
    if (langPath) {
      langPaths.push(`/${langPath}`);
    }
  });
  return langPaths.includes(path);
};
const mergeOrigin = 'href="https://www.kucoin.';
const replaceOrigin = [
  {
    oldOrigin: /(href="https:\/\/futures\.kucoin\.([a-zA-Z]+))(\/{0,1}[a-zA-Z-]*)/,
    newOrigin: mergeOrigin,
    newRoute: 'futures',
  },
  {
    oldOrigin: /(href="https:\/\/trade\.kucoin\.([a-zA-Z]+))(\/{0,1}[a-zA-Z-]*)/,
    newOrigin: mergeOrigin,
    newRoute: 'trade',
  },
  {
    oldOrigin: /(href="https:\/\/land\.kucoin\.([a-zA-Z]+))(\/{0,1}[a-zA-Z-]*)/,
    newOrigin: mergeOrigin,
    newRoute: 'land',
  },
  {
    oldOrigin: /(href="https:\/\/express\.kucoin\.([a-zA-Z]+))(\/{0,1}[a-zA-Z-]*)/,
    newOrigin: mergeOrigin,
    newRoute: 'express',
  },
];

export const replaceOldOrigin = (content) => {
  if (!content) {
    return content;
  }
  replaceOrigin.forEach((item) => {
    const reg = item.oldOrigin;
    let result = reg.exec(content);
    while (result) {
      const urlWithFirstPath = result[0];
      const url = result[1];
      const origin = result[2];
      const firstRoute = result[3];
      // 线下替换为当前域名，线上保持不变
      const newOrigin =
        origin === 'net' ? `href="${window.location.origin}` : `${item.newOrigin}${origin}`;
      if (isLangPath(firstRoute)) {
        content = content.replace(urlWithFirstPath, `${newOrigin}${firstRoute}/${item.newRoute}`);
      } else {
        content = content.replace(url, `${newOrigin}/${item.newRoute}`);
      }
      result = reg.exec(content);
    }
  });
  return content;
};

// TODO:
// 简体中文路由换成繁体中文
export const replacezhHans2zhHant = (content) => {
  const reg = /href="https:\/\/www\.kucoin\.([a-zA-Z]+)\/zh-hans/;
  let result = reg.exec(content);
  while (result) {
    const url = result[0];
    content = content.replace(url, `href="${window.location.origin}/zh-hant`);
    result = reg.exec(content);
  }
  return content;
};

// TODO:
// kucoin-info replace 内链
export const replaceKucoinLink = (content) => {
  const reg = /<a [^>]*>(kucoin|kucoin info)<\/a>/i;
  let result = reg.exec(content);
  while (result) {
    content = content.replace(result[0], result[1]);
    result = reg.exec(content);
  }
  return content;
};
// 处理倒计时展示
export const transformNum = (num) => {
  return `${num < 10 ? '0' : ''}${num || '0'}`;
}