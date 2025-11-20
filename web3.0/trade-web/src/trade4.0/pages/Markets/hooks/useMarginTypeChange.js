/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-29 15:38:09
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-29 15:54:48
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/hooks/useMarginTypeChange.js
 * @Description:市场杠杆选币列表 点击后，更新model里tradeMarkets.infoOfClickMarginRow数据，update_trade_type更新交易类型
 */
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import useTradeTypes from '@/hooks/common/useTradeTypes';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';

export const useMarginTypeChange = () => {
  const dispatch = useDispatch();
  const tradeTypes = useTradeTypes();
  const marginSymbolsMap = useSelector((state) => state.symbols.marginSymbolsMap);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const infoOfClickMarginRow = useSelector((state) => state.tradeMarkets.infoOfClickMarginRow);

  useEffect(() => {
    if (infoOfClickMarginRow) {
      const [marginTab, symbolCode] = infoOfClickMarginRow;
      if (symbolCode === currentSymbol) {
        let nextTradeType;
        if (marginTab === 'ALL') {
          const { isMarginEnabled } = marginSymbolsMap[currentSymbol] || {};
          nextTradeType = isMarginEnabled
            ? TRADE_TYPES_CONFIG.MARGIN_TRADE.key
            : TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key;
        } else {
          nextTradeType = marginTab;
        }
        if (tradeTypes.includes(nextTradeType)) {
          // 清除保留的信息
          dispatch({
            type: 'tradeMarkets/update',
            payload: {
              infoOfClickMarginRow: null,
            },
          });
          dispatch({
            type: 'trade/update_trade_type',
            payload: {
              tradeType: nextTradeType,
            },
          });
        }
      }
    }
  }, [tradeTypes, currentSymbol, infoOfClickMarginRow]);
};
