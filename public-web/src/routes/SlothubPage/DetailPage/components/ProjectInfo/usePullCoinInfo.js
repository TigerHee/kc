/*
 * @Date: 2024-06-17 15:37:13
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 10:47:32
 */
import { useEffect } from 'react';
import useRequest from 'src/hooks/useRequest';
import { getCoinInfo } from 'src/services/coinDetail';

export const usePullCoinInfo = ({ coin }) => {
  const { data, run } = useRequest(() => getCoinInfo({ coin }), {
    cacheKey: ['slothubDetail', 'coin-info', coin],
    manual: true,
  });

  useEffect(() => {
    if (!coin) return;
    run();
  }, [coin, run]);

  return { coinInfo: data?.data || {} };
};
