import {isEqual} from 'lodash';

export const debounceImmediate = (func, wait) => {
  let lastArgs, lastTimestamp;

  return function (...args) {
    const context = this;
    const now = Date.now();
    const argsAreEqual = isEqual(args, lastArgs);

    if (!lastTimestamp || !argsAreEqual || now - lastTimestamp > wait) {
      func.apply(context, args);
      lastTimestamp = now;
      lastArgs = args;
    }
  };
};
