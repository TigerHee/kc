/**
 * Owner: vijay.zhou@kupotech.com
 * kyc/kyb 开始认证前的缓存
 */
import { useSnackbar } from '@kux/mui';
import { useState } from 'react';
import { getTempValue, postTempValue } from 'src/services/kyc';

const CACHE_TEMP_KEY = 'SELECT_KYC_KYB_INFO';

const INIT_VALUE = { region: null, identityType: null, userState: null, type: null };

export default () => {
  const [cache, setCache] = useState(INIT_VALUE);
  const { message } = useSnackbar();

  const pullCache = async () => {
    try {
      const res = await getTempValue({ tempKey: CACHE_TEMP_KEY });
      if (!res.success) throw res;
      const { region, identityType, userState, type } = JSON.parse(res.data || '{}');
      const newCache = {
        region,
        identityType,
        userState,
        type,
      };
      setCache(newCache);
      return newCache;
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
      return INIT_VALUE;
    }
  };

  const postCache = async (value) => {
    const { region, identityType, userState, type } = value;
    try {
      await postTempValue({
        tempKey: CACHE_TEMP_KEY,
        tempValue: JSON.stringify({ region, identityType, userState, type }),
      });
      setCache({ region, identityType, userState, type });
      return true;
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
      return false;
    }
  };

  return [cache, pullCache, postCache];
};
