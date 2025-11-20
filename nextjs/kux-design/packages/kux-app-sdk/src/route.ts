/**
 * 页面路由相关处理
 */

import { getCurrentLang, DEFAULT_LANG,
  isLangSupported, convertLangStyle } from './lang';
import { globalObject } from './utils';
import { isInApp } from './env';
import { config } from './config';
import { hybrid, getAppMeta } from './hybrid';
import { is } from './is'

export interface IOpenLinkOptions {
  /**
   * 统一的链接地址
   * * 若对应平台有传其专有地址, 则该链接地址将被忽略
   */
  link?: string
  /**
   * web 页面路径
   */
  webLink?: string
  /**
   * app 页面路径
   */
  appLink?: string
  /**
   * tma 页面路径
   */
  tmaLink?: string
  /**
   * 打开方式
   * 
   * app 中:
   * * external 使用系统浏览器, 其他则使用 app 内置webview
   * 
   * web 中:
   * * new/external: 使用新窗口
   * * replace: 替换当前页面(默认行为)
   * 
   * tma 不支持制定打开方式
   * 
   */
  open?: 'new' | 'replace' | 'external'
}
export function openLink(options: IOpenLinkOptions) {
  let link = options.appLink || options.link;
  if (isInApp && link) {
    const appRoute = (getAppMeta().supportOpenInExternal && options.open === 'external')
      ? '/external/link?url=' : '/link?url=';

    const url = /^https?\:\/\//i.test(link)
      // http/https 开头的路径认为是 web 页面, 需要添加 /link?url= 前缀
      // * app 将使用全新的webview打开页面, 从该页面返回时可以直接返回到当前页面且当前页面不会刷新
      // * 若 url 非授信域名, app 将在跳转前弹出安全提示
      // * 使用 addLang2Path 处理, 保证跳转后的kucoin页面语言正确 
      ? `${appRoute}${encodeURIComponent(addLang2Path(link))}`
      // 其他认为是 app 页面, 正常 app 页面地址使用 / 开头
      // * 若实际非 app 页面, 此处打开将无响应
      : link;
    hybrid.call('jump', { url })
    return;
  }
  const tmaSDK = config('tmaSDK');
  link = options.tmaLink  || options.link || options.webLink;
  if (tmaSDK && link) {
    // / 开头的路径认为 xkc 路由, 使用 Tma.actions.route 跳转
    if (/^https?:\/\//i.test(link)) {
      tmaSDK.actions.webview({
        path: link,
      });
    } else {
      tmaSDK.actions.route({
        path: link,
      });
    }
    return
  }
  link = options.webLink || options.link || options.tmaLink;
  if (!link) {
    // 没有传入任何链接, 则不进行跳转
    console.warn('app.openLink: no link provided');
    return;
  }
  // 修正路径中的语言, 仅针对 kucoin 相关域名
  const url = addLang2Path((link) as string);
  if (options.open === 'new') {
    const openTab = window.open(url, '_blank');
    if (openTab) openTab.opener = null;
    return;
  }
  if (options.open === 'replace') {
    location.replace(url);
    return
  }
  location.href = url;
}

export interface IBuildURLOptions {
  /**
   * 是否为 app 路径
   * * true 时 lang 参数会被忽略, 返回为 app 使用的相对路径而非带域名的完整路径
   */
  isAppPath?: boolean
  /**
   * 是否清除已有的查询参数
   */
  clearQuery?: boolean
  /**
   * 是否清除 hash 参数
   */
  clearHash?: boolean
  /**
   * 额外追加的查询参数
   */
  query?: Record<string, any>
  /**
   * 路径语言
   * * 若为 false, 则不追加语言到路径
   * * 若为 string, 则使用该语言
   * * 默认使用当前语言替换路径中的语言 
   */
  lang?: string | false
}

/**
 * 构造页面路径
 * @param path 页面路径, 若为相对路径, 则相对于当前页面地址解析
 * @param options 页面路径配置
 * @returns 解析后的页面路径 string
 */
