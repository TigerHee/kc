/**
 * Owner: eli.xiang@kupotech.com
 */
import { useEffect, useState } from 'react';
import { pull } from 'tools/request';

interface MktStatusResponse {
  data?: {
    signUpGuide?: boolean;
  };
}
export const getMktStatusByIpCountryApi = (params?: any): Promise<MktStatusResponse> => {
  return pull('/ucenter/compliance/rules', params);
};

const MktContentStatus = {
  init: 1,
  show: 2,
  hide: 3,
} as const;

type MktContentStatusType = typeof MktContentStatus[keyof typeof MktContentStatus];

let globalMktContentStatus: MktContentStatusType = MktContentStatus.init;

interface UseMktVisibleReturn {
  showMktContent: boolean;
}

export default function useMktVisible(): UseMktVisibleReturn {
  const [mktContentStatus, setMktContentStatus] = useState<MktContentStatusType>(MktContentStatus.init);

  const showMktContent = mktContentStatus === MktContentStatus.show;

  useEffect(() => {
    async function fetchHiddenMktContent(): Promise<void> {
      try {
        const res = await getMktStatusByIpCountryApi();
        if (res?.data?.signUpGuide) {
          setMktContentStatus(MktContentStatus.show);
          globalMktContentStatus = MktContentStatus.show;
        } else {
          setMktContentStatus(MktContentStatus.hide);
          globalMktContentStatus = MktContentStatus.hide;
        }
      } catch (error) {
        console.error('fetchMktByIpCountryStatus failed:', error);
      }
    }
    if (globalMktContentStatus === MktContentStatus.init) {
      fetchHiddenMktContent();
    } else {
      setMktContentStatus(globalMktContentStatus);
    }
  }, []);

  return {
    showMktContent,
  };
}
