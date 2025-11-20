/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

const VoiceCode = loadable(() => System.import('@kucoin-biz/entrance'), {
  resolveComponent: (module) => module.VoiceCode,
});

export default VoiceCode;
