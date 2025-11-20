/**
 * Owner: mike@kupotech.com
 */
import { useCallback, useState } from 'react';

const useMergeState = (initialState) => {
  const [state, setState] = useState(initialState);

  const setMergeState = useCallback((newState) => {
    setState((prevState) => {
      let newStateData = newState;
      if (typeof newState === 'function') {
        newStateData = newState(prevState);
      }
      return newStateData ? { ...prevState, ...newStateData } : prevState;
    });
  }, []);

  return [state, setMergeState];
};

export default useMergeState;
