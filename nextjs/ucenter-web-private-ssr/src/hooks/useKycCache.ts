/**
 * Owner: vijay.zhou@kupotech.com
 * kyc/kyb 开始认证前的缓存
 */
import { toast } from '@kux/design';
import { useState } from 'react';
import { getTempValue, postTempValue } from 'src/services/kyc';

const CACHE_TEMP_KEY = 'SELECT_KYC_KYB_INFO';

interface ICacheValue {
  region?: string | null;
  identityType?: string | null;
  userState?: string | null;
  type?: number | null;
}

const INIT_VALUE: ICacheValue = { region: null, identityType: null, userState: null, type: null };

export default () => {
  const [cache, setCache] = useState<ICacheValue>(INIT_VALUE);

  const pullCache = async (): Promise<ICacheValue> => {
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
    } catch (error: any) {
      console.error(error);
      toast.error(error?.msg || error?.message);
      return INIT_VALUE;
    }
  };

  const postCache = async (value: ICacheValue) => {
    const { region, identityType, userState, type } = value;
    try {
      await postTempValue({
        tempKey: CACHE_TEMP_KEY,
        tempValue: JSON.stringify({ region, identityType, userState, type }),
      });
      setCache({ region, identityType, userState, type });
      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(error?.msg || error?.message);
      return false;
    }
  };

  return [cache, pullCache, postCache] as [ICacheValue, () => Promise<ICacheValue>, (value: ICacheValue) => Promise<boolean>];
};
