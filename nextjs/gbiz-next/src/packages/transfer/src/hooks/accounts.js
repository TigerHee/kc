/**
 * Owner: solar@kupotech.com
 */
import { useMemo, useCallback } from 'react';
import { useTransferSelector } from '@transfer/utils/redux';
import { useProps } from '@transfer/hooks/props';
import { configMap } from '../config';

export function useAccounts() {
  const multiAccounts = useTransferSelector(state => state.multiAccounts);
  const {
    fieldsDefault: { payAccountType, recAccountType },
    supportAccounts,
  } = useProps();

  const accounts = useMemo(
    () =>
      multiAccounts.length
        ? multiAccounts
        : [
            {
              accountType: payAccountType,
              openStatus: true,
            },
            {
              accountType: recAccountType,
              openStatus: true,
            },
          ],
    [multiAccounts, payAccountType, recAccountType]
  );

  return useMemo(() => {
    return accounts
      .filter(item => item.openStatus)
      .filter(item => (Array.isArray(supportAccounts) ? supportAccounts.includes(item.accountType) : true))
      .map(item => configMap[item.accountType])
      .concat({
        ...configMap.MULTI,
        topGap: true,
      })
      .filter(item => item.isSupport());
  }, [accounts]);
}

export function useGetConfigByAccount() {
  const supportAccounts = useAccounts();
  return useCallback(account => supportAccounts.find(item => item.account === account), [supportAccounts]);
}
