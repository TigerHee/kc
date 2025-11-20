/**
 * Owner: garuda@kupotech.com
 * 此 hooks 用来返回当前的 walletList
 */
import { useSelector } from 'react-redux';

import { get } from 'lodash';

import { getStore } from 'utils/createApp';

// 返回资产
export const useWalletList = () => {
  return useSelector((state) => state.futuresAssets.walletList);
};

// 返回币种对应的资产
export const getWalletList = () => {
  const globalState = getStore().getState();
  const walletList = get(globalState, 'futuresAssets.walletList', []);
  return walletList;
};
