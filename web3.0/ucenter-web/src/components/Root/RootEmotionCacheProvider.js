/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider } from '@kux/mui';

const RootEmotionCacheProvider = ({ children }) => {
  const { isRTL } = useLocale();
  return <EmotionCacheProvider isRTL={isRTL}>{children}</EmotionCacheProvider>;
};

export default RootEmotionCacheProvider;
