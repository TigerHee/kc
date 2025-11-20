/*
 * @owner: borden@kupotech.com
 */
import { has, isEmpty } from 'lodash';
import React, { memo, useRef, useState, useCallback } from 'react';
import useDebounceEffect from '../../../hooks/common/useDebounceEffect';
import createSelectorProvider from '../../../hooks/common/useContextSelector/createSelectorProvider';
import { storeContext } from '../../../config';
import basicStates, { basicStatesDefaultValues } from './basicStates';

let _store;
const SelectorProvider = createSelectorProvider(storeContext);

function StoreProvider({ store, children }) {
  const [state, setState] = useState(() => {
    _store = store || {};
    return _store;
  });
  const locked = useRef({});

  useDebounceEffect(
    () => {
      const fn = async () => {
        const promiseGroup = {};
        basicStates.forEach((item) => {
          const { name, fallbackFetchFn } = item;
          if (
            fallbackFetchFn &&
            !promiseGroup[name] &&
            !locked.current[name] &&
            [store, _store].every((v) => !has(v, name))
          ) {
            locked.current[name] = true;
            promiseGroup[name] = fallbackFetchFn();
          }
        });
        const promiseGroupKeys = Object.keys(promiseGroup);
        const promiseGroupValues = Object.values(promiseGroup);
        const results = await Promise.allSettled(promiseGroupValues);
        const newState = results.reduce((a, b, i) => {
          if (b.status === 'fulfilled' && b.value) {
            Object.assign(a, b.value);
          }
          locked.current[promiseGroupKeys[i]] = false;
          return a;
        }, {});
        if (!isEmpty(newState)) {
          updateState(newState);
        }
      };
      updateState(store);
      fn();
    },
    [store, updateState],
    { wait: 300 },
  );

  const updateState = useCallback((payload) => {
    _store = {
      ..._store,
      ...payload,
    };
    setState(_store);
  }, []);

  return (
    <SelectorProvider value={{ ...basicStatesDefaultValues, ...state }}>
      {children}
    </SelectorProvider>
  );
}

export const getStateFromStore = (fn) => fn(_store);
export default memo(StoreProvider);
