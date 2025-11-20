/**
 * Owner: willen@kupotech.com
 */
import { indexOf } from 'lodash-es';
import { getSiteConfig } from "kc-next/boot";
import { WITHOUT_QUERY_PARAM } from '@/config/base';
import { queryPersistence } from 'gbiz-next/QueryPersistence';

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
// TODO: 看起来不需要这个了，因为无需基座了
// 待实际测试
const formatUrlWithLang = (originUrl?: string, lang?: string) => {
  const { _DEFAULT_LANG_, currentLang } = getSiteConfig();
  // 语言子路径优先级最高
  // if (localeBasename && !lang) {
  //   lang = getLangFromLocaleMap(localeBasename);
  // }
  // if (!lang) {
  //   try {
  //     lang = currentLocale;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  
  return updateQueryStringParameter(
    queryPersistence.formatUrlWithStore(originUrl || '', WITHOUT_QUERY_PARAM),
    'lang',
    lang || currentLang || _DEFAULT_LANG_,
  );
};

export { updateQueryStringParameter };
export default formatUrlWithLang;
