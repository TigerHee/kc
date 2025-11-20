/**
 * Owner: borden@kupotech.com
 */
import { indexOf } from 'lodash';
import { siteCfg, DEFAULT_LANG } from 'config';
import app from 'utils/createApp';
// import { formatUtmAndRcodeUrl } from '@kucoin-biz/entrance';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { determineBasenameFromUrl, addLangToPath } from 'utils/lang';


const { MAINSITE_HOST } = siteCfg;
// 向url添加参数
const updateQueryStringParameter = (uri, key, value) => {
  if (!uri || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = indexOf(uri, '?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  } else {
    return `${uri}${separator}${key}=${value}`;
  }
};
// 给url携带语言参数
const formatUrlWithLang = (originUrl, lang) => {
  // 语言子路径优先级最高
  const { lang: langByPath, localeBasename } = determineBasenameFromUrl(true);
  if (localeBasename && !lang) {
    lang = langByPath;
  }
  if (!lang) {
    try {
      lang = app._store.getState().app.currentLang;
    } catch (e) {
      console.log(e);
    }
  }
  return updateQueryStringParameter(
    queryPersistence.formatUrlWithStore(originUrl),
    'lang',
    lang || DEFAULT_LANG,
  );
};

const getMainsiteLink = () => {
  const loginUrl = `${MAINSITE_HOST}/ucenter/signin?back=${encodeURIComponent(encodeURIComponent(window.location.href))}`;
  const registerUrl = `${MAINSITE_HOST}/ucenter/signup?backUrl=${encodeURIComponent(encodeURIComponent(window.location.href))}`;
  const assetPwdUrl = `${MAINSITE_HOST}/account/security/protect`;
  const assetsUrl = `${MAINSITE_HOST}/assets`;
  const accountUrl = `${MAINSITE_HOST}/account`;

  return {
    loginUrl: addLangToPath(loginUrl),
    registerUrl: addLangToPath(registerUrl),
    assetPwdUrl: addLangToPath(assetPwdUrl),
    assetsUrl: addLangToPath(assetsUrl),
    accountUrl: addLangToPath(accountUrl),
  };
};

export { updateQueryStringParameter, formatUrlWithLang };
export default getMainsiteLink;
