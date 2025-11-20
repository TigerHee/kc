/**
 * Owner: borden@kupotech.com
 */
import app from './createApp';

const select = (fn) => {
  if (typeof fn !== 'function') {
    throw new Error('invalid select fn type');
  }
  const state = app._store.getState();
  return fn(state);
};

export default select;
