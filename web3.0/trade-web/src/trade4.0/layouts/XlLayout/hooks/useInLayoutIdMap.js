/*
 * @owner: borden@kupotech.com
 */
import { useCallback } from 'react';
import { usePrevious } from 'ahooks';
import { useDispatch, useSelector } from 'dva';
import { MODULES } from '../../moduleConfig';
import { debounceUpdateMap } from '../utils';

export default function useInLayoutIdMap() {
  const dispatch = useDispatch();
  const inLayoutIdMap = useSelector(state => state.setting.inLayoutIdMap);
  const preInLayoutIdMap = usePrevious(inLayoutIdMap);

  const updateInLayoutIdMap = useCallback(debounceUpdateMap((payload) => {
    dispatch({
      type: 'setting/updateInLayoutIdMap',
      payload,
    });
  }, 200), []);

  const initiInLayoutIdMap = useCallback((model) => {
    if (model) {
      const nextInLayoutIdMap = {};
      MODULES.forEach((v) => {
        nextInLayoutIdMap[v.id] = undefined;
        const node = model.getNodeById(v.id);
        if (node) {
          nextInLayoutIdMap[v.id] = 0;
          node.setEventListener('visibility', ({ visible }) => {
            updateInLayoutIdMap({ [v.id]: visible ? 1 : 0 });
          });
        }
      });
      updateInLayoutIdMap(nextInLayoutIdMap);
    }
  }, []);

  return {
    inLayoutIdMap,
    preInLayoutIdMap,
    initiInLayoutIdMap,
    updateInLayoutIdMap,
  };
}
