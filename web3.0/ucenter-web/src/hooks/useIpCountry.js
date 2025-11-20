/**
 * Owner: brick.fan@kupotech.com
 */

import { useIpCountryCode } from '@kucoin-biz/hooks';
import { useMemo } from 'react';

const useIpCountry = () => {
  const countryCode = useIpCountryCode();
  const userIpCountry = useMemo(() => {
    return {
      isGB: countryCode === 'GB', // 用户ip是英国
      isIN: countryCode === 'IN', // 用户ip印度
      isNoCountry: !countryCode, // 用户ip未获取到国家
      isGBOrNoCountry: countryCode === 'GB' || !countryCode, // 用户ip是英国 或者 未获取到国家
    };
  }, [countryCode]);
  return userIpCountry;
};

export default useIpCountry;
