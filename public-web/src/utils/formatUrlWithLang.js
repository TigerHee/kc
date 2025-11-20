/**
 * Owner: willen@kupotech.com
 */
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { DEFAULT_LANG, WITHOUT_QUERY_PARAM } from 'config/base';
import { indexOf } from 'lodash';
import intl from 'react-intl-universal';

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

/**
 * 根据对象更新URL的查询参数
 * @param {string} uri 原始URL
 * @param {Object} params 参数对象，包含需要更新的键值对
 * @return {string} 更新后的URL
 */
export const updateUrlWithParams = (uri, params) => {
  // 遍历参数对象，逐个更新URL中的查询参数
  let updatedUri = uri;
  Object.keys(params).forEach((key) => {
    updatedUri = updateQueryStringParameter(updatedUri, key, params[key]);
  });
  return updatedUri;
};
