/*
 * @owner: borden@kupotech.com
 */
import tdkManager from '@kc/tdk';
import { useEffect } from 'react';
import { useSelector } from 'dva';
import { useLocation } from 'react-router-dom';

export default function useTdk() {
  const { pathname } = useLocation();
  const currentLang = useSelector((state) => state.app.currentLang);

  useEffect(() => {
    tdkManager(currentLang);
  }, [pathname, currentLang]);
}
