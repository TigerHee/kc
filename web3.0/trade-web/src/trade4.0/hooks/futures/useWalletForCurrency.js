/**
 * Owner: garuda@kupotech.com
 */

/**
 * 此 hooks 用来返回合约当前币种对应的资产
 * 传递参数 currency 币种
 */
import { useSelector } from 'react-redux';
import { isEqual, get, find } from 'lodash';

import { formatCurrency } from '@/utils/futures/formatCurrency';
import { getStore } from 'utils/createApp';

const emptyObject = {};
export const makeReturnWalletForCurrency = ({ walletList, currency, isTrialFunds }) => {
  const currentWallet = find(walletList, (item) => {
    return (
      formatCurrency(item.currency) === formatCurrency(currency) &&
      !!isTrialFunds === !!item.isTrialFunds
    );
  });
  return currentWallet || emptyObject;
};

// 返回资产
const useWalletForCurrency = (currency, isTrialFunds) => {
  const walletList = useSelector((state) => state.futuresAssets.walletList, isEqual);
  return makeReturnWalletForCurrency({ walletList, currency, isTrialFunds });
};

// 返回币种对应的资产
export const getWalletForCurrency = (currency, isTrialFunds) => {
  const globalState = getStore().getState();
  const walletList = get(globalState, 'futuresAssets.walletList', []);
  return makeReturnWalletForCurrency({ walletList, currency, isTrialFunds });
};

export default useWalletForCurrency;
