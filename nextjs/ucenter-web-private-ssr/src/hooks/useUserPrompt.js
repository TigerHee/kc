/**
 * Owner: judith@kupotech.com
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import storage from 'utils/storage';

/**
 * params typeTuples[]
 * typeTuples [type, maxPromptTimes]
 */

export default (typeTuples = []) => {
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState({});
  const promptTimes = useRef({}); // {type: {count, latestTime}}
  const storageKey = 'USER_PROMPT_TIMES';

  const currentTypes = useMemo(() => {
    promptTimes.current = storage.getItem(storageKey) || {};
    if (typeTuples && typeTuples.length) {
      return typeTuples
        .filter(([type, maxPromptTimes]) => {
          const { count: storageTimes = 0, latestTime = 0 } = promptTimes.current[type] || {};
          return storageTimes < maxPromptTimes && +new Date() - latestTime >= 2 * 60 * 60 * 1000;
        })
        .map(([type, _]) => type);
    }
    return [];
  }, [typeTuples]);

  useEffect(() => {
    if (currentTypes?.length) {
      dispatch({
        type: 'accountOverview/pullUserPromptInformations',
        payload: { types: currentTypes.join() },
      }).then((res) => {
        if (res?.length) {
          let curPrompt = {};
          currentTypes.forEach((type, index) => (curPrompt[type] = res[index] || null));
          setPrompt(curPrompt);
        }
      });
    }
  }, []);

  const closePrompt = useCallback(
    (type) => {
      if (type) {
        const { count: lastCount = 0 } = promptTimes.current[type] || {};
        setPrompt({
          ...prompt,
          [type]: null,
        });
        storage.setItem(storageKey, {
          ...promptTimes.current,
          [type]: {
            count: lastCount + 1,
            latestTime: +new Date(),
          },
        });
      }
    },
    [prompt],
  );

  return [prompt, closePrompt];
};
