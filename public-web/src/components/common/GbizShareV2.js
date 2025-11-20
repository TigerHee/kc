/*
 * Owner: mcqueen@kupotech.com
 */
import loadable from '@loadable/component';

const ShareModalV2 = loadable(() => System.import('@kucoin-biz/share'), {
  resolveComponent: (module) => module.ShareModalV2,
});

export default ShareModalV2;
