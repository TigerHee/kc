/**
 * Owner: tiger@kupotech.com
 */
import { EmotionCacheProvider } from '@kux/mui';
import useLang from 'hooks/useLang';

const RootEmotionCacheProvider = ({ children }) => {
  const { isRTL } = useLang();

  return <EmotionCacheProvider isRTL={isRTL}>{children}</EmotionCacheProvider>;
};

export default RootEmotionCacheProvider;
