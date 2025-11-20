/**
 * Owner: willen@kupotech.com
 */

import loadable from '@loadable/component';

export default loadable(async () => {
  return import(/* webpackChunkName: "external_GlobalScope" */ './GlobalScope');
});
