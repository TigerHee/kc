/**
 * Owner: willen@kupotech.com
 */
import { indexOf } from 'lodash';
import { DEFAULT_LANG, WITHOUT_QUERY_PARAM } from 'config/base';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import intl from 'react-intl-universal';
import { getLocaleBasename, getLangFromLocaleMap } from 'tools/i18n';

// 向url添加参数
const updateQueryStringParameter = (uri, key, value) => {
  if (!uri || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = indexOf(uri, '?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  }

  return `${uri}${separator}${key}=${value}`;
};
// 给url携带语言参数
const formatUrlWithLang = (originUrl, lang) => {
  // 语言子路径优先级最高
  const localeBasename = getLocaleBasename();
  if (localeBasename && !lang) {
    lang = getLangFromLocaleMap(localeBasename);
  }
  if (!lang) {
    try {
      lang = intl.options.currentLocale;
    } catch (e) {
      console.log(e);
    }
  }
  return updateQueryStringParameter(
    queryPersistence.formatUrlWithStore(originUrl, WITHOUT_QUERY_PARAM),
    'lang',
    lang || DEFAULT_LANG,
  );
};

export { updateQueryStringParameter };
export default formatUrlWithLang;
