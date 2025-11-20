/**
 * Owner: willen@kupotech.com
 */
import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "external_ForgetPwdDrawer" */ './ForgetPwdDrawer'),
);
