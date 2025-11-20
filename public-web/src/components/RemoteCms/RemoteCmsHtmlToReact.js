/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const CmsHtmlToReact = loadable(() => System.import('@kucoin-biz/cms'), {
  resolveComponent: (module) => module.CmsHtmlToReact,
});

export default CmsHtmlToReact;
