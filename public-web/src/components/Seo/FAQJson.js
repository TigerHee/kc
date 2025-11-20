/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const FAQJson = loadable(() => System.import('@kucoin-biz/seo'), {
  resolveComponent: (module) => (module ? module.FAQJson : () => null),
});

export default FAQJson;
