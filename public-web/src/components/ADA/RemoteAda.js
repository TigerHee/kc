/**
 * Owner: lori@kupotech.com
 */
import loadable from '@loadable/component';

const Ada = loadable(() => System.import('@kucoin-biz/ada'), {
  resolveComponent: (module) => {
    return module.Ada;
  },
});

export default Ada;
