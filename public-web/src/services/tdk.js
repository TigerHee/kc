/**
 * Owner: ella.wang@kupotech.com
 */
import { pull } from 'tools/request';

export function getTdkConfig(language) {
  const { pathname, host } = window.location;
  return pull('/seo-support/tdk/queryTdk', {
    domainName: host,
    path: encodeURIComponent(pathname),
    language,
  });
}
