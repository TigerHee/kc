/*
 * @owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'dva';
import { includes, reduce } from 'lodash';
import { MODULES } from '@/layouts/moduleConfig';

export default function useInitiInLayoutIdMap(layoutName) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'setting/updateInLayoutIdMap',
      override: true,
      payload: reduce(
        MODULES.filter(v => includes(v?.layoutsHaveThisAtInit, layoutName)),
        (a, b) => {
          a[b.id] = 1;
          return a;
        },
        {},
      ),
    });
  }, [layoutName]);
}
