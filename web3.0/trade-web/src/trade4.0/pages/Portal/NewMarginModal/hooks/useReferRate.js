/*
 * @owner: borden@kupotech.com
 */
import { useMemo } from 'react';
import useRequest from '@/hooks/common/useRequest';
import { floadToPercent } from 'src/helper';
import { queryReferRate } from 'src/services/margin';


export default function useReferRate({ currency, showReferRate }) {
  const { data: res } = useRequest(
    () => queryReferRate({ currency }),
    {
      refreshDeps: [currency],
      staleTime: 3 * 60 * 1000, // 3mins
      cacheKey: `referRate_${currency}`,
      ready: Boolean(currency && showReferRate),
    },
  );

  return useMemo(() => {
    return res?.data?.referRate ? floadToPercent(res.data.referRate) : '-%';
  }, [res]);
}
