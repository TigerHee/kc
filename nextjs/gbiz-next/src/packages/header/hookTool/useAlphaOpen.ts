/*
 * @owner: borden@kupotech.com
 */
import { useEffect, useState } from 'react';
import { isBoolean } from 'lodash';
import { kucoinv2Storage } from 'tools/storage';
import { getAlphaOpenFlag } from '../Header/service';

// alpha是否开通的storage key
const ALPHA_OPEN_KEY = 'alpha_is_open';
let defaultIsAlphaOpen: any;

export default function useAlphaOpen(uid: any) {
  const [isAlphaOpen, setIsAlphaOpen] = useState(() => {
    const storageData = kucoinv2Storage.getItem(ALPHA_OPEN_KEY)?.[uid];
    if (storageData === true) defaultIsAlphaOpen = true;
    return isBoolean(storageData) ? storageData : defaultIsAlphaOpen;
  });

  useEffect(() => {
    if (!isBoolean(defaultIsAlphaOpen)) {
      getAlphaOpenFlag().then(({ data }) => {
        defaultIsAlphaOpen = Boolean(data);
        setIsAlphaOpen(defaultIsAlphaOpen);
      });
    }
  }, []);

  return isAlphaOpen;
}
