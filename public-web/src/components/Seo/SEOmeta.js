/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const SEOmeta = loadable(() => System.import('@kucoin-biz/seo'), {
  resolveComponent: (module) => module.SEOmeta,
});

export default SEOmeta;
