/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const CmsStyleSheet = loadable(() => System.import('@kucoin-biz/cms'), {
  resolveComponent: (module) => module.CmsStyleSheet,
});

export default CmsStyleSheet;
