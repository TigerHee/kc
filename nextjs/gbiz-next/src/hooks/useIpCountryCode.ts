import storage from 'tools/storage';
import { useEffect, useState } from 'react';
import remoteEvent from 'tools/remoteEvent';

// 此hooks用于获取国家code
const useIpCountryCode = () => {
  // 初始化国家code
  const [countryCode, setCountryCode] = useState(null);

  useEffect(() => {
    const storageCode = storage.getItem('ip_country_code');
    setCountryCode(storageCode);
  }, [])

  remoteEvent.on(remoteEvent.evts.GET_IP_COUNTRY_CODE, (data) => {
    setCountryCode(data);
  });

  return countryCode;
};

export default useIpCountryCode;
