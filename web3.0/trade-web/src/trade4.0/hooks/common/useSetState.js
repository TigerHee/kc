/*
 * @owner: borden@kupotech.com
 */
import { useCallback, useState } from 'react';
import { isFunction } from 'lodash';

export default function useSetState(initialState) {
  const [state, setState] = useState(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
}
