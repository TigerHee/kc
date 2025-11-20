/*
 * @owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import guideQueue from '../guideQueue';
import { CONFIG_MAP } from '../config';

export default function useGuideStatus(code, autoRender = true) {
  const dispatch = useDispatch();
  const activeSequence = useSelector(state => state.setting.activeGuideSequence);

  useEffect(() => {
    if (autoRender) {
      guideQueue.changeActiveStatus(code, true, (v) => {
        dispatch({
          type: 'setting/update',
          payload: {
            activeGuideSequence: v,
          },
        });
      });
      return () => {
        guideQueue.changeActiveStatus(code, false);
      };
    }
  }, [code, autoRender]);

  return Boolean(
    activeSequence !== undefined &&
    CONFIG_MAP[code]?.sequence === activeSequence,
  );
}
