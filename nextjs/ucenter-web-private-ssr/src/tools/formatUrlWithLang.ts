import { WITHOUT_QUERY_PARAM } from '@/config/base';
import { queryPersistence } from 'gbiz-next/QueryPersistence';
import { getCurrentLang } from 'kc-next/i18n';
import { compose } from '@/core/telemetryModule';

const updateQueryStringParameter = (uri: string, key: string, value: string) => {
  if (!uri || !value) {
    return uri;
  }
  const reg = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
  const separator = uri.indexOf('?') > -1 ? '&' : '?';
  if (uri.match(reg)) {
    return uri.replace(reg, `$1${key}=${value}$2`);
  }

  return `${uri}${separator}${key}=${value}`;
};

// 给url携带语言参数
// 待实际测试
const formatUrlWithLangQuery = (originUrl: string) => {
  const lang = getCurrentLang();
  return updateQueryStringParameter(queryPersistence.formatUrlWithStore(originUrl, WITHOUT_QUERY_PARAM), 'lang', lang);
};

// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms) => {
  if (!spms) return url;
  const spm = compose(spms);
  if (!spm) return url;
  return updateQueryStringParameter(url, 'spm', spm);
};

export { updateQueryStringParameter };
export default formatUrlWithLangQuery;
