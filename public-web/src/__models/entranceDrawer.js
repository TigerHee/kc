/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';

export default extend(base, {
  namespace: 'entranceDrawer',
  state: {
    loginOpen: false,
  },
});
