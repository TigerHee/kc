/**
 * Owner: eli.xiang@kupotech.com
 */
import { useCallback, useEffect, useState } from 'react';
import { getPasskeyListApi } from 'services/ucenter/passkey';
import { COMMON_FETCH_STATUS } from 'src/constants';

export default function usePasskeyList() {
  const [passkeyList, setPasskeyList] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(COMMON_FETCH_STATUS.init);

  const updatePasskeyList = useCallback(async () => {
    try {
      setFetchStatus(COMMON_FETCH_STATUS.fetching);
      const passkeyListRes = await getPasskeyListApi();
      if (Array.isArray(passkeyListRes?.data)) {
        setPasskeyList(passkeyListRes.data);
        setFetchStatus(COMMON_FETCH_STATUS.success);
      } else {
        setFetchStatus(COMMON_FETCH_STATUS.error);
      }
    } catch (error) {
      setFetchStatus(COMMON_FETCH_STATUS.error);
      console.log('updatePasskeyList error:', error);
    }
  }, []);

  useEffect(() => {
    if (fetchStatus === COMMON_FETCH_STATUS.init) {
      updatePasskeyList();
    }
  }, [fetchStatus, updatePasskeyList]);

  return {
    passkeyList,
    fetchStatus,
    updatePasskeyList,
  };
}
