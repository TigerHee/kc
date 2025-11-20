/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { isRTLLanguage } from 'config';

export default function useRTL() {
  const currentLang = useSelector(state => state.app.currentLang);

  const isRTL = React.useMemo(() => {
    return isRTLLanguage(currentLang);
  }, [currentLang]);

  return isRTL;
}