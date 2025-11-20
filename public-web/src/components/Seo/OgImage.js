/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const OgImage = loadable(() => System.import('@kucoin-biz/seo'), {
  resolveComponent: (module) => module.OgImage,
});

export default OgImage;
