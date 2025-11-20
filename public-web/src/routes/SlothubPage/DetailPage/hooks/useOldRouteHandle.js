/**
 * Owner: larvide.peng@kupotech.com
 */

import history from '@kucoin-base/history';
import useRequest from 'hooks/useRequest';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { convertProjectIdToCurrency } from 'src/services/slothub';

/**
 * url优化需求
 * @see https://k-devdoc.atlassian.net/browse/TOBC-10043
 */
export default function useOldRouteHandle() {
  const { pathname } = useLocation();
  const detailId = pathname.split('/').pop();
  const isNewUrl = pathname.startsWith('/gemslot/detail/code/');
  const { run } = useRequest(() => convertProjectIdToCurrency(detailId), {
    refreshOnWindowFocus: true,
    manual: true,
    onSuccess: ({ success, data }) => {
      if (!success) return;
      if (!isNewUrl) {
        history.push(`/gemslot/detail/code/${data}`);
      }
    },
  });

  useEffect(() => {
    if (!isNewUrl) {
      run();
    }
  }, [isNewUrl, run]);
}
