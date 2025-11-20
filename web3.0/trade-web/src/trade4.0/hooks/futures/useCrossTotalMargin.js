/**
 * Owner: garuda@kupotech.com
 */
import { useMemo } from 'react';

import { get } from 'lodash';

import { getSwitchTrialFund, useSwitchTrialFund } from './useFuturesTrialFund';
import useWalletForCurrency, { getWalletForCurrency } from './useWalletForCurrency';

export const useCrossTotalMargin = (settleCurrency) => {
  const { switchTrialFund } = useSwitchTrialFund();
  const wallet = useWalletForCurrency(settleCurrency, !!switchTrialFund);

  const totalMargin = useMemo(() => {
    return get(wallet, 'totalMargin', 0)?.toString();
  }, [wallet]);

  return totalMargin;
};

export const getCrossTotalMargin = (settleCurrency) => {
  const { switchTrialFund } = getSwitchTrialFund();
  const wallet = getWalletForCurrency(settleCurrency, !!switchTrialFund);

  return get(wallet, 'totalMargin', 0)?.toString();
};
