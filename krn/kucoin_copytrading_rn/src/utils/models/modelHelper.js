/**
 * Owner: willen@kupotech.com
 */

/**
 * delay call
 * runtime: next/browser
 */
import {delay} from 'redux-saga/lib/internal/utils';

/**
 * 避免 take(namespace/effect) 警告
 * @param actionWithNameSpace
 * @returns {function(*): boolean}
 */
export const genCompare = actionWithNameSpace => {
  return action => {
    return action.type === actionWithNameSpace;
  };
};

export {delay};
