/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-14 16:06:20
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-14 21:05:11
 * @FilePath: /trade-web/src/trade4.0/hooks/common/createUseStorageState.js
 * @Description:
 */
import { useState } from 'react';
import { isFunction, isUndefined } from 'lodash';
import useMemoizedFn from './useMemoizedFn';
import useUpdateEffect from './useUpdateEffect';

export function createUseStorageState(getStorage) {
  function useStorageState(key, options) {
    let storage;

    try {
      storage = getStorage();
    } catch (err) {
      console.error(err);
    }

    const serializer = (value) => {
      if (options?.serializer) {
        return options?.serializer(value);
      }
      return JSON.stringify(value);
    };

    const deserializer = (value) => {
      if (options?.deserializer) {
        return options?.deserializer(value);
      }
      return JSON.parse(value);
    };

    function getStoredValue() {
      try {
        const raw = storage?.getItem(key);
        if (raw) {
          return deserializer(raw);
        }
      } catch (e) {
        console.error(e);
      }
      if (isFunction(options?.defaultValue)) {
        return options?.defaultValue();
      }
      return options?.defaultValue;
    }

    const [state, setState] = useState(() => getStoredValue());

    useUpdateEffect(() => {
      setState(getStoredValue());
    }, [key]);

    const updateState = (value) => {
      const currentState = isFunction(value) ? value(state) : value;
      setState(currentState);

      if (isUndefined(currentState)) {
        // eslint-disable-next-line no-unused-expressions
        storage?.removeItem(key);
      } else {
        try {
          // eslint-disable-next-line no-unused-expressions
          storage?.setItem(key, serializer(currentState));
        } catch (e) {
          console.error(e);
        }
      }
    };

    return [state, useMemoizedFn(updateState)];
  }
  return useStorageState;
}
