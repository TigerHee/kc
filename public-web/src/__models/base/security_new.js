/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import security_base from './security_base';

export default extend(base, security_base, {
  namespace: 'security_new',
});
