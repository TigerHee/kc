/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import security_base from './security_base';

export default extend(base, security_base, {
  namespace: 'security_new',
});
