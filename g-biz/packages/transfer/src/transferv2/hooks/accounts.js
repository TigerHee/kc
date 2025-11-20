/**
 * Owner: solar@kupotech.com
 */
import { useMemo, useCallback } from 'react';
import { useTransferSelector } from '@transfer/utils/redux';
import { useProps } from '@transfer/hooks/props';
import { useUnifiedStatus } from '@transfer/hooks/unified';
import { genProcessAccount } from '@transfer/utils/accounts';
import { configMap } from '../config';
import { getInitDirection } from '../constants';

export function useAccounts() {
  const multiAccounts = useTransferSelector((state) => state.multiAccounts);
  const { unifiedHasOpened, isUnifiedMode } = useUnifiedStatus();

  const {
    fieldsDefault: { payAccountType, recAccountType },
    supportAccounts,
    adaptUnified,
  } = useProps();
  const processAccount = useMemo(() => genProcessAccount(adaptUnified, isUnifiedMode), [
    adaptUnified,
    isUnifiedMode,
  ]);
  const INIT_DIRECTION = useMemo(() => getInitDirection(isUnifiedMode), [isUnifiedMode]);

  const accounts = useMemo(
    () =>
      multiAccounts.length
        ? multiAccounts
        : [
            {
              'accountType': processAccount(payAccountType) || INIT_DIRECTION[0],
              'openStatus': true,
            },
            {
              'accountType': processAccount(recAccountType) || INIT_DIRECTION[1],
              'openStatus': true,
            },
          ],
    [multiAccounts, payAccountType, recAccountType, INIT_DIRECTION, processAccount],
  );

  return useMemo(() => {
    return accounts
      .filter((item) => item.openStatus)
      .filter((item) =>
        Array.isArray(supportAccounts) ? supportAccounts.includes(item.accountType) : true,
      )
      .map((item) => configMap[item.accountType])
      .concat({
        ...configMap.MULTI,
        topGap: true,
      })
      .filter((item) => item.isSupport({ unifiedHasOpened }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, unifiedHasOpened]);
}

export function useGetConfigByAccount() {
  const supportAccounts = useAccounts();
  return useCallback((account) => supportAccounts.find((item) => item.account === account), [
    supportAccounts,
  ]);
}
