/**
 * Owner: eli.xiang@kupotech.com
 */
import { useEffect, useState } from 'react';
import { get } from '@tools/request';

export const getMktStatusByIpCountryApi = (params) => {
  return get('/ucenter/compliance/rules', params);
};

const MktContentStatus = {
  init: 1,
  show: 2,
  hide: 3,
};

let globalMktContentStatus = MktContentStatus.init;

export default function useMktVisible() {
  const [mktContentStatus, setMktContentStatus] = useState(MktContentStatus.init);

  const showMktContent = mktContentStatus === MktContentStatus.show;

  useEffect(() => {
    async function fetchHiddenMktContent() {
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
