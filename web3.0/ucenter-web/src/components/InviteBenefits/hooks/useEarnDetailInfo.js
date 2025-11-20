/**
 * Owner: vijay.zhou@kupotech.com
 * 参考 platform-operation-web: src/components/$/KuRewards/hooks/biz/userNewCustomerTask/useLimitPrize.js: getEarnProductInfo
 *
 */
import { useEffect, useState } from 'react';
import { getEarnInfo } from '../services';

const useEarnDetailInfo = (id) => {
  const [earnInfo, setEarnInfo] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    (async () => {
      try {
        const data = (await getEarnInfo(id)) || {};
        if (data.success) {
          setEarnInfo(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  return earnInfo;
};

export default useEarnDetailInfo;
