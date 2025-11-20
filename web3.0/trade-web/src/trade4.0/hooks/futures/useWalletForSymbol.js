/**
 * Owner: garuda@kupotech.com
 */

/**
 * 此 hooks 用来返回合约当前symbol对应的资产
 * 传递参数 symbol
 */
import { useSelector } from 'react-redux';
import { isEqual, get } from 'lodash';

import { FUTURES } from '@/meta/const';
import { getStore } from 'utils/createApp';

import { makeReturnWalletForCurrency } from './useWalletForCurrency';
import { getCurrentSymbolInfo } from '../common/useSymbol';

const emptyObject = {};
// 返回资产
const useWalletForSymbol = (symbol, isTrialFunds) => {
  const walletList = useSelector((state) => state.futuresAssets.walletList, isEqual);
  const symbolInfo = getCurrentSymbolInfo({ symbol, FUTURES });

  const { settleCurrency } = symbolInfo || emptyObject;

  return makeReturnWalletForCurrency({ walletList, currency: settleCurrency, isTrialFunds });
};

// 返回币种对应的资产
export const getWalletForSymbol = (symbol, isTrialFunds) => {
  const globalState = getStore().getState();
  const walletList = get(globalState, 'futuresAssets.walletList');
  const symbolInfo = getCurrentSymbolInfo({ symbol, FUTURES });

  const { settleCurrency } = symbolInfo || emptyObject;

  return makeReturnWalletForCurrency({ walletList, currency: settleCurrency, isTrialFunds });
};

export default useWalletForSymbol;
