/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-02 20:33:51
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-06-04 17:44:32
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/hooks/useOrderTypeChange.js
 * @Description: 当订单的交易类型变化后，需要重新发起请求
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { FUTURES } from '@/meta/const';
import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
/**
 * @description: 当这些props 改变的时候，重新拉当前namespace数据
 * @param {*} namespace
 * @param {*} tabObj[namespace] 是model里的filters
 * @param {*} isLogin
 * @param {*} tradeType
 * @param {*} currentSymbol
 * @return {*}
 */
export const useOrderTypeChange = (namespace, tabObj, isLogin, tradeType, currentSymbol) => {
  const dispatch = useDispatch();
  const hasTradeTypeChange = useRef(false);

  useEffect(() => {
    if (isLogin && isSpotTypeSymbol(currentSymbol) && tradeType !== FUTURES) {
      if (hasTradeTypeChange.current) {
        const isOCOtypeNow =
          tabObj[namespace] && tabObj[namespace].type === 'limit_oco';
        const isOCODisplay =
          TRADE_TYPES_CONFIG[tradeType] &&
          TRADE_TYPES_CONFIG[tradeType].isOCODisplay;
        const rest = isOCOtypeNow && !isOCODisplay ? { type: undefined } : {};
        const payload = { triggerMethod: 'rest', ...rest };
        dispatch({
          payload,
          type: `${namespace}/filter`,
        });
      } else {
        hasTradeTypeChange.current = true;
      }
    }
  }, [isLogin, tradeType, currentSymbol]);
};
