/**
 * Owner: iron@kupotech.com
 */
import { isString, isFunction } from 'lodash';
import { namespace } from './model';

export default (dispatch) => (bizType, callback) => {
  if (!isString(bizType)) {
    throw new Error('param bizType must be string!');
  }
  if (!isFunction(callback)) {
    throw new Error('param callback must be function!');
  }
  dispatch({
    type: `${namespace}/securityVerifyFlow`,
    payload: {
      bizType,
    },
    afterVerify: callback,
  });
};
