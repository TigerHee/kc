/**
 * Owner: iron@kupotech.com
 */
import { useState, useEffect } from 'react';

const listeners = [];
let state = {};

const setState = (newState) => {
  state = { ...state, ...newState };

  listeners.forEach((listener) => {
    listener(state);
  });
};

const useCmsCommon = () => {
  const [, listener] = useState();

  useEffect(() => {
    listeners.push(listener);
  }, []);

  return [state, setState];
};

export default useCmsCommon;
