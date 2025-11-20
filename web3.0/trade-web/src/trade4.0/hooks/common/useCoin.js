/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-22 09:50:18
 * @FilePath: /trade-web/src/trade4.0/hooks/common/useCoin.js
 * @Description: 币种图片
 */
/**
 * Owner: borden@kupotech.com
 */
import { get } from 'lodash';
import { getStore } from 'src/utils/createApp';
import { getStateFromStore } from '@/utils/stateGetter';
import defaultIcon from '@/assets/empty/default.svg';

// const symbolsMap = yield select((state) => state.symbols.symbolsMap);
// const futuresSymbolsMap = yield select((state) => state.symbols.futuresSymbolsMap);

// const isFutures = futuresSymbolsMap[symbol];
// const isSpot = symbolsMap[symbol];
// if (!isFutures && !isSpot) {
//   return; // symbol不合法
// }
const emptyObj = {};

// 获取币种信息
export const getCoinInfo = ({ symbol, coin }) => {
  if (!symbol && !coin) {
    return emptyObj;
  }
  const globalState = getStore().getState();
  const coinDict = get(globalState, 'categories');

  let coinObj;
  if (coin) {
    coinObj = coinDict[coin] || emptyObj;
  } else {
    const futuresSymbolsMap = get(globalState, 'symbols.futuresSymbolsMap');
    const isSpot = symbol.indexOf('-') > -1;
    if (isSpot) {
      coinObj = coinDict[symbol?.split('-')[0]] || emptyObj;
    } else {
      const { baseCurrency, imgUrl } = futuresSymbolsMap[symbol] || {};
      coinObj = coinDict[baseCurrency] || emptyObj;
      coinObj.iconUrl = imgUrl || coinObj.iconUrl || defaultIcon;
    }
  }

  return coinObj;
};

// 获取现货币种信息
export const getCurrencyInfo = (currency) => {
  const coinDict = getStateFromStore((state) => state.categories);
  return coinDict[currency] || {};
};
