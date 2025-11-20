/**
 * Owner: garuda@kupotech.com
 */

/**
 * 此 hooks 用来返回合约当前币种对应 资产 以及 可用余额
 * 传递参数 currency 币种
 */
import { useSelector } from 'react-redux';
import { isEqual, get } from 'lodash';

import { getStore } from 'utils/createApp';

import { makeReturnWalletForCurrency } from './useWalletForCurrency';

export const makeReturnAvailableBalance = ({ walletList, currency, isTrialFunds }) => {
  const currentWallet = makeReturnWalletForCurrency({ walletList, currency, isTrialFunds });
  if (currentWallet) {
    return currentWallet.availableBalance;
  }
  return '-';
};

// 返回余额
const useAvailableBalance = (currency, isTrialFunds) => {
  const walletList = useSelector((state) => state.futuresAssets.walletList, isEqual);

  return makeReturnAvailableBalance({ walletList, currency, isTrialFunds });
};

// 返回余额
export const getAvailableBalance = (currency, isTrialFunds) => {
  const globalState = getStore().getState();
  const walletList = get(globalState, 'futuresAssets.walletList');
  return makeReturnAvailableBalance({ walletList, currency, isTrialFunds });
};

export default useAvailableBalance;
