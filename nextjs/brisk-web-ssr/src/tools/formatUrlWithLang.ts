import { WITHOUT_QUERY_PARAM } from '@/config/base';
import { queryPersistence } from 'gbiz-next/QueryPersistence';
import { getCurrentLang } from 'kc-next/i18n';

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
  return updateQueryStringParameter(
    queryPersistence.formatUrlWithStore(originUrl, WITHOUT_QUERY_PARAM),
    'lang',
    lang,
  );
};

export { updateQueryStringParameter };
export default formatUrlWithLangQuery;
