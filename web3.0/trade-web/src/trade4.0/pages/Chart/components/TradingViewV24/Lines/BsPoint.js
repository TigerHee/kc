/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, memo } from 'react';
import { _t } from 'utils/lang';
import useOrderHistory from '@/pages/Chart/hooks/useOrderHistory';

export default memo(({ tvWidget, order }) => {
  const { createOrderHistory, removeOrderHistory } = useOrderHistory({ tvWidget });

  useEffect(() => {
    createOrderHistory(order);
    return () => {
      removeOrderHistory();
    };
  }, [order, createOrderHistory, removeOrderHistory]);

  return null;
});
