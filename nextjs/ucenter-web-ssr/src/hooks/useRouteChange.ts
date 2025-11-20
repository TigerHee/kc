import React from 'react';
import { usePathname } from 'next/navigation';
import { getReport } from 'gbiz-next/report';
import getFullURL from '@/tools/getFullURL';
import usePrevious from './usePrevious';

/**
 * 记录页面停留时长
 */
export default () => {
  const pathname = usePathname();
  const prevLocation = usePrevious({ pathname });

  const enterTime = React.useRef<number | null>(null);

  const reportStayTime = React.useCallback(() => {
    if (!enterTime.current) {
      enterTime.current = Date.now();
    } else {
      const stayTime = Date.now() - enterTime.current;
      window.requestIdleCallback(async () => {
        if (prevLocation) {
          (await getReport())?.logStay(getFullURL(prevLocation.pathname), stayTime);
        }
      });
      enterTime.current = null;
    }
  }, [prevLocation]);

  React.useEffect(() => {
    reportStayTime();
  }, [reportStayTime]);

  React.useEffect(() => {
    window.requestIdleCallback(async () => {
      (await getReport())?.logAction(getFullURL(pathname), 'view');
    });
  }, [pathname]);
};
