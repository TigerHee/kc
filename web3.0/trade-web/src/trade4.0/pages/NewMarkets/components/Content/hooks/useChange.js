/*
 * @Owner: Clyne@kupotech.com
 */
import { useCallback, useContext } from 'react';
import { useDispatch } from 'dva';
import { useTabType } from './useType';
import { FUTURES, ISOLATED, MARGIN, SPOT } from 'src/trade4.0/meta/const';
import { event } from 'src/trade4.0/utils/event';
import { SEARCH_FORM_EVENT } from '../../../config';
import storage from 'src/utils/storage';
import { TYPE_FOR_STORAGE } from 'src/utils/hooks/useTradeTypes';
import { HookContext } from 'src/trade4.0/pages/InfoBar/SymbolSwitch';
import { HookContext as H5HookContext } from '@mui/Dropdown';
import { useResetSubscribe } from './useList';
import { getStore } from 'src/utils/createApp';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

let canClick = true;

export const useChange = (item, tradeType) => {
  const dispatch = useDispatch();
  const isH5 = useIsH5();
  const setDialog = useContext(HookContext);
  const setH5Dialog = useContext(H5HookContext);
  const { reSubscribe } = useResetSubscribe();
  const { isFutures, isSpot, isMargin, isCoin, isBusinessTradeMargin, isBusinessIsolatedMargin } =
    useTabType();
  const onClick = useCallback(
    (e) => {
      if (canClick) {
        canClick = false;
        setTimeout(() => {
          canClick = true;
        }, 1200);
        e.preventDefault();
        let toTradeType;
        const { symbolCode, baseCurrency, isMarginEnabled, isIsolatedEnabled } = item;
        // 是coin
        if (isCoin) {
          return event.emit(SEARCH_FORM_EVENT, baseCurrency);
        }
        // 传递tradeType只有在allSearch的时候传递，
        // 这里主要是因为全部搜索的时候，数据中无法判断类型，只能按照全部搜索分类来判断
        // 下面的判断注意判断顺序， margin最后
        if (isFutures || tradeType === FUTURES) {
          toTradeType = FUTURES;
        } else if (isSpot || tradeType === SPOT) {
          toTradeType = SPOT;
        } else if (isMargin || tradeType === MARGIN || tradeType === ISOLATED) {
          // 逐仓tab下
          if (isBusinessIsolatedMargin) {
            toTradeType = ISOLATED;
            // 全仓tab下
          } else if (isBusinessTradeMargin) {
            toTradeType = MARGIN;
            // 没有在业务类型的杠杠二级tab里，可能在收藏内部，内部没有区分全仓逐仓，先判断是否支持全仓，支持优先打开全仓
          } else if (isMarginEnabled) {
            toTradeType = MARGIN;
          } else if (isIsolatedEnabled) {
            toTradeType = ISOLATED;
          } else {
            const { marginSymbolsMap } = getStore().getState().symbols;
            const itemMap = marginSymbolsMap[symbolCode] || {};
            const { isMarginEnabled: _isMarginEnabled, isIsolatedEnabled: _isIsolatedEnabled } =
              itemMap;

            if (_isMarginEnabled) {
              toTradeType = MARGIN;
            } else if (_isIsolatedEnabled) {
              toTradeType = ISOLATED;
            } else {
              return console.error('Data Error， link to margin page fail');
            }
          }
        }

        // TODO
        storage.setItem(TYPE_FOR_STORAGE, toTradeType);

        dispatch({
          type: '$tradeKline/routeToSymbol',
          payload: {
            symbol: symbolCode,
            toTradeType,
          },
        });
        setDialog(false);
        if (isH5) {
          setH5Dialog(false);
        }
        reSubscribe();
      }
    },
    [
      item,
      isCoin,
      isFutures,
      tradeType,
      isSpot,
      isMargin,
      dispatch,
      setDialog,
      isH5,
      reSubscribe,
      isBusinessIsolatedMargin,
      isBusinessTradeMargin,
      setH5Dialog,
    ],
  );

  return { onClick };
};