export function buildURL(path: string, options: IBuildURLOptions = {}) {
  const url = new URL(path, location.href);
  let sliceStart = 0;
  if (options.isAppPath) {
    // 去除路径可能出现的 '../' 和 './'
    sliceStart = url.href.indexOf(path.replace(/^(\.+\/)*\.+/, ''));
  }
  if (options.clearQuery) {
    url.search = '';
  }
  if (options.clearHash) {
    url.hash = '';
  }
  if (options.query) {
    Object.keys(options.query).forEach(key => {
      const val = options.query![key];
      // val 为 null 时, 不添加该参数, 避免出现 '?key=undefined' 或 '?key=null' 情况
      if (is(val, 'nullable')) return;
      url.searchParams.set(key, val);
    });
  }
  if (options.lang !== false) {
    url.href = addLang2Path(url, options.lang);
  }
  if (url.search) {
    // 强迫症: 去除 = 后的空参数: "a=&b=" => "a&b"
    url.search = url.search.replace(/=(&|$)/g, '$1');
  }
  return url.href.slice(sliceStart)
}

/**
 * 添加语言到路径, 仅支持 kucoin 相关域名
 * @param urlStr 路径, 若为相对路径, 则使用当前浏览器地址栏自动补全为绝对路径
 * @param lang 语言, 默认使用当前语言
 */
export function addLang2Path(urlStr: URL | string, lang?: string) {
  const url = urlStr instanceof URL ? urlStr : new URL(urlStr, location.href);
  if (!shouldFixLangInPath(url)) {
    return url.href;
  }
  const currentLang = convertLangStyle(lang || getCurrentLang(), 'path');
  const pathParts = url.pathname.split('/');
  const possibleLangInUrl = pathParts[1];
  // 路径中是否有语言
  const hasLangInPath = possibleLangInUrl && isLangSupported(possibleLangInUrl);

  /**
   * 删除url中的lang参数, 避免重复, 统一由路径中获取
   * * 此处不使用 url.searchParams.delete('lang') 是因为 url.searchParams 会自动补全缺失的'='
   * * 例如: '?a&b' 会被补全为 '?a=&b=', 对强迫症患者不友好
   * * 同时也会导致对比 URL 时出现无意义的不一致的情况
   * * 例如: '?a&b' 与 '?a=&b=' 对比会返回 false
   * * 所以直接使用正则替换
   */
  url.search = url.search.replace(/(?:\?|&)lang(&|$|(=[^&]*))/, (_, $1) => $1 === '&' ? $1 : '');
  // 删除多余的'&', 避免出现 '?&a=b' 的情况
  url.search = url.search.replace(/^\?&/, '?');
  // 删除路径中的多余的'/', 优化 seo
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }
  /**
   * 下述情况直接返回清理后的路径:
   * * 路径中没有语言信息, 且当前语言对应path 也是空
   * * 路径中有语言信息, 且路径中的语言信息与当前语言路径一致
   */
  if ((!hasLangInPath && !currentLang) ||(hasLangInPath &&  possibleLangInUrl === currentLang)) return url.href

  // 有语言信息, 则替换为当前语言对应路径, 否则首部追加当前语言
  if (hasLangInPath) {
    pathParts[1] =  currentLang;
  } else {
    pathParts.unshift(currentLang);
  }
  // 去除空字符串, 避免出现多余的'//'
  url.pathname = '/' + pathParts.filter(Boolean).join('/');
  return url.href;
}

function shouldFixLangInPath(url: URL) {
  const hostname = url.hostname;
  // 内网域名
  if (hostname.endsWith('.kucoin.net') || isIntranetHost(hostname)) {
    return true;
  }
  const langDomains: string[] = globalObject._LANG_DOMAIN_ || ['.kucoin.'];
  return langDomains.some(d => hostname.includes(d));
}

// 是否为局域网域名
function isIntranetHost(hostname: string) {
  // 本地域名
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
  // 内网域名
  return /\.(local|internal)$/.test(hostname);
}

/**
 * 当前路径(不带语言信息)
 */
export function getBaseName() {
  const lang = getCurrentLang();
  return lang === DEFAULT_LANG ? '' : `/${convertLangStyle(lang, 'path')}`;
}

export function getPathnameWithoutLang() {
  const lang = convertLangStyle(getCurrentLang(), 'path');
  const reg = new RegExp(`^/${lang}`);
  return location.pathname.replace(reg, '');
}

