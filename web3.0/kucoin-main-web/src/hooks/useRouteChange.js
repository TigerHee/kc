/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { trackClick } from 'utils/ga';
import { useSelector } from 'src/hooks/useSelector';
import usePrevious from './usePrevious';
import getFullURL from 'utils/getFullURL';
import { checkVersionReload } from 'services/version';
import { tenantConfig } from 'config/tenant';
import { socketBlockUrlList } from '@/constants';

export default () => {
  const location = useLocation();
  const prevLocation = usePrevious(location);

  const enterTime = React.useRef(null);
  const user = useSelector((state) => state.user.user);

  const reportStayTime = React.useCallback(() => {
    if (!enterTime.current) {
      enterTime.current = Date.now();
    } else {
      const stayTime = Date.now() - enterTime.current;
      window.requestIdleCallback(() => {
        import('tools/ext/kc-report').then(({ default: Report }) => {
          Report.logStay(getFullURL(prevLocation.pathname), stayTime);
        });
      });
      enterTime.current = null;
    }
  }, [prevLocation]);

  React.useEffect(() => {
    reportStayTime();
  }, [reportStayTime]);

  React.useEffect(() => {
    checkVersionReload();
    window.scrollTo(0, 0);
  }, [location]);

  React.useEffect(() => {
    window.requestIdleCallback(() => {
      if (user?.isSub) {
        trackClick(['subAccountView', '1']);
      }
      import('tools/ext/kc-report').then(({ default: Report }) => {
        Report.logAction(getFullURL(location.pathname), 'view');
      });
    });
  }, [location.pathname, user?.isSub]);

  const { uid, csrf } = user || {};

  React.useEffect(() => {
    let kmSocket;
    import('src/utils/socket').then(({ kcWs, kumexWs }) => {
      kmSocket = kumexWs;
      const host = `${window.location.origin}/_api`;
      // url是否屏蔽整体socket
      const urlIsNotBlock = !!socketBlockUrlList.find((i) => !window.location.pathname.match(i));
      if (urlIsNotBlock) {
        kcWs.connect({
          csrf,
          uid,
          host,
        });
        if (!tenantConfig.futuresSocketBlock) {
          kumexWs.connect({
            csrf,
            uid,
            host,
          });
        }
      }

      // 私有订阅
      if (uid && csrf) {
        kumexWs.subscribe('/contractAccount/wallet', undefined, true);
      }
    });
    // 解除订阅
    return () => {
      if (kmSocket) {
        kmSocket.unsubscribe('/contractAccount/wallet', undefined, true);
      }
    };
  }, [uid, csrf]);
};
