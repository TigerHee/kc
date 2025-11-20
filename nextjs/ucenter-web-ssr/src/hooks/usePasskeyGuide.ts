import { passkeysSupported } from '@/tools/webauthn-json';
import storage from 'gbiz-next/storage';

export const AccountPageOpener = {
  loginSuccess: 'loginSuccess',
  registerSuccess: 'registerSuccess',
};

export const isSupported = passkeysSupported();

export const setAccountPageOpener = (uid, opener) => {
  if (uid) {
    storage.setItem(`${uid}_accountPageOpener`, opener);
  }
};
