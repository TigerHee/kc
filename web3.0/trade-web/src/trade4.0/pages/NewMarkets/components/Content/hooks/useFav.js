/*
 * @Owner: Clyne@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { namespace } from '../../../config';
import { useTabType } from './useType';
import { filter } from 'lodash';
import { getFavKey } from '../../../utils';
import useLoginDrawer from 'src/trade4.0/hooks/useLoginDrawer';
import { FUTURES, ISOLATED, MARGIN, SPOT } from 'src/trade4.0/meta/const';

export const useFav = (item, tradeType) => {
  const { symbolCode, baseCurrency } = item;
  const dispatch = useDispatch();
  const { isCoin, isFutures, isSpot, isMargin, isFavor } = useTabType();
  const fav = useSelector((state) => state[namespace].fav);
  const currentKey = isCoin ? baseCurrency : symbolCode;
  const dataKey = getFavKey({
    isCoin,
    isFutures: isFutures || tradeType === FUTURES,
    isSpot: isSpot || tradeType === SPOT,
    isMargin: isMargin || tradeType === MARGIN || tradeType === ISOLATED,
  });
  const isFav = filter(fav[dataKey], (v) => v === currentKey).length > 0;
  const { isLogin, open } = useLoginDrawer();
  const onChange = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLogin) {
        open();
        return;
      }
      if (dataKey) {
        const payload = {
          currentKey,
          currentState: isFav,
          dataKey,
          item,
          isFavor,
        };
        dispatch({
          type: `${namespace}/collect`,
          payload,
        });
      }
    },
    [isLogin, dataKey, open, currentKey, isFav, item, isFavor, dispatch],
  );
  return { isFav, onChange };
};
