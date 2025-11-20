/**
 * Owner: eli.xiang@kupotech.com
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { COMMON_FETCH_STATUS } from 'src/constants';
import usePasskeyList from 'src/hooks/usePasskeyList';
import storage from 'utils/storage';
import { passkeysSupported } from 'utils/webauthn-json';

export const AccountPageOpener = {
  loginSuccess: 'loginSuccess',
  registerSuccess: 'registerSuccess',
};

const FetchedStatus = [COMMON_FETCH_STATUS.success, COMMON_FETCH_STATUS.error];

const isSupported = passkeysSupported();
export const setAccountPageOpener = (uid, opener) => {
  if (uid) {
    storage.setItem(`${uid}_accountPageOpener`, opener);
  }
};

export default function usePasskeyGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const { uid = '' } = useSelector((state) => state?.user?.user) || {};

  const { fetchStatus, passkeyList } = usePasskeyList();

  const isEmptyPasskeyList = useMemo(() => {
    return FetchedStatus.includes(fetchStatus) && !passkeyList.length;
  }, [fetchStatus, passkeyList.length]);

  const hiddenPasskeyGuide = useCallback(() => {
    setShowGuide(false);
  }, []);

  useEffect(() => {
    const passkeyGuided = storage.getItem(`${uid}_passkeyGuided`);
    const accountPageOpener = storage.getItem(`${uid}_accountPageOpener`);
    const isFromPasskeyGuideOpener = Object.values(AccountPageOpener).includes(accountPageOpener);
    if (isSupported && isFromPasskeyGuideOpener && !passkeyGuided && isEmptyPasskeyList) {
      setShowGuide(true);
      storage.setItem(`${uid}_passkeyGuided`, true);
    }
    if (isFromPasskeyGuideOpener && FetchedStatus.includes(fetchStatus)) {
      storage.removeItem(`${uid}_accountPageOpener`);
    }
  }, [isEmptyPasskeyList, uid, fetchStatus]);

  return {
    showGuide,
    hiddenPasskeyGuide,
  };
}
