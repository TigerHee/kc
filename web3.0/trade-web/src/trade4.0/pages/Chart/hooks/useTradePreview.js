/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-24 17:39:40
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-30 16:48:09
 * @FilePath: /trade-web/src/trade4.0/pages/Chart/hooks/useTradePreview.js
 * @Description:
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';

const _obj = {};
export const useTradePreview = ({ symbol }) => {
  const dispatch = useDispatch();

  const coinSummary = useSelector((state) => state.symbols.coinSummary);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap);
  const [coin] = symbol.split('-');
  const iconUrl = useSelector((state) => (state.categories[coin] || _obj).iconUrl);

  const symbolInfo = symbolsMap[symbol] || _obj;

  useEffect(() => {
    if (coin) {
      dispatch({
        type: 'symbols/getCoinInfo',
        payload: {
          coin, // TIPS: 兼容当前是合约交易对场景
          symbol: coin,
        },
      });
    }
  }, [coin, dispatch]);

  return { coinSummary, iconUrl, symbolInfo };
};
