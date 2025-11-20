/**
 * Owner: willen@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import storage from '@utils/storage';
import { useState } from 'react';

// 此hooks用于获取国家code
const useIpCountryCode = () => {
  // 初始化国家code
  const [countryCode, setCountryCode] = useState(storage.getItem('ip_country_code'));

  // 监听获取国家code事件
  remoteEvent.on(remoteEvent.evts.GET_IP_COUNTRY_CODE, (data) => {
    setCountryCode(data);
  });

  return countryCode;
};

export default useIpCountryCode;
