/**
 * Owner: jesse.shao@kupotech.com
 */
import { indexOf } from 'lodash';
// import runtimeApp from 'src/runtime-app';
import { DEFAULT_LANG } from 'config';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { getLocalBase } from 'utils/langTools';


// const formatUtmAndRcodeUrl = queryPersistence.formatUrlWithStore;

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
   const { isExist, localeBasenameFromPath: localeBasename } = getLocalBase();
   if (localeBasename && !lang) {
     lang = isExist;
   }
  if (!lang) {
    try {
      // lang = runtimeApp().select(state => state.app.currentLang);
    } catch (e) {
      console.log(e);
    }
  }
  return updateQueryStringParameter(queryPersistence.formatUrlWithStore(originUrl), 'lang', lang || DEFAULT_LANG);
};

export { updateQueryStringParameter };
export default formatUrlWithLang;
