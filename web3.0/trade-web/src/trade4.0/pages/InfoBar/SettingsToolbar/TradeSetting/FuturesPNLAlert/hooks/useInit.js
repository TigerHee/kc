/**
 * Owner: clyne@kupotech.com
 */
import { useEffect } from 'react';
import { usePnlAlertFunc } from './usePnlAlert';

export const useInit = () => {
  const { getPnlAlertList } = usePnlAlertFunc();
  useEffect(() => {
    // 拉列表
    getPnlAlertList();
  }, [getPnlAlertList]);
};
