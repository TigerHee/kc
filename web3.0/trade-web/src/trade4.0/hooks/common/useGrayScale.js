/**
 * Owner: clyne@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { GRAY_SCALE_MAP } from '@/meta/grayScale';

/**
 *  获取灰度值
 * @param {string} abKey
 * @returns
 */
export const useGrayScale = (abKey) => {
  const defaultValue = GRAY_SCALE_MAP[abKey]?.defaultValue || '';
  return useSelector((state) => {
    const value = state.grayScale[abKey] || defaultValue;
    const isABDefault = defaultValue === value;
    return { value, isABDefault };
  });
};

/**
 * 初始化灰度
 */
export const useInitGrayScale = () => {
  const dispatch = useDispatch();
  const handle = useCallback(() => {
    const keys = Object.keys(GRAY_SCALE_MAP);
    for (let i = 0; i < keys.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      dispatch({
        type: 'grayScale/pullAB',
        payload: {
          abKey: keys[i],
          count: 1,
        },
      });
    }
  }, [dispatch]);
  useEffect(() => {
    handle();
  }, [handle]);
};
