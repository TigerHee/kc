/**
 * Owner: solar@kupotech.com
 */
import { useEffect } from 'react';
import EmotionCacheProvider from '@kux/mui/EmotionCacheProvider';
import useRTL from '../../hooks/useRTL';

const RootEmotionCacheProvider = ({ children }) => {
  const isRTL = useRTL();

  useEffect(() => {
    // 改变html的dir
    if (isRTL) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [isRTL]);

  return <EmotionCacheProvider isRTL={isRTL}>{children}</EmotionCacheProvider>;
};

export default RootEmotionCacheProvider;
