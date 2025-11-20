/**
 * Owner: willen@kupotech.com
 */
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { indexOf } from 'lodash';

// 默认语言
export const DEFAULT_LANG = window._DEFAULT_LANG_ || 'en_US';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];

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
  // if (!lang) {
  //   try {
  //     lang = intl.options.currentLocale;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  return updateQueryStringParameter(
    queryPersistence.formatUrlWithStore(originUrl, WITHOUT_QUERY_PARAM),
    'lang',
    lang || DEFAULT_LANG,
  );
};

export { updateQueryStringParameter };
export default formatUrlWithLang;
