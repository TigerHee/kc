/**
 * Owner: ella@kupotech.com
 */
import loadable from '@loadable/component';

const BreadcrumbLd = loadable(() => System.import('@kucoin-biz/seo'), {
  resolveComponent: (module) => module.BreadcrumbLd,
});

export default BreadcrumbLd;
